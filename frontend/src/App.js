import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataComponent from './components/DataComponent';
import './App.css';
import saveAS from 'file-saver';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState([]);
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [billabilityFilter, setBillabilityFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get', {
        params: {
          projectId: projectIdFilter,
          billability: billabilityFilter,
          grade: gradeFilter
        }
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectIdFilter, billabilityFilter, gradeFilter]);

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

  const handleDownload = () => {

    if (data.length == 0) {
      alert("No data to Download !");
      return;
    }

    const csvData = data.map(item => Object.values(item).join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

    saveAS(blob, 'data.csv');
  };

  const handleFilter = () => {
    fetchData();
  };

  return (
    <div className="container">
      <input type="file" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>
      <div className="filters">
        <label className="filter-label">
          Project ID<span> </span>
          <input
            className="filter-input"
            type="text"
            value={projectIdFilter}
            onChange={(e) => setProjectIdFilter(e.target.value)}
          />
        </label>

        <label className="filter-label">
          Billability<span> </span>
          <input
            className="filter-input"
            type="text"
            onChange={(e) => setBillabilityFilter(e.target.value)}
          />
        </label>

        <label className="filter-label">
          Grade<span> </span>
          <input
            className="filter-input"
            type="text"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          />
        </label>
        <button className="upload-button" onClick={handleDownload}>
          Download
        </button>

        {/* I think  Button is not usefull here */}
        {/* <button className="filter-button" onClick={handleFilter}>
          Filter
        </button> */}

      </div>
      <DataComponent className='container' data={data} />
    </div>
  );
}

export default App;
