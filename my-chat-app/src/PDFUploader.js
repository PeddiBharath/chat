// PDFUploader.js
import React from 'react';

function PDFUploader({ onUpload, onProceed }) {
  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    onUpload(files);
  };

  return (
    <div className="pdf-uploader">
      <h2>Upload PDFs</h2>
      <input type="file" multiple onChange={handleUpload} />
      <button onClick={onProceed} disabled={!onUpload}>Proceed to Chat</button>
    </div>
  );
}

export default PDFUploader;
