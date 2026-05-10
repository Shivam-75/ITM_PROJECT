import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProviderData } from "./store/FacultyStore.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <ProviderData>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </ProviderData>,
);
