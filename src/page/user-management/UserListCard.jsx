import { ChevronRight, UserX, Building2, Award } from "lucide-react"; // Added Building2 and Award icon
import React from "react";

const UserListCard = ({ user, isActive, onClick }) => {
    const isDisabled = user.enabled === false;

    // Helper to determine user scope badge style
    const getUserScopeBadge = (scope) => {
        if (!scope) return null;

        let bgColor = '';
        let textColor = '';
        let label = '';

        switch (scope) {
            case 'SYSTEM_USER':
                bgColor = 'bg-blue-600'; // Darker blue for SYSTEM_USER, matching reference
                textColor = 'text-white';
                label = 'System';
                break;
            case 'TENANT_USER':
                bgColor = 'bg-blue-50'; // Lighter blue for TENANT_USER, matching reference
                textColor = 'text-blue-600';
                label = 'Tenant';
                break;
            default:
                bgColor = 'bg-slate-100';
                textColor = 'text-slate-500';
                label = scope.replace('_', ' ');
        }
        return (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${bgColor} ${textColor}`}>
                {label}
            </span>
        );
    };

    // Helper to determine user score display (subtle top-right)
    const getUserScoreDisplay = (score) => {
        if (score === undefined || score === null) return null;

        let textColor = '';
        if (score > 75) {
            textColor = 'text-emerald-500'; // Green for high score
        } else if (score >= 50) {
            textColor = 'text-amber-500'; // Amber for medium score
        } else {
            textColor = 'text-rose-500'; // Red for low score
        }

        return (
            <span className={`flex items-center gap-1 text-[10px] font-bold ${textColor}`} title={`User Score: ${score}`}>
                <Award size={10} /> {score}
            </span>
        );
    };

    return (
        <div
            onClick={onClick}
            className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border
                ${isActive
                ? 'bg-white border-[#5D4591] shadow-lg shadow-[#5D4591]/5 translate-x-1'
                : 'bg-white border-transparent hover:border-slate-200 shadow-sm'}
                ${isDisabled ? 'opacity-80' : ''}`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar with Grayscale if disabled */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all
                    ${isDisabled ? 'bg-slate-200 text-slate-400 grayscale' :
                    isActive ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-500'}`}>
                {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0 pr-6">
                <div className="flex justify-between items-center">
                    <h4 className={`font-bold truncate ${isDisabled ? 'text-slate-400' : 'text-slate-800'}`}>
                        {user.firstName} {user.lastName}
                    </h4>
                    {/* User Score (top right) or Last Login if score not present */}
                    {!isActive && (user.score !== undefined && user.score !== null ? getUserScoreDisplay(user.score) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                                {user.lastLogin || ''}
                            </span>
                    ))}
                </div>

                {/* Tenant Name */}
                {!isDisabled && user.tenantName && (
                    <p className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 font-medium truncate">
                        <Building2 size={12} className="text-slate-400" /> {user.tenantName}
                    </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                    {/* Role Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider
                            ${isDisabled ? 'bg-slate-100 text-slate-400' :
                        user.roleSet?.find(r => r.name === 'ADMIN') ? 'bg-purple-50 text-[#5D4591]' : 'bg-blue-50 text-blue-600'}`}>
                    {user.roleSet?.[0]?.name?.replaceAll("_", " ")?.replace("TENANT", "")|| 'USER'}
                </span>

                {/* User Scope Badge (System/Tenant) */}
                {getUserScopeBadge(user.userScope)}

                {/* Email Address */}
                {!isDisabled && user.email && (
                    <span className="text-[11px] text-slate-400 truncate ml-2">
                                &bull; {user.email} {/* Subtle separator */}
                            </span>
                )}

                {/* DISABLED INDICATOR */}
                {isDisabled && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-wider">
                                <UserX size={10} /> Disabled
                            </span>
                )}
            </div>
        </div>
</div>

    {/* VERTICALLY CENTERED CHEVRON */}
    {isActive && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5D4591] animate-in fade-in slide-in-from-left-2 duration-300">
            <ChevronRight size={18} />
        </div>
    )}
</div>
);
};

export default UserListCard;
