import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../api/apis";
import { toast } from "react-toastify";
import useAuth from "../../../../store/FacultyStore";

import StudentSearchBar from "../../../components/studentComponents/StudentSearchBar";
import StudentClassFilter from "../../../components/studentComponents/StudentClassFilter";
import StudentTable from "../../../components/studentComponents/StudentTable";
import { filterStudents } from "../../../components/studentComponents/utils/filterStudents";
import useDebounce from "../../../../hooks/useDebounce";
import BigLoader from "../../../common/BigLoader";

export default function StudentListPage() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toststyle } = useAuth();
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await authAPI.get("/StudentList");
      if (data?.studentList) {
        // Map backend student fields to frontend table requirements
        const mappedList = data.studentList.map(s => ({
          id: s._id,
          name: s.name,
          rollno: s.rollNo || "N/A",
          class: s.course ? `${s.course} ${s.semester || ""} ${s.section || ""}`.trim() : "N/A",
          gender: s.gender || "Unknown",
          moNumber: s.moNumber || "N/A"
        }));
        setStudentsData(mappedList);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load students", toststyle);
    } finally {
      setLoading(false);
    }
  }, [toststyle]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const debouncedSearch = useDebounce(search, 300);

  const filteredStudents = useMemo(() => {
    return filterStudents(studentsData, debouncedSearch, selectedClass);
  }, [studentsData, debouncedSearch, selectedClass]);

  return (
    <>
      <main
        className="
          ml-0 
          pt-30
          h-screen
          overflow-y-auto
          px-4 sm:px-6 md:px-8 min-w-7xl mx-auto pb-10 space-y-4 relative
        "
      >
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-50">
            <BigLoader />
          </div>
        )}

        <div className="flex justify-between ">
          <h1 className="text-2xl font-semibold">Student List</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <StudentSearchBar value={search} onChange={setSearch} />
          <StudentClassFilter
            value={selectedClass}
            onChange={setSelectedClass}
          />
        </div>

        <StudentTable students={filteredStudents} />
      </main>
    </>
  );
}
