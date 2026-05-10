import { useParams } from "react-router-dom";
import { students } from "../../../data/students";
import StudentProfileCard from "../../../components/studentComponents/StudentProfileCard";
import StudentDetails from "../../../components/studentComponents/StudentDetails";
// import { students } from "../../data/students";
// import StudentProfileCard from "../../components/students/StudentProfileCard";
// import StudentDetails from "../../components/students/StudentDetails";

export default function StudentProfilePage() {
  const { id } = useParams();
  const student = students.find((s) => s.id === id);
  console.log(id);

  if (!student) return <div>Student not found</div>;

  return (
    <main
      className="
          ml-0 
      pt-30
      h-screen
      overflow-y-auto
      px-4 sm:px-6 md:px-8 w-full mx-auto pb-10
    ">
      <StudentProfileCard student={student} />
      <StudentDetails student={student} />
    </main>
  );
}
