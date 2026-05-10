import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import BroadcastPanel from "./BroadcastPanel";

const MessageBot = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      <BroadcastPanel />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default MessageBot;



