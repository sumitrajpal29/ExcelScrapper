import React from "react";
import axios from "axios";
import "./UploadComponent.css";
import { useState } from "react";

export default function UploadComponent({ refresh, setView }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      axios
        .post("http://localhost:8000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          setSelectedFile(null);
          refresh();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Upload Excel File</h2>

      <div className="content">
        <form className="form-data">
          <input
            className="input-field"
            type="file"
            onChange={handleFileChange}
          />
          <br />
          <button className="upload-button" onClick={handleUpload}>
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
