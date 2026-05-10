// 🔹 Create a new message object
export const createMessage = ({
  text,
  sender = "faculty",
  receiverClass,
}) => {
  return {
    id: Date.now().toString(),
    sender,
    receiverClass,
    text,
    createdAt: new Date(),
    seenBy: [],
  };
};

// 🔹 Sort messages by time (old → new)
export const sortMessagesByTime = (messages) => {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
};

// 🔹 Check message seen or not (student side)
export const isMessageSeen = (message, studentId) => {
  return message.seenBy.includes(studentId);
};

// 🔹 Mark message as seen (immutable)
export const markMessageSeen = (message, studentId) => {
  if (message.seenBy.includes(studentId)) return message;

  return {
    ...message,
    seenBy: [...message.seenBy, studentId],
  };
};

