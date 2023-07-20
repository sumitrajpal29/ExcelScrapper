import React, { useState } from "react";
import axios from "axios";

export default function SummaryComponent() {
  const [data, setData] = useState([]);
  const billabilityPlans = [
    "Billed",
    "Billability Planned",
    "No Billability Plan",
    "Moved Out",
    "Release initiated or Already released",
    "To be released or reassigned",
  ];
  const filters = { isOnsite: "false", billability: "Billed" };
  const sortValue = { name: -1 };

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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Billability Status</th>
            <th>OffShore</th>
            <th>Onshore</th>
            <th>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {billabilityPlans.map((bCode) => (
            <tr>
              <td>{bCode}</td>
              <td>0</td>
              <td>1</td>
              <td>TotalCode</td>
            </tr>
          ))}
          <tr>Total</tr>
        </tbody>
      </table>
    </div>
  );
}
