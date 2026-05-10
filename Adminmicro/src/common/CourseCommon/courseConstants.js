// AdminCommon/AdminCourseCommon/courseConstants.js

export const COURSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
};

export const COURSE_DURATION_TYPES = {
  YEARS: 'years',
  MONTHS: 'months',
  WEEKS: 'weeks',
  DAYS: 'days'
};

export const COURSE_CATEGORIES = {
  ENGINEERING: 'engineering',
  MANAGEMENT: 'management',
  SCIENCE: 'science',
  ARTS: 'arts',
  COMMERCE: 'commerce',
  MEDICAL: 'medical',
  LAW: 'law',
  PHARMACY: 'pharmacy',
  COMPUTER_SCIENCE: 'computer_science',
  OTHER: 'other'
};

export const COURSE_TYPES = {
  UNDERGRADUATE: 'undergraduate',
  POSTGRADUATE: 'postgraduate',
  DIPLOMA: 'diploma',
  CERTIFICATE: 'certificate',
  PHD: 'phd'
};

export const FEE_PAYMENT_TYPES = {
  YEARLY: 'yearly',
  SEMESTER: 'semester',
  MONTHLY: 'monthly',
  ONE_TIME: 'one_time'
};

export const ELIGIBILITY_CRITERIA = {
  PERCENTAGE: 'percentage',
  GRADE: 'grade',
  ENTRANCE_EXAM: 'entrance_exam'
};

export const COURSE_MODES = {
  REGULAR: 'regular',
  DISTANCE: 'distance',
  ONLINE: 'online',
  HYBRID: 'hybrid'
};

export const API_ENDPOINTS = {
  GET_ALL_COURSES: '/api/admin/courses',
  GET_COURSE_BY_ID: '/api/admin/courses/:id',
  CREATE_COURSE: '/api/admin/courses',
  UPDATE_COURSE: '/api/admin/courses/:id',
  DELETE_COURSE: '/api/admin/courses/:id',
  CHANGE_STATUS: '/api/admin/courses/:id/status',
  GET_COURSE_STATS: '/api/admin/courses/stats',
  BULK_DELETE: '/api/admin/courses/bulk-delete',
  EXPORT_COURSES: '/api/admin/courses/export'
};

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: 'Minimum length is',
  MAX_LENGTH: 'Maximum length is',
  POSITIVE_NUMBER: 'Value must be a positive number',
  INVALID_FORMAT: 'Invalid format'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100]
};

export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  CREATED_ASC: 'created_asc',
  CREATED_DESC: 'created_desc',
  UPDATED_ASC: 'updated_asc',
  UPDATED_DESC: 'updated_desc',
  FEE_ASC: 'fee_asc',
  FEE_DESC: 'fee_desc'
};

export const COURSE_FORM_STEPS = {
  BASIC_DETAILS: 1,
  FEE_DETAILS: 2,
  DURATION_DETAILS: 3,
  ELIGIBILITY_DETAILS: 4
};

export const TABLE_HEADERS = [
  { key: 'code', label: 'Course Code', sortable: true },
  { key: 'name', label: 'Course Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'type', label: 'Type', sortable: false },
  { key: 'duration', label: 'Duration', sortable: false },
  { key: 'fee', label: 'Fee', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export const STATUS_COLORS = {
  [COURSE_STATUS.ACTIVE]: 'success',
  [COURSE_STATUS.INACTIVE]: 'warning',
  [COURSE_STATUS.DRAFT]: 'info',
  [COURSE_STATUS.ARCHIVED]: 'error'
};

export const COURSE_PERMISSIONS = {
  VIEW: 'course.view',
  CREATE: 'course.create',
  EDIT: 'course.edit',
  DELETE: 'course.delete',
  CHANGE_STATUS: 'course.change_status',
  EXPORT: 'course.export',
  BULK_DELETE: 'course.bulk_delete'
};

export default {
  COURSE_STATUS,
  COURSE_DURATION_TYPES,
  COURSE_CATEGORIES,
  COURSE_TYPES,
  FEE_PAYMENT_TYPES,
  ELIGIBILITY_CRITERIA,
  COURSE_MODES,
  API_ENDPOINTS,
  VALIDATION_MESSAGES,
  PAGINATION,
  SORT_OPTIONS,
  COURSE_FORM_STEPS,
  TABLE_HEADERS,
  STATUS_COLORS,
  COURSE_PERMISSIONS
};