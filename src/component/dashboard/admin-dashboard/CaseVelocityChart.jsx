import {Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {useEffect, useRef, useState} from "react";
import {GET_MONTH_WISE_DETAILS, GET_THROUGHPUT_DATA} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {Zap, Target, Layers, ArrowUpRight, MinusIcon, ArrowDownRightIcon} from 'lucide-react';
import CaseVelocityLoader from "./CaseVelocityLoader.jsx";

const CaseVelocityChart = ({activeCases, isLoading}) => {
    const [isMonthWiseDataLoading, setIsMonthWiseDataLoading] = useState(true);
    const [isThroughputDataLoading, setIsThroughputDataLoading] = useState(true);
    const [performanceTrendData, setPerformanceTrendData] = useState(null);
    const [throughputMetrics, setThroughputMetrics] = useState(null);
    const {authenticatedRequest} = useAuthApi();

    const initCompRef = useRef(false);

    const fetchMonthWiseData = async () => {
        try {
            setIsMonthWiseDataLoading(true);
            const response = await authenticatedRequest(undefined, GET_MONTH_WISE_DETAILS, METHOD.GET);
            if(response.status === 200) {
                setPerformanceTrendData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch month Wise", error);
        } finally {
            setIsMonthWiseDataLoading(false);
        }
    }

    const fetchThroughputAndEssentialData = async () => {
        try {
            setIsThroughputDataLoading(true);
            const response = await authenticatedRequest(undefined, GET_THROUGHPUT_DATA, METHOD.GET);
            if(response.status === 200) {
                setThroughputMetrics(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch month Wise", error);
        } finally {
            setIsThroughputDataLoading(false);
        }
    }

    useEffect(() => {
        if(!initCompRef.current) {
            initCompRef.current = true;
            fetchMonthWiseData();
            fetchThroughputAndEssentialData();
        }
    }, [])

    const getTrendStyle = (trend) => {
        if (trend > 0) return {
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: <ArrowUpRight size={10} strokeWidth={3} />
        };
        if (trend < 0) return {
            color: "text-rose-600",
            bg: "bg-rose-50",
            icon: <ArrowDownRightIcon size={10} strokeWidth={3} />
        };
        return {
            color: "text-slate-500",
            bg: "bg-slate-50",
            icon: <MinusIcon size={10} strokeWidth={3} />
        };
    };

    const trendStyle = getTrendStyle(throughputMetrics?.trendPercentage);


    return (
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-full">
            {(isMonthWiseDataLoading) ? <CaseVelocityLoader /> : (
                <>
                    <div className="flex justify-between items-start mb-8 shrink-0">
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-slate-900">Case Velocity vs. TAT</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly Efficiency Trend</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Completed</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Avg. TAT</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Container - Flex Grow to take available space */}
                    <div className="flex-grow min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={performanceTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#f43f5e', fontSize: 10, fontWeight: 700}} />
                                <Tooltip
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar yAxisId="left" dataKey="completed" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                                <Line yAxisId="right" type="monotone" dataKey="avgTat" stroke="#f43f5e" strokeWidth={4} dot={{ r: 4, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* NEW: Operational Metric Grid (The "Space Filler") */}
                    <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-6 shrink-0">
                        {/* Metric 1: Throughput */}
                        {
                            isThroughputDataLoading ? (
                                [1, 2].map((i) => (
                                    <div key={i} className="p-4 rounded-[24px] border border-slate-50 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                                            <div className="h-3 w-20 bg-slate-100 rounded-md" />
                                        </div>
                                        <div className="h-7 w-24 bg-slate-100 rounded-xl" />
                                        <div className="h-2 w-32 bg-slate-50 rounded-md" />
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <Zap size={14} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Throughput</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-black text-slate-900">
                                                {throughputMetrics?.currentThroughput?.toLocaleString()}
                                            </span>

                                            {/* The Trend Badge */}
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${trendStyle.bg} ${trendStyle.color}`}>
                                                {trendStyle.icon}
                                                {Math.abs(throughputMetrics?.trendPercentage)}%
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1">Cases closed this month</p>
                                    </div>

                                    {/* Metric 2: Efficiency Ratio */}
                                    <div className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <Target size={14} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Efficiency</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-black text-slate-900">{throughputMetrics?.efficiency}%</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1">Completion vs. Intake ratio</p>
                                    </div>
                                </>
                            )
                        }
                        {/* Metric 3: Active Backlog */}
                        {
                            isLoading ? (
                                <div className="p-4 rounded-[24px] border border-slate-50 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                                        <div className="h-3 w-20 bg-slate-100 rounded-md" />
                                    </div>
                                    <div className="h-7 w-24 bg-slate-100 rounded-xl" />
                                    <div className="h-2 w-32 bg-slate-50 rounded-md" />
                                </div>
                            ) : (
                                <div className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                            <Layers size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Current Load</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-black text-slate-900">{activeCases}</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1">Active cases in queue</p>
                                </div>
                            )
                        }

                    </div>
                </>
            )}
        </div>
    )
}

export default CaseVelocityChart;
