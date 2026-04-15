import React, { useEffect, useState } from 'react';
import {
    X,
    MessageCircle,
    MailIcon,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { useTenant } from "../../provider/TenantProvider.jsx";

const SupportDrawer = ({ isOpen, onClose, faqs = [] }) => {
    const { tenantConfig } = useTenant();

    // Logic to handle DOM mounting and CSS transitions
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small timeout to allow DOM to mount before starting "Slide In"
            const timer = setTimeout(() => setIsTransitioning(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsTransitioning(false);
            // Wait for "Slide Out" (500ms) before unmounting from DOM
            const timer = setTimeout(() => setShouldRender(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // const faqs = [
    //     { q: "Which documents are accepted?", a: "We accept original government-issued IDs like PAN, Aadhaar, and Passport." },
    //     { q: "Photo upload is failing?", a: "Ensure the file is under 5MB and in JPG, PNG, or PDF format." },
    //     { q: "Is my data secure?", a: "Yes, all documents are encrypted and used only for verification purposes." },
    //     { q: "What if I don't have a specific document?", a: "You can use the 'Provide Later' toggle for most sections. However, mandatory IDs like PAN/Aadhaar are required for initial processing." },
    //     { q: "Can I edit my details after submission?", a: "Once submitted, the form is locked. Please contact support immediately if you need to correct a critical error." }
    // ];

    const handleWhatsAppClick = () => {
        const phoneNumber = tenantConfig?.supportContactPhone || "919626260440";
        const message = `Hi ${tenantConfig?.supportContactName || 'Vantira Support'}, I'm a candidate currently filling out my BGV form. I need some assistance with the process.`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    const handleEmailClick = () => {
        const email = tenantConfig?.supportContactEmail || "support@vantira.com";
        const subject = `Support Request: BGV Form Assistance`;
        const body = `Hi ${tenantConfig?.tenantName || 'Vantira'} Support,\n\nI am a candidate currently filling out my Background Verification form.\n\nTenant: ${tenantConfig?.tenantName || 'Vantira Platform'}\nDate: ${new Date().toLocaleDateString()}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Backdrop: Fades In/Out */}
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out
                    ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Content: Slides In/Out from Right */}
            <div
                className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ease-in-out transform
                    ${isTransitioning ? 'translate-x-0' : 'translate-x-full'}`}
            >

                {/* 1. COMPACT STICKY HEADER */}
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="min-w-0">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Support Center</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Verification Help</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. MAXIMIZED SCROLLABLE BODY */}
                <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-10 custom-scrollbar bg-white">

                    {/* Direct Support Section */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] ml-1">Direct Support</p>

                        {/* WhatsApp Support Card */}
                        <button
                            onClick={handleWhatsAppClick}
                            className="w-full p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4 group cursor-pointer active:scale-[0.97] transition-all text-left outline-none"
                        >
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0 group-hover:rotate-12 transition-transform">
                                <MessageCircle size={24} fill="currentColor" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">Instant Help</p>
                                    <span className="text-[9px] font-black text-emerald-600 bg-white/60 px-2 py-0.5 rounded-full border border-emerald-200/50">~5 MINS</span>
                                </div>
                                <p className="text-sm font-black text-slate-800">WhatsApp Support</p>
                            </div>
                            <ChevronRight size={18} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Email Support Card */}
                        <button
                            onClick={handleEmailClick}
                            className="w-full p-5 bg-[#F9F7FF] rounded-[2rem] border border-[#5D4591]/10 flex items-center gap-4 group cursor-pointer active:scale-[0.97] transition-all text-left outline-none"
                        >
                            <div className="w-12 h-12 bg-[#5D4591] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200 shrink-0 group-hover:-rotate-12 transition-transform">
                                <MailIcon size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-[10px] font-black text-[#5D4591] uppercase tracking-widest leading-none">Formal Query</p>
                                    <span className="text-[9px] font-black text-[#5D4591] bg-white/60 px-2 py-0.5 rounded-full border border-purple-200/50">~2 HOURS</span>
                                </div>
                                <p className="text-sm font-black text-slate-800 truncate">
                                    {tenantConfig?.supportContactEmail || "support@vantira.com"}
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-purple-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* FAQs Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4 ml-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Common Questions</p>
                            <span className="text-[9px] font-black text-[#5D4591] uppercase bg-[#5D4591]/5 px-2 py-1 rounded-lg">Self Service</span>
                        </div>
                        {faqs.map((item, index) => (
                            <FAQItem key={index} q={item.q} a={item.a} />
                        ))}
                    </div>

                    {/* Security Notice */}
                    <div className="p-6 bg-slate-900 rounded-[2.5rem] flex flex-col items-center text-center gap-4 shadow-xl shadow-slate-900/10 mx-1">
                        <div className="p-3 bg-white/10 rounded-2xl text-emerald-400 shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Bank-Grade Security</p>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-3">
                                Your documents are encrypted via <span className="text-emerald-400">AES-256 SSL</span>.
                            </p>
                        </div>
                    </div>

                    {/* 3. NON-STICKY FOOTER */}
                    <div className="pt-4 pb-10">
                        <button
                            onClick={onClose}
                            className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
                        >
                            Close Help Center
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQItem = ({ q, a }) => (
    <div className="p-5 rounded-[1.5rem] border border-slate-100 hover:border-[#5D4591]/20 hover:bg-slate-50/50 transition-all group">
        <p className="text-xs font-black text-slate-800 mb-2 group-hover:text-[#5D4591] transition-colors">{q}</p>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{a}</p>
    </div>
);

export default SupportDrawer;
