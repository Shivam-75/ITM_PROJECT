import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

// 🔹 Advanced Global Cache
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache

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

    axiosInstance.interceptors.request.use(
        (config) => {
            if (window._isAuthRedirecting) return new Promise(() => {});
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (window._isAuthRedirecting) return new Promise(() => {});

            if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
                if (originalRequest.url?.includes("refreshToken")) return Promise.reject(error);
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
export const AcademicAPI = createAxiosInstance(import.meta.env.VITE_BASE_ACADEMIC || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic");

// 🔹 Caching Wrapper
export const cachedFetch = async (apiCall, key, forceRefresh = false) => {
    const cachedData = cache.get(key);
    if (!forceRefresh && cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        return cachedData.data;
    }
    try {
        const response = await apiCall();
        cache.set(key, { data: response, timestamp: Date.now() });
        return response;
    } catch (error) {
        // If it's a 404/500, we don't want to cache the error usually, 
        // but if we have old data, maybe keep it? For now, just throw.
        throw error;
    }
};

// 🔹 Cache Invalidation
export const invalidateCache = (key) => {
    if (key) cache.delete(key);
    else cache.clear();
};

// 🔹 Centralized Service Layer
export const TeacherService = {
    // 👤 Profile
    getProfile: (force = false) => cachedFetch(() => authAPI.get("/userProfile"), "teacher_profile", force),
    getStudentList: (force = false) => cachedFetch(() => authAPI.get("/StudentList"), "teacher_students", force),

    // 📢 Notice Board
    getNotices: (force = false) => cachedFetch(() => WorkAPI.get("/Notice/uploader"), "teacher_notices", force),
    createNotice: (data) => {
        invalidateCache("teacher_notices");
        return WorkAPI.post("/Notice/uploader", data);
    },
    deleteNotice: (id) => {
        invalidateCache("teacher_notices");
        return WorkAPI.delete(`/Notice/Delete/${id}`);
    },
    
    // 📚 Homework
    getHomework: (force = false) => cachedFetch(() => WorkAPI.get("/Homework/uploader"), "teacher_homework", force),
    createHomework: (data) => {
        invalidateCache("teacher_homework");
        return WorkAPI.post("/Homework/uploader", data);
    },
    deleteHomework: (id) => {
        invalidateCache("teacher_homework");
        return WorkAPI.delete(`/Homework/Delete/${id}`);
    },

    // 🕒 TimeTable
    getTimeTable: (force = false) => cachedFetch(() => ReportAPI.get("/TimeTable/uploader"), "teacher_timetable", force),
    submitTimetable: (data) => {
        invalidateCache("teacher_timetable");
        return ReportAPI.post("/TimeTable/uploader", data);
    },
    
    // 📑 Model Papers
    getModelPapers: (force = false) => cachedFetch(() => WorkAPI.get("/ModelPaper/uploader"), "teacher_model_papers", force),
    createModelPaper: (data) => {
        invalidateCache("teacher_model_papers");
        return WorkAPI.post("/ModelPaper/uploader", data);
    },
    deleteModelPaper: (id) => {
        invalidateCache("teacher_model_papers");
        return WorkAPI.delete(`/ModelPaper/Delete/${id}`);
    },
    
    // 🔗 Virtual Links
    getOnlineLinks: (force = false) => cachedFetch(() => WorkAPI.get("/Link/Uploader"), "teacher_online_links", force),
    createOnlineLink: (data) => {
        invalidateCache("teacher_online_links");
        return WorkAPI.post("/Link/Uploader", data);
    },
    deleteOnlineLink: (id) => {
        invalidateCache("teacher_online_links");
        return WorkAPI.delete(`/Link/Delete/${id}`);
    },

    // 📝 Assignments
    getAssignments: (force = false) => cachedFetch(() => WorkAPI.get("/Assignment/uploader"), "teacher_assignments", force),
    createAssignment: (data) => {
        invalidateCache("teacher_assignments");
        return WorkAPI.post("/Assignment/uploader", data);
    },
    deleteAssignment: (id) => {
        invalidateCache("teacher_assignments");
        return WorkAPI.delete(`/Assignment/Delete/${id}`);
    },

    // 📅 Attendance
    submitAttendance: (data) => WorkAPI.post("/Attendance/uploader", data),
};

export const ResultService = {
    getMarks: (params, force = false) => cachedFetch(() => ReportAPI.get("/Mark/uploade", { params }), `marks_${JSON.stringify(params)}`, force),
    createMarks: (data) => {
        invalidateCache("marks_"); // Dynamic invalidation prefix
        return ReportAPI.post("/Mark/uploade", data);
    },
    deleteMarks: (id) => {
        invalidateCache("marks_");
        return ReportAPI.delete(`/Mark/delete/${id}`);
    },
};

export const ExamService = {
    getExams: (force = false) => cachedFetch(() => ReportAPI.get("/Exam-Schedule/uploader"), "exam_schedules", force),
    createExam: (data) => {
        invalidateCache("exam_schedules");
        return ReportAPI.post("/Exam-Schedule/uploader", data);
    },
    deleteExam: (id) => {
        invalidateCache("exam_schedules");
        return ReportAPI.delete(`/Exam-Schedule/deleted/${id}`);
    },
};

export const AcademicService = {
    getCourses: (force = false) => cachedFetch(() => AcademicAPI.get("/courses"), "academic_courses", force),
    getYears: (force = false) => cachedFetch(() => AcademicAPI.get("/years"), "academic_years", force),
    getSemesters: (force = false) => cachedFetch(() => AcademicAPI.get("/semesters"), "academic_semesters", force),
    getSections: (force = false) => cachedFetch(() => AcademicAPI.get("/sections"), "academic_sections", force),
    getBatches: (force = false) => cachedFetch(() => AcademicAPI.get("/batches"), "academic_batches", force),
    getPeriods: (force = false) => cachedFetch(() => AcademicAPI.get("/periods"), "academic_periods", force),
    getSubjects: (force = false) => cachedFetch(() => AcademicAPI.get("/subjects"), "academic_subjects", force),
};

export const HostelService = {
    getAllotments: (force = false) => cachedFetch(() => WorkAPI.get("/Hostel/get-all-allotment"), "hostel_allotments", force),
    registerHostel: (data) => {
        invalidateCache("hostel_allotments");
        return WorkAPI.post("/Hostel/add-allotment", data);
    },
};
