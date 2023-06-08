import react from 'react';
import DataComponent from './DataComponent';


export default function TrashComponent({data}){
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
                        <button >Delete</button>
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