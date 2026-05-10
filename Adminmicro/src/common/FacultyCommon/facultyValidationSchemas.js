// facultyValidationSchemas.js
// ---------------------------
// Central place for all Faculty-related validation rules
// Uses Yup so it can be shared across forms (Add / Edit)

import * as yup from "yup";

/**
 * Faculty Form Validation Schema
 * ------------------------------
 * Used in:
 * - AddFaculty.jsx
 * - EditFaculty.jsx
 *
 * Why Yup?
 * - Declarative & readable
 * - Works perfectly with react-hook-form
 * - Easy to extend for complex rules
 */

export const facultySchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Faculty name is required"),

  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number")
    .nullable(),

  designation: yup
    .string()
    .trim()
    .min(2, "Designation is too short")
    .max(50, "Designation is too long")
    .required("Designation is required"),

  status: yup
    .string()
    .oneOf(["active", "inactive", "onleave"], "Invalid faculty status")
    .required("Status is required"),

  bio: yup
    .string()
    .trim()
    .max(500, "Bio must not exceed 500 characters")
    .nullable(),
});

/**
 * Bulk Upload Validation Schema (Optional)
 * ---------------------------------------
 * Used before sending Excel/CSV data to backend
 */

export const bulkFacultySchema = yup.array().of(facultySchema);

/**
 * Interview Tips:
 * --------------
 * - Validation should exist on BOTH client & server
 * - Client validation = better UX
 * - Server validation = security
 * - Yup schemas can be reused in tests
 */
