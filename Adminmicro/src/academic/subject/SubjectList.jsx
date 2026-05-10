import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/api/v3/Admin/Academic/subjects", {
        withCredentials: true
      });
      if (response.data.subjects) {
        setSubjects(response.data.subjects);
      }
    } catch (error) {
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const [form, setForm] = useState({
    subjectName: "",
    department: "",
    semester: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add / ✏️ Update Subject
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      if (editIndex !== null) {
        // Update logic (assuming put endpoint exists)
        toast.info("Update logic triggered (dummy)");
      } else {
        await axios.post("http://localhost:5002/api/v3/Admin/Academic/subjects", {
          name: form.subjectName,
          department: form.department,
          semester: form.semester
        }, { withCredentials: true });
        toast.success("Subject Added");
        fetchSubjects();
      }
 
      setForm({
        subjectName: "",
        department: "",
        semester: "",
      });
      setEditIndex(null);
    } catch (error) {
       toast.error("Failed to save subject");
    }
  };

  // ✏️ Edit
  const handleEdit = (index) => {
    setForm(subjects[index]);
    setEditIndex(index);
  };

  // 🗑️ Delete
  const handleDelete = (index) => {
    if (window.confirm("Delete this subject?")) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ➕ ADD / EDIT FORM */}
      <div className="bg-white shadow rounded p-4 w-[98%] mx-auto md:w-full">
        <h2 className="text-xl font-bold mb-4">
          {editIndex !== null ? "Edit Subject" : "Add Subject"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="subjectName"
            placeholder="Subject Name"
            value={form.subjectName}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="border p-2 rounded"
            required>
            <option value="">Select Semester</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
            <option>5th</option>
            <option>6th</option>
          </select>

          <button
            type="submit"
            className="md:col-span-3 bg-green-600 text-white py-2 rounded hover:bg-green-700">
            {editIndex !== null ? "Update Subject" : "Add Subject"}
          </button>
        </form>
      </div>

      {/* 📋 SUBJECT TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-3 py-2">Subject Name</th>
              <th className="border px-3 py-2">Department</th>
              <th className="border px-3 py-2">Semester</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">
                  {subject.name || subject.subjectName}
                </td>

                <td className="border px-3 py-2">{subject.department}</td>

                <td className="border px-3 py-2 text-center">
                  {subject.semester}
                </td>

                <td className="border px-3 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs">
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectList;
