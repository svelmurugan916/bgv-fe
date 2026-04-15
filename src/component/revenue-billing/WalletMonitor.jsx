import React from 'react';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

const WalletMonitor = ({ alerts }) => {
    return (
        <div className="space-y-4">
            {alerts.map((alert, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-amber-200 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <AlertCircle size={18} />
                        </div>
                        <button className="p-2 text-slate-400 hover:text-[#5D4591] transition-colors">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm mb-1">{alert.tenant}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-wider">Critical Wallet Balance</p>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-black text-rose-500">₹{alert.balance.toFixed(2)}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Burn: ₹{alert.avgMonthlyBurn}/mo</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#5D4591] transition-all">
                            Send Reminder
                        </button>
                    </div>
                </div>
            ))}

            <div className="p-6 bg-[#5D4591] rounded-[2rem] text-white text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Pro Tip</p>
                <p className="text-xs font-bold leading-relaxed">Tenants with low balances are 40% more likely to churn if not contacted within 48 hours.</p>
            </div>
        </div>
    );
};

export default WalletMonitor;
