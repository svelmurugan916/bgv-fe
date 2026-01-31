import {AlertCircle, Clock, FileText, SearchX, ShieldCheck, XCircle} from "lucide-react";
import React from "react";

const CandidateStatusLabel = ({status, label}) => {

    const statusConfig = {
        'IN_PROGRESS': {
            color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
            icon: Clock,
            label: 'In Progress'
        },
        'INSUFFICIENCY': {
            color: 'bg-orange-50 text-orange-600 border-orange-100',
            icon: AlertCircle,
            label: 'Insufficiency Raised'
        },
        'RED': {
            color: 'bg-red-50 text-red-600 border-red-100',
            icon: XCircle,
            label: 'Failed'
        },
        'AMBER': {
            color: 'bg-amber-50 text-amber-500 border-amber-200',
            icon: SearchX,
            label: 'Unable to Verify'
        },
        'GREEN': {
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