const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");

require("dotenv").config();
const config = require("./config");

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: config.openAI.API_KEY,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => console.error("MongoDB connection error:", err));

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  questions: [String],
  answers: [String],
  startTime: Date,
  endTime: Date,
});

const Session = mongoose.model("Session", sessionSchema);

const fallbackQuestions = [
  "What is your favorite breed of cat, and why?",
  "How do you think cats communicate with their owners?",
  "Have you ever owned a cat? If so, what was their name and personality like?",
  "Why do you think cats love to sleep in small, cozy places?",
  "What’s the funniest or strangest behavior you’ve ever seen a cat do?",
  "Do you prefer cats or kittens, and what’s the reason for your preference?",
  "Why do you think cats are known for being independent animals?",
  "How do you think cats manage to land on their feet when they fall?",
  "What’s your favorite fact or myth about cats?",
  "How would you describe the relationship between humans and cats in three words?",
];

app.post("/api/start", async (req, res) => {
  let questions;

  try {
    // Attempt to call OpenAI API
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Generate 10 unique questions about cats." },
      ],
    });

    questions = openAIResponse.choices[0].message.content
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    console.error("OpenAI error: ", error);
    // Check for insufficient quota error and fallback to predefined questions
    if (error.code === "insufficient_quota") {
      questions = fallbackQuestions;
    } else {
      return res.status(500).send({ error: "Failed to generate questions" });
    }
  }

  const newSession = new Session({
    sessionId: req.sessionID,
    questions: questions,
    answers: [],
    startTime: new Date(),
  });

  await newSession.save();
  res.send({
    status: "Session started",
    nextQuestion: questions[0],
    sessionId: req.sessionID,
    questions,
  });
});

app.post("/api/answers", async (req, res) => {
  const { answer, sessionId } = req.body;
  const session = await Session.findOne({ sessionId: sessionId });
  if (!session) {
    return res.status(404).send({ error: "Session not found" });
  }

  const currentQuestionIndex = session.answers.length;
  session.answers.push(answer);

  const nextQuestion = session.questions[currentQuestionIndex + 1];
  if (!nextQuestion) {
    session.endTime = new Date();
    await session.save();
    return res.send({ status: "Session ended", nextQuestion: null });
  } else {
    await session.save();
    return res.send({ status: "Answer saved", nextQuestion });
  }
});

app.listen(5001, () => console.log("Backend running on port 5001"));
