import React, { useEffect, useRef, useState } from 'react';
import {
    Check, GraduationCap, School, Calendar, Hash, Info, SaveIcon, Loader2, CheckIcon, AlertCircle
} from 'lucide-react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import {EDUCATION_CHECK_DETAILS, UPDATE_EDUCATION_CHECK} from "../../../../constant/Endpoint.tsx";
import { METHOD } from "../../../../constant/ApplicationConstant.js";
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import VerificationCard from "./VerificationCard.jsx";

const CheckEducation = ({ educationId }) => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [discrepancyReason, setDiscrepancyReason] = useState('');
    const { authenticatedRequest } = useAuthApi();
    const [educationalData, setEducationalData] = useState({});
    const [findings, setFindings] = useState({});
    const componentInitRef = useRef(false);

    const hasNegativeFindings = Object.values(findings).some(f => f.status === 'negative');

    const fieldIcons = {
        universityName: <School size={18} />,
        instituteName: <School size={18} />,
        degree: <GraduationCap size={18} />,
        rollNumber: <Hash size={18} />,
        educationLevel: <GraduationCap size={18} />,
        yearOfPassing: <Calendar size={18} />,
        gpaOrPercentage: <Hash size={18} />
    };

    const fetchEducationalDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${EDUCATION_CHECK_DETAILS}/${educationId}`, METHOD.GET);
            if (response.status === 200) {
                const data = response.data;
                setEducationalData(data);

                const initialFindings = {};
                if (data.fieldDetails) {
                    Object.keys(data.fieldDetails).forEach(key => {
                        const fieldInfo = data.fieldDetails[key];
                        initialFindings[key] = {
                            status: fieldInfo.status ? fieldInfo.status.toLowerCase() : 'pending',
                            value: fieldInfo.verifiedEnteredData || ''
                        };
                    });
                }

                setFindings(initialFindings);
                setDiscrepancyReason(data.discrepancyReason || "");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const validateFindings = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(findings).forEach(key => {
            const finding = findings[key];
            if (finding.status === 'pending') {
                newErrors[key] = "Selection required";
                isValid = false;
            }
            else if ((finding.status === 'incorrect' || finding.status === 'negative') && !finding.value?.trim()) {
                newErrors[key] = "Update required";
                isValid = false;
            }
        });

        if (hasNegativeFindings && !discrepancyReason.trim()) {
            newErrors['discrepancyReason'] = true;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveVerification = async () => {
        if (!validateFindings()) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
            return;
        }

        setIsSaving(true);
        setSaveStatus(null);

        const payload = {
            details: Object.keys(findings).reduce((acc, key) => {
                acc[key] = {
                    status: findings[key].status.toUpperCase(),
                    verifiedValue: findings[key].value,
                    remarks: `Verified on ${new Date().toLocaleDateString()}`
                };
                return acc;
            }, {}),
            overallComments: "Manual audit of credentials completed.",
            isFake: hasNegativeFindings,
            discrepancyReason: hasNegativeFindings ? discrepancyReason : ""
        };

        try {
            const response = await authenticatedRequest(payload, `${UPDATE_EDUCATION_CHECK}/${educationId}`, METHOD.PUT);
            if (response.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            console.log(err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchEducationalDetails();
        }
    }, [educationId]);

    const handleUpdateFinding = (field, status, value = '') => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }

        setFindings(prev => ({
            ...prev,
            [field]: {
                status: status,
                value: status === 'match' ? educationalData?.fieldDetails[field].candidateEnteredData : value
            }
        }));
    };

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    return (
        <BaseCheckLayout
            title="Academic Verification"
            description="Primary source verification of academic transcripts against candidate claims."
            checkId={educationId}
        >
            <div className="max-w-6xl mx-auto p-10 pt-6 space-y-8">
                <div className="space-y-3">
                    {educationalData?.fieldDetails && Object.entries(educationalData.fieldDetails).map(([key, data]) => {
                        return (
                            <VerificationCard
                                key={key}
                                field={key}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                provided={data.candidateEnteredData}
                                icon={fieldIcons[key] || <Info size={18} />}
                                finding={findings[key] || { status: 'pending', value: '' }}
                                onUpdate={handleUpdateFinding}
                                error={errors[key]}
                            />
                        );
                    })}
                </div>

                {hasNegativeFindings && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
                        <div className="flex items-center gap-2 text-rose-600 mb-1">
                            <AlertCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Discrepancy Detected</span>
                        </div>
                        <textarea
                            value={discrepancyReason}
                            onChange={(e) => {
                                setDiscrepancyReason(e.target.value);
                                if(errors.discrepancyReason) setErrors(prev => ({...prev, discrepancyReason: false}));
                            }}
                            placeholder="Please provide the specific reason for the negative finding..."
                            className={`w-full min-h-[100px] bg-white border rounded-[20px] p-5 text-sm font-medium transition-all outline-none resize-none
                                ${errors.discrepancyReason ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/5'}`}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        {saveStatus === 'success' && (
                            <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-2">
                                <Check size={18} className="bg-emerald-100 rounded-full p-0.5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Verification Saved Successfully</span>
                            </div>
                        )}
                        {(saveStatus === 'error' || Object.keys(errors).length > 0) && (
                            <div className="flex items-center gap-2 text-rose-600 animate-in shake">
                                <AlertCircle size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {Object.keys(errors).length > 0 ? "Complete all fields before saving" : "Failed to save changes"}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSaveVerification}
                        disabled={isSaving}
                        className={`
                            flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300
                            ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                            saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] hover:shadow-xl hover:shadow-[#5D4591]/30 hover:-translate-y-0.5 active:scale-95'}
                        `}
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveStatus === 'success' ? <CheckIcon size={18} /> : <SaveIcon size={18} />}
                        <span className="uppercase tracking-widest">
                            {isSaving ? 'Saving Audit...' : saveStatus === 'success' ? 'Audit Updated' : 'Submit Verification'}
                        </span>
                    </button>
                </div>
            </div>
        </BaseCheckLayout>
    );
};

export default CheckEducation;
