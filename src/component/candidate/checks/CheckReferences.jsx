// CheckReference.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
    User, Briefcase, Mail, Phone, Calendar, Building, Check, SaveIcon, Loader2, CheckIcon, AlertCircle, MessageSquare, Clock
} from 'lucide-react'; // Added Clock icon
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { UPDATE_REFERENCE_CHECK } from "../../../constant/Endpoint.tsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
import SimpleLoader from "../../common/SimpleLoader.jsx";
import SingleSelectDropdown from "../../dropdown/SingleSelectDropdown.jsx";
import BaseCheckLayout from "./base-check-layout/BaseCheckLayout.jsx";
import VerificationCard from "./common-page/VerificationCard.jsx";
import {formatFullDateTime} from "../../../utils/date-util.js";

const CheckReference = ({ taskId }) => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [discrepancyReason, setDiscrepancyReason] = useState('');
    const [verifierOverallNotes, setVerifierOverallNotes] = useState(''); // NEW state for overall notes
    const { authenticatedRequest } = useAuthApi();
    const [referenceData, setReferenceData] = useState({});
    const [findings, setFindings] = useState({});
    const componentInitRef = useRef(false);
    const [overallVerificationMethod, setOverallVerificationMethod] = useState(null);

    const hasNegativeFindings = Object.values(findings).some(f => f.status === 'negative');

    const fieldIcons = {
        referenceName: <User size={18} />,
        referenceTitle: <Briefcase size={18} />,
        referenceCompany: <Building size={18} />,
        referenceEmail: <Mail size={18} />,
        referencePhone: <Phone size={18} />,
        referenceRelationship: <User size={18} />,
        periodOfObservationStart: <Calendar size={18} />,
        periodOfObservationEnd: <Calendar size={18} />,
        // Add more icons for other potential reference fields if needed
    };

    const fieldTypes = {
        referenceEmail: 'email',
        referencePhone: 'tel',
        periodOfObservationStart: 'date',
        periodOfObservationEnd: 'date',
    };

    // --- UPDATED MOCK DATA ---
    const mockData = {
        "id": "ref_123",
        "candidateId": "cand_67890",
        "checkType": "REFERENCE",
        "overallStatus": "RESPONDED_COMPLETE", // PENDING, RESPONDED_COMPLETE, RESPONDED_INCOMPLETE, NOT_REACHABLE, REFUSED_TO_RESPOND, INVALID_CONTACT
        "discrepancyReason": "",
        "overallVerificationMethod": "QUESTIONNAIRE", // QUESTIONNAIRE, PHONE_CALL, EMAIL_CONFIRMATION, OTHER
        "referenceRequestSentDate": "2026-03-01T10:00:00Z", // NEW
        "referenceResponseReceivedDate": "2026-03-05T14:30:00Z", // NEW (Can be null if pending)
        "questionnaireResponseLink": "https://example.com/questionnaire/ref_123_response",
        "questionnaireSummary": "Reference confirmed candidate's employment dates, designation, and praised their teamwork and problem-solving skills. Strongly recommended for future roles, particularly for leadership capabilities.", // NEW
        "verifierOverallNotes": "Initial contact via email was bounced. Successfully reached via phone after 2 attempts. Reference was very positive and cooperative.", // NEW
        "fieldDetails": {
            "referenceName": {
                "candidateEnteredData": "Dr. Robert Fox",
                "verifiedValue": "Dr. Robert Fox",
                "status": "MATCH",
                "verificationMethod": "CANDIDATE_PROVIDED_DATA",
                "sourceLink": ""
            },
            "referenceTitle": {
                "candidateEnteredData": "Professor",
                "verifiedValue": "Professor of Computer Science",
                "status": "INCORRECT", // Small discrepancy
                "verificationMethod": "EMAIL_CONFIRMATION",
                "sourceLink": "mailto:robert.f@univ.edu"
            },
            "referenceCompany": {
                "candidateEnteredData": "University of XYZ",
                "verifiedValue": "XYZ University",
                "status": "INCORRECT",
                "verificationMethod": "OFFICIAL_WEBSITE",
                "sourceLink": "https://www.xyzuniv.edu"
            },
            "referenceEmail": {
                "candidateEnteredData": "robert.f@univ.edu",
                "verifiedValue": "robert.f@univ.edu",
                "status": "MATCH",
                "verificationMethod": "EMAIL_CONFIRMATION",
                "sourceLink": "mailto:robert.f@univ.edu"
            },
            "referencePhone": {
                "candidateEnteredData": "+1 (123) 456-7890",
                "verifiedValue": "+1 (123) 456-7890",
                "status": "MATCH",
                "verificationMethod": "PHONE_CALL",
                "sourceLink": "call_log_ref_123_phone"
            },
            "referenceRelationship": {
                "candidateEnteredData": "Professor (Academic Advisor)",
                "verifiedValue": "Academic Advisor",
                "status": "MATCH",
                "verificationMethod": "QUESTIONNAIRE_RESPONSE",
                "sourceLink": "https://example.com/questionnaire/ref_123_response"
            },
            "periodOfObservationStart": {
                "candidateEnteredData": "2018-09-01",
                "verifiedValue": "2018-09-01",
                "status": "MATCH",
                "verificationMethod": "QUESTIONNAIRE_RESPONSE",
                "sourceLink": "https://example.com/questionnaire/ref_123_response"
            },
            "periodOfObservationEnd": {
                "candidateEnteredData": "2022-05-31",
                "verifiedValue": "2022-05-31",
                "status": "MATCH",
                "verificationMethod": "QUESTIONNAIRE_RESPONSE",
                "sourceLink": "https://example.com/questionnaire/ref_123_response"
            }
        }
    };


    const fetchReferenceDetails = async () => {
        setLoading(true);
        try {
            // In a real application, you would make an actual API call here
            // const response = await authenticatedRequest({}, `${REFERENCE_CHECK_DETAILS}/${taskId}`, METHOD.GET);
            // if (response.status === 200) {
            //     const data = response.data;
            //     setReferenceData(data);
            //     const initialFindings = {};
            //     if (data.fieldDetails) {
            //         Object.keys(data.fieldDetails).forEach(key => {
            //             const fieldInfo = data.fieldDetails[key];
            //             initialFindings[key] = {
            //                 status: fieldInfo.status ? fieldInfo.status.toLowerCase() : 'pending',
            //                 value: fieldInfo.verifiedValue || fieldInfo.candidateEnteredData || '',
            //                 verificationMethod: fieldInfo.verificationMethod || '',
            //                 sourceLink: fieldInfo.sourceLink || ''
            //             };
            //         });
            //     }
            //     setFindings(initialFindings);
            //     setDiscrepancyReason(data.discrepancyReason || "");
            //     setVerifierOverallNotes(data.verifierOverallNotes || ""); // NEW
            //     setOverallVerificationMethod(data?.overallVerificationMethod || "");
            // }
        } catch (err) {
            console.error(err);
        } finally {
            // --- Using mockData for demonstration ---
            setReferenceData(mockData);
            setOverallVerificationMethod(mockData?.overallVerificationMethod || "");
            setVerifierOverallNotes(mockData?.verifierOverallNotes || ""); // Initialize new state

            const initialFindingsFromMock = {};
            if (mockData.fieldDetails) {
                Object.keys(mockData.fieldDetails).forEach(key => {
                    const fieldInfo = mockData.fieldDetails[key];
                    initialFindingsFromMock[key] = {
                        status: fieldInfo.status ? fieldInfo.status.toLowerCase() : 'pending',
                        value: fieldInfo.verifiedValue || fieldInfo.candidateEnteredData || '',
                        verificationMethod: fieldInfo.verificationMethod || '',
                        sourceLink: fieldInfo.sourceLink || ''
                    };
                });
            }
            setFindings(initialFindingsFromMock);
            setDiscrepancyReason(mockData.discrepancyReason || "");
            // --- End mockData usage ---

            setLoading(false);
        }
    };

    const validateFindings = () => {
        const newErrors = {};
        let isValid = true;

        // Define mandatory reference fields
        const mandatoryFields = [
            'referenceName', 'referenceTitle', 'referenceCompany', 'referenceEmail', 'referencePhone',
            'referenceRelationship', 'periodOfObservationStart', 'periodOfObservationEnd'
        ];

        Object.keys(findings).forEach(key => {
            const finding = findings[key];
            const isMandatory = mandatoryFields.includes(key);

            if (isMandatory && finding.status === 'pending') {
                newErrors[key] = "Selection required";
                isValid = false;
            }
            else if ((finding.status === 'incorrect' || finding.status === 'negative')) {
                if (!finding.value?.trim()) {
                    newErrors[key] = "Update required";
                    isValid = false;
                }
                if (!finding.verificationMethod?.trim()) {
                    newErrors[key] = (newErrors[key] ? newErrors[key] + ", " : "") + "Method required";
                    isValid = false;
                }
                if (!finding.sourceLink?.trim()) {
                    newErrors[key] = (newErrors[key] ? newErrors[key] + ", " : "") + "Source required";
                    isValid = false;
                }
            }
            else if (finding.status === 'match') {
                if (!finding.verificationMethod?.trim()) {
                    newErrors[key] = (newErrors[key] ? newErrors[key] + ", " : "") + "Method required";
                    isValid = false;
                }
                if (!finding.sourceLink?.trim()) {
                    newErrors[key] = (newErrors[key] ? newErrors[key] + ", " : "") + "Source required";
                    isValid = false;
                }
            }
        });

        if (hasNegativeFindings && !discrepancyReason.trim()) {
            newErrors['discrepancyReason'] = true;
            isValid = false;
        }

        if (!overallVerificationMethod?.trim()) {
            newErrors['overallVerificationMethod'] = true;
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
                    verificationMethod: findings[key].verificationMethod,
                    sourceLink: findings[key].sourceLink,
                    remarks: `Verified on ${new Date().toLocaleDateString()}`
                };
                return acc;
            }, {}),
            overallComments: "Manual audit of reference completed.", // This might be replaced by verifierOverallNotes
            isFake: hasNegativeFindings,
            discrepancyReason: hasNegativeFindings ? discrepancyReason : "",
            overallVerificationMethod: overallVerificationMethod,
            verifierOverallNotes: verifierOverallNotes // NEW: Include in payload
        };

        try {
            const response = await authenticatedRequest(payload, `${UPDATE_REFERENCE_CHECK}/${taskId}`, METHOD.PUT);
            if (response.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                fetchReferenceDetails(); // Re-fetch to ensure UI is in sync
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
            fetchReferenceDetails();
        }
    }, [taskId]);

    const handleUpdateFinding = (field, updatesObj) => {
        if (errors[field]) {
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
                newFinding.value = referenceData?.fieldDetails[field].candidateEnteredData;
            } else if (updatesObj.status === 'incorrect' || updatesObj.status === 'negative') {
                if (!updatesObj.value && newFinding.value === referenceData?.fieldDetails[field].candidateEnteredData) {
                    newFinding.value = referenceData?.fieldDetails[field].candidateEnteredData;
                }
            }

            return {
                ...prev,
                [field]: newFinding
            };
        });
    };

    // Options for Overall Verification Method dropdown for Reference Check
    const overallVerificationMethods = [
        { value: '', text: 'Select Overall Method' },
        { value: 'QUESTIONNAIRE', text: 'Questionnaire' },
        { value: 'PHONE_CALL', text: 'Phone Call' },
        { value: 'EMAIL_CONFIRMATION', text: 'Email Confirmation' },
        { value: 'DIRECT_CONTACT', text: 'Direct Contact' },
        { value: 'OTHER', text: 'Other' },
    ];

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    return (
        <BaseCheckLayout
            title="Reference Verification"
            description="Detailed verification of a professional reference's provided information."
            checkId={taskId}
        >
            <div className="mx-auto p-10 pt-6 space-y-8">
                {/* Reference Overview Card */}
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#5D4591] rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                            <User size={18} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-800">{referenceData?.fieldDetails?.referenceName?.verifiedValue || referenceData?.fieldDetails?.referenceName?.candidateEnteredData || 'N/A'}</h4>
                            <p className="text-sm text-slate-500">{referenceData?.fieldDetails?.referenceTitle?.verifiedValue || referenceData?.fieldDetails?.referenceTitle?.candidateEnteredData || 'N/A'}</p>
                        </div>
                    </div>
                    {referenceData.overallStatus && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            referenceData.overallStatus === 'RESPONDED_COMPLETE' ? 'bg-emerald-100 text-emerald-600' :
                                referenceData.overallStatus === 'RESPONDED_INCOMPLETE' ? 'bg-amber-100 text-amber-600' :
                                    referenceData.overallStatus === 'PENDING' ? 'bg-blue-100 text-blue-600' :
                                        referenceData.overallStatus === 'NOT_REACHABLE' || referenceData.overallStatus === 'REFUSED_TO_RESPOND' || referenceData.overallStatus === 'INVALID_CONTACT' ? 'bg-rose-100 text-rose-600' :
                                            'bg-slate-100 text-slate-600'
                        }`}>
                            {referenceData.overallStatus.replace(/_/g, ' ')}
                        </span>
                    )}
                </div>

                {/* NEW: Reference Request/Response Timeline */}
                <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#5D4591]" />
                        <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">Verification Timeline</h4>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-bold text-[#8B78B4] uppercase">Request Sent</p>
                            <p className="text-sm font-bold text-[#241B3B]">
                                {referenceData.referenceRequestSentDate ? formatFullDateTime(referenceData.referenceRequestSentDate) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-[#8B78B4] uppercase">Response Received</p>
                            <p className="text-sm font-bold text-[#241B3B]">
                                {referenceData.referenceResponseReceivedDate ? formatFullDateTime(referenceData.referenceResponseReceivedDate) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {referenceData?.fieldDetails && Object.entries(referenceData.fieldDetails).map(([key, data]) => {
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
                                icon={fieldIcons[key] || <MessageSquare size={18} />}
                                fieldType={fieldTypes[key]}
                            />
                        );
                    })}
                </div>

                {/* Overall Verification Method for the Reference */}
                <div className="grid grid-cols-16 items-center gap-4">
                    <div className="col-span-4 flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-1">Overall Verification Method</span>
                        <SingleSelectDropdown label={"Overall Verification Method"}
                                              options={overallVerificationMethods}
                                              isOccupyFullWidth={true}
                                              selected={overallVerificationMethod || ''}
                                              onSelect={setOverallVerificationMethod}
                                              error={errors['overallVerificationMethod']}
                        />
                    </div>
                    {referenceData.overallStatus === 'RESPONDED_COMPLETE' && referenceData.questionnaireResponseLink && (
                        <div className="col-span-4 flex flex-col justify-end">
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-1">Questionnaire Response</span>
                            <a
                                href={referenceData.questionnaireResponseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5D4591] text-white rounded-xl text-sm font-bold hover:bg-[#4a3675] transition-colors"
                            >
                                <Check size={16} /> View Response
                            </a>
                        </div>
                    )}
                </div>

                {/* NEW: Questionnaire Summary */}
                {referenceData.questionnaireSummary && (
                    <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={16} className="text-[#5D4591]" />
                            <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">Questionnaire Summary / Key Findings</h4>
                        </div>
                        <p className="text-sm text-slate-700">{referenceData.questionnaireSummary}</p>
                    </div>
                )}

                {/* NEW: Verifier's Overall Notes */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verifier's Overall Notes</span>
                    </div>
                    <textarea
                        value={verifierOverallNotes}
                        onChange={(e) => setVerifierOverallNotes(e.target.value)}
                        placeholder="Add any general notes or observations about this reference check..."
                        className={`w-full min-h-[100px] bg-white border rounded-[20px] p-5 text-sm font-medium transition-all outline-none resize-none
                            border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/5` }
                    />
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
                                if (errors.discrepancyReason) setErrors(prev => ({ ...prev, discrepancyReason: false }));
                            }}
                            placeholder="Please provide the specific reason for the negative finding..."
                            className={`w-full min-h-[100px] bg-white border rounded-[20px] p-5 text-sm font-medium transition-all outline-none resize-none
                                ${errors.discrepancyReason ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/5'}` }
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

export default CheckReference;
