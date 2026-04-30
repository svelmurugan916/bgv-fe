import React, { useEffect, useState } from 'react';
import {
    AlertCircle, User, Calendar, Globe, CheckCircle2, RefreshCw,
    Clock, ZoomIn, ZoomOut, RotateCw,
    Loader2, ShieldCheck, MapPin,
    Home, Users, XCircle, Award, Target, Fingerprint
} from 'lucide-react';
import { isAfter, addMonths } from 'date-fns';
import DataComparisonField from "./DataComparisonField.jsx";
import { normalize } from "../../../../utils/string-utils.js";
import { isDateMatch } from "../../../../utils/date-util.js";
import InsufficientFundView from "../../../InsufficientFundView.jsx";
import CaseInActive from "../CaseInActive.jsx";

const PassportDetails = ({ data, onTriggerReVerify, fetchIdentityDetails, caseBillingStatus }) => {
    const {
        claimedDetails,
        overallStatus,
        uploadedDocuments,
        passportMetaData, // Standardized to metadata in logic below
        nameMatchScore,
        overallPassPercentage,
        profileNameMatchScore,
        candidateProfileName,
        candidateProfileDob
    } = data;

    // Standardizing variable name for internal logic
    const passportMetadata = passportMetaData;

    // Logic Constants
    const scorePercent = Math.round(overallPassPercentage) || 0;
    const isHighMatch = scorePercent >= 90;

    const profileScore = Math.round(profileNameMatchScore * 100) || 0;
    const isProfileMatch = profileScore >= 90;

    const ocrScore = Math.round(nameMatchScore * 100) || 0;
    const isOcrMatch = ocrScore >= 90;

    const expiryDate = passportMetadata?.dateOfExpiry || passportMetadata?.expiryDate;
    const isExpired = expiryDate && isAfter(new Date(), new Date(expiryDate));
    const isExpiringSoon = expiryDate && isAfter(addMonths(new Date(), 6), new Date(expiryDate)) && !isExpired;

    // --- RE-VERIFY STATE MANAGEMENT ---
    const [status, setStatus] = useState('idle');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer;
        if (status === 'success') {
            setCountdown(5);
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        fetchIdentityDetails();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status]);

    const onReVerify = async () => {
        if (status === 'loading') return;
        setStatus('loading');
        setFeedbackMessage('');
        try {
            const response = await onTriggerReVerify();
            if (response.status === 200 || response?.data?.status === 200) {
                setStatus('success');
                setFeedbackMessage(response?.message || response?.data?.message || "MEA Database Sync Successful.");
            } else {
                setStatus('error');
                setFeedbackMessage(response?.message || response?.data?.message || "MEA Record Not Found or Sync Failed.");
            }
        } catch (error) {
            setStatus('error');
            setFeedbackMessage("System error: Unable to reach the MEA verification server.");
        }
    };

    console.log('data -- ', data);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-16">

            {/* --- SECTION 1: DUAL IMAGE INSPECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Front Page (Identity)</p>
                    <PassportImageViewer url={uploadedDocuments?.find(d => d.side === 'FRONT' || d.type === 'PASSPORT_FRONT')?.url} label="Passport Front" />
                </div>
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Back Page (Address)</p>
                    <PassportImageViewer url={uploadedDocuments?.find(d => d.side === 'BACK' || d.type === 'PASSPORT_BACK')?.url} label="Passport Back" />
                </div>
            </div>
            {
                caseBillingStatus === 'INSUFFICIENT_FUNDS' ? (
                    <InsufficientFundView label={"Address"} process={"this address case"} />
                )  : data?.isFundReleasedOrCancelled ? (
                    <CaseInActive taskId={data?.id} onRevertSuccess={fetchIdentityDetails} label={"Passport"} process={"National ID check"} />
                ) : (
                    <>
                        {/* --- SECTION 2: UNIFIED COMMAND HEADER --- */}
                        <div className={`relative w-full p-8 rounded-[2.5rem] border shadow-2xl overflow-hidden text-white group transition-all duration-500 ${isProfileMatch ? 'bg-slate-900 border-slate-800' : 'bg-rose-950 border-rose-900'}`}>
                            <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                                <Globe size={400} className={`absolute -right-20 -top-10 ${isProfileMatch ? 'text-indigo-500' : 'text-rose-500'}`} />
                            </div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                                <div className="flex-1 w-full space-y-6">
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={overallStatus} />
                                        {!isProfileMatch && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/20 rounded-full border border-rose-500/30 backdrop-blur-md animate-pulse">
                                                <AlertCircle size={12} className="text-rose-400" />
                                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em]">Identity Mismatch Detected</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.3em] ml-1">Identity Holder (Govt Record)</p>
                                        <h4 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                                            {claimedDetails?.fullName?.systemVerifiedData || "Pending Sync"}
                                        </h4>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 md:gap-8 pt-4">
                                        <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Passport Number</p>
                                            <p className="text-lg font-mono font-bold text-white tracking-widest">{claimedDetails?.idNumber?.candidateClaimedData || '—'}</p>
                                        </div>
                                        <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">File Number</p>
                                            <p className="text-lg font-mono font-bold text-emerald-400 tracking-widest">{passportMetadata?.fileNumber || '—'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-inner">
                                    <div className="relative flex items-center justify-center w-28 h-28">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
                                            <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={314} strokeDashoffset={314 - (314 * scorePercent) / 100} strokeLinecap="round" className={`transition-all duration-1000 ease-out ${isHighMatch ? 'text-emerald-500' : 'text-amber-500'}`} />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <Award size={18} className={`mb-0.5 ${isHighMatch ? 'text-emerald-400' : 'text-amber-400'}`} />
                                            <span className="text-2xl font-black leading-none">{scorePercent}%</span>
                                            <span className="text-[7px] font-bold uppercase text-slate-500 tracking-tighter mt-1 text-center leading-none">Trust<br/>Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 3: FORENSIC IDENTITY RECONCILIATION --- */}
                        <div className="space-y-12">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg"><Target size={14} className="text-[#5D4591]"/></div>
                                    Identity Reconciliation Logic
                                </h3>
                                <span className="text-[10px] font-bold text-slate-400 italic">Forensic Analysis Mode</span>
                            </div>

                            <div className="grid grid-cols-1 gap-10">
                                {/* Step 1: Ownership */}
                                <div className={`relative pl-8 border-l-4 transition-colors duration-500 ${isProfileMatch ? 'border-emerald-500' : 'border-rose-500'}`}>
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isProfileMatch ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-bold text-slate-800 tracking-tight">Identity Ownership Check</h4>
                                                    {!isProfileMatch && <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-black uppercase animate-pulse"><AlertCircle size={10} /> Fraud Risk</span>}
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">Comparing candidate's registered name against MEA database records.</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Profile vs MEA</span>
                                                <div className="h-4 w-[1px] bg-slate-100" />
                                                <span className={`text-[11px] font-black ${isProfileMatch ? 'text-emerald-600' : 'text-rose-600'}`}>{profileScore}% {isProfileMatch ? 'MATCHED' : 'MISMATCHED'}</span>
                                            </div>
                                        </div>
                                        <DataComparisonField label="Registered Profile Name" candidateClaim={candidateProfileName || "NOT_PROVIDED"} systemVerifiedData={claimedDetails?.fullName?.systemVerifiedData} isMatch={isProfileMatch} icon={<User size={10}/>} />
                                    </div>
                                </div>

                                {/* Step 2: Integrity */}
                                <div className={`relative pl-8 border-l-4 transition-colors duration-500 ${isOcrMatch ? 'border-emerald-500' : 'border-rose-500'}`}>
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isOcrMatch ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="space-y-1">
                                                <h4 className="text-base font-bold text-slate-800 tracking-tight">Document Integrity Check</h4>
                                                <p className="text-xs text-slate-500 font-medium">Validating document extraction authenticity against the government vault.</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OCR vs MEA</span>
                                                <div className="h-4 w-[1px] bg-slate-100" />
                                                <span className={`text-[11px] font-black ${isOcrMatch ? 'text-emerald-600' : 'text-rose-600'}`}>{ocrScore}% AUTHENTIC</span>
                                            </div>
                                        </div>
                                        <DataComparisonField label="Document Extracted Name" candidateClaim={claimedDetails?.fullName?.candidateClaimedData} systemVerifiedData={claimedDetails?.fullName?.systemVerifiedData} isMatch={isOcrMatch} icon={<ShieldCheck size={10}/>} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 4: CHRONOLOGICAL RECONCILIATION --- */}
                        <div className="space-y-8 mt-12">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg"><Calendar size={14} className="text-[#5D4591]"/></div>
                                    Chronological Reconciliation
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                {/* DOB Ownership */}
                                <div className={`relative pl-8 border-l-4 ${isDateMatch(candidateProfileDob, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'border-emerald-500' : 'border-rose-500'}`}>
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isDateMatch(candidateProfileDob, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">DOB Ownership Check</h4>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${isDateMatch(candidateProfileDob, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isDateMatch(candidateProfileDob, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'VERIFIED' : 'DOB MISMATCH'}
                                </span>
                                        </div>
                                        <DataComparisonField label="Registered Profile DOB" candidateClaim={candidateProfileDob || "NOT_PROVIDED"} systemVerifiedData={claimedDetails?.dateOfBirth?.systemVerifiedData} isMatch={isDateMatch(candidateProfileDob, claimedDetails?.dateOfBirth?.systemVerifiedData)} icon={<Calendar size={10}/>} />
                                    </div>
                                </div>
                                {/* DOB Integrity */}
                                <div className={`relative pl-8 border-l-4 ${isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'border-emerald-500' : 'border-rose-500'}`}>
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">DOB Document Integrity</h4>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, claimedDetails?.dateOfBirth?.systemVerifiedData) ? 'AUTHENTIC' : 'TAMPERED'}
                                </span>
                                        </div>
                                        <DataComparisonField label="Extracted Document DOB" candidateClaim={claimedDetails?.dateOfBirth?.candidateClaimedData} systemVerifiedData={claimedDetails?.dateOfBirth?.systemVerifiedData} isMatch={isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, claimedDetails?.dateOfBirth?.systemVerifiedData)} icon={<Fingerprint size={10}/>} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 5: SECONDARY ATTRIBUTES & ADDRESS --- */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Gender', val: passportMetadata?.gender, icon: <User size={14}/> },
                                    { label: 'Nationality', val: passportMetadata?.nationality, icon: <Globe size={14}/> },
                                    { label: "Father's Name", val: passportMetadata?.fatherName, icon: <Users size={14}/> },
                                    { label: "Mother's Name", val: passportMetadata?.motherName, icon: <Users size={14}/> },
                                ].map((item, i) => (
                                    <div key={i} className="p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-300">{item.icon}</span>
                                            <p className="text-sm font-bold text-slate-700 truncate">{item.val || '—'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <MapPin size={140} className="absolute -right-15 text-slate-50 opacity-50 group-hover:text-indigo-50 transition-colors duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-indigo-50 rounded-xl"><Home size={18} className="text-[#5D4591]"/></div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Permanent Residential Address</h4>
                                            <p className="text-[10px] text-slate-400 font-medium">As recorded in official travel document records</p>
                                        </div>
                                    </div>
                                    <p className="text-base font-semibold text-slate-600 leading-relaxed italic max-w-5xl pl-12">
                                        {passportMetadata?.address || "Address details not extracted from document records."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 6: LIFECYCLE BAR --- */}
                        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Birth Place</p>
                                    <p className="text-sm font-bold text-slate-700">{passportMetadata?.placeOfBirth || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Issue Date</p>
                                    <p className="text-sm font-bold text-slate-700">{passportMetadata?.dateOfIssue || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex justify-between">
                                        Expiry Date {isExpiringSoon && <AlertCircle size={12} className="text-amber-500 animate-pulse" />}
                                    </p>
                                    <p className={`text-sm font-bold ${isExpired ? 'text-rose-600' : isExpiringSoon ? 'text-amber-600' : 'text-slate-700'}`}>
                                        {expiryDate || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Document Status</p>
                                    <div className={`flex items-center gap-2 text-[11px] font-black uppercase ${isExpired ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {isExpired ? <XCircle size={14}/> : <CheckCircle2 size={14}/>}
                                        {isExpired ? 'Expired' : 'Active / Valid'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 7: STATUS FEEDBACK (FLOATING) --- */}
                        {status !== 'idle' && (
                            <div className={`flex items-center gap-3 p-5 rounded-[2rem] border shadow-lg animate-in slide-in-from-bottom-4 duration-500 ${
                                status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                    status === 'loading' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                                        'bg-rose-50 border-rose-100 text-rose-700'
                            }`}>
                                <div className="shrink-0">{status === 'success' ? <CheckCircle2 size={20} /> : status === 'loading' ? <Loader2 size={20} className="animate-spin" /> : <AlertCircle size={20} />}</div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{status === 'success' ? 'MEA Sync Successful' : status === 'loading' ? 'Syncing MEA Database' : 'Verification Error'}</p>
                                    <p className="text-xs font-bold leading-tight">{status === 'loading' ? "Establishing connection to Ministry of External Affairs records..." : status === 'success' ? `${feedbackMessage} UI will refresh in ${countdown}s.` : feedbackMessage}</p>
                                </div>
                                {status === 'success' && <div className="w-10 h-10 rounded-full border-2 border-emerald-200 flex items-center justify-center relative"><div className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin [animation-duration:5s]"></div><RefreshCw size={14} className="text-emerald-500" /></div>}
                            </div>
                        )}
                    </>
                )
            }



            {/* --- ACTION FOOTER --- */}
            <div className="p-6 rounded-[2.5rem] border bg-white border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
                <div className="flex gap-3 items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck size={20} className="text-emerald-500" /> MEA Secure Gateway Active
                </div>
                <button
                    onClick={onReVerify}
                    disabled={status === 'loading' || overallStatus === 'CLEARED'}
                    className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 
                    ${status === 'loading' ? 'bg-slate-200 text-slate-500' : 'bg-[#5D4591] text-white hover:bg-[#4a3675]'}`}
                >
                    {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {status === 'loading' ? 'Processing Sync...' : 'Trigger MEA Sync'}
                </button>
            </div>
        </div>
    );
};

// ... ImageViewer and StatusBadge components remain consistent ...
const PassportImageViewer = ({ url, label }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    return (
        <div className="relative bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl flex items-center justify-center p-4 min-h-[300px] lg:min-h-[380px]">
            {url ? (
                <>
                    <img src={url} alt={label} className="object-contain max-h-full max-w-full transition-all duration-200" style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }} />
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white transition-colors"><ZoomIn size={18} /></button>
                        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white transition-colors"><ZoomOut size={18} /></button>
                        <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white transition-colors"><RotateCw size={18} /></button>
                    </div>
                </>
            ) : (
                <div className="text-white/30 text-center">
                    <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">{label} Image Missing</p>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const s = status?.toUpperCase();
    if (s === 'IN_PROGRESS' || s === 'INITIATED') return <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"><Clock size={10} /> In Progress</div>;
    if (s === 'COMPLETED' || s === 'VERIFIED' || s === 'CLEARED') return <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Verified</div>;
    if (s === 'FAILED') return <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"><XCircle size={10} /> Discrepancy</div>;
    return <div className="bg-slate-700 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">{status}</div>;
};

export default PassportDetails;
