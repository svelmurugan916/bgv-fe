import React, { useState } from 'react';
import {
    Gavel,
    UserX,
    AlertTriangle,
    ShieldAlert,
    Cpu,
    Globe,
    RefreshCw,
    HelpCircle
} from 'lucide-react';
import EnterpriseFooter from "../footer/EnterpriseFooter.jsx";
import {useTenant} from "../../provider/TenantProvider.jsx";
import Header from "../header/Header.jsx";
import LegalHeader from "./LegalHeader.jsx";

const TermsOfUse = () => {
    const [activeSection, setActiveSection] = useState('acceptance');
    const {tenantConfig} = useTenant();

    const sections = [
        { id: 'acceptance', label: 'Acceptance of Terms', icon: <Gavel size={16}/> },
        { id: 'user-conduct', label: 'User Conduct', icon: <UserX size={16}/> },
        { id: 'accuracy', label: 'Accuracy of Data', icon: <AlertTriangle size={16}/> },
        { id: 'intellectual-property', label: 'Intellectual Property', icon: <Cpu size={16}/> },
        { id: 'liability', label: 'Limitation of Liability', icon: <ShieldAlert size={16}/> },
        { id: 'availability', label: 'Service Availability', icon: <RefreshCw size={16}/> },
        { id: 'governing-law', label: 'Governing Law', icon: <Globe size={16}/> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* HEADER */}
            <LegalHeader />
            <header className="bg-white border-b border-slate-200 py-12 px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#5D4591] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <Gavel className="text-white" size={20} />
                        </div>
                        <span className="text-sm font-bold text-[#5D4591] tracking-widest uppercase">Legal Framework</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Use</h1>
                    <p className="mt-4 text-slate-500 font-medium italic">Effective Date: April 2024</p>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full py-12 px-8 flex gap-12">

                {/* STICKY SIDEBAR */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <nav className="sticky top-8 space-y-1">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                    activeSection === section.id
                                        ? 'bg-[#5D4591] text-white shadow-md shadow-purple-200'
                                        : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {section.icon}
                                {section.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* CONTENT AREA */}
                <article className="flex-grow bg-white border border-slate-200 rounded-2xl p-10 shadow-sm max-w-none">

                    <section id="acceptance" className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing or using the <strong>{tenantConfig?.tenantName || 'Vantira'} Platform</strong>, you agree to be bound by these Terms of Use and our Privacy Policy. If you are using {tenantConfig?.tenantName || 'Vantira'} on behalf of an organization (the "Client"), you represent that you have the authority to bind that organization to these terms.
                        </p>
                    </section>

                    <section id="user-conduct" className="mb-12 bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                        <h2 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                            <ShieldAlert size={20} />
                            Candidate Integrity & Conduct
                        </h2>
                        <p className="text-sm text-rose-800 leading-relaxed mb-4">
                            As a candidate, you are legally responsible for the authenticity of the information provided.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs text-rose-700 font-medium">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                                Submission of altered, forged, or "Photoshopped" documents is strictly prohibited.
                            </li>
                            <li className="flex gap-3 text-xs text-rose-700 font-medium">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                                Any attempt to spoof GPS location or use VPNs during address verification will be flagged in the final report.
                            </li>
                        </ul>
                    </section>

                    <section id="accuracy" className="mb-12 bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <h2 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                            <AlertTriangle size={20} />
                            3. Accuracy of Verification Results
                        </h2>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            {tenantConfig?.tenantName || 'Vantira'} acts as a facilitator for background checks. While we use authorized APIs (NSDL, Digilocker) and manual quality checks, we do not warrant the absolute accuracy of information provided by third-party sources (e.g., courts, universities, or previous employers). The final decision regarding a candidate's suitability rests solely with the Client Organization.
                        </p>
                    </section>

                    <section id="intellectual-property" className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2">4. Intellectual Property Rights</h2>
                        <p className="text-slate-600 leading-relaxed">
                            All software, algorithms, report formats, and the "Vantira AI Trust Engine" are the exclusive property of <strong>Corentec Solutions Private Limited</strong>. Users are granted a limited, non-transferable license to access the platform for the sole purpose of background verification.
                        </p>
                    </section>

                    <section id="availability" className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">5. Service Availability (SLA)</h2>
                        <p className="text-slate-600 leading-relaxed">
                            <strong>Vantira</strong> strives to maintain a <strong>99.9% uptime</strong> for the <strong>{tenantConfig?.tenantName || 'Vantira'} Platform</strong> for all enterprise clients. However, we reserve the right to suspend access for emergency maintenance or critical security updates. We will provide reasonable notice to our Clients for any scheduled downtime that may impact business operations.
                        </p>
                    </section>

                    <section id="liability" className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2">6. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed italic">
                            In no event shall Corentec Solutions or its directors be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the platform, or from any employment decisions made based on the verification reports provided.
                        </p>
                    </section>

                    <section id="governing-law" className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2">7. Governing Law & Jurisdiction</h2>
                        <p className="text-slate-600 leading-relaxed">
                            These Terms of Use are governed by the laws of <strong>India</strong>. Any disputes arising out of the use of this platform shall be subject to the exclusive jurisdiction of the courts in Gurgaon, Haryana.
                        </p>
                    </section>

                    <div className="mt-12 p-6 bg-slate-900 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <HelpCircle className="text-purple-400" size={24} />
                            <div>
                                <p className="text-white font-bold">Have questions about these terms?</p>
                                <p className="text-slate-400 text-xs">Our legal team is here to help.</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-[#5D4591] text-white text-sm font-bold rounded-lg hover:bg-[#4c3877] transition-all">
                            Contact Legal
                        </button>
                    </div>

                </article>
            </main>

            {/* INTEGRATED ENTERPRISE FOOTER */}
            <EnterpriseFooter />
        </div>
    );
};

export default TermsOfUse;
