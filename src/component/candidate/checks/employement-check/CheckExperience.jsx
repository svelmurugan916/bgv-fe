import React, { useEffect, useRef, useState } from 'react';
import {
    Briefcase, Building, User, Mail, Phone, Calendar, Hash, Check, SaveIcon, Loader2, CheckIcon, AlertCircle, FileText, MessageSquare // Added MessageSquare icon
} from 'lucide-react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import {GET_TASK_DETAILS, UPDATE_EMPLOYMENT_CHECK} from "../../../../constant/Endpoint.tsx";
import { METHOD } from "../../../../constant/ApplicationConstant.js";
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import VerificationCard from "../common-page/VerificationCard.jsx";
import SingleSelectDropdown from "../../../dropdown/SingleSelectDropdown.jsx";
import UploadedDocumentsDisplay from "../common-page/UploadedDocumentsDisplay.jsx"; // Import the new component

const CheckExperience = ({ employmentId }) => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [discrepancyReason, setDiscrepancyReason] = useState('');
    const { authenticatedRequest } = useAuthApi();
    const [employmentData, setEmploymentData] = useState({});
    const [findings, setFindings] = useState({});
    const componentInitRef = useRef(false);
    const [verificationMethod, setVerificationMethod] = useState(null);

    const hasNegativeFindings = Object.values(findings).some(f => f.status === 'negative');

    const fieldIcons = {
        companyName: <Building size={18} />,
        designation: <Briefcase size={18} />,
        joiningDate: <Calendar size={18} />,
        relievedDate: <Calendar size={18} />,
        reasonForExiting: <MessageSquare size={18} />, // NEW: Icon for Reason for Exiting
        employeeId: <Hash size={18} />,
        managerName: <User size={18} />,
        managerEmail: <Mail size={18} />,
        managerContact: <Phone size={18} />,
    };

    const fieldTypes = {
        joiningDate: 'date',
        relievedDate: 'date',
        reasonForExiting: 'textarea', // NEW: Field type for multi-line text
        managerEmail: 'email',
        managerContact: 'tel',
    };

    const fetchEmploymentDetails = async () => {
        setLoading(true);
        try {
            // In a real application, you would make an actual API call here
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${employmentId}?taskType=employment`, METHOD.GET);
            if (response.status === 200) {
                const data = response.data;
                setEmploymentData(data);
                const initialFindings = {};
                if (data.fieldDetails) {
                    Object.keys(data.fieldDetails).forEach(key => {
                        const fieldInfo = data.fieldDetails[key];
                        const status = fieldInfo?.status ? fieldInfo.status.toLowerCase() : 'pending';
                        initialFindings[key] = {
                            status: status,
                            value: status !== 'pending' ? fieldInfo.verifiedValue || fieldInfo.candidateEnteredData || '' : '',
                            verificationMethod: fieldInfo.verificationMethod || '',
                            sourceLink: fieldInfo.sourceLink || ''
                        };
                    });
                }
                setFindings(initialFindings);
                setDiscrepancyReason(data.discrepancyReason || "");
                setVerificationMethod(data?.verificationMethod || "");
            }
        } catch (err) {
            console.error(err);
        } finally {
            // --- Using mockData for demonstration ---
            // In a real application, remove these lines and rely on the API response.
            // setEmploymentData(mockData);
            // setVerificationMethod(mockData?.verificationMethod || "");
            //
            // const initialFindingsFromMock = {};
            // if (mockData.fieldDetails) {
            //     Object.keys(mockData.fieldDetails).forEach(key => {
            //         const fieldInfo = mockData.fieldDetails[key];
            //         const status = fieldInfo.status ? fieldInfo.status.toLowerCase() : 'pending';
            //         initialFindingsFromMock[key] = {
            //             status: status,
            //             value: status !== 'pending' ? fieldInfo.verifiedValue || fieldInfo.candidateEnteredData || '' : '',
            //             verificationMethod: fieldInfo.verificationMethod || '',
            //             sourceLink: fieldInfo.sourceLink || ''
            //         };
            //     });
            // }
            // setFindings(initialFindingsFromMock);
            // setDiscrepancyReason(mockData.discrepancyReason || "");
            // --- End mockData usage ---

            setLoading(false);
        }
    };

    const validateFindings = () => {
        const newErrors = {};
        let isValid = true;

        // Define mandatory employment fields
        const mandatoryFields = [
            'companyName', 'designation', 'joiningDate', 'relievedDate', 'reasonForExiting', // NEW: Reason for Exiting is mandatory
            'employeeId', 'managerName', 'managerEmail', 'managerContact' // Manager POC is mandatory
        ];

        Object.keys(findings).forEach(key => {
            const finding = findings[key];
            const isMandatory = mandatoryFields.includes(key);

            if (isMandatory && finding.status === 'pending') {
                newErrors[key] = "Selection required";
                isValid = false;
            }
            // If status is incorrect or negative, value, method, and source link become mandatory
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
            // If status is match, method and source link are still required
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

        if (!verificationMethod?.trim()) {
            newErrors['verificationMethod'] = true;
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
                    remarks: `Verified on ${new Date().toLocaleDateString()}` // Placeholder for per-attribute notes
                };
                return acc;
            }, {}),
            overallComments: "Manual audit of employment credentials completed.",
            isFake: hasNegativeFindings,
            discrepancyReason: hasNegativeFindings ? discrepancyReason : "",
            verificationMethod: verificationMethod, // Overall verification method
        };

        try {
            const response = await authenticatedRequest(payload, `${UPDATE_EMPLOYMENT_CHECK}/${employmentId}`, METHOD.PUT);
            if (response.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                fetchEmploymentDetails(); // Re-fetch to ensure UI is in sync
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
            fetchEmploymentDetails();
        }
    }, [employmentId]);

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
                newFinding.value = employmentData?.fieldDetails[field].candidateEnteredData;
            } else if (updatesObj.status === 'incorrect' || updatesObj.status === 'negative') {
                if (!updatesObj.value && newFinding.value === employmentData?.fieldDetails[field].candidateEnteredData) {
                    newFinding.value = employmentData?.fieldDetails[field].candidateEnteredData;
                }
            }

            return {
                ...prev,
                [field]: newFinding
            };
        });
    };

    // Options for Verification Method dropdown (made generic for reuse)
    const verificationMethods = [
        { value: 'HR_PHONE', text: 'HR Dept. (Phone)' },
        { value: 'HR_EMAIL', text: 'HR Dept. (Email)' },
        { value: 'AUTOMATED_SERVICE', text: 'Automated Service' },
        { value: 'SUPERVISOR_CONTACT', text: 'Supervisor Contact' },
        { value: 'CANDIDATE_DOCUMENT', text: 'Candidate Document' },
        { value: 'THIRD_PARTY_VENDOR', text: 'Third-Party Vendor' },
        { value: 'OTHER', text: 'Other' },
    ];


    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    return (
        <BaseCheckLayout
            title="Employment Verification"
            description="Primary source verification of employment against candidate claims."
            checkId={employmentId}
        >
            <div className="mx-auto p-10 pt-6 space-y-8">

                {employmentData?.provideCertificateLater && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-700 px-6 py-4 rounded-[2rem] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <p className="text-sm font-semibold">
                            Candidate has indicated that the **Employment Certificate will be provided later**. Verification may be pending until documentation is received.
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {employmentData?.fieldDetails && Object.entries(employmentData.fieldDetails).map(([key, data]) => {
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
                                icon={fieldIcons[key] || <Briefcase size={18} />}
                                fieldType={fieldTypes[key]}
                            />
                        );
                    })}
                </div>

                <div className="grid grid-cols-16 items-center gap-4">
                    <div className="col-span-4 flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-1">Overall Verification Method</span>
                        <SingleSelectDropdown label={"Verification Method"}
                                              options={verificationMethods}
                                              isOccupyFullWidth={true}
                                              selected={verificationMethod || ''}
                                              onSelect={setVerificationMethod}
                                              error={errors['verificationMethod']}
                        />
                    </div>
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

                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
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
                {/* NEW: Uploaded Documents Section using the new component */}
                {employmentData?.uploadedDocuments && employmentData.uploadedDocuments.length > 0 && (
                    <UploadedDocumentsDisplay documents={employmentData.uploadedDocuments} />
                )}

                {/* Existing HR / Manager Point of Contact Card */}
                <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 flex items-center gap-2 mb-2">
                        <Briefcase size={16} className="text-[#5D4591]" />
                        <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">HR / Manager Point of Contact</h4>
                        {
                            employmentData?.hrDetails?.isDoNotDisturb && (
                                <span className="flex items-center gap-1.5 text-[11px] text-rose-600 font-black bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 animate-pulse">
                                    <AlertCircle size={12} strokeWidth={3} />
                                    Do not Disturb
                                </span>
                            )
                        }
                    </div>
                    <HRInfo label="HR Name" value={employmentData?.hrDetails?.name} />
                    <HRInfo label="HR Email" value={employmentData?.hrDetails?.email} />
                    <HRInfo label="HR Contact" value={employmentData?.hrDetails?.phone} />
                </div>
            </div>
        </BaseCheckLayout>
    );
};

const HRInfo = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-bold text-[#8B78B4] uppercase">{label}</p>
        <p className="text-sm font-bold text-[#241B3B]">{value}</p>
    </div>
);

export default CheckExperience;
