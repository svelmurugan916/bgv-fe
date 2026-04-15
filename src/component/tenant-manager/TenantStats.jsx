import React from 'react';
import {
    Building2,
    Zap,
    AlertCircle,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight, IndianRupeeIcon
} from 'lucide-react';

const TenantStats = ({ tenants }) => {

    // Logic to calculate aggregated metrics
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.status === 'Active').length;
    const totalMrr = tenants.reduce((acc, t) => acc + (t.stats.mrr || 0), 0);
    const avgHealth = Math.round(tenants.reduce((acc, t) => acc + t.stats.healthScore, 0) / totalTenants);
    const lowWalletTenants = tenants.filter(t => t.billing.walletBalance < 100).length;

    const stats = [
        {
            label: "Total Organizations",
            value: totalTenants,
            subValue: `${activeTenants} Active • ${totalTenants - activeTenants} Inactive`,
            icon: <Building2 size={22} />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            trend: "+12%",
            isPositive: true
        },
        {
            label: "Platform MRR",
            value: `₹${(totalMrr / 1000).toFixed(1)}k`,
            subValue: "Monthly Recurring Revenue",
            icon: <IndianRupeeIcon size={22} />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            trend: "+8.4%",
            isPositive: true
        },
        {
            label: "System Health",
            value: `${avgHealth}%`,
            subValue: "Avg. Tenant Success Rate",
            icon: <Zap size={22} />,
            color: "text-[#5D4591]",
            bgColor: "bg-[#F9F7FF]",
            trend: "-0.5%",
            isPositive: false
        },
        {
            label: "Financial Risk",
            value: lowWalletTenants,
            subValue: "Tenants with Low Balance",
            icon: <AlertCircle size={22} />,
            color: "text-rose-600",
            bgColor: "bg-rose-50",
            trend: "Critical",
            isPositive: false
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                            {stat.icon}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight
                            ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {stat.trend}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            {stat.label}
                        </p>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-500">
                            {stat.subValue}
                        </p>
                    </div>

                    {/* Subtle Progress Bar for Visual Polish */}
                    <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full opacity-40 ${stat.color.replace('text', 'bg')}`}
                            style={{ width: '60%' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TenantStats;
