// AdminCommon/AdminCourseCommon/courseRoutes.js

/**
 * Course Management Routes Configuration
 */

// Base path for course routes
export const COURSE_BASE_PATH = '/admin/courses';

/**
 * Course route paths
 */
export const COURSE_ROUTES = {
  // Main routes
  LIST: `${COURSE_BASE_PATH}`,
  ADD: `${COURSE_BASE_PATH}/add`,
  EDIT: `${COURSE_BASE_PATH}/edit/:id`,
  VIEW: `${COURSE_BASE_PATH}/view/:id`,
  
  // Category-based routes
  BY_CATEGORY: `${COURSE_BASE_PATH}/category/:category`,
  
  // Status-based routes
  ACTIVE: `${COURSE_BASE_PATH}/active`,
  INACTIVE: `${COURSE_BASE_PATH}/inactive`,
  DRAFT: `${COURSE_BASE_PATH}/draft`,
  ARCHIVED: `${COURSE_BASE_PATH}/archived`,
  
  // Management routes
  SETTINGS: `${COURSE_BASE_PATH}/settings`,
  STATS: `${COURSE_BASE_PATH}/statistics`,
  REPORTS: `${COURSE_BASE_PATH}/reports`
};

/**
 * Generate dynamic route path with parameters
 */
export const generateCoursePath = (route, params = {}) => {
  let path = route;
  
  Object.keys(params).forEach(key => {
    path = path.replace(`:${key}`, params[key]);
  });
  
  return path;
};

/**
 * Get course list path with filters
 */
export const getCourseListPath = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return `${COURSE_ROUTES.LIST}${queryString ? `?${queryString}` : ''}`;
};

/**
 * Get add course path
 */
export const getAddCoursePath = () => {
  return COURSE_ROUTES.ADD;
};

/**
 * Get edit course path
 */
export const getEditCoursePath = (courseId) => {
  return generateCoursePath(COURSE_ROUTES.EDIT, { id: courseId });
};

/**
 * Get view course path
 */
export const getViewCoursePath = (courseId) => {
  return generateCoursePath(COURSE_ROUTES.VIEW, { id: courseId });
};

/**
 * Get courses by category path
 */
export const getCoursesByCategoryPath = (category) => {
  return generateCoursePath(COURSE_ROUTES.BY_CATEGORY, { category });
};

/**
 * Get active courses path
 */
export const getActiveCoursesPath = () => {
  return COURSE_ROUTES.ACTIVE;
};

/**
 * Get inactive courses path
 */
export const getInactiveCoursesPath = () => {
  return COURSE_ROUTES.INACTIVE;
};

/**
 * Get draft courses path
 */
export const getDraftCoursesPath = () => {
  return COURSE_ROUTES.DRAFT;
};

/**
 * Get archived courses path
 */
export const getArchivedCoursesPath = () => {
  return COURSE_ROUTES.ARCHIVED;
};

/**
 * Get course settings path
 */
export const getCourseSettingsPath = () => {
  return COURSE_ROUTES.SETTINGS;
};

/**
 * Get course statistics path
 */
export const getCourseStatsPath = () => {
  return COURSE_ROUTES.STATS;
};

/**
 * Get course reports path
 */
export const getCourseReportsPath = () => {
  return COURSE_ROUTES.REPORTS;
};

/**
 * Navigation configuration for course management
 */
export const COURSE_NAVIGATION = [
  {
    id: 'all-courses',
    label: 'All Courses',
    path: COURSE_ROUTES.LIST,
    icon: 'list',
    exact: true
  },
  {
    id: 'add-course',
    label: 'Add Course',
    path: COURSE_ROUTES.ADD,
    icon: 'plus',
    exact: true
  },
  {
    id: 'active-courses',
    label: 'Active Courses',
    path: COURSE_ROUTES.ACTIVE,
    icon: 'check-circle',
    exact: true
  },
  {
    id: 'draft-courses',
    label: 'Draft Courses',
    path: COURSE_ROUTES.DRAFT,
    icon: 'file-text',
    exact: true
  },
  {
    id: 'statistics',
    label: 'Statistics',
    path: COURSE_ROUTES.STATS,
    icon: 'bar-chart',
    exact: true
  },
  {
    id: 'reports',
    label: 'Reports',
    path: COURSE_ROUTES.REPORTS,
    icon: 'file',
    exact: true
  }
];

/**
 * Breadcrumb configuration
 */
export const getCourseBreadcrumbs = (currentRoute, params = {}) => {
  const breadcrumbs = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Courses', path: COURSE_ROUTES.LIST }
  ];
  
  switch (currentRoute) {
    case COURSE_ROUTES.ADD:
      breadcrumbs.push({ label: 'Add Course', path: COURSE_ROUTES.ADD });
      break;
      
    case COURSE_ROUTES.EDIT:
      breadcrumbs.push({ 
        label: 'Edit Course', 
        path: getEditCoursePath(params.id) 
      });
      break;
      
    case COURSE_ROUTES.VIEW:
      breadcrumbs.push({ 
        label: 'View Course', 
        path: getViewCoursePath(params.id) 
      });
      break;
      
    case COURSE_ROUTES.ACTIVE:
      breadcrumbs.push({ label: 'Active Courses', path: COURSE_ROUTES.ACTIVE });
      break;
      
    case COURSE_ROUTES.INACTIVE:
      breadcrumbs.push({ label: 'Inactive Courses', path: COURSE_ROUTES.INACTIVE });
      break;
      
    case COURSE_ROUTES.DRAFT:
      breadcrumbs.push({ label: 'Draft Courses', path: COURSE_ROUTES.DRAFT });
      break;
      
    case COURSE_ROUTES.ARCHIVED:
      breadcrumbs.push({ label: 'Archived Courses', path: COURSE_ROUTES.ARCHIVED });
      break;
      
    case COURSE_ROUTES.STATS:
      breadcrumbs.push({ label: 'Statistics', path: COURSE_ROUTES.STATS });
      break;
      
    case COURSE_ROUTES.REPORTS:
      breadcrumbs.push({ label: 'Reports', path: COURSE_ROUTES.REPORTS });
      break;
      
    default:
      break;
  }
  
  return breadcrumbs;
};

/**
 * Check if current path matches route
 */
export const isActiveRoute = (currentPath, route) => {
  return currentPath === route || currentPath.startsWith(route + '/');
};

/**
 * Get parent route
 */
export const getParentRoute = (currentPath) => {
  const pathParts = currentPath.split('/').filter(Boolean);
  pathParts.pop();
  return '/' + pathParts.join('/');
};

export default {
  COURSE_BASE_PATH,
  COURSE_ROUTES,
  COURSE_NAVIGATION,
  generateCoursePath,
  getCourseListPath,
  getAddCoursePath,
  getEditCoursePath,
  getViewCoursePath,
  getCoursesByCategoryPath,
  getActiveCoursesPath,
  getInactiveCoursesPath,
  getDraftCoursesPath,
  getArchivedCoursesPath,
  getCourseSettingsPath,
  getCourseStatsPath,
  getCourseReportsPath,
  getCourseBreadcrumbs,
  isActiveRoute,
  getParentRoute
};