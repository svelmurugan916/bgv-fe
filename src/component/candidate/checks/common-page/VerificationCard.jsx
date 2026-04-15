// VerificationCard.jsx
import React from "react";
import { Check, Edit3, Link as LinkIcon, X, AlertCircle, Clock } from 'lucide-react';
import ActionButton from "./ActionButton.jsx";

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
    const isMatch = finding.status === 'match';
    const isIncorrect = finding.status === 'incorrect';
    const isNegative = finding.status === 'negative';
    const isPending = finding.status === 'pending';

    const getBorderColor = () => {
        if (error) return 'border-rose-500 bg-rose-50/20';
        if (isMatch) return 'border-emerald-500/30 bg-emerald-50/10';
        if (isIncorrect) return 'border-amber-500/30 bg-amber-50/10';
        if (isNegative) return 'border-rose-500/30 bg-rose-50/10';
        return 'border-slate-200 bg-white';
    };

    // --- PREMIUM STATUS BADGE COMPONENT ---
    const StatusBadge = () => {
        const configs = {
            match: {
                label: 'Matched',
                icon: <Check size={12} strokeWidth={4} />,
                style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            },
            incorrect: {
                label: 'Incorrect',
                icon: <Edit3 size={12} />,
                style: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            },
            negative: {
                label: 'Negative',
                icon: <X size={12} strokeWidth={3} />,
                style: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
            },
            pending: {
                label: 'Pending',
                icon: <Clock size={12} />,
                style: 'bg-slate-100 text-slate-400 border-slate-200'
            }
        };

        const config = configs[finding.status] || configs.pending;

        return (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] animate-in fade-in zoom-in duration-500 ${config.style}`}>
                {config.icon}
                {config.label}
            </div>
        );
    };

    const inputType = fieldType === 'date' ? 'date' :
        fieldType === 'email' ? 'email' :
            fieldType === 'tel' ? 'tel' :
                fieldType === 'url' ? 'url' : 'text';

    return (
        <div className={`group relative rounded-[24px] border transition-all duration-500
            ${getBorderColor()} ${!isPending && !error ? 'shadow-sm' : 'hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'}`}>

            <div className="grid grid-cols-16 items-start p-6 gap-4">
                {/* Attribute */}
                <div className="col-span-3 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300
                        ${isMatch ? 'bg-emerald-500 text-white' :
                        isNegative ? 'bg-rose-500 text-white' :
                            isIncorrect ? 'bg-amber-500 text-white' : error ? 'bg-rose-100 text-rose-500' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm'}`}>
                        {icon}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] mb-0.5 ${error ? 'text-rose-500' : 'text-slate-400'}`}>
                            {error ? error : 'Attribute'}
                        </span>
                        <span className="text-xs font-bold text-slate-900 tracking-tight">{label}</span>
                    </div>
                </div>

                {/* Candidate Claim */}
                <div className="col-span-3 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Candidate Claim</span>
                    <p className={`text-sm font-semibold truncate ${isMatch ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {provided || '—'}
                    </p>
                </div>

                {/* Verified Data */}
                <div className="col-span-3 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Verified Data</span>
                    {(isIncorrect || isNegative) ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <input
                                type={inputType}
                                value={finding.value}
                                onChange={(e) => onUpdate(field, {value: e.target.value})}
                                placeholder={`Enter correct ${label.toLowerCase()}...`}
                                disabled={readonly}
                                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none
                                    ${error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-100 focus:border-slate-300'}
                                    ${readonly ? 'bg-slate-50/50 cursor-not-allowed border-dashed' : ''}`}
                            />
                        </div>
                    ) : isMatch ? (
                        <div className="flex items-center gap-2 text-emerald-600 animate-in zoom-in duration-300">
                            <Check size={14} strokeWidth={3}/>
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Match</span>
                        </div>
                    ) : (
                        <p className={`text-sm font-semibold truncate ${isPending ? 'text-slate-500 italic' : 'text-slate-700'}`}>
                            {finding.value || 'Pending Verification'}
                        </p>
                    )}
                </div>

                {/* Source Link */}
                <div className="col-span-4 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Source Link</span>
                    {finding.sourceLink && readonly ? (
                        <a
                            href={finding.sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-all flex items-center gap-2 group/link"
                        >
                            <LinkIcon size={12} className="group-hover/link:rotate-45 transition-transform" />
                            <span className="truncate">View Evidence Source</span>
                        </a>
                    ) : (
                        <input
                            type="url"
                            value={finding.sourceLink || ''}
                            onChange={(e) => onUpdate(field, {sourceLink: e.target.value})}
                            placeholder="e.g. https://..."
                            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none
                                ${error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-100 focus:border-slate-300'}
                                ${readonly ? 'bg-slate-50/50 cursor-not-allowed border-dashed' : ''}`}
                            disabled={readonly}
                        />
                    )}
                </div>

                {/* --- UPDATED ACTION/STATUS SECTION --- */}
                <div className="col-span-3 flex justify-end items-center">
                    {readonly ? (
                        <StatusBadge />
                    ) : (
                        <div className="flex items-center gap-2">
                            <ActionButton active={isMatch} type="match" icon={<Check size={16}/>}
                                          onClick={() => onUpdate(field, {status: 'match', value: candidateEnteredData})}/>
                            <ActionButton active={isIncorrect} type="edit" icon={<Edit3 size={16}/>}
                                          onClick={() => onUpdate(field, {status: 'incorrect'})}/>
                            <ActionButton active={isNegative} type="error" icon={<X size={16}/>}
                                          onClick={() => onUpdate(field, {status: 'negative'})}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationCard;
