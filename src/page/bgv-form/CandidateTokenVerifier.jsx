import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {AlertCircle, CheckCircle2, ShieldAlert, CheckIcon, MessageCircleIcon} from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {FAQ_DATA, METHOD} from "../../constant/ApplicationConstant.js";
import MyBrandedSpinner from "../../component/common/MyBrandedSpinner.jsx";
import CandidateFormFooter from "../../component/footer/CandidateFormFooter.jsx";
import GlobalHeader from "./GlobalHeader.jsx";
import {useTenant} from "../../provider/TenantProvider.jsx";
import SupportDrawer from "../../component/app-basic-page/SupportDrawer.jsx";

const TokenVerifier = ({
                           TargetForm,
                           endpoint,
                           loadingSubtext = "Verifying your invitation...",
                           successMessage = "Preparing your verification form..."
                       }) => {
    const [searchParams] = useSearchParams();
    const { unAuthenticatedRequest, setAuthData } = useAuthApi();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const [status, setStatus] = useState('verifying');
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorType, setErrorType] = useState('invalid');
    const [candidateDataResponse, setCandidateDataResponse] = useState({});
    const [candidateName, setCandidateName] = useState(undefined);
    const {tenantConfig} = useTenant();
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    const isInitializedRef = useRef(false);
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setErrorMessage('No invitation token found. Please check your email link.');
                return;
            }
            try {
                // Uses the specific endpoint passed via props
                const response = await unAuthenticatedRequest({}, `${endpoint}?token=${token}`, METHOD.GET);

                if (response.data?.ableToFillForm) {
                    setStatus('success');
                    setCandidateDataResponse(response.data);
                    setAuthData(token);

                    setTimeout(() => {
                        setShowForm(true);
                    }, 1000);
                } else {
                    setStatus('error');
                    setCandidateName(response.data?.candidateName || '');
                    setProfilePictureUrl(response.data?.profilePictureUrl || '');
                    setErrorMessage(response.data.message);
                    if (response.data.message.toLowerCase().includes('submitted')) {
                        setErrorType('submitted');
                    } else if (response.data.message.toLowerCase().includes('disabled')) {
                        setErrorType('disabled');
                    }
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.response?.data?.message || 'The link is invalid or has expired.');
                setErrorType('invalid');
            }
        };

        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            verifyToken();
        }
    }, [token, endpoint, unAuthenticatedRequest, setAuthData]);

    if (showForm) {
        return <TargetForm candidateDataResponse={candidateDataResponse} token={token} />;
    }

    if (status === 'verifying') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <MyBrandedSpinner />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4 animate-pulse">
                    {loadingSubtext}
                </p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 flex flex-col items-center text-center max-w-md border border-emerald-50">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Verified!</h2>
                    <p className="text-slate-600 mt-2 font-medium">{successMessage}</p>
                    <div className="mt-6 w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-progress-fast origin-left"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* 1. HEADER */}
            <GlobalHeader
                candidateName={candidateName?.trim() || 'Candidate'}
                profilePictureUrl={profilePictureUrl}
                appId="CF-99281-2024"
                isHelpOpen={isHelpOpen} setIsHelpOpen={setIsHelpOpen}
            />

            {/* 2. MAIN CONTENT (Centered in the remaining space) */}
            <main className="flex-grow flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
                    <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center text-center relative overflow-hidden">

                        {/* Decorative background element */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${
                            errorType === 'submitted' ? "bg-emerald-500" : "bg-red-500"
                        }`} />

                        {/* Status Icon with Double-Ring Effect */}
                        <div className="relative mb-8">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-pulse opacity-20 absolute inset-0 ${
                                errorType === 'submitted' ? "bg-emerald-400" : "bg-red-400"
                            }`} />
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 ${
                                errorType === 'submitted' ? "bg-emerald-50" : "bg-red-50"
                            }`}>
                                {errorType === 'submitted' ? (
                                    <CheckIcon className="w-10 h-10 text-emerald-500" strokeWidth={3} />
                                ) : errorType === 'disabled' ? (
                                    <ShieldAlert className="w-10 h-10 text-red-500" />
                                ) : (
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                )}
                            </div>
                        </div>

                        {/* Text Content */}
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                            {errorType === 'submitted' ? 'Already Submitted' : 'Access Denied'}
                        </h2>
                        <p className="text-sm lg:text-base text-slate-500 font-medium leading-relaxed px-2">
                            {errorMessage}
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-10 w-full space-y-3">
                            {errorType !== 'submitted' ? (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-4 px-6 bg-[#5D4591] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4A3675] shadow-lg shadow-[#5D4591]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Try Re-authenticating
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsHelpOpen(true)}
                                    className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <MessageCircleIcon size={16} />
                                    Contact Support
                                </button>
                            )}

                            <div className="pt-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    If you believe this is an error, please reach out to your <span className="text-[#5D4591]">HR Executive</span> or the {tenantConfig?.tenantName || "Vantira"} support team.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 3. FOOTER */}
            <CandidateFormFooter setIsHelpOpen={() => {}} />
            <SupportDrawer
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                faqs={FAQ_DATA[errorType === 'submitted' ? "SUBMISSION_SUCCESS" : "INVALID_TOKEN"]}
            />
        </div>
    );
};

export default TokenVerifier;
