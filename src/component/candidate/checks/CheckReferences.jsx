import React, { useEffect, useRef, useState } from 'react';
import {
    User, Briefcase, Mail, Phone, Calendar, Building, Check, SaveIcon,
    Loader2, CheckIcon, AlertCircle, MessageSquare, Clock, GraduationCap,
    ShieldCheck, TrendingUp, Zap, ThumbsUp, Users, ArrowLeftRight, Info, Timer
} from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { GET_TASK_DETAILS, UPDATE_REFERENCE_CHECK } from "../../../constant/Endpoint.tsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
import SimpleLoader from "../../common/SimpleLoader.jsx";
import SingleSelectDropdown from "../../dropdown/SingleSelectDropdown.jsx";
import BaseCheckLayout from "./base-check-layout/BaseCheckLayout.jsx";
import VerificationCard from "./common-page/VerificationCard.jsx";
import { formatFullDateTime } from "../../../utils/date-util.js";

const CheckReference = ({ taskId }) => {
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);

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

    // --- Behavioral Questionnaire State ---
    const [isFresher, setIsFresher] = useState(false);
    const [questionnaire, setQuestionnaire] = useState({
        integrityRating: 0,
        stabilityRating: 0,
        strengths: '',
        weaknesses: '',
        rehireEligible: '', // YES, NO
        additionalRemarks: '',
        teamworkConflict: '',
    });

    const fieldIcons = {
        referenceName: <User size={18} />,
        referenceTitle: <Briefcase size={18} />,
        referenceCompany: <Building size={18} />,
        referenceEmail: <Mail size={18} />,
        referencePhone: <Phone size={18} />,
        relationship: <Users size={18} />, // Updated to match API key
        yearsKnown: <Timer size={18} />,   // New icon for API key
        periodOfObservationStart: <Calendar size={18} />,
        periodOfObservationEnd: <Calendar size={18} />,
    };

    const hasNegativeFindings = Object.values(findings).some(f => f.status === 'negative') ||
        (questionnaire.integrityRating > 0 && questionnaire.integrityRating < 5);

    // --- Fetch Logic Integrated with provided API Response ---
    const fetchReferenceDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${GET_TASK_DETAILS}/${taskId}?taskType=references`, METHOD.GET);
            if (response.status === 200) {
                const data = response.data;
                setReferenceData(data);
                setIsFresher(data.candidateType === 'FRESHER');

                setOverallVerificationMethod(data.verificationMethod || '');
                setVerifierOverallNotes(data.contactAttemptNotes || '');

                const initialFindings = {};
                if (data.fieldDetails) {
                    Object.keys(data.fieldDetails).forEach(key => {
                        const f = data.fieldDetails[key];
                        initialFindings[key] = {
                            status: f.status?.toLowerCase() || 'pending',
                            value: f.verifiedEnteredData || f.candidateEnteredData || '',
                            verificationMethod: f.verificationMethod || '',
                            sourceLink: f.sourceLink || ''
                        };
                    });
                }
                setFindings(initialFindings);

                // Mapping API ratings and comments to Questionnaire state
                setQuestionnaire({
                    integrityRating: data.integrityRating || 0,
                    stabilityRating: data.reliabilityRating || 0, // Mapping reliability to stability
                    strengths: data.strengthsComment || '',
                    weaknesses: data.weaknessComment || '',
                    rehireEligible: data.wouldRehire === true ? 'YES' : data.wouldRehire === false ? 'NO' : '',
                    additionalRemarks: '',
                    teamworkConflict: '', // Keep in state if not in API
                });
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Validation Logic ---
    const validate = () => {
        let newErrors = {};
        Object.keys(findings).forEach(key => {
            if (findings[key].status === 'pending') newErrors[key] = "Status required";
        });
        if (questionnaire.integrityRating === 0) newErrors.integrity = "Rating required";
        if (!questionnaire.strengths.trim()) newErrors.strengths = "Required";
        if (!questionnaire.teamworkConflict.trim()) newErrors.teamworkConflict = "Required";
        if (!isFresher) {
            if (!questionnaire.rehireEligible) newErrors.rehire = "Selection required";
        }
        if (!overallVerificationMethod) newErrors.overallMethod = "Required";
        if (hasNegativeFindings && !discrepancyReason) newErrors.discrepancy = "Reason required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setIsSaving(true);
        const payload = {
            fieldDetails: findings,
            behavioralData: questionnaire,
            overallVerificationMethod,
            verifierOverallNotes,
            discrepancyReason: hasNegativeFindings ? discrepancyReason : "",
            finalVerdict: hasNegativeFindings ? 'MAJOR_DISCREPANCY' : 'CLEAR'
        };
        try {
            const res = await authenticatedRequest(payload, `${UPDATE_REFERENCE_CHECK}/${taskId}`, METHOD.PUT);
            if (res.status === 200) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
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
            fetchReferenceDetails();
        }
    }, [taskId]);

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    return (
        <BaseCheckLayout title="Reference Audit" description="Detailed verification of a professional reference's provided information." checkId={taskId}>
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
                        <span className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                            Response Status
                        </span>
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
                        <VerificationCard
                            key={key}
                            field={key}
                            label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            provided={data.candidateEnteredData}
                            finding={findings[key]}
                            error={errors[key]}
                            icon={fieldIcons[key] || <MessageSquare size={18} />}
                            onUpdate={(field, updates) => setFindings(prev => ({ ...prev, [field]: { ...prev[field], ...updates } }))}
                        />
                    ))}
                </div>

                {/* 3. Behavioral Questionnaire */}
                <div className="p-10 bg-[#F9F7FF] rounded-[3rem] border border-[#5D4591]/10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageSquare size={20} className="text-[#5D4591]" />
                            <h3 className="text-sm font-black text-[#241B3B] uppercase tracking-widest">Behavioral Insights Questionnaire</h3>
                        </div>
                        <div className="px-3 py-1 bg-white border border-[#5D4591]/20 rounded-lg text-[9px] font-black text-[#5D4591] uppercase">
                            {isFresher ? 'Context: Academic' : 'Context: Professional'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                {isFresher ? "1. Student's Academic Integrity & Ethics?" : "1. Candidate's Professional Integrity?"}
                            </label>
                            <div className="flex gap-2 mt-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setQuestionnaire(prev => ({...prev, integrityRating: num}))}
                                        className={`w-10 h-10 rounded-xl font-black transition-all ${questionnaire.integrityRating === num ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/30' : 'bg-white text-slate-400 border border-slate-200 hover:border-[#5D4591]'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            {errors.integrity && <p className="text-[10px] font-bold text-rose-500 uppercase">Rating Required</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                {isFresher ? "2. Punctuality & Discipline?" : "2. Work Stability & Reliability?"}
                            </label>
                            <div className="flex gap-2 mt-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setQuestionnaire(prev => ({...prev, stabilityRating: num}))}
                                        className={`w-10 h-10 rounded-xl font-black transition-all ${questionnaire.stabilityRating === num ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/30' : 'bg-white text-slate-400 border border-slate-200 hover:border-[#5D4591]'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <TrendingUp size={14} />
                                <span className="text-[10px] font-black uppercase">Key Strengths</span>
                            </div>
                            <textarea
                                value={questionnaire.strengths}
                                onChange={e => setQuestionnaire(prev => ({...prev, strengths: e.target.value}))}
                                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 ring-[#5D4591]/5 outline-none resize-none"
                                placeholder={isFresher ? "e.g. Quick learner, disciplined..." : "e.g. Leadership, Technical depth..."}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-amber-600">
                                <Zap size={14} />
                                <span className="text-[10px] font-black uppercase">Areas of Improvement</span>
                            </div>
                            <textarea
                                value={questionnaire.weaknesses}
                                onChange={e => setQuestionnaire(prev => ({...prev, weaknesses: e.target.value}))}
                                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 ring-[#5D4591]/5 outline-none resize-none"
                                placeholder="What should the candidate work on?"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <div className="flex items-center gap-2 text-blue-600">
                                <Users size={14} />
                                <span className="text-[10px] font-black uppercase">Teamwork & Conflict Management</span>
                            </div>
                            <textarea
                                value={questionnaire.teamworkConflict}
                                onChange={e => setQuestionnaire(prev => ({...prev, teamworkConflict: e.target.value}))}
                                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 ring-[#5D4591]/5 outline-none resize-none"
                                placeholder="How does the candidate handle stress or disagreements within a team?"
                            />
                        </div>
                    </div>

                    {/* Recommendation Toggle */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ThumbsUp size={18} className="text-[#5D4591]" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                                {isFresher
                                    ? "Would you recommend this student for a professional role in a corporate environment?"
                                    : "Would you recommend this candidate for Hire?"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {['YES', 'NO'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setQuestionnaire(prev => ({...prev, rehireEligible: opt}))}
                                    className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${questionnaire.rehireEligible === opt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Final Audit & Method */}
                <div className="grid grid-cols-12 gap-8 items-start">
                    <div className="col-span-4 space-y-3 pt-2">
                        <div className="flex items-center gap-2 ml-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5D4591]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Audit Protocol</span>
                        </div>
                        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Verification Method</label>
                            <SingleSelectDropdown
                                disabled={false}
                                label={"Select Method"}
                                options={[
                                    {value: 'PHONE_CALL', text: 'Phone Call'},
                                    {value: 'EMAIL', text: 'Official Email'},
                                    {value: 'LINKEDIN', text: 'LinkedIn Verification'}
                                ]}
                                isOccupyFullWidth={true}
                                selected={overallVerificationMethod || ''}
                                onSelect={setOverallVerificationMethod}
                                error={errors.overallMethod}
                            />
                        </div>
                    </div>

                    <div className="col-span-8">
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#5D4591]/10 rounded-lg flex items-center justify-center text-[#5D4591]">
                                        <MessageSquare size={16} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Verifier's Executive Summary</h4>
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Internal Use Only</span>
                            </div>
                            <div className="p-6">
                                <textarea
                                    disabled={false}
                                    value={verifierOverallNotes}
                                    onChange={e => setVerifierOverallNotes(e.target.value)}
                                    placeholder="Document key takeaways, any hesitations, or context..."
                                    className="w-full h-32 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-medium text-slate-700 resize-none outline-none focus:bg-white focus:ring-4 focus:ring-[#5D4591]/5 focus:border-[#5D4591]/20 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Submit Action */}
                <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Conclusion</span>
                        <div className={`text-xs font-bold mt-1 ${hasNegativeFindings ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {hasNegativeFindings ? '● Major Discrepancy Flagged' : '● Verification Clear'}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-3 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                            ${isSaving ? 'bg-slate-100 text-slate-400' : 'bg-[#5D4591] text-white shadow-xl shadow-[#5D4591]/20 hover:-translate-y-1 active:scale-95'}`}
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <SaveIcon size={18} />}
                        {isSaving ? 'Processing...' : 'Submit Verification'}
                    </button>
                </div>
            </div>
        </BaseCheckLayout>
    );
};

export default CheckReference;
