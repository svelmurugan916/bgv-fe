import React, { useRef } from "react";
import { Check, Loader2, RefreshCw, Trash2, Upload, AlertCircle, Image as ImageIcon } from "lucide-react";

const DocCard = ({ title, file, fileUrl, processing, onFileSelect, onRemove, error = undefined }) => {
    const fileInputRef = useRef(null);

    const handleRemoveInternal = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onRemove();
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-between p-4 lg:p-5 border-2 rounded-[2rem] transition-all hover:shadow-lg group ${
            error ? 'bg-rose-50/50 border-rose-200' :
                fileUrl ? 'bg-white border-emerald-100 hover:border-emerald-200' :
                    'bg-white border-slate-100 hover:border-[#5D4591]/30'
        }`}>

            <div className="flex items-center gap-6 w-full md:w-auto">
                {/* --- LANDSCAPE IMAGE PREVIEW SECTION --- */}
                <div className="relative shrink-0">
                    <div className={`w-32 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                        fileUrl ? 'border-white bg-slate-100' : 'border-dashed border-slate-200 bg-slate-50'
                    }`}>
                        {processing ? (
                            <div className="flex flex-col items-center gap-1">
                                <Loader2 size={18} className="animate-spin text-[#5D4591]" />
                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Uploading</span>
                            </div>
                        ) : fileUrl ? (
                            <img
                                src={fileUrl}
                                alt={title}
                                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500 hover:scale-110 transition-transform cursor-zoom-in"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-slate-300 group-hover:text-[#5D4591]/40 transition-colors">
                                <ImageIcon size={24} strokeWidth={1.5} />
                                <span className="text-[8px] font-black uppercase mt-1 tracking-widest">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Floating Success Badge */}
                    {fileUrl && !processing && !error && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in bounce-in duration-700">
                            <Check size={12} strokeWidth={4} />
                        </div>
                    )}
                </div>

                {/* --- TEXT CONTENT SECTION --- */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-800 text-sm lg:text-base tracking-tight">{title}</h4>
                        {fileUrl && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-md border border-emerald-100 flex items-center gap-1">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                Live Sync
                            </span>
                        )}
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {fileUrl ? "Document captured & processed" : "Formats: JPEG, PNG (Max 2MB)"}
                    </p>

                    {/* Error Display */}
                    {error && !processing && (
                        <div className="flex items-center gap-1.5 mt-2 p-1.5 px-2 bg-rose-100/50 rounded-lg w-fit animate-in slide-in-from-left-2">
                            <AlertCircle size={10} className="text-rose-600"/>
                            <p className="text-[9px] font-black text-rose-700 uppercase">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ACTIONS SECTION --- */}
            <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                {fileUrl && !processing && (
                    <button
                        onClick={handleRemoveInternal}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer group/btn"
                    >
                        <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase md:hidden lg:inline">Remove</span>
                    </button>
                )}

                <label className="flex-1 md:flex-none">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={onFileSelect}
                        accept=".jpg,.jpeg,.png"
                        disabled={processing}
                    />
                    <div className={`cursor-pointer px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border text-center flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                        fileUrl
                            ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                            : 'bg-white border-slate-200 text-[#5D4591] hover:border-[#5D4591] hover:bg-slate-50'
                    }`}>
                        {fileUrl ? (
                            <><RefreshCw size={14} className={processing ? 'animate-spin' : ''}/> Re-upload</>
                        ) : (
                            <><Upload size={14}/> Browse File</>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default DocCard;
