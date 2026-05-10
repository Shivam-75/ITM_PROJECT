import ModelPaperRow from "./ModelPaperRow";

const ModelPaperTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Subject</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Department</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Semester/Section</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-center">Paper</th>
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item) => (
              <ModelPaperRow
                key={item._id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelPaperTable;
