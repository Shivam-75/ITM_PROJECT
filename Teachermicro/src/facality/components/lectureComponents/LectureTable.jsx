import React from "react";
import LectureCard from "./LectureCard";

const LectureTable = ({ data, onDelete }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {data?.map((lecture, index) => (
        <LectureCard
          key={index}
          lecture={lecture}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default React.memo(LectureTable);


