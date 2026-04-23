// components/bgv/sections/FinalRecommendation.jsx
import { CheckSquare, TrendingDown } from "lucide-react";

export const FinalRecommendation = ({ trustScore, reportId, companyName, aiEngine }) => (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-10 text-white">

        {/* Verdict */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 shrink-0">
                    <CheckSquare size={30} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Final Recommendation</p>
                    <h2 className="text-3xl font-black text-white mt-1">{trustScore.verdict}</h2>
                    <p className="text-xs font-medium text-slate-400 mt-2 max-w-lg leading-relaxed">
                        {trustScore.verdictDetail}
                    </p>
                </div>
            </div>

            {/* Score Ring */}
            <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative w-28 h-28">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                        <circle
                            cx="60" cy="60" r="50" fill="none"
                            stroke="#818cf8"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - trustScore.score / trustScore.maxScore)}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">{trustScore.score}</span>
                        <span className="text-[9px] font-black text-slate-400">/ {trustScore.maxScore}</span>
                    </div>
                </div>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Trust Score</p>
            </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
                { label: "Trust Score",   value: `${trustScore.score} / ${trustScore.maxScore}` },
                { label: "Risk Level",    value: trustScore.riskLevel    },
                { label: "Confidence",    value: trustScore.confidence   },
                { label: "Verdict",       value: trustScore.verdict      },
            ].map(({ label, value }) => (
                <div key={label} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-black text-white mt-1">{value}</p>
                </div>
            ))}
        </div>

        {/* Score Breakdown Summary */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Score Breakdown Summary
            </p>
            <div className="space-y-2">
                {trustScore.breakdown
                    .filter((b) => b.deduction || b.isFinal)
                    .map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {item.deduction && <TrendingDown size={11} className="text-amber-400" />}
                                <p className={`text-xs font-bold ${item.isFinal ? "text-white" : "text-slate-400"}`}>
                                    {item.label}
                                </p>
                                {item.note && (
                                    <p className="text-[9px] text-slate-500">({item.note})</p>
                                )}
                            </div>
                            <span className={`text-xs font-black tabular-nums ${
                                item.points < 0  ? "text-amber-400" :
                                    item.isFinal     ? "text-indigo-300" : "text-slate-500"
                            }`}>
                {item.points > 0 && !item.isFinal ? `+${item.points}` : item.points} pts
              </span>
                        </div>
                    ))}
            </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-6 text-center space-y-2">
            <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-3xl mx-auto">
                This report is generated by <span className="text-slate-400 font-bold">{aiEngine}</span> and
                is compliant with the Digital Personal Data Protection Act 2023 (India). All data is processed
                on MeitY-certified Tier-4 servers within Indian jurisdiction. This document is cryptographically
                hashed and tamper-evident. Any reproduction without authorisation is strictly prohibited.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
                <a href="mailto:verify@vantira.io" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">
                    verify@vantira.io
                </a>
                <span className="text-slate-700">·</span>
                <a href="mailto:legal@vantira.io" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">
                    legal@vantira.io
                </a>
                <span className="text-slate-700">·</span>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    © 2026 {companyName}
                </p>
            </div>
        </div>
    </div>
);
