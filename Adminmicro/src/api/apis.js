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

            if (
                error.response?.status === 403 &&
                !originalRequest._retry &&
                !originalRequest.url.includes("/refreshToken")
            ) {
                originalRequest._retry = true;

                try {
                    await axiosInstance.post("/refreshToken");

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token expired, logging out...");
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

export const TeacherAuthAPI = createAxiosInstance(
    import.meta.env.VITE_BASE_Teacher_Auth
);
