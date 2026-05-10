import { useState } from "react";
import { useMessage } from "../../../facality/context/MessageContext";
// import { useMessage } from "../../context/MessageContext";

const MessageBubble = ({ msg, role = "faculty" }) => {
  const { editMessage, deleteMessage } = useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text);

  const handleEditSave = () => {
    if (!editText.trim()) return;
    editMessage(msg.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="relative bg-blue-50 border rounded-lg p-3">
      {/* Actions (Faculty Only) */}
      {role === "faculty" && (
        <div className="absolute top-2 right-2 flex gap-2 text-xs">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:underline">
            Edit
          </button>
          <button
            onClick={() => deleteMessage(msg.id)}
            className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      )}

      {/* Message Content */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="w-full border rounded p-2 text-sm"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs border rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-800">{msg.text}</p>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
            <span>{msg.seenBy.length > 0 ? "Seen ✔" : "Unseen ⏳"}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageBubble;



