import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

const SingleSelectDropdown = ({ label, options, selected, onSelect, isOccupyFullWidth = false, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUpward: false });
    const dropdownRef = useRef(null);

    const updatePosition = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const dropdownHeight = 260; // Estimated height
            const spaceBelow = window.innerHeight - rect.bottom;

            setCoords({
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                openUpward: spaceBelow < dropdownHeight // Smart flip logic
            });
        }
    };

    const handleToggle = () => {
        updatePosition();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) return;

        // 1. Close if user clicks outside
        const handleOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };

        // 2. Close if user scrolls (Best UX for Portals)
        const handleScroll = () => setIsOpen(false);

        // We use 'capture: true' to catch scroll events from any parent container (like a Modal)
        window.addEventListener('mousedown', handleOutside);
        window.addEventListener('scroll', handleScroll, { capture: true });

        return () => {
            window.removeEventListener('mousedown', handleOutside);
            window.removeEventListener('scroll', handleScroll, { capture: true });
        };
    }, [isOpen]);

    const selectedOption = options?.find(option => option.value === selected);

    // THE MENU COMPONENT
    const DropdownMenu = (
        <div
            style={{
                position: 'fixed', // Fixed to viewport so scroll math isn't needed
                top: coords.openUpward ? 'auto' : `${coords.bottom + 8}px`,
                bottom: coords.openUpward ? `${window.innerHeight - coords.top + 8}px` : 'auto',
                left: `${coords.left}px`,
                width: `${coords.width > 256 ? coords.width : 256}px`,
                zIndex: 9999
            }}
            className={`bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] py-2 animate-in fade-in zoom-in-95 duration-100 ${coords.openUpward ? 'origin-bottom' : 'origin-top'}`}
        >
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                {options.map((option) => {
                    const isSelected = selected === (option?.value || option);
                    return (
                        <button
                            key={option?.value || option?.text || option}
                            type="button"
                            onClick={() => {
                                onSelect(option?.value || option);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center px-4 py-2.5 transition-colors group
                                ${isSelected ? 'bg-[#F9F7FF] text-[#5D4591]' : 'hover:bg-slate-50'}`}
                        >
                            <span className={`flex-1 text-left text-[14px] font-medium transition-colors
                                ${isSelected ? 'text-[#5D4591]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                {option?.text || option}
                            </span>
                            {isSelected && <Check size={16} className="text-[#5D4591]/80 shrink-0" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div
            className={`relative font-sans ${isOccupyFullWidth ? 'w-full' : 'inline-block'}`}
            ref={dropdownRef}
        >
            <button
                type="button"
                onClick={handleToggle}
                className={`flex items-center justify-between px-4 py-2 bg-white border rounded-lg transition-all
                ${isOpen ? 'border-[#5D4591] ring-1 ring-[#5D4591]/20 shadow-sm' : error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 hover:border-slate-300'} 
                ${isOccupyFullWidth ? 'w-full' : 'w-44'}`}
            >
                <span className={`text-sm font-medium truncate ${error ? 'text-rose-500' : selected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {(selectedOption?.text || selected) || label}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && createPortal(DropdownMenu, document.body)}
        </div>
    );
};

export default SingleSelectDropdown;
