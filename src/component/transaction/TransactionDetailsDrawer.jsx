import React, { useState, useEffect } from 'react';
import {
    X, Copy, Check, ArrowUpRight, ArrowDownLeft,
    AlertCircle, ShieldCheck, CreditCard, Tag,
    FileText, User, Clock, Wallet, Hash, RefreshCw,
    Layers, Landmark, Briefcase
} from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import { GET_TRANSACTION_ACTIVITIES } from "../../constant/Endpoint.tsx";

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
    amount != null
        ? `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        : '₹0.00';

const formatDateTime = (dt) => {
    if (!dt) return '—';
    const d = new Date(dt);
    return `${d.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    })} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

const formatLabel = (str) =>
    str ? str.replace(/_/g, ' ') : '—';

// ─────────────────────────────────────────────────────────────
//  Transaction Type Config
// ─────────────────────────────────────────────────────────────

const getTransactionConfig = (type) => {
    const configs = {
        CREDIT_TOPUP:          { color: 'emerald', label: 'Top-Up Credit',        isCredit: true  },
        CREDIT_BONUS:          { color: 'emerald', label: 'Bonus Credit',          isCredit: true  },
        DEBIT_BGV_CHECK:       { color: 'rose',    label: 'BGV Check Debit',       isCredit: false },
        DEBIT_RESERVATION:     { color: 'amber',   label: 'Reservation Hold',      isCredit: false },
        RELEASE_RESERVATION:   { color: 'blue',    label: 'Reservation Release',   isCredit: true  },
    };
    return configs[type] ?? { color: 'slate', label: type, isCredit: false };
};

const colorMap = {
    emerald: { icon: 'bg-emerald-50 border-emerald-100 text-emerald-600', badge: 'text-emerald-600 border-emerald-100 bg-white', dot: 'bg-emerald-500' },
    rose:    { icon: 'bg-rose-50 border-rose-100 text-rose-600', badge: 'text-rose-600 border-rose-100 bg-white', dot: 'bg-rose-500' },
    amber:   { icon: 'bg-amber-50 border-amber-100 text-amber-600', badge: 'text-amber-600 border-amber-100 bg-white', dot: 'bg-amber-500' },
    blue:    { icon: 'bg-blue-50 border-blue-100 text-blue-600', badge: 'text-blue-600 border-blue-100 bg-white', dot: 'bg-blue-500' },
    slate:   { icon: 'bg-slate-50 border-slate-100 text-slate-600', badge: 'text-slate-600 border-slate-100 bg-white', dot: 'bg-slate-500' },
};

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────

const TransactionDetailsDrawer = ({ txnId, isOpen, onClose }) => {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [copied, setCopied]   = useState(null);
    const { authenticatedRequest } = useAuthApi();

    useEffect(() => {
        if (isOpen && txnId) fetchDetails();
    }, [isOpen, txnId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authenticatedRequest(undefined, `${GET_TRANSACTION_ACTIVITIES}/${txnId}`, METHOD.GET);
            if (response.status === 200) {
                setData(response.data);
            } else {
                throw new Error("Failed to fetch transaction details.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Transaction Details</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Full Audit Trail</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? <SkeletonLoader /> : error ? <ErrorState message={error} onRetry={fetchDetails} /> : (
                        <DrawerContent data={data} copied={copied} onCopy={copyToClipboard} />
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 shrink-0">
                    <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Drawer Content Component
// ─────────────────────────────────────────────────────────────

const DrawerContent = ({ data, copied, onCopy }) => {
    const config = getTransactionConfig(data?.transactionType);
    const colors = colorMap[config.color];
    const res = data?.wallerReservationResponse; // Accessing the reservation object

    const hasGatewayInfo = data?.gatewayTransactionId || data?.gatewayOrderId || data?.gatewayPaymentMethod;
    const hasBgvContext  = data?.bgvCaseId || data?.verificationTaskId || data?.checkTypeCode;
    const hasTopUp       = data?.topUpRequestId || data?.topUpReferenceNumber;
    const hasInitiatedBy = data?.initiatedByUserId || data?.initiatedByName || data?.initiatedByEmail;

    return (
        <div className="p-8 space-y-8">
            {/* Summary Hero Card */}
            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border-2 ${colors.icon}`}>
                            {config.isCredit ? <ArrowDownLeft size={28} strokeWidth={2.5} /> : <ArrowUpRight size={28} strokeWidth={2.5} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{config.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-0.5">{formatCurrency(data.amount)}</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{data.currency} · {data.balanceBucket} Bucket</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${colors.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        {data.status}
                    </span>
                </div>

                {/* Balance Flow */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Balance Before</p>
                        <p className="text-sm font-black text-slate-700 mt-0.5">{formatCurrency(data.balanceBefore)}</p>
                    </div>
                    <div className="text-slate-300 font-black text-lg">→</div>
                    <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Balance After</p>
                        <p className={`text-sm font-black mt-0.5 ${data.balanceAfter > data.balanceBefore ? 'text-emerald-600' : data.balanceAfter < data.balanceBefore ? 'text-rose-600' : 'text-slate-700'}`}>
                            {formatCurrency(data.balanceAfter)}
                        </p>
                    </div>
                </div>

                {
                    (data.reservedBalanceBeforeTransaction || data.reservedBalanceAfterTransaction) && (
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-200  mt-5">
                            <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserved Bal. Before</p>
                                <p className="text-sm font-black text-slate-700 mt-0.5">{formatCurrency(data.reservedBalanceBeforeTransaction)}</p>
                            </div>
                            <div className="text-slate-300 font-black text-lg">→</div>
                            <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserved Bal. After</p>
                                <p className={`text-sm font-black mt-0.5 ${data.reservedBalanceAfterTransaction > data.reservedBalanceBeforeTransaction ? 'text-emerald-600' : data.reservedBalanceAfterTransaction < data.reservedBalanceBeforeTransaction ? 'text-rose-600' : 'text-slate-700'}`}>
                                    {formatCurrency(data.reservedBalanceAfterTransaction)}
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* ── RESERVATION DETAILS (NEW SECTION) ── */}
            {res && (
                <Section icon={<Landmark size={13} />} title="Reservation Analysis">
                    <div className="bg-[#5D4591]/5 border border-[#5D4591]/10 rounded-3xl p-5 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase size={14} className="text-[#5D4591]" />
                                <span className="text-xs font-black text-slate-800">{res.candidateName}</span>
                            </div>
                            <span className="text-[9px] font-black px-2 py-0.5 bg-white border border-[#5D4591]/20 text-[#5D4591] rounded-md uppercase">
                                {res.reservationStatus.replace(/_/g, ' ')}
                            </span>
                        </div>

                        {/* Financial Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded-xl border border-[#5D4591]/5">
                                <p className="text-[8px] font-black text-slate-400 uppercase">Reserved</p>
                                <p className="text-[11px] font-black text-slate-800">{formatCurrency(res.reservedAmount)}</p>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-[#5D4591]/5">
                                <p className="text-[8px] font-black text-emerald-400 uppercase">Consumed</p>
                                <p className="text-[11px] font-black text-emerald-600">{formatCurrency(res.consumedAmount)}</p>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-[#5D4591]/5">
                                <p className="text-[8px] font-black text-blue-400 uppercase">Released</p>
                                <p className="text-[11px] font-black text-blue-600">{formatCurrency(res.releasedAmount)}</p>
                            </div>
                        </div>

                        {/* Remaining Callout */}
                        <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-xl border border-dashed border-[#5D4591]/20">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remaining in Hold</span>
                            <span className="text-sm font-black text-[#5D4591]">{formatCurrency(res.remainingReserved)}</span>
                        </div>

                        {/* Check Types Badges */}
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Included Checks</p>
                            <div className="flex flex-wrap gap-1.5">
                                {res.reservationItemCheckType?.map((type, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-white text-[9px] font-bold text-slate-600 border border-slate-100 rounded-md uppercase">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Reservation Timeline */}
                        <div className="pt-2 border-t border-[#5D4591]/10 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">Reserved At</p>
                                <p className="text-[10px] font-bold text-slate-600">{formatDateTime(res.reservedAt)}</p>
                            </div>
                            {res.releasedAt && (
                                <div>
                                    <p className="text-[8px] font-black text-blue-400 uppercase">Released At</p>
                                    <p className="text-[10px] font-bold text-blue-600">{formatDateTime(res.releasedAt)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>
            )}

            {/* Transaction Info */}
            <Section icon={<Hash size={13} />} title="Transaction Info">
                <DetailItem label="Reference Number" value={data.referenceNumber} isCopyable onCopy={() => onCopy(data.referenceNumber, 'ref')} copied={copied === 'ref'} />
                <DetailItem label="Transaction Type" value={formatLabel(data.transactionType)} isCapitalize />
                <DetailItem label="Settlement Date" value={formatDateTime(data.settledAt)} />
            </Section>

            {/* BGV Context */}
            {hasBgvContext && (
                <Section icon={<ShieldCheck size={13} />} title="Case Context">
                    <DetailItem label="Case Number" value={data.bgvCaseNumber} isCopyable onCopy={() => onCopy(data.bgvCaseNumber, 'case')} copied={copied === 'case'} />
                    <DetailItem label="Check Type" value={data.checkTypeCode} />
                    {
                        data.reservationId && (
                            <DetailItem label="Reservation ID" value={data.reservationId?.substring(0, 12) + '...'} isCopyable onCopy={() => onCopy(data.reservationId, 'resId')} copied={copied === 'resId'} />
                        )
                    }
                </Section>
            )}

            {/* Audit Description */}
            <Section icon={<FileText size={13} />} title="Audit Description">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{data.description}"</p>
                </div>
            </Section>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────────────────────

const Section = ({ icon, title, children }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#5D4591]/10 text-[#5D4591] flex items-center justify-center">{icon}</span>
            {title}
        </h4>
        <div className="grid grid-cols-1 gap-y-4">{children}</div>
    </div>
);

const DetailItem = ({ label, value, isCopyable, onCopy, copied, isCapitalize, valueClass }) => (
    <div className="flex items-center justify-between group min-h-[28px]">
        <span className="text-xs font-bold text-slate-400 shrink-0 mr-4">{label}</span>
        <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs font-black text-slate-800 text-right break-all ${isCapitalize ? 'capitalize' : ''} ${valueClass ?? ''}`}>{value ?? '—'}</span>
            {isCopyable && (
                <button onClick={onCopy} className="text-slate-300 hover:text-[#5D4591] transition-colors shrink-0">
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
            )}
        </div>
    </div>
);

const SkeletonLoader = () => (
    <div className="p-8 space-y-8 animate-pulse">
        <div className="h-40 bg-slate-100 rounded-[2rem]" />
        <div className="h-48 bg-slate-50 rounded-3xl" />
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-3 w-40 bg-slate-50 rounded" />
                </div>
            ))}
        </div>
    </div>
);

const ErrorState = ({ message, onRetry }) => (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4"><AlertCircle size={32} /></div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Sync Failed</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <button onClick={onRetry} className="px-6 py-3 bg-[#5D4591] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2"><RefreshCw size={13} /> Try Again</button>
    </div>
);

export default TransactionDetailsDrawer;
