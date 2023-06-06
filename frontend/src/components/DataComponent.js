import React from 'react';
import './DataComponent.css';
import axios from 'axios';

function DataComponent({ data }) {

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
                <th>Edit</th>

                <th>Emp ID</th>
                <th>Name</th>
                <th>Project ID</th>
                <th>Grade</th>
                <th>Billability</th>

                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (

                <tr key={item.empId}>
                  <td>
                    <button>Edit</button>
                  </td>

                  <td>{item.empId}</td>
                  <td>{item.name}</td>
                  <td>{item.projectId}</td>
                  <td>{item.grade}</td>
                  <td>{item.billability}</td>

                  <td>
                    <button onClick={() => handleDelete(item.empId)}>Delete</button>
                  </td>
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
