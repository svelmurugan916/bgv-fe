import React, { useState, useEffect } from 'react';
import { Fingerprint, ChevronRight, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';

const MfaPanel = ({ mfaResponseData, otp, setOtp, otpRefs, error, setError, isLoading, onSubmit, onBack, onResend }) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [isCanResend, setIsCanResend] = useState(false);

    // AUTO-FOCUS ON FIRST BOX WHEN MFA LOADS
    useEffect(() => {
        if (otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, [otpRefs]);

    useEffect(() => {
        if (mfaResponseData.resendAvailableIn) {
            setTimeLeft(mfaResponseData.resendAvailableIn);
            setIsCanResend(false);
        }
    }, [mfaResponseData]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else { setIsCanResend(true); }
    }, [timeLeft]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1].focus();
    };

    const handleResendClick = (e) => {
        e.preventDefault();
        if (isCanResend && !isLoading) {
            onResend();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1].focus();
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <button onClick={onBack} className="mb-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <ChevronRight className="rotate-180" size={16} /> Back to login
            </button>

            <div className="mb-10">
                <div className="w-16 h-16 bg-[#F9F7FF] text-[#5D4591] rounded-xl flex items-center justify-center mb-6 border border-[#5D4591]/10"><Fingerprint size={32} /></div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Identity</h2>
                <p className="text-slate-500 font-medium">Code sent to mobile ending in ••••{mfaResponseData.target}.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in shake">
                    <ShieldAlert size={20} /><p className="text-xs font-bold uppercase">{error}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="flex justify-between gap-2 mb-10">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx} type="text" maxLength={1}
                            ref={(el) => (otpRefs.current[idx] = el)}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-12 h-16 sm:w-14 sm:h-20 text-center text-2xl font-bold text-[#5D4591] bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/10 transition-all shadow-sm"
                        />
                    ))}
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-[#5D4591] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-[#4a3675] active:scale-[0.98] transition-all disabled:opacity-80">
                    {isLoading ? <><Loader2 size={18} className="animate-spin" /> Authenticating...</> : <><span className="ml-4">Authenticate</span><ArrowRight size={18} /></>}
                </button>
            </form>

            <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                Didn't receive code?{" "}
                {isCanResend ? (
                    <a
                        href="#"
                        onClick={handleResendClick}
                        className={`text-[#5D4591] hover:underline ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isLoading ? 'Sending...' : 'Resend OTP'}
                    </a>
                ) : (
                    <span className="text-slate-300 cursor-not-allowed">
                        Resend in {timeLeft} secs
                    </span>
                )}
            </p>
        </div>
    );
};

export default MfaPanel;
