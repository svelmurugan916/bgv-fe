import { Skeleton } from "./SkeletonLoading.jsx";
import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {GET_OPERATIONS_BOTTLENECK_DATA} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";

const BottleneckData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bottleneckData, setBottleneckData] = useState([]);
    const [strategicInsight, setStrategicInsight] = useState("");
    const [criticalBreaches, setCriticalBreaches] = useState(0);
    const { authenticatedRequest } = useAuthApi();

    // ─── Helper: derive bar color from SLA deviation ───────────────────────────
    const getColor = (slaDeviationDays) => {
        if (slaDeviationDays > 5)  return "bg-rose-500";    // Critical
        if (slaDeviationDays > 0)  return "bg-amber-500";   // Warning
        return "bg-emerald-500";                              // On Track
    };

    // ─── Helper: format trend value ────────────────────────────────────────────
    const formatTrend = (trendDays) => {
        if (trendDays > 0)  return `+${trendDays.toFixed(1)}d`;
        if (trendDays < 0)  return `${trendDays.toFixed(1)}d`;
        return "0.0d";
    };

    // ─── Fetch API Data ────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchBottleneckData = async () => {
            setIsLoading(true);
            try {
                const response = await authenticatedRequest(undefined, GET_OPERATIONS_BOTTLENECK_DATA, METHOD.GET); // 👈 Replace with your actual endpoint
                if(response.status === 200) {
                    const data = await response.data;

                    // Map API response to component structure
                    const mapped = data.taskCompletionByTypeDTOList.map((item) => ({
                        type:       item.taskType,
                        currentTat: parseFloat(item.currentTatDays.toFixed(1)),
                        targetTat:  item.goalTatDays,
                        volume:     item.checksCount,
                        trend:      formatTrend(item.trendDays),
                        deviation:  item.slaDeviationDays,
                        color:      getColor(item.slaDeviationDays),
                    }));

                    // Sort by SLA deviation descending (most painful first)
                    const sorted = mapped.sort((a, b) => b.deviation - a.deviation);

                    // Count critical breaches (deviation > 5 days, adjust threshold as needed)
                    const breaches = sorted.filter((item) => item.deviation > 5).length;

                    setBottleneckData(sorted);
                    setStrategicInsight(data.strategicInsight);
                    setCriticalBreaches(breaches);
                }
            } catch (error) {
                console.error("Failed to fetch bottleneck data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBottleneckData();
    }, []);

    // ─── Loading State ─────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-32 mb-8" />
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full mb-4" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">
                        Operational Bottlenecks
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Ranked by SLA Deviation
                    </p>
                </div>

                {/* Critical Breaches Badge — driven by API data */}
                {criticalBreaches > 0 && (
                    <div className="bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 flex items-center gap-2">
                        <AlertTriangle size={12} className="text-rose-600" />
                        <span className="text-[10px] font-black text-rose-600 uppercase">
                            {criticalBreaches} Critical {criticalBreaches === 1 ? "Breach" : "Breaches"}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Scrollable Grid ──────────────────────────────────────────────── */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    {bottleneckData.map((item) => {
                        const isOverTarget   = item.currentTat > item.targetTat;
                        const progressWidth  = Math.min((item.currentTat / (item.targetTat * 1.5)) * 100, 100);
                        const targetMarkerPos = (item.targetTat / (item.targetTat * 1.5)) * 100;

                        return (
                            <div key={item.type} className="flex flex-col">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                                            {item.type}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400">
                                            {item.volume} Checks
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-black ${isOverTarget ? "text-rose-600" : "text-slate-900"}`}>
                                            {item.currentTat}d
                                        </span>
                                        {/* Trend indicator */}
                                        <div className={`flex items-center justify-end gap-0.5 text-[8px] font-bold ${isOverTarget ? "text-rose-400" : "text-emerald-500"}`}>
                                            {item.trend.startsWith("+") && <TrendingUp size={8} />}
                                            {item.trend.startsWith("-") && <TrendingDown size={8} />}
                                            {item.trend}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative w-full h-2 bg-slate-50 rounded-full border border-slate-100">
                                    <div
                                        className="absolute top-[-2px] bottom-[-2px] w-px bg-slate-300 z-10"
                                        style={{ left: `${targetMarkerPos}%` }}
                                    />
                                    <div
                                        className={`h-full rounded-full ${item.color}`}
                                        style={{ width: `${progressWidth}%` }}
                                    />
                                </div>

                                <div className="flex justify-between mt-1 text-[8px] font-bold uppercase text-slate-400">
                                    <span>Goal: {item.targetTat}d</span>
                                    {isOverTarget && (
                                        <span className="text-rose-500">
                                            +{(item.currentTat - item.targetTat).toFixed(1)}d
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Strategic Insight — driven by API data ───────────────────────── */}
            {strategicInsight && (
                <div className="mt-6 p-4 bg-slate-900 rounded-[20px] text-white shrink-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <p className="text-[8px] font-black text-amber-400 uppercase tracking-[0.2em]">
                            Strategic Insight
                        </p>
                    </div>
                    {/* Highlight task types mentioned in the insight */}
                    <p className="text-[11px] font-medium opacity-90 leading-relaxed">
                        {highlightTaskTypes(strategicInsight, bottleneckData)}
                    </p>
                </div>
            )}
        </div>
    );
};

// ─── Helper: Bold-highlight task type names found in the insight string ────────
const highlightTaskTypes = (insight, data) => {
    if (!data.length) return insight;

    // Remove "Strategic Insight: " prefix if present
    const cleanInsight = insight.replace(/^Strategic Insight:\s*/i, "");

    // Split insight by known task type names and highlight them
    const typeNames = data.map((d) => d.type);
    const regex = new RegExp(`(${typeNames.join("|")})`, "gi");
    const parts = cleanInsight.split(regex);

    return parts.map((part, i) =>
        typeNames.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
            <span key={i} className="text-amber-400 font-bold">{part}</span>
        ) : (
            part
        )
    );
};

export default BottleneckData;
