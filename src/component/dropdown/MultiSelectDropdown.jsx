import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react'; // Added Loader2

const MultiSelectDropdown = ({ label, options, selected = [], onToggle, onClear, align = 'left', isOccupyFullWidth = false, isLoading = false }) => {
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

    // Display text logic for the button
    const getDisplayText = () => {
        if (isLoading) return "Loading..."; // Feedback during loading
        if (selected.length === 0) return label;
        if (selected.length === 1) {
            const first = selected[0];
            if(first instanceof Array)
                return first;
            else
                return options.find((option) => first === option.key)?.value || first;
        }
        return `${selected.length} Selected`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                disabled={isLoading}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2 bg-white border rounded-lg transition-all duration-200 ${isOccupyFullWidth ? 'w-full' : 'w-48'} h-10
          ${isOpen ? 'border-[#5D4591] ring-2 ring-[#5D4591]/10' : 'border-slate-200 hover:border-slate-300'}
          ${isLoading ? 'bg-slate-50 cursor-wait' : 'bg-white'}`}
            >
                <span className={`text-sm font-semibold truncate ${selected.length > 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                  {getDisplayText()}
                </span>

                {/* DYNAMIC ICON: Loader or Chevron */}
                {isLoading ? (
                    <Loader2 size={16} className="text-[#5D4591] animate-spin shrink-0" />
                ) : (
                    <ChevronDown
                        size={16}
                        className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#5D4591]' : ''}`}
                    />
                )}
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && !isLoading && (
                <div className={`absolute top-full mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-150
          ${align === 'right' ? 'right-0' : 'left-0'}`}
                >
                    <div className="max-h-72 overflow-y-auto custom-scrollbar overflow-x-hidden">
                        {options.length > 0 ? (
                            options.map((option) => {
                                const isChecked = selected.includes(option.key || option);
                                return (
                                    <button
                                        key={option.key || option}
                                        onClick={() => onToggle(option.key || option)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group 
                                        
                                        ${isChecked ? 'bg-[#F9F7FF] text-[#5D4591]'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        {/* Custom Checkbox */}
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                                        ${isChecked
                                            ? 'bg-[#5D4591] border-[#5D4591]'
                                            : 'border-slate-300 bg-white group-hover:border-slate-400'}`}
                                        >
                                            {isChecked && <Check size={12} className="text-white stroke-[4]" />}
                                        </div>

                                        {/* Label */}
                                        <span className={`flex-1 text-left text-sm font-medium transition-colors
                                            ${isChecked ? 'text-[#5D4591]' : 'text-slate-600'}`}>
                                            {option.value || option}
                                          </span>

                                        {/* Right-side Checkmark */}
                                        {isChecked && <Check size={16} className="text-[#5D4591]" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No options available</p>
                            </div>
                        )}
                    </div>

                    {/* CLEAR ALL ACTION */}
                    {selected.length > 0 && (
                        <div className="mt-1 px-2 pt-1 border-t border-slate-50">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClear();
                                }}
                                className="w-full text-left px-3 py-2 text-sm font-bold text-[#5D4591] hover:bg-[#F9F7FF] rounded-lg transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
