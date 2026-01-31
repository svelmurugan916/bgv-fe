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

const CandidatesTable = ({ candidates, searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, checkTypeFilter, setCheckTypeFilter, selectedClient, setSelectedClient }) => {
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState(null);

    const getTaskIcon = (taskName) => {
        switch (taskName.toLowerCase()) {
            case 'unassigned': return <UserPlusIcon size={14} />;
            case 'id':
            case 'identity': return <UserCheck size={14} />;
            case 'criminal': return <ShieldCheck size={14} />;
            case 'education': return <GraduationCap size={14} />;
            case 'employment':
            case 'experience': return <Briefcase size={14} />;
            case 'address': return <MapPinIcon size={14} />;
            case 'db check':
            case 'database': return <DatabaseIcon size={14} />;
            case 'reference':
            case 'reference check': return <UsersIcon size={14} />;
            default: return <Package size={14} />;
        }
    };

    const handleCopy = (e, text) => {
        e.stopPropagation(); // Prevent navigation when clicking the copy button
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000); // Reset icon after 2 seconds
    };

    const mappedCandidates = useMemo(() => {
        return candidates.map(item => {
            // 1. Group checks by normalized task name
            const grouped = item?.caseDetails?.checks?.reduce((acc, check) => {
                let category = check.taskName.toUpperCase();
                if (category.includes('ADDRESS')) category = 'ADDRESS';
                else if (category.includes('IDENTITY') || category.includes('ID ')) category = 'IDENTITY';
                else if (category.includes('EDUCATION')) category = 'EDUCATION';
                else if (category.includes('EMPLOYMENT') || category.includes('EXPERIENCE')) category = 'EMPLOYMENT';
                else if (category.includes('CRIMINAL')) category = 'CRIMINAL';
                else if (category.includes('REFERENCE')) category = 'REFERENCE';
                else if (category.includes('DATABASE') || category.includes('DB ')) category = 'DATABASE';

                if (!acc[category]) acc[category] = [];
                acc[category].push(check);
                return acc;
            }, {});

            // 2. Determine final status for each group based on weightage
            const processedChecks = grouped ? Object.keys(grouped).map(taskName => {
                const checks = grouped[taskName];
                const hasFailed = checks.some(c => c.status.toLowerCase().includes('failed'));
                const hasInsufficiency = checks.some(c => c.status.toLowerCase().includes('insufficiency'));
                const hasUnable = checks.some(c => c.status.toLowerCase().includes('unable_to_verify'));
                const hasInProgress = checks.some(c =>
                    c.status.toLowerCase() === 'in_progress' || c.status.toLowerCase() === 'needs_review'
                );
                const allUnassigned = checks.every(c => !c.assignedToUserId);

                let finalStatus = 'cleared';

                if (hasFailed) finalStatus = 'failed';
                else if (hasInsufficiency) finalStatus = 'insufficiency';
                else if (hasUnable) finalStatus = 'unableto_verify';
                else if (allUnassigned) finalStatus = 'unassigned';
                else if (hasInProgress) finalStatus = 'inprogress';

                return {
                    taskName: taskName,
                    status: finalStatus
                };
            }) : [];

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
                checks: processedChecks
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
                                                    onClick={() => navigate(`/candidate-details/${item.id}`)}
                                                    className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#5D4591] cursor-pointer transition-colors"
                                                >
                                                    {item.name}
                                                </span>

                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span
                                                        onClick={() => navigate(`/candidate-details/${item.id}`)}
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
                                            {item.checks.map((check, idx) => (
                                                <div key={idx} className="relative group/icon">
                                                    <CheckIcon key={idx} status={check.status} label={check.taskName} />
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusPill status={item.status} />
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
    const styles = {
        'GREEN': 'bg-emerald-50 text-emerald-600 border-emerald-100 dot-emerald-500',
        'IN_PROGRESS': 'bg-yellow-50 text-yellow-600 border-yellow-100 dot-yellow-500',
        'RED': 'bg-red-50 text-red-600 border-red-100 dot-red-500',
        'AMBER': 'bg-amber-50 text-amber-600 border-amber-100 dot-amber-500',
        'INSUFFICIENCY': 'bg-orange-50 text-orange-600 border-orange-100 dot-orange-500'
    };

    const currentStyle = styles[status] || 'bg-slate-50 text-slate-500 border-slate-200 dot-slate-400';
    const dotColor = currentStyle.split(' ').find(s => s.startsWith('dot-'))?.replace('dot-', 'bg-') || 'bg-slate-400';

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${currentStyle}`}>
            {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
            {status?.replaceAll('_', ' ')}
        </span>
    );
};

export default CandidatesTable;
