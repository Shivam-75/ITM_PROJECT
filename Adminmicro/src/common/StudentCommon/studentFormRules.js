// studentFormRules.js

export const STEP_RULES = {
  1: {
    title: "Student Personal Details",
    required: [
      "studentId",
      "name",
      "gender",
      "dob",
      "fatherName",
      "parentMobile",
    ],
  },

  2: {
    title: "Mode of Admission",
    required: ["modeOfAdmission", "admissionDate", "className"],
  },

  3: {
    title: "Qualifying Exam Details",
    required: [
      "qualificationType",
      "maxMarksTotal",
      "marksObtainedTotal",
    ],
  },

  4: {
    title: "Subject Marks",
    required: ["mathsMarks", "physicsMarks"],
  },

  5: {
    title: "Documents",
    required: [], // optional
  },
};
