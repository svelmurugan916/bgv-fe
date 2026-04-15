import React, { useState } from 'react';
import {
    FileIcon, Download, Trash2, User,
    Upload, UploadCloud, FileText, Info, PaperclipIcon,
    Loader2, Check, X, AlertCircle
} from 'lucide-react';
import { formatFullDateTime } from "../../../../utils/date-util.js";
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import {FILE_GET, REMOVE_CANDIDATE_DOCUMENT} from "../../../../constant/Endpoint.tsx";
import { METHOD } from "../../../../constant/ApplicationConstant.js";

const UploadedDocumentsDisplay = ({ documents = [], setIsUploadModalOpen, onRemoveFile, taskId, type, isReadOnly=false }) => {
    const { authenticatedRequest } = useAuthApi();
    const [deletingId, setDeletingId] = useState(null);
    const [activeDeleteId, setActiveDeleteId] = useState(null);
    const [error, setError] = useState({ id: null, message: '' });
    const [downloadingId, setDownloadingId] = useState(null);

    const getFileType = (filename) => {
        const extension = filename?.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
        if (extension === 'pdf') return 'pdf';
        return 'document';
    };

    const handleDownload = async (fileUrl, fileName) => {
        if (!fileUrl) return;
        setDownloadingId(fileUrl);

        try {
            const downloadUrl = `${FILE_GET}/${fileUrl?.replace("/uploads/", "")}`;
            const response = await authenticatedRequest(null, downloadUrl, METHOD.GET, {
                responseType: 'blob'
            });

            const blob = response.data ? response.data : response;

            if (!(blob instanceof Blob)) {
                console.error("The response is not a blob.");
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setDownloadingId(null);
        }
    };

    // --- DELETE LOGIC FROM EVIDENCE VAULT ---
    const handleRemoveFile = async (fileId) => {
        if(isReadOnly) return;
        setDeletingId(fileId);
        setActiveDeleteId(null);
        setError({ id: null, message: '' });
        try {
            const response = await authenticatedRequest(
                null,
                REMOVE_CANDIDATE_DOCUMENT.replace("{taskId}", taskId).replace("{fileId}", fileId)?.replace("{type}", type),
                METHOD.DELETE
            );
            if (response.status === 200 || response.status === 204) {
                if (onRemoveFile) onRemoveFile(fileId);
            } else {
                throw new Error(response.message || "Failed to delete file");
            }
        } catch (err) {
            setError({ id: fileId, message: err.response?.data?.message || "Could not remove file." });
            setTimeout(() => setError({ id: null, message: '' }), 5000);
        } finally {
            setDeletingId(null);
        }
    };

    // --- PREMIUM EMPTY STATE COMPONENT ---
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-100 rounded-[3rem] bg-white/50 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                <UploadCloud size={48} className="text-slate-200" />
                <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <PaperclipIcon size={14} className="text-[#5D4591]" />
                </div>
            </div>
            <div className="text-center max-w-xs space-y-2">
                <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest">No Documents Found</h5>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    The candidate hasn't uploaded any supporting documents yet.
                </p>
            </div>

            {/* Empty State Upload Trigger with Tooltip */}
            <div className="relative group/disabled mt-8">
                <button
                    disabled={isReadOnly}
                    onClick={() => setIsUploadModalOpen(true)}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95
                        ${isReadOnly
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                        : 'bg-[#5D4591] text-white hover:bg-[#4a3675] shadow-[#5D4591]/20 cursor-pointer'
                    }`}
                >
                    <Upload size={16} /> Upload Now
                </button>
                {isReadOnly && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover/disabled:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 shadow-2xl border border-white/10">
                        Uploads disabled for completed tasks
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[3rem] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#5D4591] shadow-sm">
                        <FileText size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-[#241B3B] uppercase tracking-widest">Candidate Documents</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1.5">
                            <Info size={12} className="text-[#5D4591]" /> {documents.length} Files Total
                        </p>
                    </div>
                </div>

                {documents.length > 0 && (
                    <div className="relative group/disabled">
                        <button
                            disabled={isReadOnly}
                            onClick={() => !isReadOnly && setIsUploadModalOpen(true)}
                            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 border
                                ${isReadOnly
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-80'
                                : 'text-[#5D4591] bg-white border-[#5D4591]/10 hover:bg-[#F9F7FF] hover:border-[#5D4591]/30 cursor-pointer'
                            } rounded-2xl`}
                        >
                            <Upload size={16} /> Upload Document
                        </button>

                        {isReadOnly && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover/disabled:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 shadow-2xl border border-white/10">
                                Uploads disabled for completed tasks
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {documents.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {documents.map((doc, index) => {
                        const fileType = getFileType(doc.name);
                        const fileId = doc.fileId || `doc-${index}`;
                        const isThisDownloading = downloadingId === doc.relativeUrl;

                        const isThisDeleting = deletingId === fileId;
                        const isConfirming = activeDeleteId === fileId;
                        const hasError = error.id === fileId;

                        return (
                            <div
                                key={fileId}
                                className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#5D4591]/20 transition-all duration-500"
                            >
                                <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                                    <div className="transition-transform duration-700 group-hover:scale-110 w-full h-full flex items-center justify-center">
                                        {fileType === 'image' ? (
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                                <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                                            </a>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileIcon className={fileType === 'pdf' ? "text-rose-400" : "text-slate-300"} size={48} strokeWidth={1} />
                                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{fileType}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- DELETE ACTIONS (Confirmation & Loader) --- */}
                                    {
                                        !isReadOnly && (
                                            <div className="absolute top-4 right-4 flex items-center justify-end">
                                                {isThisDeleting ? (
                                                    <div className="w-9 h-9 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm">
                                                        <Loader2 size={16} className="animate-spin text-[#5D4591]" />
                                                    </div>
                                                ) : isConfirming ? (
                                                    <div className="flex items-center gap-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-200">
                                                        <span className="text-[9px] font-black uppercase text-red-500 tracking-tighter">Are you sure?</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleRemoveFile(fileId)}
                                                                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveDeleteId(null)}
                                                                className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setActiveDeleteId(fileId)}
                                                        className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    }


                                    {hasError && (
                                        <div className="absolute inset-x-0 bottom-0 bg-rose-500 text-white p-2 flex items-center gap-2 animate-in slide-in-from-bottom-full">
                                            <AlertCircle size={12} />
                                            <p className="text-[8px] font-bold uppercase tracking-tighter">{error.message}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 relative bg-white">
                                    <div className="pr-10 space-y-1.5">
                                        <p className="text-[11px] font-black text-slate-700 truncate" title={doc.name}>{doc.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {doc.proofUploadedAt ? formatFullDateTime(doc.proofUploadedAt) : 'N/A'}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#5D4591] uppercase tracking-tighter bg-[#F9F7FF] px-2 py-1 rounded-lg w-fit">
                                            <User size={10} />
                                            <span>{doc.proofUploadedBy || 'System'}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDownload(doc.relativeUrl, doc.name)}
                                        disabled={isThisDownloading}
                                        className="absolute bottom-5 right-5 w-9 h-9 flex items-center justify-center text-slate-300 hover:text-[#5D4591] hover:bg-[#F9F7FF] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#5D4591]/10"
                                    >
                                        {isThisDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UploadedDocumentsDisplay;
