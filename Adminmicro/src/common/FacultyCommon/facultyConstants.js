// facultyConstants.js
// ---------------------
// Central place for all static constants related to Faculty module
// Helps avoid magic strings/numbers across the app

/**
 * Faculty Status Constants
 * ------------------------
 * Use these instead of hardcoding strings like "active"
 */
export const FACULTY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_LEAVE: "onleave",
};

export const FACULTY_STATUS_OPTIONS = [
  { label: "Active", value: FACULTY_STATUS.ACTIVE },
  { label: "Inactive", value: FACULTY_STATUS.INACTIVE },
  { label: "On Leave", value: FACULTY_STATUS.ON_LEAVE },
];

/**
 * Faculty Roles / Types (if applicable)
 * ------------------------------------
 */
export const FACULTY_TYPES = {
  PROFESSOR: "professor",
  ASSOCIATE_PROFESSOR: "associate_professor",
  ASSISTANT_PROFESSOR: "assistant_professor",
  GUEST: "guest",
};

export const FACULTY_TYPE_OPTIONS = [
  { label: "Professor", value: FACULTY_TYPES.PROFESSOR },
  { label: "Associate Professor", value: FACULTY_TYPES.ASSOCIATE_PROFESSOR },
  { label: "Assistant Professor", value: FACULTY_TYPES.ASSISTANT_PROFESSOR },
  { label: "Guest Faculty", value: FACULTY_TYPES.GUEST },
];

/**
 * Pagination Defaults
 * -------------------
 */
export const FACULTY_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * API Endpoints (optional but useful)
 * ----------------------------------
 */
export const FACULTY_API_ENDPOINTS = {
  BASE: "/api/faculty",
  BULK_UPLOAD: "/api/faculty/bulk",
};

/**
 * Excel Related Constants
 * -----------------------
 */
export const FACULTY_EXCEL_HEADERS = [
  "name",
  "email",
  "phone",
  "designation",
  "status",
  "bio",
];

/**
 * Interview Notes:
 * ---------------
 * - Constants improve maintainability
 * - Single source of truth avoids bugs
 * - Easy to update labels/values without touching components
 */
