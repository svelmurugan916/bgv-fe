import {
    Cpu,
    AlertCircle,
    Clock,
    CheckCircle2,
    Terminal,
    Shield,
    UserCheckIcon,
    PaperclipIcon, TimerIcon
} from 'lucide-react';
import ContentDisplay from "../../../common/ContentDisplay.jsx";

const AuditIntelligence = ({ data, formatFullDateTime }) => {
    const hasInsufficiency = !!data.insufficiencyRaisedAt;
    const isInsufficiencyCleared = !!data.insufficiencyClearedAt;

    const getInsufficiencyDuration = () => {
        if (!data.insufficiencyRaisedAt) return null;

        const start = new Date(data.insufficiencyRaisedAt);
        const end = isInsufficiencyCleared ? new Date(data.insufficiencyClearedAt) : new Date();
        const diffInMs = end - start;

        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes} mins`;
    };

    const duration = getInsufficiencyDuration();


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
                                    <div className="flex items-center justify-between w-full mb-3">
                                        {/* Left Side: Identity with Logic Icon */}
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                                <Cpu size={12} className="text-blue-600" />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em]">
                                                System Engine
                                            </span>
                                        </div>

                                        {/* Right Side: Status Badge with Active Pulse */}
                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50/50 border border-blue-100/50 rounded-lg shadow-sm">
                                            <div className="relative flex w-1.5 h-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-blue-500"></span>
                                            </div>
                                            <span className="text-[9px] font-black text-blue-600/60 uppercase tracking-tight">
                                                Automated Check
                                            </span>
                                        </div>
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
                                    <div className="flex items-center justify-between w-full mb-3">
                                        {/* Left Side: Identity & Evidence Link */}
                                        <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-[#5D4591] uppercase tracking-[0.15em]">
                                            Verifier Remarks
                                        </span>

                                            {/* Evidence Vault Trigger - Only shows if documents exist */}
                                            {data.verificationProofDocuments?.length > 0 && (
                                                <button
                                                    onClick={() => document.getElementById('evidence-vault')?.scrollIntoView({ behavior: 'smooth' })}
                                                    className="group flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-100/50 rounded-lg transition-all cursor-pointer active:scale-95"
                                                >
                                                    <PaperclipIcon size={10} className="text-emerald-600 group-hover:rotate-12 transition-transform" />
                                                    <span className="text-[8px] font-black text-emerald-700 uppercase tracking-wider">
                                                        {data.verificationProofDocuments.length} Evidence Files
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Right Side: Process Badge */}
                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-lg shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#5D4591]" />
                                            <span className="text-[9px] font-black text-[#5D4591]/60 uppercase tracking-tight">
                                                Manual Review
                                            </span>
                                        </div>
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
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between w-full mb-3">
                                        {/* Left Side: Status Identity & Raised Timestamp */}
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg transition-colors ${!isInsufficiencyCleared ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                                                {!isInsufficiencyCleared ? <AlertCircle size={12} className="text-rose-600" /> : <CheckCircle2 size={12} className="text-emerald-600" />}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${!isInsufficiencyCleared ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    Insufficiency {!isInsufficiencyCleared ? 'Log' : 'Resolved'}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                                                    Raised: {formatFullDateTime(data.insufficiencyRaisedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Action Badge & Aging Duration */}
                                        <div className="flex items-center gap-3">
                                            {/* Aging / Duration Badge */}
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                                                <TimerIcon size={10} className="text-slate-400" />
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
                                                    {isInsufficiencyCleared ? 'Total Time:' : 'Aging:'} <span className="text-slate-700">{duration}</span>
                                                </span>
                                            </div>

                                            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border shadow-sm transition-all
                                                ${!isInsufficiencyCleared ? 'bg-rose-50/50 border-rose-100/50' : 'bg-emerald-50/50 border-emerald-100/50'}`}
                                            >
                                                {!isInsufficiencyCleared ? (
                                                    <>
                                                        <div className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-rose-600/80 uppercase tracking-tight">Action Required</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        <span className="text-[9px] font-black text-emerald-600/80 uppercase tracking-tight">Resolved</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-2xl border-2 border-dashed transition-colors duration-300 ${!isInsufficiencyCleared ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
                                        <p className="text-xs font-bold text-slate-800 mb-3">
                                            Reason: <span className="font-medium text-slate-600">{data.insufficiencyReason}</span>
                                        </p>

                                        {isInsufficiencyCleared && (
                                            <div className="flex items-center justify-between pt-3 border-t border-emerald-100/50">
                                                <div className="text-[10px] font-black text-emerald-700 uppercase flex items-center gap-1.5">
                                                    <CheckCircle2 size={12} /> Resolved on {formatFullDateTime(data.insufficiencyClearedAt)}
                                                </div>
                                                <div className="text-[9px] font-bold text-emerald-600/60 uppercase italic">
                                                    Turnaround Time: {duration}
                                                </div>
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
