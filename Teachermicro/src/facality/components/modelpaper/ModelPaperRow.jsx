import React from "react";
import { FiTrash2, FiEdit2, FiExternalLink, FiDownloadCloud } from "react-icons/fi";

const ModelPaperRow = React.memo(({ item, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50/50 transition-all group">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{item.subject}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.year}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-[10px] font-black text-slate-500 uppercase">{item.department}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-full">{item.semester}</span>
           <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-black uppercase rounded-full">{item.section}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-3">
          <a
            href={`http://localhost:5002${item.paperImage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="View Paper"
          >
            <FiExternalLink size={14} />
          </a>
          <a
            href={`http://localhost:5002${item.paperImage}`}
            download
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Download"
          >
            <FiDownloadCloud size={14} />
          </a>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default ModelPaperRow;
