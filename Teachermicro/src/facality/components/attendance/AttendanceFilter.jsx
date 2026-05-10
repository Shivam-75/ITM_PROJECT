import React, { useState, useEffect } from "react";
import axios from "axios";

function AttendanceFilter({
  selectedDate,
  setSelectedDate,
  selectedCourse,
  setSelectedCourse,
  selectedSemester,
  setSelectedSemester,
  selectedSection,
  setSelectedSection,
  selectedSubject,
  setSelectedSubject,
}) {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const [cRes, sRes, secRes] = await Promise.all([
          axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/sections", { withCredentials: true })
        ]);
        if (cRes.data.courses) setCourses(cRes.data.courses);
        if (sRes.data.semesters) setSemesters(sRes.data.semesters);
        if (secRes.data.sections) setSections(secRes.data.sections);
      } catch (err) {
        console.error("Teacher Registry Sync Failed:", err);
      }
    };
    fetchRegistries();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg border">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="input-style"
      />

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="input-style uppercase"
      >
        <option value="">Select Course</option>
        {courses.map(c => (
            <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>
        ))}
      </select>

      <select
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        className="input-style uppercase"
      >
        <option value="">Select Semester</option>
        {semesters.map(s => (
            <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>
        ))}
      </select>

      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="input-style uppercase"
      >
        <option value="">Select Section</option>
        {sections.map(sec => (
            <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Subject Name"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="input-style border p-2 rounded"
      />
    </div>
  );
}

export default React.memo(AttendanceFilter);



