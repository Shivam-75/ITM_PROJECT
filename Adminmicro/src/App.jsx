import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./ui/Layout";
import Dashboards from "./page/Dashboard";
import Profile from "./page/Profile";
import Feestructure from "./Fee/FeeStructure";
import Studentlist from "./academic/student/Studentlist";
import Studentadd from "./academic/student/Studentadd";
import Faculitylist from "./academic/faculity/Faculitylist";
import FaculityAdd from "./academic/faculity/FaculityAdd";
import FaculityEdit from "./academic/faculity/FaculityEdit";
import SubjectList from "./academic/subject/SubjectList";
import Attendancereport from "./components/navbar/Attendance/Attendancereport";
import Exams from "./components/navbar/Exam/Exams";
import Resultschedule from "./components/navbar/Exam/Resultschedule";
import Examdashboard from "./components/navbar/Exam/Examdashboard";
import Hosteldeshboard from "./components/navbar/Hostel/Hosteldeshboard";
import Roomallocation from "./components/navbar/Hostel/Roomallocation";
import Hostelstudent from "./components/navbar/Hostel/Hostelstudent";
import Hostelfee from "./components/navbar/Hostel/Hostelfee";
import HostelFeeRegistry from "./components/navbar/Hostel/HostelFeeRegistry";
import Settings from "./page/Settings";
import SectionRegistry from "./academic/section/SectionRegistry";
import SemesterRegistry from "./academic/semester/SemesterRegistry";
import YearRegistry from "./academic/year/YearRegistry";
import BatchRegistry from "./academic/batch/BatchRegistry";
import AdministratorRegistration from "./page/AdministratorRegistration";
import PlacementDashboard from "./components/navbar/Placement/PlacementDashboard";

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
          path:"/hostel/fees",
          element:<Hostelfee />
        },
        {
          path:"/hostel/fee-registry",
          element:<HostelFeeRegistry />
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

  return <RouterProvider router={routes} />;
};
export default App;




