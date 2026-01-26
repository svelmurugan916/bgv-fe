import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, X, AlertCircle, RefreshCcw } from 'lucide-react';

const BulkActionsBar = ({ selectedCount, onClear, handleResend }) => {
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    if (selectedCount === 0 && status === 'idle') return null;

    const handleResendClick = async () => {
        setStatus('loading');
        const isInvitationSent = await handleResend();
        if (isInvitationSent) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    const handleClose = () => {
        setStatus('idle');
        onClear();
    };

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 
            bg-slate-900 rounded-2xl shadow-2xl flex items-center overflow-hidden
            transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
            border-2 ${status === 'error' ? 'border-red-500/50' : 'border-transparent'}
            ${status === 'idle' ? 'w-[680px] p-4' :
                status === 'loading' ? 'w-[440px] p-3' :
                    status === 'success' ? 'w-[520px] p-3' : 'w-[580px] p-3'}`}
        >
            {/* PERSISTENT ANCHOR */}
            <div className={`flex items-center gap-4 shrink-0 transition-all duration-500 ${status === 'idle' ? 'pr-6 mr-2 border-r border-slate-700' : 'pr-6'}`}>
                <div className="w-8 h-8 bg-[#5D4591] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-[#5D4591]/20 shrink-0">
                    {selectedCount}
                </div>
                <p className="text-sm font-bold text-white whitespace-nowrap tracking-tight">
                    Candidates Selected
                </p>
            </div>

            {/* DYNAMIC MORPHING AREA */}
            <div className="flex-1 flex items-center overflow-hidden h-10">

                {/* 1. IDLE STATE */}
                {status === 'idle' && (
                    <div className="flex items-center justify-end w-full gap-3 animate-in fade-in slide-in-from-right-8 duration-700">
                        <button onClick={onClear} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors whitespace-nowrap">
                            Cancel
                        </button>
                        <button onClick={handleResendClick} className="flex items-center gap-2 px-6 py-2.5 bg-[#5D4591] text-white rounded-xl text-sm font-bold hover:bg-[#4a3675] transition-all shadow-lg shadow-[#5D4591]/20 whitespace-nowrap">
                            <Send size={16} /> Bulk Resend
                        </button>
                    </div>
                )}

                {/* 2. LOADING STATE */}
                {status === 'loading' && (
                    <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="h-4 w-px bg-slate-700 mx-1"></div>
                        <Loader2 className="text-[#5D4591] animate-spin shrink-0" size={18} />
                        <p className="text-sm font-bold text-slate-300 whitespace-nowrap tracking-tight">
                            Re-sending...
                        </p>
                    </div>
                )}

                {/* 3. SUCCESS STATE */}
                {status === 'success' && (
                    <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-px bg-slate-700 mx-1"></div>
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                                <CheckCircle2 size={14} strokeWidth={3} />
                            </div>
                            <p className="text-sm font-bold text-white whitespace-nowrap">Sent Successfully</p>
                        </div>
                        <button onClick={handleClose} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-300 transition-all border border-slate-800 shrink-0">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* 4. ERROR STATE: Red Theme with Retry */}
                {status === 'error' && (
                    <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-px bg-slate-700 mx-1"></div>
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0">
                                <AlertCircle size={14} strokeWidth={3} />
                            </div>
                            <p className="text-sm font-bold text-red-400 whitespace-nowrap">Failed to send</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResendClick}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-bold transition-all border border-red-500/20"
                            >
                                <RefreshCcw size={12} /> Retry
                            </button>
                            <button onClick={handleClose} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-300 transition-all border border-slate-800 shrink-0">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkActionsBar;
