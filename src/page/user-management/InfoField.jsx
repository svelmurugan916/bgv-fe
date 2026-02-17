import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InfoField = ({ label, value, icon, copyable, isEditing, onChange, name, type = "text" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-2 group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <div className={`flex items-center justify-between border p-3 rounded-2xl transition-all 
                ${isEditing ? 'bg-white border-[#5D4591] ring-4 ring-[#5D4591]/5' : 'bg-white border-slate-100 group-hover:border-[#5D4591]/30'}`}>

                <div className="flex items-center gap-3 w-full">
                    <div className={`transition-colors ${isEditing ? 'text-[#5D4591]' : 'text-slate-300 group-hover:text-[#5D4591]'}`}>
                        {icon}
                    </div>

                    {isEditing ? (
                        <input
                            type={type}
                            value={value || ''}
                            onChange={(e) => onChange(name, e.target.value)}
                            className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                            placeholder={`Enter ${label.toLowerCase()}...`}
                        />
                    ) : (
                        <span className="text-sm font-bold text-slate-700">{value || 'Not provided'}</span>
                    )}
                </div>

                {!isEditing && copyable && value && (
                    <button onClick={handleCopy} className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-50 transition-colors">
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                    <Check size={16} className="text-emerald-500" />
                                </motion.div>
                            ) : (
                                <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="text-slate-300 hover:text-[#5D4591]">
                                    <Copy size={14} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                )}
            </div>
        </div>
    );
};

export default InfoField;
