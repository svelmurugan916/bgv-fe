import React, { useState, useRef, useEffect } from 'react';
import {
    Download, MoreVertical, MapPin, GraduationCap,
    Briefcase, Fingerprint, Users, Database,
    ShieldAlert, CircleStop, Plus, Loader2, PlayCircle
} from 'lucide-react';

const CaseActionDropdown = ({ setIsCreateModalOpen, handeStopCaseClick, candidateStatus, handleDownloadReport, isDownloading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Derived State
    const isStopped = candidateStatus === 'STOP_CASE';

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
        { icon: <MapPin size={16} />, label: 'Address', onClick: () => setIsCreateModalOpen(true) },
        { icon: <GraduationCap size={16} />, label: 'Education' },
        { icon: <Briefcase size={16} />, label: 'Employment' },
        { icon: <Fingerprint size={16} />, label: 'Identity' },
        { icon: <Users size={16} />, label: 'Reference' },
        { icon: <Database size={16} />, label: 'Database check' },
        { icon: <ShieldAlert size={16} />, label: 'Criminal check' },
    ];

    const handleToggleCaseStatus = async () => {
        setActionLoading(true);
        try {
            await handeStopCaseClick();
        } finally {
            setActionLoading(false);
            setIsOpen(false);
        }
    }

    return (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            {/* Download Button */}
            <button onClick={handleDownloadReport} className="bg-[#5D4591] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-[#4a3675] transition-all active:scale-95 cursor-pointer">
                {
                    isDownloading ? (
                        <>
                            <Loader2 className={"animate-spin"} size={16} /> Download report
                        </>) : (
                        <>
                            <Download size={16} /> Download report
                        </>
                    )
                }
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

            {/* DROPDOWN */}
            <div className={`
                absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] py-2 
                transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top-right
                ${isOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'}
            `}>

                <div className="px-4 py-2 mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</p>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isStopped ? 'bg-slate-300' : 'bg-[#5D4591]'}`} />
                </div>

                <div className="space-y-0.5 px-1">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            disabled={isStopped}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group text-left 
                                ${isStopped
                                ? 'opacity-40 cursor-not-allowed grayscale'
                                : 'text-slate-600 hover:bg-[#F9F7FF] hover:text-[#5D4591] cursor-pointer'}`}
                            onClick={() => {
                                if (item.onClick) item.onClick();
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#5D4591] group-hover:shadow-sm transition-all duration-300">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-bold tracking-tight">{item.label}</span>
                            </div>
                            {!isStopped && <Plus size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                        </button>
                    ))}
                </div>

                {/* Separator */}
                <div className="h-px bg-slate-100 my-2 mx-3" />

                {/* Conditional Action: Stop or Resume */}
                <div className="px-1">
                    <button
                        disabled={actionLoading}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group text-left cursor-pointer
                            ${isStopped
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-rose-600 hover:bg-rose-50'}`}
                        onClick={handleToggleCaseStatus}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                            ${isStopped
                            ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                            : 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'}`}>
                            {actionLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isStopped ? (
                                <PlayCircle size={16} />
                            ) : (
                                <CircleStop size={16} />
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tight">
                                {isStopped ? 'Resume Case' : 'Stop Case'}
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${isStopped ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {actionLoading
                                    ? (isStopped ? 'Resuming...' : 'Terminating...')
                                    : (isStopped ? 'Continue Verification' : 'Terminate Case')}
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaseActionDropdown;
