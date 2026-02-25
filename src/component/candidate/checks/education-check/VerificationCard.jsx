import React from "react";
import ActionButton from "./ActionButton.jsx";
import {
    Check, Edit3, X
} from 'lucide-react';


const VerificationCard = ({ label, provided, field, finding, onUpdate, icon, error }) => {
    const isMatch = finding.status === 'match';
    const isEdit = finding.status === 'incorrect';
    const isError = finding.status === 'negative';
    const isPending = finding.status === 'pending';

    const getBorderColor = () => {
        if (error) return 'border-rose-500 bg-rose-50/20';
        if (isMatch) return 'border-emerald-500/30 bg-emerald-50/10';
        if (isEdit) return 'border-amber-500/30 bg-amber-50/10';
        if (isError) return 'border-rose-500/30 bg-rose-50/10';
        return 'border-slate-200 bg-white';
    };

    return (
        <div className={`group relative rounded-[24px] border transition-all duration-500 
            ${getBorderColor()} ${!isPending && !error ? 'shadow-sm' : 'hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'}`}>

            <div className="grid grid-cols-12 items-center p-6 gap-6">
                <div className="col-span-3 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300
                        ${isMatch ? 'bg-emerald-500 text-white' :
                        isError ? 'bg-rose-500 text-white' :
                            isEdit ? 'bg-amber-500 text-white' : error ? 'bg-rose-100 text-rose-500' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm'}`}>
                        {icon}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] mb-0.5 ${error ? 'text-rose-500' : 'text-slate-400'}`}>
                            {error ? error : 'Attribute'}
                        </span>
                        <span className="text-xs font-bold text-slate-900 tracking-tight">{label}</span>
                    </div>
                </div>

                <div className="col-span-4 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Candidate Claim</span>
                    <p className={`text-sm font-semibold truncate ${isMatch ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {provided}
                    </p>
                </div>

                <div className="col-span-3">
                    {(isEdit || isError) ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <input
                                type="text"
                                value={finding.value}
                                onChange={(e) => onUpdate(field, finding.status, e.target.value)}
                                placeholder={`Enter correct ${label.toLowerCase()}...`}
                                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none
                                    ${error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-100 focus:border-slate-300'}`}
                            />
                        </div>
                    ) : isMatch ? (
                        <div className="flex items-center gap-2 text-emerald-600 animate-in zoom-in duration-300">
                            <Check size={14} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Match</span>
                        </div>
                    ) : (
                        <div className="h-1" />
                    )}
                </div>

                <div className="col-span-2 flex justify-end items-center gap-2">
                    <ActionButton active={isMatch} type="match" icon={<Check size={16} />} onClick={() => onUpdate(field, 'match')} />
                    <ActionButton active={isEdit} type="edit" icon={<Edit3 size={16} />} onClick={() => onUpdate(field, 'incorrect')} />
                    <ActionButton active={isError} type="error" icon={<X size={16} />} onClick={() => onUpdate(field, 'negative')} />
                </div>
            </div>
        </div>
    );
};

export default VerificationCard;
