import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import React, {useRef, useState} from "react";
import {UPLOAD_INTERNAL_PROOF} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import {Check, CloudUpload, File, Loader2, Trash2, Upload, X, AlertCircle} from "lucide-react";

const FileUploadModal = ({ isOpen, onClose, onUploadComplete, taskId, onSuccessFileUpload }) => {
    const { authenticatedRequest } = useAuthApi();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState({}); // { index: { progress: 0, status: 'idle', message: '' } }
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const units = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = null; // Reset to allow re-selection
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setUploadingFiles(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
        });
    };

    const uploadFilesOneByOne = async () => {
        // Initialize state for all files
        const initialState = {};
        selectedFiles.forEach((_, i) => {
            initialState[i] = { progress: 0, status: 'waiting', message: '' };
        });
        setUploadingFiles(initialState);

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            // 1. Check for File Size Limit
            if (file.size > MAX_FILE_SIZE) {
                setUploadingFiles(prev => ({
                    ...prev,
                    [i]: { status: 'error', progress: 0, message: 'File size exceeds 5MB limit' }
                }));
                continue; // Skip to next file
            }

            // 2. Mark as uploading
            setUploadingFiles(prev => ({
                ...prev,
                [i]: { ...prev[i], status: 'uploading', progress: 10 }
            }));

            try {
                const formData = new FormData();
                formData.append('file', file);

                const progressInterval = setInterval(() => {
                    setUploadingFiles(prev => {
                        const currentProgress = prev[i]?.progress || 0;
                        if (currentProgress >= 90) {
                            clearInterval(progressInterval);
                            return prev;
                        }
                        return { ...prev, [i]: { ...prev[i], progress: currentProgress + 10 } };
                    });
                }, 200);

                const response = await authenticatedRequest(
                    formData,
                    UPLOAD_INTERNAL_PROOF?.replace("{taskId}", taskId),
                    METHOD.POST
                );

                clearInterval(progressInterval);

                if (response.status === 200) {
                    setUploadingFiles(prev => ({
                        ...prev,
                        [i]: { progress: 100, status: 'success', message: '' }
                    }));
                    if(onSuccessFileUpload) onSuccessFileUpload(response.data);
                } else {
                    throw new Error(response.message || "Upload failed");
                }
            } catch (error) {
                setUploadingFiles(prev => ({
                    ...prev,
                    [i]: {
                        progress: 0,
                        status: 'error',
                        message: error.message || "Something went wrong"
                    }
                }));
            }
        }

        // Auto-close only if ALL files were successful
        const finalStates = Object.values(uploadingFiles);
        const allSuccessful = finalStates.length > 0 && finalStates.every(f => f.status === 'success');

        if (allSuccessful) {
            setTimeout(() => {
                onUploadComplete();
                onClose();
            }, 1500);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Internal Proof</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Upload supporting documents</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {selectedFiles.length === 0 ? (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center group hover:border-[#5D4591]/30 hover:bg-[#F9F7FF] transition-all cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-[#F9F7FF] text-[#5D4591] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CloudUpload size={32} />
                            </div>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Click to browse or drag files</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">PDF, JPG, DOC, XLSX, PNG (Max 5MB each)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedFiles.map((file, idx) => {
                                const state = uploadingFiles[idx];
                                return (
                                    <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${state?.status === 'error' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${state?.status === 'error' ? 'bg-white text-rose-500' : 'bg-white text-[#5D4591]'}`}>
                                            <File size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                                                <span className="text-[10px] font-black text-slate-400">{formatFileSize(file.size)}</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${
                                                        state?.status === 'error' ? 'bg-rose-500' :
                                                            state?.status === 'success' ? 'bg-emerald-500' : 'bg-[#5D4591]'
                                                    }`}
                                                    style={{ width: `${state?.progress || 0}%` }}
                                                />
                                            </div>

                                            {/* Error Message */}
                                            {state?.status === 'error' && (
                                                <div className="flex items-center gap-1 mt-1.5 text-rose-600 animate-in fade-in slide-in-from-top-1">
                                                    <AlertCircle size={10} />
                                                    <p className="text-[9px] font-black uppercase tracking-tight">{state.message}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            {state?.status === 'success' ? (
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            ) : state?.status === 'uploading' ? (
                                                <Loader2 size={16} className="text-[#5D4591] animate-spin" />
                                            ) : (
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={selectedFiles.length === 0 || Object.values(uploadingFiles).some(f => f.status === 'uploading')}
                        onClick={uploadFilesOneByOne}
                        className="bg-[#5D4591] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {Object.values(uploadingFiles).some(f => f.status === 'uploading') ? (
                            <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                        ) : (
                            <><Upload size={14} /> Start Upload</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
