import {IndianRupeeIcon, Wallet2} from "lucide-react";
import React from "react";

const InsufficientFundView = ({ label = "", process = "" }) => {
    return (
        <div className="flex flex-col items-center animate-in fade-in duration-500 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12">
            {/* Funding/Wallet Icon */}
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-400 mb-6 border border-amber-100">
                <IndianRupeeIcon size={40} />
            </div>

            <h1 className="text-xl font-black text-slate-900 mb-2">Funding Required</h1>

            <p className="text-sm text-slate-500 text-center max-w-[420px] leading-relaxed mb-8">
                This <span className="font-bold text-slate-700">{label}</span> check is currently on hold due to an insufficient account balance.
                Please top up your wallet to proceed. The system will <span className="font-bold text-slate-700">automatically allocate the funds</span> and resume {process} once the balance is restored.
            </p>

            <button
                onClick={() => { /* Navigate to payment/wallet page */ }}
                className="px-8 py-3 bg-[#5D4591] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#4a3675] transition-all flex items-center gap-2 shadow-lg shadow-[#5D4591]/20 active:scale-95"
            >
                <Wallet2 size={14} />
                Add Funds to Wallet
            </button>
        </div>
    );
};

export default InsufficientFundView;
