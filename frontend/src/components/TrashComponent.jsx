import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUndo } from 'react-icons/fa';
import { MdDeleteForever as Delete } from 'react-icons/md';

const TrashComponent = ({ refresh }) => {
  const [trashData, setTrashData] = useState(null);

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

  async function handleRecover(item) {
    try {

      await axios.post('http://localhost:8000/uploadSingle', item)
        .then(
          async res => {
            console.log(res.data);
            handlePermanentDelete(item.empId);
          });

    } catch (error) {
      console.log('Error in FE handleRecover: ' + error);
    }

    refresh();
  };

  async function handlePermanentDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/trash/delete/${id}`)
        .then(res => {
          console.log('Response from trash-component ' + res);
        });
    } catch (error) {
      console.log('Error in FE handlePermanentDelete: ' + error);
    }

  }

  return (
    <div>
      <h2>Trash Data ({trashData && trashData.length})</h2>

      {trashData && trashData.map((item) => (
        <tr>

          <td><FaUndo color='green' onClick={() => handleRecover(item)} /></td>
          <td>{item.empId}</td>
          <td>{item.name}</td>
          <td><Delete color='red' onClick={() => handlePermanentDelete(item.empId)} /></td>
        </tr>
      )
      )}
    </div>
  )
}

export default TrashComponent;
