import React, { useState } from 'react';
import {
    ShieldAlert, X, Check, CornerDownRight, Loader2,
    Target, AlertOctagon, ShieldX, RotateCcw, MessageCircle
} from 'lucide-react';

const BlockListMatchSuggestion = ({ blockMatch, onConfirm, onResolve, onUndo, isProcessing }) => {
    const [mode, setMode] = useState(null);
    const [reason, setReason] = useState('');
    const [isFake, setIsFake] = useState(true);

    // Guard clause updated to allow CONFIRMED_BLOCK
    if (!blockMatch || (blockMatch.status !== 'PENDING' && blockMatch.status !== 'CONFIRMED_BLOCK')) return null;

    const isConfirmed = blockMatch.status === 'CONFIRMED_BLOCK';
    const details = blockMatch.blockListDetails;
    const matchPercentage = Math.round((blockMatch.matchScore || 0) * 100);

    const handleFinalConfirm = () => {
        onConfirm({
            isFake,
            remarks: reason
        });
    };

    return (
        <div className={`mb-8 relative overflow-hidden rounded-[24px] border transition-all duration-500 shadow-sm
            ${isConfirmed ? 'border-rose-600 bg-rose-50/30' :
            mode === 'confirm' ? 'border-rose-500 bg-rose-50/20' : 'border-rose-200 bg-rose-50/10'}`}>

            {/* Intent Stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-500 
                ${isConfirmed || (isFake && mode === 'confirm') ? 'bg-rose-600' : 'bg-rose-500'}`}
            />

            <div className="p-5">
                <div className="flex items-center justify-between gap-6">

                    {/* 1. Identity & Status */}
                    <div className="flex items-center gap-4 min-w-[320px]">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-all duration-500
                            ${isConfirmed || (isFake && mode === 'confirm') ? 'bg-rose-600 shadow-rose-200' : 'bg-rose-500 shadow-rose-100'}`}>
                            {isConfirmed ? <ShieldX size={18} /> : mode === 'confirm' ? <ShieldX size={18} /> : <ShieldAlert size={18} className="animate-pulse" />}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isConfirmed ? 'text-rose-700' : 'text-rose-500'}`}>
                                    {isConfirmed ? 'Confirmed Discrepancy' : 'Blocklist Alert'}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-rose-300" />
                                <div className="flex items-center gap-1 bg-rose-100 px-1.5 py-0.5 rounded-md">
                                    <Target size={8} className="text-rose-600" />
                                    <span className="text-[8px] font-black uppercase text-rose-600 tracking-tighter">
                                        {matchPercentage}% Match
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                                {details.collegeName}
                            </h2>
                        </div>
                    </div>

                    {/* 2. Metadata / Resolution Summary */}
                    <div className="flex-1 flex items-center gap-8 px-6 border-l border-rose-100/50">
                        {isConfirmed ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                    <MessageCircle size={10} className="text-rose-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Auditor Resolution</span>
                                </div>
                                <p className="text-[11px] font-semibold text-rose-700 italic line-clamp-1">
                                    "{blockMatch.resolutionReason || 'Marked as fraudulent match'}"
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</span>
                                    <p className="text-[11px] font-bold text-slate-600">{details.city}, {details.state}</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Category</span>
                                    <span className="text-[10px] font-black text-rose-600 bg-rose-100/50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                        {details.blockListCategory}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 3. Action Dock */}
                    <div className="flex items-center gap-3 min-w-[180px] justify-end">
                        {isConfirmed ? (
                            <button
                                onClick={onUndo}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-white transition-all shadow-sm"
                            >
                                {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                                Undo Action
                            </button>
                        ) : !mode && (
                            <>
                                <button
                                    onClick={() => setMode('dismiss')}
                                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => setMode('confirm')}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
                                >
                                    Confirm Block
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 4. DUAL-MODE RESOLUTION SHELF */}
                {mode && !isConfirmed && (
                    <div className="mt-5 pt-5 border-t border-rose-100 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <CornerDownRight size={14} className="text-rose-300 mt-2" />

                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'confirm' ? 'text-rose-600' : 'text-slate-500'}`}>
                                    {mode === 'confirm' ? 'Final Verification Audit' : 'Dismissal Justification'}
                                </span>
                                <button onClick={() => { setMode(null); setReason(''); }} className="text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                {mode === 'confirm' && (
                                    <div
                                        onClick={() => setIsFake(!isFake)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all min-w-[200px]
                                        ${isFake ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-white border-slate-200 text-slate-500'}`}
                                    >
                                        <AlertOctagon size={16} className={isFake ? 'text-white' : 'text-slate-300'} />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase tracking-tighter opacity-80">Verification Status</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{isFake ? 'Mark as Fraud' : 'Suspicious Only'}</span>
                                        </div>
                                        <div className={`ml-auto w-8 h-4 rounded-full relative transition-all ${isFake ? 'bg-white/30' : 'bg-slate-100'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isFake ? 'right-0.5' : 'left-0.5'}`} />
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1">
                                    <textarea
                                        autoFocus
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={mode === 'confirm' ? "Required: Provide findings to support this block..." : "Provide reason for dismissing match..."}
                                        className="w-full bg-white border border-rose-100 rounded-xl p-3 text-xs font-medium text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all resize-none"
                                        rows="1"
                                    />
                                </div>

                                <button
                                    disabled={!reason.trim() || isProcessing}
                                    onClick={mode === 'confirm' ? handleFinalConfirm : () => onResolve(reason)}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg
                                        ${mode === 'confirm'
                                        ? 'bg-rose-600 text-white shadow-rose-200 hover:bg-rose-700'
                                        : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'} 
                                        disabled:opacity-30 disabled:shadow-none`}
                                >
                                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : (mode === 'confirm' ? 'Apply Block' : 'Submit Resolution')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockListMatchSuggestion;
