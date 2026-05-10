// AdminCommon/AdminCourseCommon/courseHelpers.js

import {
  COURSE_STATUS,
  COURSE_DURATION_TYPES,
  COURSE_CATEGORIES,
  FEE_PAYMENT_TYPES,
  STATUS_COLORS
} from './courseConstants';

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = '₹') => {
  if (!amount) return `${currency}0`;
  return `${currency}${parseFloat(amount).toLocaleString('en-IN')}`;
};

/**
 * Format duration text
 */
export const formatDuration = (duration, durationType) => {
  if (!duration || !durationType) return '';
  return `${duration} ${durationType}`;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'default';
};

/**
 * Get status display text
 */
export const getStatusText = (status) => {
  const statusMap = {
    [COURSE_STATUS.ACTIVE]: 'Active',
    [COURSE_STATUS.INACTIVE]: 'Inactive',
    [COURSE_STATUS.DRAFT]: 'Draft',
    [COURSE_STATUS.ARCHIVED]: 'Archived'
  };
  return statusMap[status] || status;
};

/**
 * Get category display text
 */
export const getCategoryText = (category) => {
  const categoryMap = {
    [COURSE_CATEGORIES.ENGINEERING]: 'Engineering',
    [COURSE_CATEGORIES.MANAGEMENT]: 'Management',
    [COURSE_CATEGORIES.SCIENCE]: 'Science',
    [COURSE_CATEGORIES.ARTS]: 'Arts',
    [COURSE_CATEGORIES.COMMERCE]: 'Commerce',
    [COURSE_CATEGORIES.MEDICAL]: 'Medical',
    [COURSE_CATEGORIES.LAW]: 'Law',
    [COURSE_CATEGORIES.PHARMACY]: 'Pharmacy',
    [COURSE_CATEGORIES.COMPUTER_SCIENCE]: 'Computer Science',
    [COURSE_CATEGORIES.OTHER]: 'Other'
  };
  return categoryMap[category] || category;
};

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  } else if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  return date;
};

/**
 * Calculate total fee from components
 */
export const calculateTotalFee = (admissionFee = 0, tuitionFee = 0, examFee = 0, otherFee = 0) => {
  const total = parseFloat(admissionFee || 0) + 
                parseFloat(tuitionFee || 0) + 
                parseFloat(examFee || 0) + 
                parseFloat(otherFee || 0);
  return total;
};

/**
 * Generate course code suggestion
 */
export const generateCourseCode = (courseName, category) => {
  if (!courseName) return '';
  
  const categoryPrefix = category ? category.substring(0, 3).toUpperCase() : 'CRS';
  const nameWords = courseName.split(' ').filter(word => word.length > 0);
  
  let code = categoryPrefix;
  if (nameWords.length > 0) {
    code += '-' + nameWords.map(word => word[0].toUpperCase()).join('');
  }
  
  return code;
};

/**
 * Parse query string to filter object
 */
export const parseQueryToFilters = (queryString) => {
  const params = new URLSearchParams(queryString);
  const filters = {};
  
  for (const [key, value] of params.entries()) {
    if (value) {
      filters[key] = value;
    }
  }
  
  return filters;
};

/**
 * Build query string from filters
 */
export const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  
  return params.toString();
};

/**
 * Filter courses by search term
 */
export const filterCoursesBySearch = (courses, searchTerm) => {
  if (!searchTerm) return courses;
  
  const term = searchTerm.toLowerCase();
  return courses.filter(course => 
    course.courseCode?.toLowerCase().includes(term) ||
    course.courseName?.toLowerCase().includes(term) ||
    course.shortName?.toLowerCase().includes(term) ||
    course.description?.toLowerCase().includes(term)
  );
};

/**
 * Sort courses by field
 */
export const sortCourses = (courses, sortBy) => {
  const sortedCourses = [...courses];
  
  switch (sortBy) {
    case 'name_asc':
      return sortedCourses.sort((a, b) => a.courseName.localeCompare(b.courseName));
    case 'name_desc':
      return sortedCourses.sort((a, b) => b.courseName.localeCompare(a.courseName));
    case 'created_asc':
      return sortedCourses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'created_desc':
      return sortedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'fee_asc':
      return sortedCourses.sort((a, b) => parseFloat(a.totalFee) - parseFloat(b.totalFee));
    case 'fee_desc':
      return sortedCourses.sort((a, b) => parseFloat(b.totalFee) - parseFloat(a.totalFee));
    default:
      return sortedCourses;
  }
};

/**
 * Paginate array
 */
export const paginateArray = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return array.slice(startIndex, endIndex);
};

/**
 * Calculate pagination info
 */
export const calculatePagination = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  
  return {
    totalCount,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage,
    hasPreviousPage
  };
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if course is active
 */
export const isCourseActive = (course) => {
  return course.status === COURSE_STATUS.ACTIVE;
};

/**
 * Check if course can be edited
 */
export const canEditCourse = (course) => {
  return course.status !== COURSE_STATUS.ARCHIVED;
};

/**
 * Check if course can be deleted
 */
export const canDeleteCourse = (course) => {
  // Can delete if no students enrolled (you'll need to check this from API)
  return course.status === COURSE_STATUS.DRAFT || course.status === COURSE_STATUS.INACTIVE;
};

/**
 * Get course duration in months
 */
export const getDurationInMonths = (duration, durationType) => {
  if (!duration) return 0;
  
  const dur = parseFloat(duration);
  switch (durationType) {
    case COURSE_DURATION_TYPES.YEARS:
      return dur * 12;
    case COURSE_DURATION_TYPES.MONTHS:
      return dur;
    case COURSE_DURATION_TYPES.WEEKS:
      return dur / 4;
    case COURSE_DURATION_TYPES.DAYS:
      return dur / 30;
    default:
      return dur;
  }
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, maxSize = 5, allowedTypes = []) => {
  const errors = [];
  
  // Check file size (in MB)
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    errors.push(`File size must be less than ${maxSize}MB`);
  }
  
  // Check file type
  if (allowedTypes.length > 0) {
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    const isAllowed = allowedTypes.some(type => 
      fileType.includes(type) || fileExtension === type
    );
    
    if (!isAllowed) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Download file from URL
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export courses to CSV
 */
export const exportCoursesToCSV = (courses) => {
  const headers = ['Course Code', 'Course Name', 'Category', 'Type', 'Duration', 'Total Fee', 'Status'];
  const rows = courses.map(course => [
    course.courseCode,
    course.courseName,
    getCategoryText(course.category),
    course.courseType,
    formatDuration(course.duration, course.durationType),
    course.totalFee,
    getStatusText(course.status)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  downloadFile(url, `courses_${new Date().getTime()}.csv`);
  window.URL.revokeObjectURL(url);
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export default {
  formatCurrency,
  formatDuration,
  getStatusColor,
  getStatusText,
  getCategoryText,
  formatDate,
  calculateTotalFee,
  generateCourseCode,
  parseQueryToFilters,
  buildQueryString,
  filterCoursesBySearch,
  sortCourses,
  paginateArray,
  calculatePagination,
  truncateText,
  isCourseActive,
  canEditCourse,
  canDeleteCourse,
  getDurationInMonths,
  validateFileUpload,
  downloadFile,
  exportCoursesToCSV,
  deepClone,
  isEmptyObject,
  debounce
};