import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Zoom } from "react-toastify";
import { authAPI } from "../api/apis";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [loginRegistration, setloginregistration] = useState(false);
    const [userLogin, setuserLogin] = useState(
        localStorage.getItem("stLogged") === "true"
    );
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    const UserLogsData = (data) => {
        setuserLogin(true);
        localStorage.setItem("stLogged", "true");
        if (data) setStudent(data);
    };

    const userLogoutData = () => {
        setuserLogin(false);
        setStudent(null);
        localStorage.removeItem("stLogged");
    };

    const toaststyle = {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Zoom,
    };

    const fetchUserProfile = useCallback(async () => {
        // Check if we have a flag that we SHOULD be logged in
        const isLogged = localStorage.getItem("stLogged") === "true";
        if (!isLogged && !student) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data } = await authAPI.get("/userProfile");
            if (data?.StudentData) {
                setStudent(data.StudentData);
                setuserLogin(true);
                localStorage.setItem("stLogged", "true");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            // If the backend returns 404, it means the student ID in the token
            // no longer exists in the database (deleted). We must log out.
            if (err.response?.status === 404) {
                userLogoutData();
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Always attempt to fetch profile on mount or when login status changes
        fetchUserProfile();
    }, [fetchUserProfile, userLogin]);

    return (
        <AuthContext.Provider
            value={{
                userLogoutData,
                userLogin,
                loginRegistration,
                toaststyle,
                setloginregistration,
                UserLogsData,
                student,
                fetchUserProfile,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used inside AuthContextProvider");
    }
    return context;
};



