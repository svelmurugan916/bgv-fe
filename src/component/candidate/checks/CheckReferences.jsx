import React, { useEffect, useRef, useState } from 'react';
import {
    User, Briefcase, Mail, Phone, Calendar, Building, Check, SaveIcon,
    Loader2, CheckIcon, AlertCircle, MessageSquare, Clock, GraduationCap,
    ShieldCheck, TrendingUp, Zap, ThumbsUp, Users, ArrowLeftRight, Info, Timer,
    FileText, X, Paperclip, Image as ImageIcon, Download, ClipboardCheckIcon, Trash2Icon, PlusIcon, MoreVerticalIcon
} from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import {GET_TASK_DETAILS, REMOVE_EVIDENCE_PROOF_DOCUMENT, UPDATE_REFERENCE_CHECK} from "../../../constant/Endpoint.tsx";
import {METHOD, READ_ONLY_TASK_STATUS} from "../../../constant/ApplicationConstant.js";
import SimpleLoader from "../../common/SimpleLoader.jsx";
import SingleSelectDropdown from "../../dropdown/SingleSelectDropdown.jsx";
import BaseCheckLayout from "./base-check-layout/BaseCheckLayout.jsx";
import VerificationCard from "./common-page/VerificationCard.jsx";
import CustomDatePicker from "../../common/CustomDatePicker.jsx";
import CustomDateTimePicker from "../../common/CustomDateTimePicker.jsx";

const CheckReference = ({ taskId }) => {
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);
    const fileInputRef = useRef(null);

    // --- State Management ---
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});

    const [referenceData, setReferenceData] = useState({});
    const [findings, setFindings] = useState({});
    const [overallVerificationMethod, setOverallVerificationMethod] = useState('');
    const [verifierOverallNotes, setVerifierOverallNotes] = useState('');
    const [discrepancyReason, setDiscrepancyReason] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [activeDeleteId, setActiveDeleteId] = useState(null);
    const [vaultError, setVaultError] = useState({ id: null, message: '' });

    // --- Evidence & Files State ---
    const [existingArtifacts, setExistingArtifacts] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    const [isFresher, setIsFresher] = useState(false);
    const [questionnaire, setQuestionnaire] = useState({
        integrityRating: 0,
        reliabilityRating: 0,
        attitudeRating: 0,
        performanceRating: 0,
        strengths: '',
        weaknesses: '',
        rehireEligible: '', // YES, NO
        teamworkConflict: '',
        callDuration: '',
        emailResponseDate: '',
    });

    const fieldIcons = {
        referenceName: <User size={18} />,
        referenceTitle: <Briefcase size={18} />,
        referenceCompany: <Building size={18} />,
        referenceEmail: <Mail size={18} />,
        referencePhone: <Phone size={18} />,
        relationship: <Users size={18} />,
        yearsKnown: <Timer size={18} />,
    };

    const hasNegativeFindings = Object.values(findings).some(f => f.status === 'negative') ||
        (questionnaire.integrityRating > 0 && questionnaire.integrityRating < 5) ||
        (questionnaire.attitudeRating > 0 && questionnaire.attitudeRating < 5) ||
        (questionnaire.performanceRating > 0 && questionnaire.performanceRating < 5);



    const handleDownload = async (evidenceId, fileName) => {
        setDownloadingId(evidenceId);
        try {
            // Adjust this endpoint based on how your fileUrl is structured
            const downloadUrl = `${FILE_GET}/${evidenceId}`;
            const response = await authenticatedRequest(null, downloadUrl, METHOD.GET, { responseType: 'blob' });
            const blob = response.data || response;
            if (!(blob instanceof Blob)) return;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleRemoveExistingFile = async (evidenceId) => {
        setDeletingId(evidenceId);
        setActiveDeleteId(null);
        setVaultError({ id: null, message: '' });
        try {
            const response = await authenticatedRequest(
                null,
                REMOVE_EVIDENCE_PROOF_DOCUMENT.replace("{taskId}", taskId).replace("{fileId}", evidenceId),
                METHOD.DELETE
            );
            if (response.status === 200) {
                setExistingArtifacts(prev => prev.filter(f => f.evidenceId !== evidenceId));
            }
        } catch (err) {
            setVaultError({ id: evidenceId, message: "Could not remove file." });
            setTimeout(() => setVaultError({ id: null, message: '' }), 5000);
        } finally {
            setDeletingId(null);
        }
    };

    // --- Fetch Logic ---
    const fetchReferenceDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${taskId}?taskType=references`, METHOD.GET);
            if (response.status === 200) {
                const data = response.data;
                setReferenceData(data);
                setIsFresher(data.candidateType === 'FRESHER');

                if (data.evidence?.artifacts) {
                    setExistingArtifacts(data.evidence.artifacts);
                }

                setOverallVerificationMethod(data.verificationMethod || '');
                setVerifierOverallNotes(data.verifierOverallNotes || '');

                const initialFindings = {};
                if (data.fieldDetails) {
                    Object.keys(data.fieldDetails).forEach(key => {
                        const f = data.fieldDetails[key];
                        initialFindings[key] = {
                            status: f.status?.toLowerCase() || 'pending',
                            value: f.verifiedEnteredData || f.candidateEnteredData || '',
                        };
                    });
                }
                setFindings(initialFindings);

                setQuestionnaire({
                    integrityRating: data.integrityRating || 0,
                    reliabilityRating: data.reliabilityRating || 0,
                    attitudeRating: data.attitudeRating || 0,
                    performanceRating: data.performanceRating || 0,
                    strengths: data.strengthsComment || '',
                    weaknesses: data.weaknessComment || '',
                    rehireEligible: data.wouldRehire === true ? 'YES' : data.wouldRehire === false ? 'NO' : '',
                    teamworkConflict: data.teamworkConflict || '',
                    callDuration: data.evidence?.callDurationMins || '',
                    emailResponseDate: data.evidence?.respondedAt || '',
                });
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };


    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        let newErrors = {};
        Object.keys(findings).forEach(key => {
            if (findings[key].status === 'pending') newErrors[key] = "Status required";
        });
        console.log('questionnaire -- ', questionnaire);
        if (questionnaire.integrityRating === 0) newErrors.integrity = "Rating required";
        if (questionnaire.attitudeRating === 0) newErrors.attitude = "Rating required";
        if (questionnaire.performanceRating === 0) newErrors.performance = "Rating required";
        if (!questionnaire.strengths.trim()) newErrors.strengths = "Required";
        if (!questionnaire.teamworkConflict.trim()) newErrors.teamworkConflict = "Required";
        if (!isFresher && !questionnaire.rehireEligible) newErrors.rehire = "Selection required";

        if (overallVerificationMethod === 'REFERENCE_PHONE' && !questionnaire.callDuration) {
            newErrors.callDuration = "Duration required";
        } else if (overallVerificationMethod === 'REFERENCE_EMAIL') {
            if (!questionnaire.emailResponseDate) newErrors.emailDate = "Date required";
            if (existingArtifacts.length === 0 && newFiles.length === 0) {
                newErrors.files = "Evidence file required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if(isReadOnly) return;
        if (!validate()) return;
        setIsSaving(true);

        const formData = new FormData();
        const payload = {
            fieldDetails: findings,
            integrityRating: questionnaire.integrityRating,
            reliabilityRating: questionnaire.reliabilityRating,
            attitudeRating: questionnaire.attitudeRating,
            performanceRating: questionnaire.performanceRating,
            strengthsComment: questionnaire.strengths,
            weaknessComment: questionnaire.weaknesses,
            wouldRehire: questionnaire.rehireEligible === 'YES',
            verificationMethod: overallVerificationMethod,
            verifierOverallNotes: verifierOverallNotes,
            teamworkConflict: questionnaire.teamworkConflict,
            evidence: {
                callDuration: questionnaire.callDuration,
                respondedTime: questionnaire.emailResponseDate ? `${questionnaire.emailResponseDate}` : null
            },
            finalVerdict: hasNegativeFindings ? 'MAJOR_DISCREPANCY' : 'CLEAR'
        };
        const jsonPart = new Blob([JSON.stringify(payload)], {
            type: 'application/json'
        });

        formData.append('request', jsonPart);
        newFiles.forEach(file => formData.append('files', file));

        try {
            const res = await authenticatedRequest(formData, `${UPDATE_REFERENCE_CHECK}/${taskId}`, METHOD.PUT);
            if (res.status === 200) {
                setSaveStatus('success');
                fetchReferenceDetails();
                setNewFiles([]);
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (err) { setSaveStatus('error'); } finally { setIsSaving(false); }
    };

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchReferenceDetails();
        }
    }, [taskId]);

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    const isReadOnly = READ_ONLY_TASK_STATUS?.includes(referenceData?.status?.toUpperCase());
    return (
        <BaseCheckLayout
            title="Reference Audit"
            description="Detailed verification of a professional reference's provided information."
            checkId={taskId}
            onStatusUpdateSuccess={fetchReferenceDetails}
        >
            <div className="mx-auto p-10 space-y-8">

                {/* 1. Profile Header */}
                <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#5D4591] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#5D4591]/20">
                            {isFresher ? <GraduationCap size={28} /> : <User size={28} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {referenceData?.fieldDetails?.referenceName?.candidateEnteredData}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {isFresher ? 'Academic Reference' : 'Professional Colleague'} • {referenceData?.fieldDetails?.referenceTitle?.candidateEnteredData}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Response Status</span>
                        <div className={`px-6 py-1.5 flex items-center justify-center ${referenceData?.contactSuccessful ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} rounded-full text-[10px] font-black uppercase tracking-tighter border`}>
                            {referenceData?.contactSuccessful ? "Responded" : "PENDING"}
                        </div>
                    </div>
                </div>

                {/* 2. Standard Identity Verification */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4 ml-2">
                        <ShieldCheck size={16} className="text-[#5D4591]" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Identity & Contact Verification</span>
                    </div>
                    {Object.entries(referenceData.fieldDetails).map(([key, data]) => (
                        <VerificationCard key={key} field={key} label={key.replace(/([A-Z])/g, ' $1').toUpperCase()} provided={data.candidateEnteredData} finding={findings[key]} error={errors[key]} icon={fieldIcons[key] || <MessageSquare size={18} />} onUpdate={(field, updates) => setFindings(prev => ({ ...prev, [field]: { ...prev[field], ...updates } }))} readonly={isReadOnly} />
                    ))}
                </div>

                {/* 3. Behavioral Questionnaire */}
                <div className="p-10 bg-[#F9F7FF] rounded-[3rem] border border-[#5D4591]/10 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageSquare size={20} className="text-[#5D4591]" />
                            <h3 className="text-sm font-black text-[#241B3B] uppercase tracking-widest">Behavioral Insights Questionnaire</h3>
                        </div>
                        <div className="px-3 py-1 bg-white border border-[#5D4591]/20 rounded-lg text-[9px] font-black text-[#5D4591] uppercase">
                            {isFresher ? 'Context: Academic' : 'Context: Professional'}
                        </div>
                    </div>

                    {/* Ratings Grid (Now 4 Ratings) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                        <RatingScale label={isFresher ? "Academic Integrity & Ethics" : "Professional Integrity"} value={questionnaire.integrityRating} error={errors.integrity} onSelect={(num) => setQuestionnaire(prev => ({...prev, integrityRating: num}))} readOnly={isReadOnly} />
                        <RatingScale label={isFresher ? "Punctuality & Discipline" : "Work Reliability"} value={questionnaire.reliabilityRating} error={errors.reliability} onSelect={(num) => setQuestionnaire(prev => ({...prev, reliabilityRating: num}))} readOnly={isReadOnly}/>
                        <RatingScale label={isFresher ? "Attitude towards Learning" : "Professional Attitude & Culture Fit"} value={questionnaire.attitudeRating} error={errors.attitude} onSelect={(num) => setQuestionnaire(prev => ({...prev, attitudeRating: num}))} readOnly={isReadOnly}/>
                        <RatingScale label={isFresher ? "Academic Performance" : "Job Performance & Skills"} value={questionnaire.performanceRating} error={errors.performance} onSelect={(num) => setQuestionnaire(prev => ({...prev, performanceRating: num}))} readOnly={isReadOnly} />
                    </div>

                    {/* All Comments Sections Restored */}
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <TrendingUp size={14} /><span className="text-[10px] font-black uppercase">Key Strengths</span>
                            </div>
                            <textarea disabled={isReadOnly} value={questionnaire.strengths} onChange={e => setQuestionnaire(prev => ({...prev, strengths: e.target.value}))} className={`w-full h-24 p-4  ${isReadOnly ? 'bg-slate-50' : 'bg-white'}  border rounded-2xl text-sm font-medium outline-none resize-none ${errors.strengths ? 'border-rose-300' : 'border-slate-200 focus:ring-4 ring-[#5D4591]/5'}`} placeholder="e.g. Leadership, Technical depth..." />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-amber-600">
                                <Zap size={14} /><span className="text-[10px] font-black uppercase">Areas of Improvement</span>
                            </div>
                            <textarea disabled={isReadOnly} value={questionnaire.weaknesses} onChange={e => setQuestionnaire(prev => ({...prev, weaknesses: e.target.value}))} className={`w-full h-24 p-4  ${isReadOnly ? 'bg-slate-50' : 'bg-white'} border rounded-2xl text-sm font-medium outline-none resize-none ${errors.weaknesses ? 'border-rose-300' : 'border-slate-200 focus:ring-4 ring-[#5D4591]/5'}`} placeholder="What should they work on?" />
                        </div>
                        {/* Teamwork Element Restored */}
                        <div className="space-y-2 col-span-2">
                            <div className="flex items-center gap-2 text-blue-600">
                                <Users size={14} /><span className="text-[10px] font-black uppercase">Teamwork & Conflict Management</span>
                            </div>
                            <textarea disabled={isReadOnly} value={questionnaire.teamworkConflict} onChange={e => setQuestionnaire(prev => ({...prev, teamworkConflict: e.target.value}))} className={`w-full h-24 p-4 ${isReadOnly ? 'bg-slate-50' : 'bg-white'} border rounded-2xl text-sm font-medium outline-none resize-none ${errors.teamworkConflict ? 'border-rose-300' : 'border-slate-200 focus:ring-4 ring-[#5D4591]/5'}`} placeholder="How do they handle stress or disagreements within a team?" />
                        </div>
                    </div>

                    {/* Recommendation Toggle Restored */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ThumbsUp size={18} className="text-[#5D4591]" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                                {isFresher ? "Would you recommend this student for a corporate role?" : "Would you recommend this candidate for Hire / Re-hire?"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {['YES', 'NO'].map(opt => (
                                <button disabled={isReadOnly} key={opt} onClick={() => setQuestionnaire(prev => ({...prev, rehireEligible: opt}))} className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${questionnaire.rehireEligible === opt ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    {errors.rehire && <p className="text-[10px] font-bold text-rose-500 uppercase text-right px-4">Selection Required</p>}
                </div>

                {/* 4. Audit Protocol & Method (Updated with Duration and File Evidence) */}
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* LEFT CARD: Audit Protocol */}
                    <div className="col-span-5">
                        {/* REMOVED overflow-hidden here so the DatePicker can float outside */}
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 h-full relative">

                            {/* ADDED rounded-t-[2.5rem] to the header to maintain the curved look */}
                            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 rounded-t-[2.5rem]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#5D4591]/10 rounded-lg flex items-center justify-center text-[#5D4591]">
                                        <ClipboardCheckIcon size={16} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Audit Protocol</h4>
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Methodology</span>
                            </div>

                            <div className="p-6 pt-0">
                                <div className=" space-y-6 ">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Verification Method</label>
                                        <SingleSelectDropdown
                                            disabled={isReadOnly}
                                            isOccupyFullWidth={true}
                                            options={[
                                                {value: 'REFERENCE_PHONE', text: 'Phone Call'},
                                                {value: 'REFERENCE_EMAIL', text: 'Official Email'},
                                                {value: 'LINKEDIN_VERIFICATION', text: 'LinkedIn Verification'}
                                            ]}
                                            selected={overallVerificationMethod}
                                            onSelect={setOverallVerificationMethod}
                                            error={errors.overallMethod}
                                        />
                                    </div>

                                    {overallVerificationMethod === 'REFERENCE_PHONE' && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Call Duration (Mins)</label>
                                            <div className="relative">
                                                <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    disabled={isReadOnly}
                                                    type="number"
                                                    value={questionnaire.callDuration}
                                                    onChange={(e) => setQuestionnaire(prev => ({...prev, callDuration: e.target.value}))}
                                                    placeholder="e.g. 5 mins"
                                                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-xs font-bold outline-none ${errors.callDuration ? 'border-rose-300' : 'border-slate-100 focus:border-[#5D4591]'}`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {overallVerificationMethod === 'REFERENCE_EMAIL' && (
                                        <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                                            {/* Relative and z-index added to the wrapper to prevent clipping */}
                                            <div className="relative z-[60]">
                                                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Response Date</label>
                                                <CustomDateTimePicker
                                                    disableFuture={true}
                                                    readOnly={isReadOnly}
                                                    value={questionnaire.emailResponseDate}
                                                    onChange={(val) => setQuestionnaire(prev => ({...prev, emailResponseDate: val}))}
                                                    error={errors.emailDate}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase text-slate-500 block tracking-widest">Evidence Artifacts</label>

                                                <div className="flex flex-wrap gap-4">
                                                    {/* --- 1. EXISTING ARTIFACTS --- */}
                                                    {existingArtifacts.map((file, idx) => {
                                                        const isImage = file.contentType?.startsWith('image/');
                                                        const isThisDeleting = deletingId === file.evidenceId;
                                                        const isThisDownloading = downloadingId === file.evidenceId;
                                                        const isConfirming = activeDeleteId === file.evidenceId;
                                                        const hasError = vaultError.id === file.evidenceId;

                                                        return (
                                                            <div key={file.evidenceId || idx} className="group relative w-36 h-52 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

                                                                {/* Top Preview Area */}
                                                                <div className="relative h-28 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-50">
                                                                    <div className={`transition-transform duration-500 ${isConfirming ? 'blur-sm' : 'group-hover:scale-110'} w-full h-full flex items-center justify-center`}>
                                                                        {isImage ? (
                                                                            <img src={file.fileUrl} alt="preview" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="flex flex-col items-center gap-1">
                                                                                <FileText size={24} className="text-slate-300" />
                                                                                <span className="text-[8px] font-black text-slate-400 uppercase">{file.contentType?.split('/')[1] || 'PDF'}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                        {/* ACTION OVERLAYS (From EvidenceVault) */}
                                                                        {isThisDeleting ? (
                                                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                                                                                <Loader2 size={20} className="animate-spin text-[#5D4591]" />
                                                                            </div>
                                                                        ) : isConfirming ? (
                                                                            <div className="absolute inset-0 bg-[#5D4591]/10 backdrop-blur-md flex flex-col items-center justify-center p-2 z-20 animate-in fade-in zoom-in duration-200">
                                                                                <span className="text-[8px] font-black uppercase text-[#5D4591] mb-2">Delete File?</span>
                                                                                <div className="flex gap-2">
                                                                                    <button onClick={() => handleRemoveExistingFile(file.evidenceId)} className="p-1.5 bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-colors"><Check size={12} /></button>
                                                                                    <button onClick={() => setActiveDeleteId(null)} className="p-1.5 bg-white text-slate-500 rounded-lg shadow-lg hover:bg-slate-50 transition-colors"><X size={12} /></button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            /* Standard Hover Bar */
                                                                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-2 bg-white/40 backdrop-blur-md border-t border-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                                                                                <button
                                                                                    onClick={() => handleDownload(file.evidenceId, file.fileName)}
                                                                                    disabled={isThisDownloading}
                                                                                    className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                                                                                >
                                                                                    {isThisDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={14} />}
                                                                                </button>
                                                                                {
                                                                                    !isReadOnly && (
                                                                                        <button
                                                                                            onClick={() => setActiveDeleteId(file.evidenceId)}
                                                                                            className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                                                        >
                                                                                            <Trash2Icon size={14} />
                                                                                        </button>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )}

                                                                        {hasError && (
                                                                            <div className="absolute inset-x-0 bottom-0 bg-rose-500 text-white p-1 flex items-center gap-1 z-30">
                                                                                <AlertCircle size={10} />
                                                                                <p className="text-[7px] font-bold uppercase tracking-tighter">{vaultError.message}</p>
                                                                            </div>
                                                                        )}


                                                                </div>

                                                                {/* Bottom Info Area */}
                                                                <div className="p-3 bg-white space-y-1">
                                                                    <p className="text-[10px] font-black text-slate-700 truncate uppercase tracking-tighter" title={file.fileName}>{file.fileName}</p>
                                                                    <div className="space-y-0.5">
                                                                        <p className="text-[9px] font-bold text-slate-400">{formatFileSize(file.fileSize)}</p>
                                                                        <div className="flex items-center gap-1">
                                                                            <div className="w-1 h-1 rounded-full bg-[#5D4591]/40" />
                                                                            <p className="text-[7px] font-black text-[#5D4591]/60 uppercase truncate">{file.uploadedBy || 'Admin'}</p>
                                                                        </div>
                                                                        <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* --- 2. NEW FILES (Pending) --- */}
                                                    {newFiles.map((file, idx) => (
                                                        <div key={idx} className="group relative w-36 h-52 bg-white border border-indigo-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-in zoom-in-95">
                                                            <div className="relative h-28 bg-indigo-50/30 flex items-center justify-center overflow-hidden border-b border-indigo-50">
                                                                <div className="group-hover:scale-110 transition-transform duration-500 w-full h-full flex items-center justify-center">
                                                                    {file.type?.startsWith('image/') ? (
                                                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            <Paperclip size={24} className="text-indigo-200" />
                                                                            <span className="text-[8px] font-black text-indigo-300 uppercase">PREVIEW</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-2 bg-indigo-50/60 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                                    <button onClick={() => removeNewFile(idx)} className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                                                                        <Trash2Icon size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="p-3 bg-white space-y-1">
                                                                <p className="text-[10px] font-black text-indigo-900 truncate uppercase tracking-tighter">{file.name}</p>
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-bold text-indigo-400">{formatFileSize(file.size)}</p>
                                                                    <div className="flex items-center gap-1.5 py-1 px-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50 w-fit">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                                                        <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">Pending</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* --- 3. UPLOAD TRIGGER --- */}
                                                    {
                                                        !isReadOnly && (
                                                            <div onClick={() => fileInputRef.current.click()} className="w-36 h-52 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-[#5D4591]/30 transition-all group">
                                                                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
                                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-[#5D4591] transition-all mb-3">
                                                                    <PlusIcon size={20} />
                                                                </div>
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add More</span>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* RIGHT CARD: Executive Summary */}
                    <div className="col-span-7">
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden h-full">
                            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#5D4591]/10 rounded-lg flex items-center justify-center text-[#5D4591]">
                                        <MessageSquare size={16} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Verifier's Executive Summary</h4>
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Internal Use Only</span>
                            </div>
                            <div className="p-6 pt-0">
                                <textarea disabled={isReadOnly} value={verifierOverallNotes} onChange={e => setVerifierOverallNotes(e.target.value)} placeholder="Document key takeaways..." className="w-full h-35 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-medium text-slate-700 resize-none outline-none focus:bg-white focus:ring-4 focus:ring-[#5D4591]/5 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Submit Action */}
                {
                    !isReadOnly && (
                        <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Conclusion</span>
                                <div className={`text-xs font-bold mt-1 ${hasNegativeFindings ? 'text-rose-500' : 'text-emerald-500'}`}>{hasNegativeFindings ? '● Major Discrepancy Flagged' : '● Verification Clear'}</div>
                            </div>
                            <button onClick={handleSave} disabled={isSaving} className={`flex items-center gap-3 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isSaving ? 'bg-slate-100 text-slate-400' : 'bg-[#5D4591] text-white shadow-xl shadow-[#5D4591]/20 hover:-translate-y-1 active:scale-95'}`}>
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <SaveIcon size={18} />} {isSaving ? 'Processing...' : 'Submit Verification'}
                            </button>
                        </div>
                    )
                }
            </div>
        </BaseCheckLayout>
    );
};

const RatingScale = ({ label, value, onSelect, error, readOnly }) => (
    <div className="space-y-4">
        <label className="text-[11px] font-black text-slate-700 uppercase tracking-tight block">{label}</label>
        <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button key={num} disabled={readOnly} onClick={() => onSelect(num)} className={`w-10 h-10 rounded-xl font-black text-xs transition-all duration-200 border ${value === num ? 'bg-[#5D4591] text-white border-[#5D4591] shadow-lg shadow-[#5D4591]/20 scale-110' : 'bg-white text-slate-400 border-slate-100 hover:border-[#5D4591]/30'}`}>{num}</button>
            ))}
        </div>
        {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">{error}</p>}
    </div>
);

export default CheckReference;
