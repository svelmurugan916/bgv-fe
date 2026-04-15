// src/components/dashboard/OperationsDashboard.jsx

import React, {useState, useEffect, useRef} from 'react';
import {
    LayoutDashboard, Maximize2, GraduationCap, Briefcase,
    Activity, AlertCircle, AlertTriangle, Inbox, PauseCircle, CheckCircle2, Users,
    Search, Clock, ArrowRightIcon, SearchIcon
} from 'lucide-react'; // Added more icons for ActionableCheckList
// import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
// import { METHOD } from "../../../constant/ApplicationConstant.js";
// import { GET_SYSTEM_OVERVIEW_DETAILS } from "../../../constant/Endpoint.tsx";

import SummaryStatCardData from "./SummaryStatCardData.jsx";
import ActionableCheckList from "./ActionableCheckList.jsx";
import mockDashboardData from "./mockDashboardData.js";
import PriorityActionComponent from "../tenant-admin-dashboard/PriorityActionComponent.jsx";
import SystemOverviewHeader from "../tenant-admin-dashboard/SystemOverviewHeader.jsx"; // NEW: Import ActionableCheckList

const OperationsDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [density, setDensity] = useState('comfortable');
    const [dashboardData, setDashboardData] = useState(null);
    // const { authenticatedRequest } = useAuthApi();
    const initCompRef = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDashboardData(mockDashboardData);
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Helper for action button clicks (e.g., navigate)
    const handleActionClick = (item, route) => {
        console.log(`Action for ${item.candidateName} (${item.checkType}): Navigating to ${route}`);
        // In a real app, you would use useNavigate here:
        // navigate(route);
        alert(`Simulating action for ${item.candidateName} (${item.checkType}). Route: ${route}`);
    };

    return (
        <div className={`bg-[#F8F9FB] min-h-screen font-sans text-slate-800 transition-all duration-500 ${density === 'compact' ? 'p-4' : 'p-8'}`}>

            {/* 1. Header Section */}
            <header className="flex justify-between items-end mb-8">
                <SystemOverviewHeader dashboardData={dashboardData} isLoading={isLoading}/>

                <div className="flex gap-3">
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm mr-2">
                        <button onClick={() => setDensity('comfortable')} className={`p-2 rounded-lg transition-all ${density === 'comfortable' ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutDashboard size={16} /></button>
                        <button onClick={() => setDensity('compact')} className={`p-2 rounded-lg transition-all ${density === 'compact' ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><Maximize2 size={16} /></button>
                    </div>
                </div>
            </header>

            {/* 2. PRIORITY ACTION CENTER */}
            <PriorityActionComponent
                isLoading={isLoading}
                pendingAssignment={dashboardData?.pendingAssignment}
                casesNearBreach={dashboardData?.casesNearBreach}
                casesBreached={dashboardData?.slaBreachedCount}
            />

            {/* 3. CONSOLIDATED KPI GRID */}
            <SummaryStatCardData dashboardData={dashboardData} isLoading={isLoading} density={density} />

            {/* NEW SECTION: CRITICAL ACTIONS & WORKLOAD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* My New Assignments (lg:col-span-1) */}
                <ActionableCheckList
                    title="My New Assignments"
                    icon={Inbox}
                    data={dashboardData?.myNewAssignments}
                    isLoading={isLoading}
                    emptyMessage="No new checks assigned to you."
                    listType="new"
                    columns={[
                        { key: 'candidateName', header: 'Candidate' },
                        { key: 'checkType', header: 'Check Type' },
                        { key: 'dueDate', header: 'Due Date' },
                    ]}
                    actions={[
                        {
                            label: "Accept",
                            icon: CheckCircle2,
                            onClick: (item) => handleActionClick(item, item.actionRoute),
                            buttonClass: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }
                    ]}
                />

                {/* SLA Breached Checks (lg:col-span-1) */}
                <ActionableCheckList
                    title="SLA Breached Checks"
                    icon={AlertCircle}
                    data={dashboardData?.slaBreachedChecksList}
                    isLoading={isLoading}
                    emptyMessage="No checks have breached SLA. Keep up the good work!"
                    listType="breached"
                    columns={[
                        { key: 'candidateName', header: 'Candidate' },
                        { key: 'checkType', header: 'Check Type' },
                        { key: 'daysOverdue', header: 'Overdue By', render: (item) => `${item.daysOverdue} days` },
                    ]}
                    actions={[
                        {
                            label: "Investigate",
                            icon: Search,
                            onClick: (item) => handleActionClick(item, item.actionRoute),
                            buttonClass: "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }
                    ]}
                />

                {/* SLA Approaching Checks (lg:col-span-1) */}
                <ActionableCheckList
                    title="SLA Approaching"
                    icon={AlertTriangle}
                    data={dashboardData?.slaApproachingChecksList}
                    isLoading={isLoading}
                    emptyMessage="No checks are nearing SLA breach."
                    listType="approaching"
                    columns={[
                        { key: 'candidateName', header: 'Candidate' },
                        { key: 'checkType', header: 'Check Type' },
                        { key: 'timeRemaining', header: 'Time Left' },
                    ]}
                    actions={[
                        {
                            label: "Prioritize",
                            icon: Activity,
                            onClick: (item) => handleActionClick(item, item.actionRoute),
                            buttonClass: "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        }
                    ]}
                />

                {/* Checks Pending My Action (lg:col-span-2) */}
                <div className="lg:col-span-2">
                    <ActionableCheckList
                        title="Checks Pending My Action"
                        icon={Clock}
                        data={dashboardData?.checksPendingMyActionList}
                        isLoading={isLoading}
                        emptyMessage="No checks currently pending your specific action."
                        listType="pending"
                        columns={[
                            { key: 'candidateName', header: 'Candidate' },
                            { key: 'checkType', header: 'Check Type' },
                            { key: 'currentStatus', header: 'Current Status' },
                            { key: 'lastUpdated', header: 'Last Update' },
                        ]}
                        actions={[
                            {
                                label: "Resolve",
                                icon: ArrowRightIcon,
                                onClick: (item) => handleActionClick(item, item.actionRoute),
                                buttonClass: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            }
                        ]}
                    />
                </div>


                {/* My Active Workload (lg:col-span-1) */}
                <ActionableCheckList
                    title="My Active Workload"
                    icon={Activity}
                    data={dashboardData?.myActiveWorkloadList}
                    isLoading={isLoading}
                    emptyMessage="You currently have no active checks."
                    listType="active"
                    columns={[
                        { key: 'candidateName', header: 'Candidate' },
                        { key: 'checkType', header: 'Check Type' },
                        { key: 'currentStatus', header: 'Status' },
                        { key: 'timeRemainingOrOverdue', header: 'Due / Overdue' },
                    ]}
                    actions={[
                        {
                            label: "View",
                            icon: ArrowRightIcon,
                            onClick: (item) => handleActionClick(item, item.actionRoute),
                            buttonClass: "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }
                    ]}
                />

                {/* Failed Automated Checks (lg:col-span-2, if placed here) */}
                {/* This could also be a separate row or combined with other lists if space is tight */}
                <div className="lg:col-span-2">
                    <ActionableCheckList
                        title="Failed Automated Checks"
                        icon={AlertCircle}
                        data={dashboardData?.failedAutomatedChecksList}
                        isLoading={isLoading}
                        emptyMessage="No automated checks failed recently."
                        listType="failed"
                        columns={[
                            { key: 'candidateName', header: 'Candidate' },
                            { key: 'checkType', header: 'Check Type' },
                            { key: 'failureReason', header: 'Failure Reason' },
                            { key: 'dateTimeOfFailure', header: 'Failure Time' },
                        ]}
                        actions={[
                            {
                                label: "Investigate",
                                icon: SearchIcon,
                                onClick: (item) => handleActionClick(item, item.actionRoute),
                                buttonClass: "bg-orange-50 text-orange-600 hover:bg-orange-100"
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;
