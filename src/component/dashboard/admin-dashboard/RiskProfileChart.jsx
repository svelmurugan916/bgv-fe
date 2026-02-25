import React, {useEffect, useRef, useState} from "react";
import {Pie, PieChart, ResponsiveContainer, Tooltip, Cell} from "recharts";
import {Skeleton} from "./SkeletonLoading.jsx";
import {GET_RISK_PROFILE_DATA} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";

const RiskProfileChart = () => {
    const [isRiskProfileDataLoading, setIsRiskProfileDataLoading] = useState(true);
    const [riskDistributionData, setRiskDistributionData] = useState(null);
    const {authenticatedRequest} = useAuthApi();
    const initCompRef = useRef(false);

    const riskDistributionDataColor = {
        "GREEN": "#15c58b",
        "AMBER": "#8b5cf6",
        "RED": "#f59e0b",
        "SLA_BREACH": "#f43f5e"
    }

    const fetchRiskProfileData = async () => {
        try {
            setIsRiskProfileDataLoading(true);
            const response = await authenticatedRequest(undefined, GET_RISK_PROFILE_DATA, METHOD.GET);
            if(response.status === 200) {
                const apiData = response.data;
                setRiskDistributionData(apiData);
            }
        } catch (error) {
            console.error("Failed to fetch month Wise", error);
        } finally {
            setIsRiskProfileDataLoading(false);
        }
    }

    useEffect(() => {
        if(!initCompRef.current) {
            initCompRef.current = true;
            fetchRiskProfileData();
        }
    })

    const totalRiskCases = riskDistributionData?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const redCases = riskDistributionData?.find(item => item.status === 'RED')?.value || 0;
    const calculatedAccuracy = totalRiskCases > 0
        ? (((totalRiskCases - redCases) / totalRiskCases) * 100).toFixed(1)
        : "100.0";
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black tracking-tight">Risk Profile</h3>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</p>
                    <p className="text-xl font-black text-emerald-600">{calculatedAccuracy || 0}%</p>
                </div>
            </div>

            <div className="h-60 relative mb-8">
                {isRiskProfileDataLoading ? <Skeleton className="w-full h-full rounded-full" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={riskDistributionData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={10} dataKey="value" stroke="none">
                                {riskDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={riskDistributionDataColor[entry.status]} />)}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                                formatter={(value) => [`${value} Cases`, 'Volume']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {isRiskProfileDataLoading ? (
                    <div className="col-span-2 text-center py-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        Analyzing Risk Vectors...
                    </div>
                ) : (
                    riskDistributionData.map((item) => {
                        // Calculate percentage on the fly
                        const percentage = totalRiskCases > 0
                            ? ((item.value / totalRiskCases) * 100).toFixed(1)
                            : "0.0";

                        return (
                            <div key={item.status} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: riskDistributionDataColor[item.status] }}
                                    />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">
                            {item.name}
                        </span>
                                </div>

                                <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-800">
                            {percentage}%
                        </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                            ({item.value})
                        </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}
export default RiskProfileChart;