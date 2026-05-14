import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./ui/Layout";
const Dashboard = lazy(() => import("./page/Dashboard"));
const Syllabus = lazy(() => import("./page/Syllbus"));
const Homework = lazy(() => import("./page/Homework"));
const Assignment = lazy(() => import("./page/Assignment"));
const ModelPaper = lazy(() => import("./page/ModelPaper"));
const Notice = lazy(() => import("./page/Notice"));
const OnlineClass = lazy(() => import("./page/OnlineClass"));
const Result = lazy(() => import("./page/Result"));
const Timetable = lazy(() => import("./page/Timetable"));
const Attendence = lazy(() => import("./page/Attendence"));
const ExamSchedule = lazy(() => import("./page/ExamSchedule"));
const Placements = lazy(() => import("./page/Placements"));

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Initializing Dashboard...</div>}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "Syllbus",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Loading Syllabus...</div>}>
              <Syllabus />
            </Suspense>
          ),
        },
        {
          path: "homework",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Fetching Tasks...</div>}>
              <Homework />
            </Suspense>
          ),
        },
        {
          path: "assignment",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Loading Assignments...</div>}>
              <Assignment />
            </Suspense>
          ),
        },
        {
          path: "model-paper",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Preparing Papers...</div>}>
              <ModelPaper />
            </Suspense>
          ),
        },
        {
          path: "Notice",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Syncing Bulletin...</div>}>
              <Notice />
            </Suspense>
          ),
        },
        {
          path: "online",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Entering Classroom...</div>}>
              <OnlineClass />
            </Suspense>
          ),
        },
        {
          path: "result",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Compiling Results...</div>}>
              <Result />
            </Suspense>
          ),
        },
        {
          path: "timetable",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Loading Schedule...</div>}>
              <Timetable />
            </Suspense>
          ),
        },
        {
          path: "attendance",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Checking Registry...</div>}>
              <Attendence />
            </Suspense>
          ),
        },
        {
          path: "exam-schedule",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Fetching Schedules...</div>}>
              <ExamSchedule />
            </Suspense>
          ),
        },
        {
          path: "placements",
          element: (
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-xs font-black uppercase tracking-widest text-gray-400 italic">Connecting Careers...</div>}>
              <Placements />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};
export default App;




