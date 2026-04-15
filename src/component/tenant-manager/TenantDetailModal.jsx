import React from 'react';
import { X, CreditCard, Users, ShieldCheck, History, Activity } from 'lucide-react';

const TenantDetailModal = ({ tenant, onClose }) => {
    if (!tenant) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">

                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14  rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#5D4591]/20">
                            <img src={tenant?.favIconUrl} alt={tenant.name?.charAt(0)}/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{tenant.name}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tenant.id} • {tenant.plan} Tier</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* Sales & Billing Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600">
                                <CreditCard size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Revenue (MRR)</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">₹{tenant.stats.mrr.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">Next: {tenant.billing.nextRenewal}</p>
                        </div>
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                            <div className="flex items-center gap-2 mb-4 text-blue-600">
                                <Users size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Active Checks</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{tenant.stats.activeChecks}</p>
                            <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Total Processed: {tenant.stats.totalChecks}</p>
                        </div>
                    </div>

                    {/* Technical & Security Section */}
                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#5D4591]" /> Compliance & Access
                        </h3>
                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                <span className="text-sm font-bold text-slate-600">Admin Email</span>
                                <span className="text-sm font-black text-slate-900">{tenant.adminEmail}</span>
                            </div>
                            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                <span className="text-sm font-bold text-slate-600">SSO / SAML 2.0</span>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase">Enabled</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">Welcome Credit Balance</span>
                                <span className={`text-sm font-black ${tenant.billing.creditBalance < 100 ? 'text-rose-500' : 'text-slate-900'}`}>
                                    ₹{tenant.billing.creditBalance.toFixed(2)}
                                </span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">Wallet Balance</span>
                                <span className={`text-sm font-black ${tenant.billing.walletBalance < 100 ? 'text-rose-500' : 'text-slate-900'}`}>
                                    ₹{tenant.billing.walletBalance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Sales Action Section */}
                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity size={80} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Growth Potential</h4>
                        <p className="text-sm font-medium text-slate-300 mb-6 leading-relaxed">
                            This tenant has used 88% of their API limits. <br />
                            <span className="text-white font-bold">Recommended Action:</span> Initiate conversation for Enterprise+ upgrade.
                        </p>
                        <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                            Schedule Sales Call
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-slate-100 flex gap-3 bg-slate-50/30">
                    <button className="flex-1 py-4 border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all">
                        Suspend Tenant
                    </button>
                    <button className="flex-1 py-4 bg-[#5D4591] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:scale-[1.02] transition-all">
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantDetailModal;
