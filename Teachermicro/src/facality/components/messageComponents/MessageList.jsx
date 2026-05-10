// import { useMessage } from "../../context/MessageContext";
import { useMessage } from "../../../facality/context/MessageContext";
import MessageBubble from "./MessageBubble";

const MessageList = ({ role = "faculty" }) => {
  const { messages } = useMessage();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} role={role} />
      ))}
    </div>
  );
};

export default MessageList;
