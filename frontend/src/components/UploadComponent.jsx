import React from 'react';
import axios from 'axios';
import { useState } from 'react';

export default function UploadComponent({ fetchData }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios
        .post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          console.log(res.data);
          setSelectedFile(null);
          fetchData();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};