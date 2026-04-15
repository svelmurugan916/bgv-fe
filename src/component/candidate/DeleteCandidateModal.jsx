import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Loader2, AlertCircle, CheckCircle2, Timer } from 'lucide-react';

const DeleteCandidateModal = ({ isOpen, onClose, caseNo, onDeleteConfirm }) => {
    const [confirmInput, setConfirmInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setConfirmInput('');
            setError(null);
            setSuccess(false);
            setCountdown(3);
        }
    }, [isOpen]);

    // Handle Countdown Timer
    useEffect(() => {
        let timer;
        if (success && countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        } else if (success && countdown === 0) {
            window.location.reload();
        }
        return () => clearInterval(timer);
    }, [success, countdown]);

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onDeleteConfirm();
            setSuccess(true);
        } catch (err) {
            setError(err?.message || "Failed to delete candidate data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={!isLoading && !success ? onClose : undefined} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {success ? (
                    /* SUCCESS STATE */
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Data Purged Successfully</h2>
                        <p className="text-slate-500 text-sm mb-8 font-medium">The candidate records have been erased as per DPDP compliance.</p>

                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <Timer size={18} className="text-[#5D4591] animate-pulse" />
                            <span className="text-sm font-bold text-slate-700">Reloading in {countdown}s...</span>
                        </div>
                    </div>
                ) : (
                    /* CONFIRMATION STATE */
                    <>
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Danger Zone</h2>
                                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-0.5">Permanent Data Erasure</p>
                                </div>
                            </div>

                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-6">
                                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                                    <strong>Warning:</strong> This action will permanently delete all PII, documents, and evidence related to this candidate. This action <strong>cannot be undone</strong> under the DPDP Act.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in shake-1">
                                    <AlertCircle size={16} />
                                    <p className="text-xs font-bold">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Type <span className="text-slate-900 select-all px-1.5 py-0.5 bg-slate-100 rounded">{caseNo}</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmInput}
                                        onChange={(e) => setConfirmInput(e.target.value)}
                                        placeholder="Enter Case Number"
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={confirmInput !== caseNo || isLoading}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${
                                    confirmInput === caseNo && !isLoading
                                        ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                {isLoading ? 'Purging...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteCandidateModal;
