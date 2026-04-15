import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, ExternalLink, User, Smartphone, MapPin, Calendar,
    Info, Clock, RotateCcw, Loader2, AlertCircle, CheckCircle2,
    QrCode, Download, ZoomIn, ZoomOut, RotateCw, ChevronRight,
    Hash, Target, Fingerprint, Award, XCircle, Home, Users
} from 'lucide-react';
import { format } from 'date-fns';
import { isDateMatch } from "../../../../utils/date-util.js";
import { formatFullDateTime } from "../../../../utils/date-util.js";
import DataComparisonField from './DataComparisonField.jsx';

const AadhaarDetails = ({ data, onSendDigilockerLink, fetchIdentityDetails }) => {
    const {
        claimedDetails,
        overallStatus,
        isLinkSent,
        nameMatchScore,
        profileNameMatchScore,
        candidateProfileName,
        candidateProfileDob,
        overallPassPercentage,
        aadhaar_xml_data: xml,
        digilocker_metadata: meta
    } = data;

    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Logic Constants
    const trustScore = Math.round(overallPassPercentage) || 0;
    const isHighTrust = trustScore >= 90;

    const profileScore = Math.round(profileNameMatchScore * 100) || 0;
    const isProfileMatch = profileScore >= 80;

    const ocrScore = Math.round(nameMatchScore * 100) || 0;
    const isOcrMatch = ocrScore >= 90;

    const isVerified = overallStatus !== 'IN_PROGRESS';

    const handleAction = async () => {
        setStatus('loading');
        setErrorMessage('');
        try {
            const success = await onSendDigilockerLink();
            if (success) setStatus('success');
            else setStatus('error');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err?.message || "Failed to send verification link.");
        }
    };

    // --- VIEW 1: PENDING / LINK DISPATCHED ---
    if (!isVerified) {
        return (
            <div className="space-y-10 animate-in fade-in duration-700 pb-10">
                {isLinkSent && (
                    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Sent To Mobile', val: data.linkSentToMobile, icon: <Smartphone className="text-amber-400" size={14}/> },
                                { label: 'Dispatched At', val: data.linkSentAt ? formatFullDateTime(data.linkSentAt) : '-', icon: <Calendar className="text-slate-400" size={14}/> },
                                { label: 'Expires At', val: data.linkExpiresAt ? formatFullDateTime(data.linkExpiresAt) : '-', icon: <Clock className="text-rose-400" size={14}/>, color: 'text-rose-400' },
                                { label: 'Status', val: 'Awaiting Action', icon: <Info className="text-indigo-400" size={14}/>, color: 'text-indigo-400' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.icon} {item.label}</div>
                                    <p className={`text-sm font-bold ${item.color || 'text-white'}`}>{item.val || '-'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AadhaarImageViewer url={data?.uploadedDocuments?.[0]?.url} />
                    <div className="space-y-6">
                        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm h-fit"><ShieldCheck className="text-amber-600" size={24} /></div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">DigiLocker Validation Required</h4>
                                <p className="text-xs text-amber-800/70 leading-relaxed font-medium">This document requires real-time authentication via DigiLocker to prevent identity spoofing.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <DataComparisonField label="Aadhaar Number" candidateClaim={claimedDetails?.idNumber?.candidateClaimedData || '—'} systemVerifiedData="Awaiting DigiLocker..." isMatch={null} icon={<Hash size={10}/>} />
                            <DataComparisonField label="Candidate Name" candidateClaim={claimedDetails?.fullName?.candidateClaimedData || '—'} systemVerifiedData="Awaiting DigiLocker..." isMatch={null} icon={<User size={10}/>} />
                        </div>
                        <button onClick={handleAction} disabled={status === 'loading'} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${isLinkSent ? 'bg-white border-2 border-[#5D4591] text-[#5D4591] hover:bg-slate-50' : 'bg-[#5D4591] text-white hover:bg-[#4a3675]'}`}>
                            {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : isLinkSent ? <RotateCcw size={18} /> : <ExternalLink size={18} />}
                            {status === 'loading' ? 'Processing...' : isLinkSent ? 'Resend DigiLocker Link' : 'Send DigiLocker Verification Link'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: PREMIUM VERIFIED (POST-DIGILOCKER) ---
    const formattedAddress = xml?.address ? [xml.address.house, xml.address.street, xml.address.locality, xml.address.vtc, xml.address.district, xml.address.state, xml.address.zip].filter(Boolean).join(', ') : xml?.full_address || 'N/A';
    const isFatherMatch = claimedDetails?.fatherName?.candidateClaimedData?.toLowerCase() === (claimedDetails?.fatherName?.systemVerifiedData || xml?.care_of)?.toLowerCase();

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-16">

            {/* --- SECTION 1: HEADER & IMAGE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AadhaarImageViewer url={data?.uploadedDocuments?.[0]?.url} />

                <div className={`relative p-8 rounded-[2.5rem] border shadow-2xl overflow-hidden text-white transition-all duration-500 ${isProfileMatch ? 'bg-slate-900 border-slate-800' : 'bg-rose-950 border-rose-900'}`}>
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"><QrCode size={400} className="absolute -right-20 -top-10" /></div>
                    <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-5">
                                <div className="relative">
                                    <img src={data?.profilePictureUrl || "/api/placeholder/100/120"} className="w-20 h-24 object-cover rounded-2xl border-2 border-white/20 shadow-2xl bg-slate-800" alt="UIDAI Profile" />
                                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-2 border-slate-900 shadow-lg"><ShieldCheck size={12}/></div>
                                </div>
                                <div className="space-y-3 pt-1">
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={overallStatus} />
                                        {!isProfileMatch && <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[9px] font-black uppercase border border-rose-500/30 animate-pulse"><AlertCircle size={10}/> Fraud Risk</span>}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">UIDAI Vault Record</p>
                                        <h4 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">{xml?.full_name || 'N/A'}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Aadhaar (Masked)</p>
                                <p className="text-xl font-mono font-bold text-white tracking-[0.2em]">{xml?.masked_aadhaar || '—'}</p>
                            </div>
                            <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Score</p>
                                <div className="flex items-center gap-2">
                                    <Award size={14} className={isHighTrust ? "text-emerald-400" : "text-rose-400"} />
                                    <p className="text-xl font-black text-white">{trustScore}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: FORENSIC IDENTITY RECONCILIATION --- */}
            <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 rounded-lg"><Target size={14} className="text-[#5D4591]"/></div>
                        Identity Reconciliation Logic
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 italic">Audit Mode: Enabled</span>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {/* STEP 1: OWNERSHIP */}
                    <div className={`relative pl-8 border-l-4 transition-colors duration-500 ${isProfileMatch ? 'border-emerald-500' : 'border-rose-500'}`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isProfileMatch ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 uppercase">01. Identity Ownership Check</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">Verifying if Aadhaar record belongs to <strong>{candidateProfileName}</strong></p>
                                </div>
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${isProfileMatch ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {profileScore}% {isProfileMatch ? 'MATCHED' : 'MISMATCHED'}
                                </span>
                            </div>
                            <DataComparisonField label="Registered Profile Name" candidateClaim={candidateProfileName || "NOT_PROVIDED"} systemVerifiedData={xml?.full_name} isMatch={isProfileMatch} icon={<User size={10}/>} />
                        </div>
                    </div>

                    {/* STEP 2: INTEGRITY */}
                    <div className={`relative pl-8 border-l-4 transition-colors duration-500 ${isOcrMatch ? 'border-emerald-500' : 'border-rose-500'}`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isOcrMatch ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 uppercase">02. Document Integrity Check</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">OCR Extraction vs. DigiLocker Integrity</p>
                                </div>
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${isOcrMatch ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {ocrScore}% AUTHENTIC
                                </span>
                            </div>
                            <DataComparisonField label="Document OCR Name" candidateClaim={claimedDetails?.fullName?.candidateClaimedData} systemVerifiedData={xml?.full_name} isMatch={isOcrMatch} icon={<Fingerprint size={10}/>} />
                        </div>
                    </div>

                    {/* STEP 3: LINEAGE RECONCILIATION (Father/Spouse Name) */}
                    <div className={`relative pl-8 border-l-4 transition-colors duration-500 ${isFatherMatch ? 'border-emerald-500' : 'border-rose-500'}`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isFatherMatch ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 uppercase">03. Lineage Reconciliation</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">Verifying Care-Of (Father/Spouse) details</p>
                                </div>
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${isFatherMatch ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isFatherMatch ? 'VERIFIED' : 'MISMATCH'}
                                </span>
                            </div>
                            <DataComparisonField
                                label="Father/Spouse Name (Care Of)"
                                candidateClaim={claimedDetails?.fatherName?.candidateClaimedData || 'Not Provided'}
                                systemVerifiedData={claimedDetails?.fatherName?.systemVerifiedData || xml?.care_of || 'N/A'}
                                isMatch={isFatherMatch}
                                icon={<Users size={10}/>}
                                comparisonScore={data?.fatherNameMatchScore || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: CHRONOLOGICAL RECONCILIATION --- */}
            <div className="space-y-8 mt-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 rounded-lg"><Calendar size={14} className="text-[#5D4591]"/></div>
                        Chronological Reconciliation
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    <div className={`relative pl-8 border-l-4 ${isDateMatch(candidateProfileDob, xml?.dob) ? 'border-emerald-500' : 'border-rose-500'}`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isDateMatch(candidateProfileDob, xml?.dob) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">DOB Ownership Check</h4>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${isDateMatch(candidateProfileDob, xml?.dob) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isDateMatch(candidateProfileDob, xml?.dob) ? 'VERIFIED' : 'DOB MISMATCH'}
                                </span>
                            </div>
                            <DataComparisonField label="Registered Profile DOB" candidateClaim={candidateProfileDob ? format(new Date(candidateProfileDob), 'dd-MM-yyyy') : '—'} systemVerifiedData={xml?.dob ? format(new Date(xml.dob), 'dd-MM-yyyy') : '—'} isMatch={isDateMatch(candidateProfileDob, xml?.dob)} icon={<Calendar size={10}/>} />
                        </div>
                    </div>
                    <div className={`relative pl-8 border-l-4 ${isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, xml?.dob) ? 'border-emerald-500' : 'border-rose-500'}`}>
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, xml?.dob) ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">DOB Document Integrity</h4>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, xml?.dob) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, xml?.dob) ? 'AUTHENTIC' : 'TAMPERED'}
                                </span>
                            </div>
                            <DataComparisonField label="Extracted Document DOB" candidateClaim={claimedDetails?.dateOfBirth?.candidateClaimedData ? format(new Date(claimedDetails.dateOfBirth.candidateClaimedData), 'dd-MM-yyyy') : '—'} systemVerifiedData={xml?.dob ? format(new Date(xml.dob), 'dd-MM-yyyy') : '—'} isMatch={isDateMatch(claimedDetails?.dateOfBirth?.candidateClaimedData, xml?.dob)} icon={<Fingerprint size={10}/>} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: SECONDARY ATTRIBUTES --- */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Gender', val: xml?.gender === 'M' ? 'Male' : 'Female', icon: <User size={14}/> },
                        { label: 'Zip Code', val: xml?.zip, icon: <MapPin size={14}/> },
                        { label: "Phone Linked", val: meta?.digilocker_metadata?.mobile_number || 'Yes', icon: <Smartphone size={14}/> },
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
                    <MapPin size={140} className="absolute -right-10 -bottom-10 text-slate-50 opacity-50 group-hover:text-indigo-50 transition-colors duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-indigo-50 rounded-xl"><Home size={18} className="text-[#5D4591]"/></div>
                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Permanent Residential Address</h4>
                        </div>
                        <p className="text-base font-semibold text-slate-600 leading-relaxed italic max-w-5xl pl-12">{formattedAddress}</p>
                    </div>
                </div>
            </div>

            {/* --- SECTION 5: AUDIT TRAIL --- */}
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Path</p>
                    <p className="text-xs font-bold text-slate-600">Surepass <ChevronRight size={10} className="inline mx-1"/> DigiLocker <ChevronRight size={10} className="inline mx-1"/> UIDAI Vault</p>
                    <p className="text-[10px] text-slate-400 font-medium">Timestamp: {data.verificationTimestamp ? formatFullDateTime(data.verificationTimestamp) : 'N/A'}</p>
                </div>
                <div className="flex gap-3 h-fit">
                    {data.verificationXmlUrl && (
                        <a href={data.verificationXmlUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Download size={12} /> Raw UIDAI XML
                        </a>
                    )}
                    <a href={data?.uploadedDocuments?.[0]?.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Download size={12} /> Original Proof
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT ---
const AadhaarImageViewer = ({ url }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    return (
        <div className="relative bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl flex items-center justify-center p-4 min-h-[300px] lg:min-h-[400px]">
            {url ? (
                <>
                    <img src={url} className="object-contain max-h-full max-w-full transition-all duration-200" style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }} alt="Aadhaar Evidence" />
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white transition-colors"><ZoomIn size={18} /></button>
                        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white transition-colors"><ZoomOut size={18} /></button>
                        <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white transition-colors"><RotateCw size={18} /></button>
                    </div>
                </>
            ) : (
                <div className="text-white/30 text-center">
                    <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">Evidence Image Missing</p>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const s = status?.toUpperCase();
    if (s === 'IN_PROGRESS' || s === 'INITIATED') return <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"><Clock size={10} /> In Progress</div>;
    if (s === 'COMPLETED' || s === 'VERIFIED' || s === 'CLEARED') return <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Verified</div>;
    return <div className="bg-slate-700 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">{status}</div>;
};

export default AadhaarDetails;
