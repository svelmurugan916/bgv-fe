// components/bgv/sections/VerificationDashboard.jsx
import { CheckSquare, AlertTriangle } from "lucide-react";
import { GlassCard, PillarIcon } from "./HelperComponent.jsx";

const PillarCard = ({ pillar }) => {
    const isVerified = pillar.status === "VERIFIED";
    return (
        <GlassCard className={`p-5 flex flex-col items-center gap-3 text-center border-2 ${
            isVerified
                ? "border-emerald-100 hover:border-emerald-300"
                : "border-amber-100 hover:border-amber-300"
        } transition-all duration-300`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}>
                <PillarIcon icon={pillar.icon} size={22} />
            </div>
            <div>
                <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{pillar.label}</p>
                <div className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    isVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                }`}>
                    {isVerified
                        ? <CheckSquare size={9} strokeWidth={2.5} />
                        : <AlertTriangle size={9} strokeWidth={2.5} />
                    }
                    {isVerified ? "Verified" : "Flag"}
                </div>
            </div>
        </GlassCard>
    );
};

export const VerificationDashboard = ({ dashboard }) => (
    <div className="space-y-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Verification Dashboard
        </p>

        {/* Summary Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: "Checks Passed",  value: `${dashboard.checksPassed} / ${dashboard.totalChecks}`, color: "text-slate-800" },
                { label: "Minor Flags",    value: dashboard.minorFlags,    color: "text-amber-600" },
                { label: "Critical Flags", value: dashboard.criticalFlags, color: "text-rose-600"  },
                { label: "Pillars",        value: `${dashboard.totalChecks} / ${dashboard.totalChecks}`, color: "text-indigo-600" },
            ].map(({ label, value, color }) => (
                <GlassCard key={label} className="p-5 text-center">
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                </GlassCard>
            ))}
        </div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {dashboard.pillars.map((pillar) => (
                <PillarCard key={pillar.key} pillar={pillar} />
            ))}
        </div>
    </div>
);
