import { useMemo } from "react";
import { calculateTotal } from "../facality/utilsFaculty/utils/calculateTotal";
import { calculateGrade } from "../facality/utilsFaculty/utils/calculateGrade";

const useMarksCalculation = (marks = []) => {
  const safeMarks = Array.isArray(marks) ? marks : [];

  // ================= TOTAL =================
  const totalMarks = useMemo(() => {
    return calculateTotal(safeMarks);
  }, [safeMarks]);

  // ================= MAX MARKS =================
  const maxMarks = useMemo(() => {
    return safeMarks.length * 30;
  }, [safeMarks.length]);

  // ================= PERCENTAGE =================
  const percentage = useMemo(() => {
    if (!maxMarks) return 0;
    return ((totalMarks / maxMarks) * 100).toFixed(2);
  }, [totalMarks, maxMarks]);

  // ================= AVERAGE (IMPORTANT) =================
  const averageMarks = useMemo(() => {
    if (!safeMarks.length) return 0;
    return totalMarks / safeMarks.length;
  }, [totalMarks, safeMarks.length]);

  // ================= GRADE =================
  const gradeInfo = useMemo(() => {
    return calculateGrade(averageMarks);
  }, [averageMarks]);

  return {
    totalMarks,
    maxMarks,
    percentage,
    gradeInfo,
  };
};

export default useMarksCalculation;

