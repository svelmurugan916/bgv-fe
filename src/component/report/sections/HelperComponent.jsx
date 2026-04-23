// components/bgv/atoms/index.jsx
import {
    CheckSquare, AlertTriangle, Shield, Gavel,
    MapPin, BookOpen, Briefcase, Globe, Users,
} from "lucide-react";

/* ── Status Badge ── */
export const StatusBadge = ({ status, small = false }) => {
    const isVerified = status === "VERIFIED";
    const isClear    = status === "CLEAR";
    const isFlag     = status === "FLAG";

    const base = small
        ? "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
        : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider";

    if (isVerified || isClear)
        return (
            <span className={`${base} bg-emerald-100 text-emerald-700 border border-emerald-200`}>
        <CheckSquare size={small ? 10 : 12} strokeWidth={2.5} />
                {status}
      </span>
        );

    if (isFlag)
        return (
            <span className={`${base} bg-amber-100 text-amber-700 border border-amber-200`}>
        <AlertTriangle size={small ? 10 : 12} strokeWidth={2.5} />
        MINOR FLAG
      </span>
        );

    return (
        <span className={`${base} bg-slate-100 text-slate-500 border border-slate-200`}>
      {status}
    </span>
    );
};

/* ── Section Title ── */
export const SectionTitle = ({ number, title, subtitle, status }) => (
    <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-indigo-200">
                {number}
            </div>
            <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                {subtitle && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
        {status && <StatusBadge status={status} />}
    </div>
);

/* ── Glass Card ── */
export const GlassCard = ({ children, className = "" }) => (
    <div className={`
    bg-white/80 backdrop-blur-sm border border-white/60
    rounded-[2rem] shadow-xl shadow-slate-200/60
    ${className}
  `}>
        {children}
    </div>
);

/* ── Detail Row ── */
export const DetailRow = ({ label, value, mono = false }) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-xs font-bold text-slate-700 leading-snug ${mono ? "font-mono" : ""}`}>
            {value || "—"}
        </p>
    </div>
);

/* ── Pillar Icon ── */
export const PillarIcon = ({ icon, size = 18 }) => {
    const icons = {
        shield:    <Shield    size={size} />,
        gavel:     <Gavel     size={size} />,
        mapPin:    <MapPin    size={size} />,
        book:      <BookOpen  size={size} />,
        briefcase: <Briefcase size={size} />,
        globe:     <Globe     size={size} />,
        users:     <Users     size={size} />,
    };
    return icons[icon] || <Shield size={size} />;
};

/* ── Divider ── */
export const Divider = () => (
    <div className="border-t border-slate-100 my-5" />
);

/* ── Info Chip ── */
export const InfoChip = ({ label }) => (
    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-200">
    {label}
  </span>
);
