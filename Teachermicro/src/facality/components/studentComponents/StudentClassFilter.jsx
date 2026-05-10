import { useAcademicRegistry } from "../../hooks/useAcademicRegistry";

export default function StudentClassFilter({ value, onChange }) {
  const { courses, loading } = useAcademicRegistry();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-48 border rounded-lg px-3 py-2 text-sm font-medium"
      disabled={loading}
    >
      <option value="All">All Courses</option>
      {courses.map((cls) => (
        <option key={cls.id} value={cls.name}>
          {cls.name}
        </option>
      ))}
    </select>
  );
}
