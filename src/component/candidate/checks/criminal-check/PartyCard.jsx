import React, {useState} from "react";

const PartyCard = ({ title, rawPartyText, rawAddressText, structuredParties, type }) => {
    const [showRaw, setShowRaw] = useState(false);

    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                {/* Toggle: show raw text for audit */}
                {rawPartyText && (
                    <button
                        onClick={() => setShowRaw(v => !v)}
                        className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600"
                    >
                        {showRaw ? 'Show Structured' : 'Show Raw Text'}
                    </button>
                )}
            </div>

            {showRaw ? (
                /* ── Raw text view (full audit detail) ── */
                <div className="space-y-3">
                    {rawPartyText && (
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Raw Party Text</p>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{rawPartyText}</p>
                        </div>
                    )}
                    {rawAddressText && (
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Raw Address Text</p>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">{rawAddressText}</p>
                        </div>
                    )}
                </div>
            ) : (
                /* ── Structured GFC view ── */
                <div className="space-y-4">
                    {structuredParties?.length > 0 ? (
                        structuredParties.map((p, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                                    {type}{i + 1}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700">{p.name}</p>
                                    {p.address && (
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 leading-relaxed">{p.address}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs font-medium text-slate-400 italic">No structured party data available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PartyCard;