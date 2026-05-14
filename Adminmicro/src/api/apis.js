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

// 🔹 API Instances
export const authAPI = createAxiosInstance(import.meta.env.VITE_BASE_Auth);
export const WorkAPI = createAxiosInstance(import.meta.env.VITE_BASE_WORK); // Likely /api/v2/Admin/Work
export const ReportAPI = createAxiosInstance(import.meta.env.VITE_BASE_REPORT);
export const AcademicAPI = createAxiosInstance(import.meta.env.VITE_BASE_ACADEMIC || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic");
export const AdminGlobalAPI = createAxiosInstance(import.meta.env.VITE_BASE_ADMIN_GLOBAL || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin");
export const HostelAPI = createAxiosInstance(import.meta.env.VITE_BASE_HOSTEL || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel");
export const NotificationAPI = createAxiosInstance(import.meta.env.VITE_BASE_NOTIFICATION || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Notification");
export const PlacementAPI = createAxiosInstance(import.meta.env.VITE_BASE_PLACEMENT || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Placement");
export const FeeAPI = createAxiosInstance(import.meta.env.VITE_BASE_FEE || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Fee");
export const PaymentAPI = createAxiosInstance(import.meta.env.VITE_BASE_PAYMENT || "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Payment");

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
    if (key) {
        // If key ends with *, delete all matching keys
        if (key.endsWith("*")) {
            const prefix = key.slice(0, -1);
            for (const k of cache.keys()) {
                if (k.startsWith(prefix)) cache.delete(k);
            }
        } else {
            cache.delete(key);
        }
    } else {
        cache.clear();
    }
};

// 🔹 Auth & Admin Profile Services
export const AuthService = {
    login: (data) => authAPI.post("/login", data),
    logout: () => authAPI.patch("/logout"),
    getProfile: () => authAPI.get("/login"),
    getAdminList: (force = false) => cachedFetch(() => authAPI.get("/AdminList"), "admin_list", force),
    deleteAdmin: (id) => {
        invalidateCache("admin_list");
        return authAPI.delete(`/AdminList/Deleted/${id}`);
    }
};

// 🔹 Academic Services (api/v3/Admin/Academic)
export const AcademicService = {
    // Subjects
    getSubjects: (force = false) => cachedFetch(() => AcademicAPI.get("/subjects"), "academic_subjects", force),
    addSubject: (data) => { invalidateCache("academic_subjects"); return AcademicAPI.post("/subjects", data); },
    deleteSubject: (id) => { invalidateCache("academic_subjects"); return AcademicAPI.delete(`/subjects/${id}`); },

    // Batches
    getBatches: (force = false) => cachedFetch(() => AcademicAPI.get("/batches"), "academic_batches", force),
    addBatch: (data) => { invalidateCache("academic_batches"); return AcademicAPI.post("/batches", data); },
    deleteBatch: (id) => { invalidateCache("academic_batches"); return AcademicAPI.delete(`/batches/${id}`); },

    // Courses
    getCourses: (force = false) => cachedFetch(() => AcademicAPI.get("/courses"), "academic_courses", force),
    addCourse: (data) => { invalidateCache("academic_courses"); return AcademicAPI.post("/courses", data); },
    deleteCourse: (id) => { invalidateCache("academic_courses"); return AcademicAPI.delete(`/courses/${id}`); },

    // Periods
    getPeriods: (force = false) => cachedFetch(() => AcademicAPI.get("/periods"), "academic_periods", force),
    addPeriod: (data) => { invalidateCache("academic_periods"); return AcademicAPI.post("/periods", data); },
    deletePeriod: (id) => { invalidateCache("academic_periods"); return AcademicAPI.delete(`/periods/${id}`); },

    // Sections
    getSections: (force = false) => cachedFetch(() => AcademicAPI.get("/sections"), "academic_sections", force),
    addSection: (data) => { invalidateCache("academic_sections"); return AcademicAPI.post("/sections", data); },
    deleteSection: (id) => { invalidateCache("academic_sections"); return AcademicAPI.delete(`/sections/${id}`); },

    // Semesters
    getSemesters: (force = false) => cachedFetch(() => AcademicAPI.get("/semesters"), "academic_semesters", force),
    addSemester: (data) => { invalidateCache("academic_semesters"); return AcademicAPI.post("/semesters", data); },
    deleteSemester: (id) => { invalidateCache("academic_semesters"); return AcademicAPI.delete(`/semesters/${id}`); },

    // Years
    getYears: (force = false) => cachedFetch(() => AcademicAPI.get("/years"), "academic_years", force),
    addYear: (data) => { invalidateCache("academic_years"); return AcademicAPI.post("/years", data); },
    deleteYear: (id) => { invalidateCache("academic_years"); return AcademicAPI.delete(`/years/${id}`); },

    // Migration
    migrateStudents: (data) => {
        invalidateCache("admin_all_students");
        return WorkAPI.post("/Admin/migrate-students", data);
    },
};

// 🔹 Student Services (api/v1/Admin & Report)
export const StudentService = {
    getAllStudents: (force = false) => cachedFetch(() => authAPI.get("/StudentList"), "admin_all_students", force),
    deleteStudent: (id) => {
        invalidateCache("admin_all_students");
        return authAPI.delete(`/StudentList/Deleted/${id}`);
    },
    getStudentRegistry: (force = false) => cachedFetch(() => ReportAPI.get("/student-list"), "admin_student_registry", force),
    getStudentsForMigration: (course, year, semester, force = false) => 
        cachedFetch(() => ReportAPI.get(`/student-list?course=${course}&year=${year}&semester=${semester}`), `migration_students_${course}_${year}_${semester}`, force),
};

// 🔹 Teacher & Faculty Services (api/v1/Admin)
export const TeacherService = {
    getAllTeachers: (force = false) => cachedFetch(() => authAPI.get("/TeacherList"), "admin_all_teachers", force),
    deleteTeacherProfile: (id) => {
        invalidateCache("admin_all_teachers");
        return authAPI.delete(`/TeacherList/Deleted/${id}`);
    },
    // Faculty/Teacher Management
    addTeacher: (formData) => {
        invalidateCache("admin_all_teachers");
        return authAPI.post("/Faculty/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    getTeacherById: (id, force = false) => cachedFetch(() => authAPI.get(`/Faculty/get/${id}`), `faculty_${id}`, force),
    updateTeacher: (id, formData) => {
        invalidateCache("admin_all_teachers");
        invalidateCache(`faculty_${id}`);
        return authAPI.put(`/Faculty/update/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    // Aliases
    addFaculty: (formData) => TeacherService.addTeacher(formData),
    getFacultyById: (id, force = false) => TeacherService.getTeacherById(id, force),
    updateFaculty: (id, formData) => TeacherService.updateTeacher(id, formData)
};

// 🔹 Work & Records Services (api/v2/Admin/Work)
export const AdminWorkService = {
    getAllHomework: (force = false) => cachedFetch(() => WorkAPI.get("/HomeWork/getAll"), "admin_homework", force),
    getAllAssignments: (force = false) => cachedFetch(() => WorkAPI.get("/Assignment/getAll"), "admin_assignments", force),
    getAllNotices: (force = false) => cachedFetch(() => WorkAPI.get("/Notice/getAll"), "admin_notices", force),
    getAllLinks: (force = false) => cachedFetch(() => WorkAPI.get("/Link/getAll"), "admin_links", force),
};

// 🔹 Exam & Result Services (api/v3/Admin)
export const AdminRecordService = {
    // Marks/Results
    getDepartmentResult: (dept, force = false) => cachedFetch(() => AdminGlobalAPI.get(`/Mark/ShowResult/${dept}`), `results_${dept}`, force),
    getBulkMarks: (force = false) => cachedFetch(() => AdminGlobalAPI.get("/Mark/BulkView"), "bulk_marks", force),
    deleteMark: (id) => { invalidateCache("bulk_marks"); return AdminGlobalAPI.delete(`/Mark/delete/${id}`); },

    // Timetable
    getDepartmentTimetable: (dept, force = false) => cachedFetch(() => AdminGlobalAPI.get(`/Timetable/View/${dept}`), `timetable_${dept}`, force),
    deleteTimetable: (id) => { invalidateCache("timetable_*"); return AdminGlobalAPI.delete(`/Timetable/delete/${id}`); },

    // Attendance
    getGlobalAttendance: (force = false) => cachedFetch(() => AdminGlobalAPI.get("/Attendance/All"), "global_attendance", force),

    // Exam Schedule
    getExamSchedules: (force = false) => cachedFetch(() => AdminGlobalAPI.get("/Exam-Schedule/uploader"), "exam_schedules", force),
    uploadExamSchedule: (data) => { invalidateCache("exam_schedules"); return AdminGlobalAPI.post("/Exam-Schedule/uploader", data); },
    deleteExamSchedule: (id) => { invalidateCache("exam_schedules"); return AdminGlobalAPI.delete(`/Exam-Schedule/deleted/${id}`); },
};

// 🔹 Hostel Services (api/v3/Admin/Hostel)
export const HostelService = {
    getBlocks: (force = false) => cachedFetch(() => HostelAPI.get("/blocks"), "hostel_blocks", force),
    addBlock: (data) => { invalidateCache("hostel_blocks"); return HostelAPI.post("/blocks", data); },
    
    getRooms: (force = false) => cachedFetch(() => HostelAPI.get("/rooms"), "hostel_rooms", force),
    addRoom: (data) => { invalidateCache("hostel_rooms"); return HostelAPI.post("/rooms", data); },
    
    getAllotments: (force = false) => cachedFetch(() => HostelAPI.get("/allocate"), "hostel_allotments", force),
    allocateRoom: (data) => { 
        invalidateCache("hostel_allotments"); 
        invalidateCache("admin_all_students");
        return HostelAPI.post("/allocate", data); 
    },
    deleteAllocation: (id) => { 
        invalidateCache("hostel_allotments"); 
        invalidateCache("admin_all_students");
        return HostelAPI.delete(`/allocate/${id}`); 
    }
};

// 🔹 Notification Services (api/v3/Admin/Notification)
export const NotificationService = {
    createNotification: (data) => NotificationAPI.post("/create", data),
    getUserNotifications: (force = false) => cachedFetch(() => NotificationAPI.get("/user-notifications"), "user_notifications", force),
    markAsRead: (data) => { invalidateCache("user_notifications"); return NotificationAPI.post("/mark-read", data); }
};

// 🔹 Placement Services (api/v3/Admin/Placement)
export const PlacementService = {
    getDrives: (force = false) => cachedFetch(() => PlacementAPI.get("/drives"), "placement_drives", force),
    createDrive: (data) => { invalidateCache("placement_drives"); return PlacementAPI.post("/drives", data); },
    applyForPlacement: (data) => PlacementAPI.post("/apply", data),
    getApplications: (force = false) => cachedFetch(() => PlacementAPI.get("/applications"), "placement_applications", force),
    updateApplicationStatus: (id, status) => { 
        invalidateCache("placement_applications"); 
        return PlacementAPI.patch(`/applications/${id}`, { status }); 
    }
};

// 🔹 Fee & Payment Services (api/v3/Admin/Fee & Payment)
export const FeeService = {
    getFeeStructures: (force = false) => cachedFetch(() => FeeAPI.get("/structure"), "fee_structures", force),
    addFeeStructure: (data) => { invalidateCache("fee_structures"); return FeeAPI.post("/structure", data); },
    getSpecificStructure: (dept, course, batch, force = false) => 
        cachedFetch(() => FeeAPI.get(`/structure/specific?department=${dept}&course=${course}&batch=${batch}`), `fee_structure_${dept}_${course}_${batch}`, force),
    deleteFeeStructure: (id) => { invalidateCache("fee_structures"); return FeeAPI.delete(`/structure/${id}`); },
};

export const PaymentService = {
    recordPayment: (data) => { 
        invalidateCache("payment_history"); 
        invalidateCache("my_collection");
        return PaymentAPI.post("/record", data); 
    },
    getPaymentHistory: (force = false) => cachedFetch(() => PaymentAPI.get("/history"), "payment_history", force),
    getMyCollection: (force = false) => cachedFetch(() => PaymentAPI.get("/my-collection"), "my_collection", force),
};

// 🔹 Dashboard Service
export const DashboardService = {
    getStats: (force = false) => cachedFetch(async () => {
        const [studentRes, teacherRes, hostelRes] = await Promise.all([
            authAPI.get("/StudentList"),
            authAPI.get("/TeacherList"),
            HostelAPI.get("/allocate").catch(() => ({ data: { allotments: [] } }))
        ]);
        const students = studentRes.data.studentList || studentRes.data.data || [];
        const teachers = teacherRes.data.TeacherList || teacherRes.data.data || [];
        return {
            totalStudents: students.length,
            totalTeachers: teachers.length,
            hostelOccupancy: hostelRes.data.allotments?.length || 0,
            activeStudents: students.filter(s => s.status === "active" || s.isActive).length
        };
    }, "admin_dashboard_stats", force)
};
