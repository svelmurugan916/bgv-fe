import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X, Loader2 } from 'lucide-react';

const SingleDropdownSearch = ({
                                  label,
                                  options = [],
                                  selectedKey,
                                  onSelect,
                                  isOccupyFullWidth = false,
                                  isLoading = false
                              }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedOption = options.find(opt => opt.key === selectedKey);

    const filteredOptions = options.filter(option =>
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggle = () => {
        if (isLoading) return;
        setIsOpen(!isOpen);
        setSearchTerm("");
    };

    // Helper for display text consistent with MultiSelect
    const getDisplayText = () => {
        if (isLoading) return "Loading...";
        return selectedOption ? selectedOption.value : label;
    };

    return (
        <div className={`relative inline-block font-sans ${isOccupyFullWidth ? 'w-full' : 'w-64'}`} ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`flex items-center justify-between px-4 py-2.5 w-full bg-white border rounded-xl transition-all h-10
                ${isLoading ? 'bg-slate-50 cursor-wait opacity-100' : 'bg-white'}
                ${isOpen ? 'border-[#5D4591] ring-4 ring-[#5D4591]/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
            >
                <span className={`text-sm font-bold truncate 
                    ${isLoading ? 'text-slate-400' : (selectedOption ? 'text-slate-900' : 'text-slate-400')}`}>
                    {getDisplayText()}
                </span>

                {/* DYNAMIC ICON: Loader or Chevron */}
                {isLoading ? (
                    <Loader2 size={16} className="text-[#5D4591] animate-spin shrink-0" />
                ) : (
                    <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#5D4591]' : ''}`}
                    />
                )}
            </button>

            {/* DROPDOWN MENU - Only renders if not loading */}
            {isOpen && !isLoading && (
                <div className="absolute left-0 mt-2 w-full min-w-[240px] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                    {/* SEARCH INPUT */}
                    <div className="p-3 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-[#5D4591]/10 outline-none"
                            />
                        </div>
                    </div>

                    {/* OPTIONS LIST */}
                    <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = selectedKey === option.key;
                                return (
                                    <button
                                        key={option.key}
                                        onClick={() => {
                                            onSelect(option);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 transition-colors group
                                            ${isSelected ? 'bg-[#F9F7FF] text-[#5D4591]' : 'hover:bg-slate-50'}`}
                                    >
                                        <span className={`flex-1 text-left text-[13px] font-bold transition-colors
                                            ${isSelected ? 'text-[#5D4591]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                            {option.value}
                                        </span>
                                        {isSelected && (
                                            <Check size={14} className="text-[#5D4591] shrink-0" />
                                        )}
                                    </button>
                                )
                            })
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No results found</p>
                            </div>
                        )}
                    </div>

                    {/* CLEAR ACTION */}
                    {selectedKey && (
                        <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect({ key: "", value: "" });
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
                            >
                                <X size={12} /> Clear Selection
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleDropdownSearch;
