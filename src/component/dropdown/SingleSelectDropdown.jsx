import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const SingleSelectDropdown = ({ label, options, selected, onSelect, isOccupyFullWidth = false, error, disabled = false }) => {
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

    const selectedOption = options?.find(option => option.value === selected);

    return (
        <div className={`relative inline-block font-sans ${isOccupyFullWidth ? 'w-full' : ''}`} ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-2 w-44 border rounded-lg transition-all duration-200
                
                ${disabled
                    ? 'bg-slate-50 border-slate-400 cursor-not-allowed opacity-70'
                    : isOpen
                        ? 'bg-white border-[#5D4591] ring-1 ring-[#5D4591]/20 shadow-sm'
                        : error
                            ? 'bg-white border-rose-500 ring-2 ring-rose-500/10 text-rose-700'
                            : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                } 
                ${isOccupyFullWidth ? 'w-full' : ''}`}
            >
                <span className={`text-sm font-medium truncate 
                    ${disabled ? 'text-slate-700' : error ? 'text-rose-500' : selected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {(selectedOption?.text || selected) || label}
                </span>

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 
                        ${disabled ? 'text-slate-300' : error ? 'text-rose-500' : 'text-slate-400'} 
                        ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && !disabled && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[100] py-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-80 overflow-y-auto py-1 custom-scrollbar">
                        {options.map((option) => {
                            const isSelected = selected === (option?.value || option);
                            return (
                                <button
                                    key={option?.text || option}
                                    onClick={() => {
                                        onSelect(option?.value || option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-2.5 transition-colors group cursor-pointer
                                        ${isSelected ? 'bg-[#F9F7FF] text-[#5D4591]' : 'hover:bg-slate-50'}`}
                                >
                                    <span className={`flex-1 text-left text-[14px] font-medium transition-colors
                                        ${isSelected ? 'text-[#5D4591]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {option?.text || option}
                                    </span>

                                    {isSelected && (
                                        <Check size={16} className="text-[#5D4591]/80 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selected && (
                        <div className="mt-1 px-4 py-2 border-t border-slate-50">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect("");
                                    setIsOpen(false);
                                }}
                                className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
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
