import React, { useState } from 'react';
import {
    Loader2, ArrowUpRight, ArrowDownLeft, ChevronDown, ChevronUp,
    MapPin, IdCard, Fingerprint, Globe, ShieldCheckIcon,
    ArrowRightLeft, Copy, Check, ExternalLinkIcon, HistoryIcon
} from 'lucide-react';
import ReservationSplitTable from './ReservationSplitTable.jsx';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { GET_TRANSACTION_RESERVATION_ITEMS, RELEASE_TRANSACTION_RESERVATION } from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";

const TransactionTable = ({ data, loading, loadingMore, hasMore, total, onLoadMore, onViewDetails }) => {
    const { authenticatedRequest } = useAuthApi();
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [subData, setSubData] = useState({});
    const [copiedId, setCopiedId] = useState(null);

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

    const fetchReservationSplit = async (transaction) => {
        if (expandedRowId === transaction?.id) {
            setExpandedRowId(null);
            return;
        }
        setExpandedRowId(transaction?.id);
        if (subData[transaction?.id]) return;

        setSubData(prev => ({ ...prev, [transaction?.id]: { loading: true, data: [] } }));
        try {
            const response = await authenticatedRequest(undefined, `${GET_TRANSACTION_RESERVATION_ITEMS}/${transaction?.reservationId}`, METHOD.GET);
            if (response.status === 200) {
                setSubData(prev => ({ ...prev, [transaction.id]: { loading: false, data: response.data.data } }));
            }
        } catch (err) {
            setSubData(prev => ({ ...prev, [transaction.id]: { loading: false, data: [], error: "Failed to load." } }));
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-200 py-32 text-center">
                <Loader2 className="mx-auto animate-spin text-[#5D4591]" />
            </div>
        );
    }

    return (
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
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="py-32 text-center">
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <HistoryIcon size={32} strokeWidth={1} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No activities found</p>
                                </div>
                            </td>
                        </tr>
                    ) : data.map((txn) => {
                        const isCredit = txn.transactionType.startsWith('CREDIT') || txn.transactionType.startsWith('RELEASE_RESERVATION');
                        const isExpanded = expandedRowId === txn.id;

                        return (
                            <React.Fragment key={txn.id}>
                                <tr className={`transition-colors ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                                    <td className="px-6 py-5">
                                        {txn.reservationId && (
                                            <button onClick={() => fetchReservationSplit(txn)} className={`p-1.5 rounded-lg transition-all cursor-pointer ${isExpanded ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCredit ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                {isCredit ? <ArrowDownLeft size={18} strokeWidth={2.5}/> : <ArrowUpRight size={18} strokeWidth={2.5}/>}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 tracking-tight capitalize">{txn.transactionType?.toLowerCase()?.replace(/_/g, ' ')}</p>
                                                {txn.checkTypeCode && (
                                                    <div className="flex items-center gap-1.5 mt-1 bg-[#F9F7FF] px-1.5 py-0.5 rounded border border-[#5D4591]/10 w-fit">
                                                        <span className="text-[#5D4591]">{getCheckTypeIcon(txn.checkTypeCode)}</span>
                                                        <span className="text-[9px] font-black text-[#5D4591] uppercase tracking-wider">{txn.checkTypeCode}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className={`text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-rose-500'}`}>{isCredit ? '+' : '-'} ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Cur Bal: ₹{txn.balanceAfter?.toLocaleString('en-IN')}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${txn.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' : 'bg-amber-50 text-amber-700 border-amber-100/50'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'SUCCESS' ? 'bg-emerald-500 animate-pulse-slow' : 'bg-amber-500'}`} />
                                                {txn.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-[11px] font-bold text-slate-600 leading-snug max-w-[250px]">{txn.description}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{txn.referenceNumber}</span>
                                            <button onClick={() => onViewDetails(txn.id)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#5D4591] bg-[#5D4591]/5 px-2 py-0.5 rounded-md border border-[#5D4591]/10 hover:bg-[#5D4591]/10 cursor-pointer">
                                                <ExternalLinkIcon size={10} /> Details
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <p className="text-[11px] font-black text-slate-500 uppercase">{new Date(txn.transactionAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">{new Date(txn.transactionAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr>
                                        <td colSpan="6" className="bg-slate-50/30">
                                            <ReservationSplitTable data={subData[txn.id]?.data || []} isLoading={subData[txn.id]?.loading} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Entries: {total}</p>
                {hasMore && (
                    <button onClick={onLoadMore} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#5D4591] uppercase tracking-[0.2em] shadow-sm hover:bg-[#F9F7FF] transition-all cursor-pointer">
                        {loadingMore ? <Loader2 className="animate-spin" size={14} /> : 'Load More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransactionTable;
