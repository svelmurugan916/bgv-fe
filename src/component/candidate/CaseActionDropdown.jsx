import React, { useState, useRef, useEffect } from 'react';
import {
    Download, MoreVertical, MapPin, GraduationCap,
    Briefcase, Fingerprint, Users, Database,
    ShieldAlert, CircleStop, Plus, Loader2, PlayCircle,
    ChevronRight // Added for sub-menu indicator
} from 'lucide-react';

const CaseActionDropdown = ({ setIsCreateModalOpen, handeStopCaseClick, candidateStatus, handleDownloadReport, isDownloading, onOpenIDVerificationModal }) => { // Added onOpenIDVerificationModal
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const identityMenuItemRef = useRef(null); // Ref for the Identity menu item
    const [actionLoading, setActionLoading] = useState(false);
    const [identitySubMenuOpen, setIdentitySubMenuOpen] = useState(false);
    const [openSubMenuLeft, setOpenSubMenuLeft] = useState(false); // New state for sub-menu direction

    // Derived State
    const isStopped = candidateStatus === 'STOP_CASE';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIdentitySubMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect to calculate sub-menu position based on available space
    useEffect(() => {
        if (identitySubMenuOpen && identityMenuItemRef.current) {
            const menuItemRect = identityMenuItemRef.current.getBoundingClientRect();
            // Assuming sub-menu width is w-48 (192px) + 2 units of margin (8px) = 200px
            const subMenuEstimatedWidth = 200;
            const rightSpace = window.innerWidth - menuItemRect.right;

            if (rightSpace < subMenuEstimatedWidth + 30) { // Add a buffer of 30px
                setOpenSubMenuLeft(true);
            } else {
                setOpenSubMenuLeft(false);
            }
        }
    }, [identitySubMenuOpen]); // Recalculate when sub-menu opens

    const handleIdentitySubItemClick = (documentType) => {
        // This is the key change: call the new prop to open the IDVerification modal
        if (onOpenIDVerificationModal) {
            onOpenIDVerificationModal(documentType);
        }
        setIsOpen(false); // Close main dropdown
        setIdentitySubMenuOpen(false); // Close sub-dropdown
    };

    const menuItems = [
        { icon: <MapPin size={16} />, label: 'Address', onClick: () => { setIsCreateModalOpen(true); setIsOpen(false); } },
        { icon: <GraduationCap size={16} />, label: 'Education', onClick: () => setIsOpen(false) },
        { icon: <Briefcase size={16} />, label: 'Employment', onClick: () => setIsOpen(false) },
        {
            icon: <Fingerprint size={16} />,
            label: 'Identity',
            isSubMenu: true, // Mark this item as having a sub-menu
            onClick: (e) => {
                e.stopPropagation(); // Prevent closing the main dropdown immediately
                setIdentitySubMenuOpen(prev => !prev);
            },
            subItems: [
                { label: 'PAN', onClick: () => handleIdentitySubItemClick('PAN') },
                { label: 'AADHAAR', onClick: () => handleIdentitySubItemClick('AADHAAR') },
                { label: 'Passport', onClick: () => handleIdentitySubItemClick('PASSPORT') },
            ]
        },
        { icon: <Users size={16} />, label: 'Reference', onClick: () => setIsOpen(false) },
        { icon: <Database size={16} />, label: 'Database check', onClick: () => setIsOpen(false) },
        { icon: <ShieldAlert size={16} />, label: 'Criminal check', onClick: () => setIsOpen(false) },
    ];

    const handleToggleCaseStatus = async () => {
        setActionLoading(true);
        try {
            await handeStopCaseClick();
        } finally {
            setActionLoading(false);
            setIsOpen(false);
            setIdentitySubMenuOpen(false); // Close sub-menu if case status is toggled
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
                        </>
                    ) : (
                        <>
                            <Download size={16} /> Download report
                        </>
                    )
                }
            </button>

            {/* More Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIdentitySubMenuOpen(false); // Close sub-menu if main dropdown is toggled
                }}
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
                        <div
                            key={index}
                            className="relative"
                            ref={item.isSubMenu ? identityMenuItemRef : null}
                        >
                            <button
                                disabled={isStopped}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group text-left
                                ${isStopped
                                    ? 'opacity-40 cursor-not-allowed grayscale'
                                    : 'text-slate-600 hover:bg-[#F9F7FF] hover:text-[#5D4591] cursor-pointer'}`}
                                onClick={item.onClick}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#5D4591] group-hover:shadow-sm transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                                </div>
                                {!isStopped && item.isSubMenu && <ChevronRight size={14} className={`transition-transform duration-300 ${identitySubMenuOpen ? 'rotate-90' : ''}`} />}
                                {!isStopped && !item.isSubMenu && <Plus size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                            </button>

                            {/* Nested Dropdown for Identity */}
                            {item.isSubMenu && identitySubMenuOpen && (
                                <div className={`
                                    absolute top-0 w-48 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[101] py-2
                                    transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                                    ${openSubMenuLeft ? 'right-full mr-2 origin-top-right' : 'left-full ml-2 origin-top-left'}
                                    opacity-100 scale-100 translate-x-0 pointer-events-auto
                                `}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <button
                                            key={subIndex}
                                            disabled={isStopped}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group text-left
                                                ${isStopped
                                                ? 'opacity-40 cursor-not-allowed grayscale'
                                                : 'text-slate-600 hover:bg-[#F9F7FF] hover:text-[#5D4591] cursor-pointer'}`}
                                            onClick={subItem.onClick}
                                        >
                                            <div className="flex items-center justify-center text-slate-400 group-hover:text-[#5D4591] transition-all duration-300">
                                                <Fingerprint size={16} />
                                            </div>
                                            <span className="text-xs font-bold tracking-tight">{subItem.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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
