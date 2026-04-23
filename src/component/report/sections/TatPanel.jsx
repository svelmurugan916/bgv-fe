// components/bgv/sections/TatPanel.jsx
import { Zap, TrendingUp, Clock } from "lucide-react";

export const TatPanel = ({ report }) => (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            {/* Left */}
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Zap size={28} className="text-yellow-300" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                        ⚡ Platform Speed Snapshot
                    </p>
                    <p className="text-3xl font-black text-white mt-0.5">{report.turnaroundTime}</p>
                    <p className="text-xs font-bold text-indigo-300 mt-0.5">Total Turnaround Time</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
                <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
                    <p className="text-2xl font-black text-white">{report.turnaroundIndustryAvg}</p>
                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mt-1">Industry Average</p>
                </div>
                <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
                    <p className="text-2xl font-black text-yellow-300">{report.turnaroundFasterPercent} Faster</p>
                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mt-1">vs. Industry</p>
                </div>
            </div>

            {/* Right */}
            <div className="bg-white/10 rounded-2xl p-5 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-indigo-300" />
                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Why It Matters</p>
                </div>
                <p className="text-xs font-medium text-indigo-200 leading-relaxed">
                    Every hour of delay = delayed onboarding, lost productivity, and candidate drop-off risk.
                    Vantira eliminates that friction.
                </p>
            </div>

        </div>
    </div>
);
