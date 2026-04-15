import React from 'react';
import { AlertCircle, CreditCard, ShieldAlert } from 'lucide-react';

const AdminActionCenter = ({ isLoading, alerts }) => {
    if (isLoading) return <div className="h-24 bg-slate-100 animate-pulse rounded-[2rem] mb-8" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Wallet Alerts */}
            <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="p-3 bg-amber-500 rounded-xl text-white">
                    <CreditCard size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase">Wallet Alerts</p>
                    <p className="text-sm font-bold text-slate-800">{alerts?.lowWallets} Tenants with Low Balance</p>
                </div>
            </div>

            {/* API Outages */}
            <div className="flex items-center gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                <div className="p-3 bg-rose-500 rounded-xl text-white">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-rose-600 uppercase">System Integrity</p>
                    <p className="text-sm font-bold text-slate-800">{alerts?.apiOutages} Vendor APIs Offline</p>
                </div>
            </div>

            {/* Renewal Alerts */}
            <div className="flex items-center gap-4 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="p-3 bg-[#5D4591] rounded-xl text-white">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-[#5D4591] uppercase">Renewals</p>
                    <p className="text-sm font-bold text-slate-800">{alerts?.expiringContracts} Contracts Expiring soon</p>
                </div>
            </div>
        </div>
    );
};

export default AdminActionCenter;
