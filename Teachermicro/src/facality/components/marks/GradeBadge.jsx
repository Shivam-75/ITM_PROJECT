import { memo } from "react";

const GradeBadge = memo(({ grade, status }) => {
  const colors = {
    'A+': 'bg-green-100 text-green-800 border-green-300',
    'A': 'bg-blue-100 text-blue-800 border-blue-300',
    'B': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'C': 'bg-orange-100 text-orange-800 border-orange-300',
    'F': 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${colors[grade] || colors['F']}`}>
      {grade} - {status}
    </span>
  );
});
export default GradeBadge;


