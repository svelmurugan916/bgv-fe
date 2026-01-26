import React from 'react';
import { useForm } from "../../provider/FormProvider.jsx";
import {AlertCircle, ShieldCheck} from "lucide-react";
import FormPageHeader from "../bgv-form/FormPageHeader.jsx";
import DocCard from "../bgv-form/DocCard.jsx";

const AddressIdStep = () => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const avData = formData.addressVerification;
    console.log(errors);
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateFormData('addressVerification', { ...avData, identity: {addressId: file.name } });
            clearError('av_addressId');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FormPageHeader heading="Identity Proof" helperText="Upload a document that confirms this specific address." />
            {(errors.av_addressId) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600" id={"id_required"}>
                    <AlertCircle size={20} /><p className="text-sm uppercase">{errors.av_addressId}</p>
                </div>
            )}
            <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="text-[#5D4591]" size={20} />
                <p className="text-xs font-medium text-slate-500">Accepted: Voter ID, Gas Bill, or Electricity Bill.</p>
            </div>

            <div id="av_addressId">
                <DocCard
                    error={errors.av_addressId}
                    title="Authentic Address ID *"
                    file={avData?.identity?.addressId}
                    onFileSelect={handleFile}
                    onRemove={() => updateFormData('addressVerification', {...avData, identity:{ addressId: null}})}
                />
            </div>
        </div>
    );
};

export default AddressIdStep;
