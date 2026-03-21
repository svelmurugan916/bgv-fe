import React, { useState, useEffect, useRef } from 'react';
import {
    Bell,
    Globe,
    ChevronDown,
    User,
    Settings,
    LogOut,
    RefreshCcw,
    Loader2, // For skeleton loader
} from 'lucide-react';
import SearchBar from "./SearchBar.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { useNavigate } from "react-router-dom";
import { useNotification } from '../../context/NotificationContext.jsx';
import NotificationDropdown from "../notification/NotificationDropdown.jsx"; // Import useNotification hook

// --- Notification Bell Skeleton Loader Component ---
const NotificationBellSkeleton = () => (
    <div className="flex flex-col gap-2 p-4 animate-pulse">
        <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-3 w-full bg-slate-200 rounded"></div>
        <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
    </div>
);

const Header = () => {
    const { user, loggedInRole, logout } = useAuthApi();
    const searchInputRef = useRef();
    const profileDropdownRef = useRef(null);
    const notificationsDropdownRef = useRef(null);
    const bellIconRef = useRef(null);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

    const navigate = useNavigate();
    const { addToast } = useNotification(); // Use the notification context

    // Keyboard shortcut for search (Ctrl+K / Cmd+K)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle Click Outside for Dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target) &&
                bellIconRef.current && !bellIconRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const accountBatch = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return "Admin Account";
            case 'ROLE_OPERATIONS_MANAGER': return "Operations Manager";
            case 'ROLE_OPERATIONS': return "Operations";
            default: return "System User";
        }
    };

    const toggleNotifications = async () => {
        if (!isNotificationsOpen) {
            setIsNotificationsLoading(true); // Start loading animation
            setIsProfileOpen(false); // Close profile dropdown
            // Simulate fetching new notifications for the dropdown
            setIsNotificationsLoading(false); // End loading animation

            // DEMO: Trigger various types of toasts with the new design
            // addToast(
            //     "Success notification",
            //     "success",
            //     5000,
            //     "Subtitle and associated information pertaining to the event. Information to not exceed [x] chatavters.",
            //     [
            //         { label: "View Details", onClick: () => { navigate('/notifications/123'); console.log('View Details clicked!'); } },
            //         { label: "Dismiss", onClick: () => console.log('Dismiss clicked!'), isPrimary: true }
            //     ]
            // );
            // addToast(
            //     "Informational notification",
            //     "info",
            //     5000,
            //     "Subtitle and associated information pertaining to the event. Information to not exceed [x] chatavters.",
            //     [{ label: "Learn More", onClick: () => console.log('Learn More clicked!') }]
            // );
            // addToast(
            //     "Warning notification",
            //     "warning",
            //     5000,
            //     "Subtitle and associated information pertaining to the event. Information to not exceed [x] chatavters."
            // );
            // addToast(
            //     "Error notification",
            //     "error",
            //     5000,
            //     "Subtitle and associated information pertaining to the event. Information to not exceed [x] chatavters."
            // );
        }
        setIsNotificationsOpen(prev => !prev);
    };

    const toggleProfile = () => {
        setIsProfileOpen(prev => !prev);
        setIsNotificationsOpen(false); // Close notifications dropdown
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-50">
            <div className="inline-flex flex-col items-end">
                <img src="/logo.png" alt="Trace-U" className="h-8 w-auto" />
                <span className="text-[7px] font-bold text-slate-400 tracking-[0.15em] uppercase -mt-1 pr-0.5">
                    Powered by Mini-U
                </span>
            </div>

            {/* CENTER: SEARCH BAR */}
            <SearchBar searchInputRef={searchInputRef} />

            {/* RIGHT: TOOLS & PROFILE */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-slate-400">
                    <Globe size={20} className="cursor-pointer hover:text-[#5D4591] transition-colors" />

                    {/* NOTIFICATION BELL ICON AND DROPDOWN */}
                    <div className="relative">
                        <div
                            ref={bellIconRef}
                            onClick={toggleNotifications}
                            className="relative cursor-pointer hover:text-[#5D4591] transition-colors"
                        >
                            <Bell size={20} />
                            {/* Unread count indicator */}
                            <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        {isNotificationsOpen && (
                            <div ref={notificationsDropdownRef}>
                                {isNotificationsLoading ? (
                                    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] overflow-hidden">
                                        <div className="p-4 border-b border-slate-100">
                                            <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
                                        </div>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <NotificationBellSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <NotificationDropdown onClose={() => setIsNotificationsOpen(false)} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                {/* PROFILE SECTION WITH DROPDOWN */}
                <div className="relative" ref={profileDropdownRef}>
                    <div
                        onClick={toggleProfile}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-bold text-slate-800 leading-none">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-[11px] text-[#5D4591] mt-1 font-medium">
                                {accountBatch(loggedInRole)}
                            </p>
                        </div>
                        <div className="w-10 uppercase h-10 rounded-full bg-[#F9F7FF] border border-[#5D4591]/10 flex items-center justify-center text-[#5D4591] font-bold shadow-sm group-hover:bg-[#F0EDFF] transition-colors">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-[#5D4591]' : 'group-hover:text-slate-600'}`}
                        />
                    </div>

                    {/* DROPDOWN MENU */}
                    <div className={`
                        absolute right-0 top-full mt-3 w-60 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] overflow-hidden transition-all duration-300 origin-top-right
                        ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
                    `}>
                        <div className="p-2">
                            {/* Profile Option */}
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5D4591] rounded-xl transition-colors group">
                                <User size={16} className="text-slate-400 group-hover:text-[#5D4591]" />
                                Profile
                            </button>

                            {/* Switch Role Option */}
                            <button onClick={() => navigate("/select-role")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5D4591] rounded-xl transition-colors group">
                                <RefreshCcw size={16} className="text-slate-400 group-hover:text-[#5D4591]" />
                                Switch Role
                            </button>

                            {/* Account Settings Option */}
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5D4591] rounded-xl transition-colors group">
                                <Settings size={16} className="text-slate-400 group-hover:text-[#5D4591]" />
                                Account Settings
                            </button>

                            <div className="h-px bg-slate-50 my-2 mx-2" />

                            {/* Sign Out Option */}
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors group"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
