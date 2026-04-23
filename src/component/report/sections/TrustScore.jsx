// components/bgv/sections/TrustScore.jsx
import { CheckSquare, Minus, TrendingDown } from "lucide-react";
import {GlassCard} from "./HelperComponent.jsx";

export const TrustScore = ({ trustScore }) => {
    const pct = (trustScore.score / trustScore.maxScore) * 100;

    return (
        <GlassCard className="p-10">
            <div className="flex flex-col lg:flex-row gap-10">

                {/* ── Score Gauge ── */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="relative w-40 h-40">
                        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                            <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                            <circle
                                cx="70" cy="70" r="58" fill="none"
                                stroke={pct >= 85 ? "#00d492" : pct >= 60 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 58}`}
                                strokeDashoffset={`${2 * Math.PI * 58 * (1 - pct / 100)}`}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-slate-800">{trustScore.score}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">/ {trustScore.maxScore}</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Trust Score</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{trustScore.confidence}</p>
                    </div>
                </div>

                {/* ── Score Breakdown ── */}
                <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Score Breakdown
                    </p>
                    <div className="space-y-2">
                        {trustScore.breakdown.map((item, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                                    item.isFinal
                                        ? "bg-indigo-50 border border-indigo-100"
                                        : item.deduction
                                            ? "bg-amber-50 border border-amber-100"
                                            : "bg-slate-50"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {item.deduction ? (
                                        <TrendingDown size={12} className="text-amber-500 shrink-0" />
                                    ) : item.isFinal ? (
                                        <CheckSquare size={12} className="text-indigo-500 shrink-0" />
                                    ) : (
                                        <Minus size={12} className="text-slate-300 shrink-0" />
                                    )}
                                    <div>
                                        <p className={`text-xs font-black ${
                                            item.isFinal ? "text-indigo-700" :
                                                item.deduction ? "text-amber-700" : "text-slate-600"
                                        }`}>
                                            {item.label}
                                        </p>
                                        {item.note && (
                                            <p className="text-[9px] font-medium text-slate-400">{item.note}</p>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-xs font-black tabular-nums ${
                                    item.points < 0 ? "text-amber-600" :
                                        item.isFinal  ? "text-indigo-700" : "text-slate-400"
                                }`}>
                  {item.points > 0 && !item.isFinal ? `+${item.points}` : item.points} pts
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Verdict ── */}
                <div className="lg:w-72 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[1.5rem] p-8 text-white flex flex-col justify-between">
                    <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                            Overall Verdict
                        </p>
                        <p className="text-xl font-black text-white leading-tight mb-4">
                            {trustScore.verdict}
                        </p>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed">
                            {trustScore.verdictDetail}
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase">Risk Level</p>
                            <p className="text-sm font-black text-emerald-400 mt-0.5">{trustScore.riskLevel}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase">Confidence</p>
                            <p className="text-sm font-black text-indigo-400 mt-0.5">{trustScore.confidence}</p>
                        </div>
                    </div>
                </div>

            </div>
        </GlassCard>
    );
};
