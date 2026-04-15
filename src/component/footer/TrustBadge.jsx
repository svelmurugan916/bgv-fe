import React from 'react';

const TrustBadge = ({ icon: Icon, label, subtext }) => (
    <div className="flex items-center gap-3 px-5 py-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-[#5D4591]/50 transition-all group">
        <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-[#A78BFA] transition-colors">
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider leading-none mb-1">{label}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{subtext}</span>
        </div>
    </div>
);

export default TrustBadge;
