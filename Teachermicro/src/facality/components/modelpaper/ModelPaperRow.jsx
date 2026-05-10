import React from "react";
import { Link } from "react-router-dom";

const ModelPaperRow = React.memo(({ item, onEdit, onDelete }) => {
  return (
    <tr className="border-t align-top hover:bg-gray-50 transition">
      {/* SUBJECT */}
      <td className="px-4 py-3 font-medium text-gray-800">
        {item.subject}
      </td>

      {/* CLASS */}
      <td className="px-4 py-3 text-gray-700">
        {item.className}
      </td>

      {/* DATE */}
      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
        {item.paperDate}
      </td>

      {/* FILE ACTIONS */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-3">
          <Link
            to={item.fileUrl}
            target="_blank"
            reloadDocument
            className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            👁 View
          </Link>

          <Link
            to={item.fileUrl}
            download
            reloadDocument
            className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
          >
            ⬇ Download
          </Link>
        </div>
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
        <button
          onClick={() => onEdit(item)}
          className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 text-xs rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 text-xs rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

export default ModelPaperRow;
