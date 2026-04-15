import React from 'react';
import { FileText, MoreVertical, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const InvoiceTable = ({ invoices, filter }) => {
    const filtered = filter === "All" ? invoices : invoices.filter(i => i.status === filter);

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Paid': return <CheckCircle2 size={12} className="text-emerald-500" />;
            case 'Pending': return <Clock size={12} className="text-amber-500" />;
            case 'Overdue': return <AlertTriangle size={12} className="text-rose-500" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice / Tenant</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {filtered.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591] transition-all">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm">{inv.tenantName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{inv.id} • {inv.date}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <p className="font-black text-slate-800 text-sm">₹{inv.amount.toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{inv.plan} Plan</p>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5">
                                {getStatusIcon(inv.status)}
                                <span className="text-[10px] font-black uppercase text-slate-700">{inv.status}</span>
                            </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                                <MoreVertical size={16} className="text-slate-400" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;
