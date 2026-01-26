import React from 'react';
import { UserPlus, RefreshCw, Search, Check } from 'lucide-react';

const CaseAssignmentTable = ({ data, onAssign, selectedIds, onSelectRow, onSelectAll }) => {
    const isAllSelected = data.length > 0 && selectedIds.length === data.length;

    return (
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 w-10">
                        <button
                            onClick={onSelectAll}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                            ${isAllSelected ? 'bg-[#5D4591] border-[#5D4591]' : 'border-slate-300 bg-white hover:border-[#5D4591]'}`}
                        >
                            {isAllSelected && <Check size={12} className="text-white stroke-[4]" />}
                        </button>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {data.length > 0 ? (
                    data.map((row) => {
                        const isSelected = selectedIds.includes(row.id);
                        return (
                            <tr key={row.id} className={`${isSelected ? 'bg-[#F9F7FF]' : 'hover:bg-slate-50/50'} transition-colors group`}>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onSelectRow(row.id)}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                                        ${isSelected ? 'bg-[#5D4591] border-[#5D4591]' : 'border-slate-300 bg-white hover:border-[#5D4591]'}`}
                                    >
                                        {isSelected && <Check size={12} className="text-white stroke-[4]" />}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight
                                            ${row.status === 'New' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'New' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                                            {row.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-800">{row.caseNo}</p>
                                    <p className="text-[10px] text-[#5D4591] font-bold uppercase tracking-tighter">{row.type} Check</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-700">{row.name}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {row.assignedTo ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#5D4591]/10 flex items-center justify-center text-[10px] font-bold text-[#5D4591]">
                                                {row.assignedTo[0]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{row.assignedTo}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-rose-400 italic">Not-yet assigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onAssign(row)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                                            ${row.assignedTo
                                            ? 'text-slate-500 hover:bg-slate-100'
                                            : 'text-[#5D4591] bg-[#F9F7FF] hover:bg-[#5D4591] hover:text-white'}`}
                                    >
                                        {row.assignedTo ? <RefreshCw size={14} /> : <UserPlus size={14} />}
                                        {row.assignedTo ? 'Re-assign' : 'Assign User'}
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
                                <p className="text-lg font-bold text-slate-500">No cases match your filters</p>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CaseAssignmentTable;
