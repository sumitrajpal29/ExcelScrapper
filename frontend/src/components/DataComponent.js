import React from 'react';
import './DataComponent.css';

function DataComponent({ data }) {
  return (
    <div className="container">
      <h2>Data: <span>({data.length})</span></h2>
      {data.length > 0 ?

        (
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Project ID</th>
                <th>Grade</th>
                <th>Billability</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.empId}>
                  <td>{item.empId}</td>
                  <td>{item.name}</td>
                  <td>{item.projectId}</td>
                  <td>{item.grade}</td>
                  <td>{item.billability}</td>
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
