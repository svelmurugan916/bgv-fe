import {useState} from "react";
import {
    AlertCircle, Search,
    Clock, Activity,
} from 'lucide-react';

const SystemOverviewHeader = ({ dashboardData, isLoading }) => {
    const [isHovered, setIsHovered] = useState(false);

    const breakdown = [
        {
            label: 'In Progress',
            count: dashboardData?.inProgressCount || 0,
            icon: <Activity size={14}/>,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Insufficiency',
            count: dashboardData?.insufficiencyCount || 0,
            icon: <AlertCircle size={14}/>,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            label: 'Pending QC',
            count: dashboardData?.pendingQcCount || 0,
            icon: <Clock size={14}/>,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            label: 'In Review',
            count: dashboardData?.inReviewQcCount || 0,
            icon: <Search size={14}/>,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
    ];

    const getHealthColor = (score) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 70) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    const getHealthStatus = (score) => {
        if (score >= 90) return 'Optimal';
        if (score >= 70) return 'Stable';
        return 'Critical';
    };

    const healthScore = dashboardData?.healthScore || 0;

    return (
        <div className="relative mb-8">
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">System Overview</h1>

                <div
                    className="relative cursor-help"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Badge Loading State */}
                    {isLoading ? (
                        <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-lg" />
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 transition-all hover:bg-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                Live Operations • {dashboardData?.totalActiveCases?.toLocaleString()} Total Active
                            </span>
                        </div>
                    )}

                    {isHovered && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Workload</span>
                                {!isLoading && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>}
                            </div>

                            <div className="space-y-2">
                                {isLoading ? (
                                    // Tooltip Loading Skeletons
                                    [1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-slate-200 animate-pulse rounded-md" />
                                                <div className="w-20 h-3 bg-slate-200 animate-pulse rounded" />
                                            </div>
                                            <div className="w-8 h-4 bg-slate-200 animate-pulse rounded" />
                                        </div>
                                    ))
                                ) : (
                                    breakdown.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-md ${item.bg} ${item.color}`}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-md">
                                                {item.count.toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Health Section */}
                            <div className="mt-4 pt-3 border-t border-slate-50">
                                {isLoading ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><div className="w-24 h-2 bg-slate-50 animate-pulse rounded" /><div className="w-12 h-2 bg-slate-50 animate-pulse rounded" /></div>
                                        <div className="w-full h-1.5 bg-slate-50 animate-pulse rounded-full" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between text-[10px] mb-1.5">
                                            <span className="text-slate-400 font-medium uppercase tracking-tighter">Operational Health</span>
                                            <span className={`font-bold ${getHealthColor(healthScore).replace('bg-', 'text-')}`}>
                                                {getHealthStatus(healthScore)} ({healthScore}%)
                                            </span>
                                        </div>

                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                                            <div
                                                className={`h-full ${getHealthColor(healthScore)} rounded-full transition-all duration-700 ease-out`}
                                                style={{ width: `${healthScore}%` }}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Static Explanation Section (No loader needed as it's static info) */}
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 mt-3">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Score Components</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[9px]">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-slate-500 font-bold">SLA Compliance</span>
                                            </div>
                                            <span className="text-slate-900 font-black">50% Weight</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px]">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-slate-500 font-bold">Case Aging</span>
                                            </div>
                                            <span className="text-slate-900 font-black">30% Weight</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px]">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-slate-500 font-bold">Process Fluidity</span>
                                            </div>
                                            <span className="text-slate-900 font-black">20% Weight</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-sm text-slate-400 font-medium italic">Operational intelligence for verification lifecycles.</p>
        </div>
    );
};

export default SystemOverviewHeader;
