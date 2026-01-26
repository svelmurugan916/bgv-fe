import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ShieldAlert, CheckIcon } from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import MyBrandedSpinner from "../../component/common/MyBrandedSpinner.jsx";

const TokenVerifier = ({
                           TargetForm,
                           endpoint,
                           loadingSubtext = "Verifying your invitation...",
                           successMessage = "Preparing your verification form..."
                       }) => {
    const [searchParams] = useSearchParams();
    const { unAuthenticatedRequest, setAuthData } = useAuthApi();

    const [status, setStatus] = useState('verifying');
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorType, setErrorType] = useState('invalid');
    const [candidateDataResponse, setCandidateDataResponse] = useState({});

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/60 flex flex-col items-center text-center max-w-md border border-red-50">
                <div className={`w-20 h-20 ${errorType === 'submitted' ? "bg-green-50" : "bg-red-50"} rounded-full flex items-center justify-center mb-6`}>
                    {errorType === 'submitted' ? (
                        <CheckIcon className="w-10 h-10 text-green-500" />
                    ) : errorType === 'disabled' ? (
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    ) : (
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {errorType === 'submitted' ? 'Already Submitted' : 'Access Denied'}
                </h2>
                <p className="text-slate-600 leading-relaxed">{errorMessage}</p>
                <div className="mt-8 w-full space-y-3">
                    {errorType !== 'submitted' && (
                        <button onClick={() => window.location.reload()} className="w-full py-3 px-6 bg-[#5D4591] text-white rounded-xl font-semibold hover:bg-[#4A3675] shadow-lg shadow-[#5D4591]/20 cursor-pointer">
                            Try Again
                        </button>
                    )}
                    <p className="text-xs text-slate-400">If you believe this is an error, please contact your HR executive.</p>
                </div>
            </div>
        </div>
    );
};

export default TokenVerifier;
