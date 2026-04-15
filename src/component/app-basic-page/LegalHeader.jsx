import React from 'react';
import {ArrowLeft, ChevronRight, LayoutDashboard, User2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {useTenant} from "../../provider/TenantProvider.jsx";

const LegalHeader = () => {
    const {user, loggedInRole} = useAuthApi();
    const {tenantConfig} = useTenant();

    const accountBatch = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'System Admin';
            case 'ROLE_TENANT_ADMIN':
                return "Admin Account";
            case 'ROLE_TENANT_OPERATIONS_MANAGER':
                return "Operations Manager";
            case 'ROLE_TENANT_OPERATIONS':
                return "Operations";
            default:
                return "System User";
        }
    }

    const getName = (user) => {
        if(!user) {
            return "Anonymous";
        }
        return user?.firstName + " " + user?.lastName;
    }

    const navigate = useNavigate();

    return (
        <div className="w-full bg-white border-b border-slate-200">
            {/* TOP BAR: LOGO & PROFILE ONLY */}
            <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-50">
                {/* LOGO - Link to Dashboard */}
                <div onClick={() => navigate('/')} className="inline-flex flex-col items-start cursor-pointer">
                    <img src={tenantConfig?.logoUrl || "/logo.png"} alt="Vantira" className="h-8 w-auto"/>
                    <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 ml-1">
                    Powered by Vantira
                </span>
                </div>

                {/* USER PROFILE ONLY (No Wallet/Search/Notifications) */}
                <div className="flex items-center gap-4 border-l pl-6 border-slate-100">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-900 leading-none">{getName(user)}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">{accountBatch(loggedInRole)}</p>
                    </div>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#F5F3FF] border-2 border-white ring-1 ring-slate-200 shadow-sm flex items-center justify-center overflow-hidden group-hover:ring-[#5D4591]/30 transition-all">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User2
                                    size={22}
                                    strokeWidth={1.5}
                                    className="text-[#5D4591] mt-1 opacity-80"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalHeader;