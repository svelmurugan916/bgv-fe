import {
    FileIcon, FileTextIcon, Download,
    Paperclip, Trash2, Loader2, AlertCircle, Check, X, User
} from 'lucide-react';
import React, { useState } from "react";
import { formatFullDateTime } from "../../../utils/date-util.js";
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { REMOVE_INTERNAL_PROOF, FILE_GET } from "../../../constant/Endpoint.tsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
import SecureImage from "../../secure-document-api/SecureImage.jsx";

const EvidenceVault = ({ evidences, taskId, onRemoveSuccess }) => {
    const { authenticatedRequest } = useAuthApi();
    const [deletingId, setDeletingId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [activeDeleteId, setActiveDeleteId] = useState(null);
    const [error, setError] = useState({ id: null, message: '' });

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
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


    const handleRemoveFile = async (fileId) => {
        setDeletingId(fileId);
        setActiveDeleteId(null);
        setError({ id: null, message: '' });
        try {
            const response = await authenticatedRequest(
                null,
                REMOVE_INTERNAL_PROOF.replace("{taskId}", taskId).replace("{fileId}", fileId),
                METHOD.DELETE
            );
            if (response.status === 200) {
                onRemoveSuccess(fileId);
            } else {
                throw new Error(response.message || "Failed to delete file");
            }
        } catch (err) {
            setError({ id: fileId, message: err.message || "Could not remove file." });
            setTimeout(() => setError({ id: null, message: '' }), 5000);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="relative">
            <div className="absolute -top-10 left-[55px] h-10 w-[2px] border-l-2 border-dashed border-slate-200 pointer-events-none"></div>

            <div className="mt-10 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm" id="evidence-vault">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                            <Paperclip size={18} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Evidence Vault</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Supporting Documents & Media</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full uppercase shadow-sm">
                        {evidences.length} Files Attached
                    </span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {evidences.map((file, index) => {
                        const isThisDeleting = deletingId === file.fileId;
                        const isThisDownloading = downloadingId === file.verificationProofUrl;
                        const isConfirming = activeDeleteId === file.fileId;
                        const hasError = error.id === file.fileId;

                        return (
                            <div key={file.fileId || index} className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#5D4591]/20 transition-all duration-300">

                                <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                                    <div className="transition-transform duration-500 group-hover:scale-110 w-full h-full flex items-center justify-center">
                                        {file.proofFileType?.includes("image") ? (
                                                <SecureImage fileUrl={file?.verificationProofUrl} />
                                            ) :
                                            file.proofFileType?.includes('pdf') ? <FileTextIcon className="text-rose-400/50" size={48} strokeWidth={1} /> :
                                                <FileIcon className="text-slate-300" size={48} strokeWidth={1} />}
                                    </div>

                                    <div className="absolute top-3 right-3 flex items-center justify-end">
                                        {isThisDeleting ? (
                                            <div className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                                                <Loader2 size={14} className="animate-spin text-[#5D4591]" />
                                            </div>
                                        ) : isConfirming ? (
                                            <div className="flex items-center gap-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-200">
                                                <span className="text-[10px] font-black uppercase text-red-500 tracking-tighter">Are you sure?</span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleRemoveFile(file.fileId)}
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
                                                onClick={() => setActiveDeleteId(file.fileId)}
                                                className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {hasError && (
                                        <div className="absolute inset-x-0 bottom-0 bg-rose-500 text-white p-2 flex items-center gap-2 animate-in slide-in-from-bottom-full">
                                            <AlertCircle size={12} />
                                            <p className="text-[8px] font-bold uppercase tracking-tighter">{error.message}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 relative bg-white">
                                    <div className="pr-10 space-y-1">
                                        {/* LINE 1: Filename */}
                                        <p className="text-[11px] font-bold text-slate-700 truncate" title={file.proofFileName}>
                                            {file.proofFileName}
                                        </p>

                                        {/* LINE 2: Date Only */}
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {formatFullDateTime(file.proofUploadedAt)}
                                        </p>

                                        {/* LINE 3: Uploaded By */}
                                        <div className="group/user relative w-fit">
                                            {/* The Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-800 text-white text-[8px] font-black uppercase tracking-tighter rounded opacity-0 group-hover/user:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                                Uploaded By
                                                {/* Small Arrow */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-[#5D4591] uppercase tracking-tighter truncate bg-[#5D4591]/5 px-1.5 py-0.5 rounded cursor-help transition-colors group-hover/user:bg-[#5D4591]/10">
                                                <User size={10} className="shrink-0" />
                                                <span className="truncate">{file.proofUploadedBy || 'System'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Download Action - Styled as a ghost button */}
                                    <button
                                        onClick={() => handleDownload(file.verificationProofUrl, file.proofFileName)}
                                        disabled={isThisDownloading}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-[#5D4591] hover:bg-slate-50 rounded-full transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isThisDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EvidenceVault;
