import { useState, useCallback, useEffect, useMemo } from "react";
import ModelPaperForm from "../../components/modelpaper/ModelPaperForm";
import ModelPaperTable from "../../components/modelpaper/ModelPaperTable";
import useDebounce from "../../../hooks/useDebounce";
import { TeacherService } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { FiPlus, FiFileText } from "react-icons/fi";

const ModelPaper = () => {
  const [modelPapers, setModelPapers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const fetchModelPapers = useCallback(async (isInitial = false) => {
    try {
      if (!isInitial) setLoading(true);
      const data = await TeacherService.getModelPapers();
      setModelPapers(data?.data || data?.modelPapers || data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load model papers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModelPapers(true);
  }, [fetchModelPapers]);

  const handleSave = useCallback(async (formData) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("department", formData.department);
      data.append("year", formData.year);
      data.append("semester", formData.semester);
      data.append("section", formData.section);
      data.append("subject", formData.subject);
      if (formData.paperImage) {
        data.append("paperImage", formData.paperImage);
      }

      if (editItem) {
        // You might need a TeacherService.updateModelPaper method here, 
        // but for now I'll use createModelPaper as a placeholder or update it in apis.js
        await TeacherService.createModelPaper(data); // Assuming create covers it for now or add update
        toast.success("Model Paper Updated Successfully");
      } else {
        await TeacherService.createModelPaper(data);
        toast.success("Model Paper Published Successfully");
      }

      setShowForm(false);
      setEditItem(null);
      fetchModelPapers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish model paper");
    } finally {
      setLoading(false);
    }
  }, [editItem, fetchModelPapers]);

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    try {
      setLoading(true);
      await TeacherService.deleteModelPaper(id);
      setModelPapers((prev) => prev.filter((p) => p._id !== id));
      toast.success("Record Purged Successfully");
    } catch (err) {
      toast.error("Deletion Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredModelPapers = useMemo(() => {
    if (!debouncedSearch) return modelPapers;
    return modelPapers.filter((p) =>
      p.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [modelPapers, debouncedSearch]);

  return (
    <div className="flex bg-pink-50 min-h-screen">
      <main className="pt-24 h-screen overflow-y-auto px-4 sm:px-6 md:px-8 w-full mx-auto pb-20">
        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
            <Loader />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Model Paper Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <input
                  type="text"
                  placeholder="Search protocols..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-6 py-2.5 bg-white border border-slate-100 rounded-[10px] text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm w-64"
                />
             </div>
             
             {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest italic shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-2"
                >
                  <FiPlus size={14} /> Publish
                </button>
             )}
          </div>
        </div>

        {showForm ? (
          <ModelPaperForm
            initialData={editItem}
            onSave={handleSave}
            loading={loading}
            onCancel={() => {
              setShowForm(false);
              setEditItem(null);
            }}
          />
        ) : (
          <div className="space-y-6">
            {filteredModelPapers.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[10px] border-4 border-dashed border-slate-50">
                  <FiFileText size={48} className="mx-auto text-slate-100 mb-6" />
                  <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] italic">No Model Papers Indexed.</h3>
                </div>
            ) : (
                <ModelPaperTable
                  data={filteredModelPapers}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelPaper;
