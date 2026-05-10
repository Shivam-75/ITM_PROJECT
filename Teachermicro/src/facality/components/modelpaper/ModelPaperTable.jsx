import ModelPaperRow from "./ModelPaperRow";
import { Link } from "react-router-dom";

const ModelPaperTable = ({ data, onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No model paper uploaded yet
      </div>
    );
  }

  return (
    <>
      {/* ================= DESKTOP / TABLET TABLE ================= */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">File</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <ModelPaperRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-4 space-y-3"
          >
            {/* Subject */}
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="font-medium">{item.subject}</p>
            </div>

            {/* Class */}
            <div>
              <p className="text-xs text-gray-500">Class</p>
              <p>{item.className}</p>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p>{item.paperDate}</p>
            </div>

            {/* File */}
            <div>
              <p className="text-xs text-gray-500 mb-1">File</p>
              <div className="flex gap-4 text-sm">
                <Link
                  to={item.fileUrl}
                  target="_blank"
                  reloadDocument
                  className="text-blue-600 underline"
                >
                 👁 View
                </Link>

                <Link
                  to={item.fileUrl}
                  download
                  reloadDocument
                  className="text-green-600 underline"
                >
                 ⬇ Download
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 bg-yellow-400 text-white text-sm py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex-1 bg-red-500 text-white text-sm py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ModelPaperTable;
