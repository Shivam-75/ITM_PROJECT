import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./ui/Layout";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

const Dashboards = lazy(() => import("./page/Dashboard"));
const Profile = lazy(() => import("./page/Profile"));
const Feestructure = lazy(() => import("./Fee/Feestructure"));
const Studentlist = lazy(() => import("./academic/student/Studentlist"));
const Studentadd = lazy(() => import("./academic/student/Studentadd"));
const Faculitylist = lazy(() => import("./academic/faculity/Faculitylist"));
const FaculityAdd = lazy(() => import("./academic/faculity/FaculityAdd"));
const FaculityEdit = lazy(() => import("./academic/faculity/FaculityEdit"));
const SubjectList = lazy(() => import("./academic/subject/SubjectList"));
const Attendancereport = lazy(() => import("./components/navbar/Attendance/Attendancereport"));
const Exams = lazy(() => import("./components/navbar/Exam/Exams"));
const Resultschedule = lazy(() => import("./components/navbar/Exam/Resultschedule"));
const Examdashboard = lazy(() => import("./components/navbar/Exam/Examdashboard"));
const Hosteldeshboard = lazy(() => import("./components/navbar/Hostel/Hosteldeshboard"));
const Roomallocation = lazy(() => import("./components/navbar/Hostel/Roomallocation"));
const Hostelstudent = lazy(() => import("./components/navbar/Hostel/Hostelstudent"));
const Settings = lazy(() => import("./page/Settings"));
const SectionRegistry = lazy(() => import("./academic/section/SectionRegistry"));
const SemesterRegistry = lazy(() => import("./academic/semester/SemesterRegistry"));
const YearRegistry = lazy(() => import("./academic/year/YearRegistry"));
const BatchRegistry = lazy(() => import("./academic/batch/BatchRegistry"));
const AdministratorRegistration = lazy(() => import("./page/AdministratorRegistration"));
const PlacementDashboard = lazy(() => import("./components/navbar/Placement/PlacementDashboard"));
const BulkResults = lazy(() => import("./components/navbar/Exam/BulkResults"));
const Feepayment = lazy(() => import("./Fee/Feepayment"));

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Dashboards />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "fee-structure",
          element: <Feestructure />,
        },
        {
          path: "fee-payments",
          element: <Feepayment />,
        },

        {
          path: "sections",
          element: <SectionRegistry />,
        },
        {
          path: "semesters",
          element: <SemesterRegistry />,
        },
        {
          path: "years",
          element: <YearRegistry />,
        },
        {
          path: "batches",
          element: <BatchRegistry />,
        },
        {
          path: "subjects",
          children: [
            {
              index: true,
              element: <SubjectList />,
            },
          ],
        },
        {
          path:"hostel",
          element:<Hosteldeshboard />
        },
        {
          path:"hostel/rooms",
          element:<Roomallocation />
        },
        {
          path:"/hostel/students",
          element:<Hostelstudent />
        },
        {
          path:"exams",
          element:<Examdashboard />
        },
        {
          path:"results",
          element:<Resultschedule />
        },
        {
          path:"exam-schedule",
          element:<Exams />
        },
        {
          path:"sessional-results",
          element:<BulkResults />
        },
        {
          path:"placements",
          element:<PlacementDashboard />
        },
        {
          path:"attendance-report",
          element:<Attendancereport />
        },
        {
          path: "students",
          element: <Studentlist />,
        },
        { path: "students/add", element: <Studentadd /> },

        {
          path: "faculty",
          children: [
            {
              index: true,
              element: <Faculitylist />,
            },
            {
              path: "add",
              element: <FaculityAdd />,
            },
            {
              path: "edit/:id",
              element: <FaculityEdit />,
            },
          ],
        },
        {
          path: "admin-registration",
          element: <AdministratorRegistration />,
        },
        {
          path: "admin/settings/:tab?",
          element: <Settings />,
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




