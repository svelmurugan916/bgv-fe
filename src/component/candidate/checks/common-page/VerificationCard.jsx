import React from "react";
import {
    Check, Edit3, X, AlertTriangle, Clock,
    MessageSquare, ArrowRight, ShieldAlert,
    CornerDownRight, ShieldCheck, AlertCircle
} from 'lucide-react';
import ActionButton from "./ActionButton.jsx";
import SingleSelectDropdown from "../../../dropdown/SingleSelectDropdown.jsx";

const severityOptions = [
    { value: 'MINOR', text: 'Minor' },
    { value: 'MODERATE', text: 'Moderate' },
    { value: 'MAJOR', text: 'Major' },
    { value: 'CRITICAL', text: 'Critical' },
    { value: 'ADVERSE', text: 'Adverse' }
];

const VerificationCard = ({
                              label,
                              provided,
                              field,
                              finding,
                              onUpdate,
                              icon,
                              error,
                              candidateEnteredData,
                              fieldType = 'text',
                              readonly = false
                          }) => {

    console.log("finding -- ", finding);
    const isMatch = finding.status === 'match';
    const isIncorrect = finding.status === 'incorrect';
    const isNegative = finding.status === 'negative';
    const isPending = finding.status === "negative" || finding.status === "incorrect";

    // Senior UX: Determine card border based on Severity + Status
    const getThemeColor = () => {
        if (error) return 'border-rose-500 bg-rose-50/20';
        if (isMatch) return 'border-emerald-500/20 bg-emerald-50/5';
        if (finding.severity === 'CRITICAL' || finding.severity === 'ADVERSE' || isNegative) return 'border-rose-500/20 bg-rose-50/5';
        if (isIncorrect) return 'border-amber-500/20 bg-amber-50/5';
        return 'border-slate-200 bg-white';
    };

    return (
        <div className={`group relative rounded-[32px] border transition-all duration-500 ${getThemeColor()} 
            ${!isPending ? 'shadow-sm' : 'hover:shadow-md'}`}>

            <div className="p-6">
                {/* --- SECTION 1: THE CORE AUDIT ROW --- */}
                <div className="flex items-center justify-between gap-10">

                    {/* Attribute Identity */}
                    <div className="flex items-center gap-4 min-w-[240px]">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 shadow-sm
                            ${isMatch ? 'bg-emerald-500 text-white shadow-emerald-100' :
                            isNegative ? 'bg-rose-500 text-white shadow-rose-100' :
                                isIncorrect ? 'bg-amber-500 text-white shadow-amber-100' : 'bg-slate-100 text-slate-400'}`}>
                            {React.cloneElement(icon, { size: 20 })}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-0.5">Attribute</span>
                            <span className="text-sm font-bold text-slate-900 tracking-tight">{label}</span>
                        </div>
                    </div>

                    {/* The Comparison Bridge */}
                    <div className="flex-1 flex items-center gap-0 bg-slate-100/40 rounded-[20px] p-1 border border-slate-200/50">
                        <div className="flex flex-col flex-1 px-5 py-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Candidate Claim</span>
                            <p className="text-xs font-bold text-slate-600 truncate">{candidateEnteredData || '—'}</p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 -mx-2 z-10">
                            <ArrowRight size={14} className={isPending ? 'text-slate-200' : 'text-indigo-500'} />
                        </div>

                        <div className="flex flex-col flex-1 px-5 py-2 pl-6">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Verified Result</span>
                            {(isIncorrect || isNegative) && !readonly ? (
                                <input
                                    type={fieldType === 'date' ? 'date' : 'text'}
                                    value={finding.value || ''}
                                    onChange={(e) => onUpdate(field, { value: e.target.value })}
                                    className="w-full bg-transparent border-b border-indigo-200 text-xs font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Update value..."
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className={`text-xs font-bold ${isMatch ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {isMatch ? candidateEnteredData : (provided || 'Waiting...')}
                                    </p>
                                    {isMatch && <ShieldCheck size={12} className="text-emerald-500" />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Dock */}
                    <div className="flex items-center gap-3 min-w-[160px] justify-end">
                        {readonly ? (
                            <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.1em]
                                ${isMatch ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                isNegative ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                                    isIncorrect ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-slate-50 text-slate-400'}`}>
                                {finding.status || 'Pending'}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 bg-slate-950/5 p-1.5 rounded-2xl">
                                <ActionButton active={isMatch} type="match" icon={<Check size={16}/>}
                                              onClick={() => onUpdate(field, {status: 'match', value: candidateEnteredData, severity: 'NONE'})}/>
                                <ActionButton active={isIncorrect} type="edit" icon={<Edit3 size={16}/>}
                                              onClick={() => onUpdate(field, {status: 'incorrect', value: candidateEnteredData, remarks: '', severity: 'MINOR'})}/>
                                <ActionButton active={isNegative} type="error" icon={<X size={16}/>}
                                              onClick={() => onUpdate(field, {status: 'negative', value: candidateEnteredData, remarks: '', severity: 'MAJOR'})}/>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- SECTION 2: THE RESOLUTION SHELF (Severity & Remarks) --- */}
                {(isPending || finding.remarks || finding.severity) && (
                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-8 animate-in fade-in slide-in-from-top-4 duration-500">

                        {/* Severity Selection */}
                        <div className="w-[220px] flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={12} className={isMatch ? 'text-slate-300' : 'text-amber-500'} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Risk Severity</span>
                            </div>
                            <SingleSelectDropdown
                                label="Select Severity"
                                options={severityOptions}
                                selected={finding.severity}
                                onSelect={(val) => onUpdate(field, { severity: val })}
                                isOccupyFullWidth={true}
                                disabled={readonly || isMatch}
                                error={!finding.severity && (isIncorrect || isNegative)}
                            />
                        </div>

                        {/* Auditor Remarks */}
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={12} className="text-indigo-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Auditor Remarks {(isIncorrect || isNegative) && <span className="text-rose-500">*</span>}
                                </span>
                            </div>
                            <div className={`relative rounded-xl border transition-all p-3 ${
                                !finding.remarks && (isIncorrect || isNegative) ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50/30 border-slate-100'
                            }`}>
                                <textarea
                                    rows="1"
                                    disabled={readonly}
                                    value={finding.remarks || ''}
                                    onChange={(e) => onUpdate(field, { remarks: e.target.value })}
                                    placeholder={(isIncorrect || isNegative) ? "Classification reason is mandatory for audit trail..." : "Optional internal notes..."}
                                    className="w-full bg-transparent text-xs font-medium text-slate-700 outline-none resize-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Context Labels */}
            {error && (
                <div className="absolute -top-3 right-8 flex items-center gap-2 bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                    <AlertCircle size={10} />
                    Classification Required
                </div>
            )}
        </div>
    );
};

export default VerificationCard;
