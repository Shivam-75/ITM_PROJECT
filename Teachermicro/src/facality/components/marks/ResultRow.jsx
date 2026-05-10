import { memo } from "react";
import GradeBadge from "./GradeBadge";

const ResultRow = memo(({ result, index }) => (
  <tr className="border-b hover:bg-white transition-colors">
    <td className="px-4 py-3 text-gray-700">{index + 1}</td>
    <td className="px-4 py-3">
      <div className="font-semibold text-gray-800">{result.studentName}</div>
      <div className="text-sm text-gray-500">{result.rollNo}</div>
    </td>
    <td className="px-4 py-3 text-gray-700">{result.course || "-"}</td>

    <td className="px-4 py-3 text-gray-700">{result.section || "-"}</td>
    <td className="px-4 py-3 text-gray-700">{result.totalMarks}/120</td>
    <td className="px-4 py-3 font-semibold text-blue-600">
      {result.percentage}%
    </td>
    <td className="px-4 py-3">
      <GradeBadge grade={result.grade} status={result.status} />
    </td>
  </tr>
));
export default ResultRow;



