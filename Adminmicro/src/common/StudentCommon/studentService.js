const STORAGE_KEY = "ADMIN_STUDENTS";

// ===============================
// 🔹 Helpers
// ===============================
const delay = (data, time = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), time));

// ❗ REMOVE HEAVY FIELDS BEFORE SAVING
const sanitizeStudent = (student) => {
  const {
    photo,
    signature,
    documents,
    photoPreview,
    signaturePreview,
    ...safeData
  } = student || {};

  return safeData; // only lightweight fields
};

// Load students
const loadStudents = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

  // 🔹 Initial seed data
  const initial = [
    {
      id: "1",
      studentId: "ITM/23/BCA/59",
      rollNo: "123456789123",
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      phone: "9876543210",
      course: "BCA",
      year: "2",
      status: "active",
      admissionDate: "2025-07-10",
      createdAt: "2025-07-10T10:00:00",
      updatedAt: "2025-07-10T10:00:00",
    },
    {
      id: "2",
      studentId: "ITM/23/BCA/01",
      rollNo: "436753269826",
      name: "Neha Sharma",
      email: "neha@gmail.com",
      phone: "9876543222",
      course: "BSc IT",
      year: "1",
      status: "active",
      admissionDate: "2025-07-12",
      createdAt: "2025-07-12T10:00:00",
      updatedAt: "2025-07-12T10:00:00",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

// Save students safely
const saveStudents = (students) => {
  const sanitized = students.map(sanitizeStudent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
};

// ===============================
// ✅ GET ALL STUDENTS
// ===============================
export const fetchStudents = async () => {
  return delay(loadStudents());
};

// ===============================
// ✅ GET STUDENT BY ID
// ===============================
export const getStudent = async (id) => {
  if (!id) return delay(null);
  const students = loadStudents();
  const student = students.find((s) => String(s.id) === String(id));
  return delay(student ?? null);
};

// ===============================
// ✅ ADD STUDENT
// ===============================
export const addStudent = async (data) => {
  if (!data?.studentId || !data?.name) {
    throw new Error("Student ID and Name are required");
  }

  const students = loadStudents();
  const now = new Date().toISOString();

  const newStudent = sanitizeStudent({
    id: Date.now().toString(),
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  saveStudents([newStudent, ...students]);
  return delay(newStudent);
};

// ===============================
// ✅ UPDATE STUDENT
// ===============================
export const updateStudent = async (id, updatedData) => {
  const students = loadStudents();
  const now = new Date().toISOString();

  const cleanPayload = sanitizeStudent(updatedData);

  const updated = students.map((s) =>
    String(s.id) === String(id)
      ? { ...s, ...cleanPayload, updatedAt: now }
      : s
  );

  saveStudents(updated);
  return delay({ success: true });
};

// ===============================
// ✅ DELETE STUDENT
// ===============================
export const deleteStudent = async (id) => {
  const students = loadStudents();
  const updated = students.filter((s) => String(s.id) !== String(id));
  saveStudents(updated);
  return delay({ success: true });
};

// ===============================
// ✅ BULK ADD STUDENTS
// ===============================
export const bulkAddStudents = async (newStudents) => {
  const students = loadStudents();

  const existingIds = new Set(students.map((s) => s.studentId));

  const filtered = newStudents
    .filter((s) => s.studentId && !existingIds.has(s.studentId))
    .map(sanitizeStudent);

  const withMeta = filtered.map((s) => ({
    id: Date.now().toString() + Math.random(),
    ...s,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  saveStudents([...withMeta, ...students]);
  return delay(withMeta);
};
