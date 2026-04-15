import React, { useState, useEffect, useRef } from 'react';
import {
    RefreshCw,
    Loader2,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    ChevronDown,
    ChevronUp,
    History,
    AlertCircle,
    Copy,
    Check,
    IdCard,
    MapPin,
    Fingerprint,
    Globe,
    ShieldCheckIcon,
    ArrowRightLeft, ExternalLinkIcon
} from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    GET_TRANSACTION_ACTIVITIES,
    GET_TRANSACTION_RESERVATION_ITEMS,
    RELEASE_TRANSACTION_RESERVATION
} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import ReservationSplitTable from './ReservationSplitTable.jsx';
import TransactionDetailsDrawer from "./TransactionDetailsDrawer.jsx";

const TransactionActivities = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [copiedId, setCopiedId] = useState(null);
    const [selectedTxnId, setSelectedTxnId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [expandedRowId, setExpandedRowId] = useState(null);
    const [subData, setSubData] = useState({});

    const isCompMountRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();

    const handleOpenDetails = (txnId) => {
        setSelectedTxnId(txnId);
        setIsDrawerOpen(true);
    };

    // 1. Helper for Check Type Icons
    const getCheckTypeIcon = (code) => {
        const iconClass = "shrink-0";
        switch (code?.toUpperCase()) {
            case 'ADDRESS': return <MapPin size={12} className={iconClass} />;
            case 'PAN': return <IdCard size={12} className={iconClass} />;
            case 'AADHAAR': return <Fingerprint size={12} className={iconClass} />;
            case 'PASSPORT': return <Globe size={12} className={iconClass} />;
            case 'CRIMINAL': return <ShieldCheckIcon size={12} className={iconClass} />;
            default: return <ArrowRightLeft size={12} className={iconClass} />;
        }
    };

    // 2. Copy to Clipboard Functionality
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const fetchTransactions = async (pageNum, isLoadMore = false) => {
        try {
            if (isLoadMore) setLoadingMore(true);
            else { setLoading(true); setError(null); }

            const response = await authenticatedRequest(undefined, `${GET_TRANSACTION_ACTIVITIES}?page=${pageNum}&size=20`, METHOD.GET);

            if (response.status === 200) {
                const responseData = response.data;
                const newData = responseData.data.content;
                setTransactions(prev => isLoadMore ? [...prev, ...newData] : newData);
                setHasMore(responseData.data.page.number < responseData.data.page.totalPages - 1);
                setTotalElements(responseData.data.page.totalElements);
                setLoading(false);
                setLoadingMore(false);
            }
        } catch (err) {
            setError("Unable to retrieve transaction history.");
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const fetchReservationSplit = async (transaction) => {
        if (expandedRowId === transaction?.id) {
            setExpandedRowId(null);
            return;
        }
        setExpandedRowId(transaction?.id);
        if (subData[transaction?.id]) return;

        setSubData(prev => ({ ...prev, [transaction?.id]: { loading: true, data: [], error: null } }));
        try {
            const response = await authenticatedRequest(undefined, `${GET_TRANSACTION_RESERVATION_ITEMS}/${transaction?.reservationId}`, METHOD.GET);
            if (response.status === 200) {
                setSubData(prev => ({
                    ...prev,
                    [transaction?.id]: { loading: false, data: response.data.data, error: null }
                }));
            }
        } catch (err) {
            setSubData(prev => ({
                ...prev,
                [transaction?.id]: { loading: false, data: [], error: "Failed to load details." }
            }));
        }
    };

    const handleReleaseFund = async (itemId, reason, txnId) => {
        try {
            const payload = { reservationItemId: itemId, releaseReason: reason };
            const response = await authenticatedRequest(payload, RELEASE_TRANSACTION_RESERVATION, METHOD.POST);

            if (response.status === 200) {
                setSubData(prev => {
                    const currentTxnData = prev[txnId];
                    if (!currentTxnData) return prev;
                    const newItems = currentTxnData.data.map(item =>
                        item.id === itemId
                            ? { ...item, status: 'RELEASED', consumedAt: new Date().toISOString() }
                            : item
                    );
                    return { ...prev, [txnId]: { ...currentTxnData, data: newItems } };
                });
            } else {
                throw new Error(response.data?.message || "Failed to release funds.");
            }
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        if (!isCompMountRef.current) {
            isCompMountRef.current = true;
            fetchTransactions(0);
        }
    }, []);

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5D4591]/10 rounded-xl flex items-center justify-center text-[#5D4591]">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Ledger Activities</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">Real-time Wallet Movements</p>
                    </div>
                </div>
                <button onClick={() => fetchTransactions(0)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#5D4591] transition-all duration-500 shadow-sm">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Table Container */}
            <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 w-12"></th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction Detail</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Description & Audit</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Date</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="6" className="py-32 text-center"><Loader2 className="mx-auto animate-spin text-[#5D4591]" /></td></tr>
                        ) : transactions.map((txn) => {
                            const isReservation = txn.reservationId;
                            const isExpanded = expandedRowId === txn.id;
                            const isCredit = txn.transactionType.startsWith('CREDIT') || txn.transactionType.startsWith('RELEASE_RESERVATION');

                            return (
                                <React.Fragment key={txn.id}>
                                    <tr className={`transition-colors ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
                                        key={txn.id}
                                    >
                                        {/* Expand Toggle */}
                                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                                            {isReservation && (
                                                <button
                                                    onClick={() => fetchReservationSplit(txn)}
                                                    className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20' : 'bg-slate-100 text-slate-500 hover:text-[#5D4591]'}`}
                                                >
                                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>
                                            )}
                                        </td>

                                        {/* Type & Check Context */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCredit ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                    {isCredit ? <ArrowDownLeft size={18} strokeWidth={2.5}/> : <ArrowUpRight size={18} strokeWidth={2.5}/>}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 tracking-tight capitalize">
                                                        {txn.transactionType?.toLowerCase()?.replace(/_/g, ' ')}
                                                    </p>
                                                    {txn.checkTypeCode && (
                                                        <div className="flex items-center gap-1.5 mt-1 bg-[#F9F7FF] px-1.5 py-0.5 rounded border border-[#5D4591]/10 w-fit">
                                                            <span className="text-[#5D4591]">{getCheckTypeIcon(txn.checkTypeCode)}</span>
                                                            <span className="text-[9px] font-black text-[#5D4591] uppercase tracking-wider">{txn.checkTypeCode}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-5">
                                            <p className={`text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {isCredit ? '+' : '-'} ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                                                Cur Bal: ₹{txn.balanceAfter?.toLocaleString('en-IN')}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            {txn.status === 'SUCCESS' ? (
                                                /* --- SUCCESS STATUS --- */
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100/50 shadow-sm shadow-emerald-100/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
                                                    {txn.status}
                                                </span>
                                            ) : (
                                                /* --- PENDING / WARNING STATUS --- */
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100/50 shadow-sm shadow-amber-100/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    {txn.status}
                                                </span>
                                            )}
                                        </td>


                                        {/* Description & Reference */}
                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-bold text-slate-600 leading-snug max-w-[250px]">{txn.description}</p>

                                            <div className="flex items-center gap-3 mt-1.5">
                                                {/* Reference Number Box */}
                                                <div className="flex items-center gap-2 group/ref">
                                                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                        {txn.referenceNumber}
                                                    </span>

                                                    {/* Action 1: Copy */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(txn.referenceNumber, txn.id); }}
                                                        className="text-slate-300 hover:text-[#5D4591] transition-colors"
                                                        title="Copy Reference"
                                                    >
                                                        {copiedId === txn.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                                    </button>
                                                </div>

                                                {/* Action 2: VIEW DETAILS (The New Trigger) */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenDetails(txn.id); }}
                                                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#5D4591] hover:text-[#4a3675] bg-[#5D4591]/5 px-2 py-0.5 rounded-md border border-[#5D4591]/10 transition-all hover:bg-[#5D4591]/10 active:scale-95"
                                                >
                                                    <ExternalLinkIcon size={10} />
                                                    View Details
                                                </button>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-[11px] font-black text-slate-500 uppercase">
                                                {new Date(txn.transactionAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                                {new Date(txn.transactionAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </p>
                                        </td>
                                    </tr>

                                    {/* EXPANDED AREA */}
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan="6" className="bg-slate-50/30">
                                                <ReservationSplitTable
                                                    data={subData[txn.id]?.data || []}
                                                    isLoading={subData[txn.id]?.loading}
                                                    error={subData[txn.id]?.error}
                                                    onRelease={(itemId, reason) => handleReleaseFund(itemId, reason, txn.id)}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Audited Entries: {totalElements}</p>
                    {hasMore && (
                        <button onClick={() => fetchTransactions(page + 1, true)} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#5D4591] uppercase tracking-[0.2em] shadow-sm hover:bg-[#F9F7FF] transition-all">
                            {loadingMore ? <Loader2 className="animate-spin" size={14} /> : 'Load More History'}
                        </button>
                    )}
                </div>
            </div>
            <TransactionDetailsDrawer
                txnId={selectedTxnId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default TransactionActivities;
