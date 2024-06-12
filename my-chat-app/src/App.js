// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import PDFUploader from './PDFUploader';
import ChatInterface from './ChatInterface';

function App() {
  const [pdfFiles, setPdfFiles] = useState([]);

  const handlePDFUpload = (files) => {
    setPdfFiles(files);
  };

  const navigate = useNavigate();

  const handleChatPage = () => {
    navigate('/chat', { state: { pdfFiles } });
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PDFUploader onUpload={handlePDFUpload} onProceed={handleChatPage} />} />
        <Route path="/chat" element={<ChatInterface pdfFiles={pdfFiles} />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
