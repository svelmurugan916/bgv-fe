import React from 'react';
import {
    ShieldCheck, Lock, Globe, ShieldAlert,
    ExternalLink, Mail, MessageSquare, CheckCircle2
} from 'lucide-react';
import FooterColumn from './FooterColumn';
import TrustBadge from './TrustBadge';
import {useTenant} from "../../provider/TenantProvider.jsx";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const {tenantConfig} = useTenant();

    const productLinks = [
        { label: 'BGV Solutions', href: '#' },
        { label: 'API Documentation', href: '#', isExternal: true },
        { label: 'Enterprise Integration', href: '#' },
        { label: 'System Status', href: 'https://status.vantira.in', isExternal: true },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Data Retention Policy', href: '#' },
        { label: 'Consent Management', href: '#' },
    ];

    const supportLinks = [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Grievance Redressal', href: '#' },
        { label: 'Raise a Ticket', href: '#' },
    ];

    return (
        <footer className="bg-[#0F172A] pt-20 pb-10 px-6 sm:px-10 border-t border-slate-800">
            <div className="max-w-[1600px] mx-auto">

                {/* TOP SECTION: BRAND & NAV */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

                    {/* BRAND COLUMN */}
                    <div className="lg:col-span-2 pr-0 lg:pr-20">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#5D4591] rounded-lg flex items-center justify-center">
                                <ShieldCheck className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter">VANTIRA</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-sm">
                            Next-generation AI-powered trust infrastructure. Providing secure,
                            compliant, and rapid background verification for the modern enterprise.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">DPDP Act Compliant</span>
                            </div>
                        </div>
                    </div>

                    {/* NAV COLUMNS */}
                    <FooterColumn title="Product" links={productLinks} />
                    <FooterColumn title="Legal & Compliance" links={legalLinks} />
                    <FooterColumn title="Support" links={supportLinks} />
                </div>

                {/* MIDDLE SECTION: TRUST BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    <TrustBadge
                        icon={ShieldCheck}
                        label="ISO 27001:2022"
                        subtext="Information Security"
                    />
                    <TrustBadge
                        icon={Lock}
                        label="SOC2 Type II"
                        subtext="Security & Privacy"
                    />
                    <TrustBadge
                        icon={Globe}
                        label="Data Residency"
                        subtext="Hosted in India"
                    />
                    <TrustBadge
                        icon={ShieldAlert}
                        label="AES-256 Bit"
                        subtext="Military Encryption"
                    />
                </div>

                {/* BOTTOM SECTION: COPYRIGHT & POWERED BY */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* LEFT: COPYRIGHT */}
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                            © {currentYear} Valorae Technologies Private Limited
                        </span>
                        <div className="hidden md:block w-[1px] h-3 bg-slate-800" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                            All Rights Reserved
                        </span>
                    </div>

                    {/* CENTER: POWERED BY (SaaS Strategy) */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Powered by</span>
                        <span className="text-[12px] font-black text-white tracking-tighter hover:text-[#A78BFA] transition-colors cursor-pointer">VANTIRA AI</span>
                    </div>

                    {/* RIGHT: GRIEVANCE OFFICER (DPDP Mandatory) */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Grievance Officer</span>
                            <span className="text-[11px] font-bold text-slate-300">grievance@valorae.tech</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <Mail size={18} />
                        </div>
                    </div>
                </div>

                {/* TENANT SPECIFIC OVERLAY (Optional) */}
                {tenantConfig?.customFooterText && (
                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-600 font-medium italic">
                            {tenantConfig.customFooterText}
                        </p>
                    </div>
                )}

            </div>
        </footer>
    );
};

export default Footer;
