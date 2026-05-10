// AdminCommon/AdminCourseCommon/courseApi.js

import { API_ENDPOINTS } from './courseConstants';
import { buildQueryString } from './courseHelpers';
import * as XLSX from 'xlsx';

/**
 * Base API configuration
 *
 * NOTE:
 * - When backend is not configured we fallback to an empty string (relative paths).
 * - Set VITE_API_BASE_URL in your .env (Vite) when backend is available:
 *     VITE_API_BASE_URL=http://localhost:5000
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Helper to detect whether a real backend is configured
 */
const hasBackend = Boolean(API_BASE_URL);

/**
 * Default headers for API requests
 */


// Ye exactly tumhare form fields ke keys hone chahiye





const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

/**
 * Default headers for file upload
 */
const getFileUploadHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = {
      status: response.status,
      message: (data && data.message) || data || 'An error occurred',
      data: data
    };
    throw error;
  }

  return data;
};

/**
 * Handle API errors
 */
const handleError = (error) => {
  console.error('API Error:', error);

  if (error && error.status === 401) {
    // Unauthorized - redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  throw error;
};

/**
 * Helper to return a small mock created object (used when backend is absent)
 * Ensure status defaults to provided or 'draft'.
 */
const mockCreatedCourse = (courseData = {}) => {
  return {
    id: Date.now().toString(),
    status: courseData.status || 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Ensure fields exist so UI doesn't break
    courseName: courseData.courseName || '',
    shortName: courseData.shortName || '',
    category: courseData.category || '',
    courseType: courseData.courseType || '',
    courseMode: courseData.courseMode || '',
    description: courseData.description || '',
    objectives: courseData.objectives || '',
    duration: courseData.duration || '',
    durationType: courseData.durationType || '',
    totalSemesters: courseData.totalSemesters || '',
    startDate: courseData.startDate || '',
    endDate: courseData.endDate || '',
    totalFee: courseData.totalFee || '',
    feePaymentType: courseData.feePaymentType || '',
    scholarshipAvailable: !!courseData.scholarshipAvailable,
    scholarshipDetails: courseData.scholarshipDetails || '',
    // Add any other fields you expect...
    ...courseData
  };
};

/**
 * Mock localStorage helpers
 */
const readMockCourses = () => {
  try {
    const raw = localStorage.getItem('mockCourses') || '[]';
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn('Failed to parse mockCourses from localStorage', e);
    return [];
  }
};

const writeMockCourses = (courses) => {
  localStorage.setItem('mockCourses', JSON.stringify(courses));
};

/**
 * Simple filter/sort/paginate helper for mock data
 */
const filterSortPaginate = (courses = [], filters = {}) => {
  let items = [...courses];

  const {
    search,
    category,
    status,
    sortBy, // expected like 'courseName_asc' or 'createdAt_desc'
    page = 1,
    limit = 10
  } = filters;

  // Search (simple contains on name/shortName/description)
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(c =>
      (c.courseName && c.courseName.toLowerCase().includes(q)) ||
      (c.shortName && c.shortName.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (category) {
    items = items.filter(c => (c.category || '').toString() === category.toString());
  }

  // Status filter
  if (status) {
    items = items.filter(c => (c.status || '').toString() === status.toString());
  }

  // Sorting
  if (sortBy) {
    const [key, order] = sortBy.split('_');
    items.sort((a, b) => {
      const va = (a[key] ?? '').toString().toLowerCase();
      const vb = (b[key] ?? '').toString().toLowerCase();
      if (va < vb) return order === 'desc' ? 1 : -1;
      if (va > vb) return order === 'desc' ? -1 : 1;
      return 0;
    });
  } else {
    // default sort by createdAt desc
    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  // Pagination
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(Math.max(1, parseInt(page, 10) || 1), totalPages);
  const start = (currentPage - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return {
    courses: paginated,
    currentPage,
    totalPages,
    totalCount,
    limit,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};

/**
 * Get all courses with filters
 */
export const getAllCourses = async (filters = {}) => {
  try {
    // MOCK mode: read from localStorage and apply filter/pagination
    if (!hasBackend) {
      const courses = readMockCourses();
      const result = filterSortPaginate(courses, filters);
      return result;
    }

    // BACKEND mode
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}${API_ENDPOINTS.GET_ALL_COURSES}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const course = courses.find(c => c.id === courseId) || null;
      if (!course) {
        return Promise.reject({ status: 404, message: 'Course not found (mock)' });
      }
      return Promise.resolve(course);
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.GET_COURSE_BY_ID.replace(':id', courseId)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create new course
 *
 * If backend is not configured (API_BASE_URL === ''), return a mocked created object
 * and persist it to localStorage.
 */
export const createCourse = async (courseData) => {
  try {
    // 🔹 FRONTEND-ONLY MODE (NO BACKEND)
    if (!hasBackend) {
      const newCourse = {
        id: crypto.randomUUID(),        // ✅ UNIQUE ID
        status: courseData.status || 'draft',
        createdAt: new Date().toISOString(),
        ...courseData
      };

      const existing = readMockCourses();
      const updated = [newCourse, ...existing];
      writeMockCourses(updated);

      return Promise.resolve(newCourse);
    }

    // 🔹 BACKEND MODE
    const url = `${API_BASE_URL}${API_ENDPOINTS.CREATE_COURSE}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(courseData)
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


/**
 * Update existing course
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const updatedCourses = courses.map(c =>
        c.id === courseId
          ? { ...c, ...courseData, updatedAt: new Date().toISOString() }
          : c
      );
      writeMockCourses(updatedCourses);
      const updated = updatedCourses.find(c => c.id === courseId);
      return Promise.resolve(updated || { id: courseId, ...courseData });
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_COURSE.replace(':id', courseId)}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(courseData)
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (courseId) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const updated = courses.filter(c => c.id !== courseId);
      writeMockCourses(updated);
      return Promise.resolve({ success: true, id: courseId, message: 'Mocked: course deleted' });
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.DELETE_COURSE.replace(':id', courseId)}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Change course status
 */
export const changeCourseStatus = async (courseId, newStatus) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const updatedCourses = courses.map(c =>
        c.id === courseId ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
      );
      writeMockCourses(updatedCourses);
      const updated = updatedCourses.find(c => c.id === courseId);
      return Promise.resolve({ success: true, id: courseId, status: newStatus, course: updated });
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.CHANGE_STATUS.replace(':id', courseId)}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status: newStatus })
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get course statistics
 */
export const getCourseStats = async () => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const totalCourses = courses.length;
      const activeCourses = courses.filter(c => (c.status || '').toString() === 'active').length;
      const draftCourses = courses.filter(c => (c.status || '').toString() === 'draft').length;
      const archivedCourses = courses.filter(c => (c.status || '').toString() === 'archived').length;
      const inactiveCourses = courses.filter(c => (c.status || '').toString() === 'inactive').length;
      const totalStudentsEnrolled = courses.reduce((sum, c) => sum + (Number(c.studentsEnrolled) || 0), 0);

      return Promise.resolve({
        totalCourses,
        activeCourses,
        draftCourses,
        archivedCourses,
        inactiveCourses,
        totalStudentsEnrolled
      });
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.GET_COURSE_STATS}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Bulk delete courses
 */
export const bulkDeleteCourses = async (courseIds) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const updated = courses.filter(c => !courseIds.includes(c.id));
      writeMockCourses(updated);
      return Promise.resolve({ success: true, deleted: courseIds.length, ids: courseIds });
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.BULK_DELETE}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ courseIds })
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


export const uploadCourses = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // 🔹 Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      throw new Error('Uploaded file is empty');
    }

    // 🔹 Required columns
    const REQUIRED_COLUMNS = [
      'courseName',
      'shortName',
      'category',
      'status'
    ];

    const fileHeaders = Object.keys(rows[0]);
    const missing = REQUIRED_COLUMNS.filter(h => !fileHeaders.includes(h));

    if (missing.length) {
      throw new Error(`Missing columns: ${missing.join(', ')}`);
    }

    // 🔹 Convert rows → courses
    const newCourses = rows.map((row) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      courseName: row.courseName,
      shortName: row.shortName || '',
      category: row.category,
      status: row.status || 'draft',
      createdAt: new Date().toISOString()
    }));

    // 🔹 Save into localStorage
    const existing = JSON.parse(localStorage.getItem('mockCourses') || '[]');
    const updated = [...newCourses, ...existing];
    localStorage.setItem('mockCourses', JSON.stringify(updated));

    return Promise.resolve({
      success: true,
      message: `${newCourses.length} courses uploaded successfully`,
      count: newCourses.length
    });

  } catch (error) {
    return handleError(error);
  }
};

/**
 * Export courses
 */
/**
 * Export courses
 */
export const exportCourses = async (filters = {}, format = 'csv') => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();

      // 🔹 Excel headers = formData keys
      const headers = [
        'id',
        'courseName',
        'shortName',
        'courseCode',
        'category',
        'status',

        // duration
        'duration',
        'durationType',
        'totalSemesters',

        // fee
        'totalFee',
        'admissionFee',
        'tuitionFee',
        'examFee',
        'otherFee',

        // eligibility
        'minimumQualification',
        'minimumPercentage',
        'minimumAge',
        'maximumAge',

        // dates
        'startDate',
        'endDate',

        // text
        'description',
        'objectives',
        'additionalCriteria',

        'createdAt'
      ];

      const csvRows = [headers.join(',')];

      courses.forEach(course => {
        const row = headers.map(key =>
          `"${String(course[key] ?? '').replace(/"/g, '""')}"`
        );
        csvRows.push(row.join(','));
      });

      const csv = csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `courses_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      return { success: true, message: 'Mock export completed' };
    }

    // 🔹 Backend mode (future)
    const queryString = buildQueryString({ ...filters, format });
    const url = `${API_BASE_URL}${API_ENDPOINTS.EXPORT_COURSES}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const url2 = URL.createObjectURL(blob);
    const a2 = document.createElement('a');
    a2.href = url2;
    a2.download = `courses_${Date.now()}.${format}`;
    a2.click();
    URL.revokeObjectURL(url2);

    return { success: true, message: 'Export completed successfully' };
  } catch (error) {
    return handleError(error);
  }
};



/**
 * Upload course file (syllabus, brochure)
 */
export const uploadCourseFile = async (file, fileType = 'document') => {
  try {
    if (!hasBackend) {
      console.warn('No API_BASE_URL configured — uploadCourseFile mocked (no backend).');
      return Promise.resolve({ success: true, url: '', message: 'Mocked upload (no backend).' });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const url = `${API_BASE_URL}/api/admin/courses/upload`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getFileUploadHeaders(),
      body: formData
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Search courses
 */
export const searchCourses = async (searchTerm, filters = {}) => {
  try {
    if (!hasBackend) {
      const merged = { ...filters, search: searchTerm };
      const result = filterSortPaginate(readMockCourses(), merged);
      return Promise.resolve(result);
    }

    const queryString = buildQueryString({ ...filters, search: searchTerm });
    const url = `${API_BASE_URL}${API_ENDPOINTS.GET_ALL_COURSES}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get courses by category
 */
export const getCoursesByCategory = async (category, filters = {}) => {
  try {
    if (!hasBackend) {
      const merged = { ...filters, category };
      const result = filterSortPaginate(readMockCourses(), merged);
      return Promise.resolve(result);
    }

    const queryString = buildQueryString({ ...filters, category });
    const url = `${API_BASE_URL}${API_ENDPOINTS.GET_ALL_COURSES}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get courses by status
 */
export const getCoursesByStatus = async (status, filters = {}) => {
  try {
    if (!hasBackend) {
      const merged = { ...filters, status };
      const result = filterSortPaginate(readMockCourses(), merged);
      return Promise.resolve(result);
    }

    const queryString = buildQueryString({ ...filters, status });
    const url = `${API_BASE_URL}${API_ENDPOINTS.GET_ALL_COURSES}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};



/**
 * Duplicate course
 */
export const duplicateCourse = async (courseId) => {
  try {
    // 🔹 FRONTEND-ONLY MODE
    if (!hasBackend) {
      const courses = readMockCourses();
      const original = courses.find(c => c.id === courseId);

      if (!original) {
        return Promise.reject({
          status: 404,
          message: 'Original course not found (mock)'
        });
      }

      const copy = {
        ...original,
        id: crypto.randomUUID(),                    // ✅ NEW UNIQUE ID
        courseName: `${original.courseName} (Copy)`,
        createdAt: new Date().toISOString()
      };

      const updated = [copy, ...courses];
      writeMockCourses(updated);

      return Promise.resolve(copy);
    }

    // 🔹 BACKEND MODE
    const url = `${API_BASE_URL}/api/admin/courses/${courseId}/duplicate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


/**
 * Archive course
 */
export const archiveCourse = async (courseId) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const updatedCourses = courses.map(c =>
        c.id === courseId ? { ...c, status: 'archived', updatedAt: new Date().toISOString() } : c
      );
      writeMockCourses(updatedCourses);
      return Promise.resolve({ success: true, id: courseId, archived: true });
    }

    const url = `${API_BASE_URL}/api/admin/courses/${courseId}/archive`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Restore archived course
 */
export const restoreCourse = async (courseId) => {
  try {
    if (!hasBackend) {
      const courses = readMockCourses();
      const updatedCourses = courses.map(c =>
        c.id === courseId ? { ...c, status: 'active', updatedAt: new Date().toISOString() } : c
      );
      writeMockCourses(updatedCourses);
      return Promise.resolve({ success: true, id: courseId, restored: true });
    }

    const url = `${API_BASE_URL}/api/admin/courses/${courseId}/restore`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};




export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  changeCourseStatus,
  getCourseStats,
  bulkDeleteCourses,
  exportCourses,
  uploadCourses,
  uploadCourseFile,
  searchCourses,
  getCoursesByCategory,
  getCoursesByStatus,
  duplicateCourse,
  archiveCourse,
  restoreCourse
};
