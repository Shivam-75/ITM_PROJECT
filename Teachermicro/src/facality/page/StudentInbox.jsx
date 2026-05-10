// import { MessageProvider } from "../context/MessageContext";
// import InboxList from "../components/message/InboxList";

import InboxList from "../components/messageComponents/InboxList";
import { MessageProvider } from "../context/MessageContext";

const StudentInbox = () => {
  const student = {
    id: "stu_01",
    class: "BCA-2A",
  };

  return (
    <MessageProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded shadow h-[80vh] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Faculty Messages</h2>
            <p className="text-sm text-gray-500">Class: {student.class}</p>
          </div>

          {/* Inbox */}
          <InboxList studentId={student.id} studentClass={student.class} />
        </div>
      </div>
    </MessageProvider>
  );
};

export default StudentInbox;
