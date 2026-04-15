import React, {useState, useEffect, useRef} from 'react';
import {
    LayoutDashboard, Maximize2, TrendingUp, Users,
    CreditCard, ShieldAlert, Zap, BarChart3, Clock, AlertOctagon
} from 'lucide-react';
import AdminStatGrid from "./AdminStatGrid.jsx";
import AdminActionCenter from "./AdminActionCenter.jsx";
import TenantInsightsGrid from "./TenantInsightsGrid.jsx";
import SystemOverviewHeader from "../tenant-admin-dashboard/SystemOverviewHeader.jsx";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {ADMIN_DASHBOARD} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";


const mockAdminData = {
    // --- TOP LEVEL STATS (AdminStatGrid) ---
    mrr: 124500,
    mrrGrowth: 14.2,
    activeTenants: 48,
    onboardingCount: 12,
    avgTat: 3.2,
    apiSuccessRate: 99.8,

    // --- CRITICAL ALERTS (AdminActionCenter) ---
    criticalAlerts: {
        lowWallets: 4,
        apiOutages: 1,
        expiringContracts: 3
    },

    // --- CHURN RISK MONITOR (TenantInsightsGrid) ---
    churnRiskList: [
        {
            id: "t1",
            tenantName: "TechNova Solutions",
            lastActivity: "28 Days Ago",
            healthScore: 32,
            actionRoute: "/admin/tenants/technova"
        },
        {
            id: "t2",
            tenantName: "Global Logistics Inc",
            lastActivity: "22 Days Ago",
            healthScore: 45,
            actionRoute: "/admin/tenants/global-logistics"
        },
        {
            id: "t3",
            tenantName: "Apex Retail Group",
            lastActivity: "31 Days Ago",
            healthScore: 18,
            actionRoute: "/admin/tenants/apex"
        }
    ],

    // --- UPSELL OPPORTUNITIES (TenantInsightsGrid) ---
    upsellList: [
        {
            id: "u1",
            tenantName: "FinEdge Banking",
            currentPlan: "Professional",
            missingFeature: "AI Face Match",
            actionRoute: "/sales/upsell/finedge"
        },
        {
            id: "u2",
            tenantName: "Swift Healthcare",
            currentPlan: "Basic",
            missingFeature: "Live GPS Verification",
            actionRoute: "/sales/upsell/swift"
        },
        {
            id: "u3",
            tenantName: "CloudScale Systems",
            currentPlan: "Professional",
            missingFeature: "Global Database Access",
            actionRoute: "/sales/upsell/cloudscale"
        }
    ],

    // --- ONBOARDING PIPELINE (TenantInsightsGrid) ---
    onboardingList: [
        {
            id: "o1",
            tenantName: "Astra Corp",
            stage: "API Integration",
            daysInSetup: 14,
            actionRoute: "/admin/onboarding/astra"
        },
        {
            id: "o2",
            tenantName: "Blue Horizon Ltd",
            stage: "Document Verification",
            daysInSetup: 5,
            actionRoute: "/admin/onboarding/blue-horizon"
        },
        {
            id: "o3",
            tenantName: "Zenith Enterprises",
            stage: "Legal Review",
            daysInSetup: 22,
            actionRoute: "/admin/onboarding/zenith"
        }
    ],

    // --- VOLUME BREAKDOWN (TenantInsightsGrid) ---
    volumeBreakdown: [
        { type: "Address Verification", percentage: 42 },
        { type: "Criminal Record Check", percentage: 28 },
        { type: "Education History", percentage: 18 },
        { type: "Employment History", percentage: 12 }
    ]
};


const AdminSystemDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [density, setDensity] = useState('comfortable');
    const [adminData, setAdminData] = useState(null);
    const componentMountedRef = useRef(false);
    const {authenticatedRequest} = useAuthApi();

    useEffect(() => {

        const fetchDashboardDetails = async () => {
            try {
                const response = await authenticatedRequest(undefined, ADMIN_DASHBOARD, METHOD.GET);
                if (response.status === 200) {
                    setAdminData(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        if(!componentMountedRef.current) {
            componentMountedRef.current = true;
            fetchDashboardDetails();
        }
    }, []);

    return (
        <div className={`bg-[#F8F9FB] min-h-screen transition-all duration-500 ${density === 'compact' ? 'p-4' : 'p-8'}`}>

            {/* HEADER: Sales & Admin Focus */}
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Command Center</h1>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider">Multi-Tenant Overview & Revenue Analytics</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm mr-2">
                        <button onClick={() => setDensity('comfortable')} className={`p-2 rounded-lg transition-all ${density === 'comfortable' ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutDashboard size={16} /></button>
                        <button onClick={() => setDensity('compact')} className={`p-2 rounded-lg transition-all ${density === 'compact' ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><Maximize2 size={16} /></button>
                    </div>
                </div>
            </header>

            {/* CRITICAL BUSINESS ALERTS (Low Wallets, API Down, Contract Expiry) */}
            <AdminActionCenter
                isLoading={isLoading}
                alerts={adminData?.criticalAlerts}
            />

            {/* TOP LEVEL REVENUE & GROWTH KPIs */}
            <AdminStatGrid adminData={adminData} isLoading={isLoading} density={density} />

            {/* DETAILED INSIGHTS: Churn, Onboarding, and Upsell */}
            <TenantInsightsGrid adminData={adminData} isLoading={isLoading} />

        </div>
    );
};

export default AdminSystemDashboard;
