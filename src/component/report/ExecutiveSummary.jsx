import React from 'react';

const ExecutiveSummary = ({ data }) => {
    const cellClass = "border border-slate-800 p-2 text-[11px]";
    const labelClass = `${cellClass} font-bold bg-slate-50 w-1/4`;
    const valueClass = `${cellClass} w-1/4`;

    return (
        <div className="report-page bg-white font-sans text-slate-900">
            {/* Page Header (Repeated on all pages) */}
            <div className="flex justify-between items-start mb-8 border-b pb-4">
                <div className="space-y-1">
                    <p className="text-xs text-slate-500">Case Number</p>
                    <p className="font-bold text-[#00A38D]">{data.caseNumber}</p>
                </div>
                <div className="text-right">
                    <img src="/logo-speedcheck.png" alt="Logo" className="h-10 ml-auto" />
                </div>
            </div>

            <h2 className="text-center border border-slate-800 py-1 font-bold text-[#00A38D] uppercase tracking-widest mb-6">
                Executive Summary
            </h2>

            <table className="w-full border-collapse">
                <tbody>
                <tr>
                    <td className={labelClass}>Name of Candidate</td>
                    <td className={valueClass}>{data.candidateName}</td>
                    <td className={labelClass}>Case Number</td>
                    <td className={valueClass}>{data.caseNumber}</td>
                </tr>
                <tr>
                    <td className={labelClass}>Case Created Date</td>
                    <td className={valueClass}>18-09-2025</td>
                    <td className={labelClass}>TAT (in Days)</td>
                    <td className={valueClass}>21</td>
                </tr>
                {/* Add other rows here... */}
                <tr>
                    <td className={labelClass}>Color Code</td>
                    <td className={`${valueClass} font-bold text-emerald-600`}>Green</td>
                    <td className={labelClass}>Due Date</td>
                    <td className={valueClass}>07-10-2025</td>
                </tr>
                </tbody>
            </table>

            {/* Status Legend (The circles at the bottom) */}
            <div className="mt-10 flex justify-between border border-slate-800 p-4">
                <StatusItem color="bg-emerald-500" label="GREEN (Positive)" />
                <StatusItem color="bg-amber-400" label="AMBER (Minor)" />
                <StatusItem color="bg-red-500" label="RED (Discrepancy)" />
                <StatusItem color="bg-orange-500" label="ORANGE (Insufficiency)" />
            </div>
        </div>
    );
};

const StatusItem = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${color}`}></div>
        <span className="text-[9px] font-bold text-slate-600">{label}</span>
    </div>
);

export default ExecutiveSummary;