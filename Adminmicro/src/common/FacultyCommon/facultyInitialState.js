// facultyInitialState.js
// ----------------------
// Centralized initial state for Faculty module
// Useful for Context API, Redux Toolkit, or future state managers

import { FACULTY_STATUS, FACULTY_PAGINATION } from "./facultyConstants";

/**
 * Single Faculty Initial State
 * ----------------------------
 * Used in:
 * - AddFaculty
 * - EditFaculty
 * - FacultyForm
 */
export const facultyFormInitialState = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  status: FACULTY_STATUS.ACTIVE,
  bio: "",
};

/**
 * Faculty List Initial State
 * --------------------------
 * Used in:
 * - Faculty.jsx (List Page)
 * - Redux slice / Context
 */
export const facultyListInitialState = {
  data: [],
  loading: false,
  error: null,

  search: "",
  page: FACULTY_PAGINATION.DEFAULT_PAGE,
  limit: FACULTY_PAGINATION.DEFAULT_LIMIT,
  total: 0,
};

/**
 * Faculty Details Initial State
 * -----------------------------
 * Used in:
 * - FacultyDetails.jsx
 */
export const facultyDetailsInitialState = {
  data: null,
  loading: false,
  error: null,
};

/**
 * Bulk Upload Initial State
 * -------------------------
 * Used in:
 * - UploadFacultyExcel
 * - Bulk import flows
 */
export const facultyBulkUploadInitialState = {
  file: null,
  parsedData: [],
  loading: false,
  error: null,
};

/**
 * Interview Notes:
 * ---------------
 * - Initial state files make scaling easy
 * - Cleaner reducers & contexts
 * - Avoids scattered useState defaults
 * - Prepares project for Redux / Zustand / RTK
 */
