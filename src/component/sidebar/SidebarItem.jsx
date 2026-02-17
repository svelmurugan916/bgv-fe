import React from "react";

const SidebarItem = ({item, isExpanded, isActive, handleSidebarClick}) => {
    return (
        <div
            onClick={handleSidebarClick}
            className={`flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all group relative
                ${!isExpanded ? 'justify-center' : ''}
                ${isActive
                ? 'bg-[#F9F7FF] text-[#5D4591] font-bold'
                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
            }`}
        >
            <div className="shrink-0">{item.icon}</div>

            {isExpanded ? (
                <span className="ml-4 text-sm whitespace-nowrap animate-in fade-in duration-300">
                    {item.label}
                </span>
            ) : (
                /* TOOLTIP: Only rendered/visible when collapsed */
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl
                                whitespace-nowrap opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0
                                transition-all duration-200 pointer-events-none z-[100] shadow-xl shadow-black/10">
                    {item.label}

                    {/* Tooltip Arrow */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#0F172A] rotate-45 rounded-bl-[4px]" />
                </div>
            )}
        </div>
    )
}

export default SidebarItem;
