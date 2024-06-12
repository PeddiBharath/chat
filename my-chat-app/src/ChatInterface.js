import React, { useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './ChatInterface.css';

function ChatInterface({ pdfFiles }) {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSpeechRecognition = () => {
    SpeechRecognition.startListening();
  };

  const handleSubmit = async () => {
    const newEntry = { type: 'question', content: query || transcript };
    setChatHistory([...chatHistory, newEntry]);

    try {
      const response = await axios.post('http://localhost:5000/ask', { question: query || transcript, pdfFiles });
      const answerEntry = { type: 'answer', content: response.data.answer };
      setChatHistory([...chatHistory, answerEntry]);
    } catch (error) {
      console.error("Error asking question:", error);
    }
    setQuery('');
    resetTranscript();
  };

  return (
    <div className="chat-interface">
      <h2>Chat with PDF 💬</h2>
      <div className="chat-box">
        {chatHistory.map((entry, index) => (
          <div key={index} className={`chat-entry ${entry.type}`}>
            <p>{entry.content}</p>
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Ask questions about your PDF files..."
          value={query}
          onChange={handleChange}
        />
        <button onClick={handleSpeechRecognition}>Start Speech</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default ChatInterface;
