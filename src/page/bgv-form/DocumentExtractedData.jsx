import React from "react";
import { Calendar, Fingerprint } from "lucide-react";

const ExtractedData = ({ idLabel, idValue, dobValue, onIdChange, onDobChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-2xl animate-in zoom-in-95 duration-300 shadow-sm shadow-[#5D4591]/5">

        {/* ID Number Field */}
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#5D4591] uppercase tracking-widest flex items-center gap-2">
                <Fingerprint size={14} />
                Extracted {idLabel}
            </label>
            <div className="relative group">
                <input
                    value={idValue}
                    onChange={(e) => onIdChange(e.target.value)}
                    placeholder={`Enter ${idLabel}`}
                    className="w-full p-3.5 bg-white border border-[#5D4591]/20 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all
                               group-hover:border-[#5D4591]/40 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10 placeholder:text-slate-300"
                />
            </div>
        </div>

        {/* Date of Birth Field */}
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#5D4591] uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} />
                Extracted Date of Birth
            </label>
            <div className="relative group">
                <input
                    type="date"
                    value={dobValue}
                    onChange={(e) => onDobChange(e.target.value)}
                    className="w-full p-3.5 bg-white border border-[#5D4591]/20 rounded-xl text-sm font-medium text-slate-700 outline-none transition-all
                               group-hover:border-[#5D4591]/40 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10
                               accent-[#5D4591] appearance-none"
                />
                {/* Custom styling for the date icon is limited by browsers,
                    but 'accent-color' themes the popup calendar to your primary purple */}
            </div>
        </div>

        <div className="md:col-span-2">
            <p className="text-[10px] text-slate-400 italic font-medium">
                * Please verify the extracted information and correct if necessary.
            </p>
        </div>
    </div>
);

export default ExtractedData;
