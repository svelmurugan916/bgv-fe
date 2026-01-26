import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const SingleSelectDropdown = ({ label, options, selected, onSelect, isOccupyFullWidth = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block font-sans" ref={dropdownRef}>
            {/* TRIGGER BUTTON - Fixed Width (w-44) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-2 w-44 bg-white border rounded-lg transition-all
          ${isOpen ? 'border-[#5D4591] ring-1 ring-[#5D4591]/20 shadow-sm' : 'border-slate-200 hover:border-slate-300'}  ${isOccupyFullWidth && 'w-full'}`}
            >
        <span className={`text-sm font-medium truncate ${selected ? 'text-slate-900' : 'text-slate-500'}`}>
          {selected || label}
        </span>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[100] py-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-80 overflow-y-auto py-1 custom-scrollbar">
                        {options.map((option) => {
                            const isSelected = selected === (option);
                            return (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false); // Closes immediately after selection
                                    }}
                                    className={`w-full flex items-center px-4 py-2.5 transition-colors group
                                        ${isSelected ? 'bg-[#F9F7FF] text-[#5D4591]' : 'hover:bg-slate-50'}`}
                                                    >
                                                        {/* Label Text */}
                                                        <span className={`flex-1 text-left text-[14px] font-medium transition-colors
                                        ${isSelected ? 'text-[#5D4591]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {option}
                                      </span>

                                    {/* Right-side Checkmark (Matching the image design) */}
                                    {isSelected && (
                                        <Check size={16} className="text-[#5D4591]/80 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Optional Reset Action */}
                    {selected && (
                        <div className="mt-1 px-4 py-2 border-t border-slate-50">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(""); // Clears selection
                                    setIsOpen(false);
                                }}
                                className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleSelectDropdown;
