// components/bgv/checks/ReferenceCheck.jsx
import { CheckSquare, Quote } from "lucide-react";
import { GlassCard, SectionTitle } from "../sections/HelperComponent.jsx";

const RefereeCard = ({ referee }) => (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-black text-slate-800">{referee.name}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{referee.designation}</p>
            </div>
            <div className="text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                    referee.integrityScore >= 90
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                }`}>
                    {referee.integrityScore}%
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Integrity</p>
            </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100">
            <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-indigo-600 font-black text-xs">"</span>
                </div>
                <p className="text-xs font-medium text-slate-600 italic leading-relaxed">
                    {referee.feedback}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-emerald-500 shrink-0" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified</span>
        </div>
    </div>
);

export const ReferenceCheck = ({ data }) => (
    <GlassCard className="p-8">
        <SectionTitle number="7" title="Professional Reference Check" subtitle={data.subtitle} status={data.status} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.referees.map((ref, i) => (
                <RefereeCard key={i} referee={ref} />
            ))}
        </div>
    </GlassCard>
);
