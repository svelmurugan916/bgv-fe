import React, { useState } from 'react';
import {Download, Filter, FileText, TrendingUp, AlertCircle, IndianRupeeIcon} from 'lucide-react';
import RevenueKpiGrid from "./RevenueKpiGrid.jsx";
import InvoiceTable from "./InvoiceTable.jsx";
import WalletMonitor from "./WalletMonitor.jsx";


 const mockRevenueData = {
    summary: {
        totalMrr: 124500,
        mrrGrowth: 12.5,
        projectedRevenue: 138000,
        overageRevenue: 14200, // Revenue from checks beyond plan limits
        collectionRate: 98.2,
        pendingInvoices: 8
    },
    revenueTrend: [
        { month: 'Jan', revenue: 98000 },
        { month: 'Feb', revenue: 105000 },
        { month: 'Mar', revenue: 118000 },
        { month: 'Apr', revenue: 124500 }
    ],
    invoices: [
        {
            id: "INV-2024-001",
            tenantName: "TechNova Solutions",
            amount: 4500.00,
            date: "2024-04-01",
            status: "Paid",
            plan: "Enterprise",
            method: "Credit Card"
        },
        {
            id: "INV-2024-002",
            tenantName: "Global Logistics Inc",
            amount: 1200.00,
            date: "2024-04-02",
            status: "Pending",
            plan: "Professional",
            method: "Bank Transfer"
        },
        {
            id: "INV-2024-003",
            tenantName: "Apex Retail Group",
            amount: 850.00,
            date: "2024-03-28",
            status: "Overdue",
            plan: "Basic",
            method: "Direct Debit"
        }
    ],
    walletAlerts: [
        { tenant: "Swift Healthcare", balance: 12.50, avgMonthlyBurn: 450.00 },
        { tenant: "CloudScale Systems", balance: 85.00, avgMonthlyBurn: 1200.00 }
    ]
};


const RevenueBillingManager = () => {
    const [filterStatus, setFilterStatus] = useState("All");

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue & Billing</h1>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider">Financial performance, invoicing, and wallet management</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                        <Download size={18} /> Export Finance Report
                    </button>
                    <button className="flex items-center gap-2 bg-[#5D4591] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:scale-[1.02] transition-all">
                        <IndianRupeeIcon size={18} /> Manage Pricing Plans
                    </button>
                </div>
            </div>

            {/* Financial KPIs */}
            <RevenueKpiGrid summary={mockRevenueData.summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Invoice Table (Admin Focus) */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recent Transactions</h3>
                        <div className="flex gap-2">
                            {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${filterStatus === s ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <InvoiceTable invoices={mockRevenueData.invoices} filter={filterStatus} />
                </div>

                {/* Wallet & Sales Action Monitor (Sales Focus) */}
                <div className="lg:col-span-1">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Actionable Wallet Alerts</h3>
                    <WalletMonitor alerts={mockRevenueData.walletAlerts} />
                </div>
            </div>
        </div>
    );
};

export default RevenueBillingManager;
