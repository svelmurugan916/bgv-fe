import React from 'react';
import {
    ShieldCheck, User, MapPin, Fingerprint,
    GraduationCap, Briefcase, Users, AlertCircle,
    Mail, Phone, Building2, FileText, CheckCircle2,
    Calendar, School, IdCard, User2, User2Icon, SparklesIcon
} from 'lucide-react';
import { useForm } from "../../provider/FormProvider.jsx";

const Review = ({ checks = [], profilePictureUrl }) => {
    const { formData, updateFormData, errors, clearError } = useForm();

    const handleConsentChange = (e) => {
        const isChecked = e.target.checked;
        updateFormData('consent', isChecked);
        if (isChecked) clearError('consent');
    };

    const isVisible = (code) => checks.includes(code);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header Section */}
            {/* --- OPTIMIZED RESPONSIVE HEADER --- */}
            <div className="mb-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Final Review</h2>
                    </div>

                    {/* Badge: Icon only on mobile, Full text on sm (640px) and up */}
                    <div className="px-3 py-2 sm:px-4 sm:py-2 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100 flex items-center gap-2 shrink-0 shadow-sm shadow-emerald-500/5">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <p className="hidden sm:block text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                            Ready for Submission
                        </p>
                    </div>
                </div>
                <p className="text-sm text-slate-500 mt-1 font-medium leading-tight max-w-[280px] sm:max-w-none">
                    Please verify your information before secure submission.
                </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. CANDIDATE PROFILE */}
                <SectionSummary title="Candidate Profile" icon={<User size={18}/>} status="Primary">
                    <div className="flex items-center gap-4 mb-6 p-1">
                        <div className="w-16 h-16 rounded-2xl  text-white flex items-center justify-center text-xl font-black shadow-lg shadow-[#5D4591]/20 border-4 border-white">
                            {profilePictureUrl ? (
                                <img
                                    src={profilePictureUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover w-16 h-16 rounded-2xl"
                                />
                            ) : (
                                <User2Icon
                                    size={22}
                                    strokeWidth={1.5}
                                    className="text-[#5D4591] mt-1 opacity-80"
                                />
                            )}
                        </div>
                        <div>
                            <p className="text-base font-black text-slate-900 leading-tight">
                                {formData.basic.firstName} {formData.basic.lastName}
                            </p>
                            <p className="text-[10px] text-[#5D4591] uppercase font-black tracking-widest mt-1">Verified Identity</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <DataRow icon={<Mail size={14}/>} label="Email Address" value={formData.basic.email} />
                        <DataRow icon={<Phone size={14}/>} label="Mobile Number" value={formData.basic.phone} />
                    </div>
                </SectionSummary>

                {/* 2. RESIDENCY */}
                {isVisible('ADDRESS') && (
                    <SectionSummary title="Residency" icon={<MapPin size={18}/>} status="Verified">
                        <div className="space-y-3">
                            {formData.basic.addresses.map((addr, i) => (
                                <DataRow
                                    key={i}
                                    icon={<MapPin size={14}/>}
                                    label={`${addr.addressType} Address`}
                                    value={`${addr.city}, ${addr.state}`}
                                    isBoxed
                                />
                            ))}
                        </div>
                    </SectionSummary>
                )}

                {/* 3. IDENTITY PROOFS */}
                {isVisible('IDENTITY') && (
                    <SectionSummary title="Identity Proofs" icon={<Fingerprint size={18}/>} status="Secured">
                        <div className="grid grid-cols-1 gap-3">
                            <IdentityStatus label="PAN Card" isUploaded={!!formData.idVerification.pan.idNumber} />
                            <IdentityStatus label="Aadhaar Card" isUploaded={!!formData.idVerification.aadhar.idNumber} />
                        </div>
                    </SectionSummary>
                )}

                {/* 4. EDUCATION */}
                {isVisible('EDUCATION') && (
                    <SectionSummary title="Education" icon={<GraduationCap size={18}/>} status="Academic">
                        <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {formData.education.map((edu, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-9 h-9 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 z-10 group-hover:border-[#5D4591] transition-colors">
                                        {edu.level === 'SSLC' || edu.level === 'HSC' ? <School size={16}/> : <GraduationCap size={16}/>}
                                    </div>
                                    <p className="text-[13px] font-black text-slate-800 leading-tight">{edu.degree || edu.level}</p>
                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{edu.college}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Calendar size={10} className="text-[#5D4591]" />
                                        <p className="text-[9px] font-black text-[#5D4591] uppercase tracking-widest">Class of {edu.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionSummary>
                )}

                {/* 5. EMPLOYMENT */}
                {isVisible('EMPLOYMENT') && (
                    <SectionSummary
                        title="Employment"
                        icon={<Briefcase size={18}/>}
                        status={formData?.employment?.isFresher ? "No Experience" : "Experience"}
                    >
                        {formData?.employment?.isFresher ? (
                            /* --- FRESHER STATUS CARD --- */
                            <div className="flex flex-col items-center justify-center p-8 bg-[#F9F7FF]/50 border-2 border-dashed border-[#5D4591]/10 rounded-[2rem] text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5D4591] mb-3">
                                    <SparklesIcon size={24} className="animate-pulse" />
                                </div>
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Fresher Candidate</h4>
                                <p className="text-[11px] text-slate-500 font-medium mt-1.5 max-w-[220px] leading-relaxed">
                                    The candidate has declared no previous professional employment history.
                                </p>
                            </div>
                        ) : (
                            /* --- EMPLOYMENT HISTORY LIST --- */
                            <div className="space-y-4">
                                {formData.employment?.details?.map((emp, i) => (
                                    <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:border-[#5D4591]/20 transition-all duration-300">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 shrink-0 group-hover:text-[#5D4591] transition-colors">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-black text-slate-800 truncate">{emp.company}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">{emp.designation}</p>

                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-[9px] font-black text-[#5D4591] uppercase tracking-tighter">
                                                    {emp.isCurrent ? 'Current Employment' : 'Previous Role'}
                                                </p>
                                                {/* Optional: Add a small date range if available */}
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                                    {emp.yearOfJoining} - {emp.isCurrent ? 'Present' : emp.yearOfRelieving}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionSummary>

                )}

                {/* 6. REFERENCES */}
                {isVisible('REFERENCE') && (
                    <SectionSummary title="References" icon={<Users size={18}/>} status="Contacts">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {formData.references.map((ref, i) => (
                                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                        <User size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black text-slate-800 truncate">{ref.name}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{ref.relationship}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionSummary>
                )}
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


            {/* Declaration Section */}
            <div className={`mt-10 p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden
                ${errors.consent ? 'border-red-200 bg-red-50' : 'border-[#5D4591]/20 bg-white shadow-2xl shadow-[#5D4591]/10'}`}>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${errors.consent ? 'bg-red-100 text-red-600' : 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/30'}`}>
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-base uppercase tracking-widest">Final Declaration</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase mt-0.5 tracking-tight">Terms of Verification</p>
                        </div>
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer group bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:border-[#5D4591]/30 transition-all flex-1 md:max-w-xl">
                        <input
                            type="checkbox"
                            checked={formData.consent || false}
                            onChange={handleConsentChange}
                            className="h-6 w-6 rounded-lg accent-[#5D4591] cursor-pointer shrink-0"
                        />
                        <p className="text-xs lg:text-sm leading-relaxed font-bold text-slate-600">
                            I certify that all information is accurate and authorize the company to conduct background verification.
                        </p>
                    </label>
                </div>
            </div>
        </div>
    );
};

/* --- REUSABLE SUB-COMPONENTS FOR 10/10 DESIGN --- */

const SectionSummary = ({ title, status, icon, children }) => (
    <div className="p-6 lg:p-8 border border-slate-200 rounded-[2.5rem] bg-white hover:shadow-2xl hover:shadow-[#5D4591]/5 transition-all duration-500 group">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#5D4591] group-hover:text-white transition-all duration-500 shadow-sm">
                    {icon}
                </div>
                <h4 className="font-black text-slate-900 text-[13px] uppercase tracking-widest">{title}</h4>
            </div>
            <span className="text-[9px] font-black px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest border border-slate-200/50">
                {status}
            </span>
        </div>
        <div>{children}</div>
    </div>
);

const DataRow = ({ icon, label, value, isBoxed = false }) => (
    <div className={`flex items-center gap-3 ${isBoxed ? 'p-3 bg-slate-50 rounded-2xl border border-slate-100' : ''}`}>
        <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[11px] font-black text-slate-800 truncate leading-tight">{value || 'Not Provided'}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{label}</p>
        </div>
    </div>
);

const IdentityStatus = ({ label, isUploaded }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:border-emerald-200 transition-all">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                <IdCard size={16} />
            </div>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{label}</span>
        </div>
        {isUploaded ? (
            <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
            </div>
        ) : (
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Missing</span>
        )}
    </div>
);

export default Review;
