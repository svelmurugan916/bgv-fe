import StatCard from "./StatCard.jsx";
import {Activity, AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck, Timer} from "lucide-react";
import React from "react";

const SummaryStatCardData = ({dashboardData, isLoading, density}) => {
    const renderBacklogAgePopover = () => (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Aging Breakdown</p>
            {dashboardData?.backlogAgeBreakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.bg} ${item.color}`}>{item.count}</span>
                </div>
            ))}
        </div>
    );

    const renderDocsPopover = () => (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Document Types</p>
            {dashboardData?.docsBreakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <div className={`p-1 rounded ${item.bg} ${item.color}`}>{item.icon}</div>
                        <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-700">{item.count}</span>
                </div>
            ))}
        </div>
    );
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. SLA Compliance */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={dashboardData?.slaBreachedCount > 0 ? AlertTriangle : ShieldCheck}
                label="SLA Compliance"
                value={dashboardData?.displaySlaCompliance}
                infoText="Percentage of cases meeting contract deadlines. A breach occurs when a case exceeds its allotted processing time."
                subText={
                    dashboardData?.slaBreachedCount > 0 ? (
                        <span className="flex items-center gap-1.5 text-rose-600 font-black bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 animate-pulse">
                    <AlertCircle size={12} strokeWidth={3} />
                            {dashboardData.slaBreachedCount} Breaches
                </span>
                    ) : (
                        <span className="text-slate-400">0 Breaches</span>
                    )
                }
                color={dashboardData?.slaBreachedCount > 0 ? "bg-rose-500" : "bg-emerald-500"}
            />

            {/* 2. Active Backlog */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Activity}
                label="Active Backlog"
                value={((dashboardData?.pendingAssignment || 0) + (dashboardData?.pendingDocs || 0)).toLocaleString()}
                infoText="Total workload requiring action. Calculated as the sum of unassigned checks and cases currently stalled due to missing candidate documentation."
                subText={`${dashboardData?.pendingAssignment} Assign | ${dashboardData?.pendingDocs} Docs`}
                color="bg-orange-500"
                popoverContent={renderDocsPopover()}
            />

            {/* 3. Avg. Turnaround */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Timer}
                label="Avg. Turnaround"
                value={dashboardData?.displayAvgTat}
                infoText="Average days to complete a case. Backlog Age represents the average time active cases have been in the system without completion."
                subText={`Backlog Age: ${dashboardData?.displayPendingAge}`}
                color="bg-indigo-500"
                popoverContent={renderBacklogAgePopover()}
            />

            {/* 4. Quality Control */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={CheckCircle2}
                label="Quality Control"
                value={dashboardData?.readyForQc}
                infoText="The final stage of the workflow. These cases have finished verification and are awaiting a final accuracy audit before the report is sent."
                subText="Ready for Final Review"
                color="bg-purple-500"
            />
        </div>
    )
}

export default SummaryStatCardData;