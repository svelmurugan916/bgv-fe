import React, { useState } from 'react';
import {
    User, MapPin, Calendar, Building2,
    Gavel, Loader2, ShieldAlert, CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../../../constant/ApplicationConstant.js";
import {TRIGGER_CRIMINAL_API} from "../../../../constant/Endpoint.tsx";


const CriminalCheckTrigger = ({ data, taskId, onTriggerSuccess }) => {
    const { authenticatedRequest } = useAuthApi();

    const [formData, setFormData] = useState({
        address: data.addressChecked || '',
        year:    data.yearChecked    || '',
        state:   data.stateChecked   || '',
        taskId: taskId,
    });

    const [loading,         setLoading]         = useState(false);
    const [error,           setError]           = useState(null);
    const [success,         setSuccess]         = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleTrigger = async () => {
        if (!formData.address.trim()) {
            setValidationError('Address is required.');
            return;
        }
        setValidationError('');
        setLoading(true);
        setError(null);

        try {
            const response = await authenticatedRequest(
                formData,
                `${TRIGGER_CRIMINAL_API}`,
                METHOD.POST
            );
            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setTimeout(() => onTriggerSuccess(), 2000);
            } else {
                throw new Error(response.data?.message || "Failed to initiate check.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-6 animate-in fade-in duration-500">

            {/* ── Page Title ────────────────────────────────── */}
            <div className="mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">
                    Criminal Record Check
                </p>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    Initiate Court Search
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1.5">
                    Queries 15,000+ courts across India using fuzzy name matching.
                </p>
            </div>

            {/* ── Form ──────────────────────────────────────── */}
            <div className="space-y-5">

                {/* Candidate Name — Read Only */}
                <FieldGroup label="Candidate Name">
                    <ReadOnlyInput
                        value={data.nameChecked}
                        icon={<User size={15} />}
                    />
                </FieldGroup>

                {/* Father's Name — Read Only */}
                <FieldGroup label="Father's Name">
                    <ReadOnlyInput
                        value={data.fatherNameChecked}
                        icon={<User size={15} />}
                    />
                </FieldGroup>

                {/* Divider */}
                <div className="pt-4 pb-2">
                    <div className="h-px bg-slate-100" />
                </div>

                {/* Address — Required */}
                <FieldGroup
                    label="Address"
                    required
                    error={validationError}
                    hint="Provide a full address for precise jurisdictional matching."
                >
                    <div className="relative">
                        <MapPin
                            size={15}
                            className={`absolute left-4 top-4 transition-colors ${
                                validationError
                                    ? 'text-rose-400'
                                    : 'text-slate-300'
                            }`}
                        />
                        <textarea
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            }
                            rows={3}
                            placeholder="Enter full permanent or current address..."
                            className={`
                                w-full pl-11 pr-4 py-3.5
                                bg-slate-50 rounded-2xl
                                text-sm font-medium text-slate-700
                                placeholder:text-slate-300
                                border outline-none resize-none
                                transition-all duration-200
                                ${validationError
                                ? 'border-rose-200 bg-rose-50/40 focus:ring-2 focus:ring-rose-100'
                                : 'border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                            }
                            `}
                        />
                    </div>
                </FieldGroup>

                {/* Year + State — Optional */}
                <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Year" hint="Optional">
                        <div className="relative">
                            <Calendar
                                size={15}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <input
                                type="text"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({ ...formData, year: e.target.value })
                                }
                                placeholder="e.g. 2015"
                                className="
                                    w-full pl-11 pr-4 py-3.5
                                    bg-slate-50 border border-slate-200 rounded-2xl
                                    text-sm font-medium text-slate-700
                                    placeholder:text-slate-300
                                    outline-none
                                    focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100
                                    transition-all duration-200
                                "
                            />
                        </div>
                    </FieldGroup>

                    <FieldGroup label="State" hint="Optional">
                        <div className="relative">
                            <Building2
                                size={15}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) =>
                                    setFormData({ ...formData, state: e.target.value })
                                }
                                placeholder="e.g. Maharashtra"
                                className="
                                    w-full pl-11 pr-4 py-3.5
                                    bg-slate-50 border border-slate-200 rounded-2xl
                                    text-sm font-medium text-slate-700
                                    placeholder:text-slate-300
                                    outline-none
                                    focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100
                                    transition-all duration-200
                                "
                            />
                        </div>
                    </FieldGroup>
                </div>
            </div>

            {/* ── Feedback Messages ─────────────────────────── */}
            <div className="mt-8 space-y-3">
                {error && (
                    <div className="flex items-start gap-3 px-4 py-3.5 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                        <ShieldAlert size={15} className="text-rose-400 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-rose-600">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="flex items-start gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-emerald-700">
                            Search initiated successfully. Refreshing results...
                        </p>
                    </div>
                )}
            </div>

            {/* ── Action ───────────────────────────────────── */}
            {!success && (
                <div className="mt-6 flex flex-col items-start gap-3">
                    <button
                        onClick={handleTrigger}
                        disabled={loading}
                        className={`
                            flex items-center gap-2.5
                            px-8 py-3.5 rounded-2xl
                            text-sm font-black uppercase tracking-wider
                            transition-all duration-200
                            ${loading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-500/20'
                        }
                        `}
                    >
                        {loading
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Gavel size={16} />
                        }
                        {loading ? 'Initiating...' : 'Run Criminal Check'}
                    </button>

                    <p className="text-[10px] font-medium text-slate-400 ml-1">
                        Results typically arrive within 1–2 minutes.
                    </p>
                </div>
            )}

        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   FIELD GROUP
   Wraps label + hint + error + children
───────────────────────────────────────────────────────── */
const FieldGroup = ({ label, hint, required, error, children }) => (
    <div className="space-y-2">
        {/* Label row */}
        <div className="flex items-center gap-2 ml-0.5">
            <label className="text-xs font-black text-slate-600 uppercase tracking-widest">
                {label}
            </label>
            {required && (
                <span className="text-rose-400 text-xs font-black leading-none">*</span>
            )}
            {hint && !required && (
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    — {hint}
                </span>
            )}
        </div>

        {/* Input slot */}
        {children}

        {/* Inline error */}
        {error && (
            <div className="flex items-center gap-1.5 ml-0.5">
                <AlertCircle size={11} className="text-rose-400 shrink-0" />
                <p className="text-[10px] font-bold text-rose-500">{error}</p>
            </div>
        )}
    </div>
);

/* ─────────────────────────────────────────────────────────
   READ ONLY INPUT
───────────────────────────────────────────────────────── */
const ReadOnlyInput = ({ value, icon }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
        <span className="text-slate-300 shrink-0">{icon}</span>
        <p className="text-sm font-bold text-slate-600 leading-snug">
            {value || '—'}
        </p>
    </div>
);

export default CriminalCheckTrigger;
