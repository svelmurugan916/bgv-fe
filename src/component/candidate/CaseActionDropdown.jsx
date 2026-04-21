import React, {useEffect, useRef, useState} from 'react';
import {
    Briefcase,
    ChevronRight,
    CircleStop,
    Database,
    Download,
    Fingerprint,
    GraduationCap,
    Loader2,
    MapPin,
    MoreVertical,
    PlayCircle,
    Plus,
    ShieldAlert, Trash2Icon,
    Users,
    CircleAlert,
    X
} from 'lucide-react';

const CaseActionDropdown = ({
                                setIsCreateModalOpen,
                                handeStopCaseClick,
                                candidateStatus,
                                handleDownloadReport,
                                isDownloading,
                                onOpenIDVerificationModal,
                                taskTypes = [], // Added taskTypes prop
                                disableStopCase = false,
                                onDeleteClick
                            }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const identityMenuItemRef = useRef(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [identitySubMenuOpen, setIdentitySubMenuOpen] = useState(false);
    const [openSubMenuLeft, setOpenSubMenuLeft] = useState(false);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    const isStopped = candidateStatus === 'STOP_CASE';

    // Helper to check if a task is already created
    const isTaskDisabled = (type) => taskTypes?.map(t => t.toLowerCase()).includes(type.toLowerCase());

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

    useEffect(() => {
        if (identitySubMenuOpen && identityMenuItemRef.current) {
            const menuItemRect = identityMenuItemRef.current.getBoundingClientRect();
            const subMenuEstimatedWidth = 200;
            const rightSpace = window.innerWidth - menuItemRect.right;

            if (rightSpace < subMenuEstimatedWidth + 30) {
                setOpenSubMenuLeft(true);
            } else {
                setOpenSubMenuLeft(false);
            }
        }
    }, [identitySubMenuOpen]);

    const handleIdentitySubItemClick = (documentType) => {
        if (onOpenIDVerificationModal) {
            onOpenIDVerificationModal(documentType);
        }
        setIsOpen(false);
        setIdentitySubMenuOpen(false);
    };

    const menuItems = [
        {
            icon: <MapPin size={16}/>, label: 'Address', onClick: () => {
                setIsCreateModalOpen(true);
                setIsOpen(false);
            }
        },
        {icon: <GraduationCap size={16}/>, label: 'Education', onClick: () => setIsOpen(false)},
        {icon: <Briefcase size={16}/>, label: 'Employment', onClick: () => setIsOpen(false)},
        {
            icon: <Fingerprint size={16}/>,
            label: 'Identity',
            isSubMenu: true,
            onClick: (e) => {
                e.stopPropagation();
                setIdentitySubMenuOpen(prev => !prev);
            },
            subItems: [
                {label: 'PAN', onClick: () => handleIdentitySubItemClick('PAN'), isDisabled: isTaskDisabled('pan')},
                {
                    label: 'AADHAAR',
                    onClick: () => handleIdentitySubItemClick('aadhaar'),
                    isDisabled: isTaskDisabled('aadhaar')
                },
                {
                    label: 'Passport',
                    onClick: () => handleIdentitySubItemClick('PASSPORT'),
                    isDisabled: isTaskDisabled('passport')
                },
            ]
        },
        {
            icon: <Users size={16}/>,
            label: 'Reference',
            onClick: () => setIsOpen(false),
            isDisabled: isTaskDisabled('reference')
        },
        {
            icon: <Database size={16}/>,
            label: 'Database check',
            onClick: () => setIsOpen(false),
            isDisabled: isTaskDisabled('database')
        },
        {
            icon: <ShieldAlert size={16}/>,
            label: 'Criminal check',
            onClick: () => setIsOpen(false),
            isDisabled: isTaskDisabled('criminal')
        },
    ];

    const handleToggleCaseStatus = async () => {
        setActionLoading(true);
        try {
            const response = await handeStopCaseClick();
            if (response.status === 400) {
                const errorMessage = response?.data?.error || "This action cannot be completed right now.";
                setErrorModal({ isOpen: true, message: errorMessage });
            }
        } catch (err) {
            setErrorModal({ isOpen: true, message: "A connection error occurred. Please try again." });
        } finally {
            setActionLoading(false);
            setIsOpen(false);
            setIdentitySubMenuOpen(false);
        }
    };

    return (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button
                onClick={handleDownloadReport}
                className="bg-[#5D4591] text-white h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-[#4a3675] transition-all active:scale-95 cursor-pointer shrink-0"
            >
                {isDownloading ? (
                    <Loader2 className="animate-spin" size={16}/>
                ) : (
                    <Download size={16}/>
                )}
                <span className="whitespace-nowrap">
                    Report
                </span>
            </button>

            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIdentitySubMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer border ${
                    isOpen
                        ? 'bg-slate-100 border-slate-200 text-slate-800'
                        : 'text-slate-400 border-transparent hover:bg-slate-50'
                }`}
            >
                <MoreVertical size={20} className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`}/>
            </button>

            <div className={`
                absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] py-2
                transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top-right
                ${isOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'}
            `}>

                <div className="px-4 py-2 mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</p>
                    <div
                        className={`w-1.5 h-1.5 rounded-full animate-pulse ${isStopped ? 'bg-slate-300' : 'bg-[#5D4591]'}`}/>
                </div>

                <div className="space-y-0.5 px-1">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative group/item"
                            ref={item.isSubMenu ? identityMenuItemRef : null}
                        >
                            {/* CUSTOM TOOLTIP */}
                            {item.isDisabled && (
                                <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all duration-300 z-[120] whitespace-nowrap shadow-xl border border-slate-700 translate-y-1 group-hover/item:translate-y-0">
                                    This check is already created
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"/>
                                </div>
                            )}

                            <button
                                disabled={isStopped || item.isDisabled}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group text-left
                                ${isStopped || item.isDisabled
                                    ? 'opacity-40 cursor-not-allowed grayscale'
                                    : 'text-slate-600 hover:bg-[#F9F7FF] hover:text-[#5D4591] cursor-pointer'}`}
                                onClick={item.onClick}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#5D4591] group-hover:shadow-sm transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                                </div>
                                {!isStopped && !item.isDisabled && item.isSubMenu && <ChevronRight size={14}
                                                                                                   className={`transition-transform duration-300 ${identitySubMenuOpen ? 'rotate-90' : ''}`}/>}
                                {!isStopped && !item.isDisabled && !item.isSubMenu && <Plus size={14}
                                                                                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"/>}
                            </button>

                            {item.isSubMenu && identitySubMenuOpen && !item.isDisabled && (
                                <div className={`
                                    absolute top-0 w-48 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[101] py-2
                                    transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                                    ${openSubMenuLeft ? 'right-full mr-2 origin-top-right' : 'left-full ml-2 origin-top-left'}
                                    opacity-100 scale-100 translate-x-0 pointer-events-auto
                                `}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <div key={subIndex} className="relative group/subitem px-1">
                                            {/* SUB-ITEM TOOLTIP */}
                                            {subItem.isDisabled && (
                                                <div
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-lg opacity-0 group-hover/subitem:opacity-100 pointer-events-none transition-all duration-300 z-[120] whitespace-nowrap shadow-xl border border-slate-700">
                                                    Check already created
                                                    <div
                                                        className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"/>
                                                </div>
                                            )}
                                            <button
                                                disabled={isStopped || subItem.isDisabled}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group text-left
                                                    ${isStopped || subItem.isDisabled
                                                    ? 'opacity-40 cursor-not-allowed grayscale'
                                                    : 'text-slate-600 hover:bg-[#F9F7FF] hover:text-[#5D4591] cursor-pointer'}`}
                                                onClick={subItem.onClick}
                                            >
                                                <div
                                                    className="flex items-center justify-center text-slate-400 group-hover:text-[#5D4591] transition-all duration-300">
                                                    <Fingerprint size={16}/>
                                                </div>
                                                <span
                                                    className="text-xs font-bold tracking-tight">{subItem.label}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="px-1 relative group/stop">
                    {disableStopCase && (
                        <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-lg opacity-0 group-hover/stop:opacity-100 pointer-events-none transition-all duration-300 z-[120] whitespace-nowrap shadow-xl border border-slate-700 translate-y-1 group-hover/stop:translate-y-0">
                            Case status modification disabled
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"/>
                        </div>
                    )}

                    <button
                        disabled={actionLoading || disableStopCase}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group text-left
                        ${disableStopCase
                            ? 'opacity-40 cursor-not-allowed grayscale'
                            : 'cursor-pointer'}
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
                                <Loader2 className="w-4 h-4 animate-spin"/>
                            ) : isStopped ? (
                                <PlayCircle size={16}/>
                            ) : (
                                <CircleStop size={16}/>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tight">
                                {isStopped ? 'Resume Case' : 'Stop Case'}
                            </span>
                            <span
                                className={`text-[9px] font-bold uppercase ${isStopped ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {actionLoading
                                    ? (isStopped ? 'Resuming...' : 'Terminating...')
                                    : (isStopped ? 'Continue Verification' : 'Terminate Case')}
                            </span>
                        </div>
                    </button>
                </div>
                <div className="h-px bg-slate-100 mx-4 my-2" />

                <div className="px-1">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDeleteClick(); // New Prop
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                            <Trash2Icon size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tight">Delete Candidate</span>
                            <span className="text-[9px] font-bold uppercase text-rose-400">Erase PII (DPDP)</span>
                        </div>
                    </button>
                </div>
            </div>
            {/* --- ERROR MODAL --- */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setErrorModal({ isOpen: false, message: '' })}
                    />
                    <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in duration-300">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CircleAlert size={32} />
                            </div>
                            <h3 className="text-slate-900 text-lg font-black uppercase tracking-tight mb-2">
                                Action Restricted
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                {errorModal.message}
                            </p>
                            <button
                                onClick={() => setErrorModal({ isOpen: false, message: '' })}
                                className="w-full bg-slate-900 text-white h-12 rounded-xl font-bold text-xs uppercase tracking-[0.1em] hover:bg-slate-800 transition-colors active:scale-95 cursor-pointer"
                            >
                                Understood
                            </button>
                        </div>
                        <button
                            onClick={() => setErrorModal({ isOpen: false, message: '' })}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CaseActionDropdown;
