import React, { useRef, useState, useEffect } from "react";
import { Check, Loader2, RefreshCw, Trash2, Upload, FileText, Image as ImageIcon } from "lucide-react";

const DocCard = ({ title, file, fileUrl, processing, onFileSelect, onRemove, error = undefined }) => {
    const fileInputRef = useRef(null);
    const [localPreview, setLocalPreview] = useState(null);

    useEffect(() => {
        if (file instanceof File) {
            const objectUrl = URL.createObjectURL(file);
            setLocalPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setLocalPreview(null);
        }
    }, [file]);

    const activePreview = fileUrl || localPreview;
    const fileName = file instanceof File ? file.name : (typeof file === 'string' ? file : null);

    const [loadingStep, setLoadingStep] = useState(0);
    const loadingMessages = ["Uploading...", "Extracting...", "Verifying...", "Finalizing..."];

    useEffect(() => {
        let messageInterval;
        if (processing) {
            setLoadingStep(0);
            messageInterval = setInterval(() => {
                setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
            }, 2000);
        }
        return () => clearInterval(messageInterval);
    }, [processing]);

    const handleRemoveInternal = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        onRemove();
    };

    return (
        <div className={`relative flex flex-col md:flex-row items-center justify-between p-4 lg:p-5 border-2 rounded-[2rem] transition-all duration-300 group ${
            error ? 'bg-rose-50/30 border-rose-100' :
                activePreview ? 'bg-white border-emerald-100 shadow-sm' :
                    'bg-white border-slate-100 hover:border-[#5D4591]/20'
        }`}>

            {/* LEFT: Content & Info */}
            <div className="flex items-center gap-4 lg:gap-6 w-full md:w-auto">
                {/* Image Section */}
                <div className="relative shrink-0">
                    <div className={`w-28 h-18 lg:w-32 lg:h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center transition-all bg-slate-50 ${
                        activePreview ? 'border-white shadow-md' : 'border-dashed border-slate-200'
                    }`}>
                        {processing ? (
                            <Loader2 size={20} className="animate-spin text-[#5D4591]" />
                        ) : activePreview ? (
                            <img src={activePreview} alt={title} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={24} className="text-slate-300" />
                        )}
                    </div>

                    {/* Status Indicator Overlay on Image */}
                    {activePreview && !processing && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                            <Check size={12} strokeWidth={4} />
                        </div>
                    )}
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-800 text-sm lg:text-[15px] tracking-tight truncate">{title}</h4>
                        {/* Subtle Live Indicator */}
                        {activePreview && !processing && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100 shrink-0">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                        <FileText size={12} className={activePreview ? "text-[#5D4591]" : "text-slate-300"} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-[140px] lg:max-w-[220px]">
                            {processing ? loadingMessages[loadingStep] : (fileName || "Awaiting File...")}
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT: Action Toolbar */}
            <div className="flex items-center gap-2 lg:gap-3 mt-5 md:mt-0 w-full md:w-auto">

                {/* Temporary Processing State */}
                {processing && (
                    <div className="h-[46px] px-5 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-2xl flex items-center gap-2 animate-pulse w-full md:w-auto justify-center">
                        <Loader2 size={16} className="animate-spin text-[#5D4591]" />
                        <span className="text-[10px] font-black text-[#5D4591] uppercase tracking-widest">Processing</span>
                    </div>
                )}

                {/* Action Buttons (Only shown when not processing) */}
                {!processing && activePreview && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={handleRemoveInternal}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 h-[46px] px-4 rounded-2xl border border-rose-100 text-rose-500 hover:bg-rose-50 transition-all cursor-pointer active:scale-95 group/btn"
                        >
                            <Trash2 size={18} className="transition-transform group-hover/btn:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Remove</span>
                        </button>

                        <label className="flex-[2] md:flex-none">
                            <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelect} accept=".jpg,.jpeg,.png" />
                            <div className="h-[46px] px-6 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 active:scale-95 cursor-pointer">
                                <RefreshCw size={16} />
                                <span className="whitespace-nowrap">Change File</span>
                            </div>
                        </label>
                    </div>
                )}

                {/* Empty State Browse Button */}
                {!processing && !activePreview && (
                    <label className="w-full md:w-auto">
                        <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelect} accept=".jpg,.jpeg,.png" />
                        <div className="h-[46px] px-8 rounded-2xl bg-white border-2 border-slate-200 text-[#5D4591] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:border-[#5D4591] active:scale-95 cursor-pointer">
                            <Upload size={16} />
                            <span>Browse File</span>
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};

export default DocCard;
