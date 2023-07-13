import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DataComponent from "./DataComponent";

function AssociateTable({ selectEmployee }) {
  const [data, setData] = useState([]);

  const { code, isOnsite } = useParams();
  console.log("line 10", code);

  //    const history = useNavigate();
  //    history(`${code}/${isOnsite}`);

  async function getfilteredData() {
    try {
      let res = await axios.get(
        `http://localhost:8000/getFilteredData/${code}/${isOnsite}`
      );

      setData(res.data.result);
      console.log("line 16", data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getfilteredData();
  }, [code, isOnsite]);

  return <DataComponent data={data} selectEmployee={selectEmployee} />;
}

export default AssociateTable;
