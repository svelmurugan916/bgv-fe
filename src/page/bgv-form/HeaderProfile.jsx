import React, { useState, useRef, useEffect } from 'react';
import { User2 } from 'lucide-react';

const HeaderProfile = ({ candidateName, profilePictureUrl }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        // Only allow opening on mobile (Tailwind sm breakpoint is 640px)
        if (window.innerWidth < 640) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- TRIGGER --- */}
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-100 group outline-none cursor-default sm:cursor-auto"
            >
                {/* Desktop Name Display */}
                <div className="hidden sm:flex flex-col items-end">
                    <p className="text-sm font-bold text-slate-800 leading-none">{candidateName}</p>
                    <p className="text-[11px] text-[#5D4591] mt-1 font-medium">Candidate</p>
                </div>

                {/* Profile Avatar */}
                <div className={`w-10 h-10 rounded-full bg-[#F5F3FF] border-2 ring-1 shadow-sm flex items-center justify-center overflow-hidden transition-all ${
                    isOpen
                        ? 'ring-[#5D4591] border-[#F5F3FF]'
                        : 'border-white ring-slate-200 sm:group-hover:ring-slate-300'
                }`}>
                    {profilePictureUrl ? (
                        <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User2 size={22} strokeWidth={1.5} className="text-[#5D4591] mt-1 opacity-80" />
                    )}
                </div>
            </button>

            {/* --- MOBILE INFO CARD --- */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[500] animate-in fade-in zoom-in-95 duration-200 origin-top-right sm:hidden">

                    <div className="p-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
                            Account Info
                        </p>

                        <div className="space-y-1">
                            <p className="text-base font-black text-slate-900 leading-tight">
                                {candidateName}
                            </p>

                            {/* Candidate Badge */}
                            <div className="pt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#F5F3FF] text-[#5D4591] uppercase tracking-wider border border-[#5D4591]/10">
                                    Candidate
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Session Info */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Secure Session Active
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderProfile;
