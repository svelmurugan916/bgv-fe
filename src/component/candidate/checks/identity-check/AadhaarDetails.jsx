// src/components/identity-check/components/AadhaarDetails.jsx
import React, {useState, useEffect} from 'react';
import DataComparisonField from './DataComparisonField.jsx';
import {
    ShieldCheck,
    ExternalLink,
    User,
    Smartphone,
    MapPin,
    Calendar,
    Info,
    History,
    Clock,
    RotateCcwIcon, Loader2, AlertCircle, CheckCircle2, QrCode, Download, ZoomIn, ZoomOut, RotateCw, ChevronRightIcon,
    Hash
} from 'lucide-react';
import { format } from 'date-fns';
import {formatFullDateTime} from "../../../../utils/date-util.js";

const AadhaarDetails = ({ data, onSendDigilockerLink }) => {
    const { claimedDetails, overallStatus, isLinkSent } = data;
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    // State for image manipulation
    const [imageScale, setImageScale] = useState(1);
    const [imageRotation, setImageRotation] = useState(0);

    // Check if we have successfully received DigiLocker data
    const isDigilockerVerified = overallStatus !== 'IN_PROGRESS';
    const digiData = data;
    const uploadedDocUrl = digiData?.uploadedDocuments?.[0]?.url;


    const handleAction = async () => {
        setStatus('loading');
        setErrorMessage('');

        try {
            const success = await onSendDigilockerLink();
            if(success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(err?.message || "Failed to send verification link. Please try again.");
        }
    };

    // Helper for image controls
    const zoomIn = () => setImageScale(prev => Math.min(prev + 0.1, 3));
    const zoomOut = () => setImageScale(prev => Math.max(prev - 0.1, 0.5));
    const rotateImage = () => setImageRotation(prev => (prev + 90) % 360);

    if (!isDigilockerVerified) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* 1. Link History Status Card */}
                {isLinkSent && (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-sm">
                        {/* Changed to a clean 2x2 grid */}
                        <div className="grid grid-cols-4 gap-x-10 gap-y-6">

                            {/* 1. Mobile Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-50 relative shrink-0">
                                    <Smartphone size={18} />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                                        <History size={8} />
                                    </div>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Sent To Mobile</p>
                                    <p className="text-xs font-bold text-slate-700 truncate">{data.linkSentToMobile || "-"}</p>
                                </div>
                            </div>

                            {/* 2. Timestamp Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 shrink-0">
                                    <Calendar size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Sent At</p>
                                    <p className="text-xs font-bold text-slate-700 truncate">
                                        {data.linkSentAt ? formatFullDateTime(data.linkSentAt) : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* 3. Expiry Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-400 shadow-sm border border-rose-50 shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-wider">Expires At</p>
                                    <p className="text-xs font-bold text-rose-600 truncate">
                                        {data.linkExpiresAt ? formatFullDateTime(data.linkExpiresAt) : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* 4. Session Status */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-50 shrink-0">
                                    <Info size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Session Status</p>
                                    <p className={`text-xs font-black leading-tight ${data?.finalVerifierStatus === 'INITIATED' ? 'text-amber-600' : 'text-indigo-600'}`}>
                                        {data?.finalVerifierStatus === 'INITIATED'
                                            ? "Awaiting Candidate Action"
                                            : "Authentication In Progress"
                                        }
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative bg-slate-800 rounded-[2rem] overflow-hidden shadow-xl flex items-center justify-center p-4 min-h-[300px] lg:min-h-[400px]">
                        {uploadedDocUrl ? (
                            <>
                                <img
                                    src={uploadedDocUrl}
                                    alt="Aadhaar Document"
                                    className="object-contain max-h-full max-w-full transition-all duration-100 ease-out"
                                    style={{ transform: `scale(${imageScale}) rotate(${imageRotation}deg)` }}
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button onClick={zoomIn} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-100"><ZoomIn size={18} /></button>
                                    <button onClick={zoomOut} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-100"><ZoomOut size={18} /></button>
                                    <button onClick={rotateImage} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-100"><RotateCw size={18} /></button>
                                </div>
                            </>
                        ) : (
                            <div className="text-white text-center">
                                <AlertCircle size={48} className="mx-auto mb-2" />
                                <p>No document image available.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Instructional Alert */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                    <Info className="text-amber-600 shrink-0" size={20} />
                    <p className="text-sm text-amber-800 leading-relaxed font-medium">
                        This Aadhaar requires <strong>DigiLocker</strong> validation. {isLinkSent ? "A link has already been dispatched." : "Initiate the process by sending a secure link."}
                    </p>
                </div>

                {/* 3. Data Comparison Fields */}
                <div className="grid grid-cols-1 gap-4">
                    <DataComparisonField
                        label="Aadhaar Number"
                        candidateClaim={claimedDetails?.idNumber?.candidateClaimedData || 'Not Provided'}
                        systemVerifiedData="Pending Validation"
                        isMatch={null}
                    />
                    <DataComparisonField
                        label="Candidate Name (Extracted)"
                        candidateClaim={claimedDetails?.fullName?.candidateClaimedData || 'Not Provided'}
                        systemVerifiedData="Pending Validation"
                        isMatch={null}
                    />
                    <DataComparisonField
                        label="Date of Birth"
                        candidateClaim={claimedDetails?.dateOfBirth?.candidateClaimedData ? format(new Date(claimedDetails.dateOfBirth.candidateClaimedData), 'dd-MM-yyyy') : 'Not Provided'}
                        systemVerifiedData="Pending Validation"
                        isMatch={null}
                    />
                </div>

                {/* 4. Feedback & Action Area */}
                <div className="space-y-4">
                    {/* API Feedback Messages */}
                    {status === 'success' && (
                        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl animate-in zoom-in-95">
                            <CheckCircle2 size={18} />
                            <p className="text-xs font-bold uppercase tracking-tight">Verification link sent successfully!</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl animate-in shake-1">
                            <AlertCircle size={18} />
                            <p className="text-xs font-bold uppercase tracking-tight">{errorMessage}</p>
                        </div>
                    )}

                    {isLinkSent && status === 'idle' && (
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <div className="h-px bg-slate-100 flex-1"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Wanna send again?</span>
                            <div className="h-px bg-slate-100 flex-1"></div>
                        </div>
                    )}

                    <button
                        onClick={handleAction}
                        disabled={status === 'loading'}
                        className={`w-full flex items-center justify-center gap-3 font-black py-5 px-6 rounded-[1.5rem] shadow-lg transition-all active:scale-[0.98] group
                            ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}
                            ${isLinkSent
                            ? 'bg-white border-2 border-[#5D4591] text-[#5D4591] hover:bg-slate-50 shadow-slate-100'
                            : 'bg-[#5D4591] text-white hover:bg-[#4a3675] shadow-purple-100'
                        }`}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="uppercase tracking-wider text-sm">Processing Request...</span>
                            </>
                        ) : isLinkSent ? (
                            <>
                                <RotateCcwIcon size={18} className="group-hover:rotate-[-45deg] transition-transform" />
                                <span className="uppercase tracking-wider text-sm">Resend Verification Link</span>
                            </>
                        ) : (
                            <>
                                <ExternalLink size={18} />
                                <span className="uppercase tracking-wider text-sm">Send DigiLocker Verification Link</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // --- PHASE 2: PREMIUM VERIFIED VIEW (Post-DigiLocker) ---
    const xml = digiData?.aadhaar_xml_data;
    const meta = digiData?.digilocker_metadata;

    // Determine gender string from XML data
    const getGenderDisplay = (genderCode) => {
        if (!genderCode) return 'N/A';
        switch (genderCode.toUpperCase()) {
            case 'M': return 'Male';
            case 'F': return 'Female';
            case 'T': // Transgender
            case 'O': // Other
                return 'Other';
            default: return genderCode;
        }
    };

    // Extract relevant address components
    const addressComponents = xml?.address;
    const formattedAddress = addressComponents ? [
        addressComponents.house,
        addressComponents.street,
        addressComponents.locality,
        addressComponents.landmark,
        addressComponents.vtc,
        addressComponents.subdist,
        addressComponents.district,
        addressComponents.state,
        addressComponents.country,
        addressComponents.zip
    ].filter(Boolean).join(', ') : xml?.full_address || 'N/A';


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Section: Aadhaar Image and Profile Header */}
            <AADHAARImageDetails claimedDetails={claimedDetails} digiData={digiData} />
            {/* Detailed Comparison Grid */}
            <div className="space-y-4">
                <DataComparisonField
                    label="Full Name"
                    candidateClaim={claimedDetails?.fullName?.candidateClaimedData || 'Not Provided'}
                    systemVerifiedData={xml?.full_name}
                    isMatch={claimedDetails?.fullName?.candidateClaimedData?.toLowerCase() === xml?.full_name?.toLowerCase()}
                    icon={<User size={10}/>}
                    comparisonScore={data?.nameMatchScore || 0}
                />
                <DataComparisonField
                    label="Aadhaar Number (Last 4 Digits)"
                    candidateClaim={claimedDetails?.idNumber?.candidateClaimedData ? `XXXXXXXX${claimedDetails.idNumber.candidateClaimedData.slice(-4)}` : 'Not Provided'}
                    systemVerifiedData={xml?.masked_aadhaar}
                    isMatch={claimedDetails?.idNumber?.candidateClaimedData?.slice(-4) === xml?.masked_aadhaar?.slice(-4)}
                    icon={<Hash size={10}/>}
                />

                <DataComparisonField
                    label="Date of Birth"
                    candidateClaim={claimedDetails?.dateOfBirth?.candidateClaimedData ? format(new Date(claimedDetails.dateOfBirth.candidateClaimedData), 'dd-MM-yyyy') : 'Not Provided'}
                    systemVerifiedData={xml?.dob ? format(new Date(xml.dob), 'dd-MM-yyyy') : 'N/A'}
                    isMatch={claimedDetails?.dateOfBirth?.candidateClaimedData === xml?.dob}
                    icon={<Calendar size={10}/>}
                />

                <DataComparisonField
                    label="Father/Spouse Name (Care Of)"
                    candidateClaim={claimedDetails?.fatherName?.candidateClaimedData || 'Not Provided'}
                    systemVerifiedData={claimedDetails?.fatherName?.systemVerifiedData || xml?.care_of || 'N/A'}
                    isMatch={claimedDetails?.fatherName?.candidateClaimedData?.toLowerCase() === (claimedDetails?.fatherName?.systemVerifiedData || xml?.care_of)?.toLowerCase()} // Simple match for now
                    icon={<User size={10}/>}
                    comparisonScore={data?.fatherNameMatchScore || 0}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                            <User size={10} /> Gender
                        </p>
                        <p className="text-sm font-bold text-slate-700">{getGenderDisplay(xml?.gender)}</p>
                        {/* Placeholder for Gender discrepancy, if candidate claimed gender is available */}
                        {claimedDetails?.gender?.candidateClaimedData && claimedDetails.gender.candidateClaimedData !== xml?.gender && (
                            <span className="text-xs text-rose-500 font-medium">Claimed: {claimedDetails.gender.candidateClaimedData}</span>
                        )}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                            <MapPin size={10} /> Zip Code
                        </p>
                        <p className="text-sm font-bold text-slate-700">{xml?.zip || 'N/A'}</p>
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <MapPin size={10} /> Full Address (Aadhaar XML)
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        {formattedAddress}
                    </p>
                    {/* Placeholder for Address match status */}
                    {/* {claimedDetails?.address?.candidateClaimedData && (
                        <p className="text-xs text-slate-500 mt-2">Address Match: <span className="font-bold text-amber-600">Minor Discrepancy (PIN matches)</span></p>
                    )} */}
                </div>
            </div>

            {/* Audit & Download Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <Calendar size={10} /> Consent & Audit Trail
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        Consent given at: {digiData.verificationTimestamp ? formatFullDateTime(digiData.verificationTimestamp) : 'N/A'} <br/>
                        IP Address: {digiData?.ipAddress || '-'} {/* Placeholder: Replace with actual IP from backend */}
                    </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <Download size={10} /> Downloads
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {digiData.verificationXmlUrl && (
                            <a href={digiData.verificationXmlUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100">
                                <Download size={14} /> Raw DigiLocker XML
                            </a>
                        )}
                        {uploadedDocUrl && (
                            <a href={uploadedDocUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100">
                                <Download size={14} /> Uploaded Document
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AadhaarDetails;

const AADHAARImageDetails = ({digiData, claimedDetails}) => {
    const [imageScale, setImageScale] = useState(1);
    const uploadedDocUrl = digiData?.uploadedDocuments?.[0]?.url;
    const [imageRotation, setImageRotation] = useState(0);

    const zoomIn = () => setImageScale(prev => Math.min(prev + 0.1, 3));
    const zoomOut = () => setImageScale(prev => Math.max(prev - 0.1, 0.5));
    const rotateImage = () => setImageRotation(prev => (prev + 90) % 360);

    const xml = digiData?.aadhaar_xml_data;
    const meta = digiData?.digilocker_metadata;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aadhaar Image Viewer */}
            <div className="relative bg-slate-800 rounded-[2rem] overflow-hidden shadow-xl flex items-center justify-center p-4 min-h-[300px] lg:min-h-[400px]">
                {uploadedDocUrl ? (
                    <>
                        <img
                            src={uploadedDocUrl}
                            alt="Aadhaar Document"
                            className="object-contain max-h-full max-w-full transition-all duration-100 ease-out"
                            style={{ transform: `scale(${imageScale}) rotate(${imageRotation}deg)` }}
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button onClick={zoomIn} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-100"><ZoomIn size={18} /></button>
                            <button onClick={zoomOut} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-100"><ZoomOut size={18} /></button>
                            <button onClick={rotateImage} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-100"><RotateCw size={18} /></button>
                        </div>
                    </>
                ) : (
                    <div className="text-white text-center">
                        <AlertCircle size={48} className="mx-auto mb-2" />
                        <p>No document image available.</p>
                    </div>
                )}
            </div>

            {/* Profile Header Card */}
            <div className="flex flex-col items-start gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-start w-full">
                    <div className="relative">
                        {digiData?.profilePictureUrl ? (
                            <img
                                src={digiData?.profilePictureUrl}
                                alt="Aadhaar Profile"
                                className="w-24 h-28 object-cover rounded-xl border-2 border-white shadow-md bg-slate-200"
                            />
                        ) : (
                            <div className="w-24 h-28 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 border-2 border-white shadow-md">
                                <User size={36} />
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                            <ShieldCheck size={14} />
                        </div>
                    </div>
                    <div className="space-y-1 pt-2 ml-4 flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Identity</p>
                        <h4 className="text-xl font-black text-slate-800">{xml?.full_name || 'N/A'}</h4>
                        <div className="flex items-center gap-2 text-slate-500">
                            <QrCode size={14} />
                            <span className="text-xs font-bold">{xml?.masked_aadhaar || claimedDetails?.idNumber?.systemVerifiedData || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Smartphone size={14} />
                            <span className="text-xs font-bold">{meta?.digilocker_metadata?.mobile_number || 'N/A'}</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md uppercase mt-2">
                                DigiLocker Authenticated
                            </span>
                        {meta?.profile_image_available && (
                            <span className="inline-block ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md uppercase">
                                    System Extracted Photo
                                </span>
                        )}
                    </div>
                </div>
                {/* Verification Path */}
                <div className="w-full pt-4 border-t border-slate-100 mt-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verification Path</p>
                    <p className="text-xs font-bold text-slate-600">Surepass <ChevronRightIcon size={10} className="inline-block mx-1" /> DigiLocker <ChevronRightIcon size={10} className="inline-block mx-1" /> UIDAI</p>
                </div>
            </div>
        </div>
    )
}