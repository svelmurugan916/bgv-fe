import React from 'react';
import { useForm } from "../../provider/FormProvider.jsx";
import FormPageHeader from "../bgv-form/FormPageHeader.jsx";
import DocCard from "../bgv-form/DocCard.jsx";
import {AlertCircle} from "lucide-react";

const PhotoEvidenceStep = () => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const avData = formData.addressVerification;
    const photos = avData?.photos;

    const handleFile = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            updateFormData('addressVerification', {
                ...avData,
                photos: {
                    ...photos,
                    [field]: file // Keep the File object here for the API
                }
            });
            clearError(`av_${field}`);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FormPageHeader heading="Visual Evidence" helperText="Upload photos of your residence as proof of visit." />

            {(errors.av_frontDoor || errors.av_landmark) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600" id={"id_required"}>
                    <AlertCircle size={20} /><p className="text-sm uppercase">{errors.av_frontDoor || errors.av_landmark}</p>
                </div>
            )}

            <div className="space-y-4">
                <div id="av_frontDoor">
                    <DocCard
                        title="Front Door Photo *"
                        error={errors.av_frontDoor}
                        /*
                           FIX: Pass the .name string to the UI component.
                           React can render strings, but it crashes if you pass the File object.
                        */
                        file={avData?.photos?.frontDoor?.name}
                        onFileSelect={(e) => handleFile('frontDoor', e)}
                        onRemove={() => updateFormData('addressVerification', {...avData, photos: { ...photos, frontDoor: null } })}
                    />
                </div>

                <div id="av_landmark">
                    <DocCard
                        title="Landmark Photo (Nearby Shop/Street) *"
                        error={errors.av_landmark}
                        /* FIX: Pass the .name string here as well */
                        file={avData?.photos?.landmark?.name}
                        onFileSelect={(e) => handleFile('landmark', e)}
                        onRemove={() => updateFormData('addressVerification', {...avData, photos: { ...photos, landmark: null}})}
                    />
                </div>
            </div>
        </div>
    );
};

export default PhotoEvidenceStep;
