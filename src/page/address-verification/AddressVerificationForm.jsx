import React, { useState } from 'react';
import GeoLocationStep from "./GeoLocationStep.jsx";
import PhotoEvidenceStep from "./PhotoEvidenceStep.jsx";
import AddressIdStep from "./AddressIdStep.jsx";
import AVReviewStep from "./AVReviewStep.jsx";
import {ChevronLeftIcon, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw, Home, Loader2} from "lucide-react";
import { useForm } from "../../provider/FormProvider.jsx";
import { validateAVStep } from "./av-validation.js";
import GlobalHeader from "../bgv-form/GlobalHeader.jsx";
import Stepper from "../bgv-form/Stepper.jsx";
import { scrollToFirstError } from "../bgv-form/form-utils.js";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { SUBMIT_ADDRESS_VERIFICATION } from "../../constant/Endpoint.tsx"; // Ensure this constant exists
import { METHOD } from "../../constant/ApplicationConstant.js";
import MyBrandedSpinner from "../../component/common/MyBrandedSpinner.jsx";

const AddressVerificationForm = ({ candidateDataResponse }) => {
    const [activeStep, setActiveStep] = useState(1);
    const { formData, setErrors } = useForm();
    const { authenticatedRequest } = useAuthApi();

    // --- NEW SUBMISSION STATES ---
    const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const stepsArray = [
        { id: 1, fullTitle: 'GPS Check-In' },
        { id: 2, fullTitle: 'Visual Proof' },
        { id: 3, fullTitle: 'Review' },
    ];
    // --- SUBMISSION LOGIC ---
    const handleSubmit = async () => {
        setStatus('submitting');
        try {
            // 1. Fetch the Public IP Address
            let publicIp = "0.0.0.0"; // Fallback
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                publicIp = ipData.ip;
            } catch (ipError) {
                console.error("Could not fetch IP:", ipError);
            }

            // 2. Initialize FormData
            const data = new FormData();

            // 3. Add the Address Check ID
            data.append('addressCheckId', candidateDataResponse?.addressCheckId);

            // 4. Add Location Data
            data.append('lat', formData.addressVerification.location.lat);
            data.append('lon', formData.addressVerification.location.long);
            data.append('accuracy', formData.addressVerification.location.accuracy);

            // 5. Add Multipart Files
            if (formData.addressVerification.photos.frontDoor) {
                data.append('frontDoor', formData.addressVerification.photos.frontDoor);
            }

            if (formData.addressVerification.photos.landmark) {
                data.append('landmark', formData.addressVerification.photos.landmark);
            }

            // 6. Add Consent and IP Address
            data.append('consent', formData.addressVerification.consent);
            data.append('deviceIpAddress', publicIp); // Adding the IP address here

            // 7. Execute Request
            const response = await authenticatedRequest(data, SUBMIT_ADDRESS_VERIFICATION, METHOD.POST);

            if (response.status === 200 || response.status === 201) {
                setStatus('success');
            } else {
                throw new Error(response.data?.message || "Submission failed");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || "Something went wrong while submitting your verification. Please try again.");
        }
    };



    const handleNext = () => {
        const stepErrors = validateAVStep(activeStep, formData, setErrors);
        if (Object.keys(stepErrors).length === 0) {
            if (activeStep < 3) {
                setActiveStep(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Final Step: Execute API Submission
                handleSubmit();
            }
        } else {
            scrollToFirstError(stepErrors);
        }
    };

    const renderStep = () => {
        if (status === 'submitting') return <LoadingView />;
        if (status === 'success') return <SuccessView />;
        if (status === 'error') return <ErrorView message={errorMessage} onRetry={() => setStatus('idle')} />;

        switch (activeStep) {
            case 1: return <GeoLocationStep candidateDataResponse={candidateDataResponse} />;
            case 2: return <PhotoEvidenceStep />;
            case 3: return <AVReviewStep />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <GlobalHeader candidateName={`${candidateDataResponse.firstName} ${candidateDataResponse.lastName}`} appId="AV-7721" />
            <div className="flex flex-col lg:flex-row flex-1">
                <Stepper activeStep={activeStep} steps={stepsArray} hideOnSuccess={status === 'success'} />
                <main className="flex-1 flex flex-col">
                    <div className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto w-full">
                        {renderStep()}
                    </div>

                    {/* Hide buttons on success/loading/error */}
                    {status === 'idle' && (
                        <div className="p-6 lg:px-12 border-t border-slate-50 flex justify-between items-center bg-white mt-auto">
                            {/* RESPONSIVE BACK BUTTON */}
                            <button
                                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                                disabled={activeStep === 1 || status === 'submitting'}
                                className={`flex items-center cursor-pointer justify-center transition-all group w-16 h-[52px] rounded-2xl bg-slate-50 border border-slate-200 shadow-sm text-slate-500 active:bg-slate-100 lg:w-auto lg:h-auto lg:px-8 lg:py-3 lg:rounded-xl lg:bg-transparent lg:border-transparent lg:shadow-none lg:hover:bg-slate-50 lg:hover:text-slate-800 
                                ${activeStep === 1 ? 'opacity-0 pointer-events-none' : ''} 
                                ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <ChevronLeftIcon size={22} className="transition-transform group-hover:-translate-x-1 lg:mr-1 lg:size-6" />
                                <span className="hidden lg:inline font-bold text-sm">Back</span>
                            </button>

                            {/* RESPONSIVE NEXT/SUBMIT BUTTON */}
                            <button
                                onClick={handleNext}
                                disabled={status === 'submitting'}
                                className={`flex items-center bg-[#5D4591] text-white cursor-pointer px-5 lg:px-12 py-3.5 rounded-2xl lg:rounded-xl font-bold hover:bg-[#4a3675] transition-all shadow-lg shadow-[#5D4591]/10 active:scale-95 group min-w-[140px] lg:min-w-[160px] justify-center 
                                ${status === 'submitting' ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        <span className="text-[11px] lg:text-sm whitespace-nowrap">Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="block text-[11px] lg:text-sm font-bold mr-1 lg:mr-2 whitespace-nowrap">
                                            {activeStep === 3 ? 'Submit Verification' : 'Save and Next'}
                                        </span>
                                        <ChevronRight size={20} className="transition-transform group-hover:translate-x-1 lg:size-6" />
                                    </>
                                )}
                            </button>
                        </div>

                    )}
                </main>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS FOR FEEDBACK ---

const LoadingView = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <MyBrandedSpinner />
        <h2 className="text-xl font-bold text-slate-800 mt-6">Submitting Evidence</h2>
        <p className="text-sm text-slate-500 mt-2">Uploading high-resolution photos and GPS metadata...</p>
    </div>
);

const SuccessView = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Verification Submitted!</h2>
        <p className="text-slate-600 max-w-md leading-relaxed mb-10">
            Thank you. Your digital address verification has been successfully captured and sent for review. You can now close this window.
        </p>
        <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
        >
            <Home size={18} /> Return Home
        </button>
    </div>
);

const ErrorView = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in shake-1">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Submission Failed</h2>
        <p className="text-slate-500 max-w-sm mb-8">{message}</p>
        <button
            onClick={onRetry}
            className="flex items-center gap-2 px-10 py-3 bg-[#5D4591] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#5D4591]/20"
        >
            <RefreshCcw size={18} /> Try Again
        </button>
    </div>
);

export default AddressVerificationForm;
