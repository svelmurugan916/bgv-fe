// VerificationCard.jsx
import React from "react";
import {
    Check, Edit3, X, Link as LinkIcon, MessageSquare
} from 'lucide-react';
import ActionButton from "./ActionButton.jsx";


const VerificationCard = ({ label, provided, field, finding, onUpdate, icon, error, candidateEnteredData, fieldType = 'text' }) => {
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

    const inputType = fieldType === 'date' ? 'date' :
        fieldType === 'email' ? 'email' :
            fieldType === 'tel' ? 'tel' :
                fieldType === 'url' ? 'url' : 'text';


    return (
        <div className={`group relative rounded-[24px] border transition-all duration-500
            ${getBorderColor()} ${!isPending && !error ? 'shadow-sm' : 'hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'}` }>

            {/* Adjusted grid-cols-16 for better spacing and new elements */}
    <div className="grid grid-cols-16 items-start p-6 gap-4"> {/* Changed items-center to items-start for textarea alignment */}
        {/* Attribute */}
        <div className="col-span-3 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300
                        ${isMatch ? 'bg-emerald-500 text-white' :
                isNegative ? 'bg-rose-500 text-white' :
                    isIncorrect ? 'bg-amber-500 text-white' : error ? 'bg-rose-100 text-rose-500' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm'}` }>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] mb-0.5 ${error ? 'text-rose-500' : 'text-slate-400'}` }>
            {error ? error : 'Attribute'}
        </span>
        <span className="text-xs font-bold text-slate-900 tracking-tight">{label}</span>
    </div>
</div>

    {/* Candidate Claim */}
    <div className="col-span-3 flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Candidate Claim</span>
        {fieldType === 'textarea' ? (
            <div className={`text-sm font-semibold whitespace-pre-wrap min-h-[80px] ${isMatch ? 'text-emerald-700' : 'text-slate-700'}`}>
                {provided}
            </div>
        ) : (
            <p className={`text-sm font-semibold truncate ${isMatch ? 'text-emerald-700' : 'text-slate-700'}`}>
                {provided}
            </p>
        )}
    </div>

    {/* Verified Data */}
    <div className="col-span-3 flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Verified Data</span>
        {(isIncorrect || isNegative) ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                {fieldType === 'textarea' ? (
                    <textarea
                        value={finding.value}
                        onChange={(e) => onUpdate(field, { value: e.target.value })}
                        placeholder={`Enter verified ${label.toLowerCase()}...`}
                        rows={4} // Default rows for textarea
                        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none resize-y
                                        ${error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-100 focus:border-slate-300'}`}
                    />
                ) : (
                    <input
                        type={inputType}
                        value={finding.value}
                        onChange={(e) => onUpdate(field, { value: e.target.value })}
                        placeholder={`Enter correct ${label.toLowerCase()}...`}
                        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none
                                        ${error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-100 focus:border-slate-300'}`}
                    />
                )}
            </div>
        ) : isMatch ? (
            <div className="flex items-center gap-2 text-emerald-600 animate-in zoom-in duration-300">
                <Check size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Match</span>
            </div>
        ) : (
            fieldType === 'textarea' ? (
                <div className={`text-sm font-semibold whitespace-pre-wrap min-h-[80px] ${isPending ? 'text-slate-500 italic' : 'text-slate-700'}`}>
                    {finding.value || 'Pending Verification'}
                </div>
            ) : (
                <p className={`text-sm font-semibold truncate ${isPending ? 'text-slate-500 italic' : 'text-slate-700'}`}>
                    {finding.value || 'Pending Verification'} {/* Show current verified value or placeholder */}
                </p>
            )
        )}
    </div>

    {/* Source Link / Document (per-attribute, now clickable) */}
    <div className="col-span-5 flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Source Link</span>
        {finding.sourceLink && !isIncorrect && !isNegative ? ( // Check if not in editing/negative state
            <a
                href={finding.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-600 hover:underline transition-all flex items-center gap-1"
            >
                <LinkIcon size={12} />
                <span className="truncate">{finding.sourceLink}</span>
            </a>
        ) : (
            <input
                type="url"
                value={finding.sourceLink || ''}
                onChange={(e) => onUpdate(field, { sourceLink: e.target.value })}
                placeholder="e.g. https://..."
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none
                                ${error ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-700' : 'border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-100 focus:border-slate-300'}` }
                disabled={isMatch && !isIncorrect && !isNegative} // Disable if matched and not explicitly being edited/flagged
            />
        )}
    </div>

    {/* Action Buttons */}
    <div className="col-span-2 flex justify-end items-center gap-2">
        {/* Placeholder for Per-Attribute Notes button (future enhancement) */}
        {/* <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-600 border border-slate-200 transition-all duration-300" title="Add Note">
                        <MessageSquare size={16} />
                    </button> */}
        <ActionButton active={isMatch} type="match" icon={<Check size={16} />} onClick={() => onUpdate(field, { status: 'match', value: candidateEnteredData })} />
        <ActionButton active={isIncorrect} type="edit" icon={<Edit3 size={16} />} onClick={() => onUpdate(field, { status: 'incorrect' })} />
        <ActionButton active={isNegative} type="error" icon={<X size={16} />} onClick={() => onUpdate(field, { status: 'negative' })} />
    </div>
</div>
</div>
);
};

export default VerificationCard;
