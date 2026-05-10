import StudentInfoSection from "./StudentInfoSection";

export default function StudentDetails({ student }) {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <StudentInfoSection title="Academic Info" data={[
        { label: "Course", value: student.className },
        { label: "Roll No", value: student.roll }
      ]} />

      <StudentInfoSection title="Contact Info" data={[
        { label: "Email", value: student.email },
        { label: "Phone", value: student.phone }
      ]} />
    </div>
  );
}



