import { gradeRules } from "../../data/resultData/gradeRules";

export const calculateGrade = (totalInternalMarks) => {
  const marks = Number(totalInternalMarks) || 0;

  for (const rule of gradeRules) {
    if (marks >= rule.min && marks <= rule.max) {
      return rule;
    }
  }

  return { grade: "F", status: "Fail" };
};
