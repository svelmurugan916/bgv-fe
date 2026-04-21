import React, { useState } from 'react';
import {
    Loader2,
    RotateCcw,
    AlertCircle,
    MapPin,
    Fingerprint,
    Globe,
    ShieldCheckIcon,
    IdCard,
    CalendarDays,
    ArrowRightLeft,
    Info,
    X,
    AlertTriangle, ExternalLinkIcon
} from 'lucide-react';
import TaskReservationDrawer from "./TaskReservationDrawer.jsx";

const ReservationSplitTable = ({ data, isLoading, error, onRelease, loading, hasMore, loadingMore, onLoadMore, total, seperateTable = false }) => {
    // --- State for Release Confirmation Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [taskId, setTaskId] = useState(null);

    console.log("seperateTable -- ", seperateTable)

    const STATUS_MAP = {
        ACTIVE: {
            classes: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            dot: 'bg-emerald-500',
            description: 'Reservation is active and funds are currently locked.'
        },
        PARTIALLY_CONSUMED: {
            classes: 'bg-amber-50 text-amber-700 border-amber-100',
            dot: 'bg-amber-500',
            description: 'Funds are partially used; remaining balance is still locked.'
        },
        COMMITTED: {
            classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            dot: 'bg-indigo-600',
            description: 'Funds are securely locked for this candidate. This amount is committed until the form is submitted or the session expires.'
        },
        EXPIRED: {
            classes: 'bg-slate-100 text-slate-500 border-slate-200',
            dot: 'bg-slate-300',
            description: 'The candidate session has timed out. The committed funds have been automatically released back to the wallet.'
        },
        FULLY_CONSUMED: {
            classes: 'bg-blue-50 text-blue-700 border-blue-100',
            dot: 'bg-blue-500',
            description: 'Funds have been fully utilized for this verification check.'
        },
        RELEASED: {
            classes: 'bg-slate-50 text-slate-600 border-slate-200',
            dot: 'bg-slate-400',
            description: 'Reservation was closed and unused funds were released.'
        },
        CANCELLED: {
            classes: 'bg-rose-50 text-rose-700 border-rose-100',
            dot: 'bg-rose-500',
            description: 'The check was cancelled and funds were returned to the wallet.'
        }
    };

    const getCheckTypeIcon = (code) => {
        const iconClass = "shrink-0";
        switch (code?.toUpperCase()) {
            case 'ADDRESS': return <MapPin size={14} className={iconClass} />;
            case 'PAN': return <IdCard size={14} className={iconClass} />;
            case 'AADHAAR': return <Fingerprint size={14} className={iconClass} />;
            case 'PASSPORT': return <Globe size={14} className={iconClass} />;
            case 'CRIMINAL': return <ShieldCheckIcon size={14} className={iconClass} />;
            default: return <ArrowRightLeft size={14} className={iconClass} />;
        }
    };

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        setReason('');
        setSubmitError(null);
    };

    const handleCloseModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleConfirmRelease = async () => {
        if (!reason.trim()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await onRelease(selectedItem.id, reason);
            setIsModalOpen(false);
        } catch (err) {
            setSubmitError(err.message || "Failed to release funds. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-200 py-32 text-center">
                <Loader2 className="mx-auto animate-spin text-[#5D4591]" />
            </div>
        );
    }

    if (isLoading) return (
        <div className="py-12 flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 mx-8 mb-6">
            <Loader2 size={28} className="text-[#5D4591] animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decrypting Reservation Split...</p>
        </div>
    );

    if (error) return (
        <div className="py-8 flex items-center justify-center gap-3 bg-rose-50 rounded-[2rem] border border-rose-100 mx-8 mb-6">
            <AlertCircle size={20} className="text-rose-500" />
            <p className="text-sm font-bold text-rose-700">{error}</p>
        </div>
    );

    return (
        <>
        <div className="relative mx-8 mb-8 flex gap-4">
            {
                (!seperateTable) && <div className="w-1 bg-slate-100 rounded-full ml-4 my-2" />
            }
            <div className="flex-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Check Item</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserved</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Consumed</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Consumption Log</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {data.map((item) => {
                        const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.ACTIVE;
                        return (
                            <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#5D4591] group-hover:bg-white group-hover:shadow-sm transition-all">
                                            {getCheckTypeIcon(item.checkTypeCode)}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{item.checkTypeCode}</p>
                                            <div className="relative inline-block group/tooltip mt-1">
                                                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border transition-all cursor-help ${statusInfo.classes}`}>
                                                        <span className={`w-1 h-1 rounded-full ${statusInfo.dot}`} />
                                                        {item.status.replace('_', ' ')}
                                                    </span>
                                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block z-50">
                                                    <div className="bg-slate-900 text-white text-[9px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 border border-white/10">
                                                        <Info size={10} className="text-blue-400" />
                                                        {statusInfo.description}
                                                        <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-black text-slate-900">₹{item.reservedAmount.toFixed(2)}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className={`text-sm font-bold ${item.consumedAmount > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                                        ₹{item.consumedAmount.toFixed(2)}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className=" items-center text-slate-500">
                                        <p className="text-[11px] font-medium">{new Date(item?.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                            {new Date(item?.createdDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item?.consumedAt ? (
                                        /* --- CONSUMED STATE (Success Flow) --- */
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                                <span className="text-[9px] font-black uppercase tracking-wider">Consumed At</span>
                                            </div>
                                            <div className="ml-3.5">
                                                <span className="text-[11px] font-bold text-slate-700">
                                                    {new Date(item.consumedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 ml-2">
                                                    {new Date(item.consumedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ) : item.status === 'COMMITTED' ? (
                                        /* --- COMMITTED STATE (NEW: In-Progress Flow) --- */
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-indigo-600">
                                                {/* Pulsing dot indicates live session activity */}
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(93,69,145,0.4)]" />
                                                <span className="text-[9px] font-black uppercase tracking-wider">Committed At</span>
                                            </div>
                                            <div className="ml-3.5">
                                                <span className="text-[11px] font-bold text-slate-700">
                                                    {new Date(item.committedAt || item.updatedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 ml-2">
                                                    {new Date(item.committedAt || item.updatedDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ) : item?.releasedAt ? (
                                        /* --- RELEASED STATE (Reversal Flow) --- */
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                <span className="text-[9px] font-black uppercase tracking-wider">Released At</span>
                                            </div>
                                            <div className="ml-3.5 text-[11px] font-bold text-slate-500 ml-3.5 italic">
                                                <span className="text-[11px] font-bold ">
                                                    {new Date(item.releasedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[9px] font-bold ml-2">
                                                     {new Date(item.releasedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        /* --- PENDING STATE --- */
                                        <div className="flex items-center gap-2 text-slate-300 group-hover:text-[#5D4591]/40 transition-colors">
                                            <Loader2 size={10} className="animate-spin opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] italic">Awaiting Action</span>
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    {item.status === 'ACTIVE' ? (
                                        <div className="gap-2">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-100 rounded-xl text-[9px] font-black text-rose-500 uppercase tracking-[0.1em] hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-sm transition-all active:scale-95 group/btn"
                                            >
                                                <RotateCcw size={12} className="group-hover/btn:-rotate-180 transition-transform duration-500" />
                                                Release Fund
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); setTaskId(item?.verificationTaskId) }}
                                                className="ml-2 inline-flex  items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#5D4591] hover:text-[#4a3675] bg-[#5D4591]/5  rounded-xl border border-[#5D4591]/10 transition-all hover:bg-[#5D4591]/10 active:scale-95"
                                            >
                                                <ExternalLinkIcon size={10} />
                                                View Details
                                            </button>
                                        </div>

                                    ) : <button
                                            onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); setTaskId(item?.verificationTaskId) }}
                                            className="inline-flex  items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#5D4591] hover:text-[#4a3675] bg-[#5D4591]/5  rounded-xl border border-[#5D4591]/10 transition-all hover:bg-[#5D4591]/10 active:scale-95"
                                        >
                                        <ExternalLinkIcon size={10} />
                                        View Details
                                    </button>
                                    }
                                </td>

                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* --- RELEASE CONFIRMATION MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Release Funds</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Transaction Reversal</p>
                                </div>
                            </div>
                            <button onClick={handleCloseModal} className="text-slate-300 hover:text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-8 py-4 space-y-6">
                            {/* Warning Note */}
                            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                                <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                                    <span className="block mb-1 uppercase tracking-wider">Attention:</span>
                                    Releasing these funds will <span className="underline">cancel</span> the {selectedItem?.checkTypeCode} check.
                                    The reserved amount of ₹{selectedItem?.reservedAmount.toFixed(2)} will be credited back to your wallet.
                                    This check cannot be processed once funds are released.
                                </p>
                            </div>

                            {/* Reason Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Reason for Release <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g., Incorrect document provided, client requested cancellation..."
                                    className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5D4591]/20 focus:border-[#5D4591]/30 transition-all resize-none"
                                />
                            </div>

                            {submitError && (
                                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-tight bg-rose-50 p-3 rounded-xl border border-rose-100">
                                    <AlertCircle size={14} /> {submitError}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 pb-8 pt-4 flex gap-3">
                            <button
                                onClick={handleCloseModal}
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRelease}
                                disabled={!reason.trim() || isSubmitting}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg
                                    ${!reason.trim() || isSubmitting
                                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed shadow-none'
                                    : 'bg-rose-500 text-white shadow-rose-200 hover:scale-[1.02] active:scale-95'}`}
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                                Confirm Release
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <TaskReservationDrawer taskId={taskId}
                                   isOpen={isDrawerOpen}
                                   onClose={() => setDrawerOpen(false)}
                                   onRelease={(itemId, reason) => onRelease(itemId, reason)}
            />
        </div>
        {seperateTable && (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Entries: {total}</p>
                {hasMore &&
                    <button onClick={onLoadMore} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#5D4591] uppercase tracking-[0.2em] shadow-sm hover:bg-[#F9F7FF] transition-all cursor-pointer">
                        {loadingMore ? <Loader2 className="animate-spin" size={14} /> : 'Load More'}
                    </button>
                }
            </div>
        )}
        </>
    );
};

export default ReservationSplitTable;
