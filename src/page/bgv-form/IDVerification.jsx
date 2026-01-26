import React, { useState } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import DocCard from "./DocCard.jsx";
import ExtractedData from "./DocumentExtractedData.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {OCR_AADHAAR_UPLOAD, OCR_PAN_UPLOAD, REMOVE_DOCUMENT} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import {formatToISO} from "../../utils/date-util.js";

const IDVerification = () => {
    const { formData, updateFormData, errors, clearError, candidateId } = useForm();
    const data = formData.idVerification;
    const { authenticatedRequest } = useAuthApi();
    const documentFaceJson = {
        pan: "SINGLE",
        aadhar: "FRONT",
        aadharBack: 'BACK',
        passport: 'SINGLE'
    }

    // This is the state that controls the loaders in DocCard
    const [uploadingType, setUploadingType] = useState(null);
    const [uploadErrors, setUploadErrors] = useState({});

    const handleFileChange = async (type, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadErrors(prev => ({ ...prev, [type]: null }));
        setUploadingType(type);

        try {
            const filePayload = new FormData();
            filePayload.append('file', file);
            filePayload.append('documentSide', documentFaceJson[type]);
            let ocrUrl = type.includes("aadhar") ? OCR_AADHAAR_UPLOAD : OCR_PAN_UPLOAD;
            let url = `${ocrUrl}/${candidateId}`;
            const response = await authenticatedRequest(
                filePayload,
                url,
                METHOD.POST,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (response.status === 200) {
                const { documentId, extractedData, fileName } = response.data;
                updateFormData('idVerification', {
                    ...data,
                    [type]: {
                        ...data[type],
                        fileId: documentId,
                        fileName: fileName || file.name,
                        idNumber: extractedData?.extractedPiiData || '',
                        dob: formatToISO(extractedData?.dateOfBirth) || '',
                        isExtracted: !!extractedData
                    }
                });
                clearError('id_required');
            } else {
                setUploadErrors(prev => ({ ...prev, [type]: "Failed to process document. Please try again." }));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Upload failed. Please check file size or format.";
            setUploadErrors(prev => ({ ...prev, [type]: errorMessage }));
            console.error("Upload/Replace failed", error);
        } finally {
            setUploadingType(null);
        }
    };

    const deleteFileFromServer = async (fileId, type) => {
        try {
            const response = await authenticatedRequest({}, `${REMOVE_DOCUMENT}/${fileId}`, METHOD.DELETE);

            if (response.status === 200) {
                return true; // Success
            } else {
                setUploadErrors(prev => ({
                    ...prev,
                    [type]: "Server failed to delete the file. Please try again."
                }));
                return false;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Could not delete file from server. Please try again.";
            setUploadErrors(prev => ({
                ...prev,
                [type]: errorMessage
            }));
            console.error("Failed to delete orphaned file:", err);
            return false;
        }
    };

    const handleRemoveFile = async (type) => {
        const existingFileId = data[type].fileId;
        setUploadErrors(prev => ({ ...prev, [type]: null }));
        if (existingFileId) {
            setUploadingType(type); // Show loader
            const isDeleted = await deleteFileFromServer(existingFileId, type);
            setUploadingType(null); // Stop loader
            if (!isDeleted) return;
        }
        updateFormData('idVerification', {
            ...data,
            [type]: {
                fileId: null,
                fileName: '',
                idNumber: '',
                dob: '',
                isExtracted: false
            }
        });
    };

    const handleFieldChange = (type, field, value) => {
        updateFormData('idVerification', {
            ...data,
            [type]: { ...data[type], [field]: value }
        });
    };

    console.log('formData -- ', formData);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <FormPageHeader heading={"ID Card Verification"} helperText={"Requires a valid government issued ID"} />

            {errors.id_required && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600" id={"id_required"}>
                    <AlertCircle size={20} /><p className="text-sm uppercase font-bold">{errors.id_required}</p>
                </div>
            )}

            {errors.id_general && (
                <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest leading-none mb-1.5">ID Requirement</p>
                        <p className="text-xs font-bold text-rose-600/90 leading-relaxed">{errors.id_general}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {/* --- PAN CARD --- */}
                <DocCard
                    title="Upload PAN Card*"
                    file={data.pan.fileName}
                    processing={uploadingType === 'pan'} // Fixed: Use uploadingType
                    error={uploadErrors.pan}
                    onFileSelect={(e) => handleFileChange('pan', e)}
                    onRemove={() => handleRemoveFile('pan')}
                />
                {data.pan.isExtracted && (
                    <ExtractedData
                        idLabel="PAN Number"
                        idValue={data.pan.idNumber}
                        dobValue={data.pan.dob}
                        onIdChange={(v) => handleFieldChange('pan', 'idNumber', v)}
                        onDobChange={(v) => handleFieldChange('pan', 'dob', v)}
                    />
                )}

                {/* --- AADHAR FRONT --- */}
                <DocCard
                    title="Upload Aadharcard Front Side*"
                    file={data.aadhar.fileName}
                    error={uploadErrors.aadhar}
                    processing={uploadingType === 'aadhar'} // Fixed: Use uploadingType
                    onFileSelect={(e) => handleFileChange('aadhar', e)}
                    onRemove={() => handleRemoveFile('aadhar')}
                />

                {/* --- AADHAR BACK --- */}
                <DocCard
                    title="Upload Aadharcard Back Side*"
                    file={data.aadharBack.fileName}
                    error={uploadErrors.aadharBack}
                    processing={uploadingType === 'aadharBack'} // Fixed: Use uploadingType
                    onFileSelect={(e) => handleFileChange('aadharBack', e)}
                    onRemove={() => handleRemoveFile('aadharBack')}
                />

                {data.aadhar.isExtracted && (
                    <ExtractedData
                        idLabel="Aadhar Number"
                        idValue={data.aadhar.idNumber}
                        dobValue={data.aadhar.dob}
                        onIdChange={(v) => handleFieldChange('aadhar', 'idNumber', v)}
                        onDobChange={(v) => handleFieldChange('aadhar', 'dob', v)}
                    />
                )}

                {/* --- PASSPORT --- */}
                <DocCard
                    title="Upload Passport (Optional)"
                    file={data.passport.fileName}
                    processing={uploadingType === 'passport'} // Fixed: Use uploadingType
                    onFileSelect={(e) => handleFileChange('passport', e)}
                    onRemove={() => handleRemoveFile('passport')}
                />
            </div>

            {/* Consent Checkbox */}
            <div id={'consent'} className={`mt-10 p-4 lg:p-6 rounded-2xl border transition-all duration-300 ${errors.consent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-start gap-4">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            id="consent-check"
                            checked={data.consent}
                            onChange={(e) => {
                                updateFormData('idVerification', {...data, consent: e.target.checked});
                                if(e.target.checked) clearError('consent');
                            }}
                            className={`w-6 h-6 rounded-lg border-2 appearance-none checked:bg-[#5D4591] ${errors.consent ? 'border-red-400' : 'border-slate-300'}`}
                        />
                        {data.consent && <Check className="absolute pointer-events-none text-white left-1" size={16} strokeWidth={4} />}
                    </div>
                    <label htmlFor="consent-check" className="cursor-pointer">
                        <p className={`text-xs lg:text-sm leading-relaxed font-medium ${errors.consent ? 'text-red-700' : 'text-slate-600'}`}>
                            I confirm that I uploaded a valid government-issued photo ID.
                        </p>
                    </label>
                </div>
                {errors.consent && (
                    <div className="mt-3 ml-10 flex items-center gap-2 text-red-600">
                        <AlertCircle size={16} />
                        <span className="text-[11px] font-bold uppercase">{errors.consent}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IDVerification;
