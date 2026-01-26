import {AlertCircle} from "lucide-react";
import React from "react";

const ShowError = ({error}) => {
    return (
        <>
            {error && (
                <div className="p-4 mb-6 mx-auto bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Action Failed</p>
                        <p className="text-sm font-bold text-rose-700">{error}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default ShowError;