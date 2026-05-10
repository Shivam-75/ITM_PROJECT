// AdminCommon/AdminCourseCommon/coursePermissions.js

import { COURSE_PERMISSIONS } from './courseConstants';

/**
 * Role-based permissions configuration
 */
export const ROLE_PERMISSIONS = {
  super_admin: [
    COURSE_PERMISSIONS.VIEW,
    COURSE_PERMISSIONS.CREATE,
    COURSE_PERMISSIONS.EDIT,
    COURSE_PERMISSIONS.DELETE,
    COURSE_PERMISSIONS.CHANGE_STATUS,
    COURSE_PERMISSIONS.EXPORT,
    COURSE_PERMISSIONS.BULK_DELETE
  ],
  admin: [
    COURSE_PERMISSIONS.VIEW,
    COURSE_PERMISSIONS.CREATE,
    COURSE_PERMISSIONS.EDIT,
    COURSE_PERMISSIONS.DELETE,
    COURSE_PERMISSIONS.CHANGE_STATUS,
    COURSE_PERMISSIONS.EXPORT
  ],
  course_coordinator: [
    COURSE_PERMISSIONS.VIEW,
    COURSE_PERMISSIONS.CREATE,
    COURSE_PERMISSIONS.EDIT,
    COURSE_PERMISSIONS.EXPORT
  ],
  faculty: [
    COURSE_PERMISSIONS.VIEW,
    COURSE_PERMISSIONS.EXPORT
  ],
  viewer: [
    COURSE_PERMISSIONS.VIEW
  ]
};

/**
 * Check if user has specific permission
 * @param {Object} user - User object with role information
 * @param {String} permission - Permission to check
 * @returns {Boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  
  const userRole = user.role.toLowerCase();
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  
  return rolePermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object with role information
 * @param {Array} permissions - Array of permissions to check
 * @returns {Boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object with role information
 * @param {Array} permissions - Array of permissions to check
 * @returns {Boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Get all permissions for a user
 * @param {Object} user - User object with role information
 * @returns {Array}
 */
export const getUserPermissions = (user) => {
  if (!user || !user.role) return [];
  
  const userRole = user.role.toLowerCase();
  return ROLE_PERMISSIONS[userRole] || [];
};

/**
 * Check if user can view courses
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canViewCourses = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.VIEW);
};

/**
 * Check if user can create courses
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canCreateCourse = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.CREATE);
};

/**
 * Check if user can edit courses
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canEditCourse = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.EDIT);
};

/**
 * Check if user can delete courses
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canDeleteCourse = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.DELETE);
};

/**
 * Check if user can change course status
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canChangeCourseStatus = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.CHANGE_STATUS);
};

/**
 * Check if user can export courses
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canExportCourses = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.EXPORT);
};

/**
 * Check if user can bulk delete courses
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const canBulkDeleteCourses = (user) => {
  return hasPermission(user, COURSE_PERMISSIONS.BULK_DELETE);
};

/**
 * Check if user is super admin
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const isSuperAdmin = (user) => {
  if (!user || !user.role) return false;
  return user.role.toLowerCase() === 'super_admin';
};

/**
 * Check if user is admin (super admin or admin)
 * @param {Object} user - User object
 * @returns {Boolean}
 */
export const isAdmin = (user) => {
  if (!user || !user.role) return false;
  const role = user.role.toLowerCase();
  return role === 'super_admin' || role === 'admin';
};

/**
 * Filter actions based on user permissions
 * @param {Object} user - User object
 * @param {Array} actions - Array of action objects with permission property
 * @returns {Array}
 */
export const filterActionsByPermission = (user, actions) => {
  if (!actions || !Array.isArray(actions)) return [];
  
  return actions.filter(action => {
    if (!action.permission) return true;
    return hasPermission(user, action.permission);
  });
};

/**
 * Get permission error message
 * @param {String} permission - Permission that was denied
 * @returns {String}
 */
export const getPermissionErrorMessage = (permission) => {
  const messages = {
    [COURSE_PERMISSIONS.VIEW]: 'You do not have permission to view courses',
    [COURSE_PERMISSIONS.CREATE]: 'You do not have permission to create courses',
    [COURSE_PERMISSIONS.EDIT]: 'You do not have permission to edit courses',
    [COURSE_PERMISSIONS.DELETE]: 'You do not have permission to delete courses',
    [COURSE_PERMISSIONS.CHANGE_STATUS]: 'You do not have permission to change course status',
    [COURSE_PERMISSIONS.EXPORT]: 'You do not have permission to export courses',
    [COURSE_PERMISSIONS.BULK_DELETE]: 'You do not have permission to bulk delete courses'
  };
  
  return messages[permission] || 'You do not have permission to perform this action';
};

/**
 * Throw error if user doesn't have permission
 * @param {Object} user - User object
 * @param {String} permission - Permission to check
 * @throws {Error}
 */
export const requirePermission = (user, permission) => {
  if (!hasPermission(user, permission)) {
    throw new Error(getPermissionErrorMessage(permission));
  }
};

/**
 * Check if user can perform action on specific course
 * @param {Object} user - User object
 * @param {Object} course - Course object
 * @param {String} action - Action to perform (view, edit, delete, etc.)
 * @returns {Boolean}
 */
export const canPerformCourseAction = (user, course, action) => {
  // First check base permission
  const permissionMap = {
    view: COURSE_PERMISSIONS.VIEW,
    create: COURSE_PERMISSIONS.CREATE,
    edit: COURSE_PERMISSIONS.EDIT,
    delete: COURSE_PERMISSIONS.DELETE,
    changeStatus: COURSE_PERMISSIONS.CHANGE_STATUS
  };
  
  const requiredPermission = permissionMap[action];
  if (!requiredPermission || !hasPermission(user, requiredPermission)) {
    return false;
  }
  
  // Additional business logic checks
  if (action === 'delete' || action === 'edit') {
    // Archived courses cannot be edited or deleted
    if (course.status === 'archived') {
      return isSuperAdmin(user);
    }
    
    // Only course owner or admin can edit/delete
    if (course.createdBy && user.id !== course.createdBy && !isAdmin(user)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get available actions for a course based on user permissions
 * @param {Object} user - User object
 * @param {Object} course - Course object
 * @returns {Array}
 */
export const getAvailableCourseActions = (user, course) => {
  const actions = [];
  
  if (canPerformCourseAction(user, course, 'view')) {
    actions.push({ id: 'view', label: 'View', icon: 'eye' });
  }
  
  if (canPerformCourseAction(user, course, 'edit')) {
    actions.push({ id: 'edit', label: 'Edit', icon: 'edit' });
  }
  
  if (canPerformCourseAction(user, course, 'changeStatus')) {
    actions.push({ id: 'changeStatus', label: 'Change Status', icon: 'toggle' });
  }
  
  if (canPerformCourseAction(user, course, 'delete')) {
    actions.push({ id: 'delete', label: 'Delete', icon: 'trash' });
  }
  
  return actions;
};

export default {
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  canViewCourses,
  canCreateCourse,
  canEditCourse,
  canDeleteCourse,
  canChangeCourseStatus,
  canExportCourses,
  canBulkDeleteCourses,
  isSuperAdmin,
  isAdmin,
  filterActionsByPermission,
  getPermissionErrorMessage,
  requirePermission,
  canPerformCourseAction,
  getAvailableCourseActions
};