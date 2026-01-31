import {
    FileIcon, ImageIcon, FileTextIcon, Eye, Download,
    Paperclip, User, Trash2, Loader2, AlertCircle
} from 'lucide-react';
import React, { useState } from "react";
import { formatFullDateTime } from "../../../utils/date-util.js";
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { REMOVE_INTERNAL_PROOF } from "../../../constant/Endpoint.tsx"; // Assuming this endpoint exists
import { METHOD } from "../../../constant/ApplicationConstant.js";

const EvidenceVault = ({ evidences, taskId, onRemoveSuccess }) => {
    const { authenticatedRequest } = useAuthApi();
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState({ id: null, message: '' });

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    const handleRemoveFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to permanently delete this evidence?")) return;

        setDeletingId(fileId);
        setError({ id: null, message: '' });

        try {
            // API Call to remove file
            // Note: Adjust the endpoint replacement logic based on your actual API structure
            const response = await authenticatedRequest(
                null,
                REMOVE_INTERNAL_PROOF.replace("{taskId}", taskId).replace("{fileId}", fileId),
                METHOD.DELETE
            );

            if (response.status === 200) {
                // Call parent function to update the list in the UI
                onRemoveSuccess(fileId);
            } else {
                throw new Error(response.message || "Failed to delete file");
            }
        } catch (err) {
            setError({
                id: fileId,
                message: err.message || "Could not remove file. Please try again."
            });
            // Clear error after 5 seconds
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
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl relative flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
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

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {evidences.map((file, index) => {
                        const isThisDeleting = deletingId === file.fileId;
                        const hasError = error.id === file.fileId;

                        return (
                            <div key={file.fileId || index} className={`group relative bg-slate-50 border rounded-2xl p-4 transition-all duration-300 flex flex-col
                                ${hasError ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 hover:bg-white hover:border-[#5D4591]/30 hover:shadow-md'}`}>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#5D4591]/20 transition-colors">
                                        {file.proofFileType?.includes("image") ? <ImageIcon className="text-blue-500" size={20} /> :
                                            file.proofFileType?.includes('pdf') ? <FileTextIcon className="text-rose-500" size={20} /> :
                                                <FileIcon className="text-slate-400" size={20} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="mb-1.5 flex justify-between items-start">
                                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded tracking-wider group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591] transition-colors">
                                                {file.proofType || 'General Evidence'}
                                            </span>

                                            {/* DELETE BUTTON */}
                                            <button
                                                onClick={() => handleRemoveFile(file.fileId)}
                                                disabled={isThisDeleting}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                {isThisDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 truncate mb-0.5">{file.proofFileName}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                                            {formatFileSize(file.fileSize || 0)} • {formatFullDateTime(file.proofUploadedAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Inline Error Message */}
                                {hasError && (
                                    <div className="mb-3 p-2 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-1">
                                        <AlertCircle size={10} className="text-rose-500" />
                                        <p className="text-[8px] font-bold text-rose-600 uppercase tracking-tighter">{error.message}</p>
                                    </div>
                                )}

                                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                                            <User size={10} className="text-slate-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">Uploaded By</span>
                                            <span className="text-[9px] font-black text-slate-600 truncate max-w-[100px]">{file.proofUploadedBy || 'System'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#5D4591] hover:border-[#5D4591] hover:shadow-sm transition-all cursor-pointer" title="Download">
                                            <Download size={14} />
                                        </button>
                                        <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-600 hover:bg-[#5D4591] hover:text-white hover:border-[#5D4591] hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5">
                                            <Eye size={12} /> Preview
                                        </button>
                                    </div>
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
