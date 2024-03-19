import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

export default function App() {
  const [result, setResult] = useState();
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ["text/csv", "text/plain", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    // Check if file type is supported
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      toast.error("Unsupported file type!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      event.target.value = ""; // Clear file input
    } else if (selectedFile && selectedFile.size > 100 * 1024 * 1024) { // Check if file size is greater than 100MB
      toast.error("File size exceeds 100MB limit!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      event.target.value = ""; // Clear file input
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }

    setLoading(true); // Set loading state to true

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setResult(data.result);
        // Trigger success notification
        toast.success("File uploaded successfully!", {
          position: "top-right",
          autoClose: 3000, // Notification will close after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error("Error", error);
        // Trigger error notification if there's an error
        toast.error("Error uploading file!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after response is received
      });
  };

  return (
    <div className="appBlock">
      <form onSubmit={handleSubmit} className="form">
        <label className="questionLabel" htmlFor="question">
          Question:
        </label>
        <input
          className="questionInput"
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
          autoComplete="off"
        />

        <br></br>
        <label className="fileLabel" htmlFor="file">
          Upload CSV, PDF, TXT or DOCX file:
        </label>

        <input
          type="file"
          id="file"
          name="file"
          accept=".csv, .txt, .pdf, .docx"
          onChange={handleFileChange}
          className="fileInput"
        />
        <br></br>
        <button
          className="submitBtn"
          type="submit"
          disabled={!file || !question || loading} // Disable button when loading
        >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      <p className="resultOutput">Result: {result}</p>
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </div>
  );
}