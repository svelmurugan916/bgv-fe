import {RotateCcwIcon, ShieldAlert} from "lucide-react";
import React, {useState} from "react";
import TaskReservationDrawer from "../../transaction/TaskReservationDrawer.jsx";

const CaseInActive = ({taskId, onRevertSuccess, label = "", process = ""}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="flex flex-col items-center animate-in fade-in duration-500 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12">
            {/* Muted/Inactive Icon */}
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-6 border border-rose-100">
                <ShieldAlert size={40} />
            </div>

            <h1 className="text-xl font-black text-slate-900 mb-2">Service Inactive</h1>

            <p className="text-sm text-slate-500 text-center max-w-[400px] leading-relaxed mb-8">
                This {label} check is no longer valid for evaluation because the
                <span className="font-bold text-slate-700"> reserved funds have been released</span>.
                Please re-initiate the reservation to proceed with {process}.
            </p>

            <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
                <RotateCcwIcon   size={14} />
                View Ledger Details
            </button>
            <TaskReservationDrawer taskId={taskId}
                                   isOpen={isDrawerOpen}
                                   onClose={() => setIsDrawerOpen(false)}
                                   onRevertSuccess={onRevertSuccess}
            />
        </div>
    )
}

export default CaseInActive;