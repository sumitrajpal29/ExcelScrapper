import React, { useState, useEffect } from "react";
import axios from "axios";
import DataComponent from "./components/DataComponent";
import "./App.css";
import saveAS from "file-saver";
// import NavbarComponent from "./components/NavbarComponent";
import EditComponent from "./components/EditComponent";
import UploadComponent from "./components/UploadComponent";
import TrashComponent from "./components/TrashComponent";
import MainTable from "./components/MainTable";

function App() {
  const [data, setData] = useState([]);
  const [projectIdFilter, setProjectIdFilter] = useState("");
  const [billabilityFilter, setBillabilityFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [view, setView] = useState("home");

  const handleSave = (updatedData) => {
    // Make the update request to the server using axios
    axios
      .put(`http://localhost:8000/update/${updatedData.empId}`, updatedData)
      .then((res) => {
        console.log(res.data);
        setSelectedEmployee(null);
        fetchData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get", {
        params: {
          projectId: projectIdFilter,
          billability: billabilityFilter,
          grade: gradeFilter,
        },
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
    const excludedFields = ["_id", "__v"];
    const filteredData = data.map((item) => {
      const filteredItem = { ...item };
      excludedFields.forEach((field) => delete filteredItem[field]);
      return filteredItem;
    });

    // Get the column headings from the first item in the data
    const columnHeadings = Object.keys(filteredData[0]);
    // const csvData = filteredData.map(item => Object.values(item).join(',')).join('\n');
    const csvData = [
      columnHeadings.join(","),
      ...filteredData.map((item) =>
        columnHeadings.map((heading) => item[heading]).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

    saveAS(blob, "data.csv");
  };

  return (
    <div className="container">
      <div className="navbar">
        <ul>
          <h1>ExcelScrapper</h1>
        </ul>

        <ul>
          <li>
            <button onClick={() => setView("home")}>Home</button>
          </li>

          <li>
            <button onClick={() => setView("upload")}>Upload</button>
          </li>

          <li>
            <button onClick={() => setView("trash")}>Trash</button>
          </li>
          <li>
            <button onClick={() => setView("summary")}>Summary</button>
          </li>
        </ul>
      </div>

      {/* upload view*/}
      {view === "upload" && (
        <UploadComponent refresh={fetchData} setView={setView} />
      )}

      {/* Home view*/}
      {view === "home" && (
        <div>
          {/* Filters */}
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

          {/* Data component */}
          <DataComponent
            className="container"
            data={data}
            selectEmployee={setSelectedEmployee}
            refresh={fetchData}
          />

          {/* Edit component */}
          {selectedEmployee && (
            <EditComponent
              empId={selectedEmployee.empId}
              name={selectedEmployee.name}
              projectId={selectedEmployee.projectId}
              grade={selectedEmployee.grade}
              billability={selectedEmployee.billability}
              onSave={handleSave}
              onCancel={() => setSelectedEmployee(null)}
            />
          )}
        </div>
      )}
      {/* End of home view*/}

      {/* trash view */}
      {view === "trash" && <TrashComponent refresh={fetchData} />}

      {/*Summary table*/}
      {view === "summary" && <MainTable selectEmployee={selectedEmployee} />}
    </div>
  );
}

export default App;
