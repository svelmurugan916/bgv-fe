// src/components/dashboard/SummaryStatCardData.jsx

import {
    Activity, AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck, Timer,
    Inbox, PauseCircle, Users, // New icons for additional KPIs
    Briefcase, GraduationCap // For popover icons
} from "lucide-react";
import React from "react";
import StatCard from "../tenant-admin-dashboard/StatCard.jsx";

const SummaryStatCardData = ({dashboardData, isLoading, density}) => {

    // Helper to get icon component dynamically for popovers
    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'Briefcase': return <Briefcase size={12}/>;
            case 'GraduationCap': return <GraduationCap size={12}/>;
            default: return null;
        }
    };

    const renderBacklogAgePopover = () => (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Aging Breakdown</p>
            {dashboardData?.backlogAgeBreakdown?.map((item, i) => (
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
            {dashboardData?.docsBreakdown?.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <div className={`p-1 rounded ${item.bg} ${item.color}`}>
                            {getIconComponent(item.icon)} {/* Render icon component */}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-700">{item.count}</span>
                </div>
            ))}
        </div>
    );

    const renderChecksOnHoldPopover = () => (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Hold Reasons</p>
            {dashboardData?.checksOnHoldBreakdown?.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-50 text-slate-700">{item.count}</span>
                </div>
            ))}
        </div>
    );

    const renderChecksAwaitingReviewPopover = () => (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Review Types</p>
            {dashboardData?.checksAwaitingReviewBreakdown?.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-50 text-slate-700">{item.count}</span>
                </div>
            ))}
        </div>
    );


    return (
        // Adjusted grid to accommodate 7 cards: 4 in the first row, 3 in the second
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
            {/* 1. Total Checks In Progress */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Activity}
                label="Total Checks In Progress"
                value={dashboardData?.totalChecksInProgress?.toLocaleString()}
                infoText="Cumulative count of all individual background checks currently active and being processed across all candidates and types."
                subText={`${dashboardData?.totalChecksInProgressTrend?.value}% From last period`}
                trend={dashboardData?.totalChecksInProgressTrend?.value}
                trendType={dashboardData?.totalChecksInProgressTrend?.type}
                color="bg-blue-500"
            />

            {/* 2. Newly Assigned Checks (Unaccepted) */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Inbox}
                label="Newly Assigned Checks"
                value={dashboardData?.newlyAssignedChecks?.toLocaleString()}
                infoText="Count of checks that have been assigned to an operations user but have not yet been accepted or started. These require immediate attention."
                subText={`${dashboardData?.newlyAssignedChecksTrend?.value}% From last period`}
                trend={dashboardData?.newlyAssignedChecksTrend?.value}
                trendType={dashboardData?.newlyAssignedChecksTrend?.type}
                color="bg-purple-500"
            />

            {/* 3. SLA Breached Checks */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={AlertCircle}
                label="SLA Breached Checks"
                value={dashboardData?.slaBreachedChecks?.toLocaleString()}
                infoText="Number of individual checks that have already exceeded their defined Service Level Agreement (SLA) due date. Critical items requiring urgent intervention."
                subText={`${dashboardData?.slaBreachedChecksTrend?.value}% From last period`}
                trend={dashboardData?.slaBreachedChecksTrend?.value}
                trendType={dashboardData?.slaBreachedChecksTrend?.type}
                color="bg-rose-500"
            />

            {/* 4. SLA Approaching Breach */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={AlertTriangle}
                label="SLA Approaching Breach"
                value={dashboardData?.slaApproachingBreach?.toLocaleString()}
                infoText="Count of checks that are within a configurable threshold (e.g., next 24/48 hours) of breaching their Service Level Agreement. Proactive attention is needed to prevent breaches."
                subText={`${dashboardData?.slaApproachingBreachTrend?.value}% From last period`}
                trend={dashboardData?.slaApproachingBreachTrend?.value}
                trendType={dashboardData?.slaApproachingBreachTrend?.type}
                color="bg-amber-500"
            />

            {/* New row for the remaining 3 cards, maintaining grid consistency */}
            <div className="lg:col-span-4 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 5. Checks On Hold */}
                <StatCard
                    loading={isLoading}
                    density={density}
                    icon={PauseCircle}
                    label="Checks On Hold"
                    value={dashboardData?.checksOnHold?.toLocaleString()}
                    infoText="Number of checks currently paused due to external dependencies, such as waiting for candidate documents, third-party responses, or client clarifications."
                    subText={`${dashboardData?.checksOnHoldTrend?.value}% From last period`}
                    trend={dashboardData?.checksOnHoldTrend?.value}
                    trendType={dashboardData?.checksOnHoldTrend?.type}
                    color="bg-gray-500"
                    popoverContent={renderChecksOnHoldPopover()}
                />

                {/* 6. Checks Awaiting Review */}
                <StatCard
                    loading={isLoading}
                    density={density}
                    icon={CheckCircle2}
                    label="Checks Awaiting Review"
                    value={dashboardData?.checksAwaitingReview?.toLocaleString()}
                    infoText="Count of checks that have been completed by an operations user and are now awaiting a secondary review or final approval (e.g., QC, manager sign-off)."
                    subText={`${dashboardData?.checksAwaitingReviewTrend?.value}% From last period`}
                    trend={dashboardData?.checksAwaitingReviewTrend?.value}
                    trendType={dashboardData?.checksAwaitingReviewTrend?.type}
                    color="bg-emerald-500"
                    popoverContent={renderChecksAwaitingReviewPopover()}
                />

                {/* 7. Total Cases Active */}
                <StatCard
                    loading={isLoading}
                    density={density}
                    icon={Users}
                    label="Total Cases Active"
                    value={dashboardData?.totalActiveCases?.toLocaleString()}
                    infoText="The total count of unique candidate background verification cases that are currently open and being processed within the system."
                    subText="Overall System Workload"
                    color="bg-indigo-500"
                />
            </div>
        </div>
    )
}

export default SummaryStatCardData;
