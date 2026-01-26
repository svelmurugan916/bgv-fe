import React from "react";

const SidebarItem = ({idx, item, isExpanded, isActive, handleSidebarClick}) => {
    return (
        <div onClick={handleSidebarClick} key={idx} className={`flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all group 
                ${!isExpanded && 'justify-center'}
                        ${isActive ? 'bg-[#F9F7FF] text-[#5D4591] font-bold' : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'}`}>
            <div className="shrink-0">{item.icon}</div>
            {isExpanded && <span className="ml-4 text-sm whitespace-nowrap">{item.label}</span>}
        </div>
    )
}

export default SidebarItem