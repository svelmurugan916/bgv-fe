// components/bgv/checks/EmploymentCheck.jsx
import { CheckSquare, Briefcase } from "lucide-react";
import { GlassCard, SectionTitle, DetailRow, Divider } from "../sections/HelperComponent.jsx";

const EmployerCard = ({ employer, index }) => (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <Briefcase size={18} className="text-indigo-600" />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-800">{employer.company}</p>
                    <p className="text-xs font-bold text-slate-500">{employer.period}</p>
                </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">
        <CheckSquare size={9} strokeWidth={2.5} /> Verified
      </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailRow label="Role"         value={employer.role} />
            <DetailRow label="Verified By"  value={employer.verifiedBy} />
            <DetailRow label="Tenure"       value={employer.tenure} />
            <DetailRow label="Exit Reason"  value={employer.exitReason} />
            <DetailRow label="Rehire"       value={employer.rehireEligible ? "✓ Eligible" : "Not Eligible"} />
        </div>

        <div className="flex items-start gap-2 mt-2 pt-4 border-t border-slate-200">
            <CheckSquare size={14} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-slate-500">{employer.detail}</p>
        </div>
    </div>
);

export const EmploymentCheck = ({ data }) => (
    <GlassCard className="p-8">
        <SectionTitle number="5" title="Employment History Audit" subtitle={data.subtitle} status={data.status} />
        <div className="space-y-5">
            {data.employers.map((emp, i) => (
                <EmployerCard key={i} employer={emp} index={i} />
            ))}
        </div>
    </GlassCard>
);
