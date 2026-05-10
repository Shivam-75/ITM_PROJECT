import { createContext, useContext, useState } from "react";
import { Bounce } from "react-toastify";

const AdminContext = createContext();

export const ProviderData = ({ children }) => {
  const toststyle = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  };

  const [userLogin, setuserLogin] = useState(
    localStorage.getItem("admLogged") === "true"
  );

  const UserLogsData = () => {
    setuserLogin(true);
    localStorage.setItem("admLogged", "true");
  };

  const userLogoutData = () => {
    setuserLogin(false);
    localStorage.removeItem("admLogged");
  };

  return (
    <AdminContext.Provider
      value={{
        toststyle, UserLogsData, userLogoutData, userLogin
      }}>
      {children}
    </AdminContext.Provider>
  );
};
const useAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("Elements Outside");
  }
  return context;
};
export default useAuth;
