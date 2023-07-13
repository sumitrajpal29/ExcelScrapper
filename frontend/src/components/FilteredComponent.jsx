import React, { useState } from "react";
import DataComponent from "./DataComponent";

export default function FilteredComponent({
  data,
  setView,
  selectEmployee,
  refresh,
}) {
  const [data, setData] = useState([]);

  return (
    <>
      <DataComponent
        data={data}
        selectEmployee={selectEmployee}
        refresh={refresh}
      />
    </>
  );
}
