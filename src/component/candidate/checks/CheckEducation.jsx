import React, { useState } from 'react';
import {
    CheckCircle2, FileText, XCircle,
    Edit3, Send, Paperclip, AlertCircle, Check, X
} from 'lucide-react';
import BaseCheckLayout from "./BaseCheckLayout.jsx";

const CheckEducation = ({ educationId }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [verifierRemarks, setVerifierRemarks] = useState("");
    const [finalStatus, setFinalStatus] = useState("");

    const [findings, setFindings] = useState({
        qualification: { status: 'pending', value: '' },
        institute: { status: 'pending', value: '' },
        university: { status: 'pending', value: '' },
        degree: { status: 'pending', value: '' },
        rollNo: { status: 'pending', value: '' },
        passingYear: { status: 'pending', value: '' },
        gpa: { status: 'pending', value: '' }
    });

    const educationData = {
        status: "IN_PROGRESS",
        candidateProvided: {
            qualification: "Post-Graduate",
            university: "Anna University",
            institute: "KLNCE",
            degree: "Master of Computer Science",
            rollNo: "CS2021-5594A",
            passingYear: "June 2023",
            gpa: "3.8 GPA"
        }
    };

    const handleUpdateFinding = (field, status, value = '') => {
        setFindings(prev => ({
            ...prev,
            [field]: { status, value: status === 'match' ? educationData.candidateProvided[field] : value }
        }));
    };

    return (
        <BaseCheckLayout
            title="Academic Verification"
            description="Verification of educational credentials via primary source."
            status={educationData?.status}
            checkId={educationId}
            onStatusUpdate={() => {}}
            setIsEditModalOpen={setIsEditModalOpen}
        >
            <div className="p-8 mx-auto space-y-6 animate-in fade-in duration-500">

                {/* 1. SLEEK VERIFICATION LIST */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
                    <div className="grid grid-cols-12 px-6 py-3 bg-slate-50/50 border-b border-slate-100">
                        <div className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Attribute</div>
                        <div className="col-span-5 text-[9px] font-black text-[#5D4591] uppercase tracking-widest">Candidate Claim</div>
                        <div className="col-span-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Verification Action</div>
                    </div>

                    {Object.entries(educationData.candidateProvided).map(([key, val]) => (
                        <CompactVerificationRow
                            key={key}
                            field={key}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            provided={val}
                            finding={findings[key]}
                            onUpdate={handleUpdateFinding}
                        />
                    ))}
                </div>

            </div>
        </BaseCheckLayout>
    );
};

/* --- MINI COMPONENT: COMPACT ROW --- */
const CompactVerificationRow = ({ label, provided, field, finding, onUpdate }) => {
    const isMatch = finding.status === 'match';
    const isEdit = finding.status === 'edit';
    const isError = finding.status === 'negative';

    return (
        <div className={`grid grid-cols-12 px-6 py-4 items-center transition-all duration-300 ${isMatch ? 'bg-emerald-50/30' : isError ? 'bg-rose-50/30' : isEdit ? 'bg-amber-50/30' : ''}`}>
            <div className="col-span-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
            </div>
            <div className="col-span-5">
                <div className="flex flex-col">
                    <span className={`text-xs font-bold ${isMatch ? 'text-emerald-700' : 'text-slate-700'}`}>{provided}</span>
                    {(isEdit || isError) && (
                        <input
                            type="text"
                            value={finding.value}
                            onChange={(e) => onUpdate(field, finding.status, e.target.value)}
                            placeholder="Enter verified finding..."
                            className="mt-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#5D4591] outline-none shadow-sm animate-in slide-in-from-top-1"
                        />
                    )}
                </div>
            </div>
            <div className="col-span-4 flex justify-end gap-1.5">
                <MiniToggle
                    active={isMatch}
                    color="emerald"
                    icon={<Check size={14} />}
                    onClick={() => onUpdate(field, 'match')}
                />
                <MiniToggle
                    active={isEdit}
                    color="amber"
                    icon={<Edit3 size={14} />}
                    onClick={() => onUpdate(field, 'edit')}
                />
                <MiniToggle
                    active={isError}
                    color="rose"
                    icon={<X size={14} />}
                    onClick={() => onUpdate(field, 'negative')}
                />
            </div>
        </div>
    );
};

const MiniToggle = ({ active, color, icon, onClick }) => {
    const styles = {
        emerald: active ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-50 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50',
        amber: active ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-slate-50 text-slate-300 hover:text-amber-500 hover:bg-amber-50',
        rose: active ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50',
    };

    return (
        <button
            onClick={onClick}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${styles[color]}`}
        >
            {icon}
        </button>
    );
};

export default CheckEducation;
