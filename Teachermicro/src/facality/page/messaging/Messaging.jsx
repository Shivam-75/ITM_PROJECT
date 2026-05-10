import InboxList from "../../components/messageComponents/InboxList";
import MessageBot from "../../components/messageComponents/MessageBot";
import { MessageProvider } from "../../context/MessageContext";

// 🔹 role: "faculty" | "student"
const Messaging = ({ role = "faculty" }) => {
  return (
    <MessageProvider>
      <div className="ml-0  pt-28 px-4 sm:px-6 md:px-8 pb-10 min-h-screen bg-white">
        {/* Main Card */}
        <div className="w-full bg-white rounded-lg shadow-sm border flex flex-col h-[80vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Communication
              </h2>
              <p className="text-sm text-gray-500">
                Faculty to Student Messaging
              </p>
            </div>

            {/* Role Badge */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                ${
                  role === "faculty"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}>
              {role === "faculty" ? "Faculty Panel" : "Student Panel"}
            </span>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden bg-white">
            <div className="h-full p-4 sm:p-6">
              {role === "faculty" ? (
                <MessageBot />
              ) : (
                <InboxList studentId="stu_01" />
              )}
            </div>
          </div>

          {/* Footer (Optional – Professional Touch) */}
          <div className="px-6 py-3 border-t text-xs text-gray-400 text-center">
            Messages are read-only for students
          </div>
        </div>
      </div>
    </MessageProvider>
  );
};

export default Messaging;



