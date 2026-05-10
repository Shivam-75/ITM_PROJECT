import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const CustomSelect = ({ label, options, value, onChange, placeholder = "Select...", icon: Icon, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex-1 min-w-[200px]" ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1 italic">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border ${
            isOpen ? "border-red-600 ring-2 ring-red-600/10" : "border-gray-200"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } rounded-lg transition-all duration-200 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className={`${isOpen ? "text-red-600" : "text-gray-400"}`} size={16} />}
            <span className={`text-xs font-black uppercase tracking-wider italic ${value ? "text-gray-900" : "text-gray-400"}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center italic">
                No Options Available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    value === option.value ? "bg-red-50 text-red-600" : "hover:bg-white text-gray-600"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider italic">
                    {option.label}
                  </span>
                  {value === option.value && <FiCheck size={14} />}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;




