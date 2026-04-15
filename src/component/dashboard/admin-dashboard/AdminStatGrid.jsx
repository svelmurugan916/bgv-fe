import React from "react";
import StatCard from "../tenant-admin-dashboard/StatCard.jsx";
import {Users, Zap, Clock, IndianRupeeIcon} from "lucide-react";

const AdminStatGrid = ({ adminData, isLoading, density }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Monthly Recurring Revenue (MRR) */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={IndianRupeeIcon}
                label="Total MRR"
                value={`₹${adminData?.mrr?.toLocaleString()}`}
                subText={`+${adminData?.mrrGrowth}% vs last month`}
                trend={adminData?.mrrGrowth}
                trendType="up"
                color="bg-emerald-500"
                infoText="Current predictable revenue generated from all active tenant subscriptions."
            />

            {/* 2. Active Tenants vs Onboarding */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Users}
                label="Active Tenants"
                value={adminData?.activeTenants}
                subText={`${adminData?.onboardingCount} Currently Onboarding`}
                color="bg-[#5D4591]"
                infoText="Total number of companies actively running checks vs those in setup phase."
            />

            {/* 3. Global Average TAT */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Clock}
                label="Global Avg TAT"
                value={`${adminData?.avgTat} Days`}
                subText="0.4 Days faster than last month"
                trend={12}
                trendType="up"
                color="bg-amber-500"
                infoText="The North Star metric: Average time to complete a full verification across the platform."
            />

            {/* 4. API Health Score */}
            <StatCard
                loading={isLoading}
                density={density}
                icon={Zap}
                label="API Success Rate"
                value={`${adminData?.apiSuccessRate}%`}
                subText="All 12 Vendors Operational"
                color="bg-blue-500"
                infoText="Performance of external verification APIs (Aadhar, PAN, Court Records)."
            />
        </div>
    );
};

export default AdminStatGrid;
