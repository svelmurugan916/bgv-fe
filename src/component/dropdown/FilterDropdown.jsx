import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const FilterDropdown = ({ label, options, selected, onSelect, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        <div className="relative" ref={dropdownRef}>
            {/* TRIGGER BUTTON - Now with Fixed Width (w-52) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2 bg-white border rounded-lg transition-all duration-200 w-48 h-10
          ${isOpen ? 'border-[#5D4591] ring-2 ring-[#5D4591]/10' : 'border-slate-200 hover:border-slate-300'}`}
            >
                {/* Text Container - Forced to truncate */}
                <div className="flex flex-col items-start overflow-hidden flex-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            {label}
          </span>
                    <span className="text-sm font-bold text-slate-700 leading-none truncate w-full text-left">
            {selected}
          </span>
                </div>

                {/* Icon - Prevented from shrinking */}
                <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#5D4591]' : ''}`}
                />
            </button>

            {/* DROPDOWN MENU - Matches trigger width */}
            {isOpen && (
                <div className={`absolute top-full mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 z-[100] py-2 animate-in fade-in zoom-in-95 duration-200
          ${align === 'right' ? 'right-0' : 'left-0'}`}
                >
                    <div className="px-4 py-2 mb-1 border-b border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Select {label}
            </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto custom-scrollbar overflow-x-hidden">
                        {options.map((option) => {
                            const isActive = selected === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                    }}
                                    title={option}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors
                                    ${isActive
                                        ? 'bg-[#F9F7FF] text-[#5D4591]'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                     >
                                    <span className="truncate mr-2">{option}</span>
                                    {isActive && <Check size={16} className="text-[#5D4591] shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
