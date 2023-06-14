import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataComponent from './components/DataComponent';
import './App.css';
import saveAS from 'file-saver';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import UploadComponent from  './components/UploadComponent';

function App() {
  const [data, setData] = useState([]);
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [billabilityFilter, setBillabilityFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [view, setView] = useState('UploadComponent');

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


  const handleDownload = () => {

    // Check if data is empty
    if (data.length === 0) {
      alert("No data to Download !");
      return;
    }

    // Exclude the MongoDB ID and __v fields from the data
    const excludedFields = ['_id', '__v'];
    const filteredData = data.map(item => {
      const filteredItem = { ...item };
      excludedFields.forEach(field => delete filteredItem[field]);
      return filteredItem;
    });

    // Get the column headings from the first item in the data
    const columnHeadings = Object.keys(filteredData[0]);
    // const csvData = filteredData.map(item => Object.values(item).join(',')).join('\n');
    const csvData = [
      columnHeadings.join(','),
      ...filteredData.map(item => columnHeadings.map(heading => item[heading]).join(','))
    ].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

    saveAS(blob, 'data.csv');
  };



  return (
    <div className="container">
      <NavbarComponent />
      {(view === 'UploadComponent') && <UploadComponent fetchData={fetchData} setView={setView} />}
    < div className = "filters" >
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

  {/* I think  Button is not usefull here */ }
  {/* <button className="filter-button" onClick={handleFilter}>
          Filter
        </button> */}

      </div >
    <DataComponent className='container' data={data} setEditVisible={setIsEditVisible} />
    </div >
  );
}

export default App;
