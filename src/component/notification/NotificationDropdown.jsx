import React, { useState, useEffect } from 'react';
import {
    UserPlus, // For new candidate/user events
    Clock, // For time-sensitive events like link expiry
    CheckCircle, // For completion or successful actions
    AlertCircle, // For critical alerts like SLA breach or system issues
    Briefcase, // For client-related events
    XCircle, // For failed automated checks
    UploadCloud, // For document uploads
    UserCheck, // For assignment events
    ToolboxIcon // Generic system notification icon, if needed
} from 'lucide-react'; // Import necessary Lucide icons

// Helper to generate unique IDs
const generateNotificationId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const mockNotifications = [
    {
        id: generateNotificationId(),
        type: 'candidate_onboarded',
        user: {
            name: 'System', // Originator of the notification
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png', // Generic system icon
            badgeIcon: <UserPlus size={12} className="text-white" />,
            badgeBg: 'bg-emerald-500',
        },
        time: '5m ago',
        read: false,
        content: <>New candidate <span className="font-bold">Sarah Connor</span> onboarded by <span className="font-bold">Cyberdyne Systems</span></>,
        detail: "Case ID: #C-7890. Initiated: March 15, 2026",
        link: '/cases/C-7890', // Link to the case details
        actions: (
            <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Dismiss
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                    View Case
                </button>
            </div>
        ),
    },
    {
        id: generateNotificationId(),
        type: 'link_expired',
        user: {
            name: 'System',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png',
            badgeIcon: <Clock size={12} className="text-white" />,
            badgeBg: 'bg-rose-500',
        },
        time: '15m ago',
        read: false,
        content: <>Candidate link expired for <span className="font-bold">John Doe</span></>,
        detail: "Case ID: #C-1234. Last attempted login: March 14, 2026, 11:30 PM",
        link: '/cases/C-1234',
        actions: (
            <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Dismiss
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-800 text-white hover:bg-rose-700 transition-colors">
                    Re-send Link
                </button>
            </div>
        ),
    },
    {
        id: generateNotificationId(),
        type: 'case_pending_qc',
        user: {
            name: 'Analyst Jane', // Analyst who completed it
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            badgeIcon: <CheckCircle size={12} className="text-white" />,
            badgeBg: 'bg-blue-500',
        },
        time: '30m ago',
        read: false,
        content: <>Case <span className="font-bold">#C-5678</span> completed, awaiting QC</>,
        detail: "Candidate: Emily White. Completed by: Analyst Jane Doe",
        link: '/cases/C-5678',
        actions: (
            <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Dismiss
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-800 text-white hover:bg-blue-700 transition-colors">
                    Review Case
                </button>
            </div>
        ),
    },
    {
        id: generateNotificationId(),
        type: 'sla_breach',
        user: {
            name: 'System Alert',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png',
            badgeIcon: <AlertCircle size={12} className="text-white" />,
            badgeBg: 'bg-red-700',
        },
        time: '1h ago',
        read: false,
        content: <>Critical: SLA breached for Case <span className="font-bold">#C-9876</span></>,
        detail: "Candidate: Michael Scott. Check: Criminal Record. Overdue by: 2 days",
        link: '/cases/C-9876',
        actions: (
            <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Dismiss
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-800 text-white hover:bg-red-700 transition-colors">
                    Investigate
                </button>
            </div>
        ),
    },
    {
        id: generateNotificationId(),
        type: 'new_client',
        user: {
            name: 'System',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png',
            badgeIcon: <Briefcase size={12} className="text-white" />,
            badgeBg: 'bg-indigo-500',
        },
        time: '2h ago',
        read: true, // This one is read
        content: <>New client <span className="font-bold">Stark Industries</span> added to platform</>,
        detail: "Contact: Tony Stark, tony@stark.com. Plan: Enterprise Pro",
        link: '/clients/stark-industries',
    },
    {
        id: generateNotificationId(),
        type: 'auto_check_failed',
        user: {
            name: 'System',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png',
            badgeIcon: <XCircle size={12} className="text-white" />,
            badgeBg: 'bg-orange-500',
        },
        time: '3h ago',
        read: false,
        content: <>Automated check failed for <span className="font-bold">Bruce Wayne</span></>,
        detail: "Case ID: #C-007. Check: Database (Sanctions List). Reason: API Timeout.",
        link: '/checks/C-007/db-sanctions',
        actions: (
            <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Dismiss
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-orange-800 text-white hover:bg-orange-700 transition-colors">
                    View Details
                </button>
            </div>
        ),
    },
    {
        id: generateNotificationId(),
        type: 'doc_uploaded',
        user: {
            name: 'Candidate Profile', // Represents the candidate action
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=320&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Generic candidate avatar
            badgeIcon: <UploadCloud size={12} className="text-white" />,
            badgeBg: 'bg-green-500',
        },
        time: '4h ago',
        read: true,
        content: <>Document uploaded by <span className="font-bold">Clark Kent</span></>,
        detail: "Case ID: #C-SVP. Document: Employment History (Daily Planet)",
        link: '/cases/C-SVP/documents',
    },
    {
        id: generateNotificationId(),
        type: 'analyst_assigned',
        user: {
            name: 'System',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png',
            badgeIcon: <UserCheck size={12} className="text-white" />,
            badgeBg: 'bg-teal-500',
        },
        time: '6h ago',
        read: true,
        content: <>Analyst <span className="font-bold">Peter Parker</span> assigned to Case <span className="font-bold">#C-SPMN</span></>,
        detail: "Candidate: Mary Jane Watson. Total checks: 5",
        link: '/cases/C-SPMN',
    },
    {
        id: generateNotificationId(),
        type: 'system_maintenance',
        user: {
            name: 'System Administrator',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131505.png',
            badgeIcon: <ToolboxIcon size={12} className="text-white" />,
            badgeBg: 'bg-gray-600',
        },
        time: '1d ago',
        read: true,
        content: <>Scheduled System Maintenance Tonight</>,
        detail: "Platform may experience downtime from 11:00 PM to 2:00 AM UTC. Please plan accordingly.",
        link: '/status',
        actions: (
            <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Dismiss
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                    Read More
                </button>
            </div>
        ),
    },
];


const NotificationItem = ({ notification }) => (
    <div className="flex items-start gap-3 p-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0">
        <div className="relative flex-shrink-0">
            <img
                src={notification.user.avatar}
                alt={notification.user.name}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${notification.user.badgeBg} border-2 border-white`}>
                {notification.user.badgeIcon}
            </div>
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-slate-800">{notification.user.name}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{notification.time}</span>
                    {!notification.read && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-tight">
                {notification.content}
            </p>
            {notification.detail && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {notification.detail}
                </p>
            )}
            {notification.prompt && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    <span className="font-medium">Prompt:</span> {notification.prompt}
                </p>
            )}
            {notification.actions}
        </div>
    </div>
);

const NotificationSkeleton = () => (
    <div className="flex items-start gap-3 p-4 animate-pulse border-b border-slate-100 last:border-b-0">
        <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 border-2 border-white"></div>
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <div className="h-3 w-24 bg-slate-200 rounded"></div>
                <div className="h-2 w-16 bg-slate-200 rounded"></div>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded mb-1"></div>
            <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-2 w-1/2 bg-slate-200 rounded mt-1"></div>
        </div>
    </div>
);

const NotificationDropdown = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        const timer = setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 2000); // 2-second skeleton loader

        return () => clearTimeout(timer);
    }, []);

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') {
            return !notif.read;
        }
        return true;
    });

    return (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
                <div className="flex gap-2">
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            filter === 'all' ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            filter === 'unread' ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar"> {/* Add custom-scrollbar for styling */}
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => <NotificationSkeleton key={index} />)
                ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notif => (
                        <NotificationItem key={notif.id} notification={notif} />
                    ))
                ) : (
                    <div className="p-4 text-center text-slate-500 text-sm">No notifications found.</div>
                )}
            </div>

            {/* Optional: Footer to view all notifications */}
            <div className="p-3 border-t border-slate-100">
                <button className="w-full text-center text-sm font-semibold text-[#5D4591] hover:text-[#4a3675] transition-colors">
                    View All Notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
