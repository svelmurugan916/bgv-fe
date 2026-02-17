import React, {useMemo, useState} from "react";
import {
    Briefcase,
    Building2,
    Calendar,
    Clock, DatabaseIcon,
    FileCheck,
    FileText,
    GraduationCap, MapPinIcon,
    Package,
    Search,
    ShieldCheck,
    UserCheck, UsersIcon, UserPlusIcon, Copy, Check
} from "lucide-react";
import CheckIcon from "../common/CheckIcon.jsx";
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown.jsx";
import SingleSelectDropdown from "../dropdown/SingleSelectDropdown.jsx";
import { useNavigate } from "react-router-dom";
import CandidateCheckIconStatus from "../common/CandidateCheckIconStatus.jsx";

const CandidatesTable = ({ candidates, searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, checkTypeFilter, setCheckTypeFilter, selectedClient, setSelectedClient, parentRoute }) => {
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (e, text) => {
        e.stopPropagation(); // Prevent navigation when clicking the copy button
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000); // Reset icon after 2 seconds
    };

    const mappedCandidates = useMemo(() => {
        return candidates.map(item => {
            return {
                id: item.candidateInfo.candidateId,
                caseNo: item.candidateInfo.caseNo,
                name: item.candidateInfo.name,
                email: item.candidateInfo.email,
                client: item.candidateInfo.client,
                package: item.candidateInfo.packageName,
                initiatedDate: item.candidateInfo.initiatedDate,
                dueDate: item.candidateInfo.dueDate || 'TBD',
                status: item.caseDetails.status,
                taskStatus: item.caseDetails.taskStatus,
                checks: item.caseDetails?.checks,
            };
        });
    }, [candidates]);


    const filteredCandidates = mappedCandidates.filter(c =>
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        navigate(`/candidate-details/${candidateId}`,
            {state: { activeMenu: parentRoute }}
        )
    }

    return (
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

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:ml-auto">
                    <MultiSelectDropdown
                        label="Status"
                        options={['All', 'Completed', 'In-Progress', 'Action Required']}
                        selected={selectedStatus}
                        onToggle={handleToggleStatus}
                        onClear={() => setSelectedStatus([])}
                    />
                    <SingleSelectDropdown
                        label="By Check Type"
                        options={['All', 'ID', 'Criminal', 'Education']}
                        selected={checkTypeFilter}
                        onSelect={setCheckTypeFilter}
                    />
                    {
                        setSelectedClient !== undefined && (
                            <SingleSelectDropdown
                                label="By Client"
                                options={['All Clients', 'Google', 'TCS', 'Amazon']}
                                selected={selectedClient}
                                onSelect={setSelectedClient}
                            />
                        )
                    }
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
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Report Checks</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Overall Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filteredCandidates.length > 0 ? (
                            filteredCandidates.map((item, index) => (
                                <tr key={item.id} className="hover:bg-[#F9F7FF]/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-300">
                                        {String(index + 1).padStart(2, '0')}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#F9F7FF] border border-[#5D4591]/10 flex items-center justify-center text-[#5D4591] font-bold text-xs shrink-0">
                                                {item.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                {/* Candidate Name */}
                                                <span
                                                    onClick={() => handleCandidateClick(item.id)}
                                                    className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#5D4591] cursor-pointer transition-colors"
                                                >
                                                    {item.name}
                                                </span>

                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span
                                                        onClick={() => handleCandidateClick(item.id)}
                                                        className="text-[11px] font-bold text-[#5D4591] cursor-pointer"
                                                    >
                                                        {item.caseNo}
                                                    </span>

                                                    <button
                                                        onClick={(e) => handleCopy(e, item.caseNo)}
                                                        className="inline-flex items-center justify-center w-5 h-5 transition-all cursor-pointer"
                                                        title="Copy Case Number"
                                                    >
                                                        {copiedId === item.caseNo ? (
                                                            <Check
                                                                size={13}
                                                                className="text-emerald-500 opacity-100 scale-110 animate-in zoom-in duration-300"
                                                            />
                                                        ) : (
                                                            <Copy
                                                                size={13}
                                                                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-[#5D4591]"
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                                                <Building2 size={14} className="text-slate-300" />
                                                {item.client}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                                <Package size={14} className="text-slate-300" />
                                                {item.package}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                <Calendar size={13} className="text-slate-300" />
                                                <span className="text-slate-400 font-medium">Init:</span> {item.initiatedDate}
                                            </div>
                                            <div className={`flex items-center gap-2 text-[11px] font-bold ${item.status === 'ACTION_REQUIRED' ? 'text-red-500' : 'text-slate-500'}`}>
                                                <Clock size={13} className={item.status === 'ACTION_REQUIRED' ? 'text-red-300' : 'text-slate-300'} />
                                                <span className="font-medium opacity-60">Due:</span> {item.dueDate}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 min-w-max">
                                            <CandidateCheckIconStatus  checks={item?.checks} candidateStatus={item.status} />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusPill status={item.status} showDot={true} />
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[#5D4591]/80 cursor-pointer"
                                                title="Interim Report"
                                            >
                                                <FileText size={16} />
                                            </button>

                                            <button
                                                disabled={item.status !== 'COMPLETED'}
                                                className={`p-2 rounded-lg transition-all ${
                                                    item.status === 'COMPLETED'
                                                        ? 'text-slate-400 hover:text-emerald-500 hover:bg-white cursor-pointer'
                                                        : 'text-slate-200 cursor-not-allowed'
                                                }`}
                                                title="Final Report"
                                            >
                                                <FileCheck size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Search size={32} className="opacity-20" />
                                        <p className="text-sm font-medium">No candidates found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

const StatusPill = ({ status, showDot = false }) => {
    // Map API status strings to the UI Styles

    const statusConfig = {
        GREEN: {
            className: 'bg-emerald-50 text-emerald-600 border-emerald-100 dot-emerald-500',
            displayName: "Completed"
        },
        IN_PROGRESS: {
            className: 'bg-blue-50 text-blue-600 border-blue-100 dot-blue-500',
            displayName: "In Progress"
        },
        RED: {
            className: 'bg-red-50 text-red-600 border-red-100 dot-red-500',
            displayName: "Failed"
        },
        AMBER: {
            className: 'bg-amber-50 text-amber-600 border-amber-100 dot-amber-500',
            displayName: "Unable to Verify"
        },
        INSUFFICIENCY: {
            className: 'bg-orange-50 text-orange-600 border-orange-100 dot-orange-500',
            displayName: "Insufficiency"
        },
        STOP_CASE: {
            className: 'bg-slate-50 text-slate-600 border-slate-100 dot-slate-400',
            displayName: "Stop Case"
        }
    }

    const currentStyle = statusConfig[status]?.className || 'bg-slate-50 text-slate-500 border-slate-200 dot-slate-400';
    const dotColor = currentStyle.split(' ').find(s => s.startsWith('dot-'))?.replace('dot-', 'bg-') || 'bg-slate-400';

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${currentStyle}`}>
            {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
            {statusConfig[status]?.displayName}
        </span>
    );
};

export default CandidatesTable;
