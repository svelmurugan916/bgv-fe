// src/components/identity-check/components/DataComparisonField.jsx
import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import SimilarityScore from "../SimilarityScore.jsx";

const DataComparisonField = ({
                                 label,
                                 candidateClaim,
                                 systemVerifiedData,
                                 isMatch, // true, false, or null for pending
                                 systemVerifiedDataLabel = "System Verified Data",
                                 candidateClaimLabel = "Candidate Claim",
                                 icon,
                                comparisonScore
                             }) => {

    const getStatusIcon = () => {
        if (isMatch === true) return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
        if (isMatch === false) return <AlertTriangle size={16} className="text-rose-500 shrink-0" />;
        return null;
    };

    return (
        <div className="flex items-start gap-4 border-b border-slate-100  last:border-b-0 group">
            {/* 1. LEFT ICON ANCHOR */}
            {icon && (
                <div className="mt-1 text-slate-400 group-hover:text-[#5D4591] transition-colors shrink-0">
                    {React.cloneElement(icon, { size: 16 })}
                </div>
            )}

            {/* 2. CONTENT AREA */}
            <div className="flex-1 min-w-0">
                {/* Field Label */}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    {label}
                </p>

                {/* Data Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Candidate Side */}
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group/field">

                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                            {candidateClaimLabel}
                        </p>
                        <p className="text-sm font-bold text-slate-700 truncate">
                            {candidateClaim || 'Not Provided'}
                        </p>
                    </div>
                    </div>

                    {/* System Side */}
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group/field">
                        {/* Left: Data Labels */}
                        <div className="space-y-1 min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {systemVerifiedDataLabel}
                            </p>
                            <p className={`text-sm font-bold truncate ${isMatch === false ? 'text-rose-600' : 'text-slate-900'}`}>
                                {systemVerifiedData || (isMatch === null ? 'Awaiting Validation...' : 'N/A')}
                            </p>
                        </div>

                        {/* Right: Status Cluster */}
                        <div className="shrink-0 flex items-center gap-3">

                            {/* 1. Similarity Score (Shown only for names/fuzzy matches) */}
                            {comparisonScore !== undefined && comparisonScore !== null && (
                                <div className="pr-3 border-r border-slate-200">
                                    <SimilarityScore score={comparisonScore} />
                                </div>
                            )}

                            {/* 2. Primary Status Icon */}
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 group-hover/field:scale-110 transition-transform duration-200">
                                {getStatusIcon()}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DataComparisonField;
