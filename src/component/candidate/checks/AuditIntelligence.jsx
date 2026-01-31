import {
    Cpu,
    AlertCircle,
    Clock,
    CheckCircle2,
    Terminal,
    Shield,
    MessageSquareQuoteIcon,
    UserCheckIcon,
    PaperclipIcon
} from 'lucide-react';
import ContentDisplay from "../../common/ContentDisplay.jsx";

const AuditIntelligence = ({ data, formatFullDateTime }) => {
    const hasInsufficiency = !!data.insufficiencyRaisedAt;
    const isInsufficiencyCleared = !!data.insufficiencyClearedAt;

    // Logic to check if a line should be drawn below the current section
    const showLineAfterSystem = !!(data.verifierNotes || hasInsufficiency);
    const showLineAfterVerifier = !!hasInsufficiency;

    const getStatusDetails = () => {
        if (hasInsufficiency && !isInsufficiencyCleared) return { label: 'Insufficiency Raised', color: 'bg-rose-100 text-rose-700 border-rose-200' };
        if (isInsufficiencyCleared) return { label: 'Insufficiency Cleared', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
        return { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    };

    const status = getStatusDetails();

    return (
        (data.verificationRemark || data.verifierNotes || hasInsufficiency) &&
            <div className="relative mt-10">
                {/* 1. VERTICAL CONTINUITY: Centered Bridge (32px padding + 24px half-icon = 56px center. 55px for 2px line) */}
                <div className="absolute -top-10 left-[55px] h-10 w-[2px] border-l-2 border-dashed border-slate-200 pointer-events-none"></div>

                <div className="overflow-hidden bg-white border border-slate-200 rounded-[32px] shadow-sm">
                    {/* 2. HEADER */}
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#5D4591] rounded-lg shadow-inner">
                                <Shield size={16} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Verification Intelligence</h4>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Audit Trail & System Logic</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] font-black text-slate-600 uppercase">Live Audit</span>
                        </div>
                    </div>

                    <div className="p-8 space-y-0">
                        {/* 1. SYSTEM VALIDATION SEGMENT */}
                        {data.verificationRemark && (
                            <div className="relative flex gap-6 pb-10">
                                {/* Icon Column with Segmented Line */}
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border-4 border-white shadow-lg">
                                        <Cpu size={20} className="text-blue-400" />
                                    </div>
                                    {showLineAfterSystem && <div className="w-[2px] grow bg-slate-100 -mb-10"></div>}
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">System Engine</span>
                                        <span className="text-[10px] text-slate-300">•</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Automated Check</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-inner">
                                        <div className="flex gap-3 items-center">
                                            <Terminal size={12} className="text-slate-500" />
                                            <p className="text-xs font-mono text-slate-300 leading-relaxed">
                                                {data.verificationRemark}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. HUMAN OBSERVATION SEGMENT */}
                        {data.verifierNotes && (
                            <div className="relative flex gap-6 pb-10">
                                {/* Icon Column with Segmented Line */}
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5D4591] border-4 border-white shadow-lg">
                                        <UserCheckIcon size={20} className="text-white" />
                                    </div>
                                    {showLineAfterVerifier && <div className="w-[2px] grow bg-slate-100 -mb-10"></div>}
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-[#5D4591] uppercase tracking-widest">Verifier Remarks</span>
                                            <button
                                                onClick={() => document.getElementById('evidence-vault')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded text-[8px] font-black text-emerald-600 uppercase transition-all cursor-pointer"
                                            >
                                                <PaperclipIcon size={8} /> {data.verificationProofDocuments?.length || 0} Proofs Attached
                                            </button>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Manual Review</span>
                                    </div>
                                    <div className="relative">
                                        <ContentDisplay htmlContent={data.verifierNotes} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. INSUFFICIENCY ALIGNMENT */}
                        {hasInsufficiency && (
                            <div className="relative flex gap-6">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white shadow-lg ${!isInsufficiencyCleared ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                                        {isInsufficiencyCleared ? <CheckCircle2 size={20} className="text-white" /> : <AlertCircle size={20} className="text-white" />}
                                    </div>
                                    {/* No line drawn after the last icon */}
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${!isInsufficiencyCleared ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                Insufficiency Status
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                                                Raised: {formatFullDateTime(data.insufficiencyRaisedAt)}
                                            </span>
                                        </div>
                                        {!isInsufficiencyCleared && (
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[9px] font-black uppercase animate-pulse">
                                                <Clock size={10} /> Action Required
                                            </span>
                                        )}
                                    </div>

                                    <div className={`p-5 rounded-2xl border-2 border-dashed transition-colors duration-300 ${!isInsufficiencyCleared ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
                                        <p className="text-xs font-bold text-slate-800 mb-2">
                                            Reason: <span className="font-medium text-slate-600">{data.insufficiencyReason}</span>
                                        </p>
                                        {isInsufficiencyCleared && (
                                            <div className="text-[10px] font-black text-emerald-700 uppercase flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Resolved on {formatFullDateTime(data.insufficiencyClearedAt)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default AuditIntelligence;
