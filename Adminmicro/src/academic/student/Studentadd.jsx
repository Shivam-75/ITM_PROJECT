import React, { useState, useEffect } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBookOpen, 
  FiCalendar, 
  FiDatabase,
  FiUploadCloud,
  FiShield,
  FiArrowRight,
  FiArrowLeft,
  FiUsers,
  FiCheckCircle,
  FiList,
  FiGrid,
  FiAward,
  FiHash,
  FiBriefcase,
  FiHome
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// 🔹 Backend Configuration
const AUTH_BASE_URL = import.meta.env.VITE_BASE_Auth.replace('/Admin', '/Student');
const REPORT_BASE_URL = import.meta.env.VITE_BASE_REPORT.replace('/Admin', '/Profile');

/* 🔹 Reusable Input Component */
const InputField = ({ label, name, type = "text", placeholder, icon: Icon, required = false, value, onChange }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
      {Icon && <Icon className="text-red-600" size={12} />}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full bg-gray-50 border border-gray-100 p-3.5 pl-4 rounded-xl text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none italic"
      />
    </div>
  </div>
);

const SelectField = ({ label, name, options = [], icon: Icon, required = false, value, onChange }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
      {Icon && <Icon className="text-red-600" size={12} />}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gray-50 border border-gray-100 p-3.5 pl-4 rounded-xl text-sm font-bold focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none italic appearance-none cursor-pointer"
      >
        <option value="" disabled className="text-gray-300">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="font-bold text-gray-900">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
         <FiArrowRight className="rotate-90" size={14} />
      </div>
    </div>
  </div>
);

const Studentadd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Registry States
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sectionsRegistry, setSectionsRegistry] = useState([]);

  const [student, setStudent] = useState({
    collegeName: "ITM College of Management",
    name: "",
    course: "",
    year: "",
    mobile: "",
    stream: "",
    passingYear: "",
    caste: "",
    gender: "",
    board: "",
    parentName: "",
    parentMobile: "",
    motherName: "",
    address: "",
    semester: "",
    section: "",
    id: "",
  });

  // 🔹 Fetch Registry Data
  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const [cRes, yRes, sRes, secRes] = await Promise.all([
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-courses", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-years", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-semesters", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-sections", { withCredentials: true })
        ]);
        if (cRes.data.courses) setCourses(cRes.data.courses);
        if (yRes.data.years) setYears(yRes.data.years);
        if (sRes.data.semesters) setSemesters(sRes.data.semesters);
        if (secRes.data.sections) setSectionsRegistry(secRes.data.sections);
      } catch (err) {
        console.error("Failed to load registries:", err);
      }
    };
    fetchRegistries();
  }, []);

  // 🔹 Pre-fill data if in Edit Mode
  useEffect(() => {
    if (location.state?.editMode && location.state?.studentData) {
      setStudent(location.state.studentData);
    }
  }, [location.state]);

  // 🔹 Automatic ID Generation
  useEffect(() => {
    if (currentStep === 4 && student.course && !student.id) {
      const yearSuffix = "26"; 
      const courseStr = student.course.toUpperCase();
      let courseCode = "STU";

      if (courseStr.includes("BCA")) courseCode = "BCA";
      else if (courseStr.includes("CIVIL")) courseCode = "CIVIL";
      else if (courseStr.includes("B.TECH")) courseCode = "BTECH";
      else if (courseStr.includes("MBA")) courseCode = "MBA";
      else if (courseStr.includes("MCA")) courseCode = "MCA";
      else if (courseStr.includes("BBA")) courseCode = "BBA";
      else courseCode = courseStr.split(" ")[0];

      const generatedId = `ITM/${yearSuffix}/${courseCode}/01`;
      setStudent(prev => ({ ...prev, id: generatedId }));
    }
  }, [currentStep, student.course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.toLowerCase().includes("mobile") || name === "mobile") {
       if (value !== "" && !/^[0-9]+$/.test(value)) return;
       if (value.length > 10) return;
    }
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare Data
      // Extract number from "Semester X" or "sEMESTER X"
      const semStr = student.semester || "";
      const semesterNumber = Number(semStr.replace(/\D/g, "")) || 1;

      const reportPayload = {
        ...student,
        moNumber: Number(student.mobile),
        parentMobile: Number(student.parentMobile),
        semester: semesterNumber,
        studentId: student.id
      };

      const authPayload = {
        name: student.name,
        course: student.course,
        year: student.year,
        moNumber: Number(student.mobile),
        semester: semesterNumber,
        section: student.section,
        password: student.mobile.toString(),
        studentId: student.id
      };

      // 2. FIRST Request: Save Full Profile to Report System (As requested)
      const reportResponse = await axios.post(`${REPORT_BASE_URL}/student-profile`, reportPayload, {
         withCredentials: true
      });

      if (reportResponse.status === 201) {
        // 3. SECOND Request: Register Login in Auth Service
        try {
          await axios.post(`${AUTH_BASE_URL}/registration`, authPayload, {
             withCredentials: true
          });
          toast.success("Student Profile Created & Login Registered!");
        } catch (authErr) {
          console.error("Auth Sync Error:", authErr);
          toast.warning("Profile Saved in Report but Auth Login failed.");
        }
        
        // 🔹 Reset and Redirect
        setStudent({
          collegeName: "ITM", name: "", course: "", year: "", mobile: "", stream: "", passingYear: "", caste: "", gender: "", board: "", parentName: "", parentMobile: "", motherName: "", address: "", semester: "1", section: "", id: "",
        });
        setCurrentStep(1);
        setTimeout(() => navigate("/students"), 1500);
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
      toast.error(error.response?.data?.message || "Critical: Report Profile Creation Failed!");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12 overflow-x-auto pb-4 md:pb-0 px-2">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black italic transition-all duration-500 shadow-lg ${
              currentStep === step ? 'bg-red-600 text-white scale-110 shadow-red-600/20' : currentStep > step ? 'bg-emerald-500 text-white' : 'bg-white text-gray-300 border border-gray-100'
            }`}>
              {currentStep > step ? <FiCheckCircle size={18} /> : <span className="text-xs md:text-sm">{step}</span>}
            </div>
            <span className={`text-[6px] md:text-[8px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic ${currentStep >= step ? 'text-gray-900' : 'text-gray-300'}`}>
              {step === 1 ? 'Identity' : step === 2 ? 'Profile' : step === 3 ? 'Guardian' : 'Assign'}
            </span>
          </div>
          {step < 4 && <div className={`w-6 md:w-20 h-0.5 rounded-full transition-all duration-700 ${currentStep > step ? 'bg-emerald-500' : 'bg-gray-100'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
            Enrollment <span className="text-red-600">Wizard</span>
          </h1>
          <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 md:mt-3 flex items-center gap-2">
            <FiShield className="text-red-600" />
            Priority: Report Microservice First
          </p>
        </div>
        <button onClick={() => navigate("/students")} className="btn-secondary flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-[10px] italic hover:bg-gray-50 transition-all active:scale-95 w-full md:w-auto">
          <FiList size={16} /> Registry
        </button>
      </div>

      <StepIndicator />

      <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-sm border border-gray-100 min-h-[440px] flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600/10"></div>
        
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-8 h-full flex flex-col">
          <div className="flex-1">
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-8">
                <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#111111] text-white rounded-xl flex items-center justify-center font-black italic shadow-lg">01</div>
                  Student Identity & Course
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <SelectField label="Select College" name="collegeName" value={student.collegeName} onChange={handleChange} options={["ITM College of Management", "Institute of Technology and Management (ITM)"]} icon={FiHome} required />
                  </div>
                  <div className="md:col-span-2">
                    <InputField label="Full Legal Name" name="name" value={student.name} onChange={handleChange} placeholder="Enter student's full name" icon={FiUser} required />
                  </div>
                  <SelectField 
                    label="Enrolled Course" 
                    name="course" 
                    value={student.course} 
                    onChange={handleChange} 
                    options={courses.map(c => c.name.toUpperCase())} 
                    icon={FiBookOpen} 
                    required 
                  />
                  <SelectField 
                    label="Academic Year" 
                    name="year" 
                    value={student.year} 
                    onChange={handleChange} 
                    options={years.map(y => y.name)} 
                    icon={FiCalendar} 
                    required 
                  />
                  <SelectField 
                    label="Semester" 
                    name="semester" 
                    value={student.semester} 
                    onChange={handleChange} 
                    options={semesters.map(s => s.name)} 
                    icon={FiHash} 
                    required 
                  />
                  <SelectField 
                    label="Assigned Section" 
                    name="section" 
                    value={student.section} 
                    onChange={handleChange} 
                    options={sectionsRegistry.map(sec => sec.name)} 
                    icon={FiUsers} 
                    required 
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-8">
                <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
                   <div className="w-8 h-8 bg-red-600 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-red-600/20">02</div>
                   Academic & Persona Records
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Primary Mobile" name="mobile" type="number" value={student.mobile} onChange={handleChange} placeholder="91XXXXXXXX" icon={FiPhone} required />
                  <InputField label="Passing Year" name="passingYear" value={student.passingYear} onChange={handleChange} placeholder="20XX" icon={FiAward} />
                  <SelectField label="Academic Stream" name="stream" value={student.stream} onChange={handleChange} options={["Bio", "Math", "Other"]} icon={FiGrid} required />
                  <SelectField label="Category (Caste)" name="caste" value={student.caste} onChange={handleChange} options={["General", "OBC", "SC", "ST"]} icon={FiBriefcase} />
                   <SelectField label="Gender" name="gender" value={student.gender} onChange={handleChange} options={["Male", "Female", "Other"]} icon={FiUser} />
                  <SelectField label="Education Board" name="board" value={student.board} onChange={handleChange} options={["CBSE", "ICSE", "UP BOARD", "OTHER"]} icon={FiShield} />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-8">
                <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
                   <div className="w-8 h-8 bg-[#111111] text-white rounded-xl flex items-center justify-center font-black italic shadow-lg">03</div>
                   Guardian & Residence Support
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Father's Name" name="parentName" value={student.parentName} onChange={handleChange} placeholder="Father Name" icon={FiUsers} />
                  <InputField label="Father's Contact" name="parentMobile" type="number" value={student.parentMobile} onChange={handleChange} placeholder="91XXXXXXXX" icon={FiPhone} />
                  <div className="md:col-span-2">
                    <InputField label="Mother's Name" name="motherName" value={student.motherName} onChange={handleChange} placeholder="Mother Name" icon={FiUser} />
                  </div>
                  <div className="md:col-span-2">
                    <InputField label="Permanent Address" name="address" value={student.address} onChange={handleChange} placeholder="Complete residencial address" icon={FiMapPin} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-8">
                <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
                   <div className="w-8 h-8 bg-red-600 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-red-600/20">04</div>
                   Final Academic Assignment
                </h2>
                <div className="max-w-md mx-auto py-12 px-6 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                  <InputField label="Student ID / Roll Number" name="id" value={student.id} onChange={handleChange} placeholder="ITM/24/XXX/001" icon={FiHash} required />
                  <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center leading-relaxed italic">
                    This profile will be synchronized FIRST with the Report Microservice.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 md:pt-10 flex items-center justify-between border-t border-gray-50 mt-auto gap-4">
            <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[10px] italic transition-all ${currentStep === 1 ? 'bg-gray-50 text-gray-300 pointer-events-none' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95'} flex-1 md:flex-none`}>
              <FiArrowLeft size={16} /> <span className="hidden xs:inline">Prev</span>
            </button>
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-[#111111] text-white hover:bg-black rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[10px] italic transition-all shadow-xl active:scale-95 flex-1 md:flex-none">
                Next <FiArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs italic transition-all shadow-xl shadow-red-600/30 active:scale-95 flex-1 md:flex-none`}>
                {loading ? 'Wait...' : 'Finalize & Sync'} {!loading && <FiCheckCircle size={18} />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Studentadd;
