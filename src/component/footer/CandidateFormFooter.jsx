import React from 'react';
import {
    ShieldCheck,
    Lock,
    ShieldAlert,
    HelpCircle,
    CheckCircle2,
    Info
} from 'lucide-react';

const CandidateFormFooter = ({setIsHelpOpen}) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-white border-t border-slate-100 py-8 px-6 lg:px-12 w-full">
            <div className="max-w-[1400px] mx-auto">

                {/* TOP SECTION: SECURITY BADGES (The Trust Anchor) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-50 mb-8">
                    <SecurityBadge
                        icon={<Lock size={16} className="text-emerald-500" />}
                        title="256-Bit Encryption"
                        desc="Your data is encrypted in transit and at rest."
                    />
                    <SecurityBadge
                        icon={<ShieldCheck size={16} className="text-emerald-500" />}
                        title="DPDP Compliant"
                        desc="Fully compliant with Data Protection laws."
                    />
                    <SecurityBadge
                        icon={<CheckCircle2 size={16} className="text-emerald-500" />}
                        title="ISO 27001 Certified"
                        desc="International standard for info security."
                    />
                </div>

                {/* BOTTOM SECTION: LINKS & BRAND */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                    {/* Brand & Copyright */}
                    <div className="flex flex-col items-center lg:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <img src="/favicon.png" alt="Vantira" className="w-5 h-5 grayscale opacity-70" />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Vantira Secure</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">
                            © {currentYear} Corentec Solutions. All data is processed securely.
                        </p>
                    </div>

                    {/* Navigation Links - Mobile Optimized Grid */}
                    <nav className="grid grid-cols-2 md:flex items-center gap-x-8 gap-y-4 text-center md:text-left">
                        <FooterLink href="/privacy" label="Privacy Policy" />
                        <FooterLink href="/terms" label="Terms of Use" />
                        <FooterLink href="/security" label="Security Policy" />
                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className="text-[11px] font-bold text-slate-500 hover:text-[#5D4591] transition-colors uppercase tracking-widest whitespace-nowrap"
                        >
                            Help & Support
                        </button>
                    </nav>

                    {/* System Status (Desktop Only for Cleanliness) */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Systems Secure</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

/* --- HELPER COMPONENTS FOR 10/10 UI --- */

const SecurityBadge = ({ icon, title, desc }) => (
    <div className="flex items-start gap-3 group">
        <div className="mt-0.5 w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
            {icon}
        </div>
        <div>
            <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{title}</h5>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const FooterLink = ({ href, label }) => (
    <a
        href={href}
        className="text-[11px] font-bold text-slate-500 hover:text-[#5D4591] transition-colors uppercase tracking-widest whitespace-nowrap"
    >
        {label}
    </a>
);

export default CandidateFormFooter;
