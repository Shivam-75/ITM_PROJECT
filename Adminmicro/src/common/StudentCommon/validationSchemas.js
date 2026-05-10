// admin/AdminCommon/AdminStudentCommon/validationSchemas.js
import { STEP_RULES } from "./studentFormRules";

export const validateStudent = (values = {}, step) => {
  const rules = STEP_RULES[step] || {};
  const errors = {};

  // REQUIRED fields
  if (rules.nameRequired && !values.name?.trim()) {
    errors.name = "Name is required";
  }

  if (rules.emailRequired && !values.studentEmail?.trim()) {
    errors.studentEmail = "Email is required";
  }

  if (
    values.studentEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.studentEmail)
  ) {
    errors.studentEmail = "Enter a valid email";
  }

  if (rules.phoneRequired && !/^\d{10}$/.test(values.parentMobile || "")) {
    errors.parentMobile = "10 digit mobile number required";
  }

  return errors;
};
