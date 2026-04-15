import React, {useState, useEffect, useRef} from 'react';
import {
    ShieldCheck,
    Loader2,
    CheckCircle2,
    Lock,
    XCircle,
    ArrowRight,
    FileText,
    RefreshCw // Added for Retry icon
} from 'lucide-react';
import {useTenant} from "../../provider/TenantProvider.jsx";
import {useParams} from "react-router-dom";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {VERIFY_AND_DOWNLOAD_DIGILOCKER_STATUS} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";

const DigiLockerVerification = () => {
    const [status, setStatus] = useState('VERIFYING');
    const [errorMsg, setErrorMsg] = useState('');
    const { tenantConfig } = useTenant();
    const isCompInitRef = useRef(false);
    const { id } = useParams();
    const { unAuthenticatedRequest } = useAuthApi();


    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await unAuthenticatedRequest(undefined, `${VERIFY_AND_DOWNLOAD_DIGILOCKER_STATUS}/${id}`, METHOD.POST);
                if(response.status === 200) {
                    setStatus('SUCCESS');
                } else {
                    const data = response.data;
                    setErrorMsg(data.message);
                    console.log('resp err - ', response);
                    setStatus('ERROR');
                }
            } catch (err) {
                console.log('err -- ', err);
                setStatus('ERROR');
            }

        }
        if(!isCompInitRef.current) {
            isCompInitRef.current = true;
            verifySession();
        }
    }, []);

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* --- COMPACT HEADER --- */}
            <header className="p-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="inline-flex flex-col items-start">
                    <img src={tenantConfig?.logoUrl || "/logo.png"} alt="Vantira" className="h-8 w-auto"/>
                    <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 ml-1">
                        Powered by Vantira
                    </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                    <Lock size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Secure Link</span>
                </div>
            </header>

            {/* --- MAIN CONTENT (Centered) --- */}
            <main className="flex-1 flex flex-col items-center justify-center p-8">

                {status === 'VERIFYING' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100 mb-6 relative overflow-hidden">
                            <FileText size={32} className="text-[#5D4591]" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#5D4591] animate-[scan_2s_infinite]" />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 mb-2">Authenticating...</h1>
                        <p className="text-xs text-slate-500 text-center max-w-[250px] leading-relaxed">
                            Securing your documents from DigiLocker. Please do not close this window.
                        </p>
                    </div>
                )}

                {status === 'SUCCESS' && (
                    <div className="w-full max-w-[400px] flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                            <CheckCircle2 size={32} />
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 mb-2">Verification Successful!</h1>
                        <p className="text-sm text-slate-500 mb-8 text-center">Your Aadhaar has been verified successfully.</p>

                        <div className="w-full bg-white rounded-2xl border border-slate-100 p-5 shadow-sm mb-8">
                            <div className="flex justify-between mb-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document</span>
                                <span className="text-xs font-bold text-slate-900">Aadhaar Card</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> Verified
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => window.close()}
                            className="w-full py-4 bg-[#5D4591] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Close this window
                            <ArrowRight size={14} />
                        </button>
                    </div>
                )}

                {/* --- NEW: ERROR STATE --- */}
                {status === 'ERROR' && (
                    <div className="w-full max-w-[400px] flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-rose-200">
                            <XCircle size={32} />
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 mb-2">Verification Failed</h1>
                        <p className="text-sm text-slate-500 mb-8 text-center">
                            {errorMsg || "We couldn't verify your document at this moment. This might be due to a connection issue with DigiLocker."}
                        </p>

                        <div className="flex flex-col gap-3 w-full mb-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={14} />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.close()}
                                className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
                            >
                                Close Window
                            </button>
                        </div>

                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Error Code: ERR_DL_AUTH_FAILED
                        </p>
                    </div>
                )}
            </main>

            {/* --- FOOTER (UNCHANGED) --- */}
            <footer className="p-10 mt-auto shrink-0 bg-white border-t border-slate-50">
                <div className="flex flex-col items-center gap-5">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Lock size={12} className="text-[#5D4591] opacity-80" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                TLS 1.3 Encrypted
                            </span>
                        </div>
                        <div className="w-[1px] h-3 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={12} className="text-[#5D4591] opacity-80" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                DPDP Compliant
                            </span>
                        </div>
                    </div>
                    <div className="text-center space-y-1.5">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                                Vantira Secure Gateway v1.2
                            </p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            © 2026 Corentec Solutions <span className="mx-1 opacity-30">•</span> All data is processed in a secure environment
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
};

export default DigiLockerVerification;
