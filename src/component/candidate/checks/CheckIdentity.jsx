import React from 'react';
import { Fingerprint, CheckCircle2, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import FeedbackForm from "./FeedbackForm.jsx";

const CheckIdentity = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Identity Verification (OCR)</h2>
                <button className="px-4 py-2 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">Verified & Matched</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Preview */}
                <div className="bg-slate-900 rounded-[2rem] aspect-[4/3] flex items-center justify-center relative group overflow-hidden">
                    <div className="text-white/20 flex flex-col items-center gap-2">
                        <Fingerprint size={48} />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Aadhar Front Preview</p>
                    </div>
                    <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2">
                        <Eye size={18} /> View High-Res Document
                    </button>
                </div>

                {/* OCR Data Comparison */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                        <ShieldCheck className="text-green-600" size={20} />
                        <p className="text-xs font-bold text-green-700 uppercase">OCR Confidence Score: 98.4%</p>
                    </div>

                    <div className="space-y-4">
                        <IDDataField label="Extracted ID Number" value="5432 8765 0000" isMatch={true} />
                        <IDDataField label="Extracted DOB" value="15-05-1995" isMatch={true} />
                        <IDDataField label="Full Name on ID" value="ARJUN VARDHAN" isMatch={true} />
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Manual Correction</label>
                        <input type="text" className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold outline-none" placeholder="Override ID Number if needed" />
                    </div>
                </div>
            </div>
            <FeedbackForm />
        </div>
    );
};

const IDDataField = ({ label, value, isMatch }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
            <p className="text-sm font-bold text-slate-800">{value}</p>
        </div>
        {isMatch && <CheckCircle2 size={16} className="text-emerald-500" />}
    </div>
);

export default CheckIdentity;
