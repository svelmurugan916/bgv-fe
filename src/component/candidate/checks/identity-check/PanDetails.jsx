import React, {useEffect, useState} from 'react';
import {
    AlertCircle, User, Calendar,
    CreditCard, CheckCircle2, RefreshCw,
    Hash, Clock, ZoomIn, ZoomOut, RotateCw, Download, Search, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { formatFullDateTime } from "../../../../utils/date-util.js";
import DataComparisonField from "./DataComparisonField.jsx";

const PanDetails = ({ data, onTriggerReVerify, fetchIdentityDetails }) => {
    const { claimedDetails, overallStatus, uploadedDocuments } = data;
    const uploadedDocUrl = uploadedDocuments?.[0]?.url;
    const isVerified = overallStatus !== 'IN_PROGRESS' && overallStatus !== 'INITIATED';

    // --- RE-VERIFY STATE MANAGEMENT ---
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer;
        if (status === 'success') {
            setCountdown(5); // Reset to 5 when success hits

            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        fetchIdentityDetails(); // Refresh the page
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Cleanup the timer if the component unmounts
        return () => clearInterval(timer);
    }, [status]);

    const checkMatch = (field) => {
        if (!isVerified) return null;
        return claimedDetails[field]?.doesMatch;
    };

    const onReVerify = async () => {
        if (status === 'loading') return;

        setStatus('loading');
        setFeedbackMessage('');

        try {
            // Calling the asynchronous prop
            const response = await onTriggerReVerify();
            console.log('response - ', response);
            if (response.status === 200) {
                setStatus('success');
                setFeedbackMessage(response?.message || "PAN Re-verification initiated successfully, Will notify you once it's done.");
            } else {
                setStatus('error');
                setFeedbackMessage(response?.message || "Failed to trigger re-verification. Please try again.");
            }
        } catch (error) {
            setStatus('error');
            setFeedbackMessage("System error: Unable to reach the verification server.");
        }
    };

    useEffect(() => {
        console.log('status changed: ', status);
    }, [status]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* --- PHASE 1: IMAGE & PROFILE HEADER --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PANImageViewer url={uploadedDocUrl} />

                <div className="flex flex-col items-start gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-start w-full z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#5D4591] shadow-sm border border-slate-100 shrink-0">
                            <CreditCard size={32} />
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Type</p>
                                <StatusBadge status={overallStatus} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800">Permanent Account Number</h4>
                            <div className="flex items-center gap-2 text-slate-500 mt-1">
                                <Hash size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {claimedDetails?.idNumber?.candidateClaimedData || 'Not Provided'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full pt-4 border-t border-slate-200 mt-auto z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verification Method</p>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <Search size={12} className="text-indigo-500" />
                                    <span>Direct NSDL/ITD Database Sync</span>
                                </div>
                            </div>
                            {!isVerified && (
                                <div className="flex items-center gap-2 text-amber-600 animate-pulse">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className="text-[10px] font-black uppercase">System Checking...</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <CreditCard className="absolute -right-6 -bottom-6 text-slate-200/30 -rotate-12" size={140} />
                </div>
            </div>

            {/* --- PHASE 2: DATA COMPARISON GRID --- */}
            <div className="space-y-4">
                <DataComparisonField
                    label="Full Name"
                    candidateClaim={claimedDetails?.fullName?.candidateClaimedData || 'Not Provided'}
                    systemVerifiedData={isVerified ? claimedDetails?.fullName?.systemVerifiedData : 'Pending Validation...'}
                    isMatch={checkMatch('fullName')}
                    icon={<User size={10}/>}
                    comparisonScore={data?.nameMatchScore || 0}
                />
                <DataComparisonField
                    label="Date of Birth"
                    candidateClaim={claimedDetails?.dateOfBirth?.candidateClaimedData ? format(new Date(claimedDetails.dateOfBirth.candidateClaimedData), 'dd-MM-yyyy') : 'Not Provided'}
                    systemVerifiedData={isVerified ? (claimedDetails?.dateOfBirth?.systemVerifiedData ? format(new Date(claimedDetails.dateOfBirth.systemVerifiedData), 'dd-MM-yyyy') : 'N/A') : 'Checking Database...'}
                    isMatch={checkMatch('dateOfBirth')}
                    icon={<Calendar size={10}/>}
                />
                <DataComparisonField
                    label="PAN Number"
                    candidateClaim={claimedDetails?.idNumber?.candidateClaimedData}
                    systemVerifiedData={isVerified ? (claimedDetails?.idNumber?.systemVerifiedData || 'VALID') : 'Verifying Number...'}
                    isMatch={checkMatch('idNumber')}
                    icon={<Hash size={10}/>}
                />
            </div>

            {status !== 'idle' && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-in zoom-in-95 duration-300 ${
                    status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        status === 'loading' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                            'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                    {/* Dynamic Icon */}
                    <div className="shrink-0">
                        {status === 'success' && <CheckCircle2 size={18} />}
                        {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
                        {status === 'error' && <AlertCircle size={18} />}
                    </div>

                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">
                            {status === 'success' ? 'Sync Successful' :
                                status === 'loading' ? 'Syncing Database' :
                                    'Verification Error'}
                        </p>
                        <p className="text-xs font-bold leading-tight">
                            {status === 'loading'
                                ? "Establishing connection to Income Tax Department records..."
                                : status === 'success'
                                    ? `${feedbackMessage} Page will refresh to show updated data.`
                                    : feedbackMessage}
                        </p>
                    </div>

                    {/* Status Indicators & Countdown */}
                    {status === 'success' && (
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">Refreshing In</span>
                                <span className="text-xs font-black leading-none">{countdown}s</span>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-emerald-200 flex items-center justify-center relative">
                                {/* Visual Progress Circle (Optional CSS Animation) */}
                                <div className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin [animation-duration:5s] [animation-iteration-count:1]"></div>
                                <RefreshCw size={12} className="text-emerald-500" />
                            </div>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="flex gap-1 items-center px-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"></span>
                        </div>
                    )}
                </div>
            )}

            {/* --- PHASE 3: AUDIT & ACTIONS --- */}
            <div className="p-5 rounded-3xl border bg-slate-50 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Proof Uploaded At</p>
                        <p className="text-xs font-bold text-slate-700">
                            {uploadedDocuments?.[0]?.proofUploadedAt ? formatFullDateTime(uploadedDocuments[0].proofUploadedAt) : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {uploadedDocUrl && (
                        <a href={uploadedDocUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                            <Download size={14} /> Download Proof
                        </a>
                    )}
                    {
                        overallStatus !== "CLEARED" && (
                            <button
                                onClick={onReVerify}
                                disabled={status === 'loading'}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg 
                            ${status === 'loading'
                                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                    : 'bg-[#5D4591] text-white hover:bg-[#4a3675] shadow-purple-100 active:scale-95'
                                }`}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span className="uppercase tracking-wider">Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={14} />
                                        <span className="uppercase tracking-wider">Trigger Re-verify</span>
                                    </>
                                )}
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const PANImageViewer = ({ url }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    return (
        <div className="relative bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl flex items-center justify-center p-4 min-h-[300px] lg:min-h-[400px]">
            {url ? (
                <>
                    <img
                        src={url}
                        alt="PAN Document"
                        className="object-contain max-h-full max-w-full transition-all duration-200"
                        style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white"><ZoomIn size={18} /></button>
                        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white"><ZoomOut size={18} /></button>
                        <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:bg-white"><RotateCw size={18} /></button>
                    </div>
                </>
            ) : (
                <div className="text-white/50 text-center">
                    <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">No Document Preview</p>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const s = status?.toUpperCase();
    if (s === 'IN_PROGRESS' || s === 'INITIATED') return <div className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter flex items-center gap-1"><Clock size={10} /> In Progress</div>;
    if (s === 'COMPLETED' || s === 'VERIFIED') return <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter flex items-center gap-1"><CheckCircle2 size={10} /> Verified</div>;
    return <div className="bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter">{status}</div>;
};

export default PanDetails;
