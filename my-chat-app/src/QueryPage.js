import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

function QueryPage() {
  const location = useLocation();
  const { pdfFiles } = location.state; // Get the uploaded PDF files
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSpeechRecognition = () => {
    SpeechRecognition.startListening();
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/ask', { question: query || transcript, pdfFiles });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
    }
    setQuery('');
    resetTranscript();
  };

  return (
    <div className="query-page">
      <h2>Query and Answers</h2>
      <input
        type="text"
        placeholder="Ask questions about your PDF files..."
        value={query || transcript} // Use transcript if query is empty
        onChange={handleChange}
    />
      <button onClick={handleSpeechRecognition}>Start Speech</button>
      <button onClick={handleSubmit}>Submit</button>
      {answer && <p>{answer}</p>}
    </div>
  );
}

export default QueryPage;
