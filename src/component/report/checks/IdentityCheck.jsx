// components/bgv/checks/IdentityCheck.jsx
import { CheckSquare } from "lucide-react";
import { GlassCard, SectionTitle, StatusBadge, Divider } from "../sections/HelperComponent.jsx";

export const IdentityCheck = ({ data }) => (
    <GlassCard className="p-8">
        <SectionTitle number="1" title="Identity & Fraud Prevention" subtitle={data.subtitle} status={data.status} />
        <div className="space-y-0 divide-y divide-slate-100">
            {data.rows.map((row, i) => (
                <div key={i} className="flex items-center justify-between py-5">
                    <div className="flex-1">
                        <p className="text-xs font-black text-slate-700">{row.check}</p>
                        <p className="text-[10px] font-bold text-indigo-500 mt-0.5">{row.value}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">Source: {row.source}</p>
                    </div>
                    <StatusBadge status={row.status} small />
                </div>
            ))}
        </div>
    </GlassCard>
);
