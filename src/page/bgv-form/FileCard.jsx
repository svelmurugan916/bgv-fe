import React, {useRef} from "react";
import {Paperclip, Upload} from "lucide-react";

const FileCard = ({ title, file, onFileSelect, onRemove, formatSize }) => {
    const fileInputRef = useRef(null);

    const handleFileRemove = () => {
        fileInputRef.current.value = '';
        onRemove();
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 lg:p-5 border border-slate-200 rounded-xl bg-white transition-all gap-4">
            <div className="flex items-center gap-4 w-full">
                {/* Icon Background */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#F8F9FA] text-slate-500 shrink-0">
                    {file ? <Paperclip size={22} /> : <Upload size={22} />}
                </div>

                <div className="flex-1 min-w-0">
                    {file ? (
                        <>
                            <h3 className="text-sm lg:text-[15px] font-bold text-slate-800 truncate">{file.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{formatSize(file.size)}</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-sm lg:text-[15px] font-bold text-slate-800">{title}</h3>
                            <p className="text-[10px] lg:text-xs text-slate-400 mt-0.5">Supported: JPEG, PDF, PNG (max 2mb)</p>
                        </>
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => onFileSelect(e.target.files[0])}
            />

            {file ? (
                <button
                    onClick={handleFileRemove}
                    className="w-full md:w-auto px-6 py-2 border border-red-100 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                    Remove
                </button>
            ) : (
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full md:w-auto px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all whitespace-nowrap"
                >
                    Choose File
                </button>
            )}
        </div>
    );
};

export default FileCard;