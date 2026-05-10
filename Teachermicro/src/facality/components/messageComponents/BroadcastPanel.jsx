import React,{ useState } from "react";

const BroadcastPanel = () => {
  const [selectedClass, setSelectedClass] = useState("BCA-1A");

  return (
    <div className="p-3 border-b flex gap-3 flex-wrap">
      <select
        className="border p-2 rounded"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option>BCA-1A</option>
        <option>BCA-2A</option>
        <option>BCA-3A</option>
      </select>

      <span className="text-sm text-gray-500">
        Message will go to selected class
      </span>
    </div>
  );
};

export default React.memo(BroadcastPanel);
