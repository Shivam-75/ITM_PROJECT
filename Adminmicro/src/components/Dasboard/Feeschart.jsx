// admin/AdminComponents/FeesChart.jsx
import React, { memo } from "react";
import Chart from "./Chart";

const Feeschart = ({ data = [] }) => {
  return <Chart data={data} type="line" />;
};

export default memo(Feeschart);
