import { ChevronRight, UserX } from "lucide-react";
import React from "react";

const UserListCard = ({ user, isActive, onClick }) => {
    // Check if user is disabled (assuming 'enabled' is the boolean from your API)
    const isDisabled = user.enabled === false;

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

                <div className="flex-1 min-w-0 pr-6"> {/* Added padding-right to avoid chevron overlap */}
                    <div className="flex justify-between items-start">
                        <h4 className={`font-bold truncate ${isDisabled ? 'text-slate-400' : 'text-slate-800'}`}>
                            {user.firstName} {user.lastName}
                        </h4>
                        {!isActive && (
                            <span className="text-[10px] text-slate-400 font-medium">
                                {user.lastLogin || ''}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        {/* Role Badge */}
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider
                            ${isDisabled ? 'bg-slate-100 text-slate-400' :
                            user.roleSet?.find(r => r.name === 'ADMIN') ? 'bg-purple-50 text-[#5D4591]' : 'bg-blue-50 text-blue-600'}`}>
                            {user.roleSet?.[0]?.name|| 'USER'}
                        </span>

                        {/* DISABLED INDICATOR */}
                        {isDisabled && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-wider">
                                <UserX size={10} /> Disabled
                            </span>
                        )}

                        {!isDisabled && (
                            <span className="text-[11px] text-slate-400 truncate">{user.email}</span>
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
