import React from 'react';
import { Info, UserCheck, Mail, Phone, Building2, Users, Calendar } from 'lucide-react';
import { useForm } from "../../provider/FormProvider.jsx";
import FormPageHeader from "./FormPageHeader.jsx";
import InputComponent from "./InputComponent.jsx";
import {EMAIL_REGEX, PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";

const References = () => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const data = formData.references;

    const handleChange = (index, field, value) => {
        const newRefs = [...data];
        newRefs[index] = { ...newRefs[index], [field]: value };
        updateFormData('references', newRefs);

        // Clear error when user starts typing
        if (value) clearError(`ref_${index}_${field}`);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <FormPageHeader
                heading={"Professional References"}
                helperText={"Provide details of people who can verify your professional/academic background."}
            />

            {/* Better placed Fresher Prompt */}
            <div className="mt-6 p-4 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-2xl flex gap-3 items-center">
                <div className="bg-[#F0EDFF] p-2 rounded-lg text-[#5D4591]">
                    <Info size={18} />
                </div>
                <p className="text-xs font-medium text-[#4A3675] leading-relaxed">
                    <span className="font-bold">Fresher Tip:</span> You can provide details of your <span className="underline decoration-blue-200 underline-offset-2">College Professor, HOD, or Placement Staff</span> as your references.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-8">
                {data.map((ref, idx) => (
                    <div key={idx} id={`ref_card_${idx}`} className="px-4 py-6 sm:p-8 border border-slate-200 rounded-2xl bg-white shadow-sm relative animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-full bg-[#5D4591] text-white flex items-center justify-center text-[10px] font-bold">
                                0{idx + 1}
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reference Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Referee Name */}
                            <div id={`ref_${idx}_name`}>
                                <InputComponent
                                    label="Referee Full Name"
                                    isMandatory={true}
                                    placeholder="e.g. Dr. Robert Fox"
                                    value={ref.name}
                                    error={errors[`ref_${idx}_name`]}
                                    onChange={(v) => handleChange(idx, 'name', v)}
                                />
                            </div>

                            {/* Designation */}
                            <div id={`ref_${idx}_designation`}>
                                <InputComponent
                                    label="Referee Designation"
                                    isMandatory={true}
                                    placeholder="e.g. Senior Manager / Professor"
                                    value={ref.designation}
                                    error={errors[`ref_${idx}_designation`]}
                                    onChange={(v) => handleChange(idx, 'designation', v)}
                                />
                            </div>

                            {/* Company / Institute */}
                            <div id={`ref_${idx}_company`}>
                                <InputComponent
                                    label="Company / Institution"
                                    isMandatory={true}
                                    placeholder="e.g. Google / Stanford University"
                                    value={ref.company}
                                    error={errors[`ref_${idx}_company`]}
                                    onChange={(v) => handleChange(idx, 'company', v)}
                                />
                            </div>

                            {/* Email */}
                            <div id={`ref_${idx}_email`}>
                                <InputComponent
                                    label="Referee Email ID"
                                    isMandatory={true}
                                    placeholder="referee@company.com"
                                    value={ref.email}
                                    isValid={EMAIL_REGEX.test(ref.email)}
                                    error={errors[`ref_${idx}_email`]}
                                    onChange={(v) => handleChange(idx, 'email', v)}
                                />
                            </div>

                            {/* Phone */}
                            <div id={`ref_${idx}_phone`}>
                                <InputComponent
                                    label="Referee Phone Number"
                                    isMandatory={true}
                                    isValid={PHONE_NUMBER_REGEX.test(ref.phone)}
                                    placeholder="10 Digit Mobile No"
                                    value={ref.phone}
                                    error={errors[`ref_${idx}_phone`]}
                                    onChange={(v) => handleChange(idx, 'phone', v)}
                                />
                            </div>

                            {/* Relationship */}
                            <div id={`ref_${idx}_relationship`}>
                                <InputComponent
                                    label="Relationship"
                                    isMandatory={true}
                                    placeholder="e.g. Reporting Manager / Mentor"
                                    value={ref.relationship}
                                    error={errors[`ref_${idx}_relationship`]}
                                    onChange={(v) => handleChange(idx, 'relationship', v)}
                                />
                            </div>

                            {/* Years Known */}
                            <div id={`ref_${idx}_yearsKnown`} className="md:col-span-1">
                                <InputComponent
                                    label="Number of Years Known"
                                    isMandatory={true}
                                    placeholder="e.g. 3 Years"
                                    value={ref.yearsKnown}
                                    error={errors[`ref_${idx}_yearsKnown`]}
                                    onChange={(v) => handleChange(idx, 'yearsKnown', v)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default References;
