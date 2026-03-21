import React from "react";

const SimilarityScore = ({ score }) => {
    const percentage = Math.round(score * 100);
    const colorClass = percentage >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : percentage >= 75 ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-rose-600 bg-rose-50 border-rose-100';

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${colorClass} text-[10px] font-black`}>
            <span>{percentage}% MATCH</span>
        </div>
    );
};

export default SimilarityScore;