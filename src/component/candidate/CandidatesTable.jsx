import React, { useMemo, useState } from "react";
import {
    Building2,
    Calendar,
    Clock,
    FileCheck,
    FileText,
    Search,
    Copy,
    Check,
    ShieldAlert,
    Trash2,
    History, PackageIcon, CloudIcon, CloudDownloadIcon, DownloadCloud, DownloadIcon
} from "lucide-react";
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown.jsx";
import { useNavigate } from "react-router-dom";
import CandidateCheckIconStatus from "../common/CandidateCheckIconStatus.jsx";

const CandidatesTable = ({ candidates, searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, parentRoute }) => {
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (e, text) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const mappedCandidates = useMemo(() => {
        return candidates.map(item => {
            return {
                id: item.candidateInfo.candidateId,
                caseNo: item.candidateInfo.caseNo,
                name: item.candidateInfo.name,
                profilePictureUrl: item?.candidateInfo?.profilePictureUrl,
                email: item.candidateInfo.email,
                client: item.candidateInfo.client,
                package: item.candidateInfo.packageName,
                initiatedDate: item.candidateInfo.initiatedDate,
                dueDate: item.candidateInfo.dueDate || 'TBD',
                status: item.caseDetails.status,
                taskStatus: item.caseDetails.taskStatus,
                checks: item.caseDetails?.checks,
                // DPDP FIELDS
                dpdpWiped: item.candidateInfo.dpdpWiped || false,
                dpdpWipedAt: item.candidateInfo.dpdpWipedAt || "2024-01-01",
            };
        });
    }, [candidates]);

    const filteredCandidates = mappedCandidates.filter(c =>
        (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.caseNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggleStatus = (option) => {
        if (selectedStatus.includes(option)) {
            setSelectedStatus(selectedStatus.filter(item => item !== option));
        } else {
            setSelectedStatus([...selectedStatus, option]);
        }
    };

    const handleCandidateClick = (candidateId) => {
        navigate(`/candidate-details/${candidateId}`, { state: { activeMenu: parentRoute } });
    };

    return (
        <>
            {/* SEARCH & FILTERS SECTION */}
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
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:ml-auto">
                    <MultiSelectDropdown
                        label="Status"
                        options={['All', 'Completed', 'In-Progress', 'Action Required']}
                        selected={selectedStatus}
                        onToggle={handleToggleStatus}
                        onClear={() => setSelectedStatus([])}
                    />
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">S.No</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate & Case</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Client & Package</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Timeline (SLA)</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Report Checks</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Overall Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filteredCandidates.length > 0 ? (
                            filteredCandidates.map((item, index) => {
                                const isWiped = item.dpdpWiped;

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
                                                                onClick={() => handleCandidateClick(item.id)}
                                                                className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#5D4591] cursor-pointer transition-colors"
                                                            >
                                                                {item.name}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                            <span
                                                                onClick={() => handleCandidateClick(item.id)}
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
                                                    {item.package}
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
                                                <CandidateCheckIconStatus checks={item?.checks} candidateStatus={item.status} />
                                            </div>
                                        </td>

                                        {/* STATUS PILL */}
                                        <td className="px-6 py-4">
                                            <StatusPill status={item.status} showDot={!isWiped} isWiped={isWiped} />
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="justify-center items-center">
                                                {isWiped ? (
                                                    <div className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded flex items-center gap-1.5 border border-slate-200">
                                                        <Trash2 size={12} />
                                                        PII DELETED
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button className="px-3 py-1 text-slate-500 text-[10px] font-bold rounded flex items-center gap-1.5 hover:text-[#4a3675]">
                                                            <DownloadIcon size={16} /> Report
                                                        </button>
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
                                    No candidates found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const StatusPill = ({ status, showDot = false, isWiped = false }) => {
    const statusConfig = {
        GREEN: { className: 'bg-emerald-50 text-emerald-600 border-emerald-100 dot-emerald-500', displayName: "Completed" },
        IN_PROGRESS: { className: 'bg-blue-50 text-blue-600 border-blue-100 dot-blue-500', displayName: "In Progress" },
        RED: { className: 'bg-red-50 text-red-600 border-red-100 dot-red-500', displayName: "Failed" },
        AMBER: { className: 'bg-amber-50 text-amber-600 border-amber-100 dot-amber-500', displayName: "Unable to Verify" },
        INSUFFICIENCY: { className: 'bg-orange-50 text-orange-600 border-orange-100 dot-orange-500', displayName: "Insufficiency" },
        STOP_CASE: { className: 'bg-slate-50 text-slate-600 border-slate-100 dot-slate-400', displayName: "Stop Case" }
    };

    // If wiped, we use a more neutral color for the pill
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

export default CandidatesTable;
