import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import React, { useState } from "react";

const InputComponent = ({ label, value, onChange, onBlur, type = "text", placeholder, error, isMandatory=false, tooltip, isValid }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {label} {isMandatory && <span className={'text-red-500'}> *</span>}
                </label>
                {tooltip && (
                    <div
                        className="relative flex items-center"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <HelpCircle
                            size={12}
                            className={`transition-colors cursor-help ${showTooltip ? 'text-[#5D4591]/80' : 'text-slate-300'}`}
                        />
                        {showTooltip && (
                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg z-50 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                {tooltip}
                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full p-3.5 bg-white border rounded-xl transition-all text-slate-800 text-sm outline-none
                    ${error ? 'border-red-500 bg-red-50' : isValid ? 'border-green-500 bg-green-50/10' : 'border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10'}`}
                />

                {/* Real-time Success State */}
                {isValid && !error && (
                    <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in" />
                )}

                {error && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 animate-in slide-in-from-top-1">
                        <AlertCircle size={12} />
                        <span className="text-[10px] font-bold uppercase">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputComponent;
