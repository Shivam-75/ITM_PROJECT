import { useState, useEffect, useCallback, useMemo } from "react";
import NoticeForm from "../../components/notice/NoticeForm";
import NoticeList from "../../components/notice/NoticeList";
import BigLoader from "../../common/BigLoader";
import { toast } from "react-toastify";
import { WorkAPI } from "../../api/apis";
import useAuth from "../../../store/FacultyStore";

const NoticeDashboard = () => {
  // ================= STATES =================
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState("show"); // show | add
  const [search, setSearch] = useState("");
  const [editNotice, setEditNotice] = useState(null);
  const { toststyle } = useAuth();
  const [deleteLoading, setdeleteloading] = useState(false);



  // ================= ADD NOTICE =================
  const handleAddNotice = useCallback(
    (serverData) => {
      setNotices((prev) => {
        // UPDATE
        if (editNotice) {
          return prev.map((n) =>
            (n._id || n.id) === (editNotice._id || editNotice.id) ? { ...n, ...serverData } : n
          );
        }

        // CREATE - Prefer Server Data (with _id)
        const newNotice = serverData?.title ? serverData : {
            id: Date.now(),
            ...serverData,
            createdAt: new Date()
        };

        return [newNotice, ...prev];
      });

      setEditNotice(null);
      setActiveTab("show");
    },
    [editNotice]
  );

  // ================= EDIT =================
  const handleEdit = useCallback((notice) => {
    setEditNotice(notice);
    setActiveTab("add");
  }, []);

  const getNotice = useCallback(async () => {
    try {
      setdeleteloading(true);

      const { data } = await WorkAPI.get(
        "/Notice/uploader",
        { withCredentials: true }
      );

      console.log(data);
      setNotices(data?.findNotice);




    } catch (err) {
      console.log(err.response?.data?.message || err.message);

    } finally {
      setdeleteloading(false);
    }
  }, [WorkAPI]);

  useEffect(() => {
    getNotice();
  }, []);

  const handleDelete = async (id) => {
    try {
      setdeleteloading(true);
      const { data } = await WorkAPI.delete(
        `/Notice/Delete/${id}`,
        { withCredentials: true }
      );

      console.log(data);
      toast.success("Successfully Notice Deleted !!", toststyle)
      setNotices((prev) => prev.filter(item => (item._id || item.id) !== id));

    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      toast.error(" Notice Not Deleted !!", toststyle)
    } finally {
      setdeleteloading(false);
    }
  }

  return (
    <div className="flex bg-white min-h-[100dvh]">

      <main className="flex-1 space-y-10 animate-in fade-in duration-700 pb-20">
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                  Notice Board
                </h1>
            </div>

            <div className="flex bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                  <button 
                    onClick={() => setActiveTab("add")}
                    className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === 'add' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    Publish
                  </button>
                  <button 
                    onClick={() => setActiveTab("show")}
                    className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === 'show' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    Archive
                  </button>
            </div>
        </div>

        {/* ADD NOTICE */}
        {activeTab === "add" && (
          <NoticeForm onSave={handleAddNotice} initialData={editNotice} />
        )}

        {/* SHOW NOTICE */}
        {activeTab === "show" &&
          (deleteLoading ? (
            <div className="absolute top-[50%] left-[45%]">
              <BigLoader />
            </div>
          ) : (
            <NoticeList
              data={notices}
              onDelete={handleDelete}
            />
          ))}
      </main>
    </div>
  );
};

export default NoticeDashboard;



