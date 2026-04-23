// components/bgv/checks/EducationCheck.jsx
import { AlertTriangle, CheckSquare, TrendingDown } from "lucide-react";
import { GlassCard, SectionTitle, DetailRow } from "../sections/HelperComponent.jsx";

export const EducationCheck = ({ data }) => (
    <GlassCard className="p-8">
        <SectionTitle number="4" title="Education Verification" subtitle={data.subtitle} status={data.status} />

        {/* Flag Banner */}
        <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-amber-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <p className="text-xs font-black text-amber-800 uppercase">{data.flagTitle}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-200 text-amber-800 text-[9px] font-black rounded-full">
            <TrendingDown size={9} /> Score Impact: {data.scoreImpact}
          </span>
                </div>
                <p className="text-xs font-medium text-amber-700 leading-relaxed">{data.flagDetail}</p>
            </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-6 bg-slate-50 rounded-2xl">
            <DetailRow label="Institution"          value={data.institution} />
            <DetailRow label="Degree"               value={data.degree} />
            <DetailRow label="Year (Claimed)"       value={data.yearClaimed} />
            <DetailRow label="Year (Verified)"      value={`${data.yearVerified} ✓`} />
            <DetailRow label="Roll Number"          value={data.rollNumber} mono />
            <DetailRow label="Registrar Conf."      value={data.registrarConfirmation} />
            <DetailRow label="Discrepancy"          value={data.discrepancy} />
            <DetailRow label="Resolution"           value={data.resolution} />
            <DetailRow label="Fraud Risk"           value={data.fraudRisk} />
        </div>

        <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <CheckSquare size={18} className="text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-700">
                Degree authenticity confirmed. Discrepancy resolved. No fraud indicators.
            </p>
        </div>
    </GlassCard>
);
