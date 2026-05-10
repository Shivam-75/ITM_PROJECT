export default function StudentSearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by roll or name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-64 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
