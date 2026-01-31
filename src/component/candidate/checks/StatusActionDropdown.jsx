import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown, ShieldCheck, Timer, AlertTriangle,
    SearchX, ShieldAlert, Edit3, ArrowLeft, Send, Loader2,
    CheckCircle2, XCircle, RefreshCcw, Check
} from 'lucide-react';

const StatusActionDropdown = ({ onStatusChange, setIsEditModalOpen, currentStatus="IN_PROGRESS" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [notes, setNotes] = useState(''); // Re-added for Insufficiency reason

    const [apiStatus, setApiStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const dropdownRef = useRef(null);

    const closeAndReset = () => {
        setIsOpen(false);
        setTimeout(() => {
            setSelectedOption(null);
            setNotes('');
            setApiStatus('idle');
            setErrorMessage('');
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (apiStatus !== 'loading') {
                    closeAndReset();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, apiStatus]);

    const statusOptions = [
        { id: 'CLEARED', label: 'Clear Check', sub: 'Verification Successful', icon: <ShieldCheck size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'IN_PROGRESS', label: 'In Progress', sub: 'Currently Verifying', icon: <Timer size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'INSUFFICIENCY', label: 'Insufficiency', sub: 'Information Missing', icon: <AlertTriangle size={16} />, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'UNABLE_TO_VERIFY', label: 'Unable to Verify', sub: 'Inconclusive Result', icon: <SearchX size={16} />, color: 'text-slate-500', bg: 'bg-slate-50' },
        { id: 'FAILED', label: 'Mark as Failed', sub: 'Verification Rejected', icon: <ShieldAlert size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const handleConfirmStatus = async () => {
        if (apiStatus === 'loading') return;

        // Validation: If insufficiency, notes are required
        if (selectedOption.id === 'INSUFFICIENCY' && !notes.trim()) return;

        setApiStatus('loading');
        try {
            await onStatusChange(selectedOption.id, notes);
            setApiStatus('success');
        } catch (error) {
            setApiStatus('error');
            setErrorMessage(error.message || "Failed to update status. Please try again.");
        }
    };

    const isInsufficiency = selectedOption?.id === 'INSUFFICIENCY';

    return (
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#5D4591] bg-[#F9F7FF] border border-[#5D4591]/20 rounded-xl hover:bg-[#F0EDFF] transition-all flex items-center gap-2 cursor-pointer"
            >
                <Edit3 size={14} /> Edit Address
            </button>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer
                    ${isOpen ? 'bg-[#5D4591] border-[#5D4591] text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <span className="text-[10px] font-black uppercase tracking-widest">Change Status</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`
                absolute right-0 top-full mt-3 w-80 bg-white border border-slate-200/60 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] overflow-hidden transition-all duration-300 origin-top-right
                ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
            `}>

                {!selectedOption && (
                    <div className="py-2">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Verdict</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5D4591] animate-pulse" />
                        </div>
                        <div className="space-y-1 px-2">
                            {statusOptions.map((option) => {
                                const isCurrent = option.id === currentStatus;
                                return (
                                    <button
                                        key={option.id}
                                        disabled={isCurrent}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all group text-left
                                            ${isCurrent ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
                                        onClick={() => setSelectedOption(option)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${option.bg} ${option.color} flex items-center justify-center transition-all duration-300 ${!isCurrent && 'group-hover:scale-110'}`}>{option.icon}</div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-700">{option.label}</span>
                                                    {isCurrent && <span className="text-[7px] font-black bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Current</span>}
                                                </div>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{option.sub}</span>
                                            </div>
                                        </div>
                                        {isCurrent && <Check size={14} className="text-slate-300" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {selectedOption && apiStatus !== 'success' && apiStatus !== 'error' && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button disabled={apiStatus === 'loading'} onClick={() => setSelectedOption(null)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-6 transition-colors cursor-pointer ${apiStatus === 'loading' ? 'text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                            <ArrowLeft size={12} /> Back
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-[2rem] ${selectedOption.bg} ${selectedOption.color} flex items-center justify-center shadow-sm mb-4`}>
                                {React.cloneElement(selectedOption.icon, { size: 28 })}
                            </div>

                            <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">
                                {isInsufficiency ? 'Reason Required' : 'Confirm Update'}
                            </h5>

                            {isInsufficiency ? (
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Please specify the reason for insufficiency</p>
                            ) : (
                                <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
                                    Are you sure you want to change the status to <span className={selectedOption.color}>{selectedOption.label}</span>?
                                    <span className="block mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[#5D4591] text-[10px]">
                                        Please ensure you have added your detailed remarks in the feedback editor at the bottom of the page.
                                    </span>
                                </p>
                            )}
                        </div>

                        {isInsufficiency && (
                            <textarea
                                autoFocus
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Type the reason for insufficiency here..."
                                className="w-full h-28 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#5D4591]/20 focus:bg-white transition-all resize-none mb-4"
                            />
                        )}

                        <button
                            disabled={apiStatus === 'loading' || (isInsufficiency && !notes.trim())}
                            onClick={handleConfirmStatus}
                            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg
                                ${apiStatus === 'loading' || (isInsufficiency && !notes.trim()) ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-[#5D4591] text-white hover:bg-[#4a3675] active:scale-95'}`}
                        >
                            {apiStatus === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : <>Confirm & Update <Send size={12} /></>}
                        </button>
                    </div>
                )}

                {apiStatus === 'success' && (
                    <div className="p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} strokeWidth={3} className="animate-in zoom-in-50 duration-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-1">Status Updated</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">The task status has been updated.</p>
                        <p className="mt-6 text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Click anywhere outside to close</p>
                    </div>
                )}

                {apiStatus === 'error' && (
                    <div className="p-8 flex flex-col items-center text-center animate-in shake duration-300">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                            <XCircle size={32} strokeWidth={3} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">Update Failed</h4>
                        <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">{errorMessage}</p>
                        <button onClick={() => setApiStatus('idle')} className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer">
                            Try Again
                        </button>
                    </div>
                )}

                <div className="h-px bg-slate-50 my-1 mx-4" />
                <div className="px-6 py-3 bg-slate-50/50 text-center">
                    <p className="text-[9px] text-slate-400 font-medium italic">This action will be logged in the permanent audit trail.</p>
                </div>
            </div>
        </div>
    );
};

export default StatusActionDropdown;
