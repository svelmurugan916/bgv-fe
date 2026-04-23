// components/bgv/sections/DocumentsReviewed.jsx
import { FileText, ExternalLink, CheckSquare, AlertTriangle } from "lucide-react";
import { GlassCard } from "./HelperComponent.jsx";

const DocumentRow = ({ doc }) => (
    <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-300"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                <FileText size={18} className="text-indigo-500" />
            </div>
            <div>
                <p className="text-xs font-black text-slate-700 group-hover:text-indigo-700 transition-colors">
                    {doc.label}
                </p>
                {doc.note && (
                    <p className="text-[9px] font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                        <AlertTriangle size={9} /> {doc.note}
                    </p>
                )}
                <p className="text-[9px] font-medium text-indigo-400 mt-0.5 truncate max-w-[220px]">
                    {doc.url}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">
        <CheckSquare size={9} strokeWidth={2.5} /> {doc.status}
      </span>
            <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </div>
    </a>
);

export const DocumentsReviewed = ({ documents }) => (
    <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documents Reviewed</p>
                <p className="text-xs font-bold text-slate-600 mt-0.5">
                    All source documents captured, OCR-verified, and stored securely.
                    Links are token-secured and expire in 72 hours.
                </p>
            </div>
            <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-black rounded-full">
        {documents.length} / {documents.length} Verified
      </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc, i) => (
                <DocumentRow key={i} doc={doc} />
            ))}
        </div>
    </GlassCard>
);
