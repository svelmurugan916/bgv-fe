import React from 'react';
import { MousePointerClick, StopCircle, ChevronRight, AlertCircle } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const OperationalMetricsBar = ({ invitedCount = 0, stopCaseCount = 0, onInvitedClick }) => {
    if (invitedCount === 0 && stopCaseCount === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mb-6 px-2 animate-in fade-in slide-in-from-top-2 duration-500">

            {/* Invited but not submitted - THE BOTTLENECK */}
            {invitedCount > 0 && (
                <button
                    onClick={onInvitedClick}
                    className="group flex items-center gap-2.5 py-1.5 pr-3 pl-1.5 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-full hover:border-[#5D4591]/30 hover:shadow-sm transition-all cursor-pointer"
                >
                    <div className="relative">
                        <div className="w-7 h-7 bg-[#5D4591] rounded-full flex items-center justify-center text-white shadow-sm">
                            <MousePointerClick size={14} />
                        </div>
                        {/* Attention Pulse for Bottleneck */}
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            Action Pending:
                            <span className="text-[#5D4591] ml-1">{invitedCount} Candidates</span> invited but not submitted
                        </span>
                        <ChevronRight size={14} className="text-[#5D4591] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </button>
            )}

            {/* Stop-Case Count */}
            {stopCaseCount > 0 && (
                <div className="flex items-center gap-2 py-1.5 px-3 bg-white border border-slate-200 rounded-full">
                    <StopCircle size={14} className="text-red-400 fill-red-50" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                        Stop-Cases: <span className="text-slate-900 ml-1">{stopCaseCount}</span>
                    </span>
                    <div className="group relative cursor-help">
                        <AlertCircle size={12} className="text-slate-300" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg shadow-xl z-10 leading-relaxed">
                            These cases have been manually halted and are not currently being processed.
                        </div>
                    </div>
                </div>
            )}

            {/* Divider Line to fill space */}
            <div className="flex-1 h-px bg-gradient-to-r from-slate-100 to-transparent hidden md:block"></div>
        </div>
    );
};

export default OperationalMetricsBar;
