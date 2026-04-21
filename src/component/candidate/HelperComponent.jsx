import {AlertCircle, AlertTriangle} from "lucide-react";
import React from "react";

const MajorDiscrepancyDetectedInliner = () => {
    return (
        <div className=" mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top duration-500">
            <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200 shrink-0">
                <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
                <h4 className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] mb-1">
                    Major Discrepancy Detected
                </h4>
                <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest leading-relaxed">
                    This candidate profile has been flagged as <span className="underline decoration-2">Fraudulent/Fake</span> based on official verification.
                </p>
            </div>
            <div className="px-3 py-1 bg-rose-500 text-white text-[9px] font-black uppercase rounded-lg tracking-tighter">
                Critical
            </div>
        </div>
    )
}


const CertificateProvideLaterInliner = ({ message }) => {
    return (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-6 py-4 rounded-[2rem] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm font-semibold">
                Candidate has indicated that the **{message || ""}**. Verification may be pending until documentation is received.
            </p>
        </div>
    )
}

export {CertificateProvideLaterInliner, MajorDiscrepancyDetectedInliner};