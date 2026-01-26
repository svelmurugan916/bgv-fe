import React, { useState } from 'react';
import { ShieldCheck, MoreHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

const CriminalDatabaseCheck = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Section Header */}
            <div className="p-8 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-slate-800">Criminal Database</h2>
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">2</span>
                </div>
                <p className="text-sm text-slate-400 font-medium">Select records and charges to be included in the report.</p>
                <div className="mt-6 flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">3 Records</span>
                </div>
            </div>

            {/* Court Section: Oregon Courts */}
            <div className="p-8">
                <h3 className="text-sm font-bold text-slate-800 mb-6">Oregon Courts</h3>
                <CourtTable
                    records={[
                        { id: 'CR165020', name: 'Terence Norman', type: 'Felony', status: 'Active', date: '02/26/2013', charges: '2/3' }
                    ]}
                />
            </div>

            {/* Court Section: Butte County */}
            <div className="p-8 bg-slate-50/30 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-6">Butte County Superior Court</h3>
                <CourtTable
                    records={[
                        { id: 'CM44012', name: 'Terence Norman', type: 'Felony', status: 'Active', date: '02/26/2013', charges: '2/3' },
                        { id: 'DF245602', name: 'Terence Norman', type: 'Felony', status: 'Active', date: '02/26/2013', charges: '1/3' }
                    ]}
                />
                <div className="mt-6 text-center">
                    <button className="text-[11px] font-bold text-[#5D4591] uppercase tracking-widest hover:underline">Show more</button>
                </div>
            </div>
        </div>
    );
};

const CourtTable = ({ records }) => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Number</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filling date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Charges</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
            {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F9F7FF]/30 transition-colors cursor-pointer group">
                    <td className="px-6 py-5 text-xs font-bold text-slate-900 group-hover:text-[#5D4591]">{rec.id}</td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-900">{rec.name}</td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-900">{rec.type}</td>
                    <td className="px-6 py-5">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {rec.status}
                            </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-900">{rec.date}</td>
                    <td className="px-6 py-5">
                            <span className="px-3 py-1 border border-slate-200 rounded-full text-[10px] font-bold text-slate-900">
                                {rec.charges}
                            </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

export default CriminalDatabaseCheck;
