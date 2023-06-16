import React from 'react';
import './DataComponent.css';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'

function DataComponent({ data, selectEmployee }) {

  function handleEdit(emp) {
    selectEmployee(emp);
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/delete/${id}`)
        .then(res => {
          console.log("REsponse: " + res.data);

          // try to make data change without refresh in future
          window.location.reload();
        })
      console.log("ID: " + id);
      console.log('Employee deleted successfully')
      // Perform any additional actions after successful deletion
    } catch (error) {
      console.log("error in FE");
      console.error('Error deleting employee:', error);
      // Handle error case
    }
  };

  return (
    <div className="container">
      <h2>Total: <span>({data.length})</span></h2>
      {data.length > 0 ?

        (
          <table className="data-table">
            <thead>
              <tr>
                <th></th>

                <th>Emp ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Is Onsite</th>
                <th>Project Id</th>
                <th>Project Name</th>
                <th>Manager Name</th>
                <th>Available Hours</th>
                <th>Billed Hours</th>
                <th>Utilization %</th>
                <th>Utilization Range</th>
                <th>Billed FTE</th>
                <th>Total FTE</th>
                <th>Unbilled FTE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (

                <tr key={item.empId}>

                  <AiOutlineEdit color='blue' onClick={() => { handleEdit(item) }} />
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
                  <AiOutlineDelete color='red' onClick={() => handleDelete(item.empId)} />

                </tr>
              ))}
            </tbody>
          </table>
        ) :

        (
          <p>No data available</p>
        )}
    </div>
  );
}

export default DataComponent;
