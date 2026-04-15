import React from 'react';
import {TrendingUp, CreditCard, Activity, IndianRupeeIcon} from 'lucide-react';

const RevenueKpiGrid = ({ summary }) => {
    const kpis = [
        { label: "Total MRR", value: `₹${(summary.totalMrr/1000).toFixed(1)}k`, icon: <IndianRupeeIcon />, color: "text-emerald-600", bg: "bg-emerald-50", trend: `+${summary.mrrGrowth}%` },
        { label: "Expansion Revenue", value: `₹${(summary.overageRevenue/1000).toFixed(1)}k`, icon: <TrendingUp />, color: "text-blue-600", bg: "bg-blue-50", trend: "Overages" },
        { label: "Collection Rate", value: `${summary.collectionRate}%`, icon: <CreditCard />, color: "text-[#5D4591]", bg: "bg-[#F9F7FF]", trend: "Net 30" },
        { label: "Pending Invoices", value: summary.pendingInvoices, icon: <Activity />, color: "text-amber-600", bg: "bg-amber-50", trend: "Follow-up" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                            {kpi.icon}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.trend}</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">{kpi.value}</h3>
                </div>
            ))}
        </div>
    );
};

export default RevenueKpiGrid;
