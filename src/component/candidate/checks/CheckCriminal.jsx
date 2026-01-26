import React from 'react';
import { ShieldAlert, Gavel, Search, CheckCircle2, FileText } from 'lucide-react';
import FeedbackPanel from "./FeedbackPanel.jsx";

const CheckCriminal = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Criminal Record Search</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">No Records Found</button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Clear Background Finding</h3>
                        <p className="text-sm text-slate-500 font-medium">No matches found in District Court, High Court, or Supreme Court records.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FindingItem label="Police Verification" status="Verified" date="14 Oct 2023" />
                    <FindingItem label="Civil Litigation" status="No Match" date="14 Oct 2023" />
                </div>
            </div>
            <FeedbackPanel />
        </div>
    );
};

const FindingItem = ({ label, status, date }) => (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
            <p className="text-xs font-bold text-slate-700">{status}</p>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase">Checked: {date}</p>
    </div>
);

export default CheckCriminal;
