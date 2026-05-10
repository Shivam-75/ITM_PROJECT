import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Syllabus from "./page/Syllbus";
import Layout from "./ui/Layout";
import Homework from "./page/Homework";
import Assignment from "./page/Assignment";
import ModelPaper from "./page/ModelPaper";
import Notice from "./page/Notice";
import OnlineClass from "./page/OnlineClass";
import Result from "./page/Result";
import Timetable from "./page/Timetable";
import Attendence from "./page/Attendence";
import Dashboard from "./page/Dashboard";
import ExamSchedule from "./page/ExamSchedule";


const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      
        {
          path: "Syllbus",
          element: <Syllabus />,
        },
        {
          path: "homework",
          element: <Homework />,
        },
        {
          path: "assignment",
          element: <Assignment />,
        },
        {
          path: "model-paper",
          element: <ModelPaper />,
        },
        {
          path: "Notice",
          element: <Notice />,
        },
        {
          path: "online",
          element: <OnlineClass />,
        },
        {
          path: "result",
          element: <Result />,
        },
        {
          path: "timetable",
          element: <Timetable />,
        },
        {
          path: "attendance",
          element: <Attendence />,
        },
        {
          path: "exam-schedule",
          element: <ExamSchedule />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};
export default App;
