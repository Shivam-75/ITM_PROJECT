// AdminCommon/AdminCourseCommon/courseValidation.js

import { VALIDATION_MESSAGES } from './courseConstants';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (10 digits)
const phoneRegex = /^[0-9]{10}$/;

// Course code validation (alphanumeric with optional dash/underscore)
const courseCodeRegex = /^[A-Z0-9_-]+$/i;

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} ${VALIDATION_MESSAGES.REQUIRED_FIELD.toLowerCase()}`;
  }
  return '';
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return '';
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES.INVALID_EMAIL;
  }
  return '';
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return '';
  if (!phoneRegex.test(phone)) {
    return VALIDATION_MESSAGES.INVALID_PHONE;
  }
  return '';
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value) return '';
  if (value.length < minLength) {
    return `${fieldName} ${VALIDATION_MESSAGES.MIN_LENGTH} ${minLength} characters`;
  }
  return '';
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (!value) return '';
  if (value.length > maxLength) {
    return `${fieldName} ${VALIDATION_MESSAGES.MAX_LENGTH} ${maxLength} characters`;
  }
  return '';
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value, fieldName = 'Field') => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} ${VALIDATION_MESSAGES.POSITIVE_NUMBER.toLowerCase()}`;
  }
  return '';
};

/**
 * Validate course code format
 */
export const validateCourseCode = (code) => {
  const requiredError = validateRequired(code, 'Course code');
  if (requiredError) return requiredError;
  
  if (!courseCodeRegex.test(code)) {
    return 'Course code must contain only letters, numbers, dashes, or underscores';
  }
  
  const lengthError = validateMinLength(code, 2, 'Course code');
  if (lengthError) return lengthError;
  
  return validateMaxLength(code, 20, 'Course code');
};

/**
 * Validate course name
 */
export const validateCourseName = (name) => {
  const requiredError = validateRequired(name, 'Course name');
  if (requiredError) return requiredError;
  
  const minError = validateMinLength(name, 3, 'Course name');
  if (minError) return minError;
  
  return validateMaxLength(name, 200, 'Course name');
};

/**
 * Validate fee amount
 */
export const validateFee = (fee, fieldName = 'Fee') => {
  const requiredError = validateRequired(fee, fieldName);
  if (requiredError) return requiredError;
  
  return validatePositiveNumber(fee, fieldName);
};

/**
 * Validate duration
 */
export const validateDuration = (duration) => {
  const requiredError = validateRequired(duration, 'Duration');
  if (requiredError) return requiredError;
  
  return validatePositiveNumber(duration, 'Duration');
};

/**
 * Validate percentage (0-100)
 */
export const validatePercentage = (percentage, fieldName = 'Percentage') => {
  if (!percentage) return '';
  
  const num = parseFloat(percentage);
  if (isNaN(num) || num < 0 || num > 100) {
    return `${fieldName} must be between 0 and 100`;
  }
  return '';
};

/**
 * Validate age
 */
export const validateAge = (age, fieldName = 'Age') => {
  if (!age) return '';
  
  const num = parseInt(age);
  if (isNaN(num) || num < 0 || num > 150) {
    return `${fieldName} must be between 0 and 150`;
  }
  return '';
};

/**
 * Validate date format
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} is invalid`;
  }
  return '';
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    return 'End date must be after start date';
  }
  return '';
};

/**
 * Validate Basic Details Step
 */
export const validateBasicDetails = (formData) => {
  const errors = {};
  
  errors.courseCode = validateCourseCode(formData.courseCode);
  errors.courseName = validateCourseName(formData.courseName);
  errors.category = validateRequired(formData.category, 'Category');
  errors.courseType = validateRequired(formData.courseType, 'Course type');
  errors.courseMode = validateRequired(formData.courseMode, 'Course mode');
  
  if (formData.description) {
    errors.description = validateMaxLength(formData.description, 2000, 'Description');
  }
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};

/**
 * Validate Fee Details Step
 */
export const validateFeeDetails = (formData) => {
  const errors = {};
  
  errors.totalFee = validateFee(formData.totalFee, 'Total fee');
  
  if (formData.admissionFee) {
    errors.admissionFee = validatePositiveNumber(formData.admissionFee, 'Admission fee');
  }
  
  if (formData.tuitionFee) {
    errors.tuitionFee = validatePositiveNumber(formData.tuitionFee, 'Tuition fee');
  }
  
  if (formData.examFee) {
    errors.examFee = validatePositiveNumber(formData.examFee, 'Exam fee');
  }
  
  errors.feePaymentType = validateRequired(formData.feePaymentType, 'Fee payment type');
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};

/**
 * Validate Duration Details Step
 */
export const validateDurationDetails = (formData) => {
  const errors = {};
  
  errors.duration = validateDuration(formData.duration);
  errors.durationType = validateRequired(formData.durationType, 'Duration type');
  
  if (formData.totalSemesters) {
    errors.totalSemesters = validatePositiveNumber(formData.totalSemesters, 'Total semesters');
  }
  
  if (formData.startDate) {
    errors.startDate = validateDate(formData.startDate, 'Start date');
  }
  
  if (formData.endDate) {
    errors.endDate = validateDate(formData.endDate, 'End date');
  }
  
  if (formData.startDate && formData.endDate) {
    const rangeError = validateDateRange(formData.startDate, formData.endDate);
    if (rangeError) errors.endDate = rangeError;
  }
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};

/**
 * Validate Eligibility Details Step
 */
export const validateEligibilityDetails = (formData) => {
  const errors = {};
  
  errors.minimumQualification = validateRequired(formData.minimumQualification, 'Minimum qualification');
  
  if (formData.minimumPercentage) {
    errors.minimumPercentage = validatePercentage(formData.minimumPercentage, 'Minimum percentage');
  }
  
  if (formData.minimumAge) {
    errors.minimumAge = validateAge(formData.minimumAge, 'Minimum age');
  }
  
  if (formData.maximumAge) {
    errors.maximumAge = validateAge(formData.maximumAge, 'Maximum age');
  }
  
  if (formData.minimumAge && formData.maximumAge) {
    if (parseInt(formData.minimumAge) >= parseInt(formData.maximumAge)) {
      errors.maximumAge = 'Maximum age must be greater than minimum age';
    }
  }
  
  if (formData.entranceExamRequired && !formData.entranceExamName) {
    errors.entranceExamName = validateRequired(formData.entranceExamName, 'Entrance exam name');
  }
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return errors;
};

/**
 * Validate entire course form
 */
export const validateCourseForm = (formData) => {
  const errors = {
    ...validateBasicDetails(formData),
    ...validateFeeDetails(formData),
    ...validateDurationDetails(formData),
    ...validateEligibilityDetails(formData)
  };
  
  return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

export default {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMaxLength,
  validatePositiveNumber,
  validateCourseCode,
  validateCourseName,
  validateFee,
  validateDuration,
  validatePercentage,
  validateAge,
  validateDate,
  validateDateRange,
  validateBasicDetails,
  validateFeeDetails,
  validateDurationDetails,
  validateEligibilityDetails,
  validateCourseForm,
  hasErrors
};