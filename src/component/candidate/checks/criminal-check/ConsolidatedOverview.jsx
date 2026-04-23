import {CheckCircle2, FileSearch, Scale, ShieldAlert} from "lucide-react";
import React from "react";

const ConsolidatedOverview = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Records"       value={data.numberOfCases}        icon={<FileSearch size={20}/>}   color="text-slate-600" />
        <StatCard label="Criminal Hits"       value={data.numberOfCriminalCases} icon={<ShieldAlert size={20}/>}  color="text-rose-600" />
        <StatCard label="Civil Hits"          value={data.numberOfCivilCases}    icon={<Scale size={20}/>}        color="text-indigo-600" />
        <StatCard
            label="Verification Status"
            value={data.verificationStatus}
            icon={<CheckCircle2 size={20}/>}
            color={data.verificationStatus === 'FAILED' ? 'text-rose-600' : 'text-emerald-600'}
        />
    </div>
);

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-slate-800">{value}</p>
        </div>
    </div>
);

export default ConsolidatedOverview;