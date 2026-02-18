import { formatDate } from "../../utils/date-util.js";
import { ArrowRight } from "lucide-react";
import React from "react";

const RoleCard = ({ role, handleOpenEdit }) => {
    const isActive = role.enabled;
    const priority = role.roleRank || 1; // Assuming 'priority' is the field name

    return (
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Header Row: Title and Status */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#5D4591] transition-colors">
                    {role.roleName?.replaceAll("_", " ")}
                </h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    isActive
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-rose-50 text-rose-500 border-rose-100'
                }`}>
                    {isActive ? 'Active' : 'Disabled'}
                </span>
            </div>

            {/* Priority and Date Row */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Role Priority Rank
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#5D4591] flex items-center justify-center shadow-lg shadow-[#5D4591]/20">
                        <span className="text-[10px] font-black text-white leading-none">
                            {priority}
                        </span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {formatDate(role.createdAt)}
                </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-2">
                {role.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                    {role.userCount > 0 ? (
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <span className="ml-3 text-xs font-bold text-slate-600">{role.userCount} users assigned</span>
                        </div>
                    ) : (
                        <span className="text-xs font-medium text-slate-400">No users assigned</span>
                    )}
                </div>

                <button
                    onClick={handleOpenEdit}
                    className="flex items-center gap-1 text-[#5D4591] text-sm font-bold hover:gap-2 transition-all"
                >
                    Edit role <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default RoleCard;
