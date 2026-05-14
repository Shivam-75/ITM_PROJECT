import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

// 🔹 Advanced Global Cache
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; 

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
            if (window._isAuthRedirecting) return new Promise(() => {}); 

            if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(() => {
                        originalRequest._retry = true;
                        return axiosInstance(originalRequest);
                    }).catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const authBase = import.meta.env.VITE_BASE_Auth;
                    await axios.post(`${authBase}/refreshToken`, {}, { withCredentials: true });
                    isRefreshing = false;
                    processQueue(null);
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    window._isAuthRedirecting = true;
                    isRefreshing = false;
                    processQueue(refreshError, null);
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

export const authAPI = createAxiosInstance(import.meta.env.VITE_BASE_Auth);
export const WorkAPI = createAxiosInstance(import.meta.env.VITE_BASE_WORK);
export const ReportAPI = createAxiosInstance(import.meta.env.VITE_BASE_REPORT);
export const AcademicAPI = createAxiosInstance(import.meta.env.VITE_BASE_ACADEMIC || "http://localhost:5002/api/v3/Admin/Academic");

// 🔹 Caching Wrapper
export const cachedFetch = async (apiCall, key, forceRefresh = false) => {
    const cachedData = cache.get(key);
    if (!forceRefresh && cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        return cachedData.data;
    }
    const response = await apiCall();
    cache.set(key, { data: response, timestamp: Date.now() });
    return response;
};

export const invalidateCache = (key) => {
    if (key) cache.delete(key);
    else cache.clear();
};

// 🔹 Student Services
export const StudentProfileService = {
    getProfile: (force = false) => cachedFetch(() => ReportAPI.get("/student-profile"), "student_profile", force),
    getUserData: (force = false) => cachedFetch(() => authAPI.get("/userProfile"), "student_user_data", force),
};

export const StudentAcademicService = {
    getNotice: (force = false) => cachedFetch(() => WorkAPI.get("/Notice/getNoticeDpt"), "student_notices", force),
    getFees: (force = false) => cachedFetch(() => WorkAPI.get("/Fee/get-fee-structure"), "student_fees", force),
    getHomework: (force = false) => cachedFetch(() => WorkAPI.get("/HomeWork/getHwDpt"), "student_homework", force),
    getAssignments: (force = false) => cachedFetch(() => WorkAPI.get("/Assignment/getAssDpt"), "student_assignments", force),
    getModelPapers: (force = false) => cachedFetch(() => WorkAPI.get("/ModelPaper/all"), "student_model_papers", force),
    getTimetable: (force = false) => cachedFetch(() => WorkAPI.get("/TimeTable/get"), "student_timetable", force),
    getAttendance: (section, semester, force = false) => 
        cachedFetch(() => ReportAPI.get(`/Attendance/Show?section=${section}&semester=${semester}`), `student_attendance_${section}_${semester}`, force),
    getExams: (force = false) => cachedFetch(() => ReportAPI.get("/Exam-Schedule/uploader"), "student_exams", force),
    getResults: (sid, force = false) => cachedFetch(() => ReportAPI.get(`/Mark/ShowResult?id=${sid}`), `student_results_${sid}`, force),
    getOnlineClasses: (force = false) => cachedFetch(() => WorkAPI.get("/Link/getLinkDpt"), "student_online_classes", force),
    getSyllabus: (force = false) => cachedFetch(() => WorkAPI.get("/Syllabus/getSyllabus"), "student_syllabus", force),
    getSubjects: (params, force = false) => 
        cachedFetch(() => AcademicAPI.get("/subjects", { params }), `student_subjects_${JSON.stringify(params)}`, force),
};

