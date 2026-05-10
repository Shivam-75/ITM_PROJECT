import { createContext, useContext, useState } from "react";
import { Bounce, toast } from "react-toastify";

const FacultyContext = createContext();

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
    localStorage.getItem("tecLogged") === "true"
  );

  const UserLogsData = () => {
    setuserLogin(true);
    localStorage.setItem("tecLogged", "true");
  };

  const userLogoutData = () => {
    setuserLogin(false);
    localStorage.removeItem("tecLogged");
  };

  return (
    <FacultyContext.Provider
      value={{
        toststyle, UserLogsData, userLogoutData, userLogin
      }}>
      {children}
    </FacultyContext.Provider>
  );
};
const useAuth = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error("Elements Outside");
  }
  return context;
};
export default useAuth;
