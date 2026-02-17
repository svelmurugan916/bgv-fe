import React, { useState } from 'react';
import {
    Check, Edit3, X, AlertCircle,
    ChevronRight, GraduationCap, School, Calendar, Hash
} from 'lucide-react';
import BaseCheckLayout from "./BaseCheckLayout.jsx";

const CheckEducation = ({ educationId }) => {
    const [findings, setFindings] = useState({
        qualification: { status: 'pending', value: '' },
        university: { status: 'pending', value: '' },
        institute: { status: 'pending', value: '' },
        degree: { status: 'pending', value: '' },
        rollNo: { status: 'pending', value: '' },
        passingYear: { status: 'pending', value: '' },
        gpa: { status: 'pending', value: '' }
    });

    const educationData = {
        status: "IN_PROGRESS",
        candidateProvided: {
            qualification: { val: "Post-Graduate", icon: <GraduationCap size={16}/> },
            university: { val: "Anna University", icon: <School size={16}/> },
            institute: { val: "KLNCE", icon: <School size={16}/> },
            degree: { val: "Master of Computer Science", icon: <GraduationCap size={16}/> },
            rollNo: { val: "CS2021-5594A", icon: <Hash size={16}/> },
            passingYear: { val: "June 2023", icon: <Calendar size={16}/> },
            gpa: { val: "3.8 GPA", icon: <Hash size={16}/> }
        }
    };

    const handleUpdateFinding = (field, status, value = '') => {
        setFindings(prev => ({
            ...prev,
            [field]: { status, value: status === 'match' ? educationData.candidateProvided[field].val : value }
        }));
    };

    return (
        <BaseCheckLayout
            title="Academic Verification"
            description="Primary source verification of educational credentials."
            status={educationData?.status}
            checkId={educationId}
        >
            <div className="max-w-5xl mx-auto p-8 space-y-4">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Credential Details</h3>
                        <p className="text-sm text-slate-500 font-medium">Compare candidate claims against verified records</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-[#F9F7FF] rounded-xl border border-[#EBE5FF] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#5D4591]"></span>
                            <span className="text-[11px] font-bold text-[#5D4591] uppercase tracking-wider">Manual Review</span>
                        </div>
                    </div>
                </div>

                {/* Verification Cards */}
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(educationData.candidateProvided).map(([key, data]) => (
                        <VerificationCard
                            key={key}
                            field={key}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            provided={data.val}
                            icon={data.icon}
                            finding={findings[key]}
                            onUpdate={handleUpdateFinding}
                        />
                    ))}
                </div>
            </div>
        </BaseCheckLayout>
    );
};

/* --- PREMIUM CARD COMPONENT --- */
const VerificationCard = ({ label, provided, field, finding, onUpdate, icon }) => {
    const isMatch = finding.status === 'match';
    const isEdit = finding.status === 'edit';
    const isError = finding.status === 'negative';
    const isPending = finding.status === 'pending';

    const getStatusColor = () => {
        if (isMatch) return 'bg-emerald-500';
        if (isEdit) return 'bg-amber-500';
        if (isError) return 'bg-rose-500';
        return 'bg-slate-200';
    };

    return (
        <div className={`group relative bg-white rounded-2xl border transition-all duration-300 
            ${!isPending ? 'shadow-md border-transparent' : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}>

            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${getStatusColor()}`} />

            {/* Change to a 12-column Grid for perfect alignment */}
            <div className="grid grid-cols-12 items-center p-5 gap-4">

                {/* 1. Attribute (Col 1-3) */}
                <div className="col-span-3 flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#F9F7FF] group-hover:text-[#5D4591] text-slate-400 transition-colors">
                        {icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                </div>

                {/* 2. Candidate Claim (Col 4-7) */}
                <div className="col-span-4">
                    <p className={`text-sm font-bold transition-colors ${isMatch ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {provided}
                    </p>
                </div>

                {/* 3. Verified Input (Col 8-10) */}
                <div className="col-span-3">
                    {(isEdit || isError) ? (
                        <div className="relative animate-in fade-in slide-in-from-right-2 duration-300">
                            <input
                                type="text"
                                value={finding.value}
                                onChange={(e) => onUpdate(field, finding.status, e.target.value)}
                                placeholder={`Verified ${label}...`}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-[#5D4591] outline-none focus:border-[#5D4591] focus:bg-white transition-all"
                            />
                            <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-black text-[#5D4591] uppercase tracking-tighter">
                                Verified Finding
                            </span>
                        </div>
                    ) : (
                        <div className="h-10" /> /* Spacer to keep height consistent */
                    )}
                </div>

                {/* 4. Actions (Col 11-12) */}
                <div className="col-span-2 flex justify-end gap-1">
                    <ActionButton active={isMatch} type="match" icon={<Check size={14} />} onClick={() => onUpdate(field, 'match')} />
                    <ActionButton active={isEdit} type="edit" icon={<Edit3 size={14} />} onClick={() => onUpdate(field, 'edit')} />
                    <ActionButton active={isError} type="error" icon={<X size={14} />} onClick={() => onUpdate(field, 'negative')} />
                </div>
            </div>
        </div>
    );
};


const ActionButton = ({ active, type, icon, onClick }) => {
    const styles = {
        match: active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600',
        edit: active ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-600',
        error: active ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600',
    };

    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${styles[type]}`}
        >
            {icon}
        </button>
    );
};

export default CheckEducation;
