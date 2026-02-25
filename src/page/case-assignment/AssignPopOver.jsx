import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, CheckCircle2, AlertCircle, MessageSquare, UserCheck } from 'lucide-react';
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import {BULK_TASK_ASSIGN, REASSIGN_TASK, SINGLE_TASK_ASSIGN} from "../../constant/Endpoint.tsx";

const AssignPopOver = ({ isOpen, onClose, activeCase, users, isLoadingUsers }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [notes, setNotes] = useState("");
    const [noteError, setNoteError] = useState(false); // New: Validation state
    const [selectedUserId, setSelectedUserId] = useState(() => {
        if (!activeCase || Array.isArray(activeCase)) return null;
        return activeCase.assignedUserId || null;
    });
    const [shouldRender, setShouldRender] = useState(false);
    const [status, setStatus] = useState('idle');
    const { authenticatedRequest } = useAuthApi();

    const MAX_CAPACITY = 10;
    const isReassign = !Array.isArray(activeCase) && activeCase?.assignedUserId;

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setStatus('idle');
            setNotes("");
            setNoteError(false);
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) setShouldRender(false);
    };

    const handleConfirm = async () => {
        // VALIDATION: Notes are mandatory for Re-assignment
        if (isReassign && !notes.trim()) {
            setNoteError(true);
            return;
        }

        setStatus('loading');
        let isSuccess = false;
        try {
            const isBulk = Array.isArray(activeCase);
            const previousUserId = isReassign ? activeCase.assignedUserId : null;

            const payload = isBulk
                ? { taskIds: activeCase.map(c => c.taskId), assignedToUserId: selectedUserId, notes }
                : { taskId: activeCase?.taskId, assignedToUserId: selectedUserId, notes };

            let endpoint = isBulk ? BULK_TASK_ASSIGN : (isReassign ? REASSIGN_TASK : SINGLE_TASK_ASSIGN);

            const response = await authenticatedRequest(payload, endpoint, METHOD.POST);
            if (response.status === 200) {
                isSuccess = true;
                setStatus('success');
                setTimeout(() => onClose('success', selectedUserId, previousUserId), 1200);
            } else { setStatus('error'); }
        } catch (error) { setStatus('error'); }
        finally { if (!isSuccess) setStatus('idle'); }
    };

    if (!shouldRender) return null;

    const filteredUsers = users.filter(u =>
        u.verifierName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLoadColor = (count) => {
        if (count >= 8) return 'bg-rose-500';
        if (count >= 5) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const isSameUser = selectedUserId !== null && !Array.isArray(activeCase) && selectedUserId === activeCase?.assignedUserId;
    const isButtonDisabled = !selectedUserId || isSameUser || status === 'loading' || status === 'success' || isLoadingUsers;

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(12px)' }}
        >
            <style>{`
                @keyframes scaleUp {
                    0% { transform: scale(0.98) translateY(10px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-modal { animation: scaleUp 0.4s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>

            <div
                onAnimationEnd={handleAnimationEnd}
                className={`bg-white w-full max-w-5xl rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh] ${isOpen ? 'animate-modal' : ''}`}
            >
                {/* Header Section */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#5D4591]">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {Array.isArray(activeCase) ? 'Bulk Case Assignment' : 'Assign Reviewer'}
                            </h3>
                            <p className="text-xs font-medium text-[#5D4591] mt-0.5 uppercase tracking-wider">
                                {Array.isArray(activeCase) ? `Selecting for ${activeCase.length} cases` : `Case: ${activeCase?.caseNumber} • ${activeCase?.checkType}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors group">
                        <X size={24} className="text-slate-300 group-hover:text-slate-600" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-8 py-6">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or username..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-[#5D4591]/5 focus:border-[#5D4591]/20 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* User Grid */}
                <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {isLoadingUsers ? (
                            [...Array(8)].map((_, i) => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />)
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelected = selectedUserId === user.verifierId;
                                const loadColor = getLoadColor(user.activeTaskCount);

                                return (
                                    <button
                                        key={user.verifierId}
                                        onClick={() => setSelectedUserId(user.verifierId)}
                                        className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border overflow-hidden
                                        ${isSelected ? 'bg-white border-[#5D4591] shadow-lg shadow-[#5D4591]/5' : 'bg-white border-slate-300 hover:border-slate-200 hover:shadow-sm'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0
                                            ${isSelected ? 'bg-[#5D4591] text-white' : 'bg-slate-50 text-slate-400'}`}>
                                            {user.verifierName?.[0]}
                                        </div>
                                        <div className="flex flex-col text-left min-w-0 flex-1">
                                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-[#5D4591]' : 'text-slate-700'}`}>
                                                {user.verifierName}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                                {user.activeTaskCount} Active Cases
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="shrink-0 text-[#5D4591] animate-in zoom-in duration-300">
                                                <CheckCircle2 size={18} fill="currentColor" className="text-white fill-[#5D4591]" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                                            <div
                                                className={`h-full transition-all duration-700 ${loadColor}`}
                                                style={{ width: `${Math.min((user.activeTaskCount / MAX_CAPACITY) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer Section with Validation */}
                <div className="p-8 bg-slate-50/30 border-t border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-6 items-end">
                        <div className="flex-1 w-full text-left">
                            <div className="flex justify-between items-center mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={14} className={noteError ? "text-rose-500" : "text-slate-400"} />
                                    <label className={`text-[10px] font-bold uppercase tracking-widest ${noteError ? "text-rose-500" : "text-slate-400"}`}>
                                        {isReassign ? "Re-Assignment Reason" : "Assignment Notes"}
                                        {isReassign && <span className="ml-1 text-rose-500 font-black">* Required</span>}
                                    </label>
                                </div>
                                {noteError && (
                                    <span className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1 animate-pulse">
                                        <AlertCircle size={10} /> Please provide a reason for re-assignment
                                    </span>
                                )}
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                    if (noteError) setNoteError(false);
                                }}
                                placeholder={isReassign ? "Mention the reason for re-assigning this case..." : "Instructions for the reviewer (Optional)..."}
                                className={`w-full px-5 py-4 bg-white border rounded-2xl text-sm font-medium outline-none transition-all resize-none h-24 placeholder:text-slate-300 
                                    ${noteError
                                    ? 'border-rose-500 ring-4 ring-rose-500/10 animate-shake'
                                    : 'border-slate-300 focus:ring-4 focus:ring-[#5D4591]/5 focus:border-[#5D4591]/20'
                                }`}
                            />
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={isButtonDisabled}
                            className={`lg:w-64 w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 shadow-lg
                                ${status === 'success' ? 'bg-emerald-500 text-white' :
                                status === 'error' ? 'bg-rose-600 text-white' :
                                    'bg-[#5D4591] text-white hover:bg-[#4a3675] shadow-[#5D4591]/20'}
                                ${isButtonDisabled && status !== 'success' ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:-translate-y-0.5 active:scale-95'}`}
                        >
                            {status === 'loading' ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : status === 'success' ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <>
                                    {isSameUser ? "Already Assigned" :
                                        isReassign ? "Confirm Re-Assignment" : "Confirm Assignment"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignPopOver;
