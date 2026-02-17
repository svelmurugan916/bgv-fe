import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, ChevronRightIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { EMAIL_REGEX, METHOD } from "../../constant/ApplicationConstant.js";
import { EMAIL_RESET_URL } from "../../constant/Endpoint.tsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";

const ForgotPasswordView = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const { unAuthenticatedRequest } = useAuthApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !EMAIL_REGEX.test(email)) {
            setError("Valid work email is required");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await unAuthenticatedRequest(undefined, `${EMAIL_RESET_URL}/${email}`, METHOD.POST);
        } catch (err) {
            console.error("Forgot password request handled.");
        } finally {
            setIsLoading(false);
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">Check Your Inbox</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    If an account is associated with <span className="text-slate-800 font-bold">{email}</span>,
                    you will receive a password reset link shortly.
                </p>
                <button
                    onClick={onBack}
                    className="w-full py-4 bg-[#5D4591] text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#5D4591]/10 hover:bg-[#4a3675] transition-all"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
            <button onClick={onBack} className="mb-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
                <ChevronRightIcon className="rotate-180" size={16} /> Back to login
            </button>

            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
                <p className="text-slate-500 font-medium">Enter your work email and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Work Email</label>
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-slate-300 group-focus-within:text-[#5D4591]'}`} size={18} />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                            placeholder="name@company.com"
                            className={`w-full pl-12 pr-4 py-4 bg-white border rounded-xl outline-none transition-all font-medium ${error ? 'border-red-500 bg-red-50/30' : 'border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10'}`}
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-1.5 mt-2 text-red-500 text-[10px] font-bold uppercase">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#5D4591] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#5D4591]/10 flex items-center justify-center gap-3 hover:bg-[#4a3675] active:scale-[0.98] transition-all disabled:opacity-80"
                >
                    {isLoading ? (
                        <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                        <><span className="ml-4">Send Reset Link</span><ArrowRight size={18} /></>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordView;
