import React, { useState } from 'react';
import {
    ShieldCheck, Lock, Eye, FileText, UserCheck,
    Server, Trash2, Scale, Share2, ChevronDown
} from 'lucide-react';
import EnterpriseFooter from "../footer/EnterpriseFooter.jsx";
import { useTenant } from "../../provider/TenantProvider.jsx";
import LegalHeader from "./LegalHeader.jsx";

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { tenantConfig } = useTenant();

    const sections = [
        { id: 'introduction', label: 'Introduction', icon: <Eye size={16}/> },
        { id: 'definitions', label: 'Definitions', icon: <FileText size={16}/> },
        { id: 'data-collection', label: 'Data We Collect', icon: <UserCheck size={16}/> },
        { id: 'purpose', label: 'Purpose of Processing', icon: <ShieldCheck size={16}/> },
        { id: 'third-party', label: 'Third-Party Disclosure', icon: <Share2 size={16}/> }, // Added to JSON
        { id: 'storage', label: 'Storage & Security', icon: <Server size={16}/> },
        { id: 'rights', label: 'Your Rights', icon: <Scale size={16}/> },
        { id: 'erasure', label: 'Data Erasure', icon: <Trash2 size={16}/> },
    ];

    const scrollToSection = (id) => {
        setActiveSection(id);
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Account for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <LegalHeader />

            {/* HERO HEADER */}
            <header className="bg-white border-b border-slate-200 py-8 lg:py-12 px-4 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#5D4591] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <Lock className="text-white" size={20} />
                        </div>
                        <span className="text-[10px] lg:text-sm font-black text-[#5D4591] tracking-widest uppercase">Legal Center</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
                    <p className="mt-4 text-xs lg:text-sm text-slate-500 font-bold uppercase tracking-wider">
                        Last Updated: April 2026 • Version 1.0-PROD
                    </p>
                </div>
            </header>

            {/* MOBILE NAVIGATION DROPDOWN (Sticky) */}
            <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
                >
                    <div className="flex items-center gap-2">
                        {sections.find(s => s.id === activeSection)?.icon}
                        <span>{sections.find(s => s.id === activeSection)?.label}</span>
                    </div>
                    <ChevronDown size={18} className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-slate-600 border-b border-slate-50 hover:bg-slate-50"
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full py-6 lg:py-12 px-4 lg:px-8 flex gap-12">

                {/* LEFT: DESKTOP STICKY NAVIGATION */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <nav className="sticky top-8 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeSection === section.id
                                        ? 'bg-[#5D4591] text-white shadow-lg shadow-purple-200'
                                        : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* RIGHT: CONTENT */}
                <article className="flex-grow bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-12 shadow-sm prose prose-slate max-w-none">

                    {/* 1. Introduction */}
                    <section id="introduction" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Introduction</h2>
                        <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                            Welcome to <strong>{tenantConfig?.tenantName || 'Vantira'}</strong>, a background verification platform developed by <strong>Corentec Solutions</strong>.
                            This policy describes our Personal Data handling in compliance with the <strong>Digital Personal Data Protection Act (DPDPA)</strong>.
                        </p>
                    </section>

                    {/* 2. Definitions */}
                    <section id="definitions" className="mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. Key Definitions</h2>
                        <ul className="space-y-4 text-xs lg:text-sm">
                            <li><strong className="text-[#5D4591] uppercase tracking-wider">Data Principal:</strong> The individual (Candidate) whose data is verified.</li>
                            <li><strong className="text-[#5D4591] uppercase tracking-wider">Data Fiduciary:</strong> The entity determining the purpose of processing.</li>
                        </ul>
                    </section>

                    {/* 3. Data Collection */}
                    <section id="data-collection" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. What We Collect</h2>
                        <p className="text-sm lg:text-base text-slate-600 mb-6 font-medium">We collect the following for comprehensive screening:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {["Identity (PAN/Aadhar)", "Residential Geo-Location", "Educational History", "Employment Records"].map((check, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{check}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. Purpose */}
                    <section id="purpose" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Purpose of Processing</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs lg:text-sm border-collapse">
                                <thead>
                                <tr className="bg-slate-50 text-slate-400 uppercase tracking-widest">
                                    <th className="p-4 border">Activity</th>
                                    <th className="p-4 border">Legal Basis</th>
                                </tr>
                                </thead>
                                <tbody className="text-slate-600">
                                <tr>
                                    <td className="p-4 border font-bold">Identity Verification</td>
                                    <td className="p-4 border">Consent</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 5. Third Party Disclosure (The New Section) */}
                    <section id="third-party" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Third-Party Disclosure</h2>
                        <p className="text-sm lg:text-base text-slate-600 mb-6">To verify authenticity, we share specific data with authorized entities:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white transition-colors group">
                                <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Share2 size={14} className="text-[#5D4591]" /> Educational Institutions
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Verification of Roll numbers and graduation details directly with Universities.</p>
                            </div>
                            <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white transition-colors group">
                                <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Lock size={14} className="text-[#5D4591]" /> Government Portals
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Secure API calls to NSDL (PAN) and UIDAI (Aadhaar) for identity validation.</p>
                            </div>
                        </div>
                    </section>

                    {/* 6. Storage */}
                    <section id="storage" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">6. Security & Storage</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-3 text-[#5D4591]">
                                    <Lock size={16} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">AES-256 Encryption</h3>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">All PII data is encrypted at rest and in transit via SSL/TLS 1.2.</p>
                            </div>
                            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-3 text-[#5D4591]">
                                    <Server size={16} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Data Localization</h3>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">All data resides on AWS servers located within Indian territory.</p>
                            </div>
                        </div>
                    </section>

                    {/* 7. Rights */}
                    <section id="rights" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Your Rights</h2>
                        <div className="space-y-3">
                            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">Right to Withdraw Consent</h4>
                                <p className="text-[10px] text-slate-500 mt-1">You may stop processing at any time, though it may affect employment.</p>
                            </div>
                        </div>
                    </section>

                    {/* 8. Erasure */}
                    <section id="erasure" className="mb-12">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">8. Data Erasure</h2>
                        <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                            Once a case is completed, we support the <strong>Right to be Forgotten</strong>. PII data is purged based on retention policies.
                        </p>
                    </section>

                    <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Grievance Redressal</p>
                        <a href="mailto:privacy@corentec.com" className="text-[#5D4591] font-black text-xl lg:text-2xl hover:underline">privacy@corentec.com</a>
                    </footer>

                </article>
            </main>
            <EnterpriseFooter/>
        </div>
    );
};

export default PrivacyPolicy;
