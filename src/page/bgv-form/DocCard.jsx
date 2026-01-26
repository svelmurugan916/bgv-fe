import React, {useRef} from "react";
import {Check, FileText, Loader2, RefreshCw, Trash2, Upload, AlertCircle} from "lucide-react";

const DocCard = ({ title, file, processing, onFileSelect, onRemove, error = undefined }) => {
    const fileInputRef = useRef(null);

    const handleRemoveInternal = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onRemove();
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-between p-5 lg:p-6 border-2 rounded-2xl transition-all hover:shadow-md group ${error ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200 hover:border-[#5D4591]/40'}`}>
            <div className="flex items-center gap-5 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${file ? 'bg-green-50 text-green-600' : error ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400 group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591]'}`}>
                    {processing ? <Loader2 size={24} className="animate-spin" /> : file ? <Check size={26} /> : <Upload size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm lg:text-base truncate">{title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Files Supported: JPEG, PDF and PNG (max size 2mb)</p>

                    {/* Error Display */}
                    {error && !processing && (
                        <p className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                            <AlertCircle size={12}/> {error}
                        </p>
                    )}

                    {file && !error && <p className="text-[10px] font-bold text-[#5D4591] mt-1 flex items-center gap-1 truncate"><FileText size={12}/> {file}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                {file && !processing && (
                    <button
                        onClick={handleRemoveInternal}
                        className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        title="Remove File"
                    >
                        <Trash2 size={18} />
                    </button>
                )}

                <label className="flex-1 md:flex-none">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={onFileSelect}
                        accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <div className={`cursor-pointer px-6 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${file ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-white border-slate-200 text-slate-900 hover:border-[#5D4591] hover:text-[#5D4591]'}`}>
                        {file ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14}/> Change File</span> : 'Choose File'}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default DocCard;
