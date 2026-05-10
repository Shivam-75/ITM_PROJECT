// admin/AdminCommon/apiRoutes.js
export const API_BASE = "/api"; // change to your actual base

export const STUDENT_ROUTES = {
  list: `${API_BASE}/students`,
  get: (id) => `${API_BASE}/students/${id}`,
  create: `${API_BASE}/students`,
  update: (id) => `${API_BASE}/students/${id}`,
  remove: (id) => `${API_BASE}/students/${id}`,
};
