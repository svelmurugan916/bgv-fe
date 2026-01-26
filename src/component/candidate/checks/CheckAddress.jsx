import React, { useEffect, useRef, useState } from 'react';
import {
    MapPin,
    Navigation,
    Send,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    CheckCircle2,
    Clock,
    Phone,
    UserCheck,
    ShieldX,
    Home,
    ShieldAlert,
    ShieldCheck,
    Globe,
    Smartphone,
    Cpu,
    Calendar,
    AlertTriangle,
    Timer,
    History, XCircle, AlertCircle, ShieldQuestion, UserIcon
} from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import {ADDRESS_CHECK_DETAILS, SEND_ADDRESS_VERIFICATION} from "../../../constant/Endpoint.tsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
import SimpleLoader from "../../common/SimpleLoader.jsx";
import {useParams} from "react-router-dom";
import {formatFullDateTime} from "../../../utils/date-util.js";
import SecureImage from "../../secure-document-api/SecureImage.jsx";
import PhotoPreview from "../../common/PhotoPreview.jsx";
import EditAddressModal from "./EditAddressModal.jsx";

const CheckAddress = ({ addressId }) => {
    const [loading, setLoading] = useState(true);
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);
    const [addressData, setAddressData] = useState({});
    const { id } = useParams();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchAddressDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${ADDRESS_CHECK_DETAILS}/${addressId}`, METHOD.GET);
            if (response.status === 200) {
                setAddressData(response.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchAddressDetails();
        }
    }, [addressId, authenticatedRequest]);

    const sendAddressVerificationLink = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, SEND_ADDRESS_VERIFICATION?.replace("{candidateId}", id)?.replaceAll("{addressId}", addressId), METHOD.GET);
            if (response.status === 200) {
                fetchAddressDetails();
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    const distanceText = (distanceInMeter) => {
        if(distanceInMeter < 1000) return `${distanceInMeter} Meter(s)`;
        const distanceInKm = distanceInMeter / 1000;
        return `${distanceInKm.toFixed(1)} Km(s)`;
    }

    const hasCoordinates = addressData?.addressCandidateSubmittedResponse?.lat && addressData?.addressCandidateSubmittedResponse?.lng;
    const isLinkSent = addressData.isLinkSent;
    const isLinkExpired = addressData.isLinkExpired || (addressData.linkExpiresAt && new Date(addressData.linkExpiresAt) < new Date());

    const statusConfig = {
        'CLEARED': {
            bg: 'bg-emerald-500',
            lightBg: 'bg-emerald-50',
            text: 'text-emerald-700',
            icon: <ShieldCheck size={16} />,
            label: 'Verification Cleared'
        },
        'INSUFFICIENCY': {
            bg: 'bg-rose-500',
            lightBg: 'bg-rose-50',
            text: 'text-rose-700',
            icon: <ShieldX size={16} />,
            label: 'Marked as Insufficiency'
        },
        'NEEDS_REVIEW': {
            bg: 'bg-orange-500',
            lightBg: 'bg-orange-50',
            text: 'text-orange-700',
            icon: <ShieldQuestion size={16} />,
            label: 'Manual Review Required'
        },
        'WAITING_FOR_CANDIDATE': {
            bg: 'bg-rose-500',
            lightBg: 'bg-rose-50',
            text: 'text-rose-700',
            icon: <UserIcon size={16} />,
            label: 'Source Stopper: Awaiting Candidate Action'
        }
    };

    const currentStatus = statusConfig[addressData.status] || {
        bg: 'bg-slate-400',
        lightBg: 'bg-slate-50',
        text: 'text-slate-600',
        icon: <Clock size={16} />,
        label: 'Verification Pending'
    };

    if (loading) return <SimpleLoader size="lg" className="py-20" />;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {addressData.status && (
                <div className={`flex items-center justify-between px-8 py-3 ${currentStatus.lightBg} border-b border-slate-100`}>
                    <div className={`flex items-center gap-2 ${currentStatus.text}`}>
                        {currentStatus.icon}
                        <span className="text-[11px] font-black uppercase tracking-[0.1em]">{currentStatus.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">System Verdict</span>
                        <div className={`w-2 h-2 rounded-full ${currentStatus.bg} shadow-sm`} />
                    </div>
                </div>
            )}

            {/* 1. Header Section */}
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-slate-800">Address Verification</h2>
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 
                            ${hasCoordinates ? 'bg-emerald-50 text-emerald-600' :
                            isLinkExpired ? 'bg-rose-50 text-rose-600' :
                                isLinkSent ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${hasCoordinates ? 'bg-emerald-500 animate-pulse' : isLinkExpired ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
                            {hasCoordinates ? 'Verification Received' : isLinkExpired ? 'Link Expired' : isLinkSent ? 'Awaiting Submission' : 'Invitation Pending'}
                        </div>
                        {/* NEW: Verification Outcome Status Badge */}


                    </div>
                    <p className="text-sm text-slate-400 font-medium">Physical verification via geo-tagging and site photography.</p>
                </div>

                {/*{addressData.status && (*/}
                {/*    <div className={`px-2.5 py-1  text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 */}
                {/*                ${addressData.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :*/}
                {/*        addressData.status === 'INSUFFICIENCY' ? 'bg-rose-50 text-rose-700 border-rose-200' :*/}
                {/*            addressData.status === 'NEEDS_REVIEW' ? 'bg-orange-50 text-orange-700 border-orange-200' :*/}
                {/*                addressData.status === 'WAITING_FOR_CANDIDATE' ? 'bg-rose-50 text-rose-700 border-rose-200' :*/}
                {/*                    'bg-amber-50 text-amber-700 border-amber-200'}`}>*/}

                {/*        <div className={`w-1.5 h-1.5 rounded-full */}
                {/*                    ${addressData.status === 'CLEARED' ? 'bg-emerald-500' :*/}
                {/*            addressData.status === 'INSUFFICIENCY' ? 'bg-rose-500' :*/}
                {/*                addressData.status === 'NEEDS_REVIEW' ? 'bg-orange-500' :*/}
                {/*                    addressData.status === 'WAITING_FOR_CANDIDATE' ? 'bg-rose-500' :*/}
                {/*                        'bg-amber-500'}`}*/}
                {/*        />*/}

                {/*        {addressData.status === 'CLEARED' ? 'Cleared' :*/}
                {/*            addressData.status === 'INSUFFICIENCY' ? 'Insufficiency' :*/}
                {/*                addressData.status === 'NEEDS_REVIEW' ? 'Needs Review' :*/}
                {/*                    addressData.status === 'WAITING_FOR_CANDIDATE' ? 'Waiting for Candidate' : 'Pending'}*/}
                {/*    </div>*/}
                {/*)}*/}

                {addressData.status !== 'CLEARED' && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#5D4591] bg-[#F9F7FF] border border-[#5D4591]/20 rounded-xl hover:bg-[#F0EDFF] transition-all"
                        >
                            Edit Details
                        </button>

                        <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                            Unable to Verify
                        </button>
                        <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all">
                            Clear Check
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Detailed Information Grid (Candidate Input) */}
            <div className="p-8 bg-slate-50/40 border-b border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Address Type</p>
                        <div className="flex items-center gap-2 text-slate-700">
                            <Home size={14} className="text-[#5D4591]" />
                            <p className="text-xs font-bold capitalize">{addressData.addressType?.toLowerCase()} Address</p>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Address</p>
                        <div className="flex gap-2 text-slate-700">
                            <Home size={14} className="text-[#5D4591]" />
                            <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                {addressData.addressLine1},<br />
                                {addressData.addressLine2 && <>{addressData.addressLine2},<br /></>}
                                {addressData.city},<br />
                                {addressData.state},<br />
                                {addressData.country} - {addressData.pinCode}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration of Stay</p>
                        <div className="flex items-center gap-2 text-slate-700">
                            <Clock size={14} className="text-[#5D4591]" />
                            <p className="text-xs font-bold">
                                {new Date(addressData.stayingFrom).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} -
                                {addressData.isCurrentAddress ? <span className="text-emerald-600 ml-1">Present</span> : addressData.stayingTo}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verification Contact</p>
                        <div className="flex items-center gap-2 text-slate-700">
                            {addressData.isSelfContact ? (
                                <><UserCheck size={14} className="text-emerald-500" /><p className="text-xs font-bold">Self Verified</p></>
                            ) : (
                                <><Phone size={14} className="text-[#5D4591]" /><p className="text-xs font-bold">{addressData?.addressCandidateSubmittedResponse?.siteContactMobile}</p></>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Verification Evidence Section */}
            <div className="p-8">
                {hasCoordinates ? (
                    /* DATA SUBMITTED STATE */
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* MAP VIEW */}

                            {/* MAP VIEW - Occupies 2 columns */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* The Map Container */}
                                <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden shadow-sm h-[450px] relative group">
                                    <iframe
                                        title="Verification Map"
                                        width="100%" height="100%" frameBorder="0" scrolling="no"
                                        src={`https://maps.google.com/maps?q=${addressData?.addressCandidateSubmittedResponse.lat},${addressData?.addressCandidateSubmittedResponse.lng}&z=15&output=embed`}
                                        className="grayscale-[0.1] contrast-[1.05]"
                                    />

                                    {/* Floating GPS Overlay */}
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                                <Navigation size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">GPS Coordinates</p>
                                                <p className="text-xs font-bold text-slate-800">{addressData?.addressCandidateSubmittedResponse?.lat}, {addressData.addressCandidateSubmittedResponse?.lng}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg text-[#5D4591] hover:scale-110 transition-transform">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>

                                {/* NEW: CAPTURED ADDRESS BAR BELOW MAP */}

                            </div>

                            {/* PHOTOS SECTION */}
                            <div className="lg:col-span-2 grid grid-cols-2 gap-4">

                                <div className="col-span-2">
                                    <div className="flex items-center justify-between px-1 mb-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Photographs</h4>
                                        {
                                            addressData.status !== "CLEARED" && (
                                                <button className="flex items-center gap-2 bg-[#F9F7FF] text-[#5D4591] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F0EDFF] transition-all cursor-pointer">
                                                    <Send size={12} /> Re-send Link
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                                <PhotoPreview label="Front Gate / Entrance" src={addressData?.addressCandidateSubmittedResponse?.frontDoorImageUrl} />
                                <PhotoPreview label="Residential View" src={addressData?.addressCandidateSubmittedResponse?.residentialImageUrl} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-5 flex items-start gap-4 shadow-sm">
                                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                        <MapPin size={20} className="text-[#5D4591]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Captured Coordination Location</p>
                                            <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded">GPS Derived</div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                            {addressData?.addressCandidateSubmittedResponse.reverseGeocodedAddress || "Fetching location details..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INTEGRITY AUDIT SECTION */}
                        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8">
                            <h4 className="text-[11px] font-black text-[#5D4591] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <ShieldAlert size={16} /> Verification Integrity Audit
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Smartphone size={10}/> Link Sent Details</p>
                                    <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{formatFullDateTime(addressData.linkSentAt)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Calendar size={10}/> Captured At</p>
                                    <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.addressCandidateSubmittedResponse?.capturedAt)}</p>
                                    <div className="flex items-center gap-1 mt-1 text-emerald-600">
                                        <CheckCircle2 size={10}/><span className="text-[9px] font-bold uppercase tracking-tighter">Verified Session</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Globe size={10}/> Network Metadata</p>
                                    <p className="text-xs font-bold text-slate-700">{addressData.addressCandidateSubmittedResponse?.deviceIpAddress}</p>
                                    <div className={`flex items-center gap-1 mt-1 ${addressData.addressCandidateSubmittedResponse?.isMockLocationDetected ? 'text-rose-500' : 'text-emerald-600'}`}>
                                        {addressData.addressCandidateSubmittedResponse?.isMockLocationDetected ? <AlertTriangle size={10}/> : <Cpu size={10}/>}
                                        <span className="text-[9px] font-bold uppercase tracking-tighter">{addressData.addressCandidateSubmittedResponse?.isMockLocationDetected ? 'Mock Location' : 'Physical GPS'}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><MapPin size={10}/> Proximity Check</p>
                                    <p className="text-xs font-bold text-slate-700">{distanceText(addressData.addressCandidateSubmittedResponse?.distanceDeviation?.toFixed(0))} Deviation</p>
                                    <div className={`flex items-center gap-1 mt-1 ${addressData.addressCandidateSubmittedResponse?.isLocationMatch ? 'text-emerald-600' : 'text-amber-500'}`}>
                                        <CheckCircle2 size={10}/><span className="text-[9px] font-bold uppercase tracking-tighter">{addressData.addressCandidateSubmittedResponse?.isLocationMatch ? 'Location Match' : 'Out of Bounds'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FEEDBACK PANEL */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-[12px] p-8">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Verification Feedback</label>
                            <textarea className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#5D4591]/40 transition-all min-h-[100px] shadow-inner" placeholder="Add remarks..." />
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                                    <FileText size={16} /> Internal Proof
                                </button>
                                <button className="w-full sm:w-auto bg-slate-800 text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95 cursor-pointer">
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                ) : isLinkExpired ? (
                    /* CASE: LINK EXPIRED */
                    <div className="p-12 bg-rose-50/30 border-2 border-dashed border-rose-200 rounded-[2.5rem] text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-sm">
                            <XCircle size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Verification Link Expired</h3>
                        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                            The security token for this address check has expired. The candidate can no longer access the verification form.
                        </p>

                        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-2xl border border-rose-100 text-left shadow-sm opacity-60">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1"><Smartphone size={10}/> Sent To</p>
                                <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-rose-100 text-left shadow-sm opacity-60">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={10}/> Sent At</p>
                                <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.linkSentAt)}</p>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-left shadow-sm">
                                <p className="text-[9px] font-black text-rose-500 uppercase mb-1 flex items-center gap-1"><AlertCircle size={10}/> Expired On</p>
                                <p className="text-xs font-bold text-rose-600">{formatFullDateTime(addressData.linkExpiresAt)}</p>
                            </div>
                        </div>

                        <button className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 flex items-center gap-3 mx-auto hover:bg-rose-700 transition-all cursor-pointer active:scale-95">
                            <Send size={16} /> Generate New Link
                        </button>
                    </div>
                )  : isLinkSent ? (
                    /* LINK SENT BUT NO DATA YET */
                    <div className="p-12 bg-[#F9F7FF]/30 border-2 border-dashed border-[#5D4591]/20 rounded-[2.5rem] text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#5D4591] shadow-sm">
                            <Timer size={40} className="animate-pulse" />
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2">Awaiting Candidate Submission</h3>
                        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                            The verification link is active. We are waiting for the candidate to capture their location and photos.
                        </p>

                        {/* 3-Column Info Grid */}
                        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <Smartphone size={10}/> Sent To
                                </p>
                                <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <Calendar size={10}/> Sent At
                                </p>
                                <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.linkSentAt)}</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm">
                                <p className="text-[9px] font-black text-[#E11D48] uppercase mb-1 flex items-center gap-1">
                                    <Clock size={10}/> Expires At
                                </p>
                                <p className="text-xs font-bold text-rose-500">{formatFullDateTime(addressData.linkExpiresAt)}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <button onClick={sendAddressVerificationLink} className=" bg-white text-[#5D4591] border border-[#5D4591]/20 px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-[#F9F7FF] transition-all cursor-pointer active:scale-95">
                                <History size={16} /> Re-send Verification Link
                            </button>
                            <p className="text-[10px] text-slate-400 font-medium italic">
                                Note: Re-sending the link will invalidate the previous one.
                            </p>
                        </div>
                    </div>

                ) : (
                    /* NO LINK SENT YET */
                    <div className="p-12 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                        <div className="w-20 h-20 bg-[#F9F7FF] rounded-full flex items-center justify-center mx-auto mb-6 text-[#5D4591]">
                            <MapPin size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No Address Data Submitted</h3>
                        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">The candidate has not completed the digital address verification yet.</p>
                        <button onClick={sendAddressVerificationLink} className="bg-[#5D4591] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 mx-auto hover:bg-[#4a3675] transition-all cursor-pointer">
                            <Send size={16} /> Send Verification Link
                        </button>
                    </div>
                )}
            </div>
            <EditAddressModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                addressData={addressData}
                onUpdateSuccess={fetchAddressDetails} // Refresh data after update
            />
        </div>
    );
};


export default CheckAddress;
