import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    ExternalLink,
    User,
    Smartphone,
    Lock,
    CheckCircle2,
    AlertCircle,
    RefreshCcw,
    Info,
    ChevronRight,
    Loader2,
    FileCheck,
    Clock,
    XCircle
} from "lucide-react";
import GlobalHeader from "../bgv-form/GlobalHeader.jsx";
import MyBrandedSpinner from "../../component/common/MyBrandedSpinner.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {INITIATE_DIGILOCKER_VERIFICATION, VERIFY_DIGILOCKER_STATUS} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import SSEListener from "../../component/listener/SSEListener.jsx";

const DigiLockerVerificationPage = ({ candidateDataResponse }) => {
    // --- STATES ---
    const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'verifying' | 'success' | 'error'
    const [isManualVerifying, setIsManualVerifying] = useState(false); // New state for fallback
    const [errorMessage, setErrorMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [popupRef, setPopupRef] = useState(null);
    const [clientId, setClientId] = useState(null);
    const [isVerificationError, setIsVerificationError] = useState(false);
    const { authenticatedRequest, unAuthenticatedRequest, accessToken } = useAuthApi();

    const candidateName = `${candidateDataResponse?.firstName} ${candidateDataResponse?.lastName}`;

    // --- TIMER LOGIC ---
    useEffect(() => {
        let timer;
        if (status === 'verifying' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && status === 'verifying') {
            handleCancel();
            setStatus('error');
            setErrorMessage("Verification session timed out. Please initiate again.");
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- LOGIC: Cancel Verification ---
    const handleCancel = () => {
        if (popupRef && !popupRef.closed) {
            popupRef.close();
        }
        setPopupRef(null);
        setTimeLeft(300);
        setStatus('idle');
        setIsManualVerifying(false);
    };

    const handleNotificationReceived = (notification) => {
        console.log(notification.message);
        const isSuccess = notification.message === ("Verification Completed");

        if (isSuccess) {
            if (popupRef && !popupRef.closed) {
                popupRef.close();
            }
            setIsManualVerifying(false);
            setStatus('success');
        } else {
            const isError = notification.message === ("Verification Incomplete");
            if(isError) {
                if (popupRef && !popupRef.closed) {
                    popupRef.close();
                }
                setIsManualVerifying(false);
                setStatus('error');
                setErrorMessage("We were unable to retrieve your Aadhaar details. Please try again. If the issue persists, please contact your HR representative for assistance.");
            }
        }
    };

    // --- LOGIC: Fallback Manual Verify ---
    const handleManualVerify = async () => {
        setIsManualVerifying(true);
        try {
            const payload = {
                client_id: clientId,
            };
            const response = await unAuthenticatedRequest(payload, VERIFY_DIGILOCKER_STATUS, METHOD.POST);
            if(response.status !== 200) {
                setIsVerificationError(true);
            }
        } catch (error) {
            console.error("Manual verification check failed:", error);
            setIsManualVerifying(false);
            setIsVerificationError(true);
        } finally {
            setIsManualVerifying(false);
        }
    };

    // --- LOGIC: Initiate Surepass/DigiLocker ---
    const handleInitiateVerification = async () => {
        setStatus('submitting');
        try {
            const userIp = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(d => d.ip).catch(() => "0.0.0.0");
            const payload = {
                candidateId: candidateDataResponse?.candidateId,
                identityCheckId: candidateDataResponse?.aadhaarCheckId,
                ipAddress: userIp
            };

            const response = await authenticatedRequest(payload, INITIATE_DIGILOCKER_VERIFICATION, METHOD.POST);

            if (response.status === 200 && response.data?.data?.url) {
                const url = response.data?.data?.url;
                setClientId(response.data?.data?.client_id);

                const width = 600;
                const height = 800;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;

                const windowFeatures = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`;

                const verificationWindow = window.open(url, "DigiLockerVerification", windowFeatures);

                if (verificationWindow) {
                    verificationWindow.focus();
                    setPopupRef(verificationWindow);
                    setTimeLeft(300);
                    setStatus('verifying');
                } else {
                    throw new Error("Popup blocked! Please allow popups for this site to continue verification.");
                }

            } else {
                throw new Error(response.data?.message || "Could not initiate verification session.");
            }
        } catch (error) {
            console.error("Initiation Error:", error);
            setStatus('error');
            setErrorMessage(error.message || "Internal server error. Please try again later.");
        }
    };

    const renderContent = () => {
        if (status === 'submitting') return <LoadingView />;
        if (status === 'verifying') return (
            <VerifyingView
                timeLeft={timeLeft}
                formatTime={formatTime}
                onCancel={handleCancel}
                onManualVerify={handleManualVerify}
                isManualVerifying={isManualVerifying}
                isVerificationError={isVerificationError}
            />
        );
        if (status === 'success') return <SuccessView />;
        if (status === 'error') return <ErrorView message={errorMessage} onRetry={() => setStatus('idle')} />;

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Verification</h2>
                    <p className="text-slate-500 mt-2 font-medium">Please verify your Aadhaar details via DigiLocker to proceed.</p>
                </div>

                <div className="bg-[#F9F7FF] border border-[#5D4591]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5D4591] shrink-0">
                        <User size={40} />
                    </div>
                    <div className="text-center md:text-left space-y-1">
                        <p className="text-[10px] font-black text-[#5D4591] uppercase tracking-[0.2em]">Verification Subject</p>
                        <h3 className="text-2xl font-bold text-slate-800">{candidateName}</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <Smartphone size={14} className="text-slate-400" /> Aadhaar Linked Mobile
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <FileCheck size={14} className="text-slate-400" /> Aadhaar e-KYC
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InstructionCard
                        icon={<Smartphone size={20} />}
                        step="01"
                        title="Authenticate"
                        desc="Login to DigiLocker using your Aadhaar & OTP."
                    />
                    <InstructionCard
                        icon={<Lock size={20} />}
                        step="02"
                        title="Consent"
                        desc="Grant permission to share XML data securely."
                    />
                    <InstructionCard
                        icon={<ShieldCheck size={20} />}
                        step="03"
                        title="Verified"
                        desc="Your identity is confirmed instantly."
                    />
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleInitiateVerification}
                        className="w-full bg-[#5D4591] hover:bg-[#4a3675] text-white py-5 px-8 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-purple-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
                    >
                        <span>Verify with DigiLocker</span>
                        <ExternalLink size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>

                    <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <Info className="text-amber-600 shrink-0" size={18} />
                        <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                            This session will expire in 30 minutes. Ensure you have your Aadhaar-linked mobile phone ready for OTP.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <GlobalHeader candidateName={candidateName} appId="ID-9902" />
            {accessToken && <SSEListener onNotification={handleNotificationReceived}  />}

            <div className="flex flex-col lg:flex-row flex-1">
                <aside className="hidden lg:flex w-80 bg-slate-50 border-r border-slate-100 p-12 flex-col gap-10">
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-500">
                            <ShieldCheck size={28} />
                        </div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest pt-2">Secure Link</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Your data is encrypted end-to-end using government-grade protocols.</p>
                    </div>

                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#5D4591]">
                            <Lock size={28} />
                        </div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest pt-2">Privacy First</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">TraceU only accesses required XML fields. No biometric data is stored.</p>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col overflow-y-auto">
                    <div className="flex-1 p-6 lg:p-20 max-w-3xl mx-auto w-full">
                        {renderContent()}
                    </div>

                    <footer className="p-8 text-center border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Powered by DigiLocker & Surepass Identity Cloud
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const VerifyingView = ({ timeLeft, formatTime, onCancel, onManualVerify, isManualVerifying, isVerificationError }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95">
        <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-slate-100 border-t-[#5D4591] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={40} className="text-[#5D4591]" />
            </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">Verification in Progress</h2>
        <p className="text-slate-500 font-medium mb-8">Please complete the process in the new window.</p>

        <div className="bg-slate-50 rounded-3xl p-8 w-full max-w-sm border border-slate-100 mb-6">
            <div className="flex items-center justify-center gap-2 text-[#5D4591] mb-2">
                <Clock size={20} />
                <span className="text-4xl font-black tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Expiry</p>
        </div>

        {/* Fallback Section */}
        <div className="mb-10 min-h-[40px] flex items-center justify-center">
            {isVerificationError ? (
                <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                        <AlertCircle size={16} />
                        <span>Verification check failed</span>
                    </div>
                    <button
                        onClick={onManualVerify}
                        className="text-[10px] uppercase tracking-widest font-black text-[#5D4591] hover:text-[#4a3675] flex items-center gap-1"
                    >
                        <RefreshCcw size={12} /> Click to retry check
                    </button>
                </div>
            ) : isManualVerifying ? (
                <div className="flex items-center gap-2 text-[#5D4591] font-bold text-sm animate-pulse">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying...</span>
                </div>
            ) : (
                <p className="text-xs font-medium text-slate-500 animate-in fade-in">
                    Already completed the process?{' '}
                    <button
                        onClick={onManualVerify}
                        className="text-[#5D4591] font-bold hover:underline underline-offset-4"
                    >
                        Click here to verify
                    </button>
                </p>
            )}
        </div>

        <button
            onClick={onCancel}
            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
        >
            <XCircle size={18} /> Cancel Verification
        </button>
    </div>
);

const InstructionCard = ({ icon, step, title, desc }) => (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#5D4591]/20 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className="text-[#5D4591]">{icon}</div>
            <span className="text-[10px] font-black text-slate-300 group-hover:text-[#5D4591]/30 transition-colors">{step}</span>
        </div>
        <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
        <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">{desc}</p>
    </div>
);

const LoadingView = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <MyBrandedSpinner />
        <h2 className="text-2xl font-black text-slate-800 mt-8">Connecting to DigiLocker</h2>
        <p className="text-sm font-medium text-slate-500 mt-2">Securing your identity session...</p>
    </div>
);

const SuccessView = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Verification Complete!</h2>
        <p className="text-slate-600 max-w-md leading-relaxed mb-10 font-medium">
            Your Aadhaar details have been successfully verified. You can now close this tab.
        </p>
    </div>
);

const ErrorView = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in shake-1">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">{message}</p>
        <button
            onClick={onRetry}
            className="flex items-center gap-2 px-10 py-4 bg-[#5D4591] text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-100"
        >
            <RefreshCcw size={18} /> Try Again
        </button>
    </div>
);

export default DigiLockerVerificationPage;
