// src/mockDashboardData.js

// Helper to format decimals
const formatDecimal = (val) => val != null ? val.toFixed(1) : "0.0";

// Helper to generate a random percentage change
const getRandomPercentageChange = () => {
    const change = (Math.random() * 10 - 5).toFixed(1); // -5.0 to +5.0
    const type = change >= 0 ? 'up' : 'down';
    return { value: Math.abs(parseFloat(change)), type: type };
};

// Helper to generate a random UUID-like string
const generateUuid = () => 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

// Helper to get random date within a range
const getRandomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Mock data for the dashboard
const mockDashboardData = {
    // --- SystemOverviewHeader Data ---
    totalActiveCases: 1250, // Total cases in the system
    inProgressCount: 780,
    insufficiencyCount: 150, // Cases waiting for candidate/client input
    pendingQcCount: 200,     // Cases completed by analyst, awaiting QC
    inReviewQcCount: 120,    // Cases currently in QC review
    healthScore: 88, // Calculated health score (0-100)

    // --- PriorityActionComponent Data ---
    pendingAssignment: 15,   // Newly assigned checks not yet accepted by an operator
    casesNearBreach: 7,      // Checks due within next 24-48 hours
    slaBreachedCount: 3,     // Checks already past SLA

    // --- SummaryStatCardData (Executive Summary KPIs) ---
    totalChecksInProgress: 2560, // Sum of all individual checks being worked on
    totalChecksInProgressTrend: getRandomPercentageChange(), // % change from last period

    newlyAssignedChecks: 15, // Same as pendingAssignment, but presented as a top-level KPI
    newlyAssignedChecksTrend: getRandomPercentageChange(),

    slaBreachedChecks: 3, // Same as slaBreachedCount, top-level KPI
    slaBreachedChecksTrend: getRandomPercentageChange(),

    slaApproachingBreach: 7, // Same as casesNearBreach, top-level KPI
    slaApproachingBreachTrend: getRandomPercentageChange(),

    checksOnHold: 85, // Checks paused due to external dependencies
    checksOnHoldTrend: getRandomPercentageChange(),
    checksOnHoldBreakdown: [ // For a potential popover
        { label: "Pending Candidate Documents", count: 40 },
        { label: "Awaiting Client Clarification", count: 25 },
        { label: "Third-Party Delay", count: 20 },
    ],

    checksAwaitingReview: 200, // Checks completed by ops, awaiting secondary review/approval
    checksAwaitingReviewTrend: getRandomPercentageChange(),
    checksAwaitingReviewBreakdown: [ // For a potential popover
        { label: "QC Review", count: 180 },
        { label: "Manager Approval", count: 20 },
    ],

    // --- Data for Popovers (from original AdminDashboard) ---
    slaCompliance: 92.5, // Overall SLA compliance percentage
    displaySlaCompliance: `92.5%`,
    avgTat: 3.5, // Average turnaround time in days
    displayAvgTat: `${formatDecimal(3.5)} Days`,
    pendingAge: 2.1, // Average age of pending cases
    displayPendingAge: `${formatDecimal(2.1)}d`,
    readyForQc: 180, // Cases ready for QC

    backlogAgeBreakdown: [
        { label: "0-3 Days", count: 120, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: "3-7 Days", count: 80, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: "7-14 Days", count: 40, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: "14+ Days", count: 16, color: 'text-rose-600', bg: 'bg-rose-50' }
    ],

    docsBreakdown: [
        { label: "Education Documents", count: 50, icon: 'GraduationCap', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: "Employment Proofs", count: 35, icon: 'Briefcase', color: 'text-blue-600', bg: 'bg-blue-50' }
    ],

    // --- NEW: Action Required / Critical Alerts Lists ---
    myNewAssignments: [
        {
            id: generateUuid(),
            candidateName: "Alice Johnson",
            checkType: "Employment Verification",
            dateTimeAssigned: "2026-03-14 10:30 AM",
            client: "Global Corp",
            dueDate: getRandomDate(new Date(), new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 0-5 days from now
            status: "New",
            actionLabel: "Accept",
            actionRoute: `/checks/${generateUuid()}/accept`
        },
        {
            id: generateUuid(),
            candidateName: "Bob Williams",
            checkType: "Address Verification",
            dateTimeAssigned: "2026-03-14 09:15 AM",
            client: "Tech Solutions",
            dueDate: getRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
            status: "New",
            actionLabel: "Accept",
            actionRoute: `/checks/${generateUuid()}/accept`
        },
        {
            id: generateUuid(),
            candidateName: "Charlie Brown",
            checkType: "Criminal Record Check",
            dateTimeAssigned: "2026-03-13 04:00 PM",
            client: "Innovate Inc.",
            dueDate: getRandomDate(new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
            status: "New",
            actionLabel: "Accept",
            actionRoute: `/checks/${generateUuid()}/accept`
        },
    ],

    slaBreachedChecksList: [
        {
            id: generateUuid(),
            candidateName: "David Lee",
            checkType: "Education Verification",
            originalDueDate: getRandomDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5-10 days ago
            daysOverdue: 7,
            assignedTo: "Jane Doe",
            client: "Global Corp",
            status: "SLA Breached",
            actionLabel: "Investigate",
            actionRoute: `/checks/${generateUuid()}/investigate`
        },
        {
            id: generateUuid(),
            candidateName: "Eve Davis",
            checkType: "Reference Check",
            originalDueDate: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
            daysOverdue: 4,
            assignedTo: "Self",
            client: "Tech Solutions",
            status: "SLA Breached",
            actionLabel: "Investigate",
            actionRoute: `/checks/${generateUuid()}/investigate`
        },
    ],

    slaApproachingChecksList: [
        {
            id: generateUuid(),
            candidateName: "Frank Green",
            checkType: "Employment Verification",
            dueDate: getRandomDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // 1-2 days from now
            timeRemaining: "28h",
            assignedTo: "Self",
            client: "Innovate Inc.",
            status: "In Progress",
            actionLabel: "Prioritize",
            actionRoute: `/checks/${generateUuid()}/prioritize`
        },
        {
            id: generateUuid(),
            candidateName: "Grace Hall",
            checkType: "Address Verification",
            dueDate: getRandomDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
            timeRemaining: "40h",
            assignedTo: "John Smith",
            client: "Global Corp",
            status: "Pending Candidate",
            actionLabel: "Follow-up",
            actionRoute: `/checks/${generateUuid()}/followup`
        },
    ],

    checksPendingMyActionList: [
        {
            id: generateUuid(),
            candidateName: "Heidi King",
            checkType: "Criminal Record Check",
            currentStatus: "Awaiting Analyst Review",
            lastUpdated: "2026-03-13 02:00 PM",
            client: "Global Corp",
            actionLabel: "Review",
            actionRoute: `/checks/${generateUuid()}/review`
        },
        {
            id: generateUuid(),
            candidateName: "Ivan Lopez",
            checkType: "Database Check",
            currentStatus: "Pending Update",
            lastUpdated: "2026-03-12 11:00 AM",
            client: "Tech Solutions",
            actionLabel: "Update",
            actionRoute: `/checks/${generateUuid()}/update`
        },
    ],

    failedAutomatedChecksList: [
        {
            id: generateUuid(),
            candidateName: "Julia Miller",
            checkType: "Database Check (Sanctions)",
            failureReason: "API Timeout",
            dateTimeOfFailure: "2026-03-14 08:00 AM",
            client: "Innovate Inc.",
            actionLabel: "Investigate",
            actionRoute: `/checks/${generateUuid()}/investigate`
        },
        {
            id: generateUuid(),
            candidateName: "Kevin Nunez",
            checkType: "Address Geocoding",
            failureReason: "Invalid Address Format",
            dateTimeOfFailure: "2026-03-13 10:00 AM",
            client: "Global Corp",
            actionLabel: "Correct",
            actionRoute: `/checks/${generateUuid()}/correct`
        },
    ],

    myActiveWorkloadList: [
        {
            id: generateUuid(),
            candidateName: "Liam Owen",
            checkType: "Employment Verification",
            currentStatus: "Collecting Data",
            dueDate: getRandomDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
            timeRemainingOrOverdue: "7d 5h",
            lastUpdated: "2026-03-14 03:00 PM",
            client: "Tech Solutions",
            actionLabel: "View Details",
            actionRoute: `/checks/${generateUuid()}/details`
        },
        {
            id: generateUuid(),
            candidateName: "Mia Patel",
            checkType: "Education Verification",
            currentStatus: "Pending Third-Party",
            dueDate: getRandomDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
            timeRemainingOrOverdue: "4d 12h",
            lastUpdated: "2026-03-13 09:00 AM",
            client: "Innovate Inc.",
            actionLabel: "View Details",
            actionRoute: `/checks/${generateUuid()}/details`
        },
        {
            id: generateUuid(),
            candidateName: "Noah Quinn",
            checkType: "Criminal Record Check",
            currentStatus: "Reviewing Findings",
            dueDate: getRandomDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
            timeRemainingOrOverdue: "1d 3h",
            lastUpdated: "2026-03-14 04:00 PM",
            client: "Global Corp",
            actionLabel: "View Details",
            actionRoute: `/checks/${generateUuid()}/details`
        },
        {
            id: generateUuid(),
            candidateName: "Olivia Reed",
            checkType: "Address Verification",
            currentStatus: "Data Extraction Failed",
            dueDate: getRandomDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
            timeRemainingOrOverdue: "2d Overdue",
            lastUpdated: "2026-03-12 01:00 PM",
            client: "Tech Solutions",
            actionLabel: "View Details",
            actionRoute: `/checks/${generateUuid()}/details`
        },
    ],

    // --- Other data for future rounds ---
    performanceTrendData: [], // Placeholder
    throughputMetrics: { currentThroughput: 500, trendPercentage: 3.2, efficiency: 85 }, // Placeholder
    bottleneckItems: [], // Placeholder
    riskDistribution: [], // Placeholder
    portfolioHealthData: [], // Placeholder
};

export default mockDashboardData;
