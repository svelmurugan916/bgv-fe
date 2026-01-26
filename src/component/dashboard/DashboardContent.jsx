import React from 'react';
import { Plus, ChevronRight, MoreHorizontal, Clock, User, FileText, CheckCircle2 } from 'lucide-react';

const DashboardContent = () => {
    const stats = [
        { label: "Candidate Login Expired", value: "76", color: "text-[#5D4591]" },
        { label: "Insufficient Cases", value: "23", color: "text-[#5D4591]" },
        { label: "Go Ahead Pending", value: "54", color: "text-[#5D4591]" },
        { label: "Cost Approval Required", value: "31", color: "text-[#5D4591]" },
        { label: "Sign off Pending", value: "12", color: "text-[#5D4591]" },
    ];

    const activities = [
        { type: 'cost', text: 'Cost Approval requested for', name: 'Gautam Gosh', time: '2 mins ago' },
        { type: 'form', text: 'Form submitted by', name: 'Kirti menon', time: '2 hr ago' },
        { type: 'insufficient', text: 'Insufficiency raised for', name: 'Raj Yadav', time: '2 hr ago' },
        { type: 'report', text: 'Report generated for', name: 'Nahar Sharma', time: '2 hr ago' },
        { type: 'expired', text: 'Login expired for', name: 'Revati Singh', time: '2 hr ago' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
            {/* 1. DARK HERO SECTION */}
            <div className=" pb-24">
                <div className="max-w-[1600px] mx-auto flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold ">Welcome back, Priya</h1>
                        <p className="text-slate-400 text-sm mt-1">Your current BGV summary and activity.</p>
                    </div>
                    <button className="bg-[#5D4591] hover:bg-[#4a3675] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#241B3B]/20">
                        <Plus size={18} />
                        Add Candidates
                    </button>
                </div>
            </div>

            {/* 2. OVERLAPPING STATS ROW */}
            <div className="-mt-14">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:text-[#5D4591] ">
                            <div className="flex justify-between items-start mb-4 ">
                                <span className="text-[13px] font-bold  leading-tight max-w-[120px] ">
                                  {stat.label}
                                </span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#5D4591] transition-colors" />
                            </div>
                            <div className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MAIN ANALYTICS GRID */}
            <div className="py-8">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* BAR CHART CARD */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-bold text-slate-800 text-lg">Form Pending at Candidate's end</h3>
                            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold py-1.5 px-3 rounded-lg outline-none cursor-pointer">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                            </select>
                        </div>

                        {/* MOCK CHART BARS */}
                        <div className="h-72 flex items-end justify-between px-4">
                            {[100, 90, 80, 70, 40, 50, 20].map((height, i) => (
                                <div key={i} className="flex flex-col items-center w-full gap-4">
                                    <div className="w-12 bg-[#F9F7FF] rounded-t-lg relative overflow-hidden group" style={{ height: `${height}%` }}>
                                        <div className="absolute bottom-0 w-full bg-[#5D4591] rounded-t-lg transition-all duration-500" style={{ height: '45%' }}></div>
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {height}
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{i + 1} Jan</span>
                                </div>
                            ))}
                        </div>
                        {/* CHART LEGEND */}
                        <div className="mt-8 flex items-center gap-6 px-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#5D4591]"></div>
                                <span className="text-xs font-bold text-slate-500">In Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#F0EDFF]"></div>
                                <span className="text-xs font-bold text-slate-500">Total Cases</span>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVITY FEED CARD */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-slate-800 text-lg">Activity feed</h3>
                            <MoreHorizontal size={20} className="text-slate-400 cursor-pointer" />
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Timeline Line */}
                            <div className="absolute left-[5px] top-2 bottom-2 w-[1.5px] bg-slate-100"></div>

                            {activities.map((item, idx) => (
                                <div key={idx} className="flex gap-5 relative">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 
                    ${idx === 0 ? 'bg-[#F9F7FF] ring-4 ring-[#5D4591]/10' : 'bg-slate-300'}`}>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-slate-600 leading-snug">
                                            {item.text} <span className="font-bold text-[#5D4591] cursor-pointer hover:underline">{item.name}</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Clock size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-3 text-sm font-bold text-[#5D4591] bg-[#F9F7FF]/50 hover:bg-[#F9F7FF] rounded-xl transition-colors">
                            View All Activity
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
