import React from 'react';
import {
    UserPlus,
    RefreshCw,
    Search,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    UsersIcon,
    UserPlusIcon
} from 'lucide-react';

const CaseAssignmentTable = ({
                                 data,
                                 onAssign,
                                 selectedIds,
                                 onSelectRow,
                                 onSelectAll,
                                 onBulkAssign,
                                 currentPage,
                                 totalPages,
                                 totalElements,
                                 onPageChange,
                                 isLoading,
                             }) => {
    const unassignedRows = data.filter(row => !row.assignedUserId);
    const isAllSelected = unassignedRows.length > 0 &&
        unassignedRows.every(row => selectedIds.includes(row.taskId));
    const hasSelection = selectedIds.length > 0;
    const isSelectAllDisabled = unassignedRows.length === 0;
    // Status Badge Helper
    const getStatusStyles = (status) => {
        switch (status) {
            case 'IN_PROGRESS':
                return {
                    badge: 'bg-blue-50 text-blue-600 border-blue-100',
                    dot: 'bg-blue-500'
                };
            case 'INSUFFICIENCY': // Matches your API response
            case 'IN_SUFFICIENT':
                return {
                    badge: 'bg-rose-50 text-rose-600 border-rose-100',
                    dot: 'bg-rose-500'
                };
            case 'NEEDS_REVIEW':
                return {
                    badge: 'bg-amber-50 text-amber-600 border-amber-100',
                    dot: 'bg-amber-500'
                };
            default:
                return {
                    badge: 'bg-slate-50 text-slate-600 border-slate-100',
                    dot: 'bg-slate-500'
                };
        }
    };

    return (
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${hasSelection ? 'bg-[#5D4591]/10 text-[#5D4591]' : 'bg-slate-100 text-slate-400'}`}>
                        <UsersIcon size={16} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 tracking-tight">Case List</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {hasSelection ? `${selectedIds.length} items selected` : 'Manage and assign cases'}
                        </p>
                    </div>
                </div>

                {/* BULK ASSIGN BUTTON */}
                <button
                    onClick={onBulkAssign}
                    disabled={!hasSelection || isLoading}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300
                        ${hasSelection
                        ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20 hover:scale-[1.02] active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'}`}
                >
                    <UserPlusIcon size={14} />
                    Bulk Assign {hasSelection && `(${selectedIds.length})`}
                </button>
            </div>
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 w-10">
                            <button
                                onClick={onSelectAll}
                                disabled={isSelectAllDisabled} // Disable if no cases are selectable
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                                    ${isSelectAllDisabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50' :
                                    isAllSelected ? 'bg-[#5D4591] border-[#5D4591]' : 'border-slate-300 bg-white hover:border-[#5D4591]'}`}
                            >
                                {isAllSelected && <Check size={12} className="text-white stroke-[4]" />}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Details</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 relative">
                    {isLoading ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-32 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 size={32} className="text-[#5D4591] animate-spin" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Cases...</p>
                                </div>
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((row) => {
                            const isSelected = selectedIds.includes(row.taskId); // Using UUID taskId
                            const styles = getStatusStyles(row.status);

                            return (
                                <tr key={row.taskId} className={`${isSelected ? 'bg-[#F9F7FF]' : 'hover:bg-slate-50/50'} transition-colors group`}>
                                    <td className="px-6 py-4">
                                        <button
                                            // Disable the button if assignedUserId is present
                                            disabled={!!row.assignedUserId}
                                            onClick={() => onSelectRow(row.taskId)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                                            ${row.assignedUserId
                                                ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-50' // Disabled styles
                                                : isSelected
                                                    ? 'bg-[#5D4591] border-[#5D4591]'
                                                    : 'border-slate-300 bg-white hover:border-[#5D4591]'}`}
                                        >
                                            {isSelected && <Check size={12} className="text-white stroke-[4]" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800 tracking-tight">
                                            {row.caseNumber}
                                        </p>

                                        <div className="flex items-center mt-0.5">
                                           <span className="text-[10px] text-[#5D4591] font-extrabold uppercase tracking-tighter inline-block w-[150px]">
                                                {row.checkType.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>

                                            <span className="text-[10px] text-slate-300 mx-2 font-medium">|</span>

                                            <div className="flex items-center gap-1.5">
                                                {!row.assignedUserId ? (
                                                    <>
                                                        <span className={`text-[10px] font-bold uppercase tracking-tighter 
                                                            ${row.isSlaBreached ? 'text-rose-500' : 'text-slate-400'}`}>
                                                            {row.daysPending} Days Pending
                                                        </span>
                                                        {row.isSlaBreached && (
                                                            <span className="flex h-1 w-1 rounded-full bg-rose-500 animate-pulse" />
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                        Created {row.daysPending} days ago
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-700">{row.candidateName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${styles.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                                {row.status?.replace('_', ' ')}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.assignedUserId && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#5D4591]/10 flex items-center justify-center text-[10px] font-bold text-[#5D4591]">
                                                    {row.assignedUserName[0]}
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">{row.assignedUserName}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onAssign(row)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                                            ${row.assignedUserId
                                                ? 'text-slate-500 hover:bg-slate-100'
                                                : 'text-[#5D4591] bg-[#F9F7FF] hover:bg-[#5D4591] hover:text-white'}`}
                                        >
                                            {row.assignedUserId ? <RefreshCw size={14} /> : <UserPlus size={14} />}
                                            {row.assignedUserId ? 'Re-assign' : 'Assign User'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center justify-center opacity-30">
                                    <Search size={48} className="text-slate-400 mb-4" />
                                    <p className="text-lg font-bold text-slate-500">No cases found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Showing <span className="text-slate-700">{data.length > 0 ? (currentPage * 20) + 1 : 0}</span> to <span className="text-slate-700">{Math.min((currentPage + 1) * 20, totalElements)}</span> of <span className="text-slate-700">{totalElements}</span> Cases
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 0 || isLoading}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#5D4591] hover:border-[#5D4591] disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1 mx-2">
                        {[...Array(totalPages)].map((_, i) => {
                            // Only show current, first, last, and neighbors if many pages
                            if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => onPageChange(i)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                                        ${currentPage === i
                                            ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20'
                                            : 'text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            }
                            if (i === currentPage - 2 || i === currentPage + 2) {
                                return <span key={i} className="text-slate-300 text-xs">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        disabled={currentPage === totalPages - 1 || isLoading || totalPages === 0}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#5D4591] hover:border-[#5D4591] disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaseAssignmentTable;
