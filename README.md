# Chatbot Application

This is a chatbot application that asks users fun and interactive questions about cats. It uses a **React** frontend, an **Express.js** backend, and **MongoDB** for data storage. The application integrates with the OpenAI API to generate cat-related questions and stores user responses for each session.

## Features

- **Interactive Chat Interface**: Users can chat with the bot, answer questions, and receive new questions in real-time.
- **Session Management**: Each user session is tracked and stored in MongoDB, along with the questions asked and the answers provided.
- **Question Generation**: The bot uses the OpenAI API to generate a unique set of questions. If the API quota is exhausted, fallback questions are used.
- **Responsive UI**: The chat interface adjusts to different screen sizes and provides a smooth user experience.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or on a cloud service like MongoDB Atlas)
- OpenAI API Key (for generating questions via OpenAI GPT-3.5-turbo model)

## Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/ahmetustel/chatbot.git
cd chatbot
```

### 2. Install the dependencies:

```bash
cd api
yarn install
cd ..
cd frontend
yarn install
```

### 3. Set up environment variables:

MONGODB_URI=mongodb://127.0.0.1:27017/chatbotdb
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORGANIZATION=your_organization
OPENAI_PROJECT=your_project

### 4. Start the server

In the root directory, first run mongodb locally (for me <brew services start mongodb-community@6.0>) and then run the following command to start the Express server:
nodemon
This will launch the backend server on http://localhost:5001.

### 5. Run the React frontend

Navigate to frontend directory (frontend) and start the development server
yarn dev
This will run the frontend on http://localhost:3000.

## API Endpoints
POST /api/start

Starts a new chatbot session.
Calls the OpenAI API to generate a list of questions, or falls back to predefined questions.
Returns the first question and the session ID.

Example request:

```bash
POST http://localhost:5001/api/start
```

Example response:

```bash
json

{
  "status": "Session started",
  "nextQuestion": "What is your favorite breed of cat, and why?",
  "sessionId": "abc123",
  "questions": ["Question 1", "Question 2", "Question 3"]
}
```

POST /api/answers

Saves the user’s answer to the current question.
Returns the next question or ends the session if no more questions are available.

Example request:

```bash

POST http://localhost:5001/api/answers
{
  "answer": "British Shorthair",
  "sessionId": "abc123"
}
```

Example response:

```bash
json

{
  "status": "Answer saved",
  "nextQuestion": "How do you think cats communicate with their owners?"
}
```

## Code Structure

Frontend (React)

App.js: Contains the main chatbot component that renders the chat interface, handles user input, and communicates with the backend API.

Backend (Express)

server.js: Sets up the Express server, connects to MongoDB, and defines API routes for starting sessions and handling user answers.
Session Model: Mongoose model that stores session data, including session ID, questions, answers, and timestamps for session start and end.

## Error Handling

If the OpenAI API fails due to quota limits or other issues, the backend automatically falls back to a predefined set of cat-related questions.
API errors and MongoDB connection issues are logged in the console for debugging purposes.

## Future Enhancements

Add more question categories (e.g., dog-related or random trivia questions).
Implement authentication to allow users to personalize their sessions.
Add session persistence, allowing users to resume an interrupted session.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
