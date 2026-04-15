import React from 'react';
import { AlertCircle } from 'lucide-react';
import {useForm} from "../../provider/FormProvider.jsx";

const ValidatedInput = ({
                            label,
                            value,
                            onChange,
                            icon: Icon,
                            errorId,
                            type = "text",
                            isTextArea = false,
                            className = ""
                        }) => {
    const { errors, clearError } = useForm();
    const hasError = !!errors[errorId];

    const baseStyles = `w-full p-3.5 bg-white border rounded-xl text-sm font-medium transition-all outline-none shadow-sm`;
    const errorStyles = hasError
        ? 'border-red-500 ring-4 ring-red-50'
        : 'border-[#5D4591]/20 focus:border-[#5D4591]';

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${hasError ? 'text-red-500' : 'text-[#5D4591]'}`}>
                {Icon && <Icon size={14} />} {label}
            </label>

            {isTextArea ? (
                <textarea
                    id={errorId}
                    rows={3}
                    value={value || ''}
                    onChange={(e) => {
                        onChange(e.target.value);
                        if (hasError) clearError(errorId);
                    }}
                    className={`${baseStyles} ${errorStyles} resize-none`}
                />
            ) : (
                <input
                    id={errorId}
                    type={type}
                    value={value || ''}
                    onChange={(e) => {
                        onChange(e.target.value);
                        if (hasError) clearError(errorId);
                    }}
                    className={`${baseStyles} ${errorStyles}`}
                />
            )}

            {hasError && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 animate-in slide-in-from-top-1">
                    <AlertCircle size={12} /> {errors[errorId]}
                </p>
            )}
        </div>
    );
};

export default ValidatedInput;
