import {AlertCircle, Clock, FileText, SearchX, ShieldCheck, XCircle} from "lucide-react";
import React from "react";

const CandidateStatusLabel = ({status, label}) => {

    const statusConfig = {
        'IN_PROGRESS': {
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            icon: Clock,
            label: 'In Progress'
        },
        'INSUFFICIENCY_RAISED': {
            color: 'bg-amber-50 text-amber-600 border-amber-100',
            icon: AlertCircle,
            label: 'Insufficiency Raised'
        },
        'FAILED': {
            color: 'bg-rose-50 text-rose-600 border-rose-100',
            icon: XCircle,
            label: 'Failed'
        },
        'UNABLE_TO_VERIFY': {
            color: 'bg-slate-50 text-slate-500 border-slate-200',
            icon: SearchX,
            label: 'Unable to Verify'
        },
        'CLEARED': {
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            icon: ShieldCheck,
            label: 'Cleared'
        },
        'DEFAULT': {
            color: 'bg-slate-50 text-slate-400 border-slate-100',
            icon: FileText,
            label: 'Unknown'
        }
    };
    const statusKey = status?.toUpperCase()?.replace(/\s+/g, '_') || 'DEFAULT';
    const config = statusConfig[statusKey] || statusConfig.DEFAULT;
    const Icon = config.icon;

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                {label}
            </span>
            <span className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${config.color}`}>
                <Icon size={14} className={statusKey === 'IN_PROGRESS' ? 'animate-pulse' : ''} />
                {config.label}
            </span>
        </div>
    );
}

export default CandidateStatusLabel;