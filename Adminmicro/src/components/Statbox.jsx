import React, { memo, useMemo } from "react";
import AdminCard from "./AdminCard";

const Statbox = memo(() => {
  const stats = useMemo(
    () => [
      { label: "Students", value: "1240" },
      { label: "Faculty", value: "84" },
      { label: "Courses", value: "12" },
      { label: "Pending Fees", value: "₹3.2L" },
    ],
    [],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => (
        <AdminCard key={item.label} title={item.label}>
          <p className="text-2xl font-bold">{item.value}</p>
        </AdminCard>
      ))}
    </div>
  );
});

export default Statbox;




