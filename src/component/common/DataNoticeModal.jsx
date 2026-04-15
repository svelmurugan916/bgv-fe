import React, { useEffect } from 'react';
import { createPortal } from 'react-dom'; // 1. Import createPortal
import { XIcon } from "lucide-react";

const DataProcessingNotice = ({ isOpen, onClose }) => {

    // Body Scroll Lock Logic
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 2. Wrap your entire JSX in createPortal
    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose} // 3. Close when clicking the backdrop (UX Best Practice)
        >
            <div
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex flex-col">
                        <h4 className="text-xl font-bold text-slate-900">Data Processing Notice</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Privacy & Compliance</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-2xl transition-all active:scale-90 cursor-pointer text-slate-400 hover:text-slate-900">
                        <XIcon size={20}/>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 text-sm text-slate-600 leading-relaxed">
                    <section className="relative pl-6 border-l-2 border-[#5D4591]/20">
                        <p className="font-black text-[#5D4591] uppercase text-[10px] tracking-[0.15em] mb-2">1. Purpose of Collection</p>
                        <p className="font-medium">We collect your government-issued ID solely for Identity Verification (IDV) and Background Screening. The extraction of data (OCR) is performed securely on our internal servers.</p>
                    </section>

                    <section className="relative pl-6 border-l-2 border-[#5D4591]/20">
                        <p className="font-black text-[#5D4591] uppercase text-[10px] tracking-[0.15em] mb-2">2. Third-Party Validation</p>
                        <p className="font-medium">Extracted details are shared with our authorized partner, <strong>SurePass</strong>, for validation against official government databases via encrypted channels.</p>
                    </section>

                    <section className="relative pl-6 border-l-2 border-[#5D4591]/20">
                        <p className="font-black text-[#5D4591] uppercase text-[10px] tracking-[0.15em] mb-2">3. Retention & Rights</p>
                        <p className="font-medium">Your data is stored securely and will be purged following your tenure or as mandated by law. You may withdraw consent at any time.</p>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button onClick={onClose} className="w-full py-4 bg-[#5D4591] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#4a3675] transition-all shadow-xl shadow-[#5D4591]/20 active:scale-[0.98] cursor-pointer">
                        I Understand & Accept
                    </button>
                </div>
            </div>
        </div>,
        document.body // 4. Target the body
    );
};

export default DataProcessingNotice;
