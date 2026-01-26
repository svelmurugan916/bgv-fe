import React from 'react';
import {
    ShieldCheck, User, MapPin, Fingerprint,
    GraduationCap, Briefcase, Users, AlertCircle,
    Mail, Phone, Building2, FileText
} from 'lucide-react';
import { useForm } from "../../provider/FormProvider.jsx";

const Review = ({ checks = [] }) => {
    const { formData, updateFormData, errors, clearError } = useForm();

    const handleConsentChange = (e) => {
        const isChecked = e.target.checked;
        updateFormData('consent', isChecked);
        if (isChecked) clearError('consent');
    };

    // Helper to check if a section should be visible
    const isVisible = (code) => checks.includes(code);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Application Review</h2>
                    <p className="text-sm text-slate-500 mt-1">Check your key details before final submission.</p>
                </div>
                <div className="hidden sm:block px-4 py-2 bg-[#5D4591]/5 rounded-2xl border border-[#5D4591]/10">
                    <p className="text-[10px] font-bold text-[#5D4591] uppercase tracking-widest">Form Progress: 100%</p>
                </div>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

                    {/* 1. Personal Details - Always Visible (Basic Info) */}
                    <SectionSummary title="Candidate Profile" icon={<User size={16}/>} status="Primary">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#5D4591]/10 flex items-center justify-center text-[#5D4591] font-bold text-base border-2 border-white shadow-sm">
                                    {formData.basic.firstName?.[0]}{formData.basic.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{formData.basic.firstName} {formData.basic.lastName}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-0.5">Full Name</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-50 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 bg-slate-50 rounded-md">
                                        <Mail size={12} className="text-slate-400 shrink-0"/>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold text-slate-700 break-all leading-tight">
                                            {formData.basic.email}
                                        </p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Email ID</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 bg-slate-50 rounded-md">
                                        <Phone size={12} className="text-slate-400 shrink-0"/>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-700 leading-tight">
                                            {formData.basic.phone}
                                        </p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Mobile Number</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionSummary>

                    {/* 2. Address Details - Filtered */}
                    {isVisible('ADDRESS') && (
                        <SectionSummary title="Residency" icon={<MapPin size={16}/>} status="Provided">
                            <div className="space-y-2">
                                {formData.basic.addresses.map((addr, i) => (
                                    <div key={i} className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-700">{addr.city}, {addr.state}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">{addr.addressType} Address</p>
                                    </div>
                                ))}
                            </div>
                        </SectionSummary>
                    )}

                    {/* 3. Identity - Filtered */}
                    {isVisible('IDENTITY') && (
                        <SectionSummary title="Identity Proofs" icon={<Fingerprint size={16}/>} status="Uploaded">
                            <div className="flex flex-wrap gap-2">
                                {formData.idVerification.pan.idNumber && (
                                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">PAN Uploaded</span>
                                    </div>
                                )}
                                {formData.idVerification.aadhar.idNumber && (
                                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Aadhar Uploaded</span>
                                    </div>
                                )}
                            </div>
                        </SectionSummary>
                    )}

                    {/* 4. Education - Filtered */}
                    {isVisible('EDUCATION') && (
                        <SectionSummary title="Education" icon={<GraduationCap size={16}/>} status="Academic">
                            <div className="space-y-3">
                                {formData.education.map((edu, i) => (
                                    <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-700">{edu.degree || edu.level}</p>
                                        <p className="text-[10px] text-slate-500 leading-tight">{edu.college}</p>
                                        <p className="text-[9px] font-bold text-[#5D4591] uppercase mt-1">Batch {edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionSummary>
                    )}

                    {/* 5. Employment - Filtered */}
                    {isVisible('EMPLOYMENT') && (
                        <SectionSummary
                            title="Employment"
                            icon={<Briefcase size={16}/>}
                            status={formData.employment?.isFresher ? "Fresher" : "Experience"}
                        >
                            {formData.employment?.isFresher ? (
                                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                                    <p className="text-xs font-bold text-slate-500">No Professional Experience</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold mt-1 tracking-widest">Applying as Fresher</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {formData.employment?.details?.map((emp, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg">
                                                <Building2 size={14} className="text-slate-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-slate-700 truncate">{emp.company}</p>
                                                <p className="text-[10px] text-slate-500 truncate">{emp.designation} • {emp.isCurrent ? 'Present' : 'Past'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </SectionSummary>
                    )}

                    {/* 6. References - Filtered */}
                    {isVisible('REFERENCE') && (
                        <SectionSummary title="References" icon={<Users size={16}/>} status="Contacts">
                            <div className="grid grid-cols-2 gap-3">
                                {formData.references.map((ref, i) => (
                                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-700 truncate">{ref.name || 'N/A'}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{ref.relationship}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionSummary>
                    )}
                </div>
            </div>

            {/* Warning Section - Adjusted for Configuration */}
            {(
                (isVisible('EDUCATION') && formData.education.some(e => e.provideLater)) ||
                (isVisible('EMPLOYMENT') && formData.employment?.details?.some(em => em.provideLater))
            ) && (
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex gap-3 items-center">
                    <FileText className="text-amber-600 shrink-0" size={20} />
                    <div>
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">Post-Submission Documents</p>
                        <p className="text-[11px] text-amber-700">You've opted to upload some certificates later. This may affect verification timelines.</p>
                    </div>
                </div>
            )}

            {/* Declaration & Consent - Always Visible */}
            <div className={`mt-10 p-8 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden
                ${errors.consent ? 'border-red-200 bg-red-50/50' : 'border-[#5D4591]/10 bg-white shadow-xl shadow-[#5D4591]/5'}`}>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-xl ${errors.consent ? 'bg-red-100 text-red-600' : 'bg-[#5D4591]/10 text-[#5D4591]'}`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Declaration</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Legal Consent</p>
                        </div>
                    </div>

                    <label className="flex items-start gap-4 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData.consent || false}
                            onChange={handleConsentChange}
                            className={`h-6 w-6 rounded-lg mt-0.5 transition-all cursor-pointer
                            ${errors.consent ? 'border-red-400 accent-red-600' : 'border-slate-300 accent-[#5D4591]'}`}
                        />
                        <p className={`text-sm leading-relaxed font-medium transition-colors ${errors.consent ? 'text-red-700' : 'text-slate-600'}`}>
                            I certify that all information provided is accurate. I authorize the company to conduct background checks including employment, education, and identity verification.
                        </p>
                    </label>

                    {errors.consent && (
                        <div className="flex items-center gap-2 mt-4 text-red-600 bg-red-100/50 w-fit px-3 py-1.5 rounded-lg">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">{errors.consent}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable Summary Component
const SectionSummary = ({ title, status, icon, children }) => (
    <div className="p-6 border border-slate-200 rounded-3xl bg-white hover:border-[#5D4591]/30 hover:shadow-lg hover:shadow-[#5D4591]/5 transition-all duration-300 group">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#5D4591] group-hover:text-white transition-all duration-500">
                    {icon}
                </div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest">{title}</h4>
            </div>
            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter 
                ${status === 'Fresher' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {status}
            </span>
        </div>
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

export default Review;
