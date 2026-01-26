import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const FormSingleDropdownSelect = ({ label, options, selected, onSelect, isOccupyFullWidth = false, error = undefined, title = "", isMandatory=false }) => {
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

    const selectedOption = options.find(option => option.value === selected);

    return (
        /* WORKAROUND: Changed inline-block to flex/block based on width prop */
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}
                {isMandatory &&  <span className={'text-red-500'}> *</span>}
            </label>
            <div className={`relative font-sans ${isOccupyFullWidth ? 'w-full' : 'inline-block'}`} ref={dropdownRef}>

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-between px-4 py-3 border rounded-xl transition-all duration-200
                    ${isOpen ? 'border-[#5D4591] ring-4 ring-[#5D4591]/10 shadow-sm' : 'hover:border-slate-300'} 
                    ${isOccupyFullWidth ? 'w-full' : 'w-44'}
                    ${error ? 'border-red-500 bg-red-50/10' : 'bg-white border-slate-200'}
                `}
                >
                <span className={`text-sm font-medium truncate ${selected ? 'text-slate-900' : 'text-slate-400'}`}>
                  {(selectedOption?.text || selected) || label}
                </span>
                    <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#5D4591]/80' : ''}`}
                    />
                </button>

                {/* DROPDOWN MENU */}
                {isOpen && (
                    <div className={`absolute left-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200
                    ${isOccupyFullWidth ? 'w-full' : 'w-64'} 
                `}>
                        <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
                            {options.map((option) => {
                                const isSelected = selected === (option?.value || option);
                                return (
                                    <button
                                        key={option?.text || option}
                                        onClick={() => {
                                            onSelect(option?.value || option);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center px-5 py-3 transition-colors group
                                        ${isSelected ? 'bg-[#F9F7FF]/50 text-[#5D4591]' : 'hover:bg-slate-50'}`}
                                    >
                                    <span className={`flex-1 text-left text-[14px] font-medium transition-colors
                                        ${isSelected ? 'text-[#5D4591]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {option?.text || option}
                                      </span>

                                        {isSelected && (
                                            <Check size={16} className="text-[#5D4591]/80 shrink-0" strokeWidth={3} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {selected && (
                            <div className="mt-1 px-5 py-2 border-t border-slate-50">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect("");
                                        setIsOpen(false);
                                    }}
                                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormSingleDropdownSelect;
