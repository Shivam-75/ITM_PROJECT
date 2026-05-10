import { useState, useCallback, useEffect, useMemo } from "react";
import ModelPaperForm from "../../components//modelpaper/ModelPaperForm";
import ModelPaperTable from "../../components/modelpaper/ModelPaperTable";
import useDebounce from "../../../hooks/useDebounce";

const ModelPaper = () => {
  const [modelPapers, setModelPapers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  // 🔹 Load once
  useEffect(() => {
    const data = localStorage.getItem("modelPapers");
    if (data) setModelPapers(JSON.parse(data));
  }, []);

  // 🔹 Persist
  useEffect(() => {
    localStorage.setItem("modelPapers", JSON.stringify(modelPapers));
  }, [modelPapers]);

  // 🔹 Save / Update
  const handleSave = useCallback(
    (data) => {
      setModelPapers((prev) => {
        if (editItem) {
          return prev.map((p) =>
            p.id === editItem.id ? { ...data, id: editItem.id } : p
          );
        }

        return [
          ...prev,
          {
            ...data,
            id: Date.now(),
            fileUrl: URL.createObjectURL(data.file),
          },
        ];
      });

      setShowForm(false);
      setEditItem(null);
    },
    [editItem]
  );

  const handleEdit = useCallback((item) => {
    setEditItem(item);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setModelPapers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const filteredModelPapers = useMemo(() => {
    if (!debouncedSearch) return modelPapers;
    return modelPapers.filter((p) =>
      p.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [modelPapers, debouncedSearch]);

  return (
    <div className="flex  bg-[var(--background-light)]">

      <main
        className="ml-0 
      pt-30
      h-screen
      overflow-y-auto
      px-4 sm:px-6 md:px-8 w-full mx-auto pb-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Model Paper</h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[var(--primary)] text-white px-4 py-2 rounded">
              + Add Model Paper
            </button>
          )}
        </div>

        <div className="mb-4 max-w-sm">
          <input
            type="text"
            placeholder="Search by subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm"
          />
        </div>

        {showForm && (
          <ModelPaperForm
            initialData={editItem}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditItem(null);
            }}
          />
        )}

        {!showForm && (
          <ModelPaperTable
            data={filteredModelPapers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
};

export default ModelPaper;
