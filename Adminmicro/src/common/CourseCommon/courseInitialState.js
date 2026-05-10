// AdminCommon/AdminCourseCommon/courseInitialState.js

import { COURSE_STATUS, COURSE_DURATION_TYPES, FEE_PAYMENT_TYPES, COURSE_MODES, COURSE_TYPES } from './courseConstants';

export const courseFormInitialState = {
  // Basic Details
  courseCode: '',
  courseName: '',
  shortName: '',
  category: '',
  courseType: COURSE_TYPES.UNDERGRADUATE,
  courseMode: COURSE_MODES.REGULAR,
  description: '',
  objectives: '',
  
  // Fee Details
  totalFee: '',
  admissionFee: '',
  tuitionFee: '',
  examFee: '',
  otherFee: '',
  feePaymentType: FEE_PAYMENT_TYPES.YEARLY,
  feeStructure: [],
  scholarshipAvailable: false,
  scholarshipDetails: '',
  
  // Duration Details
  duration: '',
  durationType: COURSE_DURATION_TYPES.YEARS,
  totalSemesters: '',
  semestersPerYear: '',
  classesPerWeek: '',
  hoursPerDay: '',
  startDate: '',
  endDate: '',
  
  // Eligibility Details
  minimumQualification: '',
  minimumPercentage: '',
  minimumAge: '',
  maximumAge: '',
  entranceExamRequired: false,
  entranceExamName: '',
  additionalCriteria: '',
  eligibilityDocuments: [],
  
  // Additional Info
  status: COURSE_STATUS.DRAFT,
  seats: '',
  departmentId: '',
  facultyIds: [],
  syllabus: null,
  brochure: null,
  tags: [],
  isPopular: false,
  displayOrder: 0
};

export const courseFilterInitialState = {
  search: '',
  status: '',
  category: '',
  courseType: '',
  courseMode: '',
  minFee: '',
  maxFee: '',
  sortBy: 'created_desc',
  page: 1,
  limit: 10
};

export const courseTableInitialState = {
  courses: [],
  loading: false,
  error: null,
  selectedCourses: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  filters: courseFilterInitialState
};

export const courseModalInitialState = {
  deleteModal: {
    isOpen: false,
    courseId: null,
    courseName: ''
  },
  viewModal: {
    isOpen: false,
    course: null
  },
  statusModal: {
    isOpen: false,
    courseId: null,
    currentStatus: '',
    newStatus: ''
  }
};

export const courseStatsInitialState = {
  totalCourses: 0,
  activeCourses: 0,
  inactiveCourses: 0,
  draftCourses: 0,
  totalStudentsEnrolled: 0,
  popularCourses: [],
  recentCourses: []
};

export const courseErrorState = {
  // Basic Details Errors
  courseCode: '',
  courseName: '',
  shortName: '',
  category: '',
  description: '',
  
  // Fee Details Errors
  totalFee: '',
  admissionFee: '',
  tuitionFee: '',
  
  // Duration Details Errors
  duration: '',
  totalSemesters: '',
  
  // Eligibility Details Errors
  minimumQualification: '',
  minimumPercentage: '',
  
  // General Error
  general: ''
};

export const coursePaginationInitialState = {
  page: 1,
  limit: 10,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false
};

export default {
  courseFormInitialState,
  courseFilterInitialState,
  courseTableInitialState,
  courseModalInitialState,
  courseStatsInitialState,
  courseErrorState,
  coursePaginationInitialState
};