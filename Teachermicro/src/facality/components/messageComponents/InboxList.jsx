// import { useMessage } from "../../context/MessageContext";

import { useMessage } from "../../../facality/context/MessageContext";

const InboxList = ({ studentId }) => {
  const { messages, markSeen } = useMessage();

  return (
    <div className="p-3 space-y-3">
      {messages.map((msg) => {
        const isSeen = msg.seenBy.includes(studentId);

        if (!isSeen) markSeen(msg.id, studentId);

        return (
          <div key={msg.id} className="border p-3 rounded">
            <p>{msg.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default InboxList;



