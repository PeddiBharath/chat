// Sidebar.js
import React from 'react';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>ℹ️ About</h2>
      <p>This app is an LLM-powered chatbot built using:</p>
      <ul>
        <li><a href="https://streamlit.io/">Streamlit</a></li>
        <li><a href="https://python.langchain.com/">LangChain</a></li>
        <li><a href="https://platform.openai.com/docs/models">OpenAI LLM model</a></li>
      </ul>
      <p>Made with ❤️ by <a href="https://youtube.com/@engineerprompt">Prompt Engineer</a></p>
    </div>
  );
}

export default Sidebar;
