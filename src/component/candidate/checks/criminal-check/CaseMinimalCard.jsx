import {
    Gavel,
    ChevronRight
} from 'lucide-react';

const CaseMinimalCard = ({ caseData, onClick }) => (
    <div
        onClick={onClick}
        className="group bg-white p-5 border border-slate-100 rounded-3xl flex items-center justify-between cursor-pointer hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
    >
        <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                caseData.caseType === 'Criminal'
                    ? 'bg-rose-50 text-rose-500'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
            }`}>
                <Gavel size={20} />
            </div>
            <div>
                <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase">{caseData.caseNo}</h4>
                    {/* Case Status Badge */}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        caseData.caseStatus === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {caseData.caseStatus}
                    </span>
                    {/* Case Year Badge */}
                    {caseData.caseYear && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-50 text-blue-500">
                            {caseData.caseYear}
                        </span>
                    )}
                </div>
                {/* Case Name */}
                {caseData.caseName && (
                    <p className="text-[10px] font-bold text-slate-600 mt-0.5 truncate max-w-[400px]">
                        {caseData.caseName}
                    </p>
                )}
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate max-w-[400px]">
                    {caseData.courtName} • {caseData.state}
                    {caseData.caseTypeName && ` • ${caseData.caseTypeName}`}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-slate-300 uppercase">Match Score</p>
                <p className="text-xs font-black text-slate-600">{(caseData.fuzzyNameScore * 100).toFixed(0)}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <ChevronRight size={18} />
            </div>
        </div>
    </div>
);

export default CaseMinimalCard;