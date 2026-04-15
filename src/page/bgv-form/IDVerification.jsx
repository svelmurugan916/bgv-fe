import React, { useState } from 'react';
import {Check, Loader2, AlertCircle, GlobeIcon, FingerprintIcon, CreditCardIcon} from 'lucide-react';
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import DocCard from "./DocCard.jsx";
import ExtractedData from "./DocumentExtractedData.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    OCR_AADHAAR_UPLOAD,
    OCR_PAN_UPLOAD,
    PASSPORT_BACK_OCR,
    PASSPORT_FRONT_OCR,
    REMOVE_DOCUMENT
} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import {formatToISO} from "../../utils/date-util.js";
import DataNoticeModal from "../../component/common/DataNoticeModal.jsx";
import DocumentSection from "./DocumentSection.jsx";

const IDVerification = () => {
    const { formData, updateFormData, errors, clearError, candidateId } = useForm();
    const data = formData.idVerification;
    const passportFrontData = formData.idVerification?.['passport_FRONT'] || {};
    const passportBackData = formData.idVerification?.['passport_BACK'] || {};
    const { authenticatedRequest } = useAuthApi();
    const documentFaceJson = {
        pan: "SINGLE",
        aadhar: "FRONT",
        passport: 'SINGLE'
    }
    const [uploading, setUploading] = useState(false);
    const [currentSide, setCurrentSide] = useState(null);

    // This is the state that controls the loaders in DocCard
    const [uploadingType, setUploadingType] = useState(null);
    const [uploadErrors, setUploadErrors] = useState({});
    const [dataNoticeModalOpen, setDataNoticeModalOpen] = useState(false);

    const handleFileChange = async (type, e, side) => {
        const file = e.target.files[0];
        if (!file) return;
        if(type === 'passport') {
            setCurrentSide(side);
        }

        setUploadingType(type);

        setUploadErrors(prev => ({ ...prev, [type]: null }));
        setUploading(true); // Set general uploading state

        try {
            const filePayload = new FormData();
            filePayload.append('file', file);
            filePayload.append('documentSide', documentFaceJson[type]);

            let ocrUrl;
            if (type === 'aadhar') ocrUrl = OCR_AADHAAR_UPLOAD;
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
            setUploadingType(null);
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

    const handleRemoveFile = async (type, side = undefined) => {
        console.log(type + " -- " + side);
        const docType = type === 'passport' ? type + "_" + side : type;
        const existingFileId = data[docType].fileId;
        setUploadErrors(prev => ({ ...prev, [type]: null }));
        if (existingFileId) {
            setUploadingType(docType); // Show loader
            const isDeleted = await deleteFileFromServer(existingFileId, type);
            setUploadingType(null); // Stop loader
            if (!isDeleted) return;
        }
        updateFormData('idVerification', {
            ...data,
            [docType]: {
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

    console.log('formData -- ', formData);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <FormPageHeader heading={"ID Card Verification"} helperText={"Requires a valid government issued ID"} />

            {errors.id_required && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600" id={"id_required"}>
                    <AlertCircle size={20} /><p className="text-xs uppercase font-bold">{errors.id_required}</p>
                </div>
            )}

            {errors.name && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600" id={"id_required"}>
                    <AlertCircle size={20} /><p className="text-xs uppercase font-bold">{errors.name}</p>
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

            <div className="mt-8">
                {/* --- SECTION 1: PAN CARD --- */}
                <DocumentSection
                    title="PAN Card"
                    icon={CreditCardIcon}
                    description="Permanent Account Number for financial verification"
                    isCompleted={data.pan.isExtracted}
                >
                    <DocCard
                        title="Front Side (Identity)*"
                        file={data.pan.fileName}
                        fileUrl={data.pan.fileUrl}
                        processing={uploadingType === 'pan'}
                        error={uploadErrors.pan}
                        onFileSelect={(e) => handleFileChange('pan', e)}
                        onRemove={() => handleRemoveFile('pan')}
                    />
                    {data.pan.isExtracted && (
                        <ExtractedData
                            idLabel="PAN Number"
                            idValue={data.pan.idNumber}
                            dobValue={data.pan.dob}
                            name={data.pan.name}
                            onIdChange={(v) => handleFieldChange('pan', 'idNumber', v)}
                            onDobChange={(v) => handleFieldChange('pan', 'dob', v)}
                            onNameChange={(v) => handleFieldChange('pan', 'name', v)}
                            documentType="PAN"
                        />
                    )}
                </DocumentSection>

                {/* --- SECTION 2: AADHAAR CARD --- */}
                <DocumentSection
                    title="Aadhaar Card"
                    icon={FingerprintIcon}
                    description="Unique identification for residency verification"
                    isCompleted={data.aadhar.isExtracted}
                >
                    <DocCard
                        title="Front Side (Identity)*"
                        file={data.aadhar.fileName}
                        fileUrl={data.aadhar.fileUrl}
                        error={uploadErrors.aadhar}
                        processing={uploadingType === 'aadhar'}
                        onFileSelect={(e) => handleFileChange('aadhar', e)}
                        onRemove={() => handleRemoveFile('aadhar')}
                    />
                    {data.aadhar.isExtracted && (
                        <ExtractedData
                            idLabel="Aadhar Number"
                            idValue={data.aadhar.idNumber}
                            dobValue={data.aadhar.dob}
                            name={data.aadhar.name}
                            onIdChange={(v) => handleFieldChange('aadhar', 'idNumber', v)}
                            onDobChange={(v) => handleFieldChange('aadhar', 'dob', v)}
                            onNameChange={(v) => handleFieldChange('aadhar', 'name', v)}
                            documentType="AADHAAR"
                        />
                    )}
                </DocumentSection>

                {/* --- SECTION 3: PASSPORT (Consolidated) --- */}
                <DocumentSection
                    title="International Passport"
                    icon={GlobeIcon}
                    description="Required for global identity and address verification"
                    isCompleted={passportFrontData?.isExtracted && passportBackData?.isExtracted}
                >
                    <div className="grid grid-cols-1 gap-6">
                        {/* Front Page Group */}
                        <div className="space-y-4">
                            <DocCard
                                title="Front Page (Identity)*"
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

                        {/* Divider Line */}
                        <div className="border-t border-slate-200/60 my-2"></div>

                        {/* Back Page Group */}
                        <div className="space-y-4">
                            <DocCard
                                title="Back Page (Address)*"
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
                </DocumentSection>
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
            <DataNoticeModal
                isOpen={dataNoticeModalOpen}
                onClose={() => setDataNoticeModalOpen(false)}
            />
        </div>
    );
};

export default IDVerification;
