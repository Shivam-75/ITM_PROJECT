const STORAGE_KEY = "FACULTY_LIST";

/* helpers */
function getStoredFaculty() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function setStoredFaculty(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ================= CRUD ================= */

async function getAllFaculty() {
  return getStoredFaculty();
}

async function getFacultyById(id) {
  const list = JSON.parse(localStorage.getItem("FACULTY_LIST")) || [];
  return list.find((f) => f.id === id);
}

/**
 * CREATE FACULTY
 * 🔥 IMPORTANT: normalize data for table + view
 */
async function createFaculty(payload) {
  const list = getStoredFaculty();

  const newFaculty = {
    /* ================= TABLE REQUIRED ================= */
    id: crypto.randomUUID(),
    name: payload.name || "",
    email: payload.email || "",
    phone: payload.phone || "",
    department: payload.department || "",
    status: payload.status || "active",
    photoPreview: payload.photoPreview || "",

    /* ================= EXTRA DETAILS (FOR VIEW PAGE) ================= */
    gender: payload.gender || "",
    dob: payload.dob || "",
    designation: payload.designation || "",
    qualification: payload.qualification || "",
    experience: payload.experience || "",
    address: payload.address || "",
    signaturePreview: payload.signaturePreview || "",

    createdAt: new Date().toISOString(),
  };

  const updated = [...list, newFaculty];
  setStoredFaculty(updated);

  return newFaculty;
}

/**
 * UPDATE FACULTY
 */
async function updateFaculty(id, payload) {
  const list = getStoredFaculty();

  const updated = list.map((f) =>
    f.id === id
      ? {
          ...f,

          /* same normalization on update */
          name: payload.name ?? f.name,
          email: payload.email ?? f.email,
          phone: payload.phone ?? f.phone,
          department: payload.department ?? f.department,
          status: payload.status ?? f.status,
          photoPreview: payload.photoPreview ?? f.photoPreview,

          gender: payload.gender ?? f.gender,
          dob: payload.dob ?? f.dob,
          designation: payload.designation ?? f.designation,
          qualification: payload.qualification ?? f.qualification,
          experience: payload.experience ?? f.experience,
          address: payload.address ?? f.address,
          signaturePreview:
            payload.signaturePreview ?? f.signaturePreview,
        }
      : f
  );

  setStoredFaculty(updated);
  return true;
}

/**
 * DELETE FACULTY
 */
async function deleteFaculty(id) {
  const list = getStoredFaculty();
  const updated = list.filter((f) => f.id !== id);
  setStoredFaculty(updated);
  return true;
}

/**
 * BULK CREATE (EXCEL UPLOAD)
 */
async function parseAndBulkCreate(parsedArray) {
  const list = getStoredFaculty();

  const withIds = parsedArray.map((item) => ({
    id: crypto.randomUUID(),
    name: item.name || "",
    email: item.email || "",
    phone: item.phone || "",
    department: item.department || "",
    status: item.status || "active",
    photoPreview: item.photoPreview || "",
    createdAt: new Date().toISOString(),
  }));

  const updated = [...list, ...withIds];
  setStoredFaculty(updated);

  return withIds;
}

const facultyService = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  parseAndBulkCreate,
};

export default facultyService;
