// admin/AdminComponents/EnrollmentChart.jsx
import React, { memo } from "react";
import Chart from "./Chart";

const Enrollmentchart = ({ data = [] }) => {
  return <Chart data={data} type="bar" />;
};

export default memo(Enrollmentchart);
