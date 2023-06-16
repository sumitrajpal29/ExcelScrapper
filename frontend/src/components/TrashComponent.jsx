import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DataComponent from './DataComponent';

const TrashComponent = () => {
  const [trashData, setTrashData]=useState(null);

const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/trash');
      setTrashData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <div>
      <h1>Trash Data</h1>

      { trashData && trashData.map((item)=>(
        <tr>
        <td>{item.empId}</td>
        <td>{item.name}</td>
        </tr>
      )
      )}
    </div>
  )
      }

export default TrashComponent;
