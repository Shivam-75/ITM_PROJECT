export default function StudentProfileCard({ student }) {
  return (
    <div className="bg-white p-6 rounded shadow flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl">
        {student.name[0]}
      </div>

      <div>
        <h2 className="text-xl font-semibold">{student.name}</h2>
        <p className="text-gray-500">
          Roll: {student.roll} | {student.className}
        </p>
      </div>
    </div>
  );
}



