import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';

const CheckEducation = () => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Academic Verification</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-[10px] font-bold uppercase text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">Waiting for Candidate</button>
                    <button className="px-4 py-2 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">Clear Check</button>
                </div>
            </div>

            {/* COMPARISON TABLE */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Field</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-[#5D4591] uppercase">Candidate Data</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-emerald-600 uppercase">Verified Data</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    <ComparisonRow label="University" submitted="Stanford University" />
                    <ComparisonRow label="Degree" submitted="B.E Computer Science" />
                    <ComparisonRow label="Year of Passing" submitted="2020" />
                    <ComparisonRow label="Roll Number" submitted="REG-882910" />
                    </tbody>
                </table>
            </div>

            {/* DOCUMENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#5D4591]/40 transition-all">
                    <div className="flex items-center gap-3">
                        <FileText className="text-slate-400" size={20} />
                        <span className="text-xs font-bold text-slate-700">Degree_Certificate.pdf</span>
                    </div>
                    <button className="text-[10px] font-bold text-[#5D4591] uppercase">View</button>
                </div>
            </div>

            <FeedbackPanel />
        </div>
    );
};

const ComparisonRow = ({ label, submitted }) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">{label}</td>
        <td className="px-6 py-4 text-sm font-bold text-slate-700">{submitted}</td>
        <td className="px-6 py-4">
            <input
                type="text"
                placeholder={`Confirm ${label}`}
                className="w-full bg-slate-50 border border-transparent rounded-lg px-3 py-1.5 text-xs font-bold focus:bg-white focus:border-emerald-200 outline-none transition-all"
            />
        </td>
    </tr>
);

const FeedbackPanel = () => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Verification Comments</label>
        <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-[#5D4591]/40 transition-all min-h-[100px]" />
        <div className="mt-4 flex justify-end">
            <button className="bg-slate-800 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-all shadow-lg">Submit Feedback</button>
        </div>
    </div>
);

export default CheckEducation;
