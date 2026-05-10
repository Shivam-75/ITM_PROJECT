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

            if (
                (error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._retry
            ) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
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
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    console.error("Refresh token expired, logging out...");
                    // Optional: clear local storage/store here
                    window.location.href = "/";
                    return Promise.reject(refreshError);
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

export const TeacherAuthAPI = createAxiosInstance(
    import.meta.env.VITE_BASE_Teacher_Auth
);

// 🔹 Academic & Student Services
export const AcademicService = {
    getCourses: () => axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
    getYears: (courseName) => axios.get(`http://localhost:5002/api/v3/Admin/Academic/years?courseName=${courseName}`, { withCredentials: true }),
    getSemesters: (courseName, yearName) => axios.get(`http://localhost:5002/api/v3/Admin/Academic/semesters?courseName=${courseName}&yearName=${yearName}`, { withCredentials: true }),
    migrateStudents: (data) => WorkAPI.post("/Admin/migrate-students", data),
};

export const StudentService = {
    getStudentsForMigration: (course, year, semester) => 
        ReportAPI.get(`/student-list?course=${course}&year=${year}&semester=${semester}`),
};

export const ReportService = {
    getAllStudents: () => authAPI.get("/StudentList"),
    deleteProfile: (id) => authAPI.delete(`/StudentList/Deleted/${id}`),
};

