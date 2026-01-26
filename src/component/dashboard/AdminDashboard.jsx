import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    Users, Building2, ClipboardCheck, AlertCircle, Search,
    Bell, Plus, MoreHorizontal, ArrowUpRight, CheckCircle2,
    Clock, FileText, Filter, ChevronDown
} from 'lucide-react';

// --- Mock Data ---
const caseStatusData = [
    { name: 'Jan', initiated: 400, completed: 240 },
    { name: 'Feb', initiated: 300, completed: 139 },
    { name: 'Mar', initiated: 200, completed: 980 },
    { name: 'Apr', initiated: 278, completed: 390 },
    { name: 'May', initiated: 189, completed: 480 },
    { name: 'Jun', initiated: 239, completed: 380 },
];

const riskDistributionData = [
    { name: 'Clear', value: 68, color: '#6366f1' },      // Indigo
    { name: 'Minor Discrepancy', value: 20, color: '#8b5cf6' }, // Purple
    { name: 'Major Discrepancy', value: 8, color: '#f59e0b' },  // Amber
    { name: 'SLA Breach', value: 4, color: '#f43f5e' },         // Rose
];

// --- Sub-Components ---

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon size={24} className={color.replace('bg-', 'text-') + "0"} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="bg-[#F8F9FB] min-h-screen font-sans text-slate-800">

            {/* 1. Header Section */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything"
                            className="pl-10 pr-12 py-2.5 bg-white border border-slate-100 rounded-xl text-sm w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-bold">⌘ K</kbd>
                    </div>

                    <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                        <div className="relative">
                            <Bell size={20} className="text-slate-500" />
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white">24</span>
                        </div>
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="profile" />
                        <ChevronDown size={16} className="text-slate-400" />
                    </div>
                </div>
            </header>

            {/* 2. Top Level KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard icon={Building2} label="Total Organizations" value="1,525" color="bg-indigo-50" />
                <StatCard icon={Users} label="Active Candidates" value="10,892" color="bg-purple-50" />
                <StatCard icon={ClipboardCheck} label="Pending Admin Action" value="157,342" color="bg-emerald-50" />
                <StatCard icon={AlertCircle} label="SLA Breach Warning" value="12,453" color="bg-rose-50" />
            </div>

            {/* 3. Middle Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

                {/* Case Volume Bar Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[12px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FileText size={18} className="text-indigo-500" /> Case Progress
                            </h3>
                            <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-indigo-100" /> Initiated
                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" /> Completed
                </span>
                            </div>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            {['Monthly', 'Quarterly', 'Yearly'].map((t) => (
                                <button key={t} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${t === 'Monthly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={caseStatusData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="initiated" fill="#e0e7ff" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution Donut Chart */}
                <div className="bg-white p-8 rounded-[12px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Risk Distribution</h3>
                        <button className="text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg">See All</button>
                    </div>

                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistributionData}
                                    cx="50%" cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {riskDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cases</p>
                            <p className="text-2xl font-black text-slate-800">125,000</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {riskDistributionData.map((item) => (
                            <div key={item.name} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-medium text-slate-500">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-800">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Bottom Row: Recent Activity & Org Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Recent Activity Feed */}
                <div className="bg-white p-8 rounded-[12px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-2"><Clock size={18} className="text-indigo-500" /> Recent Activity</h3>
                        <button className="text-xs font-bold text-slate-400">See All</button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: "New Organization", desc: "Tesla Inc. onboarded", time: "12 Jan 25", icon: Building2, col: "text-[#5D4591]/80", bg: "bg-[#F9F7FF]", badge: "New Org" },
                            { title: "SLA Breach Alert", desc: "Case #TR-9021 delayed", time: "10 Jan 25", icon: AlertCircle, col: "text-rose-500", bg: "bg-rose-50", badge: "Critical" },
                            { title: "Report Generated", desc: "John Doe verification", time: "8 Jan 25", icon: FileText, col: "text-emerald-500", bg: "bg-emerald-50", badge: "Success" },
                            { title: "Bulk Upload", desc: "Ford Motors: 50 candidates", time: "2 Jan 25", icon: Users, col: "text-indigo-500", bg: "bg-indigo-50", badge: "System" },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start justify-between group cursor-pointer">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${activity.bg} ${activity.col}`}>
                                        <activity.icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{activity.desc} • {activity.time}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${activity.bg} ${activity.col}`}>{activity.badge}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Organization Table */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[12px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Organization Performance</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl"><Filter size={14}/> Filter</button>
                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2"><Plus size={14}/> Onboard Org</button>
                        </div>
                    </div>

                    <table className="w-full">
                        <thead>
                        <tr className="text-left border-b border-slate-50">
                            <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Organization</th>
                            <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cases</th>
                            <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</th>
                            <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Discrepancy</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {[
                            { name: 'Ford Motors', logo: 'F', total: '150', pending: '20', rate: '2%', color: 'text-emerald-500' },
                            { name: 'Tech Corp', logo: 'T', total: '80', pending: '45', rate: '12%', color: 'text-rose-500' },
                            { name: 'Google India', logo: 'G', total: '1,200', pending: '150', rate: '1.5%', color: 'text-emerald-500' },
                            { name: 'Amazon AWS', logo: 'A', total: '850', pending: '200', rate: '4.2%', color: 'text-amber-500' },
                            { name: 'Tesla Inc', logo: 'T', total: '340', pending: '12', rate: '0.8%', color: 'text-emerald-500' },
                        ].map((org, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">{org.logo}</div>
                                        <span className="text-sm font-bold text-slate-700">{org.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-sm font-semibold text-slate-600">{org.total}</td>
                                <td className="py-4 text-sm font-semibold text-slate-600">{org.pending}</td>
                                <td className={`py-4 text-sm font-black text-right ${org.color}`}>{org.rate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
