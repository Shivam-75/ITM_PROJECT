import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./facality/ui/Layout";
import { lazy, Suspense } from "react";

import Loader from "./facality/common/Loader";

const Dashboard = lazy(() => import("./facality/page/Dashboard"));
const Notifications = lazy(() => import("./facality/page/Notifications"));
const ModelPaper = lazy(() => import("./facality/page/works/ModelPaper"));
const NoticeDashboard = lazy(() => import("./facality/page/works/NoticeDashboard"));
const Attendance = lazy(() => import("./facality/page/classes/Attendance"));
const StudentListPage = lazy(() => import("./facality/page/classes/students/StudentListPage"));
const StudentProfilePage = lazy(() => import("./facality/page/classes/students/StudentProfilePage"));
const AddLecture = lazy(() => import("./facality/page/lectures/AddLecture"));
const LectureList = lazy(() => import("./facality/page/lectures/LectureList"));
const Timetable = lazy(() => import("./facality/page/TimeTable/Timetable"));
const HostelRegistration = lazy(() => import("./facality/page/works/HostelRegistration"));
const Complain = lazy(() => import("./facality/components/Hostelwarden/Complain"));
const HostelStudent = lazy(() => import("./facality/components/Hostelwarden/Hostelstudent"));
const HostelReport = lazy(() => import("./facality/components/Hostelwarden/HostelReport"));
const Event = lazy(() => import("./facality/components/ParamparaEvent/Event"));
const Exams = lazy(() => import("./facality/components/Exams/Exams"));
const FacResult = lazy(() => import("./facality/components/Exams/FacResult"));
const ResultList = lazy(() => import("./facality/components/Exams/ResultList"));
const HomeworkForm = lazy(() => import("./facality/components/homework/HomeworkForm"));
const AssignmentForm = lazy(() => import("./facality/components/assignment/AssignmentForm"));
const FeeSubmission = lazy(() => import("./facality/page/Fees/FeeSubmission"));

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

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={routes} />
    </Suspense>
  );
};
export default App;



