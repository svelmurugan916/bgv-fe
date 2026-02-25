import React, {useState, useEffect, useRef} from 'react';
import {
    LayoutDashboard, Maximize2, GraduationCap, Briefcase
} from 'lucide-react';
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import {GET_SYSTEM_OVERVIEW_DETAILS} from "../../../constant/Endpoint.tsx";
import PortfolioHealth from "./PortfolioHealth.jsx";
import PriorityActionComponent from "./PriorityActionComponent.jsx";
import SystemOverviewHeader from "./SystemOverviewHeader.jsx";
import SummaryStatCardData from "./SummaryStatCardData.jsx";
import CaseVelocityChart from "./CaseVelocityChart.jsx";
import BottleneckData from "./BottleneckData.jsx";
import RiskProfileChart from "./RiskProfileChart.jsx";

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [density, setDensity] = useState('comfortable');
    const [dashboardData, setDashboardData] = useState(null);
    const {authenticatedRequest} = useAuthApi();
    const initCompRef = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const formatDecimal = (val) => val != null ? val.toFixed(1) : "0.0";

    const calculateHealthScore = (data) => {
        const slaScore = (data.slaCompliance || 0) * 0.5;

        const agingFactor = Math.max(0, (10 - (data.pendingAge || 0)) / 10);
        const agingScore = agingFactor * 30;

        const totalWorkload = (data.totalActiveCases || 0) + (data.pendingDocs || 0);
        const stuckCases = (data.insufficiencyCount || 0) + (data.pendingDocs || 0);

        const fluidityRatio = totalWorkload > 0 ? (1 - (stuckCases / totalWorkload)) : 1;
        const blockerScore = Math.max(0, fluidityRatio * 20);

        return Math.round(slaScore + agingScore + blockerScore);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await authenticatedRequest(undefined, GET_SYSTEM_OVERVIEW_DETAILS, METHOD.GET);
                if(response.status === 200) {
                    const apiData = response.data;
                    const mappedData = {
                        ...apiData,
                        displaySlaCompliance: `${apiData.slaCompliance.toFixed(1)}%`,
                        displayAvgTat: `${formatDecimal(apiData.avgTat)} Days`,
                        displayPendingAge: `${formatDecimal(apiData.pendingAge)}d`,
                        backlogAgeBreakdown: apiData.backLogBreakdown.map((item, i) => {
                            const styles = [
                                { color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { color: 'text-amber-600', bg: 'bg-amber-50' },
                                { color: 'text-orange-600', bg: 'bg-orange-50' },
                                { color: 'text-rose-600', bg: 'bg-rose-50' }
                            ];
                            return { ...item, ...styles[i] };
                        }),

                        docsBreakdown: apiData.docsBreakdown.map((item, i) => ({
                            ...item,
                            icon: i === 0 ? <Briefcase size={12}/> : <GraduationCap size={12}/>,
                            color: i === 0 ? 'text-blue-600' : 'text-indigo-600',
                            bg: i === 0 ? 'bg-blue-50' : 'bg-indigo-50'
                        })),

                        healthScore: calculateHealthScore(apiData)
                    };

                    setDashboardData(mappedData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if(!initCompRef.current) {
            initCompRef.current = true;
            fetchDashboardData();
        }
    }, []);

    return (
        <div className={`bg-[#F8F9FB] min-h-screen font-sans text-slate-800 transition-all duration-500 ${density === 'compact' ? 'p-4' : 'p-8'}`}>

            {/* 1. Header Section */}
            <header className="flex justify-between items-end mb-8">
                <SystemOverviewHeader dashboardData={dashboardData} isLoading={isLoading}/>

                <div className="flex gap-3">
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm mr-2">
                        <button onClick={() => setDensity('comfortable')} className={`p-2 rounded-lg transition-all ${density === 'comfortable' ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutDashboard size={16} /></button>
                        <button onClick={() => setDensity('compact')} className={`p-2 rounded-lg transition-all ${density === 'compact' ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><Maximize2 size={16} /></button>
                    </div>
                    {/*<div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">*/}
                    {/*    {['24h', '7d', 'All'].map((t) => (*/}
                    {/*        <button key={t} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${t === 'All' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            </header>

            {/* 2. PRIORITY ACTION CENTER */}
            <PriorityActionComponent isLoading={isLoading} pendingAssignment={dashboardData?.pendingAssignment} casesNearBreach={dashboardData?.casesNearBreach} casesBreached={dashboardData?.slaBreachedCount}/>

            {/* 3. CONSOLIDATED KPI GRID */}
            <SummaryStatCardData dashboardData={dashboardData} isLoading={isLoading} density={density} />

            {/* 4. Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <CaseVelocityChart activeCases={dashboardData?.totalActiveCases} isLoading={isLoading}/>
                <BottleneckData />

            </div>

            {/* 5. Bottom Row: Risk Profile & Client Table (RESTORED & UPGRADED) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Risk Profile Card */}
                <RiskProfileChart />

                {/* Top Performing Clients Table */}
                <PortfolioHealth />

            </div>
        </div>
    );
};

export default AdminDashboard;
