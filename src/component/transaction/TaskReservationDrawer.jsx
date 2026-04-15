import React, { useState, useEffect } from 'react';
import {
    X, Copy, Check, ArrowDownLeft, AlertCircle,
    ShieldCheck, Clock, Wallet, Hash, RefreshCw,
    FileText, Landmark, History, Info, Ban,
    RotateCcw, ShieldAlert, Timer, AlertTriangle,
    ArrowUpRight, CheckCircle2, Hourglass, ShieldCheckIcon
} from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import { GET_TASK_RESERVATION, REVERT_TASK_RESERVATION } from "../../constant/Endpoint.tsx";
import { useBalanceProvider } from "../../provider/BalanceProvider.jsx";

// ─────────────────────────────────────────────────────────────
//  Configuration Matrix
// ─────────────────────────────────────────────────────────────

const STATUS_MAP = {
    ACTIVE: {
        label: 'Active Hold',
        color: 'blue',
        icon: <Clock className="animate-pulse" />,
        heroBg: 'bg-blue-50/50',
        heroBorder: 'border-blue-100',
        heroIcon: <ArrowUpRight />,
        actionType: 'RELEASE' // Logic for "Release Funds"
    },
    PARTIALLY_CONSUMED: {
        label: 'Partially Used',
        color: 'emerald',
        icon: <CheckCircle2 />,
        heroBg: 'bg-emerald-50/50',
        heroBorder: 'border-emerald-100',
        heroIcon: <ShieldCheck />,
        actionType: 'NONE'
    },
    FULLY_CONSUMED: {
        label: 'Fully Consumed',
        color: 'emerald',
        icon: <CheckCircle2 />,
        heroBg: 'bg-emerald-50/50',
        heroBorder: 'border-emerald-100',
        heroIcon: <ShieldCheck />,
        actionType: 'NONE'
    },
    RELEASED: {
        label: 'Funds Released',
        color: 'rose',
        icon: <Ban />,
        heroBg: 'bg-rose-50/50',
        heroBorder: 'border-rose-100',
        heroIcon: <ArrowDownLeft />,
        actionType: 'RE-RESERVE' // Logic for "Re-Reserve"
    },
    CANCELLED: {
        label: 'Task Cancelled',
        color: 'rose',
        icon: <X />,
        heroBg: 'bg-rose-50/50',
        heroBorder: 'border-rose-100',
        heroIcon: <Ban />,
        actionType: 'RE-RESERVE'
    },
    COMMITTED: {
        label: 'Payment Committed',
        color: 'amber',
        icon: <Hourglass />,
        heroBg: 'bg-amber-50/50',
        heroBorder: 'border-amber-100',
        heroIcon: <Clock />,
        actionType: 'NONE'
    },
    EXPIRED: {
        label: 'Hold Expired',
        color: 'slate',
        icon: <Timer />,
        heroBg: 'bg-slate-50/50',
        heroBorder: 'border-slate-100',
        heroIcon: <History />,
        actionType: 'RE-RESERVE'
    }
};

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
    amount != null ? `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';

const formatDateTime = (dt) => {
    if (!dt) return '—';
    const d = new Date(dt);
    return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────

const TaskReservationDrawer = ({ taskId, isOpen, onClose, onRelease, onRevertSuccess }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(null);

    // Animation & Lifecycle
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    // Financial Actions
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionReason, setActionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [successState, setSuccessState] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [countdown, setCountdown] = useState(3);

    const { wallet } = useBalanceProvider();
    const { authenticatedRequest } = useAuthApi();

    const config = data ? STATUS_MAP[data.status] : null;
    const isInsufficient = (config?.actionType === 'RE-RESERVE') && ((wallet?.freeBalance || 0) < (data?.reservedAmount || 0));

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setShowConfirm(false);
                setActionReason("");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && taskId) fetchDetails();
    }, [isOpen, taskId]);

    useEffect(() => {
        let timer;
        if (successState && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (successState && countdown === 0) {
            onClose();
        }
        return () => clearTimeout(timer);
    }, [successState, countdown, onClose]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authenticatedRequest(undefined, `${GET_TASK_RESERVATION}/${taskId}`, METHOD.GET);
            if (response.status === 200) setData(response.data?.data);
            else throw new Error("Failed to fetch data");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExecuteAction = async () => {
        if (!actionReason || actionReason.length < 5) return;
        try {
            setIsProcessing(true);
            setActionError(null);
            console.log("config.actionType -- ", config.actionType)
            if(config.actionType === 'RELEASE') {
                await onRelease(data?.itemId, actionReason);
                setSuccessState(true);
                setShowConfirm(false);
            } else {
                const payload = { reservationItemId: data?.itemId, reason: actionReason };
                const response = await authenticatedRequest(payload, REVERT_TASK_RESERVATION, METHOD.POST);
                if (response.status === 200 || response.data?.success) {
                    setSuccessState(true);
                    setShowConfirm(false);
                    if(onRevertSuccess) {
                        onRevertSuccess();
                    }
                } else throw new Error(response.data?.message || "Operation failed");
            }
        } catch (err) {
            setActionError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-[300] flex justify-end overflow-hidden">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

            <div className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ease-out transform ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Reservation Summary</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: {config?.label || 'Loading...'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {loading ? <SkeletonLoader /> : error ? <ErrorState message={error} onRetry={fetchDetails} /> : (
                        <>
                            <DrawerContent data={data} config={config} onCopy={(text) => navigator.clipboard.writeText(text)} />

                            {/* --- FINANCIAL CONFIRMATION OVERLAY --- */}
                            {showConfirm && (
                                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border transition-all 
                                                ${(isInsufficient || config.actionType === 'RELEASE') ? 'bg-rose-50 text-rose-500 border-rose-100 animate-pulse' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                                                {isInsufficient ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
                                            </div>

                                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                                {config.actionType === 'RELEASE' ? 'Confirm Fund Release' : 'Confirm Re-Reservation'}
                                            </h3>

                                            {
                                                config.actionType === 'RELEASE' && (
                                                    <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                                                        <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                                                            <span className="block mb-1 uppercase tracking-wider">Attention:</span>
                                                            Releasing these funds will <span className="underline">cancel</span> the {data?.checkTypeCode} check.
                                                            The reserved amount of ₹{data?.reservedAmount.toFixed(2)} will be credited back to your wallet.
                                                            This check cannot be processed once funds are released.
                                                        </p>
                                                    </div>
                                                )
                                            }

                                            <p className="text-sm text-slate-500 max-w-[320px] leading-relaxed mb-6">
                                                {config.actionType === 'RELEASE'
                                                    ? ``
                                                    : `You are re-reserving ${formatCurrency(data.reservedAmount)} from your wallet balance.`}
                                            </p>

                                            {isInsufficient && (
                                                <div className="w-full p-4 bg-rose-50 rounded-2xl border border-rose-100 mb-6 flex items-start gap-3 text-left">
                                                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-bold text-rose-600 leading-snug">Insufficient funds. Your balance: {formatCurrency(wallet?.freeBalance)}</p>
                                                </div>
                                            )}

                                            <div className={`w-full text-left ${isInsufficient ? 'opacity-30 pointer-events-none' : ''}`}>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reason for {config.actionType === 'RELEASE' ? 'Release' : 'Re-reserve'} (Mandatory)</label>
                                                <textarea
                                                    value={actionReason}
                                                    onChange={(e) => setActionReason(e.target.value)}
                                                    placeholder="Provide audit reason..."
                                                    className="w-full mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 min-h-[120px] focus:border-[#5D4591] outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-6">
                                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Go Back</button>
                                            <button
                                                disabled={isProcessing || actionReason.length < 5 || isInsufficient}
                                                onClick={handleExecuteAction}
                                                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
                                            >
                                                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <><Check size={14} /> Confirm & Proceed</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Action Area */}
                {!loading && data && !showConfirm && (
                    <div className="p-8 border-t border-slate-100 shrink-0 bg-slate-50/30 space-y-4">
                        {/* Restriction Notice */}
                        {!data.isRevertApplicable && !successState && (
                            <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Action Restricted</p>
                                    <p className="text-[11px] font-bold text-amber-600/80 mt-1">{data.revertNotApplicableReason}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                {successState ? 'Done' : 'Close'}
                            </button>

                            {config?.actionType !== 'NONE' && (
                                <button
                                    disabled={!data.isRevertApplicable || successState}
                                    onClick={() => setShowConfirm(true)}
                                    className={`flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl
                                        ${successState ? 'bg-emerald-500 text-white' : 'bg-[#5D4591] text-white hover:bg-[#4a3675] disabled:opacity-40'}
                                    `}
                                >
                                    {successState ? <><Check size={14} /> {countdown}s</> : (
                                        config.actionType === 'RELEASE' ? <><ArrowDownLeft size={14} /> Release Funds</> : <><RotateCcw size={14} /> Re-Reserve</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────────────────────

const DrawerContent = ({ data, config, onCopy }) => {
    const txn = data.transaction;
    const res = data.reservation;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Status Hero Card */}
            <div className={`p-6 rounded-[2.5rem] border relative overflow-hidden transition-colors duration-500 ${config.heroBg} ${config.heroBorder}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5">{config.heroIcon}</div>
                <div className={`flex items-center gap-4 ${txn && "mb-6"}  relative z-10`}>
                    <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm border flex items-center justify-center ${config.heroBorder}`}>
                        {React.cloneElement(config.heroIcon, { size: 28, strokeWidth: 2.5, className: `text-${config.color}-500` })}
                    </div>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest text-${config.color}-500`}>{config.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-0.5">{formatCurrency(data.reservedAmount)}</h3>
                    </div>
                </div>
                {
                    txn && (
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white">
                                <p className="text-[8px] font-black text-slate-400 uppercase">Available Bal.</p>
                                <p className="text-sm font-black text-emerald-600 mt-0.5">{formatCurrency(txn?.balanceAfterTransaction || 0)}</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white">
                                <p className="text-[8px] font-black text-slate-400 uppercase">Reserved Bucket</p>
                                <p className="text-sm font-black text-rose-600 mt-0.5">{formatCurrency(txn?.reservedBalanceAfterTransaction || 0)}</p>
                            </div>
                        </div>
                    )
                }

            </div>

            {/* Audit Description */}
            {
                txn && (
                    <Section icon={<Info size={13} />} title="Audit Trail">
                        <div className="p-5 bg-slate-900 rounded-3xl text-white shadow-lg shadow-slate-200">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Transaction Description</p>
                            <p className="text-xs font-bold leading-relaxed text-slate-100 italic">"{txn?.description || ""}</p>
                        </div>
                    </Section>
                )
            }


            {/* Context Grid */}
            <Section icon={<ShieldCheck size={13} />} title="Task Context">
                <div className="space-y-4">
                    <DetailItem label="Check Type" value={data.checkTypeCode} isCapitalize />
                    <DetailItem label="Reference #" value={txn?.referenceNumber} isCopyable onCopy={() => onCopy(txn?.referenceNumber)} />
                </div>
            </Section>

            {/* Reservation Summary */}
            <Section icon={<Landmark size={13} />} title="Reservation Analysis">
                <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 grid grid-cols-2 gap-y-4">
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Total Reserved</p><p className="text-xs font-black text-slate-800">{formatCurrency(res.reservedAmount)}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Total Consumed</p><p className="text-xs font-black text-emerald-600">{formatCurrency(res.consumedAmount)}</p></div>
                    <div className="col-span-2 pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remaining in Hold</span>
                        <span className="text-sm font-black text-[#5D4591]">{formatCurrency(res.remainingReserved)}</span>
                    </div>
                </div>
            </Section>

            {/* Timeline */}
            <Section icon={<History size={13} />} title="Timeline">
                <div className="space-y-2">
                    <TimelineRow label="Created At" value={formatDateTime(data.createdDate)} />
                    {data.consumedAt && <TimelineRow label="Consumed At" value={formatDateTime(data.consumedAt)} isHighlight color="emerald" />}
                    {data.releasedAt && <TimelineRow label="Released At" value={formatDateTime(data.releasedAt)} isHighlight color="rose" />}
                </div>
            </Section>

            {
                (data?.commitedReason || data.committedAt || data.commitedExpiresAt) && (
                    <Section icon={<Info size={13} />} title="Fund Locked">
                        <div className="space-y-2">
                            {data.committedAt && <TimelineRow label="Fund Committed At" value={formatDateTime(data.committedAt)} isHighlight />}
                            {data.commitedExpiresAt && <TimelineRow label="Auto Release At" value={formatDateTime(data.commitedExpiresAt)} isHighlight color="rose" />}
                            <div className="p-5 rounded-3xl text-white shadow-lg shadow-slate-200">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fund Committed Reason</p>
                                <p className="text-xs font-bold leading-relaxed text-slate-700 italic">{data?.commitedReason || ""}</p>
                            </div>
                            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10  text-left relative">
                                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                    <ShieldCheckIcon size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Transaction Locked</span>
                                </div>

                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                                    Funds are locked until the candidate submits the form or the session expires.
                                </p>

                                <div className="mt-3 pt-3 border-t border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Auto-Unlock Date</p>
                                    <p className="text-[11px] font-black text-amber-400">
                                        {data.commitedExpiresAt ? (
                                            `${new Date(data.commitedExpiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • ${new Date(data.commitedExpiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
                                        ) : (
                                            "End of Active Session"
                                        )}
                                    </p>
                                </div>

                                {/* Tooltip Arrow */}
                                <div className="absolute top-full right-8 -mt-1 border-[6px] border-transparent border-t-slate-900" />
                            </div>
                        </div>
                    </Section>
                )
            }
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Atomic UI Components
// ─────────────────────────────────────────────────────────────

const Section = ({ icon, title, children }) => (
    <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#5D4591]/10 text-[#5D4591] flex items-center justify-center">{icon}</span>
            {title}
        </h4>
        <div>{children}</div>
    </div>
);

const DetailItem = ({ label, value, isCopyable, onCopy, isCapitalize }) => (
    <div className="flex items-center justify-between group">
        <span className="text-xs font-bold text-slate-400">{label}</span>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-black text-slate-800 ${isCapitalize ? 'capitalize' : ''}`}>{value ?? '—'}</span>
            {isCopyable && <button onClick={() => onCopy(value)} className="text-slate-300 hover:text-[#5D4591] transition-colors"><Copy size={13} /></button>}
        </div>
    </div>
);

const TimelineRow = ({ label, value, isHighlight, color = "blue" }) => (
    <div className={`flex justify-between items-center p-3 rounded-xl border ${isHighlight ? `bg-${color}-50/30 border-${color}-100` : 'bg-white border-slate-100'}`}>
        <span className="text-[10px] font-black text-slate-400 uppercase">{label}</span>
        <span className={`text-[10px] font-bold ${isHighlight ? `text-${color}-600` : 'text-slate-600'}`}>{value}</span>
    </div>
);

const SkeletonLoader = () => (
    <div className="p-8 space-y-8 animate-pulse">
        <div className="h-48 bg-slate-100 rounded-[2.5rem]" />
        <div className="h-24 bg-slate-50 rounded-3xl" />
        <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="flex justify-between items-center"><div className="h-3 w-24 bg-slate-100 rounded" /><div className="h-3 w-32 bg-slate-50 rounded" /></div>)}
        </div>
    </div>
);

const ErrorState = ({ message, onRetry }) => (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4"><AlertCircle size={32} /></div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Sync Error</h3>
        <p className="text-sm text-slate-500 mb-6 px-4">{message}</p>
        <button onClick={onRetry} className="px-8 py-3 bg-[#5D4591] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2"><RefreshCw size={13} /> Try Again</button>
    </div>
);

export default TaskReservationDrawer;
