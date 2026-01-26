import React from 'react';
import {
    Users, Clock, AlertTriangle, CheckCircle2, ShieldCheck,GraduationCap, Briefcase,
    UserCheck, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import CheckIcon from "../common/CheckIcon.jsx";

// --- Sub-Component: KPI Card ---
const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
            </div>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

// --- Sub-Component: Aging Bar ---
const AgingBucket = ({ label, count, percentage, color }) => (
    <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs font-bold text-slate-600">{label}</span>
            <span className="text-xs font-black text-slate-400">{count} Cases</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    </div>
);

const OperationsDashboard = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* 1. Header Section */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Operations Overview</h1>
                    <p className="text-sm text-slate-500 font-medium">Monitoring real-time TAT and SLA performance</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-[#5D4591] text-white text-xs font-bold rounded-lg shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] transition-colors">
                        View All Cases
                    </button>
                </div>
            </div>

            {/* 2. Top KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Work-In-Progress"
                    value="1,284"
                    trend="+12%"
                    trendUp={true}
                    icon={Users}
                    color="bg-[#5D4591]"
                />
                <StatCard
                    title="Average TAT (Days)"
                    value="4.2"
                    trend="-0.5d"
                    trendUp={true}
                    icon={Clock}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="SLA Breach Rate"
                    value="2.4%"
                    trend="+0.3%"
                    trendUp={false}
                    icon={AlertTriangle}
                    color="bg-rose-500"
                />
                <StatCard
                    title="Major Discrepancy"
                    value="18%"
                    trend="+2%"
                    trendUp={true}
                    icon={CheckCircle2}
                    color="bg-amber-500"
                />
            </div>

            {/* 3. Middle Section: Trends & Aging */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Main Trend Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Case Volume Trend</h3>
                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5 text-[#5D4591]">
                                <div className="w-2 h-2 rounded-full bg-[#5D4591]" /> Inflow
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-slate-300" /> Outflow
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for actual Chart (e.g. Recharts) */}
                    <div className="h-64 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                        <p className="text-xs font-bold text-slate-400">[ Interactive Line Chart: Inflow vs Outflow ]</p>
                    </div>
                </div>

                {/* Aging Analysis */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Aging Analysis</h3>
                    <div className="space-y-6">
                        <AgingBucket label="0 - 3 Days" count={840} percentage={70} color="bg-emerald-500" />
                        <AgingBucket label="4 - 7 Days" count={210} percentage={25} color="bg-[#F9F7FF]" />
                        <AgingBucket label="8 - 15 Days" count={145} percentage={15} color="bg-amber-500" />
                        <AgingBucket label="15+ Days" count={89} percentage={8} color="bg-rose-500" />
                    </div>
                    <div className="mt-8 p-4 bg-rose-50 rounded-xl border border-rose-100">
                        <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Critical Alert</p>
                        <p className="text-xs font-bold text-rose-900 leading-tight">89 cases have exceeded the 15-day threshold and require immediate intervention.</p>
                    </div>
                </div>
            </div>

            {/* 4. Bottom Section: Delayed Cases Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Critical Delayed Cases (Top 5)</h3>
                    <button className="text-xs font-bold text-[#5D4591] hover:underline">View Priority List</button>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiated on</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aging</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stage</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {[
                        { id: 'TR-9021', client: 'Google India', age: '19 Days', stage: 'Criminal Check', initiatedDate: '12 Oct 2023', color: 'text-rose-600', checks: {
                                id: 'cleared',
                                criminal: 'inprogress',
                                education: 'cleared',
                                employment: 'pending'
                            } },
                        { id: 'TR-8842', client: 'Amazon AWS', age: '17 Days', stage: 'Education Verification',initiatedDate: '12 Oct 2023', color: 'text-rose-600', checks: {
                                id: 'cleared',
                                criminal: 'inprogress',
                                education: 'cleared',
                                employment: 'pending'
                            } },
                        { id: 'TR-9104', client: 'TCS Ltd', age: '16 Days', stage: 'Previous Employment',initiatedDate: '12 Oct 2023', color: 'text-amber-600', checks: {
                                id: 'cleared',
                                criminal: 'inprogress',
                                education: 'cleared',
                                employment: 'pending'
                            } },
                        { id: 'TR-8722', client: 'Flipkart', age: '14 Days', stage: 'Field Visit',initiatedDate: '12 Oct 2023', color: 'text-amber-600', checks: {
                                id: 'cleared',
                                criminal: 'inprogress',
                                education: 'cleared',
                                employment: 'pending'
                            } },
                        { id: 'TR-9055', client: 'Reliance', age: '12 Days', stage: 'Address Check', initiatedDate: '12 Oct 2023',color: 'text-slate-600', checks: {
                                id: 'cleared',
                                criminal: 'inprogress',
                                education: 'cleared',
                                employment: 'pending'
                            } },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.id}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">{row.client}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">{row.initiatedDate}</td>
                            <td className={`px-6 py-4 text-sm font-black ${row.color}`}>{row.age}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                    <CheckIcon icon={<UserCheck size={14} />} status={row.checks?.id} label="ID" />
                                    <CheckIcon icon={<ShieldCheck size={14} />} status={row.checks?.criminal} label="Criminal" />
                                    <CheckIcon icon={<GraduationCap size={14} />} status={row.checks?.education} label="Education" />
                                    <CheckIcon icon={<Briefcase size={14} />} status={row.checks?.employment} label="Experience" />
                                </div>
                              {/*<span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wide">*/}
                              {/*  {row.stage}*/}
                              {/*</span>*/}
                            </td>
                            <td className="px-6 py-4 text-right text-slate-400">
                                <button className="hover:text-[#5D4591] transition-colors"><MoreHorizontal size={18} /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



export default OperationsDashboard;
