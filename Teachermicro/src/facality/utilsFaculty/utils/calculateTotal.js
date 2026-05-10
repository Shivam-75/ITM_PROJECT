export const calculateTotal = (marks = []) => {
  // 🛡 Safety check
  if (!Array.isArray(marks)) return 0;

  return marks.reduce(
    (sum, mark) =>
      sum + (mark?.internal || 0),
    0
  );
};