import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle, X, Save } from 'lucide-react';
import {useForm} from "../../../../provider/FormProvider.jsx";
import {
    CREATE_IDENTITY_CHECK,
    OCR_AADHAAR_UPLOAD,
    OCR_PAN_UPLOAD,
    REMOVE_DOCUMENT
} from "../../../../constant/Endpoint.tsx";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import ExtractedData from "../../../../page/bgv-form/DocumentExtractedData.jsx";
import DocCard from "../../../../page/bgv-form/DocCard.jsx";
import {METHOD} from "../../../../constant/ApplicationConstant.js";
import {formatToISO} from "../../../../utils/date-util.js";

/**
 * IDVerificationModal Component
 * This component functions as a modal to handle the upload and data extraction
 * for a single ID document type (PAN, AADHAAR, or Passport).
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {string} props.documentType - The type of document to display ('PAN', 'AADHAAR', 'PASSPORT').
 */
const IDVerificationModal = ({ isOpen, onClose, documentType, candidateId, onUpdateSuccess }) => {
    const { formData, updateFormData, errors, clearError, setErrors } = useForm();
    const { authenticatedRequest } = useAuthApi();

    // Access the relevant part of formData for the currently selected documentType
    const currentDocumentKey = documentType ? documentType.toLowerCase() : '';
    const currentDocumentData = formData.idVerification?.[currentDocumentKey] || {};

    const documentFaceJson = {
        pan: "SINGLE",
        aadhaar: "FRONT",
        passport: 'SINGLE' // Assuming passport also uses a single side for OCR/upload
    };

    // State to manage loading indicators specifically for the active document type
    const [uploading, setUploading] = useState(false);
    const [uploadErrors, setUploadErrors] = useState({});
    const [saving, setSaving] = useState(false); // For the Save button in the modal

    // Reset errors and loading states when modal opens or document type changes
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
    // The `clearError` function is called directly within the effect.
    // React guarantees that `setState` dispatch functions (like setUploadErrors) are stable.
    // If `clearError` was causing the re-render due to its reference changing,
    // removing it from dependencies prevents the infinite loop.


    if (!isOpen || !documentType) return null; // Only render if open and documentType is specified

    const handleFileChange = async (type, e) => {
        const file = e.target.files[0];
        if (!file) return;

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
                // Assuming you have an OCR_PASSPORT_UPLOAD endpoint or similar logic
                // If passport does not have OCR, this part needs adjustment.
                console.warn("Passport OCR endpoint not explicitly defined. Proceeding with generic upload assumption if needed.");
                setUploadErrors(prev => ({ ...prev, [type]: "Passport OCR not configured or supported in this flow." }));
                setUploading(false);
                return;
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
                const { documentId, extractedData, fileName } = response.data;
                updateFormData('idVerification', {
                    ...formData.idVerification, // Keep other document types
                    [type]: { // Update only the current document type
                        ...formData.idVerification[type], // Keep existing fields for this type
                        fileId: documentId,
                        fileName: fileName || file.name,
                        idNumber: extractedData?.extractedPiiData || '',
                        dob: formatToISO(extractedData?.dateOfBirth) || '',
                        name: extractedData?.name || '',
                        gender: extractedData?.gender || '',
                        address: extractedData?.address || '',
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

    const handleFieldChange = (field, value) => {
        updateFormData('idVerification', {
            ...formData.idVerification,
            [currentDocumentKey]: { ...currentDocumentData, [field]: value }
        });
    };

    const handleSave = async () => {
        // 1. Validation Guards
        if (!formData.idVerification?.consent) {
            let newErrors = {};
            newErrors.consent = "Please confirm that you have uploaded a valid government-issued ID"
            setErrors(newErrors);
            const consentElement = document.getElementById('consent');
            if (consentElement) consentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (isCurrentDocMandatory(documentType) && !currentDocumentData.fileId) {
            setUploadErrors(prev => ({ ...prev, [currentDocumentKey]: `Please upload your ${documentType} card.` }));
            return;
        }

        setSaving(true);
        try {
            // 2. CONSTRUCT THE PAYLOAD
            // We extract exactly what the backend needs for the IdentityCheck entity
            const payload = {
                candidateId: candidateId,
                documentType: documentType, // 'PAN', 'AADHAAR', etc.
                fileId: currentDocumentData.fileId,

                // These fields represent the "Verified/Extracted" state
                idNumber: currentDocumentData.idNumber,
                idName: currentDocumentData.name,
                dob: currentDocumentData.dob, // Already formatted as ISO via formatToISO
                gender: currentDocumentData.gender,
                address: currentDocumentData.address,

                // Metadata
                verificationMethod: 'OCR_UPLOAD',
                consentProvided: formData.idVerification.consent,
                consentTimestamp: new Date().toISOString()
            };

            console.log("Saving ID Payload:", payload);

            // 3. API CALL
            // Assuming you have a SAVE_ID_DETAILS constant, otherwise use your endpoint string
            const response = await authenticatedRequest(payload, `${CREATE_IDENTITY_CHECK}/${candidateId}`, METHOD.POST);

            if (response.status === 200 || response.status === 201) {
                // 4. Success Handling
                // You might want to update the parent state to show a "Saved" badge
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


    // Determine modal title
    const modalTitle = () => {
        switch (documentType) {
            case 'PAN': return 'Upload PAN Card';
            case 'AADHAAR': return 'Upload AADHAAR Card';
            case 'PASSPORT': return 'Upload Passport';
            default: return 'ID Verification';
        }
    };

    // Determine if the current document is mandatory for validation message
    const isCurrentDocMandatory = (docType) => {
        // Based on original file, PAN and AADHAAR were mandatory, Passport optional
        return docType === 'PAN' || docType === 'AADHAAR';
    };

    console.log("errors -- ", errors);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{modalTitle()}</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            {isCurrentDocMandatory(documentType) ? 'Requires a valid government issued ID' : 'Upload an optional ID document'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 overflow-y-auto custom-scrollbar bg-slate-50/30">
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

                        {/* Document Upload Card for the selected documentType */}
                        <DocCard
                            title={`${modalTitle()}${isCurrentDocMandatory(documentType) ? '*' : ''}`}
                            file={currentDocumentData.fileName}
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
        </div>
    );
};

export default IDVerificationModal;
