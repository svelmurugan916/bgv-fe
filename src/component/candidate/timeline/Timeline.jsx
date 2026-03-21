import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    UserPlus, FolderOpen, CheckCircle, XCircle, Hourglass, RotateCw,
    AlertCircle, ClipboardCheck, AlertTriangle, UserCheck, ShieldCheck,
    GraduationCap, Briefcase, MapPin, Database, Users, Package,
    Info as InfoIcon, Clock as ClockIcon, FingerprintPattern, ClipboardClock, Clock // Added InfoIcon and ClockIcon
} from 'lucide-react';
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {GET_TIMELINE_DATA} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import TimelineSkeleton from "./TimelineSkeleton.jsx";

// --- CONFIGURATION ---
const SLA_THRESHOLD_HOURS = 5 * 24; // Define what constitutes a "critical" duration for visual emphasis

// --- MOCK CANDIDATE DATA (from previous context) ---
const MOCK_CANDIDATE_DATA = {
    candidateId: 'TU4ILZ0W',
    candidateName: 'VelMurugan S',

    consolidatedData: {
        status: 'IN_PROGRESS',
        invitedAt: '2026-02-27T10:00:00Z',
        createdAt: '2026-02-27T14:30:00Z',
        completedAt: null,
    },

    caseDetails: {
        checks: [
            {
                taskId: 'addr1',
                taskName: 'address',
                displayName: 'Permanent Address',
                status: 'CLEARED',
                createdAt: '2026-02-27T14:35:00Z',
                completedAt: '2026-02-27T15:00:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T14:35:00Z', assignee: 'John Doe', reason: 'Initial assignment to John Doe.' },
                    { status: 'REASSIGNED', timestamp: '2026-02-27T14:45:00Z', assignee: 'Vel Murugan', reason: 'Reassigned due to workload balancing.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-27T14:40:00Z', reason: 'Verification started.' }, // Added to show duration to cleared
                    { status: 'CLEARED', timestamp: '2026-02-27T15:00:00Z', reason: 'Address confirmed via database.' },
                ]
            },
            {
                taskId: 'crim1',
                taskName: 'criminal',
                displayName: 'Criminal Record Check',
                status: 'IN_PROGRESS',
                createdAt: '2026-02-27T14:40:00Z',
                completedAt: null,
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T14:40:00Z', assignee: 'Jane Smith', reason: 'Initial assignment to Jane Smith.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T09:00:00Z', reason: 'Initiated background check with local authorities.' }, // Still in progress
                ]
            },
            {
                taskId: 'db1',
                taskName: 'database',
                displayName: 'Global Database Check',
                status: 'FAILED',
                createdAt: '2026-02-27T14:45:00Z',
                completedAt: '2026-02-28T10:30:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T14:45:00Z', assignee: 'John Doe', reason: 'Assigned for global database check.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T09:30:00Z', reason: 'Database query initiated.' },
                    { status: 'FAILED', timestamp: '2026-02-28T10:30:00Z', reason: 'Found a discrepancy in international records.' },
                ]
            },
            {
                taskId: 'edu1',
                taskName: 'education',
                displayName: 'SSLC Verification',
                status: 'INSUFFICIENCY',
                createdAt: '2026-02-27T14:50:00Z',
                completedAt: null,
                description: "sjkjdnfksdhf", // Existing description
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T14:50:00Z', assignee: 'Jane Smith', reason: 'Assigned for SSLC verification.' },
                    { status: 'INSUFFICIENCY', timestamp: '2026-02-28T11:00:00Z', description: "sjkjdnfksdhf", reason: 'Candidate did not provide correct year of passing.' },
                    { status: 'INSUFFICIENCY_CLEARED', timestamp: '2026-02-28T11:15:00Z', reason: 'Candidate provided updated documents.' },
                ]
            },
            {
                taskId: 'edu2',
                taskName: 'education',
                displayName: 'HSC Verification',
                status: 'IN_PROGRESS',
                createdAt: '2026-02-27T14:55:00Z',
                completedAt: null,
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T14:55:00Z', assignee: 'John Doe', reason: 'Assigned for HSC verification.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T11:30:00Z', reason: 'Awaiting response from board.' },
                ]
            },
            {
                taskId: 'edu3',
                taskName: 'education',
                displayName: 'Undergraduate Degree',
                status: 'CLEARED',
                createdAt: '2026-02-27T15:00:00Z',
                completedAt: '2026-02-28T12:00:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:00:00Z', assignee: 'Jane Smith', reason: 'Assigned for degree verification.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T11:00:00Z', reason: 'University contacted.' },
                    { status: 'CLEARED', timestamp: '2026-02-28T12:00:00Z', reason: 'Degree verified successfully.' },
                ]
            },
            {
                taskId: 'emp1',
                taskName: 'employment',
                displayName: 'Amphisoft Employment',
                status: 'NEEDS_REVIEW',
                createdAt: '2026-02-27T15:05:00Z',
                completedAt: null,
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:05:00Z', assignee: 'John Doe', reason: 'Assigned for employment check.' },
                    { status: 'NEEDS_REVIEW', timestamp: '2026-02-28T13:00:00Z', reason: 'Discrepancy found in joining date, requires manual review.' }, // Needs review
                ]
            },
            {
                taskId: 'emp2',
                taskName: 'employment',
                displayName: 'Innova Solutions Employment',
                status: 'CLEARED',
                createdAt: '2026-02-27T15:10:00Z',
                completedAt: '2026-02-28T14:00:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:10:00Z', assignee: 'Jane Smith', reason: 'Assigned for Innova employment check.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T13:30:00Z', reason: 'Contacted HR for verification.' },
                    { status: 'CLEARED', timestamp: '2026-02-28T14:00:00Z', reason: 'Employment confirmed.' },
                ]
            },
            {
                taskId: 'emp3',
                taskName: 'employment',
                displayName: 'HTC Global Employment',
                status: 'UNABLE_TO_VERIFY',
                createdAt: '2026-02-27T15:15:00Z',
                completedAt: '2026-02-28T15:00:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:15:00Z', assignee: 'John Doe', reason: 'Assigned for HTC employment check.' },
                    { status: 'UNABLE_TO_VERIFY', timestamp: '2026-02-28T15:00:00Z', reason: 'Company no longer exists, verification impossible.' },
                ]
            },
            {
                taskId: 'id1',
                taskName: 'identity',
                displayName: 'Aadhaar Card',
                status: 'CLEARED',
                createdAt: '2026-02-27T15:20:00Z',
                completedAt: '2026-02-28T16:00:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:20:00Z', assignee: 'Jane Smith', reason: 'Assigned for Aadhaar verification.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T15:30:00Z', reason: 'Submitted to government portal.' },
                    { status: 'CLEARED', timestamp: '2026-02-28T16:00:00Z', reason: 'Aadhaar details matched.' },
                ]
            },
            {
                taskId: 'id2',
                taskName: 'identity',
                displayName: 'PAN Card',
                status: 'IN_PROGRESS',
                createdAt: '2026-02-27T15:25:00Z',
                completedAt: null,
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:25:00Z', assignee: 'John Doe', reason: 'Assigned for PAN verification.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T17:00:00Z', reason: 'Waiting for NSDL response.' },
                ]
            },
            {
                taskId: 'ref1',
                taskName: 'reference',
                displayName: 'Priya K (Manager)',
                status: 'IN_PROGRESS',
                createdAt: '2026-02-27T15:30:00Z',
                completedAt: null,
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:30:00Z', assignee: 'Jane Smith', reason: 'Assigned for reference check with Priya K.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T17:30:00Z', reason: 'Attempted to contact reference.' },
                ]
            },
            {
                taskId: 'ref2',
                taskName: 'reference',
                displayName: 'Raghuram (Colleague)',
                status: 'CLEARED',
                createdAt: '2026-02-27T15:35:00Z',
                completedAt: '2026-02-28T18:00:00Z',
                history: [
                    { status: 'ASSIGNED', timestamp: '2026-02-27T15:35:00Z', assignee: 'John Doe', reason: 'Assigned for reference check with Raghuram.' },
                    { status: 'IN_PROGRESS', timestamp: '2026-02-28T17:30:00Z', reason: 'Interview with reference completed.' },
                    { status: 'CLEARED', timestamp: '2026-02-28T18:00:00Z', reason: 'Reference check positive.' },
                ]
            },
        ]
    }
};

// --- HELPER FUNCTIONS ---

// Centralized status color mapping for text classes
const getStatusColorClass = (status) => {
    switch (status) {
        case 'CLEARED':
        case 'INSUFFICIENCY_CLEARED':
        case 'case-completed': return 'text-emerald-500';
        case 'INSUFFICIENCY':
        case 'LINK_SENT': return 'text-orange-500';
        case 'FAILED':
        case 'case-stopped': return 'text-red-500';
        case 'NEEDS_REVIEW': return 'text-violet-500';
        case 'IN_PROGRESS':
        case 'ASSIGNED':
        case 'candidate-invited':
        case 'case-created': return 'text-blue-500';
        case 'UNABLE_TO_VERIFY': return 'text-amber-400';
        case 'REASSIGNED': return 'text-purple-500';
        default: return 'text-slate-500';
    }
};

// Status color mapping for card backgrounds
const getStatusCardBgClass = (status) => {
    switch (status) {
        case 'CLEARED':
        case 'INSUFFICIENCY_CLEARED':
        case 'case-completed': return 'bg-emerald-50';
        case 'INSUFFICIENCY':
        case 'LINK_SENT': return 'bg-orange-50';
        case 'FAILED':
        case 'case-stopped': return 'bg-red-50';
        case 'NEEDS_REVIEW': return 'bg-violet-50';
        case 'IN_PROGRESS':
        case 'ASSIGNED':
        case 'candidate-invited':
        case 'case-created': return 'bg-blue-50';
        case 'UNABLE_TO_VERIFY': return 'bg-amber-50';
        case 'REASSIGNED': return 'bg-purple-50';
        default: return 'bg-gray-50';
    }
};

// Status color mapping for card borders
const getStatusCardBorderClass = (status) => {
    switch (status) {
        case 'CLEARED':
        case 'INSUFFICIENCY_CLEARED':
        case 'case-completed': return 'border-emerald-200';
        case 'INSUFFICIENCY':
        case 'LINK_SENT': return 'border-orange-200';
        case 'FAILED':
        case 'case-stopped': return 'border-red-200';
        case 'NEEDS_REVIEW': return 'border-violet-200';
        case 'IN_PROGRESS':
        case 'ASSIGNED':
        case 'candidate-invited':
        case 'case-created': return 'border-blue-200';
        case 'UNABLE_TO_VERIFY': return 'border-amber-200';
        case 'REASSIGNED': return 'border-purple-200';
        default: return 'border-slate-200';
    }
};

// Maps taskName to a Lucide icon component
const getTaskIcon = (taskName) => {
    switch (taskName?.toLowerCase()) {
        case 'unassigned': return UserPlus;
        case 'id':
        case 'identity': return FingerprintPattern;
        case 'criminal': return ShieldCheck;
        case 'education': return GraduationCap;
        case 'employment':
        case 'experience': return Briefcase;
        case 'address': return MapPin;
        case 'db check':
        case 'database': return Database;
        case 'reference':
        case 'reference check': return Users;
        default: return Package;
    }
};

// Provides full category name for display
const getCategoryName = (taskName) => {
    switch (taskName) {
        case 'address': return 'Address';
        case 'education': return 'Education';
        case 'employment': return 'Employment';
        case 'identity': return 'Identity';
        case 'reference': return 'References';
        case 'database': return 'Database';
        case 'criminal': return 'Criminal';
        default: return taskName;
    }
};

// Icons for case-level and check-level events in the timeline
const getTimelineEventIcon = (eventType, checkStatus, taskName) => {
    if (eventType === 'candidate-invited') return UserPlus;
    if (eventType === 'case-created') return FolderOpen;
    if (eventType === 'case-completed') return CheckCircle;
    if (eventType === 'case-stopped') return XCircle;

    switch (checkStatus) {
        case 'ASSIGNED': return UserCheck;
        case 'IN_PROGRESS': return Clock;
        case 'REASSIGNED': return RotateCw;
        case 'INSUFFICIENCY': case 'LINK_SENT': return AlertCircle;
        case 'INSUFFICIENCY_CLEARED': return ClipboardCheck;
        case 'CLEARED': return CheckCircle;
        case 'FAILED': return XCircle;
        case 'UNABLE_TO_VERIFY': return AlertTriangle;
        case 'COMPLETED': return CheckCircle;
        default: return getTaskIcon(taskName) || Package;
    }
};

// Formats duration between two timestamps
const formatDuration = (start, end) => {
    if (!start || !end || end.getTime() < start.getTime()) return 'N/A';
    const diffMs = end.getTime() - start.getTime();

    if (diffMs < 1000) return 'Less than a second';

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`);
    // Only add seconds if it's the smallest unit and nothing else is present, or if it's very short
    if (parts.length === 0 && seconds > 0) parts.push(`${seconds % 60} second${seconds % 60 > 1 ? 's' : ''}`);
    if (parts.length === 0) return 'Less than a minute'; // Catch cases like 30 seconds

    return parts.join(', ');
};

const formatHourDuration = (hours) => {
    const parts = [];
    const days = Math.floor(hours / 24);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`);
    return parts.join(', ');
}

// Helper to parse duration string like "X days, Y hours" into milliseconds
function parseDurationToMs(durationString) {
    if (!durationString || durationString.includes("N/A") || durationString.includes("Still")) return 0;
    let totalMs = 0;
    const parts = durationString.split(', ');
    parts.forEach(part => {
        const [value, unit] = part.split(' ');
        const num = parseInt(value);
        if (unit.startsWith('day')) totalMs += num * 24 * 60 * 60 * 1000;
        else if (unit.startsWith('hour')) totalMs += num * 60 * 60 * 1000;
        else if (unit.startsWith('minute')) totalMs += num * 60 * 1000;
        else if (unit.startsWith('second')) totalMs += num * 1000;
    });
    return totalMs;
}

// --- GENERATE CASE TIMELINE EVENTS ---
const generateCaseTimelineEvents = (caseDetails, consolidatedData) => {
    const events = [];

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return {
            month: date.toLocaleString('en-US', { month: 'short' }),
            day: date.getDate().toString().padStart(2, '0'),
            year: date.getFullYear().toString(),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
    };

    // --- 1. Process Check Histories to calculate accurate durationInStatus ---
    const processedCheckEvents = {};
    caseDetails?.checks?.forEach(check => {
        const sortedHistory = [...check.history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        processedCheckEvents[check.taskId] = sortedHistory.map((historyEvent, index) => {
            const statusStartTime = new Date(historyEvent.timestamp);
            let durationInStatus = null;

            historyEvent.displayName = check?.displayName;
            historyEvent.taskName = check?.taskName;
            if (index === 0) {
                // First event for this check, no prior status for this check
                durationInStatus = null;
            } else {
                // Duration from previous status change for THIS check to current event
                const previousStatusTime = new Date(sortedHistory[index - 1].timestamp);
                durationInStatus = formatDuration(previousStatusTime, statusStartTime);
            }

            // If this is the last event for this check and it's an active status, calculate until now
            const isActiveStatus = ['IN_PROGRESS', 'NEEDS_REVIEW', 'INSUFFICIENCY', 'ASSIGNED', 'REASSIGNED'].includes(historyEvent.status);
            if (index === sortedHistory.length - 1 && isActiveStatus) {
                durationInStatus = `Still in status for ${formatDuration(statusStartTime, new Date())}`;
            }

            return { ...historyEvent, durationInStatus };
        });
    });

    // --- 2. Add Case-level events ---
    const candidateInvitedTime = consolidatedData?.invitedAt ? new Date(consolidatedData.invitedAt) : null;
    const caseCreatedTime = consolidatedData?.createdAt ? new Date(consolidatedData.createdAt) : null;

    if (candidateInvitedTime) {
        let invitedDurationText = null;
        if (caseCreatedTime) {
            invitedDurationText = `Time until Case Created: ${formatDuration(candidateInvitedTime, caseCreatedTime)}`;
        } else {
            invitedDurationText = `Still awaiting Case Creation for ${formatDuration(candidateInvitedTime, new Date())}`;
        }

        events.push({
            id: 'candidate-invited',
            title: 'Candidate Invited',
            baseDescription: 'Invitation to submit details sent.',
            date: formatDate(candidateInvitedTime),
            timestamp: candidateInvitedTime,
            type: 'case',
            status: 'candidate-invited',
            iconComponent: getTimelineEventIcon('candidate-invited'),
            iconColorClass: getStatusColorClass('candidate-invited'),
            durationInStatus: invitedDurationText,
            taskId: null // Case-level event, no specific taskId
        });
    }

    if (caseCreatedTime) {
        let firstAssignedTime = null;
        // Find the earliest ASSIGNED event across all checks
        caseDetails?.checks?.forEach(check => {
            check.history.forEach(historyEvent => {
                if (historyEvent.status === 'ASSIGNED') {
                    const assignTime = new Date(historyEvent.timestamp);
                    if (!firstAssignedTime || assignTime.getTime() < firstAssignedTime.getTime()) {
                        firstAssignedTime = assignTime;
                    }
                }
            });
        });

        let caseCreatedDurationText = null;
        if (firstAssignedTime) {
            caseCreatedDurationText = `Time to First Assignment: ${formatDuration(caseCreatedTime, firstAssignedTime)}`;
        } else {
            caseCreatedDurationText = `Still awaiting First Assignment for ${formatDuration(caseCreatedTime, new Date())}`;
        }

        events.push({
            id: 'case-created',
            title: 'Case Created',
            baseDescription: 'Background verification case initiated.',
            date: formatDate(caseCreatedTime),
            timestamp: caseCreatedTime,
            type: 'case',
            status: 'case-created',
            iconComponent: getTimelineEventIcon('case-created'),
            iconColorClass: getStatusColorClass('case-created'),
            durationInStatus: caseCreatedDurationText,
            taskId: null // Case-level event, no specific taskId
        });
    }

    // --- 3. Add Check-level events with calculated durationInStatus and reason ---

    Object.keys(processedCheckEvents).forEach(checkKey => {
        console.log(`checkKey -- `, checkKey);
        const checkHistory = processedCheckEvents[checkKey];
        console.log('checkHistory ---', checkHistory);
        checkHistory.forEach(historyEvent => {
            const check = caseDetails.checks.find(c => c.taskId === historyEvent.taskId);
            const checkDisplayName = check?.displayName || getCategoryName(historyEvent.taskName);
            let baseDescription = '';
            // Use 'reason' if it exists, otherwise fall back to 'description' for insufficiency or a default
            let eventReason = historyEvent.reason || historyEvent.description;

            switch (historyEvent.status) {
                case 'ASSIGNED':
                    baseDescription = `Assigned to ${historyEvent.assignee || 'N/A'}.`;
                    break;
                case 'REASSIGNED':
                    baseDescription = `Reassigned to ${historyEvent.assignee || 'N/A'}.`;
                    break;
                case 'INSUFFICIENCY':
                    baseDescription = 'Insufficiency raised, awaiting candidate response.';
                    break;
                case 'LINK_SENT':
                    baseDescription = 'The Address verification link sent to the candidate, Awaiting candidate response.';
                    break;
                case 'INSUFFICIENCY_CLEARED':
                    baseDescription = 'Insufficiency cleared by candidate.';
                    break;
                case 'IN_PROGRESS':
                    baseDescription = 'Check is currently in progress.';
                    break;
                case 'CLEARED':
                    baseDescription = 'Check successfully cleared.';
                    break;
                case 'FAILED':
                    baseDescription = 'Check failed to clear.';
                    break;
                case 'UNABLE_TO_VERIFY':
                    baseDescription = 'Unable to verify this check.';
                    break;
                default:
                    baseDescription = `Status: ${historyEvent.status}.`;
            }

            events.push({
                id: `${checkKey}-${historyEvent.status}-${historyEvent.timestamp}`,
                title: checkDisplayName,
                baseDescription: baseDescription,
                date: formatDate(historyEvent.timestamp),
                timestamp: historyEvent.timestamp,
                type: 'check',
                status: historyEvent.status,
                iconComponent: getTimelineEventIcon('check', historyEvent.status, historyEvent.taskName),
                iconColorClass: getStatusColorClass(historyEvent.status),
                taskName: historyEvent.taskName,
                taskId: checkKey, // Crucial for filtering
                durationInStatus: historyEvent.durationInStatus,
                reason: eventReason // Include the reason for display
            });
        });
    });

    // --- 4. Add Case Completion/Stop events ---
    const caseCompletedTime = consolidatedData?.completedAt ? new Date(consolidatedData.completedAt) : null;
    if (caseCompletedTime) {
        if (consolidatedData.status === 'COMPLETED') {
            events.push({
                id: 'case-completed',
                title: 'Case Completed',
                baseDescription: 'All background checks are finalized.',
                date: formatDate(caseCompletedTime),
                timestamp: caseCompletedTime,
                type: 'case',
                status: 'case-completed',
                iconComponent: getTimelineEventIcon('case-completed'),
                iconColorClass: getStatusColorClass('case-completed'),
                durationInStatus: null,
                taskId: null
            });
        } else if (consolidatedData.status === 'STOP_CASE') {
            events.push({
                id: 'case-stopped',
                title: 'Case Stopped',
                baseDescription: 'The case has been halted.',
                date: formatDate(caseCompletedTime),
                timestamp: caseCompletedTime,
                type: 'case',
                status: 'case-stopped',
                iconComponent: getTimelineEventIcon('case-stopped'),
                iconColorClass: getStatusColorClass('case-stopped'),
                durationInStatus: null,
                taskId: null
            });
        }
    }

    // --- 5. Sort all events chronologically ---
    events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // --- 6. Add duration from previous *overall* event and assign alternating 'left'/'right' types ---
    let previousOverallEventTimestamp = null;
    return events.map((event, index) => {
        const currentEventTimestamp = new Date(event.timestamp);
        const durationFromPreviousOverall = previousOverallEventTimestamp
            ? formatDuration(previousOverallEventTimestamp, currentEventTimestamp)
            : null;
        previousOverallEventTimestamp = currentEventTimestamp;

        const description = event.baseDescription + (durationFromPreviousOverall
            ? ` (Took ${durationFromPreviousOverall} from previous overall event).`
            : '');

        const layoutType = (index % 2 === 0) ? 'left' : 'right';

        return { ...event, description, layoutType };
    });
};


// --- TIMELINE EVENT CARD COMPONENT ---
const TimelineEventCard = ({ event }) => {
    const IconComponent = event.iconComponent;
    const cardBgClass = getStatusCardBgClass(event.status);
    const cardBorderClass = getStatusCardBorderClass(event.status);

    // Determine if durationInStatus is critical
    const isCriticalDuration = event.durationInStatus &&
        !event.durationInStatus.includes("N/A") &&
        !event.durationInStatus.includes("Still") &&
        (parseDurationToMs(event.durationInStatus) / (1000 * 60 * 60)) > SLA_THRESHOLD_HOURS;


    return (
        <div className={`relative p-6 rounded-2xl shadow-lg w-full z-10 ${cardBgClass} ${cardBorderClass} border`}>
            <div className="flex items-center gap-3 mb-2">
                {IconComponent && <IconComponent size={20} className={event.iconColorClass} />}
                <h3 className="text-lg font-semibold text-slate-800 text-left">{event.title}</h3>
            </div>
            <p className="text-sm text-slate-600 text-left mb-1">{event.description}</p>
            {event.reason && ( // Display reason if available
                <p className="text-xs text-slate-500 text-left mb-1">
                    <span className="font-semibold">Reason:</span> {event.reason}
                </p>
            )}
            <p className="text-xs text-slate-500 text-left italic">
                {event.date.month} {event.date.day}, {event.date.year} at {event.date.time}
            </p>
            {event.durationInStatus && (
                <p className={`text-xs text-left mt-2 flex items-center gap-1 ${isCriticalDuration ? 'font-bold text-red-600' : 'font-semibold text-slate-700'}`}>
                    Time in Status: {event.durationInStatus}
                    {isCriticalDuration && <AlertTriangle size={14} className="text-red-600" />}
                </p>
            )}

            {/* Triangle pointer to the central line */}
            <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent
                            ${event.layoutType === 'left' ? `right-[-15px] border-l-8 border-l-${cardBgClass.replace('bg-', '')}` : `left-[-15px] border-r-8 border-r-${cardBgClass.replace('bg-', '')}`}`}></div>
        </div>
    );
};

// --- TIMELINE DATE BLOCK COMPONENT ---
const TimelineDateBlock = ({ event }) => {
    return (
        <div className="flex-shrink-0 text-center bg-gray-100 p-3 rounded-xl border border-gray-200 w-24 shadow-sm z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase">{event.date.month}</p>
            <p className="text-2xl font-bold text-slate-800 leading-none my-1">{event.date.day}</p>
            <p className="text-sm text-slate-600">{event.date.year}</p>
        </div>
    );
};

// --- MAIN COMPONENT: CaseTimelineTabContent ---
const CaseTimelineTabContent = ({candidateId}) => {
    const [candidateData, setCandidateData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const initComponentRef = useRef(false);
    // const candidateData = MOCK_CANDIDATE_DATA;
    const [selectedCheckIds, setSelectedCheckIds] = useState([]);
    const {authenticatedRequest} = useAuthApi();

    useEffect(() => {

        const fetchTimelineData = async () => {
            try {
                setIsLoading(true);
                const response = await authenticatedRequest(undefined, `${GET_TIMELINE_DATA}/${candidateId}`, METHOD.GET);
                if(response.status === 200) {
                    setCandidateData(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        if(!initComponentRef.current) {
            initComponentRef.current = true;
            fetchTimelineData();
        }
    })

    useEffect(() => {
        console.log("candidateData -- ", candidateData);
    }, [candidateData]);

    const timelineEvents = useMemo(() => {
        return generateCaseTimelineEvents(candidateData.caseDetails, candidateData.consolidatedData);
    }, [candidateData]);

    // Calculate overall case duration
    // const firstEventTimestamp = timelineEvents.length > 0 ? new Date(timelineEvents[0].timestamp) : null;
    // const lastEventTimestamp = timelineEvents.length > 0 ? new Date(timelineEvents[timelineEvents.length - 1].timestamp) : null;
    // const overallCaseDuration = (firstEventTimestamp && lastEventTimestamp)
    //     ? formatDuration(firstEventTimestamp, lastEventTimestamp)
    //     : 'N/A';

    // Calculate TAT for each check for the summary section
    const checkSummaries = useMemo(() => {
        return candidateData?.caseDetails?.checks.map(check => {
            const tat = formatHourDuration(check.tatHours);
            const isCritical = (parseDurationToMs(tat) / (1000 * 60 * 60)) > SLA_THRESHOLD_HOURS;

            return {
                taskId: check.taskId,
                displayName: check.displayName || check.taskName,
                tat: tat || "-",
                status: check.status, // For icon color
                isCritical: isCritical,
                taskName: check.taskName // Pass taskName for icon
            };
        });
    }, [candidateData?.caseDetails?.checks]);

    // Filtered timeline events based on selectedCheckIds
    const filteredTimelineEvents = useMemo(() => {
        if (selectedCheckIds.length === 0) {
            return timelineEvents; // Show all if no checks selected
        }
        return timelineEvents.filter(event =>
            event.type === 'case' || // Always show case-level events
            (event.type === 'check' && selectedCheckIds.includes(event.taskId))
        );
    }, [timelineEvents, selectedCheckIds]);


    // Handler for clicking on a check summary
    const toggleCheckSelection = (taskId) => {
        setSelectedCheckIds(prevSelected => {
            if (prevSelected.includes(taskId)) {
                return prevSelected.filter(id => id !== taskId); // Remove if already selected
            } else {
                return [...prevSelected, taskId]; // Add if not selected
            }
        });
    };

    if(isLoading) {
        return <TimelineSkeleton />;
    }

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            <div className="mb-8"> {/* Adjusted mb to make space for check summaries */}
                <div className="flex items-center justify-between gap-3">
                    {/* Title and Subtitle Group */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Case Timeline</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <InfoIcon size={14} className="text-slate-300" />
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">A detailed journey of the background verification process.</p>
                        </div>
                    </div>

                    {/* Overall Case Duration on Right */}
                    {/*{overallCaseDuration !== 'N/A' && (*/}
                    {/*    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-medium shadow-sm flex-shrink-0">*/}
                    {/*        <ClockIcon size={16} className="text-blue-500" />*/}
                    {/*        <span>Total Case Duration: {overallCaseDuration}</span>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>

                {/* Check-wise TAT Summaries */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Check Turnaround Times:</h3>
                    <div className="flex flex-wrap gap-3">
                        {checkSummaries?.map(summary => (
                            <button
                                key={summary.taskId}
                                onClick={() => toggleCheckSelection(summary.taskId)}
                                className={`
                                        flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
                                        ${selectedCheckIds.includes(summary.taskId)
                                    ? 'bg-[#5D4591] text-white shadow-md'
                                    : `bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200`
                                }
                                        ${summary.isCritical ? 'border-red-500 ring-1 ring-red-500' : ''}
                                    `}
                            >
                                {getTaskIcon(summary.taskName) && React.createElement(getTaskIcon(summary.taskName), { size: 16, className: selectedCheckIds.includes(summary.taskId) ? 'text-white' : getStatusColorClass(summary.status) })}
                                <span>{summary.displayName}:</span>
                                <span className={summary.isCritical ? 'text-red-400 font-bold' : ''}>{summary.tat}</span>
                            </button>
                        ))}
                        {selectedCheckIds.length > 0 && (
                            <button
                                onClick={() => setSelectedCheckIds([])}
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 transition-all duration-200 ease-in-out"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}


                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 z-0"></div>

                    {filteredTimelineEvents.length === 0 ? (
                        <div className="text-center text-slate-500 py-10">No events to display for the selected checks.</div>
                    ) : (
                        filteredTimelineEvents.map((event) => (
                            <div
                                key={event.id}
                                className="relative mb-16 grid grid-cols-[1fr_auto_1fr] items-center"
                            >
                                {/* Left Side Content */}
                                <div className="col-start-1 col-end-2 flex justify-end pr-10">
                                    {event.layoutType === 'left' && <TimelineEventCard event={event} />}
                                </div>

                                {/* Timeline Dot (Center Column) */}
                                <div className="col-start-2 col-end-3 relative z-10 w-4 h-4 rounded-full bg-[#5D4591] border-2 border-white shadow-sm flex-shrink-0"></div>

                                {/* Right Side Content */}
                                <div className="col-start-3 col-end-4 flex justify-start pl-10">
                                    {event.layoutType === 'right' && <TimelineEventCard event={event} />}
                                </div>

                                {/* Date Block (Absolute positioned relative to the grid row) */}
                                <div className={`absolute top-1/2 -translate-y-1/2 z-10 flex-shrink-0
                                                ${event.layoutType === 'left' ? 'left-[calc(50%+40px)]' : 'right-[calc(50%+40px)]'}`}>
                                    <TimelineDateBlock event={event} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaseTimelineTabContent;
