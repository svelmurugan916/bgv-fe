import React from 'react';
import { Briefcase, Phone, Mail, FileText, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import BaseCheckLayout from "./BaseCheckLayout.jsx";

const CheckExperience = ({employmentId}) => {
    const isSubmitted = true; // Toggle for UI testing

    return (
        <BaseCheckLayout
            title="Employment Verification"
            description="Primary source verification of employment."
            status={"IN_PROGRESS"}
            checkId={employmentId}
        >
            <div className="space-y-6 p-8 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Employment Field</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[#5D4591] uppercase">Candidate Input</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-emerald-600 uppercase">Verified Data</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        <ComparisonRow label="Company Name" value="Microsoft India" />
                        <ComparisonRow label="Designation" value="Software Engineer" />
                        <ComparisonRow label="Joining Date" value="12-05-2021" />
                        <ComparisonRow label="Relieved Date" value="15-09-2023" />
                        <ComparisonRow label="Employee ID" value="MS-99281" />
                        </tbody>
                    </table>
                </div>

                {/* HR Contact Card */}
                <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 flex items-center gap-2 mb-2">
                        <Briefcase size={16} className="text-[#5D4591]" />
                        <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">HR / Manager Point of Contact</h4>
                    </div>
                    <HRInfo label="HR Name" value="Sanjana Reddy" />
                    <HRInfo label="HR Email" value="sanjana.r@microsoft.com" />
                    <HRInfo label="HR Contact" value="+91 90000 11111" />
                </div>
            </div>
        </BaseCheckLayout>
    );
};

const ComparisonRow = ({ label, value }) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">{label}</td>
        <td className="px-6 py-4 text-sm font-bold text-slate-700">{value}</td>
        <td className="px-6 py-4">
            <input type="text" placeholder={`Enter verified ${label}`} className="w-full bg-slate-50 border border-transparent rounded-lg px-3 py-2 text-xs font-bold focus:bg-white focus:border-emerald-200 outline-none transition-all" />
        </td>
    </tr>
);

const HRInfo = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-bold text-[#8B78B4] uppercase">{label}</p>
        <p className="text-sm font-bold text-[#241B3B]">{value}</p>
    </div>
);


export default CheckExperience;
