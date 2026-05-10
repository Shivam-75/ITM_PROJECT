// ==========================
// DATE-WISE ATTENDANCE UTILS
// ==========================

// 🔹 Toggle attendance (DEFAULT = PRESENT)
export const markAttendanceByDate = (attendance, date, studentId) => {
  if (!date) return attendance;

  const dayAttendance = attendance[date] || {};

  // If already absent → remove (make present)
  if (dayAttendance.hasOwnProperty(studentId)) {
    const { [studentId]: _, ...rest } = dayAttendance;
    return {
      ...attendance,
      [date]: rest,
    };
  }

  // Otherwise mark absent
  return {
    ...attendance,
    [date]: {
      ...dayAttendance,
      [studentId]: false,
    },
  };
};

// 🔹 Present / Absent count (DATE-WISE)
export const getPresentAbsentCountByDate = (
  attendance,
  date,
  totalStudents
) => {
  if (!date || !totalStudents) {
    return { present: 0, absent: 0 };
  }

  const dayAttendance = attendance[date] || {};
  const absent = Object.keys(dayAttendance).length;
  const present = totalStudents - absent;

  return { present, absent };
};

// 🔹 Daily attendance percentage
export const calculateDailyPercentage = (
  attendance,
  date,
  totalStudents
) => {
  if (!date || !totalStudents) return 0;

  const dayAttendance = attendance[date] || {};
  const absent = Object.keys(dayAttendance).length;
  const present = totalStudents - absent;

  return Math.round((present / totalStudents) * 100);
};

// 🔹 SEMESTER attendance % per student
export const calculateStudentSemesterPercentage = (
  attendance,
  studentId
) => {
  const dates = Object.keys(attendance);

  // No attendance taken yet → fully present
  if (!dates.length) return 100;

  let absentDays = 0;

  dates.forEach((date) => {
    if (attendance[date]?.hasOwnProperty(studentId)) {
      absentDays++;
    }
  });

  const totalDays = dates.length;
  const presentDays = totalDays - absentDays;

  return Math.round((presentDays / totalDays) * 100);
};

// 🔹 CLASS LEVEL SUMMARY (MONTH / SEMESTER)
export const calculateClassAttendanceSummary = (
  attendance,
  totalStudents
) => {
  const dates = Object.keys(attendance);

  if (!dates.length || !totalStudents) {
    return { present: 0, absent: 0, percentage: 0 };
  }

  let totalAbsent = 0;

  dates.forEach((date) => {
    totalAbsent += Object.keys(attendance[date] || {}).length;
  });

  const totalPossible = totalStudents * dates.length;
  const totalPresent = totalPossible - totalAbsent;

  return {
    present: totalPresent,
    absent: totalAbsent,
    percentage: Math.round(
      (totalPresent / totalPossible) * 100
    ),
  };
};
