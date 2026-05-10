import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReportAPI } from "../../api/apis";
import { 
  FiUserPlus, 
  FiSearch, 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2, 
  FiMail,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Faculitylist = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Faculty Data State
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Live Faculty Data
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await ReportAPI.get("/Staff/list");
      if (response.data.data) {
        setFacultyData(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch faculty data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Filter Data based on Search
  const filteredFaculty = facultyData.filter(faculty => 
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handlers
  const openDeleteModal = (faculty) => {
    setFacultyToDelete(faculty);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (facultyToDelete) {
      try {
        const response = await ReportAPI.delete(`/Staff/delete/${facultyToDelete._id}`);
        if (response.status === 200) {
          toast.success(`${facultyToDelete.name} has been removed`);
          fetchFaculty();
        }
      } catch (error) {
        toast.error("Deletion Failed");
      } finally {
        setIsDeleteModalOpen(false);
        setFacultyToDelete(null);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/faculty/edit/${id}`);
  };

  return (
    <div className="space-y-6 relative">
      {loading && <Loader />}
      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAlertTriangle size={40} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Member?</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You are about to permanently remove <span className="font-bold text-gray-900">{facultyToDelete?.name}</span> from the database. This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-[98%] mx-auto md:w-full">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Faculty Directory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage {facultyData.length} academic staff members</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search faculty..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all w-full md:w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
              }}
            />
          </div>
          
          <button
            onClick={() => navigate("/faculty/add")}
            className="flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <FiUserPlus size={18} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-[98%] mx-auto md:w-full">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Member</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Department</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Credentials</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Joining Date</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((faculty) => (
                <tr key={faculty._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={faculty.image?.startsWith("http") ? faculty.image : `http://localhost:5002${faculty.image}`}
                          alt={faculty.name}
                          className="w-11 h-11 rounded-xl bg-gray-100 object-cover ring-2 ring-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{faculty.name}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <FiMail className="inline" /> {faculty.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600 uppercase tracking-wide">
                      {faculty.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-700">{faculty.higherQualification}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 uppercase font-bold tracking-tight">{faculty.qualification}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-600">{faculty.doj}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(faculty._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(faculty)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all">
                        <FiMoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        
        {currentItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-gray-300" size={24} />
            </div>
            <h3 className="text-gray-900 font-bold">No members found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Improved Pagination Controls */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] opacity-80">
            Page {currentPage} of {totalPages || 1} • {filteredFaculty.length} Results
          </span>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft size={16} />
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            </div>

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faculitylist;
