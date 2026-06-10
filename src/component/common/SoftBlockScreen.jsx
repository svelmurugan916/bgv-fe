import React, { useState } from 'react';
import { ShieldAlert, Mail, Copy, Check, LogOut, RefreshCw, Building2, ExternalLink } from 'lucide-react';

const SoftBlockScreen = ({ onLogout, onCheckStatus, tenantConfig }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        if (onCheckStatus) {
            await onCheckStatus();
        } else {
            // Simulate API verification delay
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        setIsRefreshing(false);
    };

    console.log("tenantConfig - ", tenantConfig)

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(tenantConfig?.supportContactEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50/50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Decorative Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#5D4591]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

            {/* Main Container */}
            <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(93,69,145,0.08)] p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">

                {/* 1. Visual Icon Group */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-6">
                        {/* Pulsing Outer Rings */}
                        <div className="absolute inset-0 rounded-3xl bg-amber-500/10 animate-ping opacity-75" />
                        <div className="absolute -inset-2 rounded-[28px] bg-amber-500/5" />

                        {/* Core Icon Container */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500 text-white shadow-lg shadow-amber-200/50">
                            <ShieldAlert size={28} className="stroke-[2.25]" />
                        </div>
                    </div>

                    {/* Sub-Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Commercial Onboarding</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        Access Temporarily Paused
                    </h1>
                </div>

                {/* 2. Refactored Content Block */}
                <div className="space-y-6 text-center">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-md mx-auto">
                        Your organization's access to <strong className="text-slate-900 font-bold">{tenantConfig?.tenantName}</strong> has been temporarily paused while we finalize your commercial setup. Your data remains fully secure.
                    </p>

                    {/* Actionable Support Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-[#5D4591] shrink-0">
                                <Mail size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Billing & Accounts</span>
                                <span className="text-xs font-bold text-slate-800">{tenantConfig?.supportContactEmail}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCopyEmail}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border
                                ${copied
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
                        >
                            {copied ? (
                                <>
                                    <Check size={12} strokeWidth={3} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={12} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 3. Primary Interactions */}
                {/*<div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-3">*/}
                {/*    <button*/}
                {/*        onClick={onLogout}*/}
                {/*        className="flex-1 py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center justify-center gap-2"*/}
                {/*    >*/}
                {/*        <LogOut size={14} />*/}
                {/*        Sign Out*/}
                {/*    </button>*/}

                {/*    <button*/}
                {/*        onClick={handleRefresh}*/}
                {/*        disabled={isRefreshing}*/}
                {/*        className="flex-[2] py-3.5 px-6 bg-[#5D4591] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:bg-[#4d3978] hover:shadow-xl hover:shadow-[#5D4591]/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:transform-none"*/}
                {/*    >*/}
                {/*        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />*/}
                {/*        {isRefreshing ? 'Verifying Session...' : 'Re-verify Access'}*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>

            {/* Footer Brand Seal */}
            <div className="mt-8 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
                <span>Powered by Vantira Security</span>
            </div>
        </div>
    );
};

export default SoftBlockScreen;
