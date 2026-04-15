import {HistoryIcon, InfoIcon, LockIcon, ShieldAlertIcon} from "lucide-react";


const DpdpWipedPlaceholder = ({ reason, date, checkType }) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                    <LockIcon size={200} />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                        <ShieldAlertIcon size={32} className="text-emerald-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Candidate Data Purged</h2>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
                        Detailed information for the <span className="font-bold text-slate-700 uppercase tracking-tight">{checkType} check</span> has been permanently erased from our active servers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                        <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                            <InfoIcon size={18} className="text-[#5D4591] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason for Erasure</p>
                                <p className="text-sm font-bold text-slate-700 leading-snug">{reason}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                            <HistoryIcon size={18} className="text-[#5D4591] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Erasure Timestamp</p>
                                <p className="text-sm font-bold text-slate-700 leading-snug">{date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 w-full">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Verification Outcome & Status Logs Persist for Audit Purposes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DpdpWipedPlaceholder;