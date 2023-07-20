import React from "react";
import "./DataComponent.css";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

function DataComponent({ data, selectEmployee, setSortValue, refresh }) {
  function handleEdit(emp) {
    selectEmployee(emp);
  }

  function setSort(value) {
    setSortValue(value);
    refresh();
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/delete/${id}`).then((res) => {
        console.log("REsponse: " + res.data);

        // try to make data change without refresh in future
        // window.location.reload();
        refresh();
      });
      // Perform any additional actions after successful deletion
    } catch (error) {
      console.log("error in FE");
      console.error("Error deleting employee:", error);
      // Handle error case
    }
  }

  return (
    <div className="container">
      <h2>
        Total: <span>({data.length})</span>
      </h2>
      {data.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th></th>

              <th onClick={() => setSort({ empId: 1 })}>Emp ID</th>
              <th onClick={() => setSort({ name: 1 })}>Name</th>
              <th onClick={() => setSort({ grade: 1 })}>Grade</th>
              <th onClick={() => setSort({ isOnsite: 1 })}>Is Onsite</th>
              <th onClick={() => setSort({ projectId: 1 })}>Project Id</th>
              <th onClick={() => setSort({ projectName: 1 })}>Project Name</th>
              <th onClick={() => setSort({ managerName: 1 })}>Manager Name</th>
              <th onClick={() => setSort({ availableHours: 1 })}>
                Available Hours
              </th>
              <th onClick={() => setSort({ billedHours: 1 })}>Billed Hours</th>
              <th onClick={() => setSort({ utilizationPercentage: 1 })}>
                Utilization %
              </th>
              <th onClick={() => setSort({ utilizationRange: 1 })}>
                Utilization Range
              </th>
              <th onClick={() => setSort({ billedFTE: 1 })}>Billed FTE</th>
              <th onClick={() => setSort({ totalFTE: 1 })}>Total FTE</th>
              <th onClick={() => setSort({ unbilledFTE: 1 })}>Unbilled FTE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <AiOutlineEdit
                  color="blue"
                  onClick={() => {
                    handleEdit(item);
                  }}
                />
                <td>{item.empId}</td>
                <td>{item.name}</td>
                <td>{item.grade}</td>
                <td>{item.isOnsite}</td>
                <td>{item.projectId}</td>
                <td>{item.projectName}</td>
                <td>{item.managerName}</td>
                <td>{item.availableHours}</td>
                <td>{item.billedHours}</td>
                <td>{item.utilizationPercentage}</td>
                <td>{item.utilizationRange}</td>
                <td>{item.billedFTE}</td>
                <td>{item.totalFTE}</td>
                <td>{item.unbilledFTE}</td>
                <AiOutlineDelete
                  color="red"
                  onClick={() => handleDelete(item._id)}
                />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default DataComponent;
