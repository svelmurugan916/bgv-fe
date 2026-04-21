import React, { useEffect, useRef, useState } from 'react';
import {
    Briefcase, Building, User, Mail, Phone, Calendar, Hash, Check, SaveIcon,
    Loader2, CheckIcon, AlertCircle, MessageSquare, CheckCircle2, X,
    DollarSign, UserCheck, Clock, LogOut, ThumbsUp, ShieldCheck, IndianRupeeIcon, AlertTriangle
} from 'lucide-react';
import BaseCheckLayout from "../base-check-layout/BaseCheckLayout.jsx";
import {GET_TASK_DETAILS, UPDATE_EMPLOYMENT_CHECK} from "../../../../constant/Endpoint.tsx";
import {METHOD, READ_ONLY_TASK_STATUS} from "../../../../constant/ApplicationConstant.js";
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import SimpleLoader from "../../../common/SimpleLoader.jsx";
import VerificationCard from "../common-page/VerificationCard.jsx";
import SingleSelectDropdown from "../../../dropdown/SingleSelectDropdown.jsx";
import UploadedDocumentsDisplay from "../common-page/UploadedDocumentsDisplay.jsx";
import FileUploadModal from "../FileUploadModal.jsx";
import SendHRMailModal from "./SendHRMailModal.jsx";
import MailHistoryModal from "../MailHistoryModal.jsx";
import {MajorDiscrepancyDetectedInliner, CertificateProvideLaterInliner} from "../../HelperComponent.jsx";

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
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isMajorDiscrepancy, setIsMajorDiscrepancy] = useState(false);
    const [verificationRemark, setVerificationRemark] = useState('');
    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const [verifierName, setVerifierName] = useState('');
    const [verifierEmail, setVerifierEmail] = useState('');
    const [verifierContactNumber, setVerifierContactNumber] = useState('');
    const [verificationTimestamp, setVerificationTimestamp] = useState(new Date().toISOString().split('T')[0]);
    const [exitMode, setExitMode] = useState('');
    const [eligibleForRehire, setEligibleForRehire] = useState(false);
    const [detailedExitReason, setDetailedExitReason] = useState('');
    const [remarksFromHr, setRemarksFromHr] = useState('');
    const [verifiedLastDrawnSalary, setVerifiedLastDrawnSalary] = useState('');
    const [isTenureMismatch, setIsTenureMismatch] = useState(false);
    const [isDesignationMismatch, setIsDesignationMismatch] = useState(false);

    const isCurrentEmployer = employmentData?.currentEmployer || false;
    const hasNegativeFindings = Object.values(findings).some(f => f.status === 'negative');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const exitModeOptions = [
        { value: 'RESIGNED', text: 'RESIGNED' },
        { value: 'TERMINATED', text: 'TERMINATED' },
        { value: 'ABSCONDED', text: 'ABSCONDED' },
        { value: 'ASKED_TO_LEAVE', text: 'ASKED TO LEAVE' },
        { value: 'LAYOFF', text: 'LAYOFF' },
        { value: 'RETIRED', text: 'RETIRED' },
        { value: 'INTERNSHIP_ENDED', text: 'INTERNSHIP ENDED' },
        { value: 'CONTRACT_ENDED', text: 'CONTRACT ENDED' },
    ];

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const fieldIcons = {
        companyName: <Building size={18} />,
        designation: <Briefcase size={18} />,
        joiningDate: <Calendar size={18} />,
        relievedDate: <Calendar size={18} />,
        reasonForExiting: <MessageSquare size={18} />,
        employeeId: <Hash size={18} />,
        managerName: <User size={18} />,
        managerEmail: <Mail size={18} />,
        managerContact: <Phone size={18} />,
    };

    const fieldTypes = {
        joiningDate: 'date',
        relievedDate: 'date',
        reasonForExiting: 'textarea',
        managerEmail: 'email',
        managerContact: 'tel',
    };

    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchEmploymentDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${employmentId}?taskType=employment`, METHOD.GET);
            if (response.status === 200) {
                const data = response.data;
                setEmploymentData(data);
                setUploadedDocuments(data?.uploadedDocuments || []);
                setIsMajorDiscrepancy(data.isFake || false);
                setVerificationRemark(data.verificationRemark || "");
                setDiscrepancyReason(data.discrepancyReason || "");
                setVerificationMethod(data?.verificationMethod || "");

                setVerifierName(data.verifierName || "");
                setVerifierEmail(data.verifierEmail || "");
                setVerifierContactNumber(data.verifierContactNumber || "");
                setVerificationTimestamp(data.verificationTimestamp?.split('T')[0] || new Date().toISOString().split('T')[0]);
                setExitMode(data.exitMode || "");
                setEligibleForRehire(data.eligibleForRehire || false);
                setDetailedExitReason(data.detailedExitReason || "");
                setRemarksFromHr(data.remarksFromHr || "");
                setVerifiedLastDrawnSalary(data.verifiedLastDrawnSalary || "");
                setIsTenureMismatch(data.isTenureMismatch || false);
                setIsDesignationMismatch(data.isDesignationMismatch || false);

                const initialFindings = {};
                if (data.fieldDetails) {
                    Object.keys(data.fieldDetails).forEach(key => {
                        const fieldInfo = data.fieldDetails[key];
                        const status = fieldInfo?.status ? fieldInfo.status.toLowerCase() : 'pending';
                        initialFindings[key] = {
                            status: status,
                            value: status !== 'pending' ? fieldInfo.verifiedValue || fieldInfo.candidateEnteredData || '' : '',
                            sourceLink: fieldInfo.sourceLink || ''
                        };
                    });
                }
                setFindings(initialFindings);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onSuccessFileUpload = (data) => {
        setUploadedDocuments(prevState => [...prevState, data]);
    }

    const onRemoveFile = (id) => {
        setUploadedDocuments(prevState => prevState.filter(f => f.fileId !== id));
    }

    const validateFindings = () => {
        const newErrors = {};
        let isValid = true;

        const mandatoryFields = [
            'companyName', 'designation', 'joiningDate', 'relievedDate', 'reasonForExiting',
            'employeeId', 'managerName', 'managerEmail', 'managerContact'
        ];

        Object.keys(findings).forEach(key => {
            const finding = findings[key];
            if (mandatoryFields.includes(key) && finding.status === 'pending') {
                // Relieved date and reason for exiting are not mandatory for current employer
                if (isCurrentEmployer && (key === 'relievedDate' || key === 'reasonForExiting')) return;

                newErrors[key] = "Selection required";
                isValid = false;
            } else if ((finding.status === 'incorrect' || finding.status === 'negative') && !finding.value?.trim()) {
                newErrors[key] = "Update required";
                isValid = false;
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

        if (!verifierName.trim()) { newErrors['verifierName'] = true; isValid = false; }

        // Exit mode only mandatory if NOT current employer
        if (!isCurrentEmployer && !exitMode.trim()) { newErrors['exitMode'] = true; isValid = false; }

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
            overallComments: "Manual audit of employment credentials completed.",
            isFake: isMajorDiscrepancy,
            verificationRemark: verificationRemark,
            discrepancyReason: hasNegativeFindings ? discrepancyReason : "",
            verificationMethod: verificationMethod,
            verifierName,
            verifierEmail,
            verifierContactNumber,
            verificationTimestamp,
            exitMode: isCurrentEmployer ? "" : exitMode,
            eligibleForRehire: isCurrentEmployer ? false : eligibleForRehire,
            detailedExitReason: isCurrentEmployer ? "" : detailedExitReason,
            remarksFromHr,
            verifiedLastDrawnSalary,
            isTenureMismatch,
            isDesignationMismatch
        };

        try {
            const response = await authenticatedRequest(payload, `${UPDATE_EMPLOYMENT_CHECK}/${employmentId}`, METHOD.PUT);
            if (response.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                fetchEmploymentDetails();
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
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
        setFindings(prev => ({ ...prev, [field]: { ...prev[field], ...updatesObj } }));
    };

    const updateHRVerificationMailDetails = () => {
        setEmploymentData((prevState => {
            return {...prevState,
                verificationMailSentToHR: true,
                verificationMailSentAt: new Date(),
                verificationMailSentCount: (prevState.verificationMailSentCount || 0) + 1,
            }
        }))
        setIsMailModalOpen(false);
    }

    const verificationMethods = [
        { value: 'HR_PHONE', text: 'HR Dept. (Phone)' },
        { value: 'HR_EMAIL', text: 'HR Dept. (Email)' },
        { value: 'AUTOMATED_SERVICE', text: 'Automated Service' },
        { value: 'SUPERVISOR_CONTACT', text: 'Supervisor Contact' },
        { value: 'CANDIDATE_DOCUMENT', text: 'Candidate Document' },
        { value: 'THIRD_PARTY_VENDOR', text: 'Third-Party Vendor' },
        { value: 'OTHER', text: 'Other' },
    ];
    const isReadOnly = READ_ONLY_TASK_STATUS?.includes(employmentData?.status?.toUpperCase());

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    return (
        <BaseCheckLayout
            title="Employment Verification"
            description="Primary source verification of employment against candidate claims."
            checkId={employmentId}
            onStatusUpdateSuccess={fetchEmploymentDetails}
        >
            <div className="mx-auto p-10 pt-6 space-y-8">

                {employmentData?.certificateProvideLater && (!READ_ONLY_TASK_STATUS.includes(employmentData.status)) &&
                    <CertificateProvideLaterInliner message={"Employment Certificate will be provided later"} />
                }

                {isMajorDiscrepancy && <MajorDiscrepancyDetectedInliner />}

                <div className="space-y-3">
                    {employmentData?.fieldDetails && Object.entries(employmentData.fieldDetails).map(([key, data]) => (
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
                            readonly={isReadOnly}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Verifier Identity Card */}
                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-5">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <UserCheck className="text-[#5D4591]" size={20} />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Verifier Identity</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <span className="text-[9px] font-black uppercase text-slate-400 ml-1">Verifier Name</span>
                                <input disabled={isReadOnly} value={verifierName} onChange={e => setVerifierName(e.target.value)} className={`w-full h-11 bg-slate-50 border rounded-xl px-4 text-sm font-bold mt-1 ${errors.verifierName ? 'border-rose-500' : 'border-slate-100'}`} placeholder="Name of HR / Verifier" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase text-slate-400 ml-1">Verifier Email</span>
                                <input disabled={isReadOnly} value={verifierEmail} onChange={e => setVerifierEmail(e.target.value)} className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold mt-1" placeholder="Email" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase text-slate-400 ml-1">Verifier Contact</span>
                                <input disabled={isReadOnly} value={verifierContactNumber} onChange={e => setVerifierContactNumber(e.target.value)} className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold mt-1" placeholder="Contact" />
                            </div>
                            <div className="col-span-2">
                                <span className="text-[9px] font-black uppercase text-slate-400 ml-1">Verification Date</span>
                                <input disabled={isReadOnly} type="date" value={verificationTimestamp} onChange={e => setVerificationTimestamp(e.target.value)} className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* Exit & Salary Card */}
                    <div className="p-8 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <LogOut className="text-rose-500" size={20} />
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">
                                    {isCurrentEmployer ? 'Salary Details' : 'Exit & Salary Details'}
                                </h4>
                            </div>
                            {isCurrentEmployer && (
                                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-[#5D4591] text-white rounded-full">Active Employment</span>
                            )}
                        </div>

                        <div className="space-y-4">
                            {!isCurrentEmployer && (
                                <>
                                    <SingleSelectDropdown disabled={isReadOnly} label="Exit Mode" options={exitModeOptions} selected={exitMode} onSelect={setExitMode} error={errors.exitMode} isOccupyFullWidth={true} />

                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black uppercase text-slate-400 ml-1">Detailed Exit Reason</span>
                                        <textarea disabled={isReadOnly} value={detailedExitReason} onChange={e => setDetailedExitReason(e.target.value)} placeholder="Provide specific exit details as per HR records..." className="w-full h-24 bg-white border border-slate-100 rounded-2xl p-4 text-sm font-medium resize-none outline-none focus:ring-4 focus:ring-[#5D4591]/5 transition-all" />
                                    </div>

                                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                                        ${isReadOnly && eligibleForRehire ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                                                ${eligibleForRehire ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                            >
                                                <ThumbsUp size={16} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                                                    Eligible for Rehire
                                                </span>
                                                {isReadOnly && (
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest
                                                        ${eligibleForRehire ? 'text-emerald-500' : 'text-slate-400'}`}
                                                    >
                                                        {eligibleForRehire ? 'Confirmed by HR' : 'Not Confirmed'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isReadOnly ? (
                                            /* Read-Only Status Badge */
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
                                                ${eligibleForRehire
                                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                                                : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                                            >
                                                {eligibleForRehire ? 'Eligible' : 'Ineligible'}
                                            </div>
                                        ) : (
                                            /* Interactive Checkbox */
                                            <input
                                                type="checkbox"
                                                checked={eligibleForRehire}
                                                onChange={e => setEligibleForRehire(e.target.checked)}
                                                className="w-5 h-5 accent-[#5D4591] cursor-pointer"
                                            />
                                        )}
                                    </div>

                                </>
                            )}

                            <div className="relative">
                                <span className="text-[9px] font-black uppercase text-slate-400 ml-1">Verified Last Drawn Salary</span>
                                <div className="relative mt-1">
                                    <IndianRupeeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input disabled={isReadOnly} value={verifiedLastDrawnSalary} onChange={e => setVerifiedLastDrawnSalary(e.target.value)} className="w-full h-11 bg-white border border-slate-100 rounded-xl pl-10 pr-4 text-sm font-bold" placeholder="Optional" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mismatch & Remarks Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mismatch Analysis */}
                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <ShieldCheck className="text-amber-500" size={20} />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Mismatch Analysis</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Tenure Mismatch', checked: isTenureMismatch, onChange: setIsTenureMismatch },
                                { label: 'Designation Mismatch', checked: isDesignationMismatch, onChange: setIsDesignationMismatch }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 py-0.5">
                                    {isReadOnly ? (
                                        /* READ ONLY VIEW: High-contrast custom indicator */
                                        <div className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all
                                            ${item.checked
                                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200'
                                            : 'border-slate-200 bg-slate-50'}`}
                                        >
                                            {item.checked && <CheckIcon size={12} strokeWidth={4} />}
                                        </div>
                                    ) : (
                                        /* EDITABLE VIEW: Interactive Checkbox */
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={e => item.onChange(e.target.checked)}
                                            className="w-5 h-5 accent-amber-500 cursor-pointer shadow-sm"
                                        />
                                    )}

                                    <span className={`text-xs font-bold transition-colors 
                                        ${isReadOnly
                                        ? (item.checked ? 'text-slate-800' : 'text-slate-400')
                                        : 'text-slate-600 group-hover:text-slate-900'}`}
                                    >
                {item.label}
            </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HR Remarks */}
                    <div className="md:col-span-2 p-8 bg-white border border-slate-200 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <MessageSquare className="text-[#5D4591]" size={20} />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">HR Remarks</h4>
                        </div>
                        <textarea disabled={isReadOnly} value={remarksFromHr} onChange={e => setRemarksFromHr(e.target.value)} placeholder="Additional Remarks from HR regarding conduct, performance, or behavior..." className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium resize-none outline-none focus:ring-4 focus:ring-[#5D4591]/5 transition-all" />
                    </div>
                </div>

                {/* Method & Discrepancy (Existing logic) */}
                <div className="grid grid-cols-16 items-center gap-4">
                    <div className="col-span-4 flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 mb-1">Overall Verification Method</span>
                        <SingleSelectDropdown disabled={isReadOnly} label={"Verification Method"} options={verificationMethods} isOccupyFullWidth={true} selected={verificationMethod || ''} onSelect={setVerificationMethod} error={errors['verificationMethod']} />
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
                            placeholder="Please provide the specific reason for the negative finding..."
                            className="w-full min-h-[100px] bg-white border border-rose-200 rounded-[20px] p-5 text-sm font-medium outline-none resize-none focus:ring-4 focus:ring-rose-500/5"
                        />
                    </div>
                )}

                {/* POC Cards (Untouched) */}
                {(employmentData?.managerDetails?.name || employmentData?.managerDetails?.email || employmentData?.managerDetails?.phone) && (
                    <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3 flex items-center gap-2 mb-2">
                            <Briefcase size={16} className="text-[#5D4591]" />
                            <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">Manager Point of Contact</h4>
                        </div>
                        <HRInfo label="Name" value={employmentData?.managerDetails?.name || "-"} />
                        <HRInfo label="Email" value={employmentData?.managerDetails?.email || "-"} />
                        <HRInfo label="Contact" value={employmentData?.managerDetails?.phone || "-"} />
                    </div>
                )}

                <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 flex items-center justify-between mb-2">
                        {/* Left Side: Title & DND Status */}
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-[#5D4591]" />
                            <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">HR Point of Contact</h4>
                            {employmentData?.hrDetails?.isDoNotDisturb && (
                                <span className="flex items-center gap-1.5 text-[11px] text-rose-600 font-black bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 animate-pulse">
                                    <AlertCircle size={12} strokeWidth={3} /> Do not Disturb
                                </span>
                            )}
                        </div>

                        {/* Right Side: Horizontal Audit Info & Button */}
                        <div className="flex items-center gap-3">
                            {employmentData?.verificationMailSentToHR && (
                                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                                    {/* Last Sent Timestamp */}
                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tight">
                                        <Clock size={10} strokeWidth={3} className="text-[#5D4591]/40" />
                                        Last Sent: <span className="text-slate-700">{new Date(employmentData?.verificationMailSentAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                    </div>

                                    {/* Vertical Divider */}
                                    <div className="w-px h-3 bg-slate-200" />

                                    {/* Sent Count Badge */}
                                    <div
                                        onClick={() => setIsHistoryModalOpen(true)}
                                        className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50 cursor-pointer hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                                    >
                                        <CheckCircle2 size={10} strokeWidth={3} />
                                        Verification Outreach: <span className="underline decoration-emerald-300 underline-offset-2">{employmentData?.verificationMailSentCount}</span>
                                    </div>
                                </div>
                            )}

                            {
                                !isReadOnly && (
                                    <button
                                        onClick={() => setIsMailModalOpen(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#5D4591]/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#5D4591] hover:bg-[#5D4591] hover:text-white transition-all shadow-sm shadow-[#5D4591]/5 active:scale-95 cursor-pointer"
                                    >
                                        <Mail size={14} />
                                        Send Mail to HR
                                    </button>
                                )
                            }
                        </div>
                    </div>

                    <HRInfo label="Name" value={employmentData?.hrDetails?.name} />
                    <HRInfo label="Email" value={employmentData?.hrDetails?.email} />
                    <HRInfo label="Contact" value={employmentData?.hrDetails?.phone} />
                </div>



                {/* Footer Actions (Untouched) */}
                {
                    !isReadOnly && (
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

                            <div className="flex items-center gap-6">
                                <button onClick={handleSaveVerification} disabled={isSaving} className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] hover:shadow-xl hover:shadow-[#5D4591]/30 hover:-translate-y-0.5 active:scale-95'}`}>
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveStatus === 'success' ? <CheckIcon size={18} /> : <SaveIcon size={18} />}
                                    <span className="uppercase tracking-widest">{isSaving ? 'Saving Audit...' : saveStatus === 'success' ? 'Audit Updated' : 'Submit Verification'}</span>
                                </button>
                            </div>
                        </div>
                    )
                }


                <UploadedDocumentsDisplay documents={uploadedDocuments} setIsUploadModalOpen={setIsUploadModalOpen} onRemoveFile={onRemoveFile} type={"employment"} taskId={employmentId} isReadOnly={isReadOnly} />
                <FileUploadModal taskId={employmentId} isOpen={isUploadModalOpen && !isReadOnly} onClose={() => setIsUploadModalOpen(false)} onUploadComplete={() => showNotification("All files uploaded successfully!")} onSuccessFileUpload={onSuccessFileUpload} uploadType={"candidatedocument"} type={"employment"} />
                <SendHRMailModal
                    isOpen={isMailModalOpen}
                    onClose={() => updateHRVerificationMailDetails()}
                    hrData={employmentData?.hrDetails}
                    employmentData={employmentData}
                    documents={uploadedDocuments}
                    employmentId={employmentId}
                />
                <MailHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    employmentId={employmentId}
                    allDocuments={uploadedDocuments}
                />

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
