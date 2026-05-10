import React, { useState } from "react";
import { FiArrowLeft, FiSave, FiUploadCloud, FiUser, FiBriefcase, FiMapPin, FiCalendar, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ReportAPI } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useEffect } from "react";

const InputField = ({ label, icon: Icon, value, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <input
      value={value}
      {...props}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-300"
    />
  </div>
);

const SelectField = ({ label, icon: Icon, options, value, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <select
      value={value}
      {...props}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
    >
      <option value="">Select {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const FaculityAdd = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    department: "",
    age: "",
    gender: "",
    address: "",
    qualification: "",
    higherQualification: "",
    fatherName: "",
    aadhaar: "",
    dob: "",
    doj: "",
    maritalStatus: "",
    phone: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);

  // 🔹 Fetch Registries
  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/v3/Admin/Academic/file-courses", { withCredentials: true });
        if (res.data.courses) setDepartmentList(res.data.courses);
      } catch (err) {
        console.error("Registry load failed:", err);
      }
    };
    fetchDeps();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setTeacher({ ...teacher, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setTeacher({ ...teacher, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      // Append all text fields
      Object.keys(teacher).forEach(key => {
        if (key !== "image" && teacher[key] !== null && teacher[key] !== undefined) {
          formData.append(key, teacher[key]);
        }
      });

      // Append image if selected
      if (teacher.image instanceof File) {
        formData.append("image", teacher.image);
      }

      const response = await ReportAPI.post("/Staff/add", formData);

      if (response.status === 201) {
        toast.success("Teacher Added Successfully!");
        navigate("/faculty");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add faculty member";
      console.error("Submission Error:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 relative">
      {loading && <Loader />}
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/faculty")}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Faculty</h2>
            <p className="text-gray-500 text-sm mt-1">Register a new academic staff member</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Upload */}
          <div className="md:col-span-1 border-r border-gray-50 pr-8">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Profile Photo</label>
            <div className="relative group">
              <div className="aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-red-500/30">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FiUploadCloud size={32} className="text-gray-300 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Upload JPG/PNG</span>
                  </>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {preview && (
                <button
                  type="button"
                  onClick={() => { setPreview(null); setTeacher({ ...teacher, image: null }) }}
                  className="absolute -top-2 -right-2 bg-white shadow-md border border-gray-100 p-1 rounded-full text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiArrowLeft className="rotate-45" size={14} />
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center leading-relaxed">Recommended size: 500x500px, max 2MB.</p>
          </div>

          {/* Basic Details */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" icon={FiUser} name="name" value={teacher.name} placeholder="Dr. John Doe" required onChange={handleChange} />
            <InputField label="Email Address" icon={FiMail} name="email" value={teacher.email} type="email" placeholder="john.doe@itm.edu" required onChange={handleChange} />
            <SelectField
              label="Assigned Department"
              icon={FiBriefcase}
              name="department"
              value={teacher.department}
              options={departmentList.map(d => d.name.toUpperCase())}
              required
              onChange={handleChange}
            />
            <InputField label="Qualification" name="qualification" value={teacher.qualification} placeholder="e.g. MCA, M.Tech" onChange={handleChange} />
            <InputField label="Higher Qualification" name="higherQualification" value={teacher.higherQualification} placeholder="e.g. PhD" onChange={handleChange} />
            <InputField label="Father Name" name="fatherName" value={teacher.fatherName} placeholder="Father's Name" onChange={handleChange} />
            <InputField label="Aadhaar Number" name="aadhaar" value={teacher.aadhaar} placeholder="XXXX XXXX XXXX" onChange={handleChange} />
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField label="Gender" options={["Male", "Female", "Other"]} name="gender" value={teacher.gender} onChange={handleChange} />
          <SelectField label="Marital Status" options={["Married", "Unmarried", "Divorced"]} name="maritalStatus" value={teacher.maritalStatus} onChange={handleChange} />
          <InputField label="Age" type="number" name="age" value={teacher.age} placeholder="35" onChange={handleChange} />

          <InputField label="Date of Birth" type="date" name="dob" value={teacher.dob} icon={FiCalendar} onChange={handleChange} />
          <InputField label="Date of Joining" type="date" name="doj" value={teacher.doj} icon={FiCalendar} onChange={handleChange} />
          <InputField label="Contact No" name="phone" value={teacher.phone} placeholder="+91 XXXXX XXXXX" onChange={handleChange} />

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FiMapPin size={12} />
              Full Address
            </label>
            <textarea
              name="address"
              value={teacher.address}
              placeholder="Enter permanent address..."
              rows="3"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/faculty")}
            className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[11px] py-4 rounded-2xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] bg-[#0f172a] text-white font-bold uppercase tracking-[0.2em] text-[11px] py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
          >
            <FiSave size={18} />
            Save Faculty Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaculityAdd;
