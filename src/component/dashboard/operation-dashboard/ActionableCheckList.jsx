// src/components/dashboard/ActionableCheckList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    CircleDot,
    CheckCircle,
    Clock,
    AlertCircle,
    AlertTriangle,
    Inbox,
    PauseCircle,
    SearchIcon
} from 'lucide-react';
import {Skeleton} from "../admin-dashboard/SkeletonLoading.jsx";

const ActionableCheckList = ({
                                 title,
                                 icon: Icon,
                                 data,
                                 isLoading,
                                 emptyMessage,
                                 columns, // Array of { key: 'propName', header: 'Display Name', render?: (item) => JSX }
                                 actions, // Array of { label: 'Action', onClick: (item) => void, icon: IconComponent, buttonClass: string }
                                 listType // e.g., 'new', 'breached', 'active' for specific styling
                             }) => {
    const navigate = useNavigate();

    const getRowClass = (item) => {
        switch (listType) {
            case 'new': return 'bg-purple-50/50 hover:bg-purple-100/50 border-purple-100';
            case 'breached': return 'bg-rose-50/50 hover:bg-rose-100/50 border-rose-100';
            case 'approaching': return 'bg-amber-50/50 hover:bg-amber-100/50 border-amber-100';
            case 'failed': return 'bg-orange-50/50 hover:bg-orange-100/50 border-orange-100';
            case 'pending': return 'bg-indigo-50/50 hover:bg-indigo-100/50 border-indigo-100';
            default: return 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-100';
        }
    };

    const getStatusIndicator = (status) => {
        switch (status) {
            case 'New': return <CircleDot size={12} className="text-purple-500" />;
            case 'SLA Breached': return <AlertCircle size={12} className="text-rose-500" />;
            case 'In Progress': return <Clock size={12} className="text-blue-500" />;
            case 'Awaiting Analyst Review': return <Inbox size={12} className="text-indigo-500" />;
            case 'Pending Update': return <Inbox size={12} className="text-orange-500" />;
            case 'API Timeout': return <AlertTriangle size={12} className="text-orange-500" />;
            case 'Invalid Address Format': return <AlertTriangle size={12} className="text-orange-500" />;
            case 'Collecting Data': return <Clock size={12} className="text-blue-500" />;
            case 'Pending Third-Party': return <PauseCircle size={12} className="text-gray-500" />;
            case 'Reviewing Findings': return <SearchIcon size={12} className="text-teal-500" />; // Assuming Search for review
            case 'Data Extraction Failed': return <AlertCircle size={12} className="text-red-500" />;
            default: return null;
        }
    };


    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    <Icon size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900">{title}</h3>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : data && data.length > 0 ? (
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={item.id || index} className={`flex items-center justify-between p-4 rounded-xl border ${getRowClass(item)} transition-all duration-200`}>
                                <div className="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-3 gap-2 items-center">
                                    {columns.map(col => (
                                        <div key={col.key} className="flex flex-col min-w-0">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">{col.header}</span>
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                                {col.key === 'status' && getStatusIndicator(item[col.key])}
                                                {col.key === 'currentStatus' && getStatusIndicator(item[col.key])}
                                                {col.key === 'failureReason' && getStatusIndicator(item[col.key])}
                                                {col.render ? col.render(item) : item[col.key]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {actions && actions.length > 0 && (
                                    <div className="flex-shrink-0 ml-4">
                                        {actions.map((action, actionIdx) => (
                                            <button
                                                key={actionIdx}
                                                onClick={() => action.onClick(item)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors ${action.buttonClass || 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                            >
                                                {action.icon && React.createElement(action.icon, { size: 14 })}
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-center text-slate-400 font-medium py-10">
                    {emptyMessage || "No items to display."}
                </div>
            )}
        </div>
    );
};

export default ActionableCheckList;
