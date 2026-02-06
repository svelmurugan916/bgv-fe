import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import React, { useRef, useState, useEffect } from "react";
import { UPLOAD_INTERNAL_PROOF } from "../../../constant/Endpoint.tsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
import {
    Check, CloudUpload, File, Loader2, Trash2,
    Upload, X, AlertCircle, Plus, ImageIcon, FileTextIcon
} from "lucide-react";

const FileUploadModal = ({ isOpen, onClose, onUploadComplete, taskId, onSuccessFileUpload }) => {
    const { authenticatedRequest } = useAuthApi();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState({});
    const [previews, setPreviews] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const newPreviews = {};
        selectedFiles.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                newPreviews[index] = URL.createObjectURL(file);
            }
        });
        setPreviews(newPreviews);

        return () => {
            Object.values(newPreviews).forEach(url => URL.revokeObjectURL(url));
        };
    }, [selectedFiles]);

    if (!isOpen) return null;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const units = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = null;
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
        const initialState = {};
        selectedFiles.forEach((_, i) => {
            initialState[i] = { progress: 0, status: 'waiting', message: '' };
        });
        setUploadingFiles(initialState);

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            if (file.size > MAX_FILE_SIZE) {
                setUploadingFiles(prev => ({
                    ...prev,
                    [i]: { status: 'error', progress: 0, message: 'Exceeds 5MB' }
                }));
                continue;
            }

            // Start Uploading state
            setUploadingFiles(prev => ({
                ...prev,
                [i]: { ...prev[i], status: 'uploading', progress: 5 }
            }));

            // Realistic Progress Simulation
            let progress = 5;
            const interval = setInterval(() => {
                if (progress < 90) {
                    // Slow down as it gets higher
                    const increment = Math.max(1, Math.floor((90 - progress) / 10));
                    progress += increment;
                    setUploadingFiles(prev => ({
                        ...prev,
                        [i]: { ...prev[i], progress: progress }
                    }));
                }
            }, 300);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await authenticatedRequest(
                    formData,
                    UPLOAD_INTERNAL_PROOF?.replace("{taskId}", taskId),
                    METHOD.POST
                );

                clearInterval(interval);

                if (response.status === 200) {
                    setUploadingFiles(prev => ({
                        ...prev,
                        [i]: { progress: 100, status: 'success', message: '' }
                    }));
                    if (onSuccessFileUpload) onSuccessFileUpload(response.data);
                } else {
                    throw new Error(response.message || "Upload failed");
                }
            } catch (error) {
                clearInterval(interval);
                setUploadingFiles(prev => ({
                    ...prev,
                    [i]: { progress: 0, status: 'error', message: error.message || "Failed" }
                }));
            }
        }

        const allSuccessful = selectedFiles.length > 0 &&
            Object.values(uploadingFiles).every(f => f.status === 'success');

        if (allSuccessful) {
            setTimeout(() => {
                onUploadComplete();
                onClose();
                setUploadingFiles({});
                setSelectedFiles([]);
            }, 1000);
        }
    };

    const handleCloseButton = () => {
        onClose();
        setSelectedFiles([]);
        setUploadingFiles({});
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Internal Proof Vault</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Select and upload supporting evidence</p>
                    </div>
                    <button onClick={handleCloseButton} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {selectedFiles.length === 0 ? (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-slate-200 rounded-[3rem] py-24 flex flex-col items-center justify-center group hover:border-[#5D4591]/30 hover:bg-[#F9F7FF] transition-all cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-white text-[#5D4591] rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                <CloudUpload size={40} />
                            </div>
                            <p className="text-sm font-black text-slate-700 uppercase tracking-widest">Drop files here</p>
                            <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">PDF, Images, or Documents up to 5MB</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {selectedFiles.map((file, idx) => {
                                const state = uploadingFiles[idx];
                                const isImage = file.type.startsWith('image/');

                                return (
                                    <div key={idx} className="group relative aspect-square rounded-[2rem] border border-slate-100 bg-slate-50 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all">

                                        {/* Preview / Icon Area */}
                                        <div className="flex-1 flex items-center justify-center overflow-hidden bg-slate-100/50">
                                            {isImage && previews[idx] ? (
                                                <img src={previews[idx]} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    {file.type.includes('pdf') ? <FileTextIcon size={32} className="text-rose-400" /> : <File size={32} className="text-slate-400" />}
                                                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{file.name.split('.').pop()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadata Overlay (Bottom) */}
                                        <div className="p-3 bg-white border-t border-slate-50">
                                            <p className="text-[10px] font-bold text-slate-700 truncate mb-0.5">{file.name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{formatFileSize(file.size)}</p>
                                        </div>

                                        {/* Status Overlays */}
                                        {state?.status === 'uploading' && (
                                            <div className="absolute inset-0 rounded-[2rem] bg-[#5D4591]/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
                                                <div className="relative w-16 h-16 flex items-center justify-center mb-3">
                                                    <Loader2 size={48} className="animate-spin text-white/20" />
                                                    <span className="absolute text-[12px] font-black">{state.progress}%</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest mb-3">Uploading</span>
                                                {/* Mini Progress Bar */}
                                                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-white transition-all duration-300"
                                                        style={{ width: `${state.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {state?.status === 'success' && (
                                            <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/95 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                                                <div className="w-12 h-12 bg-white text-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                                                    <Check size={24} strokeWidth={4} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Complete</span>
                                            </div>
                                        )}

                                        {state?.status === 'error' && (
                                            <div className="absolute inset-0 bg-rose-500/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
                                                <AlertCircle size={24} className="mb-2" />
                                                <span className="text-[9px] font-black uppercase leading-tight">{state.message}</span>
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        {(!state || state.status === 'error') && (
                                            <button
                                                onClick={() => removeFile(idx)}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 text-slate-400 hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}

                            {/* "ADD MORE" Placeholder */}
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-[#5D4591]/30 hover:bg-[#F9F7FF] transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 group-hover:bg-[#5D4591] group-hover:text-white flex items-center justify-center transition-all">
                                    <Plus size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#5D4591]">Add More</span>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                />

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-6 shrink-0">
                    {selectedFiles.length > 0 && (
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-auto">
                            {selectedFiles.length} Files Selected
                        </p>
                    )}
                    <button
                        onClick={handleCloseButton}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={selectedFiles.length === 0 || Object.values(uploadingFiles).some(f => f.status === 'uploading')}
                        onClick={uploadFilesOneByOne}
                        className="bg-[#5D4591] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#5D4591]/20 hover:bg-[#4a3675] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 cursor-pointer"
                    >
                        {Object.values(uploadingFiles).some(f => f.status === 'uploading') ? (
                            <><Loader2 size={14} className="animate-spin" /> Processing...</>
                        ) : (
                            <><Upload size={14} /> Confirm Upload</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
