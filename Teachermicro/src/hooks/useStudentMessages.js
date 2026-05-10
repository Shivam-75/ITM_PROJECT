// // import { useMessage } from "../context/MessageContext";
// import { useMemo } from "react";
// import { useMessage } from "../facality/context/MessageContext";

// const useStudentMessages = (studentClass) => {
//   const { messages } = useMessage();

//   const filteredMessages = useMemo(
//     () =>
//       messages.filter(
//         (msg) => msg.receiverClass === studentClass
//       ),
//     [messages, studentClass]
//   );

//   return filteredMessages;
// };

// export default useStudentMessages;
