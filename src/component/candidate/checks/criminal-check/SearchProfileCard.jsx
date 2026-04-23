import {Fingerprint} from "lucide-react";
import React from "react";

const SearchProfileCard = ({ data }) => (
    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
                <Fingerprint size={16} className="text-indigo-500" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Search Parameters</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Subject Name</p>
                    <p className="text-sm font-black text-slate-800">{data.nameChecked}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Father's Name</p>
                    <p className="text-sm font-bold text-slate-600">{data.fatherNameChecked}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">State / Year</p>
                    <p className="text-sm font-bold text-slate-600">{data.stateChecked} ({data.yearChecked})</p>
                </div>
                <div className="col-span-2 md:col-span-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Address Checked</p>
                    <p className="text-sm font-bold text-slate-600">{data.addressChecked}</p>
                </div>
            </div>
        </div>
        <div className="md:w-1/3 bg-slate-50 p-5 rounded-3xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Automated Remarks</p>
            <p className="text-[11px] leading-relaxed font-medium text-slate-500 italic">"{data.automatedVerificationRemarks}"</p>
        </div>
    </div>
);

export default SearchProfileCard;