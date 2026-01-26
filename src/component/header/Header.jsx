import React, {useEffect, useRef} from 'react';
import { Bell, Globe, ChevronDown } from 'lucide-react';
import SearchBar from "./SearchBar.jsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";

const Header = () => {
    const { user, loggedInRole } = useAuthApi();
    const searchInputRef = useRef();

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

    const accountBatch = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return "Admin Account";
            case 'ROLE_OPERATIONS_MANAGER': return "Operations Manager";
            case 'ROLE_OPERATIONS': return "Operations";
            default: return "System User";
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-50">
            {/* LOGO & BRAND */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#5D4591] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#5D4591]/10 shrink-0">
                    T
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Trace-U</h1>
                    <span className="text-[9px] text-slate-400 mt-1">Powered by AuthBridge</span>
                </div>
            </div>

            {/* CENTER: SEARCH BAR */}
            <SearchBar searchInputRef={searchInputRef}/>

            {/* RIGHT: TOOLS & PROFILE */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-slate-400">
                    <Globe size={20} className="cursor-pointer hover:text-[#5D4591] transition-colors" />
                    <div className="relative cursor-pointer hover:text-[#5D4591] transition-colors">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[11px] text-[#5D4591] mt-1 font-medium">{accountBatch(loggedInRole)}</p>
                    </div>
                    <div className="w-10 uppercase h-10 rounded-full bg-[#F9F7FF] border border-[#5D4591]/10 flex items-center justify-center text-[#5D4591] font-bold shadow-sm group-hover:bg-[#F0EDFF] transition-colors">
                        {user?.firstName[0]}{user?.lastName[0]}
                    </div>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
            </div>
        </header>
    );
};

export default Header;
