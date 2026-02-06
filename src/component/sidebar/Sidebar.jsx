import React from 'react';
import {
    Home,
    FileText,
    BarChart2,
    Settings,
    UserPlus,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    Building2Icon,
    UserIcon, BuildingIcon
} from 'lucide-react';
import SidebarItem from "./SidebarItem.jsx";
import {useNavigate} from "react-router-dom";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState('Dashboard');
    const navigate = useNavigate();

    const menuItems = [
        { icon: <Home size={20} />, label: 'Dashboard', active: true, route: '/dashboard' },
        { icon: <BuildingIcon size={20} />, label: 'Organizations', route: '/organisation-dashboard' },
        { icon: <UserIcon size={20} />, label: 'Candidate List', route: '/candidate-list' },
        { icon: <UserCheck size={20} />, label: 'Case Assignment', route: '/case-assignment' },
        { icon: <BarChart2 size={20} />, label: 'Analytics' },
        { icon: <UserPlus size={20} />, label: 'User Management' },
        { icon: <Settings size={20} />, label: 'Settings' },
    ];

    const handleSidebarClick = (item) => {
        setActiveItem(item.label)
        navigate(item.route)
    }

    return (
        <aside className={`bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>


            {/* Nav Links */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item, idx) => (
                    <SidebarItem idx={idx}
                                 key={idx}
                                 item={item} isExpanded={isExpanded}
                                 handleSidebarClick={() => handleSidebarClick(item)}
                                 isActive={activeItem === item.label}
                    />
                ))}
            </nav>

            {/* Collapse Toggle at Bottom */}
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
