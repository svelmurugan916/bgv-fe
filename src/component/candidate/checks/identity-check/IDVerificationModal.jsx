import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle, X, Save } from 'lucide-react';
import {useForm} from "../../../../provider/FormProvider.jsx";
import {
    CREATE_IDENTITY_CHECK, GET_IDENTITY_DETAILS,
    OCR_AADHAAR_UPLOAD,
    OCR_PAN_UPLOAD, PASSPORT_BACK_OCR, PASSPORT_FRONT_OCR,
    REMOVE_DOCUMENT, SAVE_IDENTITY_DETAILS
} from "../../../../constant/Endpoint.tsx";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import ExtractedData from "../../../../page/bgv-form/DocumentExtractedData.jsx";
import DocCard from "../../../../page/bgv-form/DocCard.jsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";
import {formatToISO} from "../../../../utils/date-util.js";
import DataNoticeModal from "../../../common/DataNoticeModal.jsx";
import IDVerificationSkeleton from "./IDVerificationSkeleton.jsx";

const IDVerificationModal = ({ isOpen, onClose, documentType, candidateId, onUpdateSuccess, taskId }) => {
    const { formData, updateFormData, errors, clearError, setErrors } = useForm();
    const { authenticatedRequest } = useAuthApi();
    const [currentSide, setCurrentSide] = useState(null);
    const [dataNoticeModalOpen, setDataNoticeModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Access the relevant part of formData for the currently selected documentType
    const currentDocumentKey = documentType ? documentType.toLowerCase() : '';
    const currentDocumentData = formData.idVerification?.[currentDocumentKey] || {};

    const documentFaceJson = {
        pan: "SINGLE",
        aadhaar: "FRONT",
        passport: 'SINGLE' // Assuming passport also uses a single side for OCR/upload
    };



    const [uploading, setUploading] = useState(false);
    const [uploadErrors, setUploadErrors] = useState({});
    const [saving, setSaving] = useState(false); // For the Save button in the modal

    useEffect(() => {
        console.log("upload errors - ", uploadErrors);
    }, [uploadErrors])

    useEffect(() => {
        const fetchTaskData = async () => {
            if (!taskId || !isOpen || !currentDocumentKey) return;

            setLoading(true);
            try {
                const response = await authenticatedRequest(undefined, `${GET_IDENTITY_DETAILS}/${taskId}`, METHOD.GET);
                if (response.status === 200) {
                    const { documentId, backDocumentId, extractedData, fileName, backFileName, fileUrl, backFileUrl } = response.data;
                    let updatedSection = {};

                    if(currentDocumentKey === 'passport') {
                        // Passport logic can be added here later if the API structure differs
                        const {FRONT, BACK} = extractedData;
                        updateFormData('idVerification', {
                            ...formData.idVerification,
                            "passport_FRONT": {
                                fileId: documentId,
                                fileName: fileName,
                                fileUrl: fileUrl,
                                idNumber: FRONT?.passportNumber || '',
                                dob: formatToISO(FRONT?.dateOfBirth) || '',
                                dateOfIssue: FRONT?.dateOfIssue ? formatToISO(FRONT?.dateOfIssue) : '',
                                dateOfExpiry: FRONT?.dateOfExpiry ? formatToISO(FRONT?.dateOfExpiry) : '',
                                name: FRONT?.fullName || '',
                                gender: FRONT?.sex || '',
                                nationality: FRONT?.nationality || '',
                                birthPlace: FRONT?.placeOfBirth || '',
                                isExtracted: true
                            },
                            "passport_BACK": {
                                fileId: backDocumentId,
                                fileName: backFileName,
                                fileUrl: backFileUrl,
                                fileNumber: BACK?.fileNumber || '',
                                permanentAddress: BACK?.permanentAddress || '',
                                fatherName: BACK?.fatherName || '',
                                motherName: BACK?.motherName || '',
                                isExtracted: true
                            },
                            consent: true
                        });
                    } else {
                        updatedSection = {
                            fileId: documentId,
                            fileName: fileName,
                            fileUrl: fileUrl,
                            idNumber: extractedData?.extractedPiiData || '',
                            dob: extractedData?.dateOfBirth ? formatToISO(extractedData.dateOfBirth) : '',
                            name: extractedData?.name || '',
                            isExtracted: !!extractedData
                        };
                        updateFormData('idVerification', {
                            ...formData.idVerification,
                            [currentDocumentKey]: updatedSection,
                            consent: true
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch identity details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskData();
    }, [taskId, isOpen, currentDocumentKey]); // Added currentDocumentKey to dependencies


    useEffect(() => {
        if (isOpen) {
            setUploadErrors({});
            setUploading(false);
            setSaving(false);
            // Clear general form errors that might be related to ID verification
            clearError('id_required'); // Calling it here is fine
            clearError('id_general');
            clearError('consent'); // Clear consent error as well
        }
    }, [isOpen, documentType]); // Removed clearError from dependencies


    const handleFileChange = async (type, e, side) => {
        const file = e.target.files[0];
        if (!file) return;
        if(type === 'passport') {
            setCurrentSide(side);
        }

        setUploadErrors(prev => ({ ...prev, [type]: null }));
        setUploading(true); // Set general uploading state

        try {
            const filePayload = new FormData();
            filePayload.append('file', file);
            filePayload.append('documentSide', documentFaceJson[type]);

            let ocrUrl;
            if (type === 'aadhaar') ocrUrl = OCR_AADHAAR_UPLOAD;
            else if (type === 'pan') ocrUrl = OCR_PAN_UPLOAD;
            else if (type === 'passport') {
                type = type + "_" + side;
                ocrUrl = side === 'FRONT' ? PASSPORT_FRONT_OCR : PASSPORT_BACK_OCR;
            } else {
                setUploadErrors(prev => ({ ...prev, [type]: "Unsupported document type for OCR." }));
                setUploading(false);
                return;
            }

            const url = `${ocrUrl}/${candidateId}`; // Use the determined OCR URL

            const response = await authenticatedRequest(
                filePayload,
                url,
                METHOD.POST,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 200) {
                const { documentId, extractedData, fileName, fileUrl } = response.data;
                updateFormData('idVerification', {
                    ...formData.idVerification, // Keep other document types
                    [type]: { // Update only the current document type
                        ...formData.idVerification[type] || {}, // Keep existing fields for this type
                        fileId: documentId,
                        fileName: fileName || file.name,
                        fileUrl: fileUrl,
                        idNumber: extractedData?.extractedPiiData || extractedData?.passportNumber || '',
                        surName: extractedData?.surName || '',
                        givenName: extractedData?.givenName || '',
                        dob: formatToISO(extractedData?.dateOfBirth) || '',
                        dateOfIssue: extractedData?.dateOfIssue ? formatToISO(extractedData?.dateOfIssue) : '',
                        dateOfExpiry: extractedData?.dateOfExpiry ? formatToISO(extractedData?.dateOfExpiry) : '',
                        name: extractedData?.name || extractedData?.fullName || '',
                        gender: extractedData?.gender || extractedData?.sex || '',
                        placeOfIssue: extractedData?.placeOfIssue || '',
                        nationality: extractedData?.nationality || '',
                        birthPlace: extractedData?.placeOfBirth || '',
                        mrzLine1: extractedData?.mrzLine1 || '',
                        mrzLine2: extractedData?.mrzLine2 || '',
                        address: extractedData?.address || '',
                        fileNumber: extractedData?.fileNumber || '',
                        permanentAddress: extractedData?.permanentAddress || '',
                        spouseName: extractedData?.spouseName || '',
                        fatherName: extractedData?.fatherName || '',
                        motherName: extractedData?.motherName || '',
                        isExtracted: !!extractedData
                    }
                });
                clearError('id_required'); // Clear general ID required error
            } else {
                setUploadErrors(prev => ({ ...prev, [type]: "Failed to process document. Please try again." }));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Upload failed. Please check file size or format.";
            setUploadErrors(prev => ({ ...prev, [type]: errorMessage }));
            console.error("Upload/Replace failed", error);
        } finally {
            setUploading(false);
        }
    };

    const deleteFileFromServer = async (fileId, type) => {
        try {
            const response = await authenticatedRequest({}, `${REMOVE_DOCUMENT}/${fileId}`, METHOD.DELETE);

            if (response.status === 204) {
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
        const existingFileId = formData.idVerification?.[type]?.fileId;
        setUploadErrors(prev => ({ ...prev, [type]: null }));
        if (existingFileId) {
            setUploading(true); // Show loader during deletion
            const isDeleted = await deleteFileFromServer(existingFileId, type);
            setUploading(false); // Stop loader
            if (!isDeleted) return;
        }
        updateFormData('idVerification', {
            ...formData.idVerification,
            [type]: {
                fileId: null,
                fileName: '',
                idNumber: '',
                dob: '',
                name: '',
                gender: '',
                address: '',
                isExtracted: false
            }
        });
    };

    const handlePassportFieldChange = (side, field, value) => {
        // side will be 'front' or 'back'
        const key = `passport_${side}`;
        const currentPassportData = formData.idVerification[key] || {};

        updateFormData('idVerification', {
            ...formData.idVerification,
            [key]: {
                ...currentPassportData,
                    [field]: value
            }
        });
    };


    const handleFieldChange = (field, value) => {
        updateFormData('idVerification', {
            ...formData.idVerification,
            [currentDocumentKey]: { ...currentDocumentData, [field]: value }
        });
    };

    const handleSave = async () => {
        if (!formData.idVerification?.consent) {
            let newErrors = {};
            newErrors.consent = "Please confirm that you have uploaded a valid government-issued ID"
            setErrors(newErrors);
            const consentElement = document.getElementById('consent');
            if (consentElement) consentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if(currentDocumentKey === "passport") {
            const front = formData.idVerification?.["passport_FRONT"];
            const back = formData.idVerification?.["passport_BACK"];
            if(!front.fileId) {
                setUploadErrors(prev => ({ ...prev, ["passport_FRONT"]: `Please upload your passport Front side.` }));
                return;
            }
            if(!back.fileId) {
                setUploadErrors(prev => ({ ...prev, ["passport_BACK"]: `Please upload your passport Back card.` }));
                return;
            }
        } else if (!currentDocumentData.fileId) {
            setUploadErrors(prev => ({ ...prev, [currentDocumentKey]: `Please upload your ${documentType} card.` }));
            return;
        }

        let validationErrors = {};
        let firstErrorId = null;

        const validateField = (key, value, label, errorId) => {
            if (!value || value.trim() === "") {
                validationErrors[errorId] = `${label} is required`;
                if (!firstErrorId) firstErrorId = errorId;
                return false;
            }
            return true;
        };

        if (currentDocumentKey === "passport") {
            const front = formData.idVerification?.["passport_FRONT"] || {};
            const back = formData.idVerification?.["passport_BACK"] || {};

            // Front Fields
            validateField('idNumber', front.idNumber, 'Passport Number', 'passport_FRONT_idNumber');
            validateField('dob', front.dob, 'Date of Birth', 'passport_FRONT_dob');
            validateField('name', front.name, 'Name', 'passport_FRONT_name');
            validateField('birthPlace', front.birthPlace, 'Birth Place', 'passport_FRONT_birthPlace');
            validateField('dateOfIssue', front.dateOfIssue, 'Issue Date', 'passport_FRONT_dateOfIssue');
            validateField('dateOfExpiry', front.dateOfExpiry, 'Expiry Date', 'passport_FRONT_dateOfExpiry');
            validateField('gender', front.gender, 'Gender', 'passport_FRONT_gender');
            validateField('nationality', front.nationality, 'Nationality', 'passport_FRONT_nationality');

            // Back Fields
            validateField('fileNumber', back.fileNumber, 'File Number', 'passport_BACK_fileNumber');
            validateField('fatherName', back.fatherName, 'Father Name', 'passport_BACK_fatherName');
            validateField('motherName', back.motherName, 'Mother Name', 'passport_BACK_motherName');
            validateField('permanentAddress', back.permanentAddress, 'Permanent Address', 'passport_BACK_permanentAddress');
        } else {
            // PAN/AADHAAR
            validateField('idNumber', currentDocumentData.idNumber, `${documentType} Number`, `${currentDocumentKey}_idNumber`);
            validateField('dob', currentDocumentData.dob, 'Date of Birth', `${currentDocumentKey}_dob`);
            validateField('name', currentDocumentData.name, 'Name', `${currentDocumentKey}_name`);
        }

        console.log("validationErrors 00 ", validationErrors)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...validationErrors }));
            setTimeout(() => {
                document.getElementById(firstErrorId)?.focus();
                document.getElementById(firstErrorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }

        setSaving(true);
        try {
            let payload = {
                candidateId: candidateId,
                documentType: documentType, // 'PAN', 'AADHAAR', etc.
            }
            if (currentDocumentKey === "passport") {
                const front = formData.idVerification?.["passport_FRONT"] || {};
                const back = formData.idVerification?.["passport_BACK"] || {};
                payload = {
                    ...payload,

                    frontFileId: front.fileId,
                    backFileId: back.fileId,
                    idNumber: front.idNumber,
                    idName: front.name,
                    name: front.name,
                    dob: front.dob, // Already formatted as ISO via formatToISO
                    gender: front.gender,
                    nationality: front.nationality,
                    birthPlace: front.birthPlace,
                    address: back.address,
                    permanentAddress: back.permanentAddress,
                    motherName: back.motherName,
                    fatherName: back.fatherName,
                    fileNumber: back.fileNumber,
                    dateOfIssue: front.dateOfIssue,
                    dateOfExpiry: front.dateOfExpiry,

                    verificationMethod: 'OCR_UPLOAD',
                    consentProvided: formData.idVerification.consent,
                    consentTimestamp: new Date().toISOString()
                };
            } else {
                payload = {
                    ...payload,
                    fileId: currentDocumentData.fileId,

                    idNumber: currentDocumentData.idNumber,
                    idName: currentDocumentData.name,
                    name: currentDocumentData.name,
                    dob: currentDocumentData.dob, // Already formatted as ISO via formatToISO
                    gender: currentDocumentData.gender,
                    address: currentDocumentData.address,

                    verificationMethod: 'OCR_UPLOAD',
                    consentProvided: formData.idVerification.consent,
                    consentTimestamp: new Date().toISOString()
                };
            }

            console.log("Saving ID Payload:", payload);
            let url = `${CREATE_IDENTITY_CHECK}/${candidateId}`
            if(taskId) {
                url = `${SAVE_IDENTITY_DETAILS}/${taskId}`
            }

            const response = await authenticatedRequest(payload, url, METHOD.POST);

            if (response.status === 200 || response.status === 201) {
                onClose();
                if(onUpdateSuccess) {
                    onUpdateSuccess();
                }
            } else {
                throw new Error(response.data?.message || "Failed to save details.");
            }

        } catch (error) {
            console.error("Failed to save document details:", error);
            setUploadErrors(prev => ({
                ...prev,
                [currentDocumentKey]: error.response?.data?.message || "Internal Server Error while saving."
            }));
        } finally {
            setSaving(false);
        }
    };


    const modalTitle = () => {
        switch (documentType) {
            case 'PAN': return 'Upload PAN Card';
            case 'AADHAAR': return 'Upload AADHAAR Card';
            case 'PASSPORT': return 'Upload Passport';
            default: return 'ID Verification';
        }
    };

    const passportFrontData = formData.idVerification?.['passport_FRONT'] || {};
    const passportBackData = formData.idVerification?.['passport_BACK'] || {};

    if (!isOpen || !documentType) return null; // Only render if open and documentType is specified

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{modalTitle()}</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            {'Requires a valid government issued ID'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {
                        loading ? (
                            <IDVerificationSkeleton isPassport={documentType === 'PASSPORT'} />
                        ) : (
                            <div className="space-y-4">
                                {/* General Error messages from useForm context */}
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

                                <div className="space-y-8">
                                    {documentType === 'PASSPORT' ? (
                                        <div className="flex flex-col gap-10">
                                            {/* --- PASSPORT FRONT SECTION --- */}
                                            <div className="space-y-4">
                                                <DocCard
                                                    title="Passport Front Page (Identity)*"
                                                    file={passportFrontData?.fileName}
                                                    fileUrl={passportFrontData?.fileUrl}
                                                    processing={uploading && currentSide === 'FRONT'}
                                                    error={uploadErrors["passport_FRONT"]}
                                                    onFileSelect={(e) => handleFileChange('passport', e, 'FRONT')}
                                                    onRemove={() => handleRemoveFile('passport', 'FRONT')}
                                                />
                                                {passportFrontData?.isExtracted && (
                                                    <ExtractedData
                                                        idLabel={'Passport Number'}
                                                        section="FRONT"
                                                        documentType="PASSPORT"
                                                        passportData={passportFrontData}
                                                        onFieldChange={(f, v) => handlePassportFieldChange('FRONT', f, v)}
                                                        onIdChange={(v) => handlePassportFieldChange('FRONT', "idNumber", v)}
                                                        onDobChange={(v) => handlePassportFieldChange('FRONT', 'dob', v)}
                                                        onNameChange={(v) => handlePassportFieldChange('FRONT', 'name', v)}
                                                    />
                                                )}
                                            </div>

                                            {/* --- PASSPORT BACK SECTION --- */}
                                            <div className="space-y-4">
                                                <DocCard
                                                    title="Passport Back Page (Address)*"
                                                    file={passportBackData?.fileName}
                                                    fileUrl={passportBackData?.fileUrl}
                                                    error={uploadErrors["passport_BACK"]}
                                                    processing={uploading && currentSide === 'BACK'}
                                                    onFileSelect={(e) => handleFileChange('passport', e, 'BACK')}
                                                    onRemove={() => handleRemoveFile('passport', 'BACK')}
                                                />
                                                {passportBackData?.isExtracted && (
                                                    <ExtractedData
                                                        section="BACK"
                                                        documentType="PASSPORT"
                                                        passportData={passportBackData}
                                                        onFieldChange={(f, v) => handlePassportFieldChange('BACK', f, v)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        /* --- ORIGINAL PAN / AADHAAR FLOW (UNTOUCHED) --- */
                                        <>
                                            <DocCard
                                                title={`${modalTitle()} *`}
                                                file={currentDocumentData.fileName}
                                                fileUrl={currentDocumentData.fileUrl}
                                                processing={uploading} // Use general uploading state for the modal
                                                error={uploadErrors[currentDocumentKey]}
                                                onFileSelect={(e) => handleFileChange(currentDocumentKey, e)}
                                                onRemove={() => handleRemoveFile(currentDocumentKey)}
                                            />

                                            {currentDocumentData.isExtracted && (
                                                <ExtractedData
                                                    idLabel={documentType === 'PAN' ? 'PAN Number' : documentType === 'AADHAAR' ? 'Aadhaar Number' : 'Passport Number'}
                                                    documentType={documentType}
                                                    idValue={currentDocumentData.idNumber}
                                                    dobValue={currentDocumentData.dob}
                                                    name={currentDocumentData.name}
                                                    onIdChange={(v) => handleFieldChange('idNumber', v)}
                                                    onDobChange={(v) => handleFieldChange('dob', v)}
                                                    onNameChange={(v) => handleFieldChange('name', v)}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Consent Checkbox - Kept as per original IDVerification.jsx file */}
                                <div id={'consent'} className={`mt-10 p-4 lg:p-6 rounded-2xl border transition-all duration-300 ${errors.consent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-start gap-4">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id="consent-check"
                                                checked={formData.idVerification.consent || false}
                                                onChange={(e) => {
                                                    updateFormData('idVerification', {...formData.idVerification, consent: e.target.checked});
                                                    if(e.target.checked) clearError('consent');
                                                }}
                                                className={`w-6 h-6 rounded-lg border-2 appearance-none checked:bg-[#5D4591] ${errors.consent ? 'border-red-400' : 'border-slate-300'}`}
                                            />
                                            {(formData.idVerification.consent || false) && <Check className="absolute pointer-events-none text-white left-1" size={16} strokeWidth={4} />}
                                        </div>
                                        <label htmlFor="consent-check" className="cursor-pointer">
                                            <p className={`text-xs lg:text-sm leading-relaxed font-medium ${errors.consent ? 'text-red-700' : 'text-slate-600'}`}>
                                                I hereby consent to the processing of my ID for identity verification and background screening purposes.
                                                I confirm this is a valid government-issued ID.
                                            </p>
                                            <button onClick={() => setDataNoticeModalOpen(true)} className="text-[10px] text-[#5D4591] font-bold underline text-left">
                                                View Data Processing Notice
                                            </button>
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
                        )
                    }
                </div>

                {/* Footer */}
                <div className="px-10 py-8 border-t border-slate-100 bg-white flex justify-end gap-4">
                    <button onClick={onClose} className="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || uploading} // Disable save if currently uploading
                        className="bg-[#5D4591] text-white px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#4a3675] transition-all shadow-xl shadow-[#5D4591]/20 active:scale-95 flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Save Document
                    </button>
                </div>
            </div>
            <DataNoticeModal
                isOpen={dataNoticeModalOpen}
                onClose={() => setDataNoticeModalOpen(false)}
            />
        </div>
    );
};

export default IDVerificationModal;
