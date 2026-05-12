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

    // 🛡️ Request Interceptor: Stop requests before they leave if session is dead
    axiosInstance.interceptors.request.use(
        (config) => {
            if (window._isAuthRedirecting) {
                // Return a non-resolving promise to effectively "cancel" the request
                return new Promise(() => {});
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // 🛑 CRITICAL: If we are already redirecting, block everything
            if (window._isAuthRedirecting) {
                return new Promise(() => {}); 
            }

            if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._retry
            ) {
                // Prevent infinite loops if the error is from the refresh token itself
                if (originalRequest.url?.includes("refreshToken")) {
                    return Promise.reject(error);
                }

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
                    
                    isRefreshing = false;
                    processQueue(null);
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // FATAL SESSION FAILURE
                    window._isAuthRedirecting = true;
                    isRefreshing = false;
                    processQueue(refreshError, null);
                    
                    console.error("Session Expired: Redirecting to login...");
                    
                    // Clear storage to prevent loops in components
                    localStorage.removeItem("tecLogged");
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    window.location.href = "/";
                    return new Promise(() => {}); 
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

// 🔹 Teacher-Specific Services
export const HostelService = {
    getAllotments: () => WorkAPI.get("/Hostel/get-all-allotment"),
    registerHostel: (data) => WorkAPI.post("/Hostel/add-allotment", data),
};

export const ProfileService = {
    getTeacherProfile: () => ReportAPI.get("/teacher-profile"),
};

