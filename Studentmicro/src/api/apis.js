import axios from "axios";

const createAxiosInstance = (baseURL) => {
    const axiosInstance = axios.create({
        baseURL,
        withCredentials: true,
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Handle 401 (Unauthorized) or 403 (Forbidden) errors
            if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._retry &&
                !originalRequest.url.includes("/refreshToken") &&
                !originalRequest.url.includes("/login")
            ) {
                originalRequest._retry = true;

                try {
                    // Attempt to refresh the token
                    console.log("Attempting to refresh token...");
                    await axiosInstance.post("/refreshToken");

                    // If successful, retry the original request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh fails (e.g. Refresh Token expired), logout the user
                    console.error("Session expired. Logging out...");
                    localStorage.removeItem("stLogged"); // Use the same key as AuthStore
                    window.location.href = "/";
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    // 🔥 IMPORTANT — RETURN KARO
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
