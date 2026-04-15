import React from 'react';
import { AlertOctagon, UserPlus, Star, BarChart3, ArrowUpRight } from 'lucide-react';
import ActionableCheckList from "../operation-dashboard/ActionableCheckList.jsx";

const TenantInsightsGrid = ({ adminData, isLoading }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CHURN RISK: Tenants with no activity */}
            <ActionableCheckList
                title="Churn Risk Monitor"
                icon={AlertOctagon}
                data={adminData?.churnRiskList}
                isLoading={isLoading}
                listType="breached"
                emptyMessage="No tenants at immediate risk."
                columns={[
                    { key: 'tenantName', header: 'Tenant' },
                    { key: 'lastActivity', header: 'Last Check' },
                    { key: 'healthScore', header: 'Health', render: (item) => (
                            <span className="text-rose-600 font-black">{item.healthScore}%</span>
                        )},
                ]}
                actions={[
                    { label: "Contact HR", onClick: (i) => {}, buttonClass: "bg-rose-50 text-rose-600" }
                ]}
            />

            {/* UPSELL OPPORTUNITIES: Feature Adoption */}
            <ActionableCheckList
                title="Upsell Opportunities"
                icon={Star}
                data={adminData?.upsellList}
                isLoading={isLoading}
                listType="pending"
                emptyMessage="All tenants using full feature set."
                columns={[
                    { key: 'tenantName', header: 'Tenant' },
                    { key: 'currentPlan', header: 'Plan' },
                    { key: 'missingFeature', header: 'Missing Feature' },
                ]}
                actions={[
                    { label: "Send Demo", icon: ArrowUpRight, onClick: (i) => {}, buttonClass: "bg-[#5D4591]/10 text-[#5D4591]" }
                ]}
            />

            {/* ONBOARDING PIPELINE */}
            <ActionableCheckList
                title="Onboarding Pipeline"
                icon={UserPlus}
                data={adminData?.onboardingList}
                isLoading={isLoading}
                listType="active"
                columns={[
                    { key: 'tenantName', header: 'Tenant' },
                    { key: 'stage', header: 'Current Stage' },
                    { key: 'daysInSetup', header: 'Days in Setup' },
                ]}
                actions={[
                    { label: "Expedite", onClick: (i) => {}, buttonClass: "bg-slate-900 text-white" }
                ]}
            />

            {/* REVENUE BY SERVICE TYPE */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <BarChart3 size={20} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">Volume by Check Type</h3>
                </div>
                <div className="space-y-4">
                    {adminData?.volumeBreakdown?.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                                <span>{item.type}</span>
                                <span className="text-[#5D4591]">{item.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#5D4591] rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TenantInsightsGrid;
