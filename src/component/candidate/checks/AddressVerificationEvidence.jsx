import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock, Cpu,
    ExternalLink, Globe,
    History,
    MapPin,
    Navigation,
    Send,
    ShieldAlert,
    Smartphone, Timer, XCircle,
    User, Users, Home // Added these icons
} from "lucide-react";
import {formatFullDateTime} from "../../../utils/date-util.js";
import PhotoPreview from "../../common/PhotoPreview.jsx";
import React from "react";
import {SEND_ADDRESS_VERIFICATION} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {useParams} from "react-router-dom";

const AddressVerificationEvidence = ({addressData, setLoading, fetchAddressDetails, addressId}) => {
    const {authenticatedRequest} = useAuthApi();
    const { id } = useParams();
    const hasCoordinates = addressData?.addressCandidateSubmittedResponse?.lat && addressData?.addressCandidateSubmittedResponse?.lng;
    const isLinkSent = addressData.isLinkSent;
    const isLinkExpired = addressData.isLinkExpired || (addressData.linkExpiresAt && new Date(addressData.linkExpiresAt) < new Date());
    const isLinkResent = (hasCoordinates && addressData.isSubmissionPending === true);

    const sendAddressVerificationLink = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, SEND_ADDRESS_VERIFICATION?.replace("{candidateId}", id)?.replaceAll("{addressId}", addressId), METHOD.GET);
            if (response.status === 200) {
                await fetchAddressDetails();
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

    return (
        <>
            {(hasCoordinates) ? (
                /* DATA SUBMITTED STATE */
                <div className="space-y-8">
                    {isLinkResent && (
                        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm relative">
                                        <Smartphone size={18} />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                                            <History size={8} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Link Re-Sent To</p>
                                        <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Sent At</p>
                                        <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.linkSentAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-rose-400 uppercase">Expires At</p>
                                        <p className="text-xs font-bold text-rose-600">{formatFullDateTime(addressData.linkExpiresAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {
                        hasCoordinates && (
                            <>
                                {/* --- SECTION HEADING: DIGITAL SITE EVIDENCE --- */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-[#F9F7FF] border border-[#5D4591]/10 rounded-xl flex items-center justify-center text-[#5D4591] shadow-sm">
                                            <Navigation size={20}  />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-[13px] font-black text-[#5D4591] uppercase leading-none">
                                                    Digital Site Evidence
                                                </h4>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5" title="Candidate Submitted Field Data & Metadata">
                                                Candidate Submitted Field Data & Metadata
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                                        <div className="flex flex-col items-end">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Signal Accuracy</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-700">High Precision (GPS)</span>
                                                <div className="flex gap-0.5">
                                                    <div className="w-1 h-2 bg-emerald-500 rounded-full" />
                                                    <div className="w-1 h-2 bg-emerald-500 rounded-full" />
                                                    <div className="w-1 h-2 bg-emerald-500 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    {/* MAP VIEW */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden shadow-sm h-[450px] relative group">
                                            <iframe
                                                title="Verification Map"
                                                width="100%" height="100%" frameBorder="0" scrolling="no"
                                                src={`https://maps.google.com/maps?q=${addressData?.addressCandidateSubmittedResponse.lat},${addressData?.addressCandidateSubmittedResponse.lng}&z=15&output=embed`}
                                                className="grayscale-[0.1] contrast-[1.05]"
                                            />

                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                                        <Navigation size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase">GPS Coordinates</p>
                                                        <p className="text-xs font-bold text-slate-800">{addressData?.addressCandidateSubmittedResponse?.lat?.toFixed(6)}, {addressData.addressCandidateSubmittedResponse?.lng?.toFixed(6)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg text-[#5D4591] hover:scale-110 transition-transform">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* PHOTOS SECTION */}
                                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-between px-1 mb-2">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Photographs</h4>
                                                {
                                                    addressData.status !== "CLEARED" && (
                                                        <button onClick={sendAddressVerificationLink} className="flex items-center gap-2 bg-[#F9F7FF] text-[#5D4591] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F0EDFF] transition-all cursor-pointer">
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

                                {/* NEW: LOCATION & RESPONDENT DETAILS ROW */}
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    {/* Left: Location Bar */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-5 flex items-start gap-4 shadow-sm h-full">
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

                                    {/* Right: Respondent & Ownership Details */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-5 flex items-center shadow-sm h-full">
                                            <div className="grid grid-cols-3 w-full divide-x divide-slate-200">
                                                {/* Respondent Name */}
                                                <div className="px-4 first:pl-0">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <User size={10} className="text-[#5D4591]" /> Respondent
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-700 truncate" title={addressData?.addressCandidateSubmittedResponse?.respondentName}>
                                                        {addressData?.addressCandidateSubmittedResponse?.respondentName || "Not Provided"}
                                                    </p>
                                                </div>

                                                {/* Relationship */}
                                                <div className="px-4">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <Users size={10} className="text-[#5D4591]" /> Relationship
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-700 truncate">
                                                        {addressData?.addressCandidateSubmittedResponse?.respondentRelationship || "N/A"}
                                                    </p>
                                                </div>

                                                {/* Ownership */}
                                                <div className="px-4 last:pr-0">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <Home size={10} className="text-[#5D4591]" /> Ownership
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-white border border-[#5D4591]/10 rounded text-[9px] font-black text-[#5D4591] uppercase">
                                                            {addressData?.addressCandidateSubmittedResponse?.ownershipType || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Audit Section */}
                                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8">
                                    <h4 className="text-[11px] font-black text-[#5D4591] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <ShieldAlert size={16} /> Verification Integrity Audit
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Smartphone className={"text-[#5D4591]"} size={10}/> Link Sent Details</p>
                                            <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{formatFullDateTime(addressData.linkSentAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Calendar className={"text-[#5D4591]"} size={10}/> Captured At</p>
                                            <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.addressCandidateSubmittedResponse?.capturedAt)}</p>
                                            <div className="flex items-center gap-1 mt-1 text-emerald-600">
                                                <CheckCircle2 size={10}/><span className="text-[9px] font-bold uppercase tracking-tighter">Verified Session</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Globe className={"text-[#5D4591]"} size={10}/> Network Metadata</p>
                                            <p className="text-xs font-bold text-slate-700">{addressData.addressCandidateSubmittedResponse?.deviceIpAddress}</p>
                                            <div className={`flex items-center gap-1 mt-1 ${addressData.addressCandidateSubmittedResponse?.isMockLocationDetected ? 'text-rose-500' : 'text-emerald-600'}`}>
                                                {addressData.addressCandidateSubmittedResponse?.isMockLocationDetected ? <AlertTriangle size={10}/> : <Cpu size={10}/>}
                                                <span className="text-[9px] font-bold uppercase tracking-tighter">{addressData.addressCandidateSubmittedResponse?.isMockLocationDetected ? 'Mock Location' : 'Physical GPS'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1"><MapPin className={"text-[#5D4591]"} size={10}/> Proximity Check</p>
                                            <p className="text-xs font-bold text-slate-700">{distanceText(addressData.addressCandidateSubmittedResponse?.distanceDeviation?.toFixed(0))} Deviation</p>
                                            <div className={`flex items-center gap-1 mt-1 ${addressData.addressCandidateSubmittedResponse?.isLocationMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                                                <CheckCircle2 size={10}/><span className="text-[9px] font-bold uppercase tracking-tighter">{addressData.addressCandidateSubmittedResponse?.isLocationMatch ? 'Location Match' : 'Out of Bounds(Manual Verification Required)'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
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
        </>
    )
}

export default AddressVerificationEvidence
