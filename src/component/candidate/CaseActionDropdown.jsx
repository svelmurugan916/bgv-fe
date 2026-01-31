import React, { useState, useRef, useEffect } from 'react';
import {
    Download, MoreVertical, MapPin, GraduationCap,
    Briefcase, Fingerprint, Users, Database,
    ShieldAlert, CircleStop, Plus, ChevronRight
} from 'lucide-react';

const CaseActionDropdown = ({setIsCreateModalOpen}) => {
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

    const menuItems = [
        { icon: <MapPin size={16} />, label: 'Address', onClick: () => setIsCreateModalOpen(true)},
        { icon: <GraduationCap size={16} />, label: 'Education' },
        { icon: <Briefcase size={16} />, label: 'Employment' },
        { icon: <Fingerprint size={16} />, label: 'Identity' },
        { icon: <Users size={16} />, label: 'Reference' },
        { icon: <Database size={16} />, label: 'Database check' },
        { icon: <ShieldAlert size={16} />, label: 'Criminal check' },
    ];

    return (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            {/* Download Button */}
            <button className="bg-[#5D4591] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-[#4a3675] transition-all active:scale-95 cursor-pointer">
                <Download size={16} /> Download report
            </button>

            {/* More Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer border ${
                    isOpen
                        ? 'bg-slate-100 border-slate-200 text-slate-800'
                        : 'text-slate-400 border-transparent hover:bg-slate-50'
                }`}
            >
                <MoreVertical size={20} className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* SMOOTH TRANSITION DROPDOWN */}
            <div className={`
                absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] py-2 
                transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top-right
                ${isOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'}
            `}>

                <div className="px-4 py-2 mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5D4591] animate-pulse" />
                </div>

                <div className="space-y-0.5 px-1">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-[#F9F7FF] hover:text-[#5D4591] transition-all group text-left"
                            onClick={() => {
                                // Fix: Check if onClick exists before calling it
                                if (item.onClick) {
                                    item.onClick();
                                } else {
                                    console.log(`${item.label} clicked - No action defined yet`);
                                }
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#5D4591] group-hover:shadow-sm transition-all duration-300">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-bold tracking-tight">{item.label}</span>
                            </div>
                            <Plus size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </button>
                    ))}
                </div>

                {/* Separator */}
                <div className="h-px bg-slate-100 my-2 mx-3" />

                {/* Stop Case Action - Red Shaded Warning */}
                <div className="px-1">
                    <button
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all group text-left"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-rose-100/50 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                            <CircleStop size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tight">Stop case</span>
                            <span className="text-[9px] text-rose-400 font-bold uppercase">Terminate Case</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaseActionDropdown;
