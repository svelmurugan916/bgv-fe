import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import {
    Home, BarChart2, Settings, UserPlus, UserCheck,
    ChevronLeft, ChevronRight, UserIcon, BuildingIcon,
    ShieldAlert, FilePlus, ShieldCheckIcon
} from 'lucide-react';
import SidebarItem from "./SidebarItem.jsx";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // This gives us the current URL path

    const menuSections = [
        {
            title: 'OPERATIONS',
            items: [
                { icon: <Home size={20} />, label: 'Dashboard', route: '/dashboard' },
                { icon: <BuildingIcon size={20} />, label: 'Organizations', route: '/organisation-dashboard' },
                { icon: <UserIcon size={20} />, label: 'Candidate List', route: '/candidate-list' },
                { icon: <UserCheck size={20} />, label: 'Case Assignment', route: '/case-assignment' },
            ]
        },
        {
            title: 'MASTERS / DATA',
            items: [
                { icon: <ShieldAlert size={20} />, label: 'Blocklist Colleges', route: '/blocklist' },
                { icon: <FilePlus size={20} />, label: 'Check Creation', route: '/check-creation' },
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { icon: <BarChart2 size={20} />, label: 'Analytics', route: '/analytics' },
                { icon: <UserPlus size={20} />, label: 'User Management', route: '/user-management' },
                { icon: <ShieldCheckIcon size={20} />, label: 'Role Management', route: '/role-management' },
                { icon: <Settings size={20} />, label: 'Settings', route: '/settings' },
            ]
        }
    ];

    const handleSidebarClick = (item) => {
        if(item.route) navigate(item.route);
    };

    /**
     * Logic to determine if a link is active:
     * 1. If the current path exactly matches the route.
     * 2. If the current path starts with the route (for sub-pages like /candidate-list/details/1)
     */
    const isItemActive = (itemRoute) => {
        const currentPath = location.pathname;
        const stateActiveMenu = location.state?.activeMenu;

        // 1. If we have an activeMenu in state (from the table click), use it
        if (stateActiveMenu) {
            return stateActiveMenu === itemRoute;
        }

        // 2. Fallback: Standard URL matching (for when they click the sidebar directly)
        if (itemRoute === '/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/';
        }

        return currentPath.startsWith(itemRoute);
    };

    return (
        <aside className={`bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>

            {/*
               IMPORTANT: We use 'overflow-y-auto' for scrolling,
               but 'overflow-x-visible' when collapsed so tooltips can fly out.
            */}
            <nav className={`flex-1 py-6 px-3 space-y-6 ${isExpanded ? 'overflow-y-auto' : 'overflow-y-visible'}`}>
                {menuSections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                        {isExpanded && (
                            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-2">
                                {section.title}
                            </p>
                        )}
                        {!isExpanded && <div className="border-t border-gray-50 mx-2 my-4" />}
                        {section.items.map((item) => (
                            <SidebarItem
                                key={item.label}
                                item={item}
                                isExpanded={isExpanded}
                                handleSidebarClick={() => handleSidebarClick(item)}
                                isActive={isItemActive(item.route)}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-50 text-slate-400 hover:text-[#5D4591] transition-colors cursor-pointer"
                >
                    {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
