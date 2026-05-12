import { memo } from "react";
import GradeBadge from "./GradeBadge";

const MarksSummary = memo(({ totalMarks, maxMarks, percentage, gradeInfo }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-[10px] border border-blue-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Result Summary</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-[10px] shadow-sm">
        <p className="text-sm text-gray-600 mb-1">Total Marks</p>
        <p className="text-2xl font-bold text-gray-800">{totalMarks}/{maxMarks}</p>
      </div>
      <div className="bg-white p-4 rounded-[10px] shadow-sm">
        <p className="text-sm text-gray-600 mb-1">Percentage</p>
        <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
      </div>
      <div className="bg-white p-4 rounded-[10px] shadow-sm">
        <p className="text-sm text-gray-600 mb-1">Grade</p>
        <p className="text-2xl font-bold text-green-600">{gradeInfo.grade}</p>
      </div>
      <div className="bg-white p-4 rounded-[10px] shadow-sm">
        <p className="text-sm text-gray-600 mb-1">Status</p>
        <GradeBadge grade={gradeInfo.grade} status={gradeInfo.status} />
      </div>
    </div>
  </div>
));
export default MarksSummary;


