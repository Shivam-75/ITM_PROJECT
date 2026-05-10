import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiSave, FiUploadCloud, FiUser, FiBriefcase, FiMapPin, FiCalendar } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ReportAPI } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const FaculityEdit = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  // Fetch real data for editing
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await ReportAPI.get(`/Staff/get/${id}`);
        if (response.data.data) {
          const data = response.data.data;
          setTeacher({
            ...data,
            image: data.image || null, // Keep the path if it exists
          });
          if (data.image) {
            setPreview(`http://localhost:5002${data.image}`);
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load faculty records");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

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
      
      // Append all fields
      Object.keys(teacher).forEach(key => {
        if (key !== "image" && teacher[key] !== null && teacher[key] !== undefined) {
          formData.append(key, teacher[key]);
        }
      });

      // Append image if it's a new file
      if (teacher.image instanceof File) {
        formData.append("image", teacher.image);
      }

      const response = await ReportAPI.put(`/Staff/update/${id}`, formData);
      
      if (response.status === 200) {
        toast.success("Faculty record updated successfully!");
        navigate("/faculty");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-300"
      />
    </div>
  );

  const SelectField = ({ label, icon: Icon, options, ...props }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      <select
        {...props}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
      >
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

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
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Member Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Updating records for Member ID: {id}</p>
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
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center leading-relaxed">Update member's digital identity photo.</p>
          </div>

          {/* Basic Details */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" icon={FiUser} name="name" value={teacher.name} required onChange={handleChange} />
            <InputField label="Email Address" icon={FiUser} name="email" value={teacher.email} type="email" required onChange={handleChange} />
            <InputField label="Department" icon={FiBriefcase} name="department" value={teacher.department} required onChange={handleChange} />
            <InputField label="Qualification" name="qualification" value={teacher.qualification} onChange={handleChange} />
            <InputField label="Higher Qualification" name="higherQualification" value={teacher.higherQualification} onChange={handleChange} />
            <InputField label="Father Name" name="fatherName" value={teacher.fatherName} onChange={handleChange} />
            <InputField label="Aadhaar Number" name="aadhaar" value={teacher.aadhaar} onChange={handleChange} />
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField label="Gender" options={["Male", "Female", "Other"]} name="gender" value={teacher.gender} onChange={handleChange} />
          <SelectField label="Marital Status" options={["Married", "Unmarried", "Divorced"]} name="maritalStatus" value={teacher.maritalStatus} onChange={handleChange} />
          <InputField label="Age" type="number" name="age" value={teacher.age} onChange={handleChange} />
          
          <InputField label="Date of Birth" type="date" name="dob" icon={FiCalendar} value={teacher.dob} onChange={handleChange} />
          <InputField label="Date of Joining" type="date" name="doj" icon={FiCalendar} value={teacher.doj} onChange={handleChange} />
          <InputField label="Contact No" name="phone" value={teacher.phone} placeholder="+91 XXXXX XXXXX" onChange={handleChange} />

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FiMapPin size={12} />
              Full Address
            </label>
            <textarea
              name="address"
              value={teacher.address}
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
            Discard Changes
          </button>
          <button
            type="submit"
            className="flex-[2] bg-[#0f172a] text-white font-bold uppercase tracking-[0.2em] text-[11px] py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
          >
            <FiSave size={18} />
            Update Records
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaculityEdit;
