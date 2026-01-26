import React from 'react';
import {
    MapPin, Camera, ShieldCheck,
    Navigation, FileText, AlertCircle, Check
} from 'lucide-react';
import { useForm } from "../../provider/FormProvider.jsx";

const AVReviewStep = () => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const av = formData.addressVerification; // Accessing AddressFormData key
    const addressInfo = formData.addressVerification.addressInfo || {}; // Reference from BGV data

    const handleConsentChange = (e) => {
        const isChecked = e.target.checked;
        updateFormData('addressVerification', { ...av, consent: isChecked });
        if (isChecked) clearError('av_consent');
    };

    return (
        <div className="animate-in zoom-in-95 duration-500 pb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Verification Summary</h2>
                <p className="text-sm text-slate-500 mt-1">Review your captured location and evidence before submitting.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Location Summary */}
                <AVSection title="GPS Check-In" icon={<Navigation size={16}/>} status="Verified">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-[#5D4591] uppercase tracking-tight">Coordinates</p>
                        <p className="text-xs font-bold text-slate-700">{av.location.lat?.toFixed(6)}, {av.location.long?.toFixed(6)}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Accuracy: ±{av.location.accuracy?.toFixed(1)}m
                        </p>
                    </div>
                </AVSection>

                {/* 2. Target Address (Read Only from BGV) */}
                <AVSection title="Target Address" icon={<MapPin size={16}/>} status="Reference">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">{addressInfo.city}, {addressInfo.state}</p>
                        <p className="text-[10px] text-slate-500">{addressInfo.addressLine1}</p>
                    </div>
                </AVSection>

                {/* 3. Visual Evidence */}
                <AVSection title="Visual Proofs" icon={<Camera size={16}/>} status="Attached">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Check size={12} className="text-green-500" />
                            <p className="text-[10px] font-bold text-slate-600 uppercase">
                                {/* Access .name from the File object */}
                                {av.photos.frontDoor?.name || "Front Door Photo"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check size={12} className="text-green-500" />
                            <p className="text-[10px] font-bold text-slate-600 uppercase">
                                {/* Access .name from the File object */}
                                {av.photos.landmark?.name || "Landmark Photo"}
                            </p>
                        </div>
                    </div>
                </AVSection>

                {/* 4. Identity Document */}
                {/*<AVSection title="Identity Proof" icon={<FileText size={16}/>} status="Encrypted">*/}
                {/*    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">*/}
                {/*        <p className="text-[10px] font-bold text-slate-700 truncate">{av.identity.addressId || 'No file selected'}</p>*/}
                {/*        <p className="text-[9px] text-[#5D4591]/80 font-bold uppercase mt-1">Address Proof Document</p>*/}
                {/*    </div>*/}
                {/*</AVSection>*/}
            </div>

            {/* Consent Section (Strict matching your design) */}
            <div className={`mt-8 p-6 bg-white border rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden
                ${errors.av_consent ? 'border-red-200 bg-red-50/30' : 'border-[#5D4591]/20'}`}>

                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <ShieldCheck size={120} className="text-[#5D4591]" />
                </div>

                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className={errors.av_consent ? "text-red-500" : "text-[#5D4591]"} size={20} />
                    <span className="uppercase text-xs tracking-widest">Digital Attestation</span>
                </h3>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            checked={av.consent || false}
                            onChange={handleConsentChange}
                            className={`h-5 w-5 rounded-md transition-all cursor-pointer
                                ${errors.av_consent ? 'border-red-400 text-red-600 focus:ring-red-500' : 'border-slate-300 text-[#5D4591] focus:ring-[#5D4591]'}`}
                        />
                    </div>
                    <p className={`text-[13px] leading-relaxed font-medium transition-colors
                        ${errors.av_consent ? 'text-red-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        I confirm that I am physically present at the reported address. I understand that providing false location data or spoofed images will lead to immediate disqualification.
                    </p>
                </label>

                {errors.av_consent && (
                    <div className="flex items-center gap-1.5 mt-4 text-red-600 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{errors.av_consent}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable Summary Component (Strictly matching your SectionSummary)
const AVSection = ({ title, status, icon, children }) => (
    <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-[#5D4591]/30 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591] transition-colors">
                    {icon}
                </div>
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">{title}</h4>
            </div>
            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-tight">
                {status}
            </span>
        </div>
        <div className="pl-1">
            {children}
        </div>
    </div>
);

export default AVReviewStep;
