import React from "react";
import {
    UserPlus,
    Clock,
    Info,
    UserPlusIcon,
    UserCheck,
    ShieldCheck,
    GraduationCap,
    Briefcase, MapPinIcon, DatabaseIcon, UsersIcon, Package
} from "lucide-react";

const CheckIcon = ({ status, label }) => {
    const colors = {
        // Standard States
        cleared: 'bg-emerald-50 text-emerald-500 border-emerald-100',
        inprogress: 'bg-blue-50 text-blue-600 border-blue-200',
        unassigned: 'bg-red-50/50 text-red-400 border-red-200 border-dashed animate-[pulse_3s_infinite]',

        // Actionable States (The New Ones)
        unableto_verify: 'bg-amber-50 text-amber-500 border-amber-200',
        insufficiency: 'bg-orange-50 text-orange-500 border-orange-200',
        failed: 'bg-red-100 text-red-600 border-red-200',
        needsreview: 'bg-violet-50 text-violet-600 border-violet-200',

        // STOP CASE: Muted slate look
        stop_case: 'bg-slate-100 text-slate-400 border-slate-200'
    };

    const getTaskIcon = (taskName) => {
        switch (taskName.toLowerCase()) {
            case 'unassigned': return <UserPlusIcon size={14} />;
            case 'id':
            case 'identity': return <UserCheck size={14} />;
            case 'criminal': return <ShieldCheck size={14} />;
            case 'education': return <GraduationCap size={14} />;
            case 'employment':
            case 'experience': return <Briefcase size={14} />;
            case 'address': return <MapPinIcon size={14} />;
            case 'db check':
            case 'database': return <DatabaseIcon size={14} />;
            case 'reference':
            case 'reference check': return <UsersIcon size={14} />;
            default: return <Package size={14} />;
        }
    };

    return (
        <div className="group/icon relative cursor-help">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 relative     ${colors[status] || 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                {getTaskIcon(label)}

                {/* STRIKE THROUGH FOR STOP CASE: Diagonal line from top-left to bottom-right */}
                {status === 'stop_case' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[140%] h-[1.5px] bg-red-400/70 rotate-45 rounded-full shadow-sm" />
                    </div>
                )}

                {status === 'unassigned' && (
                    <>
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#5D4591] text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg z-10 hover:scale-110 transition-transform">
                            <UserPlus size={10} strokeWidth={3} />
                        </div>
                    </>
                )}

                {/* ON HOLD INDICATOR: Subtle Clock Badge */}
                {status === 'onhold' && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center border border-white shadow-sm">
                        <Clock size={8} strokeWidth={3} />
                    </div>
                )}

                {/* NEEDS REVIEW INDICATOR: Subtle Info Badge */}
                {status === 'needsreview' && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center border border-white shadow-sm">
                        <Info size={8} strokeWidth={3} />
                    </div>
                )}
            </div>

            {/* Tooltip with "Context" */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover/icon:opacity-100 transition-all scale-90 group-hover/icon:scale-100 whitespace-nowrap pointer-events-none z-30 shadow-xl">
                <div className="flex flex-col items-center">
                    <span>{label?.toUpperCase()}: <span className="uppercase ml-1 opacity-70">{status?.replace('unabletoverify', 'Unable to Verify').replace('onhold', 'On Hold').replace('waitingforcandidate', 'Waiting for Candidate').replace('needsreview', 'Needs Review').replace('stop_case', 'Case Stopped')}</span></span>
                    {status === 'unassigned' && (
                        <span className="text-red-400 text-[9px] mt-0.5 flex items-center gap-1">
                             Critical: Progress Blocked
                        </span>
                    )}
                    {status === 'onhold' && (
                        <span className="text-orange-300 text-[9px] mt-0.5">
                             Verification Paused
                        </span>
                    )}
                    {status === 'stop_case' && (
                        <span className="text-slate-300 text-[9px] mt-0.5">
                             Verification Terminated
                        </span>
                    )}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
        </div>
    );
};

export default CheckIcon;
