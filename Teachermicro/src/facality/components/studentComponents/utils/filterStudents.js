export const filterStudents = (students, search, selectedClass) => {
  let result = students;

  // 🔍 Search by name or roll
  if (search) {
    const lowerSearch = search.toLowerCase();

    result = result.filter(
      (student) =>
        student.name.toLowerCase().includes(lowerSearch) ||
        student.roll.toLowerCase().includes(lowerSearch)
    );
  }

  // 🎓 Filter by class
  if (selectedClass && selectedClass !== "All") {
    result = result.filter(
      (student) => student.className === selectedClass
    );
  }

  return result;
};
