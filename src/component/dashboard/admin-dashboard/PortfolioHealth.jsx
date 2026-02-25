import React, {useState, useEffect, useRef} from 'react';
import {ArrowUpRight, ArrowDownRight, MinusIcon} from 'lucide-react';
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import {GET_ORGANIZATION_HEALTH_PORTFOLIO} from "../../../constant/Endpoint.tsx";

const PortfolioHealth = () => {
    const [portfolioData, setPortfolioData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {authenticatedRequest} = useAuthApi();
    const initComponentRef = useRef(false);

    const getHealthStyles = (scoreStr) => {
        const score = parseInt(scoreStr.replace('%', '')) || 0;
        if (score >= 95) return { color: "text-emerald-500", bg: "bg-emerald-50" };
        if (score >= 85) return { color: "text-amber-500", bg: "bg-amber-50" };
        return { color: "text-rose-500", bg: "bg-rose-50" };
    };

    useEffect(() => {
        const fetchPortfolioHealth = async () => {
            setIsLoading(true);
            try {
                const response = await authenticatedRequest(undefined, GET_ORGANIZATION_HEALTH_PORTFOLIO, METHOD.GET);
                if(response.status === 200) {
                    setPortfolioData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch portfolio data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if(!initComponentRef.current) {
            initComponentRef.current = true;
            fetchPortfolioHealth();
        }
    }, []);

    const renderTrend = (org) => {
        if (org.trend === 'up') {
            return {
                icon: <ArrowUpRight size={12} strokeWidth={3} />,
                style: 'bg-rose-50 text-rose-600',
                text: 'Slowing Down'
            };
        }
        if (org.trend === 'down') {
            return {
                icon: <ArrowDownRight size={12} strokeWidth={3} />,
                style: 'bg-emerald-50 text-emerald-600',
                text: 'Improving Speed'
            };
        }
        return {
            icon: <MinusIcon size={12} strokeWidth={3} />,
            style: 'bg-slate-50 text-slate-400',
            text: 'Stable Performance'
        };
    };

    return (
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">Portfolio Health</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time SLA Tracking</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-4 items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> SLA Breach</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Pending Checks</div>
                </div>
            </div>

            {/* Scrollable Container with Sticky Header Logic */}
            <div className="overflow-y-auto overflow-x-auto max-h-[450px] pr-2 custom-scrollbar">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                    <tr className="text-left">
                        {/* Sticky Header Cells */}
                        <th className="sticky top-0 z-10 bg-white pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Client Identity</th>
                        <th className="sticky top-0 z-10 bg-white pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Unassigned Checks / Active Cases</th>
                        <th className="sticky top-0 z-10 bg-white pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Avg. Turnaround</th>
                        <th className="sticky top-0 z-10 bg-white pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-50">Health Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {!isLoading && portfolioData.map((org, i) => {
                        const trendMeta = renderTrend(org);
                        const stallRate = (org.affectedCases / org.total) * 100;
                        const styles = getHealthStyles(org.score);

                        return (
                            <tr key={i} className="group cursor-pointer hover:bg-slate-50/80 transition-all duration-300">
                                <td className="py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-11 h-11 p-2 rounded-[14px] bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:border-[#5D4591]/20 transition-all duration-500">
                                                {org.logoUrl ? (
                                                    <img
                                                        src={org.logoUrl}
                                                        alt={org.name.charAt(0)}
                                                        className="w-full h-full object-contain" // Ensures logo doesn't stretch
                                                        onError={(e) => { e.target.style.display = 'none'; }} // Simple fallback trigger
                                                    />
                                                ) : (
                                                    <span className="text-md font-black text-slate-400">
                                                        {org.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* The Notification Badge stays exactly where it is - it looks great! */}
                                            {org.breaches > 0 && (
                                                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5" title={`${org.breaches} Cases Breached SLA`}>
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-600 text-[9px] font-black text-white items-center justify-center border-2 border-white">
                                                        {org.breaches}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-sm font-black text-slate-800">{org.name}</div>
                                            <div className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
                                                {org.breaches > 0 ? `${org.breaches} IMMEDIATE BREACHES` : 'ALL CASES ON TRACK'}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="text-center">
                                    <div className="inline-block text-left min-w-[120px]">
                                        <div className="flex items-baseline gap-1 justify-center">
                                            <span className="text-sm font-black text-rose-600">{org.unassigned}</span>
                                            <span className="text-[10px] font-bold text-slate-400">Checks Pending</span>
                                        </div>
                                        <div className="mt-1.5 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${stallRate > 50 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                                style={{ width: `${stallRate}%` }}
                                            />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 text-center mt-1 uppercase">
                                            Impacts {org.affectedCases} of {org.total} Cases
                                        </p>
                                    </div>
                                </td>

                                <td className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-sm font-black text-slate-700">{org.tat}</span>
                                        <div className={`p-1 rounded-md ${org.trend === 'up' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {trendMeta.icon}
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-300 uppercase mt-1 tracking-tighter">
                                        {trendMeta.text}
                                    </p>
                                </td>

                                <td className="text-right">
                                    <div className="flex flex-col items-end">
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-sm ${styles.bg} ${styles.color} border border-white`}>
                                                {org.score}
                                            </span>
                                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Overall Health</span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortfolioHealth;
