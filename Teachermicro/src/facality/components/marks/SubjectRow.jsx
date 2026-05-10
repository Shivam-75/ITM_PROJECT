import {  memo, useCallback } from "react";

const SubjectRow = memo(({ subject, mark, onChange, error }) => {
  const handleInternalChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 0;
    onChange(subject.id, 'internal', value);
  }, [subject.id, onChange]);

 

  const total = (mark.internal || 0);

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-gray-800">{subject.name}</td>
      <td className="px-4 py-3 text-center">
        <input
          type="number"
          min="0"
          max={subject.maxInternal}
          value={mark.internal || ''}
          onChange={handleInternalChange}
          className={`w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            error?.internal ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0"
        />
        <span className="text-xs text-gray-500 ml-1">/{subject.maxInternal}</span>
      </td>
     
      <td className="px-4 py-3 font-semibold text-gray-800">{total}/30</td>
    </tr>
  );
});
export default SubjectRow;