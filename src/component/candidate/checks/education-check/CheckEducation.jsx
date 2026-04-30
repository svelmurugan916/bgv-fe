// CheckEducation.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
    Check, GraduationCap, School, Calendar, Hash, Info, SaveIcon, Loader2, CheckIcon, AlertCircle, PaperclipIcon,
    CheckCircle2, X, FileText, Home, ClockIcon, PhoneIcon, Building2Icon, MapPin, TrophyIcon, CalendarDaysIcon
} from 'lucide-react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import {GET_TASK_DETAILS, UPDATE_EDUCATION_CHECK} from "../../../../constant/Endpoint.tsx";
import {METHOD, READ_ONLY_TASK_STATUS} from "../../../../constant/ApplicationConstant.js";
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import VerificationCard from "../common-page/VerificationCard.jsx";
import SingleSelectDropdown from "../../../dropdown/SingleSelectDropdown.jsx";
import UploadedDocumentsDisplay from "../common-page/UploadedDocumentsDisplay.jsx";
import FileUploadModal from "../FileUploadModal.jsx";
import {MajorDiscrepancyDetectedInliner, CertificateProvideLaterInliner} from "../../HelperComponent.jsx";
import {formatDate} from "date-fns";
import CandidateClaimedOverview from "./CandidateClaimedOverview.jsx";

const CheckEducation = ({ educationId }) => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [discrepancyReason, setDiscrepancyReason] = useState('');
    // --- NEW: VERIFICATION REMARK STATE ---
    const [verificationRemark, setVerificationRemark] = useState('');

    const { authenticatedRequest } = useAuthApi();
    const [educationalData, setEducationalData] = useState({});
    const [findings, setFindings] = useState({});
    const [verificationMethod, setVerificationMethod] = useState(null);
    const componentInitRef = useRef(false);
    const [status, setStatus] = useState(undefined);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isMajorDiscrepancy, setIsMajorDiscrepancy] = useState(false);
    const [candidateClaimedDetails, setCandidateClaimedDetails] = useState({});

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

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
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${educationId}?taskType=education`, METHOD.GET);
            if (response.status === 200) {
                const data = response.data;
                setEducationalData(data);
                setCandidateClaimedDetails(data?.candidateClaimedDetails);
                setUploadedDocuments(data?.uploadedDocuments);
                setStatus(data?.status);

                // --- UPDATE: POPULATE VERIFICATION REMARK FROM API ---
                setVerificationRemark(data.verificationRemark || "");
                setIsMajorDiscrepancy(data.isFake || false);

                const initialFindings = {};
                if (data.fieldDetails) {
                    Object.keys(data.fieldDetails).forEach(key => {
                        const fieldInfo = data.fieldDetails[key];
                        const status = fieldInfo.status ? fieldInfo.status.toLowerCase() : 'pending';
                        initialFindings[key] = {
                            status: status,
                            value: status !== 'pending' ?  fieldInfo.verifiedEnteredData || fieldInfo.candidateEnteredData || '' : '',
                            sourceLink: fieldInfo.sourceLink || ''
                        };
                    });
                }
                setVerificationMethod(data.verificationMethod);
                setFindings(initialFindings);
                setDiscrepancyReason(data.discrepancyReason || "");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
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
            else if ((finding.status === 'incorrect' || finding.status === 'negative')) {
                if (!finding.value?.trim()) {
                    newErrors[key] = "Update required";
                    isValid = false;
                }
            }
        });

        if(!verificationMethod?.trim()) {
            newErrors['verificationMethod'] = true;
            isValid = false;
        }

        if (hasNegativeFindings && !discrepancyReason.trim()) {
            newErrors['discrepancyReason'] = true;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveVerification = async () => {
        if(isReadOnly) return;
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
                    sourceLink: findings[key].sourceLink,
                    remarks: `Verified on ${new Date().toLocaleDateString()}`
                };
                return acc;
            }, {}),
            verificationMethod: verificationMethod,
            // --- UPDATE: SEND VERIFICATION REMARK IN API ---
            verificationRemark: verificationRemark,
            overallComments: "Manual audit of credentials completed.",
            isFake: isMajorDiscrepancy,
            discrepancyReason: hasNegativeFindings ? discrepancyReason : ""
        };

        try {
            const response = await authenticatedRequest(payload, `${UPDATE_EDUCATION_CHECK}/${educationId}`, METHOD.PUT);
            if (response.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                fetchEducationalDetails();
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

    const handleUpdateFinding = (field, updatesObj) => {
        if(isReadOnly) return;
        if (errors[field] && (updatesObj.status !== undefined || updatesObj.value !== undefined)) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }

        setFindings(prev => {
            const currentFinding = prev[field];
            const newFinding = { ...currentFinding, ...updatesObj };

            if (updatesObj.status === 'match') {
                newFinding.value = educationalData?.fieldDetails[field].candidateEnteredData;
            } else if (updatesObj.status === 'incorrect' || updatesObj.status === 'negative') {
                if (!updatesObj.value && newFinding.value === educationalData?.fieldDetails[field].candidateEnteredData) {
                    newFinding.value = educationalData?.fieldDetails[field].candidateEnteredData;
                }
            }

            return {
                ...prev,
                [field]: newFinding
            };
        });
    };

    const onSuccessFileUpload = (data) => {
        setUploadedDocuments(prevState => {
            return [...prevState, data];
        });
    }

    const onRemoveFile = (id) => {
        setUploadedDocuments(prevState => {
            return prevState.filter(f => f.fileId !== id);
        });
    }

    const verificationMethods = [
        { value: 'ONLINE_VERIFICATION', text: 'Online verification' },
        { value: 'EMAIL_VERIFICATION', text: 'Email Verification' },
        { value: 'VERBAL_VERIFICATION', text: 'Verbal Verification' },
        { value: 'SITE_VERIFICATION', text: 'Site Verification' },
        { value: 'OTHER', text: 'Other' },
    ];

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    const isReadOnly = READ_ONLY_TASK_STATUS?.includes(status?.toUpperCase());

    console.log("educationalData status: ", educationalData.status)

    return (
        <BaseCheckLayout
            title="Academic Verification"
            description="Primary source verification of academic transcripts against candidate claims."
            checkId={educationId}
            onStatusUpdateSuccess={fetchEducationalDetails}
        >
            <div className="mx-auto p-10 pt-6 space-y-8">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg"><GraduationCap size={14} className="text-[#5D4591]"/></div>
                    Educational Overview
                </h3>
                <CandidateClaimedOverview candidateClaimedDetails={candidateClaimedDetails} />

                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg"><CheckIcon size={14} className="text-[#5D4591]"/></div>
                    Verification Panel
                </h3>

                {educationalData?.certificateProvideLater && (!READ_ONLY_TASK_STATUS.includes(educationalData.status)) &&
                    <CertificateProvideLaterInliner message={"Educational Certificate will be provided later"} />
                }

                {isMajorDiscrepancy && <MajorDiscrepancyDetectedInliner />}

                <div className="space-y-3">
                    {educationalData?.fieldDetails && Object.entries(educationalData.fieldDetails).map(([key, data]) => {
                        return (
                            <VerificationCard
                                key={key}
                                field={key}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                provided={data.candidateEnteredData}
                                candidateEnteredData={data.candidateEnteredData}
                                finding={findings[key] || { status: 'pending', value: '', verificationMethod: '', sourceLink: '' }}
                                onUpdate={handleUpdateFinding}
                                error={errors[key]}
                                icon={fieldIcons[key] || <Info size={18} />}
                                readonly={isReadOnly}
                            />
                        );
                    })}
                </div>

                <div className="grid grid-cols-16 items-center gap-4">
                    <div className="col-span-4 flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-1">Method</span>
                        <SingleSelectDropdown label={"Verification Method"}
                                              options={verificationMethods}
                                              isOccupyFullWidth={true}
                                              disabled={isReadOnly}
                                              selected={verificationMethod || ''}
                                              onSelect={setVerificationMethod}
                                              error={errors.verificationMethod}
                        />
                    </div>
                </div>

                {hasNegativeFindings && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 p-6 bg-rose-50/50 border border-rose-100 rounded-[2rem]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-rose-600">
                                <AlertCircle size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Discrepancy Action Center</span>
                            </div>

                            {/* THE FAKE CHECKBOX */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-rose-600 transition-colors">
                                    Mark as Fraudulent / Fake Document
                                </span>
                                <div
                                    onClick={() => !isReadOnly && setIsMajorDiscrepancy(!isMajorDiscrepancy)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${isMajorDiscrepancy ? 'bg-rose-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isMajorDiscrepancy ? 'left-7' : 'left-1'}`} />
                                </div>
                            </label>
                        </div>

                        <textarea
                            disabled={isReadOnly}
                            value={discrepancyReason}
                            onChange={(e) => setDiscrepancyReason(e.target.value)}
                            placeholder="Describe the discrepancy in detail (e.g., Degree mill detected, Forged signature)..."
                            className="w-full min-h-[100px] bg-white border border-rose-200 rounded-[20px] p-5 text-sm font-medium outline-none resize-none focus:ring-4 focus:ring-rose-500/5"
                        />
                    </div>
                )}

                {/* --- NEW: VERIFICATION REMARK FIELD --- */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <FileText size={16} className="text-[#5D4591]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verification Remark</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase ml-auto">(Optional - Appears on Final Report)</span>
                    </div>
                    <textarea
                        disabled={isReadOnly}
                        value={verificationRemark}
                        onChange={(e) => setVerificationRemark(e.target.value)}
                        placeholder="Enter the official verification statement for the client..."
                        className="w-full min-h-[100px] bg-white border border-slate-200 rounded-[20px] p-5 text-sm font-medium transition-all outline-none resize-none focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/5"
                    />
                </div>

                {
                    !isReadOnly && (
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
                    )
                }

                <UploadedDocumentsDisplay documents={uploadedDocuments} setIsUploadModalOpen={setIsUploadModalOpen} onRemoveFile={onRemoveFile} type={"education"} taskId={educationId} isReadOnly={isReadOnly} />

                <FileUploadModal
                    taskId={educationId}
                    isOpen={isUploadModalOpen && !isReadOnly}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUploadComplete={() => showNotification("All files uploaded successfully!")}
                    onSuccessFileUpload={onSuccessFileUpload}
                    uploadType={"candidatedocument"}
                    type={"education"}
                />

                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-500 ease-out ${
                    toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
                }`}>
                    <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border ${
                        toast.type === 'success' ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-900 border-rose-500/30'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                                {toast.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={20} /> : <AlertCircle className="text-rose-400" size={20} />}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{toast.type === 'success' ? 'System Success' : 'System Error'}</p>
                                <p className="text-sm font-medium text-white">{toast.message}</p>
                            </div>
                        </div>
                        <button onClick={() => setToast({ ...toast, show: false })} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"><X size={18} /></button>
                    </div>
                </div>
            </div>
        </BaseCheckLayout>
    );
};

export default CheckEducation;
