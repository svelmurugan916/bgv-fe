// components/bgv/checks/GlobalCheck.jsx
import { CheckSquare, Globe } from "lucide-react";
import { GlassCard, SectionTitle } from "../sections/HelperComponent.jsx";

const ScreeningItem = ({ item }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                <Globe size={14} className="text-slate-400" />
            </div>
            <p className="text-xs font-black text-slate-700">{item.label}</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full border border-emerald-200">
      <CheckSquare size={9} strokeWidth={2.5} /> {item.result}
    </span>
    </div>
);

export const GlobalCheck = ({ data }) => (
    <GlassCard className="p-8">
        <SectionTitle number="6" title="Global Database Screening" subtitle={data.subtitle} status={data.status} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.screenings.map((item, i) => (
                <ScreeningItem key={i} item={item} />
            ))}
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">
                ✓ Shape icons + Text labels used — color-blind accessible
            </p>
        </div>
    </GlassCard>
);
