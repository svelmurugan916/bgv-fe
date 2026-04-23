// components/bgv/sections/ReportAuthenticity.jsx
import { Shield, Lock, Hash } from "lucide-react";
import { GlassCard, DetailRow } from "./HelperComponent.jsx";

export const ReportAuthenticity = ({ auth, verifyUrl }) => (
    <GlassCard className="p-8">
        <div className="flex flex-col md:flex-row gap-8">

            {/* QR Placeholder */}
            <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="w-36 h-36 bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <div className="w-24 h-24 bg-white rounded-lg grid grid-cols-3 gap-1 p-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-sm ${
                                    [0,1,2,3,5,6,7,8].includes(i)
                                        ? "bg-slate-900"
                                        : "bg-white"
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Scan to Verify
                </p>
                <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-indigo-600 hover:underline"
                >
                    {verifyUrl}
                </a>
            </div>

            {/* Tamper-Proof Details */}
            <div className="flex-1 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Tamper-Proof Guarantee
                        </p>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">
                            {auth.guarantee}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <DetailRow label="Report ID"      value={auth.reportId} mono />
                    <DetailRow label="Hash Algorithm" value={auth.hashAlgorithm} mono />
                    <DetailRow label="Document Hash"  value={auth.documentHash} mono />
                    <DetailRow label="Signed By"      value={auth.signedBy} />
                    <DetailRow label="Timestamp"      value={auth.timestamp} />
                </div>
            </div>
        </div>
    </GlassCard>
);
