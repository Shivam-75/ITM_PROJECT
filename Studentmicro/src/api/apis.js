import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const createAxiosInstance = (baseURL) => {
    const axiosInstance = axios.create({
        baseURL,
        withCredentials: true,
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // 🛑 CRITICAL: If we are already redirecting due to a session failure, block everything
            if (window._isAuthRedirecting) {
                return new Promise(() => {}); 
            }

            if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._retry
            ) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            originalRequest._retry = true;
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    console.log("Attempting to refresh token...");
                    const authBase = import.meta.env.VITE_BASE_Auth;
                    await axios.post(`${authBase}/refreshToken`, {}, { withCredentials: true });
                    
                    processQueue(null);
                    isRefreshing = false;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    window._isAuthRedirecting = true; // Block all future interceptor logic
                    processQueue(refreshError, null);
                    
                    console.error("Session Expired: Redirecting to login...");
                    
                    // Clear storage to prevent loops in components
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    window.location.href = "/";
                    return new Promise(() => {}); // Swallow the error to prevent component-level retries
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export const authAPI = createAxiosInstance(
    import.meta.env.VITE_BASE_Auth
);
export const WorkAPI = createAxiosInstance(
    import.meta.env.VITE_BASE_WORK
);
export const ReportAPI = createAxiosInstance(
    import.meta.env.VITE_BASE_REPORT
);

export const AcademicAPI = createAxiosInstance(
    import.meta.env.VITE_BASE_ACADEMIC || "http://localhost:5002/api/v3/Admin/Academic"
);

// 🔹 Student-Specific Services
export const StudentProfileService = {
    getProfile: () => ReportAPI.get("/student-profile"),
};

export const StudentAcademicService = {
    getNotice: () => WorkAPI.get("/Notice/getNoticeDpt"),
    getFees: () => WorkAPI.get("/Fee/get-fee-structure"),
};

