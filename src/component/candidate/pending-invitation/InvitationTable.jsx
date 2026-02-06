import React, { useState } from 'react';
import {
    Mail, Phone, Clock, AlertCircle, Send, Calendar, RotateCcw, Ban, Loader2, X as CloseIcon, Check, Package,
    SearchIcon
} from 'lucide-react';
import TableSkeleton from "./TableSkeleton.jsx";

const InvitationTable = ({ invitations, loading, selectedIds, onSelect, onSelectAll, onStopCase, onSendInvitation }) => {
    // Track state per row: { [id]: { status: 'idle'..., inviteStatus: 'idle' | 'loading' | 'success' | 'error', inviteMsg: '' } }
    const [rowStates, setRowStates] = useState({});

    const updateRowState = (id, newState) => {
        setRowStates(prev => ({
            ...prev,
            [id]: { ...(prev[id] || {}), ...newState }
        }));
    };

    const handleStopClick = (id) => {
        updateRowState(id, { status: 'confirming', errorMsg: '' });
    };

    const handleCancelStop = (id) => {
        updateRowState(id, { status: 'idle' });
    };

    const handleConfirmStop = async (id) => {
        updateRowState(id, { status: 'loading' });
        const success = await onStopCase(id);
        if (!success) {
            updateRowState(id, { status: 'error', errorMsg: 'Failed to stop' });
        }
    };

    const handleSendInviteClick = async (id) => {
        updateRowState(id, { inviteStatus: 'loading', inviteMsg: '' });

        try {
            const response = await onSendInvitation(id);
            if (response.status === 200) {
                updateRowState(id, { inviteStatus: 'success', inviteMsg: response.message || 'Invitation Sent!' });
                setTimeout(() => updateRowState(id, { inviteStatus: 'idle', inviteMsg: '' }), 3000);
            } else {
                updateRowState(id, { inviteStatus: 'error', inviteMsg: response.message || 'Failed to send' });
            }
        } catch (error) {
            updateRowState(id, { inviteStatus: 'error', inviteMsg: 'Network Error' });
        }
    };

    const getStatusStyles = (status, isExpired) => {
        if (isExpired) return 'bg-red-50 text-red-600 border-red-100';
        switch (status) {
            case 'Invited': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Partially Filled': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 w-10">
                        <input
                            type="checkbox"
                            className="rounded border-slate-300 text-[#5D4591] focus:ring-[#5D4591]"
                            checked={selectedIds.length > 0 && selectedIds.length === invitations.length}
                            onChange={onSelectAll}
                        />
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate Details</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Package</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Form Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Timeline & Activity</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {
                    loading ? <TableSkeleton /> : (
                        invitations.length > 0 ? (
                        invitations.map((item) => {
                            const rowState = rowStates[item.id] || { status: 'idle', inviteStatus: 'idle' };

                            return (
                                <tr key={item.id} className={`hover:bg-slate-50/30 transition-colors ${selectedIds.includes(item.id) ? 'bg-[#F9F7FF]/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-[#5D4591] focus:ring-[#5D4591]"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => onSelect(item.id)}
                                        />
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#F9F7FF] border border-[#5D4591]/10 flex items-center justify-center text-[#5D4591] font-bold text-xs">
                                                {item.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><Mail size={12} /> {item.email}</span>
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><Phone size={12} /> {item.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SEPARATE PACKAGE COLUMN */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-lg w-fit">
                                            <Package size={14} className="text-[#5D4591]" />
                                            <span className="text-[11px] font-bold text-[#5D4591] uppercase tracking-tight">
                                                {item.packageName || 'Standard'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border w-fit ${getStatusStyles(item.status, item.isExpired)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.isExpired ? 'bg-red-500' : item.status === 'Invited' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                                                {item.isExpired ? 'Link Expired' : item.status}
                                            </span>
                                            {item.status === 'Partially Filled' && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="bg-amber-400 h-full" style={{ width: `${item.progress}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400">{item.progress}% Filled</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <Calendar size={13} className="text-slate-300" />
                                                <span className="text-slate-400 font-medium">Invited:</span>
                                                <span className="text-slate-700 font-bold">{item.sentAt}</span>
                                            </div>
                                            {item.isExpired ? (
                                                <div className="flex items-center gap-2 text-[11px] text-red-500 font-bold">
                                                    <AlertCircle size={13} />
                                                    <span>Expired on {item.expiresAt}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-bold">
                                                    <Clock size={13} />
                                                    <span>Valid until {item.expiresAt}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {rowState.status === 'idle' && rowState.inviteStatus === 'idle' && (
                                                <button
                                                    onClick={() => handleStopClick(item.id)}
                                                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white text-rose-500 rounded-xl text-[11px] font-bold hover:bg-rose-50 transition-all border border-rose-100 shadow-sm group"
                                                >
                                                    <Ban size={14} /> Stop Case
                                                </button>
                                            )}

                                            {rowState.status === 'confirming' && (
                                                <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-100 animate-in fade-in zoom-in duration-200">
                                                    <span className="text-[9px] font-black text-rose-600 uppercase px-2">Confirm?</span>
                                                    <button onClick={() => handleConfirmStop(item.id)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                                                        <Check size={12} strokeWidth={3} />
                                                    </button>
                                                    <button onClick={() => handleCancelStop(item.id)} className="p-1.5 bg-white text-slate-400 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                                                        <CloseIcon size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            )}

                                            {rowState.status === 'loading' && (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[11px] font-bold border border-slate-100">
                                                    <Loader2 size={14} className="animate-spin" /> Stopping...
                                                </div>
                                            )}

                                            {/* SEND INVITATION LOGIC */}
                                            {rowState.inviteStatus === 'idle' && rowState.status === 'idle' && (
                                                <button
                                                    onClick={() => handleSendInviteClick(item.id)}
                                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#5D4591] text-white rounded-xl text-[11px] font-bold hover:bg-[#4a3675] hover:shadow-lg hover:shadow-[#5D4591]/20 transition-all shadow-sm"
                                                >
                                                    <Send size={14} /> {item.isExpired ? 'Re-invite' : 'Send Reminder'}
                                                </button>
                                            )}

                                            {rowState.inviteStatus === 'loading' && (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-[#5D4591] rounded-xl text-[11px] font-bold border border-[#5D4591]/10">
                                                    <Loader2 size={14} className="animate-spin" /> Sending...
                                                </div>
                                            )}

                                            {rowState.inviteStatus === 'success' && (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-bold border border-emerald-100 animate-in zoom-in duration-300">
                                                    <Check size={14} /> {rowState.inviteMsg}
                                                </div>
                                            )}

                                            {rowState.inviteStatus === 'error' && (
                                                <div className="flex flex-col items-end gap-1">
                                                    <button
                                                        onClick={() => handleSendInviteClick(item.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[11px] font-bold hover:bg-rose-100 transition-all border border-rose-200"
                                                    >
                                                        <RotateCcw size={12} /> Retry
                                                    </button>
                                                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter">{rowState.inviteMsg}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                        ): (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                                            <SearchIcon size={40} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">No candidates found</h3>
                                        <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">
                                            We couldn't find any pending invitations matching your current filters or search criteria.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </table>
        </div>
    );
};

export default InvitationTable;
