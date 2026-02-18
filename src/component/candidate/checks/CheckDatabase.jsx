import React from 'react';
import { Database, Search, ShieldCheck, AlertCircle, Globe } from 'lucide-react';
import FeedbackForm from "./FeedbackForm.jsx";
import BaseCheckLayout from "./BaseCheckLayout.jsx";

const CheckDatabase = ({taskId}) => {
    return (
        <BaseCheckLayout
            title="Global Database Search"
            description="Select records and charges to be included in the report."
            status={"IN_PROGRESS"}
            checkId={taskId}
        >
        <div className="p-8 space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800"></h2>
                <button className="px-4 py-2 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">Verified (No Hits)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DatabaseCard icon={<Globe size={20}/>} label="Global Watchlist" status="Clear" color="text-emerald-600" />
                <DatabaseCard icon={<ShieldCheck size={20}/>} label="AML / Sanctions" status="Clear" color="text-emerald-600" />
                <DatabaseCard icon={<Search size={20}/>} label="Credit Default" status="Low Risk" color="text-[#5D4591]" />
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Search Scope</label>
                <div className="flex flex-wrap gap-2">
                    {['OFAC', 'INTERPOL', 'RBI Defaulters', 'SEBI Action', 'FATF List'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
        </BaseCheckLayout>
    );
};

const DatabaseCard = ({ icon, label, status, color }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
        <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 ${color}`}>
            {icon}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{status}</p>
    </div>
);

export default CheckDatabase;
