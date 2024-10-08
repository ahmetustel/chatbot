import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSessionOver, setIsSessionOver] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    axios
      .post("http://localhost:5001/api/start")
      .then((response) => {
        setSessionId(response.data.sessionId);
        setCurrentQuestion(response.data.nextQuestion);
        setMessages([{ text: response.data.nextQuestion, isBot: true }]);
      })
      .catch((error) => console.error("api start error: ", error));
  }, []);

  const handleAnswer = (answer) => {
    if (!answer) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: answer, isBot: false },
    ]);

    axios
      .post("http://localhost:5001/api/answers", {
        answer,
        sessionId: sessionId,
      })
      .then((response) => {
        const nextQuestion = response.data.nextQuestion;

        if (!nextQuestion) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Welcome to Bolt Insight", isBot: true },
          ]);
          setIsSessionOver(true);
        } else {
          setCurrentQuestion(nextQuestion);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: nextQuestion, isBot: true },
          ]);
        }
      })
      .catch((error) => console.error("api answer error: ", error));
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        border: "2px solid #4caf50",
        borderRadius: "10px",
        backgroundColor: "#1b1b1b",
        color: "#4caf50",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.isBot ? "flex-end" : "flex-start",
              backgroundColor: msg.isBot ? "#4caf50" : "#333",
              color: msg.isBot ? "#000" : "#4caf50",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "80%",
              wordWrap: "break-word",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div style={{ padding: "10px" }}>
        {currentQuestion && !isSessionOver && (
          <input
            type="text"
            placeholder="Your answer..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAnswer(e.target.value);
                e.target.value = "";
              }
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #4caf50",
              backgroundColor: "#333",
              color: "#4caf50",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Chatbot;
