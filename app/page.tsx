"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function handleAsk() {
    if (!question) {
      setAnswer("Please type a question first.");
      return;
    }

    // Temporary fake answer (samajhne ke liye)
    setAnswer("🤖 AI answer will appear here...");
  }

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>
      <h1>Ask Me Anything 🤖</h1>

      <textarea
        placeholder="Type your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "100%",
          height: 100,
          padding: 10,
          marginTop: 10,
        }}
      />

      <button
        onClick={handleAsk}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Ask AI
      </button>

      {answer && (
        <p style={{ marginTop: 20, fontWeight: "bold" }}>
          {answer}
        </p>
      )}
    </main>
  );
}

