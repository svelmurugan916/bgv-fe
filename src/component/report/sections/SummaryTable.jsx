// components/bgv/sections/SummaryTable.jsx
import { CheckSquare, AlertTriangle, Clock } from "lucide-react";
import { GlassCard } from "./HelperComponent.jsx";

export const SummaryTable = ({ summaryTable }) => (
    <GlassCard className="overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Verification Summary — All 7 Pillars
            </p>
        </div>
        <div className="divide-y divide-slate-50">
            {summaryTable.map((row, i) => (
                <div
                    key={i}
                    className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-slate-50/50 transition-colors"
                >
                    {/* Check Name */}
                    <div className="col-span-3">
                        <p className="text-xs font-black text-slate-800">{row.check}</p>
                    </div>

                    {/* Finding */}
                    <div className="col-span-4">
                        <p className="text-xs font-medium text-slate-500 leading-snug">{row.finding}</p>
                        {row.deduction && (
                            <span className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-md">
                <AlertTriangle size={8} /> Score Impact: {row.deduction}
              </span>
                        )}
                    </div>

                    {/* Source */}
                    <div className="col-span-3">
                        <p className="text-[10px] font-bold text-slate-400">{row.source}</p>
                    </div>

                    {/* TAT */}
                    <div className="col-span-1 flex items-start">
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
              <Clock size={9} /> {row.tat}
            </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-start justify-end">
                        {row.status === "VERIFIED" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-lg">
                <CheckSquare size={9} strokeWidth={2.5} /> OK
              </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-lg">
                <AlertTriangle size={9} strokeWidth={2.5} /> Flag
              </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </GlassCard>
);
