// components/bgv/checks/CriminalCheck.jsx
import { Shield } from "lucide-react";
import { GlassCard, SectionTitle } from "../sections/HelperComponent.jsx";

export const CriminalCheck = ({ data }) => {
    const pct = ((data.riskMax - data.riskScore) / data.riskMax) * 100;
    return (
        <GlassCard className="p-8">
            <SectionTitle number="2" title="Criminal Record Audit" subtitle={data.subtitle} status={data.status} />
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <Shield size={20} className="text-emerald-600" />
                        </div>
                        <p className="text-sm font-black text-emerald-700">{data.finding}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed pl-13 ml-13">
                        {data.detail}
                    </p>
                </div>
                {/* Risk Score Gauge */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative w-28 h-28">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                            <circle
                                cx="60" cy="60" r="50" fill="none"
                                stroke="#10b981"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-800">{data.riskScore}</span>
                            <span className="text-[9px] font-black text-slate-400">/ {data.riskMax}</span>
                        </div>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Score</p>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">
            {data.riskCategory}
          </span>
                </div>
            </div>
        </GlassCard>
    );
};
