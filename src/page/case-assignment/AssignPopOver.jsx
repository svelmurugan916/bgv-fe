import React, { useState, useEffect } from 'react';
import { Search, X, Check, Briefcase, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AssignPopOver = ({ isOpen, onClose, activeCase, users }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [shouldRender, setShouldRender] = useState(false);

    // States for interaction lifecycle
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setStatus('idle');
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) setShouldRender(false);
    };

    // Pre-select user if it's a re-assign
    useEffect(() => {
        if (!Array.isArray(activeCase) && activeCase?.assignedTo) {
            const user = users.find(u => u.value === activeCase.assignedTo);
            if (user) setSelectedUserId(user.key);
        } else {
            setSelectedUserId(null); // Reset for bulk or unassigned
        }
    }, [activeCase, isOpen, users]);

    // Reset error state if user changes selection
    useEffect(() => {
        if (status === 'error') setStatus('idle');
    }, [selectedUserId]);

    const handleConfirm = async () => {
        setStatus('loading');

        try {
            // --- SIMULATED API CALL ---
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Randomly simulate success or failure (80% success rate)
                    Math.random() > 0.5 ? resolve() : reject();
                }, 1500);
            });

            setStatus('success');
            // Close after showing success for 1 second
            setTimeout(() => {
                onClose();
            }, 1200);

        } catch (error) {
            setStatus('error');
            // Note: Pop-over does NOT close on error, allowing retry
        }
    };

    if (!shouldRender) return null;

    const filteredUsers = users.filter(u =>
        u.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getOccupancyStyle = (wip) => {
        if (wip >= 8) return { label: 'Fully Occupied', color: 'bg-rose-500', text: 'text-rose-600' };
        if (wip >= 4) return { label: 'Partially Occupied', color: 'bg-amber-500', text: 'text-amber-600' };
        return { label: 'Available', color: 'bg-emerald-500', text: 'text-emerald-600' };
    };

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}
        >
            <style>{`
                @keyframes macMaximize {
                    0% { transform: scale(0.3) translateY(100px); opacity: 0; filter: blur(10px); }
                    60% { transform: scale(1.03) translateY(-10px); opacity: 1; filter: blur(0px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes macMinimize {
                    0% { transform: scale(1) translateY(0); opacity: 1; }
                    100% { transform: scale(0.3) translateY(200px); opacity: 0; filter: blur(20px); }
                }
                .mac-animate-in {
                    animation: macMaximize 0.55s cubic-bezier(0.23, 1.02, 0.35, 1.19) forwards;
                }
                .mac-animate-out {
                    animation: macMinimize 0.45s cubic-bezier(0.45, 0, 0.55, 1) forwards;
                }
            `}</style>

            <div
                onAnimationEnd={handleAnimationEnd}
                className={`bg-white w-full max-w-lg rounded-[32px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.4)] overflow-hidden ${isOpen ? 'mac-animate-in' : 'mac-animate-out'}`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                            {Array.isArray(activeCase) ? 'Bulk Assignment' : 'Assign Reviewer'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {Array.isArray(activeCase)
                                ? `Allocating ${activeCase.length} cases to one user`
                                : `Case: ${activeCase?.caseNo} • ${activeCase?.type}`}
                        </p>
                    </div>
                    <button onClick={onClose} disabled={status === 'loading'} className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90 disabled:opacity-30">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Search Box */}
                <div className="p-4 bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            disabled={status === 'loading' || status === 'success'}
                            placeholder="Search by name or email..."
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#5D4591]/10 focus:border-[#5D4591] outline-none transition-all shadow-sm disabled:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* User Grid (Compact Tiles) */}
                <div className="max-h-[420px] overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredUsers.map((user) => {
                            const occupancy = getOccupancyStyle(user.wip);
                            const isSelected = selectedUserId === user.key;

                            return (
                                <button
                                    key={user.key}
                                    disabled={status === 'loading' || status === 'success'}
                                    onClick={() => setSelectedUserId(user.key)}
                                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl transition-all group border
                                    ${isSelected
                                        ? 'bg-[#F9F7FF] border-[#5D4591] ring-1 ring-[#5D4591]/20'
                                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'}
                                    ${status === 'loading' || status === 'success' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {/* Selection Checkmark Overlay */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#5D4591] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                            <Check size={12} className="text-white stroke-[3]" />
                                        </div>
                                    )}

                                    {/* Avatar */}
                                    <div className="relative mb-3">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300
                                            ${isSelected ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-50'}`}>
                                            {user.value[0]}
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${occupancy.color}`} />
                                    </div>

                                    {/* User Info */}
                                    <div className="w-full">
                                        <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[#5D4591]' : 'text-slate-800'}`}>
                                            {user.value}
                                        </p>
                                        <div className="flex flex-col items-center gap-1 mt-1">
                                            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                <Briefcase size={10} /> {user.wip} Cases
                                            </span>
                                            <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full bg-slate-50 ${occupancy.text}`}>
                                                {occupancy.label}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Confirm Action */}
                <div className="p-6 border-t border-slate-50 bg-white">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedUserId || status === 'loading' || status === 'success'}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl
                            ${status === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-[1.02]' :
                            status === 'error' ? 'bg-rose-600 text-white shadow-rose-600/30 animate-shake' :
                                'bg-[#5D4591] text-white shadow-[#5D4591]/20 hover:bg-[#4a3675] active:scale-[0.96]'}
            
                            ${(!selectedUserId || status === 'loading') && status !== 'success'
                            ? 'opacity-30 grayscale cursor-not-allowed'
                            : 'opacity-100 grayscale-0 cursor-pointer'}
            
                                ${status === 'success' ? 'cursor-default' : ''}
                            `}
                    >
                        {status === 'loading' && (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Assigning...</span>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <CheckCircle2 size={18} className="animate-in zoom-in duration-300" />
                                <span>Assigned!</span>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <AlertCircle size={18} className="animate-bounce" />
                                <span>Failed! Try Again</span>
                            </>
                        )}
                        {status === 'idle' && (Array.isArray(activeCase) ? `Confirm Bulk Assign` : "Confirm Assignment")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignPopOver;
