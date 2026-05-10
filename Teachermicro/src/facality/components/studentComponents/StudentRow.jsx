import { useNavigate } from "react-router-dom";
import { memo } from "react";

const StudentRow = ({ student }) => {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/studentsProfile/${student.id}`)}
      className="cursor-pointer hover:bg-white border-t"
    >
      <td className="p-3">{student.roll}</td>
      <td className="p-3 font-medium">{student.name}</td>
      <td className="p-3">{student.className}</td>
      <td className="p-3">
        <span
          className={`text-xs px-2 py-1 rounded font-medium
      ${
        student.status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
        >
          {student.status}
        </span>
      </td>
    </tr>
  );
};
export default memo(StudentRow);



