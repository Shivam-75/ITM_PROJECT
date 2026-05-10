import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// ✅ give default null (important)
const MarksContext = createContext(null);

export const MarksProvider = ({ children }) => {
  const [studentMarks, setStudentMarks] = useState([]);

  // ================= ADD / UPDATE MARKS =================
  const addStudentMarks = useCallback((data) => {
    setStudentMarks((prev) => {
      if (!data?.studentId) return prev;

      // overwrite existing student's marks
      const filtered = prev.filter(
        (item) => item.studentId !== data.studentId
      );

      return [...filtered, data];
    });
  }, []);

  // ================= CONTEXT VALUE =================
  const value = useMemo(
    () => ({
      studentMarks,
      addStudentMarks,
    }),
    [studentMarks, addStudentMarks]
  );

  return (
    <MarksContext.Provider value={value}>
      {children}
    </MarksContext.Provider>
  );
};

// ================= CUSTOM HOOK =================
export const useMarks = () => {
  const context = useContext(MarksContext);

  if (context === null) {
    throw new Error(
      "useMarks must be used within a MarksProvider"
    );
  }

  return context;
};
