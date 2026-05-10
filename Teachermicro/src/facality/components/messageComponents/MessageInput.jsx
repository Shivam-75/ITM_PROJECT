import React, { useState } from "react";
import { useMessage } from "../../../facality/context/MessageContext";
import { createMessage } from "./utils/messageHelpers";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage } = useMessage();

  const handleSend = () => {
    if (!text.trim()) return;

    const newMessage = createMessage({
      text,
      receiverClass: "BCA-2A",
    });

    sendMessage(newMessage);

    setText("");
  };

  return (
    <div className="p-3 border-t flex gap-2">
      <input
        className="flex-1 border rounded px-3"
        placeholder="Type message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 rounded py-2"
        onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default React.memo(MessageInput);
