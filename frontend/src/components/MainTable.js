import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AssociateTable from "./Associate";

function MainTable({ selectedEmployee, showTable, setShowTable }) {
  let offTotal = 0,
    onTotal = 0;

  //let onsite =[false,true];

  const billabilityCodes = [
    "Billed",
    "Billability Planned",
    "No Billability Plan",
    "Moved Out",
    "Release initiated or Already released",
    "To be released or reassigned",
  ];

  function hideTable() {
    setShowTable(false);
  }

  function getOffCount(bCode) {
    try {
      axios.get(`http://localhost:8000/getOffCount/${bCode}`).then((res) => {
        let result = res.data.result;
        document.getElementsByClassName(bCode)[0].innerHTML = result;

        offTotal += result;
        //updating total
        document.getElementsByClassName(bCode)[1].innerText = result;

        //finalofftotal
        document.getElementsByClassName("offCount")[0].innerHTML = offTotal;

        //final offshore + onshore values
        document.getElementsByClassName("grandTotal")[0].innerText = offTotal;
      });
    } catch (e) {
      console.log("Line 25", e.response);
    }
  }
  //to get onshore count for given billability
  function getOnSiteCount(bCode) {
    try {
      axios.get(`http://localhost:8000/getOnCount/${bCode}`).then((res) => {
        let result = res.data.result;
        onTotal += result;
        document.getElementById(bCode).innerHTML = result;

        //updatind row total
        let value = parseInt(
          document.getElementsByClassName(bCode)[1].innerText
        );
        let final = value + result;
        //update the DOm
        document.getElementsByClassName(bCode)[1].innerText = final;

        //final-ontotal
        document.getElementsByClassName("onCount")[0].innerHTML = onTotal;

        //final offshore + onshore values
        let offVal = parseInt(
          document.getElementsByClassName("grandTotal")[0].innerText
        );
        document.getElementsByClassName("grandTotal")[0].innerText =
          onTotal + offVal;
      });
    } catch (e) {
      console.log(e);
    }
  }

  //ui
  return (
    <div className="container">
      <table className="data-table" style={{ display: !showTable && "none" }}>
        <thead>
          <tr>
            <th>Billability Status</th>
            <th>OffShore</th>
            <th>Onshore</th>
            <th>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {billabilityCodes.map((code) => (
            <tr key={code}>
              <td>{code}</td>

              <td style={{ textAlign: "center" }}>
                <NavLink to={`${code}/false`} onClick={hideTable}>
                  <span className={code}>{getOffCount(code)}</span>
                </NavLink>
              </td>

              <td style={{ textAlign: "center" }}>
                <NavLink to={`${code}/true`} onClick={hideTable}>
                  <span id={code}>{getOnSiteCount(code)}</span>
                </NavLink>
              </td>
              <td className={code} style={{ textAlign: "center" }}></td>
            </tr>
          ))}
          {/*Total row */}
          <tr>
            <td>Grand Total</td>
            <td className="offCount" style={{ textAlign: "center" }}></td>
            <td className="onCount" style={{ textAlign: "center" }}></td>
            <td className="grandTotal" style={{ textAlign: "center" }}></td>
          </tr>
        </tbody>
      </table>
      <Routes>
        <Route
          path=":code/:isOnsite"
          element={
            <AssociateTable
              showTable={showTable}
              setShowTable={setShowTable}
              selectEmployee={selectedEmployee}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default MainTable;
