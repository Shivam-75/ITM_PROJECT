import { useState, useCallback, useEffect } from "react";
import LectureForm from "../../components/lectureComponents/LectureForm.jsx";
import LectureTable from "../../components/lectureComponents/LectureTable.jsx";
import BigLoader from "../../common/BigLoader.jsx";
import { WorkAPI } from "../../api/apis.js";
import { toast } from "react-toastify";
import useAuth from "../../../store/FacultyStore.jsx";

export default function LectureList() {
  const [links, setLinks] = useState([]);
  const [linkLoader, setLinkLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("archive"); // archive | conduct
  const { toststyle } = useAuth();

  const getLinks = useCallback(async () => {
    try {
      setLinkLoader(true);
      const { data } = await WorkAPI.get("/Link/Uploader", { withCredentials: true });
      setLinks(data?.findUserLinks || []);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLinkLoader(false);
    }
  }, []);

  useEffect(() => {
    getLinks();
  }, [getLinks]);

  const handleDeleteLecture = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this session record?")) return;
    setLinks(prev => prev.filter(item => item._id !== id));
    try {
      setLinkLoader(true);
      const { data } = await WorkAPI.delete(`/Link/Delete/${id}`, { withCredentials: true });
      toast.success(data?.message || "Session Record Purged", toststyle);
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion Failed", toststyle);
    } finally {
      setLinkLoader(false);
    }
  }, [toststyle]);

  return (
    <div className="flex-1 space-y-10 bg-transparent animate-in fade-in duration-700 pb-20">
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                  Virtual Class
                </h1>
            </div>

            <div className="flex bg-white p-1.5 rounded-[10px] border border-slate-100 shadow-sm">
                  <button 
                    onClick={() => setActiveTab("conduct")}
                    className={`px-8 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === 'conduct' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
                  >
                    Conduct
                  </button>
                  <button 
                    onClick={() => setActiveTab("archive")}
                    className={`px-8 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === 'archive' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
                  >
                    Archive
                  </button>
            </div>
        </div>

        {activeTab === 'conduct' ? (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
                <LectureForm onSuccess={() => setActiveTab("archive")} refreshList={getLinks} />
            </div>
        ) : (
            linkLoader ? (
                <div className="flex justify-center items-center h-[50vh]">
                  <BigLoader />
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                    <LectureTable
                      data={links}
                      onDelete={handleDeleteLecture}
                    />
                </div>
              )
        )}
    </div>
  );
}


