// facultyUtils.js
// ----------------
// Reusable helper & utility functions for Faculty module
// Keeps components clean and logic reusable

import { FACULTY_STATUS } from "./facultyConstants";

/**
 * Get display label for faculty status
 * -----------------------------------
 */
export function getFacultyStatusLabel(status) {
  switch (status) {
    case FACULTY_STATUS.ACTIVE:
      return "Active";
    case FACULTY_STATUS.INACTIVE:
      return "Inactive";
    case FACULTY_STATUS.ON_LEAVE:
      return "On Leave";
    default:
      return "Unknown";
  }
}

/**
 * Get CSS class for faculty status badge
 * -------------------------------------
 * Used by FacultyStatusBadge component
 */
export function getFacultyStatusClass(status) {
  switch (status) {
    case FACULTY_STATUS.ACTIVE:
      return "bg-green-100 text-green-800";
    case FACULTY_STATUS.INACTIVE:
      return "bg-gray-100 text-gray-700";
    case FACULTY_STATUS.ON_LEAVE:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-50 text-gray-500";
  }
}

/**
 * Format faculty name (safe fallback)
 * ----------------------------------
 */
export function formatFacultyName(faculty) {
  if (!faculty) return "—";
  return faculty.name || "—";
}

/**
 * Format phone number for UI
 * --------------------------
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "—";
  return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
}

/**
 * Build full display object for FacultyTable / Cards
 * --------------------------------------------------
 */
export function mapFacultyForUI(faculty) {
  return {
    id: faculty.id,
    name: faculty.name,
    email: faculty.email,
    phone: formatPhoneNumber(faculty.phone),
    designation: faculty.designation,
    status: faculty.status,
  };
}

/**
 * Sort faculty list by key
 * ------------------------
 */
export function sortFaculty(list = [], key = "name", order = "asc") {
  return [...list].sort((a, b) => {
    const x = a[key]?.toString().toLowerCase() || "";
    const y = b[key]?.toString().toLowerCase() || "";

    if (x < y) return order === "asc" ? -1 : 1;
    if (x > y) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Filter faculty list by search query
 * ----------------------------------
 */
export function filterFaculty(list = [], query = "") {
  if (!query) return list;
  const q = query.toLowerCase();

  return list.filter(
    (f) =>
      f.name?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q) ||
      f.designation?.toLowerCase().includes(q)
  );
}

/**
 * Pagination helper
 * -----------------
 */
export function paginate(list = [], page = 1, limit = 10) {
  const start = (page - 1) * limit;
  return list.slice(start, start + limit);
}

/**
 * Interview Notes:
 * ---------------
 * - Utils prevent duplicate logic across components
 * - Improves readability & testability
 * - Pure functions = easy unit testing
 */
