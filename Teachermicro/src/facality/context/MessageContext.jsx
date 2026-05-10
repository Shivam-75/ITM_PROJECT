import { createContext, useContext, useState, useCallback } from "react";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback((newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  }, []);

  const markSeen = useCallback((msgId, studentId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId ? { ...msg, seenBy: [...msg.seenBy, studentId] } : msg
      )
    );
  }, []);

  // ✅ EDIT MESSAGE
  const editMessage = useCallback((id, newText) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text: newText } : msg))
    );
  }, []);

  // ✅ DELETE MESSAGE
  const deleteMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return (
    <MessageContext.Provider
      value={{ messages, sendMessage, markSeen, editMessage, deleteMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);



