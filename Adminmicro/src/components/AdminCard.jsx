import React, { memo } from "react";

const Admincard = memo(({ title, children, className = "" }) => {
  return (
    <div
      className={`bg-white border rounded-xl p-4 shadow-sm min-h-[120px] ${className}`}>
      {title && <h3 className="font-bold mb-3">{title}</h3>}
      {children}
    </div>
  );
});

export default Admincard;
