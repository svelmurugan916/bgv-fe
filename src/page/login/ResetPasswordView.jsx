import { ArrowRightIcon, ChevronRightIcon, LockIcon, ShieldCheckIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {RESET_PASSWORD} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";

const ResetPasswordView = ({ onBack, token, isValidating, tokenError }) => {
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });
    const { unAuthenticatedRequest } = useAuthApi();

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setStatus({ ...status, error: "Passwords do not match" });
            return;
        }
        if (passwords.new.length < 8) {
            setStatus({ ...status, error: "Password must be at least 8 characters" });
            return;
        }

        setStatus({ loading: true, error: '', success: false });
        try {
            const response = await unAuthenticatedRequest(
                { token, newPassword: passwords.new },
                RESET_PASSWORD,
                METHOD.PUT
            );

            if (response.status === 200) {
                setStatus({ loading: false, error: '', success: true });
            } else {
                setStatus({ loading: false, error: response.data?.message || "Failed to update password", success: false });
            }
        } catch (err) {
            setStatus({ loading: false, error: "Server error. Please try again later.", success: false });
        }
    };

    // 1. Loading State (Validating Token)
    if (isValidating) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 size={40} className="animate-spin text-[#5D4591] mb-4" />
                <p className="text-slate-500 font-bold">Verifying security link...</p>
            </div>
        );
    }

    // 2. Error State (Invalid/Expired Token)
    if (tokenError) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Link Expired</h2>
                <p className="text-slate-500 mb-8">{tokenError}</p>
                <button onClick={onBack} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Return to Login
                </button>
            </div>
        );
    }

    // 3. Success State
    if (status.success) {
        return (
            <div className="animate-in fade-in scale-95 duration-500 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Password Updated</h2>
                <p className="text-slate-500 mb-8">Your security credentials have been successfully reset. You can now log in with your new password.</p>
                <button onClick={onBack} className="w-full py-4 bg-[#5D4591] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:opacity-90 transition-all">
                    Go to Login
                </button>
            </div>
        );
    }

    // 4. Default State (The Form)
    return (
        <div className="flex flex-col w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
            <button onClick={onBack} className="mb-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <ChevronRightIcon className="rotate-180" size={16} /> Back to login
            </button>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Set New Password</h2>
            <p className="text-slate-400 font-medium mb-8">Please create a secure password that you haven't used before.</p>

            {status.error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold uppercase tracking-tight">
                    <AlertCircle size={18} /> {status.error}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                    <div className="relative">
                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="password" required
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#5D4591] focus:ring-4 ring-[#5D4591]/5 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm New Password</label>
                    <div className="relative">
                        <ShieldCheckIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="password" required
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#5D4591] focus:ring-4 ring-[#5D4591]/5 transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-[#5D4591] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#5D4591]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {status.loading ? <Loader2 size={18} className="animate-spin" /> : <>UPDATE PASSWORD <ArrowRightIcon size={18} /></>}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordView;
