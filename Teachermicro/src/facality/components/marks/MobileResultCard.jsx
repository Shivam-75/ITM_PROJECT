import { memo } from "react";
import GradeBadge from "./GradeBadge";

const MobileResultCard = memo(({ result, index }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-lg font-bold text-gray-800">{result.studentName}</p>
        <p className="text-sm text-gray-500">{result.rollNo}</p>
      </div>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
        #{index + 1}
      </span>
    </div>
    <div className="text-sm text-gray-700 mb-2">
      <p>
        <b>Branch:</b> {result.course || "-"}
      </p>
      <p>
        <b>Section:</b> {result.section || "-"}
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div>
        <p className="text-xs text-gray-500">Total Marks</p>
        <p className="text-lg font-semibold text-gray-800">
          {result.totalMarks}/120
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Percentage</p>
        <p className="text-lg font-semibold text-blue-600">
          {result.percentage}%
        </p>
      </div>
    </div>
    <div className="flex justify-center">
      <GradeBadge grade={result.grade} status={result.status} />
    </div>
  </div>
));
export default MobileResultCard;
