import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./facality/ui/Layout";
import { lazy, Suspense } from "react";

import Dashboard from "./facality/page/Dashboard";
import Notifications from "./facality/page/Notifications";
import ModelPaper from "./facality/page/works/ModelPaper";
import NoticeDashboard from "./facality/page/works/NoticeDashboard";
import Attendance from "./facality/page/classes/Attendance";
import StudentListPage from "./facality/page/classes/students/StudentListPage";
import StudentProfilePage from "./facality/page/classes/students/StudentProfilePage";
import AddLecture from "./facality/page/lectures/AddLecture";
import LectureList from "./facality/page/lectures/LectureList";
import Fontpage from "./facality/ui/Fontpage";
import Timetable from "./facality/page/TimeTable/Timetable";
import RoomAllocation from "./facality/components/Hostelwarden/RoomAllocation";
import HostelRegistration from "./facality/page/works/HostelRegistration";
import Complain from "./facality/components/Hostelwarden/Complain";
import HostelStudent from "./facality/components/Hostelwarden/Hostelstudent";
import HostelReport from "./facality/components/Hostelwarden/Hostelreport";
import Event from "./facality/components/ParamparaEvent/Event";
import Exams from "./facality/components/Exams/Exams";
import FacResult from "./facality/components/Exams/FacResult";
import ResultList from "./facality/components/Exams/ResultList";
import HomeworkForm from "./facality/components/homework/HomeworkForm";
import AssignmentForm from "./facality/components/assignment/AssignmentForm";


// import StudentDetails from "./facality/components/studentComponents/StudentDetails";

import FeeSubmission from "./facality/page/Fees/FeeSubmission";

const App = () => {
  const routes = createBrowserRouter([

    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/notifications",
          element: <Notifications />,
        },
        {
          path: "homework",
          element: <HomeworkForm />,
        },
        {
          path: "assignment",
          element: <AssignmentForm />,
        },
        {
          path: "model-paper",
          element: <ModelPaper />,
        },
        {
          path: "notice",
          element: <NoticeDashboard />,
        },
        {
          path: "attendance",
          element: <Attendance />,
        },
        {
          path: "fee-submission",
          element: <FeeSubmission />,
        },
        {
          path: "studentsList",
          element: <StudentListPage />,
        },
        {
          path: "studentsProfile/:id",
          element: <StudentProfilePage />,
        },
        {
          path: "results",
          element: <FacResult />
        },

        {
          path: "timetable",
          element: <Timetable />,
        },

        {
          path: "online",
          element: <LectureList />,
        },
        {
          path: "online/view",
          element: <AddLecture />,
        },
        {
          path: "online/edit/:id",
          element: <AddLecture />,
        },
        {
          path: "room-allocation",
          element: <HostelRegistration />
        },
        {
          path: "hostel-complaints",
          element: <Complain />
        },
        {
          path: "hostel-students",
          element: <HostelStudent />
        },
        {
          path: "hostel-reports",
          element: <HostelReport />
        },
        {
          path: "parampara-events",
          element: <Event />
        },
        {
          path: "exam-schedule",
          element: <Exams />
        },
        {
          path: "result-list",
          element: <ResultList />
        },

      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};
export default App;



