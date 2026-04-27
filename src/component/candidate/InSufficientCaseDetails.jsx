import {
    ArrowLeftIcon,
    Building2,
    Calendar,
    Check,
    Clock,
    Copy,
    History,
    PackageIcon, RefreshCwIcon, RotateCcw,
    Search,
    ShieldAlert,
    Trash2
} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    BILLING_ERROR_CASES,
    BILLING_ERROR_CASES_FOR_ORGANIZATION, RETRY_FAILED_BILLING_CASES
} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import TableSkeleton from "./TableSkeleton.jsx";

const InSufficientCaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTerm,setSearchTerm] = React.useState("");
    const [caseDetails, setCaseDetails] = React.useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [retryStatus, setRetryStatus] = useState({}); // Track status per candidateId: 'loading' | 'success' | 'error'
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);

    const handleCandidateClick = (candidateId) => {
        navigate(`/candidate-details/${candidateId}`, { state: { activeMenu: "/candidate-list" } });
    };
    const handleCopy = (e, text) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchBillingFailedCases();
        }
    }, []);

    const retryBillingCase = async (candidateId) => {
        setRetryStatus(prev => ({ ...prev, [candidateId]: 'loading' }));
        try {
            const response = await authenticatedRequest(undefined, `${RETRY_FAILED_BILLING_CASES}/${candidateId}`, METHOD.PUT);
            if (response.status === 200) {
                if(response?.data?.status === "success") {
                    setRetryStatus(prev => ({ ...prev, [candidateId]: 'success' }));
                } else {
                    setRetryStatus(prev => ({ ...prev, [candidateId]: 'error' }));
                }
            } else {
                setRetryStatus(prev => ({ ...prev, [candidateId]: 'error' }));
            }
        } catch (err) {
            setRetryStatus(prev => ({ ...prev, [candidateId]: 'error' }));
        }
    }

    const fetchBillingFailedCases = async () => {
        setLoading(true)
        try {
            let response;
            if(id) {
                const options = {
                    params: {
                        organizationId: id,
                    }
                }
                response = await authenticatedRequest(undefined, BILLING_ERROR_CASES_FOR_ORGANIZATION, METHOD.GET, options);
            } else {
                response = await authenticatedRequest(undefined, BILLING_ERROR_CASES, METHOD.GET);
            }
            if(response.status === 200) {
                setCaseDetails(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSync = async () => {
        setIsSyncing(true);
        try { await fetchBillingFailedCases(); } finally { setIsSyncing(false); }
    };
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-start md:items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#5D4591] transition-all cursor-pointer shadow-sm"
                    >
                        <ArrowLeftIcon size={20} />
                    </button>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Billing Error Cases
                            </h1>
                            {!loading && (
                                <span className="px-2 py-0.5 bg-[#5D4591]/10 text-[#5D4591] text-xs font-bold rounded-md">
                                    {caseDetails.length} Total
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            Manage cases with fund allocation billing errors.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm
                            ${isSyncing ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer'}`}
                    >
                        <RotateCcw size={16} className={`${isSyncing ? 'animate-spin text-[#5D4591]' : 'text-slate-500'}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Status'}
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-visible mb-20">

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <TableSkeleton />
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                                <div className="relative w-full lg:w-1/3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or case number..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                        <tr className="bg-slate-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">S.No</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate & Case</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Client & Package</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Timeline (SLA)</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Billing Status</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                        {caseDetails.length > 0 ? (
                                            caseDetails.map((item, index) => {
                                                const isWiped = item.dpdpWiped;
                                                const currentRetryStatus = retryStatus[item.candidateId];

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className={`transition-colors group ${isWiped ? 'bg-slate-50/40 opacity-80' : 'hover:bg-[#F9F7FF]/30'}`}
                                                    >
                                                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </td>

                                                        {/* CANDIDATE & CASE COLUMN */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {/* AVATAR LOGIC */}
                                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border transition-all ${
                                                                    isWiped
                                                                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                                                                        : 'bg-[#F9F7FF] border-[#5D4591]/10 text-[#5D4591]'
                                                                }`}>
                                                                    {isWiped ? (
                                                                        <ShieldAlert size={16} strokeWidth={2.5} />
                                                                    ) : (
                                                                        item?.profilePictureUrl ? <img src={item.profilePictureUrl} className="rounded-full" alt="" /> :
                                                                            item.name?.split(' ').map(n => n[0]).join('')
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-col">
                                                                    {isWiped ? (
                                                                        <>
                                                                            {/* Line 1: Label */}
                                                                            <span className="text-sm font-bold text-slate-400 italic">
                                                                    Data Purged (DPDP)
                                                                </span>

                                                                            {/* Line 2: Case No + Wiped Badge */}
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[11px] font-bold text-slate-400">
                                                                        {item.caseNo}
                                                                    </span>
                                                                                <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter shrink-0">
                                                                                    <History size={10} />
                                                                                    Wiped: {item.dpdpWipedAt}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                <span
                                                                    onClick={() => handleCandidateClick(item.candidateId)}
                                                                    className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#5D4591] cursor-pointer transition-colors"
                                                                >
                                                                    {item.name}
                                                                </span>
                                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                                <span
                                                                    onClick={() => handleCandidateClick(item.candidateId)}
                                                                    className={`text-[11px] font-bold cursor-pointer ${isWiped ? 'text-slate-400' : 'text-[#5D4591]'}`}
                                                                >
                                                                    {item.caseNo}
                                                                </span>
                                                                                <button
                                                                                    onClick={(e) => handleCopy(e, item.caseNo)}
                                                                                    className="inline-flex items-center justify-center w-5 h-5 transition-all cursor-pointer"
                                                                                >
                                                                                    {copiedId === item.caseNo ? (
                                                                                        <Check size={13} className="text-emerald-500 animate-in zoom-in" />
                                                                                    ) : (
                                                                                        <Copy size={13} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:text-[#5D4591]" />
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </>

                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* CLIENT & PACKAGE */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-1.5">
                                                                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                                                                    <Building2 size={14} className="text-slate-300" />
                                                                    {item.client}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                                                    <PackageIcon size={14} className="text-slate-300" />
                                                                    {item.packageName}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* TIMELINE */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                                    <Calendar size={13} className="text-slate-300" />
                                                                    <span className="text-slate-400 font-medium">Init:</span> {item.initiatedDate}
                                                                </div>
                                                                <div className={`flex items-center gap-2 text-[11px] font-bold ${item.status === 'ACTION_REQUIRED' ? 'text-red-500' : 'text-slate-500'}`}>
                                                                    <Clock size={13} className="text-slate-300" />
                                                                    <span className="font-medium opacity-60">Due:</span> {item.dueDate}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* REPORT CHECKS - Kept for Audit */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 min-w-max">
                                                                <StatusPill status={item.caseBillingStatus} showDot={!isWiped} isWiped={isWiped} />
                                                            </div>
                                                        </td>

                                                        {/* STATUS PILL */}
                                                        <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-800 leading-none transition-colors">
                                                    ₹ {item.caseBillingAmount}
                                                </span>
                                                        </td>

                                                        {/* ACTIONS */}
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end items-center">
                                                                {isWiped ? (
                                                                    <div className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded flex items-center gap-1.5 border border-slate-200">
                                                                        <Trash2 size={12} />
                                                                        PII DELETED
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        {currentRetryStatus === 'success' ? (
                                                                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 animate-in zoom-in">
                                                                                <Check size={14} /> ALLOCATED
                                                                            </div>
                                                                        ) : currentRetryStatus === 'error' ? (
                                                                            <div className="flex flex-col items-end gap-1 animate-in slide-in-from-right-2">
                                                                                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                                                                                    <ShieldAlert size={14} /> FAILED
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => retryBillingCase(item.candidateId)}
                                                                                    className="text-[9px] text-slate-400 hover:text-[#5D4591] font-bold underline cursor-pointer"
                                                                                >
                                                                                    Try again?
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                disabled={currentRetryStatus === 'loading'}
                                                                                onClick={() => retryBillingCase(item.candidateId)}
                                                                                className={`px-3 py-1 text-slate-500 text-[10px] font-bold rounded flex items-center gap-1.5 hover:text-[#4a3675] transition-all ${currentRetryStatus === 'loading' ? 'opacity-50' : 'cursor-pointer'}`}
                                                                            >
                                                                                <RefreshCwIcon size={16} className={currentRetryStatus === 'loading' ? 'animate-spin' : ''} />
                                                                                {currentRetryStatus === 'loading' ? 'Retrying...' : 'Retry'}
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                                                    No cases found.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

const StatusPill = ({ status, showDot = false, isWiped = false }) => {
    const statusConfig = {
        FAILED: { className: 'bg-red-50 text-red-600 border-red-100 dot-red-500', displayName: "Failed" },
        INSUFFICIENT_FUNDS: { className: 'bg-orange-50 text-orange-600 border-orange-100 dot-orange-500', displayName: "Insufficient Fund" },
    };

    const currentStyle = isWiped
        ? 'bg-slate-100 text-slate-500 border-slate-200'
        : (statusConfig[status]?.className || 'bg-slate-50 text-slate-500 border-slate-200 dot-slate-400');

    const dotColor = currentStyle.split(' ').find(s => s.startsWith('dot-'))?.replace('dot-', 'bg-') || 'bg-slate-400';

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${currentStyle}`}>
            {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
            {statusConfig[status]?.displayName}
        </span>
    );
};

export default InSufficientCaseDetails;
