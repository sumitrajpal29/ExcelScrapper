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
import SummaryComponent from "./components/SummaryComponent";

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [view, setView] = useState("summary");
  const [sortValue, setSortValue] = useState({ empId: 1 });
  const [showTable, setShowTable] = useState(true);

  const handleSave = (updatedEmp) => {
    // Make the update request to the server using axios
    axios
      .put(`http://localhost:8000/update/${updatedEmp.empId}`, updatedEmp)
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
        params: { filters, sortValue },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, sortValue]);

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
      <div className="navbar" style={{ display: !showTable && "none" }}>
        <ul>
          <h1>ExcelScrapper</h1>
        </ul>

        <ul>
          <li>
            <button onClick={() => setView("summary")}>Home</button>
          </li>
          <li>
            <button onClick={() => setView("upload")}>Upload</button>
          </li>

          <li>
            <button onClick={() => setView("trash")}>Trash</button>
          </li>

          <li>
            <button onClick={() => setView("home")}>Show All</button>
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
                value={filters.projectId}
                onChange={(e) =>
                  setFilters({ ...filters, projectId: e.target.value })
                }
              />
            </label>

            <label className="filter-label">
              Manager Name<span> </span>
              <input
                className="filter-input"
                type="text"
                value={filters.managerName}
                onChange={(e) =>
                  setFilters({ ...filters, managerName: e.target.value })
                }
              />
            </label>
            <label className="filter-label">
              Grade<span> </span>
              <input
                className="filter-input"
                type="text"
                value={filters.grade}
                onChange={(e) =>
                  setFilters({ ...filters, grade: e.target.value })
                }
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
            setSortValue={setSortValue}
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
      {view === "summary" && (
        <MainTable
          showTable={showTable}
          setShowTable={setShowTable}
          selectEmployee={selectedEmployee}
          setView={setView}
        />
        // <SummaryComponent />
      )}
    </div>
  );
}

export default App;
