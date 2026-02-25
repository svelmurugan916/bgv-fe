import {AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, Inbox, ShieldCheck, Zap} from "lucide-react";
import React from "react";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "./SkeletonLoading.jsx";

const PriorityActionComponent = ({isLoading, pendingAssignment, casesNearBreach, casesBreached}) => {
    const navigate = useNavigate();

    const THRESHOLDS = {
        PENDING_ASSIGNMENT: 2,
        CASES_NEAR_BREACH: 0,
        CASES_BREACHED: 0,
    };

    // Determine Severity Levels
    const isCritical = casesBreached > THRESHOLDS.CASES_BREACHED;
    const isWarning = (pendingAssignment > THRESHOLDS.PENDING_ASSIGNMENT) || (casesNearBreach > THRESHOLDS.CASES_NEAR_BREACH);
    const showAlerts = isCritical || isWarning;

    // Dynamic Styling based on severity
    const getTheme = () => {
        if (isCritical) return { border: 'border-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', icon: <AlertCircle size={14} className="fill-rose-600 text-white" />, label: 'Critical Action Required' };
        if (isWarning) return { border: 'border-[#5D4591]', text: 'text-[#5D4591]', bg: 'bg-slate-50', icon: <Zap size={14} className="fill-[#5D4591]" />, label: 'Priority Actions Required' };
        return { border: 'border-emerald-500', text: 'text-emerald-600', bg: 'bg-slate-50', icon: <ShieldCheck size={14} className="fill-emerald-600" />, label: 'Operational Status: Optimal' };
    };

    const theme = getTheme();

    return (
        <div className={`mb-8 bg-white border-l-4 rounded-[24px] shadow-sm overflow-hidden transition-all duration-500 ${theme.border}`}>
            <div className={`p-1 ${theme.bg} border-b border-slate-100 flex justify-between items-center px-6 py-2`}>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme.text}`}>
                        {theme.icon}
                        {theme.label}
                    </span>
            </div>
            <div className="p-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <div className="flex-1 ml-4"><Skeleton className="w-32 h-4 mb-2" /><Skeleton className="w-20 h-3" /></div>
                            </div>
                        ))}
                    </div>
                ) : showAlerts ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* 1. CRITICAL: ALREADY BREACHED */}
                        {isCritical && (
                            <div className="flex items-center justify-between group p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center animate-pulse">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-rose-700">{casesBreached} SLA Breaches</p>
                                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight">Immediate Action Required</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* 2. WARNING: NEAR BREACH */}
                        {(casesNearBreach > THRESHOLDS.CASES_NEAR_BREACH) && (
                            <div className="flex items-center justify-between group p-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center transition-colors group-hover:bg-orange-600 group-hover:text-white">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{casesNearBreach} Near Breach</p>
                                        <p className="text-xs text-slate-400 font-medium">Due within 24 hours</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* 3. INFO: UNASSIGNED */}
                        {(pendingAssignment > THRESHOLDS.PENDING_ASSIGNMENT) && (
                            <div className="flex items-center justify-between group p-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#efe8ff] text-[#5D4591] rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#5D4591] group-hover:text-white">
                                        <Inbox size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{pendingAssignment} Unassigned</p>
                                        <p className="text-xs text-slate-400 font-medium">Impacting total TAT</p>
                                    </div>
                                </div>
                                <button onClick={() => navigate("/case-assignment")} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600">All systems nominal. No immediate actions required.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PriorityActionComponent;
