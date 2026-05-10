import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CourseList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", {
        withCredentials: true
      });
      if (response.data.courses) {
        // Transform backend flat list into grouped departments
        const grouped = response.data.courses.reduce((acc, course) => {
          const deptName = course.department || "Other";
          let dept = acc.find(d => d.departmentName.toLowerCase() === deptName.toLowerCase());
          if (!dept) {
            dept = { departmentName: deptName, courses: [] };
            acc.push(dept);
          }
          dept.courses.push({ name: course.name, _id: course._id });
          return acc;
        }, []);
        setDepartments(grouped);
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [form, setForm] = useState({
    departmentName: "",
    courses: "",
  });

  const [newCourse, setNewCourse] = useState("");

  // ➕ Add Department
  const addDepartment = async (e) => {
    e.preventDefault();
    const coursesArray = form.courses.split(",").map(c => c.trim());
    try {
      // Add all courses for this department
      await Promise.all(coursesArray.map(c => 
        axios.post("http://localhost:5002/api/v3/Admin/Academic/courses", {
          name: c,
          department: form.departmentName
        }, { withCredentials: true })
      ));
      toast.success("Department and Courses Added");
      fetchCourses();
      setForm({ departmentName: "", courses: "" });
    } catch (error) {
      toast.error("Failed to add department");
    }
  };

  // ➕ Add Course
  const addCourse = (deptIndex) => {
    if (!newCourse) return;

    const updated = [...departments];
    updated[deptIndex].courses.push({ name: newCourse });
    setDepartments(updated);
    setNewCourse("");
  };

  // ❌ Delete Department
  const deleteDepartment = (deptIndex) => {
    if (window.confirm("Delete this department?")) {
      setDepartments(departments.filter((_, i) => i !== deptIndex));
    }
  };

  // ❌ Delete Course
  const deleteCourse = (deptIndex, courseIndex) => {
    const updated = [...departments];
    updated[deptIndex].courses = updated[deptIndex].courses.filter(
      (_, i) => i !== courseIndex,
    );
    setDepartments(updated);
  };

  return (
    <div className="p-6 space-y-6">
      {/* ➕ ADD DEPARTMENT FORM */}
      <div className="bg-white shadow rounded p-4 w-[98%] mx-auto md:w-full">
        <h2 className="text-xl font-bold mb-4">Add Department & Courses</h2>

        <form
          onSubmit={addDepartment}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Department Name"
            value={form.departmentName}
            onChange={(e) =>
              setForm({ ...form, departmentName: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Courses (BCA, MCA)"
            value={form.courses}
            onChange={(e) => setForm({ ...form, courses: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Add Department
          </button>
        </form>
      </div>

      {/* 📋 TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-3 py-2">Department</th>
              <th className="border px-3 py-2">Total Courses</th>
              <th className="border px-3 py-2">Courses</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept, deptIndex) => (
              <tr key={deptIndex} className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">
                  {dept.departmentName}
                </td>

                <td className="border px-3 py-2 text-center">
                  {dept.courses.length}
                </td>

                {/* COURSES */}
                <td className="border px-3 py-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {dept.courses.map((course, courseIndex) => (
                      <span
                        key={courseIndex}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {course.name}
                        <button
                          onClick={() => deleteCourse(deptIndex, courseIndex)}
                          className="text-red-500 font-bold">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* ADD COURSE */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New Course"
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      className="border px-2 py-1 rounded text-xs"
                    />
                    <button
                      onClick={() => addCourse(deptIndex)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      Add
                    </button>
                  </div>
                </td>

                {/* ACTION */}
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => deleteDepartment(deptIndex)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                    Delete Dept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;
