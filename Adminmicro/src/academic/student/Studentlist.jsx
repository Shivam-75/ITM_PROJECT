import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUserPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit2, 
  FiEye, 
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiPhone,
  FiBookOpen,
  FiPrinter,
  FiTrash2,
  FiRefreshCw,
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
  FiLayers
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ReportService, AcademicService, StudentService } from "../../api/apis";
import CustomSelect from "../../ui/CustomSelect";

const Studentlist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("registry"); // 'registry' or 'migration'
  
  // 🔹 Registry State
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 30;

  // 🔹 Migration State
  const [migrationFilters, setMigrationFilters] = useState({
    course: "",
    year: "",
    semester: ""
  });
  const [migrationOptions, setMigrationOptions] = useState({
    courses: [],
    years: [],
    semesters: []
  });
  const [migratingStudents, setMigratingStudents] = useState([]);
  const [selectedForMigration, setSelectedForMigration] = useState([]);
  const [targetSemester, setTargetSemester] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);

  // 🔹 Fetch Registry Data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await ReportService.getAllStudents();
      if (response.data.studentList) {
        setStudentsList(response.data.studentList);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to sync with Report registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "registry") {
      fetchStudents();
    } else {
      fetchMigrationOptions();
    }
  }, [activeTab]);

  // 🔹 Migration Logic
  const fetchMigrationOptions = async () => {
    try {
      const courseRes = await AcademicService.getCourses();
      setMigrationOptions(prev => ({
        ...prev,
        courses: courseRes.data.courses.map(c => ({ label: c.courseName, value: c.courseName }))
      }));
    } catch (error) {
      toast.error("Failed to fetch migration options");
    }
  };

  useEffect(() => {
    if (migrationFilters.course) {
      AcademicService.getYears(migrationFilters.course).then(res => {
        setMigrationOptions(prev => ({
          ...prev,
          years: res.data.years.map(y => ({ label: y.yearName, value: y.yearName })),
          semesters: []
        }));
        setMigrationFilters(prev => ({ ...prev, year: "", semester: "" }));
      });
    }
  }, [migrationFilters.course]);

  useEffect(() => {
    if (migrationFilters.course && migrationFilters.year) {
      AcademicService.getSemesters(migrationFilters.course, migrationFilters.year).then(res => {
        setMigrationOptions(prev => ({
          ...prev,
          semesters: res.data.semesters.map(s => ({ label: s.semesterName, value: s.semesterName }))
        }));
        setMigrationFilters(prev => ({ ...prev, semester: "" }));
      });
    }
  }, [migrationFilters.year]);

  const handleSearchMigration = async () => {
    if (!migrationFilters.course || !migrationFilters.year || !migrationFilters.semester) {
      toast.warning("Please select all filters");
      return;
    }
    try {
      setLoading(true);
      const res = await StudentService.getStudentsForMigration(
        migrationFilters.course,
        migrationFilters.year,
        migrationFilters.semester
      );
      setMigratingStudents(res.data.studentList || []);
      setSelectedForMigration([]);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMigrate = async () => {
    if (selectedForMigration.length === 0) return toast.warning("Select students first");
    if (!targetSemester) return toast.warning("Select target semester");
    if (targetSemester === migrationFilters.semester) return toast.error("Cannot migrate to same semester");

    try {
      setIsMigrating(true);
      await AcademicService.migrateStudents({
        studentIds: selectedForMigration,
        targetSemester,
        course: migrationFilters.course,
        year: migrationFilters.year
      });
      toast.success(`${selectedForMigration.length} Students Migrated Successfully`);
      handleSearchMigration(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Migration failed");
    } finally {
      setIsMigrating(false);
    }
  };

  // 🔹 Sorting & Filtering (Registry)
  const filteredStudents = useMemo(() => {
    return studentsList.filter(student => 
      (student.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.studentId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.course?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, studentsList]);

  // Logic for Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    navigate("/students/add", { state: { editMode: true, studentData: student } });
  };

  const handleDelete = async (dbId) => {
    if (window.confirm("CRITICAL: Permanent Deletion? This record will be erased from the Report database.")) {
      try {
        await ReportService.deleteProfile(dbId);
        toast.success("Profile Removed");
        fetchStudents();
      } catch (error) {
        toast.error("Deletion Failed");
      }
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative print:p-0">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
            Student <span className="text-red-600">{activeTab === 'registry' ? 'Registry' : 'Migration'}</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
            <FiShield className="text-red-600" />
            {activeTab === 'registry' ? 'Core Academic Database • Central Repository' : 'Academic Advancement • Bulk Promotion System'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'registry' ? 'migration' : 'registry')}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase tracking-widest text-[10px] italic transition-all shadow-lg active:scale-95 border ${
              activeTab === 'migration' 
                ? 'bg-red-600 text-white border-red-700 shadow-red-600/20' 
                : 'bg-white text-gray-900 border-gray-200 hover:bg-white'
            }`}
          >
            {activeTab === 'registry' ? <FiLayers size={16} /> : <FiUsers size={16} />}
            {activeTab === 'registry' ? 'Bulk Migration' : 'Student Registry'}
          </button>
          
          {activeTab === 'registry' && (
            <button
              onClick={() => navigate("/students/add")}
              className="flex items-center gap-3 px-6 py-3 bg-[#111111] text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95 border border-white/5"
            >
              <FiUserPlus size={16} />
              Enroll New Student
            </button>
          )}
        </div>
      </div>

      {activeTab === 'registry' ? (
        /* 🔹 Registry View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden print:hidden w-[98%] mx-auto md:w-full">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/30">
             <div className="relative w-full sm:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by Name, ID or Course..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wide italic outline-none focus:border-red-600 transition-all shadow-sm"
                />
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={fetchStudents}
                  className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-white hover:text-red-600 transition-all group"
                  title="Refresh Registry"
                >
                  <FiRefreshCw size={18} className={loading ? "animate-spin" : "group-active:rotate-180 transition-transform"} />
                </button>
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                  {searchTerm ? 'Matches Found:' : 'Total Records:'} {filteredStudents.length}
                </p>
             </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white">
                  <tr className="bg-white/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100">Identity ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100">Full Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100">Course</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100">Semester</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student, index) => (
                      <tr key={index} className="group hover:bg-white/80 transition-all">
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black text-[#111111] bg-white px-3 py-1.5 rounded-lg border border-gray-200 italic shadow-sm">
                            {student.studentId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-black text-gray-900 uppercase italic tracking-tight group-hover:text-red-600 transition-colors">
                          {student.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                             <span className="text-[10px] font-black uppercase text-gray-600 tracking-wider italic">{student.course}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black uppercase text-gray-400 italic">SEM {student.semester}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic ${
                            student.isBlock 
                              ? 'bg-red-50 text-red-600 border border-red-100' 
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {student.isBlock ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(student)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-gray-100 hover:border-red-600 shadow-sm"
                            >
                              <FiEye size={14} />
                              <span className="text-[9px] font-black uppercase italic">Show</span>
                            </button>
                            <button 
                              onClick={() => handleEdit(student)}
                              className="p-2 text-gray-400 hover:text-[#111111] hover:bg-white rounded-lg transition-all"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(student._id)}
                              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic font-black uppercase tracking-widest text-[10px]">Registry Empty</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-gray-50 bg-white/30 flex items-center justify-between">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                Showing {filteredStudents.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length}
             </p>
             <div className="flex items-center gap-1.5">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg disabled:opacity-30"><FiChevronLeft size={16} /></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => paginate(i+1)} className={`w-8 h-8 rounded-lg text-[10px] font-black italic shadow-md ${currentPage === i+1 ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-400'}`}>{i+1}</button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg disabled:opacity-30"><FiChevronRight size={16} /></button>
             </div>
          </div>
        </div>
      ) : (
        /* 🔹 Migration View */
        <div className="space-y-6 pb-20">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest italic mb-6 flex items-center gap-2">
              <FiFilter className="text-red-600" /> Select Source Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <CustomSelect 
                label="Course"
                options={migrationOptions.courses}
                value={migrationFilters.course}
                onChange={(v) => setMigrationFilters({ ...migrationFilters, course: v })}
                placeholder="Select Course"
                icon={FiBookOpen}
              />
              <CustomSelect 
                label="Year"
                options={migrationOptions.years}
                value={migrationFilters.year}
                onChange={(v) => setMigrationFilters({ ...migrationFilters, year: v })}
                placeholder="Select Year"
                disabled={!migrationFilters.course}
              />
              <CustomSelect 
                label="Current Semester"
                options={migrationOptions.semesters}
                value={migrationFilters.semester}
                onChange={(v) => setMigrationFilters({ ...migrationFilters, semester: v })}
                placeholder="Select Semester"
                disabled={!migrationFilters.year}
              />
              <button
                onClick={handleSearchMigration}
                className="h-[46px] bg-[#111111] text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <FiSearch /> Load Students
              </button>
            </div>
          </div>

          {migratingStudents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 bg-white/50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-red-600 rounded"
                    checked={selectedForMigration.length === migratingStudents.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedForMigration(migratingStudents.map(s => s._id));
                      else setSelectedForMigration([]);
                    }}
                  />
                  <span className="text-[10px] font-black uppercase text-gray-500 italic">Select All ({migratingStudents.length})</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <FiArrowRight className="text-gray-400" />
                    <div className="w-64">
                      <CustomSelect 
                        options={migrationOptions.semesters}
                        value={targetSemester}
                        onChange={setTargetSemester}
                        placeholder="Target Semester"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleBulkMigrate}
                    disabled={isMigrating || selectedForMigration.length === 0}
                    className="flex items-center gap-3 px-8 py-3 bg-red-600 text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {isMigrating ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                    Migrate Selected
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/30">
                    <tr>
                      <th className="px-6 py-4 w-10"></th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Student ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 italic">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {migratingStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-white/50 transition-all">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 accent-red-600 rounded"
                            checked={selectedForMigration.includes(student._id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedForMigration([...selectedForMigration, student._id]);
                              else setSelectedForMigration(selectedForMigration.filter(id => id !== student._id));
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 italic">{student.studentId}</span>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black uppercase text-gray-700 italic">{student.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase italic">
                            SEM {student.semester}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🔹 Student Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-300 print:relative print:bg-white print:p-0 print:z-0">
           <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 print:shadow-none print:w-full print:max-w-none print:rounded-none">
              {/* Modal Header */}
              <div className="h-32 bg-gradient-to-r from-[#111111] to-red-900 p-8 flex justify-between items-start relative print:bg-none print:text-black print:border-b-2 print:border-black print:h-auto">
                 <div>
                    <h3 className="text-white text-2xl font-black uppercase italic tracking-tight print:text-black">{selectedStudent.name}</h3>
                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-1 italic flex items-center gap-2 print:text-gray-600">
                       <FiShield className="print:hidden"/> Student Registry ID: {selectedStudent.studentId}
                    </p>
                 </div>
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all print:hidden"
                 >
                    <FiX size={20} />
                 </button>
              </div>

              {/* Modal Content */}
              <div className="p-10 print:p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
                    {/* Personal Info */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest italic border-b border-gray-50 pb-2 print:text-black">Personal Information</h4>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 print:hidden"><FiUser /></div>
                             <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Legal Name</p>
                                <p className="text-xs font-bold text-gray-900 italic uppercase">{selectedStudent.name}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 print:hidden"><FiBookOpen /></div>
                             <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Course</p>
                                <p className="text-xs font-bold text-gray-900 italic uppercase">{selectedStudent.course}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 print:hidden"><FiPhone /></div>
                             <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Contact</p>
                                <p className="text-xs font-bold text-gray-900 italic uppercase">{selectedStudent.moNumber}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Guardian Info */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest italic border-b border-gray-50 pb-2 print:text-black">Guardian Details</h4>
                       <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Father</p>
                                <p className="text-xs font-bold text-gray-900 italic uppercase">{selectedStudent.parentName}</p>
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Mother</p>
                                <p className="text-xs font-bold text-gray-900 italic uppercase">{selectedStudent.motherName}</p>
                             </div>
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Resident Address</p>
                             <p className="text-xs font-bold text-gray-900 italic uppercase leading-relaxed">{selectedStudent.address}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Modal Footer */}
                 <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end gap-3 print:hidden">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white text-gray-600 rounded-lg text-[10px] font-black uppercase italic tracking-widest border border-gray-200">Cancel</button>
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95"
                    >
                       <FiPrinter /> Print Profile
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Studentlist;




