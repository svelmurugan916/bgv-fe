import React from 'react';
import {
    ShieldCheck,
    Lock,
    Activity,
    HelpCircle
} from 'lucide-react';

const EnterpriseFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        /*
           - py-6: Perfect vertical balance.
           - border-t: Subtle separation.
        */
        <footer className="mt-auto bg-white border-t border-gray-100 py-6 px-8 w-full">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">

                {/* LEFT: BRAND & COPYRIGHT */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center ">
                            <img
                                src="/favicon.png"
                                alt="Vantira"
                                className="w-5 h-5 grayscale opacity-60 mix-blend-multiply"
                            />
                        </div>
                        <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">Vantira</span>
                    </div>

                    <div className="hidden md:block w-px h-4 bg-gray-200" />

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-center lg:text-left">
                        © {currentYear} Corentec Solutions • All Rights Reserved
                    </p>
                </div>

                {/* CENTER: COMPLIANCE BADGES */}
                <div className="flex items-center gap-6">
                    {/* DPDP: Kept because it's vital for legal trust */}
                    <div className="flex items-center gap-2 text-slate-500">
                        <Lock size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">DPDP Compliant</span>
                    </div>

                    <div className="w-1 h-1 rounded-full bg-gray-300" />

                    {/* Uptime: Simplified to a 'System Status' indicator */}
                    <div className="flex items-center gap-2 text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">Systems Operational</span>
                    </div>
                </div>

                {/* RIGHT: NAVIGATION & HELP */}
                <div className="flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <a href="/privacy" className="text-[11px] font-semibold text-slate-600 hover:text-[#5D4591] transition-colors">Privacy</a>
                        <a href="/terms" className="text-[11px] font-semibold text-slate-600 hover:text-[#5D4591] transition-colors">Terms</a>
                    </nav>

                    <div className="hidden md:block w-px h-4 bg-gray-200" />

                    <button className="flex items-center gap-2 px-4 py-2 bg-[#F5F3FF] text-[#5D4591] border border-[#5D4591]/10 rounded-lg hover:bg-[#5D4591] hover:text-white transition-all group">
                        <HelpCircle size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold">Help Center</span>
                    </button>
                </div>

            </div>
        </footer>
    );
};

export default EnterpriseFooter;
