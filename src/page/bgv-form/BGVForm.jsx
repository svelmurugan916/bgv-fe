import React, { useEffect, useState, useMemo } from 'react';
import Stepper from './Stepper';
import BasicInfo from './BasicInfo';
import IDVerification from './IDVerification';
import Education from "./Education.jsx";
import Employment from "./Employment.jsx";
import References from "./References.jsx";
import Review from "./Review.jsx";
import { ChevronLeftIcon, ChevronRight, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import GlobalHeader from "./GlobalHeader.jsx";
import AddressDetails from "./AddressDetails.jsx";
import {
    ADDRESS_INFO_PAGE_IDX,
    BASIC_INFO_PAGE_IDX, EDUCATION_PAGE_IDX, EXPERIENCE_PAGE_IDX,
    IDENTIFIER_PAGE_IDX,
    REFERENCE_PAGE_IDX,
    REVIEW_PAGE_IDX,
    validateStep
} from "./form-validation.js";
import { useForm } from "../../provider/FormProvider.jsx";
import { scrollToFirstError } from "./form-utils.js";
import { SAVE_BGV_STEP } from "../../constant/Endpoint.tsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";

const BGVForm = ({ candidateDataResponse = undefined }) => {
    const [activeStep, setActiveStep] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // New Success State
    const [submitError, setSubmitError] = useState(null); // New Error State
    const { formData, setErrors, hydrateForm, setCandidateId } = useForm();
    const {authenticatedRequest} = useAuthApi();

    // Configuration Logic for Steps
    const stepConfigMap = {
        [ADDRESS_INFO_PAGE_IDX]: 'ADDRESS',
        [IDENTIFIER_PAGE_IDX]: 'IDENTITY',
        [EDUCATION_PAGE_IDX]: 'EDUCATION',
        [EXPERIENCE_PAGE_IDX]: 'EMPLOYMENT',
        [REFERENCE_PAGE_IDX]: 'REFERENCE'
    };

    const filteredSteps = useMemo(() => {
        const checks = candidateDataResponse?.checks || [];
        return stepsArray.filter(step => {
            if (step.id === BASIC_INFO_PAGE_IDX || step.id === REVIEW_PAGE_IDX) return true;
            const checkCode = stepConfigMap[step.id];
            return checks.includes(checkCode);
        });
    }, [candidateDataResponse]);

    const handleNext = async () => {
        setSubmitError(null); // Clear previous errors
        const isNewError = validateStep(activeStep, formData, setErrors, candidateDataResponse?.checkConfigs, candidateDataResponse?.checks);

        if (Object.entries(isNewError).length === 0) {
            setIsSaving(true);
            try {
                let reviewData = { consent: formData.consent };

                if (activeStep === REVIEW_PAGE_IDX) {
                    const ip = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(d => d.ip).catch(() => "0.0.0.0");
                    reviewData = {
                        consent: formData.consent,
                        consentIp: ip,
                        consentTimestamp: new Date().toISOString()
                    };
                }

                const stepKeyMap = {
                    1: { step: 'basic', data: formData.basic },
                    2: { step: 'address', data: { addresses: formData.basic.addresses }},
                    3: { step: 'idVerification', data: formData.idVerification },
                    4: { step: 'education', data: { educationDetails : formData.education }},
                    5: { step: 'employment', data: formData.employment },
                    6: { step: 'references', data: {references: formData.references} },
                    7: { step: 'review', data: reviewData }
                };

                const payload = stepKeyMap[activeStep];
                const response = await authenticatedRequest(payload, `${SAVE_BGV_STEP}/${candidateDataResponse?.candidateId}`);

                if (response.status === 200) {
                    if (response.data?.responseData) {
                        hydrateForm(response.data?.responseData);
                    }

                    // IF FINAL STEP SUCCESSFUL
                    if (activeStep === REVIEW_PAGE_IDX) {
                        setIsSubmitted(true);
                        return;
                    }

                    const nextStepObj = filteredSteps.find(s => s.id > activeStep);
                    if (nextStepObj) {
                        setActiveStep(nextStepObj.id);
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        });
                    }
                } else {
                    // Handle API level error (e.g. 400, 500)
                    setSubmitError( "Something went wrong while saving. Please try again. If the issue still persist, Please contact your HR Representative");
                }
            } catch (error) {
                // Handle Network error
                console.error(error);
                setSubmitError( "Something went wrong while saving. Please try again. If the issue still persist, Please contact your HR Representative");
            } finally {
                setIsSaving(false);
            }
        } else {
            scrollToFirstError(isNewError);
        }
    };

    useEffect(() => {
        const initialFormData = candidateDataResponse?.candidateDetailsResponse;
        const candidateId = candidateDataResponse?.candidateId
        if(candidateId) setCandidateId(candidateId);
        const checks = candidateDataResponse?.checks || [];
        const checkConfigs = candidateDataResponse?.checkConfigs || {};
        if (initialFormData) {
            hydrateForm(initialFormData);
            let resumeStep = BASIC_INFO_PAGE_IDX;
            const validationSteps = filteredSteps.filter(s => s.id < REVIEW_PAGE_IDX);
            for (const stepObj of validationSteps) {
                const i = stepObj.id;
                const stepErrors = validateStep(i, initialFormData, () => {}, checkConfigs, checks);
                let hasData = true;

                if(i === BASIC_INFO_PAGE_IDX) hasData = initialFormData.basic?.fatherName !== "" || initialFormData.basic?.fatherName !== undefined;
                else if (i === ADDRESS_INFO_PAGE_IDX) hasData = initialFormData.basic?.addresses?.length > 0;
                else if (i === EDUCATION_PAGE_IDX) hasData = initialFormData.education?.length > 0;
                else if (i === EXPERIENCE_PAGE_IDX) hasData = initialFormData.employment?.isFresher || initialFormData.employment?.details?.length > 0;
                else if (i === REFERENCE_PAGE_IDX) hasData = initialFormData.references?.length > 0;

                if (Object.keys(stepErrors).length > 0 || !hasData) {
                    resumeStep = i;
                    break;
                }
                resumeStep = REVIEW_PAGE_IDX;
            }
            setActiveStep(resumeStep);
        } else {
            setActiveStep(BASIC_INFO_PAGE_IDX);
        }
    }, [candidateDataResponse, filteredSteps]);

    // SUCCESS VIEW COMPONENT
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Application Submitted!</h1>
                <p className="text-slate-500 max-w-md mb-8 font-medium leading-relaxed">
                    Thank you, <span className="text-[#5D4591] font-bold">{formData.basic.firstName}</span>. Your background verification details have been successfully received. Our team will now begin the verification process.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 mb-10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Case Status: In Progress</span>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (activeStep) {
            case 1: return <BasicInfo checks={candidateDataResponse?.checks || []} />;
            case 2: return <AddressDetails />;
            case 3: return <IDVerification />;
            case 4: return <Education />;
            case 5: return <Employment />;
            case 6: return <References />;
            case 7: return <Review checks={candidateDataResponse?.checks} />;
            default: return null;
        }
    };

    if (activeStep === null) return null;

    return (
        <div className="flex flex-col min-h-screen bg-white transform-gpu isolation-isolate">
            <GlobalHeader candidateName={`${formData.basic.firstName} ${formData.basic.lastName}`} appId="CF-99281-2024" />
            <div className="flex flex-col lg:flex-row flex-1">
                <Stepper activeStep={activeStep} steps={filteredSteps} />

                <main className="flex-1 flex flex-col">
                    <div className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto w-full">
                        {/* ERROR ALERT */}
                        {submitError && (
                            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-rose-900 uppercase tracking-widest leading-none mb-1">Submission Failed</p>
                                    <p className="text-xs font-bold text-rose-600/80">{submitError}</p>
                                </div>
                                <button onClick={handleNext} className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-600">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        )}

                        {renderStep()}
                    </div>

                    {/* Footer Navigation (Existing) */}
                    <div className="p-6 lg:px-12 border-t border-slate-50 flex justify-between items-center bg-white mt-auto">
                        <button
                            onClick={() => {
                                const prevStepObj = [...filteredSteps].reverse().find(s => s.id < activeStep);
                                if (prevStepObj) {
                                    setActiveStep(prevStepObj.id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            disabled={activeStep === BASIC_INFO_PAGE_IDX || isSaving}
                            className={`flex items-center cursor-pointer justify-center transition-all group w-16 h-[52px] rounded-2xl bg-slate-50 border border-slate-200 shadow-sm text-slate-500 active:bg-slate-100 lg:w-auto lg:h-auto lg:px-8 lg:py-3 lg:rounded-xl lg:bg-transparent lg:border-transparent lg:shadow-none lg:hover:bg-slate-50 lg:hover:text-slate-800 ${activeStep === BASIC_INFO_PAGE_IDX ? 'opacity-0 pointer-events-none' : ''} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeftIcon size={22} className="transition-transform group-hover:-translate-x-1 lg:mr-1 lg:size-6" />
                            <span className="hidden lg:inline font-bold text-sm">Back</span>
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isSaving}
                            className={`flex items-center bg-[#5D4591] text-white cursor-pointer px-5 lg:px-12 py-3.5 rounded-2xl lg:rounded-xl font-bold hover:bg-[#4a3675] transition-all shadow-lg shadow-[#5D4591]/10 active:scale-95 group min-w-[140px] lg:min-w-[160px] justify-center ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    <span className="text-[11px] lg:text-sm whitespace-nowrap">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <span className="block text-[11px] lg:text-sm font-bold mr-1 lg:mr-2 whitespace-nowrap">
                                        {activeStep === IDENTIFIER_PAGE_IDX ? 'Upload and Continue' : activeStep === REVIEW_PAGE_IDX ? 'Submit Application' : 'Save and Next'}
                                    </span>
                                    <ChevronRight size={20} className="transition-transform group-hover:translate-x-1 lg:size-6" />
                                </>
                            )}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

const stepsArray = [
    { id: 1, fullTitle: 'Basic Info' },
    { id: 2, fullTitle: 'Address' },
    { id: 3, fullTitle: 'ID Verification' },
    { id: 4, fullTitle: 'Education' },
    { id: 5, fullTitle: 'Employment' },
    { id: 6, fullTitle: 'References' },
    { id: 7, fullTitle: 'Review & Submit' },
];

export default BGVForm;
