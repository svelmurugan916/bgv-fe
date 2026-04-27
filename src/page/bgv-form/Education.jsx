import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Upload, Check, Loader2, FileText, AlertCircle, Sparkles } from 'lucide-react';
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import FormSingleDropdownSelect from "./FormSingleDropdownSelect.jsx";
import InputComponent from "./InputComponent.jsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import {EXTRACT_EDUCATION_DOCUMENT, UPLOAD_SUPPORTING_DOCUMENT} from "../../constant/Endpoint.tsx";
import { v4 as uuidv4 } from 'uuid';

const Education = () => {
    const { formData, updateFormData, errors, clearError, candidateId } = useForm();
    const { authenticatedRequest } = useAuthApi();
    const data = formData.education;
    const [isExtractedFromOCR, setIsExtractedFromOCR] = useState(false);

    const [uploadProgress, setUploadProgress] = useState({});
    const [lastAddedId, setLastAddedId] = useState(null);
    const primaryFileInputRef = useRef(null);
    const supportingFileInputRefs = useRef({});


    useEffect(() => {
        if (lastAddedId) {
            const element = document.getElementById(`edu_card_${lastAddedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setLastAddedId(null);
            }
        }
    }, [data.length, lastAddedId]);

    const addEducation = () => {
        const newId = uuidv4();
        const newEntry = {
            id: newId,
            level: '',
            degree: '',
            college: '',
            university: '',
            year: '',
            gpa: '',
            rollNumber: '',
            primaryDocument: null,
            supportingDocuments: [],
            isExtracted: false,
            provideLater: false
        };
        updateFormData('education', [...(formData.education || []), newEntry]);
        setLastAddedId(newId);
    };

    const removeEducation = (id) => {
        if ((data || []).length > 1) {
            updateFormData('education', (data || []).filter(item => item.id !== id));
        }
    };

    const handleChange = (id, field, value) => {
        const updatedEducation = (data || []).map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        updateFormData('education', updatedEducation);
        if (value) clearError(`edu_${id}_${field}`);
        if (field === 'provideLater' && value === true) {
            clearError(`edu_${id}_primaryDoc`);
            clearError(`edu_${id}_supportingDocs`);
        }
    };

    const handlePrimaryDocumentUpload = async (eduId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempFileId = uuidv4();

        updateFormData('education', prevEducationData => {
            return (prevEducationData || []).map(item => {
                if (item.id === eduId) {
                    return {
                        ...item,
                        provideLater: false,
                        primaryDocument: {
                            id: tempFileId,
                            name: file.name,
                            status: 'processing',
                            errorMessage: null
                        }
                    };
                }
                return item;
            });
        });
        clearError(`edu_${eduId}_primaryDoc`);

        try {
            const filePayload = new FormData();
            filePayload.append('file', file);

            const response = await authenticatedRequest(
                filePayload,
                `${EXTRACT_EDUCATION_DOCUMENT}/${candidateId}?documentTypeCode=PROVISIONAL_CERTIFICATE`,
                METHOD.POST,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, [tempFileId]: percentCompleted }));
                    }
                }
            );

            if (response.status === 200) {
                const responseData = Array.isArray(response.data) ? response.data[0] : response.data;

                updateFormData('education', prevEducationData => {
                    return (prevEducationData || []).map(edu => {
                        if (edu.id === eduId) {
                            const updatedPrimaryDoc = {
                                ...edu.primaryDocument,
                                id: responseData.documentId,
                                name: responseData.fileName || file.name,
                                status: 'success',
                                errorMessage: null
                            };

                            let finalRoll = edu.rollNumber;
                            let finalUniversity = edu.university;
                            let finalDegree = edu.degree;
                            let finalBranchSpecialization = edu.branchSpecialization;
                            let finalLevel = edu.level;
                            let finalPassingMonth = edu.passingMonth;
                            let finalYear = edu.year;
                            let isExtracted = false;
                            if (responseData.extractedData) {
                                finalRoll = responseData.extractedData?.registrationNumber;
                                finalUniversity = responseData.extractedData?.universityName;
                                finalDegree = responseData.extractedData?.degree;
                                finalBranchSpecialization = responseData.extractedData?.branchSpecialization;
                                finalLevel = mapDegreeToQualification(finalDegree);
                                const passingMonthYear = responseData.extractedData?.passingMonthYear;
                                if(passingMonthYear) {
                                    const splitted = passingMonthYear.split(' ');
                                    finalYear = splitted[1];
                                    finalPassingMonth = splitted[0];
                                }

                                isExtracted = true;
                                setIsExtractedFromOCR(true)
                            }

                            return {
                                ...edu,
                                primaryDocument: updatedPrimaryDoc,
                                rollNumber: finalRoll,
                                university: finalUniversity,
                                level: finalLevel,
                                degree: finalDegree,
                                branchSpecialization: finalBranchSpecialization,
                                passingMonth: finalPassingMonth,
                                year: finalYear,
                                isExtracted: isExtracted
                            };
                        }
                        return edu;
                    });
                });
            } else {
                const errorMessage = response.data?.message || `Upload failed with status: ${response.status}.`;
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Primary document upload failed", error);
            const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please try again.";

            updateFormData('education', prevEducationData => {
                return (prevEducationData || []).map(edu => {
                    if (edu.id === eduId) {
                        return {
                            ...edu,
                            primaryDocument: {
                                ...edu.primaryDocument,
                                status: 'failed',
                                errorMessage: errorMessage
                            },
                            isExtracted: false,
                            rollNumber: ''
                        };
                    }
                    return edu;
                });
            });
        } finally {
            setUploadProgress(prev => {
                const next = { ...prev };
                delete next[tempFileId];
                return next;
            });
            if (primaryFileInputRef.current) {
                primaryFileInputRef.current.value = "";
            }
        }
    };

    const mapDegreeToQualification = (degreeText) => {
        if (!degreeText) return "";

        // Normalize: lowercase and remove dots (e.g., "B.Tech" becomes "btech")
        const str = degreeText.toLowerCase().replace(/\./g, "").trim();

        // 1. POSTGRADUATE (Check this first!)
        const pgKeywords = ["master", "mtech", "me", "mba", "msc", "ma", "mcom", "mca", "postgraduate", "pg"];
        if (pgKeywords.some(key => str.includes(key))) {
            return "POST_GRADUATE";
        }

        // 2. UNDERGRADUATE
        const ugKeywords = ["bachelor", "btech", "be", "bsc", "ba", "bcom", "bba", "bca", "undergraduate", "ug"];
        if (ugKeywords.some(key => str.includes(key))) {
            return "UNDER_GRADUATE";
        }

        // 3. 12th / HSC
        const hscKeywords = ["12th", "hsc", "higher secondary", "xii", "intermediate", "puc"];
        if (hscKeywords.some(key => str.includes(key))) {
            return "HSC";
        }

        // 4. 10th / SSLC
        const sslcKeywords = ["10th", "sslc", "secondary", "x ", "matric"]; // "x " with space to avoid matching words like "experience"
        if (sslcKeywords.some(key => str.includes(key))) {
            return "SSLC";
        }

        // 5. DIPLOMA
        if (str.includes("diploma") || str.includes("polytechnic")) {
            return "DIPLOMA";
        }

        return ""; // Default if no match found
    };


    const handleSupportingDocumentsUpload = async (eduId, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newSupportingDocs = files.map(file => ({
            id: uuidv4(),
            name: file.name,
            status: 'processing',
            errorMessage: null,
            fileData: file
        }));

        updateFormData('education', prevEducationData => {
            return (prevEducationData || []).map(item => {
                if (item.id === eduId) {
                    return {
                        ...item,
                        provideLater: false,
                        supportingDocuments: [...(item.supportingDocuments || []), ...newSupportingDocs]
                    };
                }
                return item;
            });
        });
        clearError(`edu_${eduId}_supportingDocs`);

        for (const newDoc of newSupportingDocs) {
            const file = newDoc.fileData;
            const tempFileId = newDoc.id;

            try {
                const filePayload = new FormData();
                filePayload.append('file', file);

                const response = await authenticatedRequest(
                    filePayload,
                    `${UPLOAD_SUPPORTING_DOCUMENT}/${candidateId}`,
                    METHOD.POST,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(prev => ({ ...prev, [tempFileId]: percentCompleted }));
                        }
                    }
                );

                if (response.status === 200) {
                    const responseData = Array.isArray(response.data) ? response.data[0] : response.data;

                    updateFormData('education', prevEducationData => {
                        return (prevEducationData || []).map(edu => {
                            if (edu.id === eduId) {
                                return {
                                    ...edu,
                                    supportingDocuments: (edu.supportingDocuments || []).map(doc =>
                                        doc.id === tempFileId ? {
                                            ...doc,
                                            id: responseData.documentId,
                                            name: responseData.fileName || file.name,
                                            status: 'success',
                                            errorMessage: null
                                        } : doc
                                    )
                                };
                            }
                            return edu;
                        });
                    });
                } else {
                    const errorMessage = response.data?.message || `Upload failed with status: ${response.status}.`;
                    updateFormData('education', prevEducationData => {
                        return (prevEducationData || []).map(edu => {
                            if (edu.id === eduId) {
                                return {
                                    ...edu,
                                    supportingDocuments: (edu.supportingDocuments || []).map(doc =>
                                        doc.id === tempFileId ? {
                                            ...doc,
                                            status: 'failed',
                                            errorMessage: errorMessage
                                        } : doc
                                    )
                                };
                            }
                            return edu;
                        });
                    });
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error("Supporting document upload failed", error);
                const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please try again.";

                updateFormData('education', prevEducationData => {
                    return (prevEducationData || []).map(edu => {
                        if (edu.id === eduId) {
                            return {
                                ...edu,
                                supportingDocuments: (edu.supportingDocuments || []).map(doc =>
                                    doc.id === tempFileId ? {
                                        ...doc,
                                        status: 'failed',
                                        errorMessage: errorMessage
                                    } : doc
                                )
                            };
                        }
                        return edu;
                    });
                });
            } finally {
                setUploadProgress(prev => {
                    const next = { ...prev };
                    delete next[tempFileId];
                    return next;
                });
            }
        }
        if (supportingFileInputRefs.current[eduId]) {
            supportingFileInputRefs.current[eduId].value = "";
        }
    };

    const handleGPAChange = (id, value) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            handleChange(id, 'gpa', value);
        }
    };

    const handleRemoveFile = (eduId, fileId, type) => {
        const updated = (data || []).map(item => {
            if (item.id === eduId) {
                if (type === 'primary') {
                    return { ...item, primaryDocument: null, isExtracted: false, rollNumber: '' };
                } else if (type === 'supporting') {
                    return { ...item, supportingDocuments: (item.supportingDocuments || []).filter(f => f.id !== fileId) };
                }
            }
            return item;
        });
        updateFormData('education', updated);
    };

    const schoolGrade = ["SSLC", 'HSC'];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-10">
            <div className="flex items-start justify-between gap-4">
                <FormPageHeader heading={"Academic Details"} helperText={"Add your Graduation details."} />
            </div>

            {errors.education_general && (
                <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest leading-none mb-1.5">Education Requirement</p>
                        <p className="text-xs font-bold text-rose-600/90 leading-relaxed">{errors.education_general}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 mb-12">
                {(data || []).map((edu, index) => (
                    <div key={edu.id} id={`edu_card_${edu.id}`} className="px-4 py-6 sm:p-8 border border-slate-200 rounded-2xl bg-white shadow-sm relative animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-full bg-[#5D4591] text-white flex items-center justify-center text-[10px] font-bold">
                                0{index + 1}
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Education Details</h3>
                            {(data || []).length > 1 && (
                                <button onClick={() => removeEducation(edu.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>

                        {/* --- SMART FILL TRIGGER (MOVED TO TOP) --- */}
                        <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-[#F9F7FF]/50 border-2 border-dashed border-[#5D4591]/20 rounded-[1.5rem] sm:rounded-[2rem] animate-in fade-in duration-700">
                            {/* Header Section - Better wrapping on small screens */}
                            <div className="flex items-start sm:items-center gap-3 mb-4">
                                <div className="p-2 bg-[#5D4591] rounded-xl text-white shrink-0">
                                    <Sparkles size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-black text-[#241B3B] uppercase tracking-tight">Step 1: Smart Fill</h4>
                                    <p className="text-[9px] sm:text-[10px] text-[#5D4591] font-bold uppercase leading-tight">
                                        Upload your Provisional/Degree certificate first to auto-fill the form
                                    </p>
                                </div>
                            </div>

                            <div id={`edu_${edu.id}_primaryDoc`}>
                                {edu.primaryDocument ? (
                                    /* File Status Card - Stacks slightly better on mobile */
                                    <div className="flex items-center justify-between p-3 sm:p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl sm:rounded-2xl animate-in slide-in-from-left-2 gap-2">
                                        <div className="flex items-center gap-3 w-full min-w-0">
                                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0
                        ${edu.primaryDocument.status === 'processing' ? 'bg-[#F9F7FF] text-[#5D4591]' :
                                                edu.primaryDocument.status === 'failed' ? 'bg-red-100 text-red-600' :
                                                    'bg-emerald-100 text-emerald-600'}`}>
                                                {edu.primaryDocument.status === 'processing' ? <Loader2 size={16} className="animate-spin" /> :
                                                    edu.primaryDocument.status === 'failed' ? <AlertCircle size={16} /> :
                                                        <Check size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1 gap-2">
                                                    <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                                                        {edu.primaryDocument.name}
                                                    </p>
                                                    {edu.primaryDocument.status === 'processing' && (
                                                        <span className="text-[10px] font-bold text-[#5D4591] shrink-0">
                                    {uploadProgress[edu.primaryDocument.id] || 0}%
                                </span>
                                                    )}
                                                </div>
                                                {edu.primaryDocument.status === 'processing' ? (
                                                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                        <div className="bg-[#5D4591] h-full transition-all duration-300" style={{ width: `${uploadProgress[edu.primaryDocument.id] || 0}%` }}></div>
                                                    </div>
                                                ) : edu.primaryDocument.status === 'failed' ? (
                                                    <p className="text-[9px] font-bold uppercase tracking-tight text-red-600 truncate">
                                                        {edu.primaryDocument.errorMessage || 'Upload Failed'}
                                                    </p>
                                                ) : (
                                                    /* Shorter message for mobile, full message for desktop */
                                                    <p className="text-[9px] font-bold uppercase tracking-tight text-emerald-600 flex items-center gap-1 leading-tight">
                                                        <span className="xs:hidden">✨ Extracted. Please review.</span>
                                                        <span className="hidden xs:inline">✨ Details Extracted Successfully. Please review it once.</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {edu.primaryDocument.status !== 'processing' && (
                                            <button onClick={() => handleRemoveFile(edu.id, edu.primaryDocument.id, 'primary')} className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-all shrink-0">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    /* Upload Placeholder - Responsive padding and font sizes */
                                    <div className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all flex flex-col items-center justify-center gap-3
                                        ${edu.provideLater ? 'opacity-40 grayscale pointer-events-none' : ''}
                                        ${errors[`edu_${edu.id}_primaryDoc`] ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white hover:bg-[#F9F7FF]/30 hover:border-[#5D4591]/40 shadow-sm'}`}>
                                        <input
                                            type="file"
                                            ref={primaryFileInputRef}
                                            disabled={edu.provideLater}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handlePrimaryDocumentUpload(edu.id, e)}
                                        />
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F9F7FF] flex items-center justify-center text-[#5D4591] shrink-0">
                                            <Upload size={22} className="sm:size-[24px]" />
                                        </div>
                                        <div className="text-center px-2">
                                            <p className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-widest leading-tight">
                                                {schoolGrade.includes(edu?.level) ? "Upload Board Certificate" : "Upload Degree Certificate"}
                                            </p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">PDF, PNG, JPG (Max 5MB)</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message - Small text for mobile */}
                                {errors[`edu_${edu.id}_primaryDoc`] && !edu.provideLater && (
                                    <div className="flex items-center gap-1 mt-2 text-red-500 px-1">
                                        <AlertCircle size={12} className="shrink-0" />
                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight leading-tight">
                    {errors[`edu_${edu.id}_primaryDoc`]}
                </span>
                                    </div>
                                )}
                            </div>
                        </div>


                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Step 2: Review & Complete Details</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                            <div className="flex flex-col gap-1.5" id={`edu_${edu.id}_level`}>
                                <FormSingleDropdownSelect
                                    title={"Qualification Level"}
                                    isMandatory={true}
                                    isOccupyFullWidth={true}
                                    label="Select Level"
                                    error={errors[`edu_${edu.id}_level`]}
                                    options={[
                                        { text: "10th Standard", value: "SSLC" },
                                        { text: "12th Standard", value: "HSC" },
                                        { text: "Undergraduate (UG)", value: "UNDER_GRADUATE" },
                                        { text: "Postgraduate (PG)", value: "POST_GRADUATE" },
                                        { text: "Diploma", value: "DIPLOMA" }
                                    ]}
                                    selected={edu.level || ""}
                                    isValid={isExtractedFromOCR}
                                    onSelect={(option) => handleChange(edu.id, 'level', option)}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>
                            <div></div>

                            <div id={`edu_${edu.id}_degree`}>
                                <InputComponent
                                    label={schoolGrade.includes(edu?.level) ? "Stream / Subjects" : "Degree / Specialization"}
                                    isMandatory={true}
                                    placeholder={"e.g. B.E"}
                                    value={edu.degree}
                                    error={errors[`edu_${edu.id}_degree`]}
                                    isValid={isExtractedFromOCR}
                                    onChange={(value) => handleChange(edu.id, 'degree', value)}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>

                            <div id={`edu_${edu.id}_branchSpecialization`}>
                                <InputComponent
                                    label={"Specialization / Subjects"}
                                    isMandatory={true}
                                    placeholder={"e.g. Computer Science"}
                                    value={edu.branchSpecialization}
                                    error={errors[`edu_${edu.id}_branchSpecialization`]}
                                    isValid={isExtractedFromOCR}
                                    onChange={(value) => handleChange(edu.id, 'branchSpecialization', value)}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>


                            <div id={`edu_${edu.id}_university`}>
                                <InputComponent
                                    label={`${schoolGrade.includes(edu?.level) ? "Board Name" : "University Name" }`}
                                    placeholder={"e.g. Stanford University"}
                                    isMandatory={true}
                                    value={edu.university}
                                    error={errors[`edu_${edu.id}_university`]}
                                    isValid={isExtractedFromOCR}
                                    onChange={(value) => handleChange(edu.id, 'university', value)}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>

                            <div id={`edu_${edu.id}_college`}>
                                <InputComponent
                                    label={`${schoolGrade.includes(edu?.level) ? "School Name" : "College Name" }`}
                                    placeholder={`${schoolGrade.includes(edu?.level) ? "St. Mary's High School" : "e.g. Mountain View College" }`}
                                    isMandatory={true}
                                    value={edu.college}
                                    error={errors[`edu_${edu.id}_college`]}
                                    onChange={(value) => handleChange(edu.id, 'college', value)}
                                />
                            </div>

                            <div id={`edu_${edu.id}_passingMonth`}>
                                <InputComponent
                                    label={`Month of Passing`}
                                    placeholder={"e.g: Apr"}
                                    isMandatory={true}
                                    value={edu.passingMonth}
                                    error={errors[`edu_${edu.id}_passingMonth`]}
                                    isValid={isExtractedFromOCR}
                                    onChange={(value) => handleChange(edu.id, 'passingMonth', value)}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5" id={`edu_${edu.id}_year`}>
                                <FormSingleDropdownSelect
                                    isOccupyFullWidth={true}
                                    title={"Year of Passing"}
                                    isMandatory={true}
                                    label="Select Year"
                                    error={errors[`edu_${edu.id}_year`]}
                                    options={Array.from({ length: 40 }, (_, i) => ({ text: (new Date().getFullYear() - i).toString(), value: (new Date().getFullYear() - i).toString() }))}
                                    selected={edu.year || ""}
                                    isValid={isExtractedFromOCR}
                                    onSelect={(option) => handleChange(edu.id, 'year', option)}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>

                            <div id={`edu_${edu.id}_gpa`}>
                                <InputComponent
                                    label={`${schoolGrade.includes(edu?.level) ? "Percentage / Grade" : "GPA / Percentage" }`}
                                    placeholder={`${schoolGrade.includes(edu?.level) ? "e.g. 85" : "e.g. 8.5" }`}
                                    isMandatory={true}
                                    value={edu.gpa}
                                    error={errors[`edu_${edu.id}_gpa`]}
                                    onChange={(value) => handleGPAChange(edu.id, value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5" id={`edu_${edu.id}_roll`}>
                                <InputComponent
                                    label="Roll / Reg Number"
                                    isMandatory={true}
                                    tooltip="Used to verify degree authenticity with the University registrar."
                                    value={edu.rollNumber}
                                    placeholder={"Enter number"}
                                    onChange={(v) => handleChange(edu.id, 'rollNumber', v)}
                                    error={errors[`edu_${edu.id}_roll`]}
                                    isValid={edu.rollNumber?.length > 4 || isExtractedFromOCR}
                                    readOnly={edu.isExtracted}
                                />
                                {isExtractedFromOCR && (
                                    <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Automatically extracted from document.
                                    </p>
                                )}
                            </div>

                            <div id={`edu_${edu.id}_city`}>
                                <InputComponent
                                    label={`City`}
                                    placeholder={`Chennai`}
                                    isMandatory={true}
                                    value={edu.city}
                                    error={errors[`edu_${edu.id}_city`]}
                                    onChange={(value) => handleChange(edu.id, 'city', value)}
                                />
                            </div>

                            <div id={`edu_${edu.id}_state`}>
                                <InputComponent
                                    label={`State`}
                                    placeholder={`Tamil nadu`}
                                    isMandatory={true}
                                    value={edu.state}
                                    error={errors[`edu_${edu.id}_state`]}
                                    onChange={(value) => handleChange(edu.id, 'state', value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                {/* --- SUPPORTING DOCUMENTS UPLOAD SECTION --- */}
                                <div className="mt-4" id={`edu_${edu.id}_supportingDocs`}>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                                        {
                                            schoolGrade.includes(edu?.level) ? "UPLOAD ADDITIONAL MARKSHEETS / SCHOOL LEAVING CERTIFICATE" :
                                                "Upload Supporting Marksheets / Transcripts"
                                        }
                                    </label>
                                    <p className="text-[10px] text-slate-500 mb-4">
                                        (e.g., Semester-wise marksheets, provisional certificates, additional transcripts)
                                    </p>

                                    <div className="space-y-3 mb-4">
                                        {(edu.supportingDocuments || []).map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/30 rounded-2xl animate-in slide-in-from-left-2">
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                    ${file.status === 'processing' ? 'bg-[#F9F7FF] text-[#5D4591]' :
                                                        file.status === 'failed' ? 'bg-red-100 text-red-600' :
                                                            'bg-green-100 text-green-600'}`}>
                                                        {file.status === 'processing' ? <Loader2 size={18} className="animate-spin" /> :
                                                            file.status === 'failed' ? <AlertCircle size={18} /> :
                                                                <FileText size={20} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                                                            {file.status === 'processing' && (
                                                                <span className="text-[10px] font-bold text-[#5D4591]">{uploadProgress[file.id] || 0}%</span>
                                                            )}
                                                        </div>
                                                        {file.status === 'processing' ? (
                                                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                                <div className="bg-[#5D4591] h-full transition-all duration-300" style={{ width: `${uploadProgress[file.id] || 0}%` }}></div>
                                                            </div>
                                                        ) : file.status === 'failed' ? (
                                                            <p className="text-[9px] font-bold uppercase tracking-tight text-red-600">{file.errorMessage || 'Upload Failed'}</p>
                                                        ) : (
                                                            <p className="text-[9px] font-bold uppercase tracking-tight text-green-600">Verified & Scanned</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {file.status !== 'processing' && (
                                                    <button onClick={() => handleRemoveFile(edu.id, file.id, 'supporting')} className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-all ml-2">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3
                                    ${edu.provideLater ? 'opacity-40 grayscale pointer-events-none' : ''}
                                    ${errors[`edu_${edu.id}_supportingDocs`] ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-[#F9F7FF]/30 hover:border-[#5D4591]/40'}`}>
                                        <input
                                            type="file"
                                            ref={el => (supportingFileInputRefs.current[edu.id] = el)}
                                            multiple
                                            disabled={edu.provideLater}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleSupportingDocumentsUpload(edu.id, e)}
                                        />
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                                            <Upload size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-600 uppercase">
                                                {(edu.supportingDocuments || []).length > 0 ? "Add More Documents" : "Click to upload supporting documents"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">Supports PDF, PNG, JPG (Max 5MB)</p>
                                        </div>
                                    </div>

                                    <label className={`flex items-center gap-2 mt-4 p-3 rounded-xl cursor-pointer group transition-all
                                    ${edu.provideLater
                                        ? 'bg-[#F9F7FF] border-[#5D4591]/30'
                                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50'
                                    } border`}>

                                        <input
                                            type="checkbox"
                                            checked={edu.provideLater || false}
                                            onChange={(e) => handleChange(edu.id, 'provideLater', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 accent-[#5D4591] text-[#5D4591] focus:ring-[#5D4591]/20 cursor-pointer transition-colors"
                                        />

                                        <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors
                                        ${edu.provideLater ? 'text-[#5D4591]' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                        I don't have these documents right now. I will provide them later.
                                    </span>
                                    </label>

                                    {errors[`edu_${edu.id}_supportingDocs`] && !edu.provideLater && (
                                        <div className="flex items-center gap-1 mt-2 text-red-500">
                                            <AlertCircle size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-tight">{errors[`edu_${edu.id}_supportingDocs`]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-center">
                <button
                    onClick={addEducation}
                    className="flex items-center justify-center bg-[#5D4591] text-white hover:bg-[#4a3675] transition-all duration-300 shadow-lg shadow-[#5D4591]/10 cursor-pointer
                        w-12 h-12 rounded-full
                        sm:w-auto sm:px-8 sm:py-4 sm:rounded-2xl sm:gap-2
                        active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">
                        Add Another Qualification
                    </span>
                </button>
            </div>
            <div className="mt-10 p-5 bg-[#F9F7FF]/30 border border-[#5D4591]/10 rounded-2xl flex gap-4 items-start">
                <div className="p-2 bg-[#F0EDFF] rounded-lg text-[#5D4591]">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-[#241B3B] uppercase tracking-tight">Verification Note</h5>
                    <p className="text-xs text-[#4A3675]/70 mt-1 leading-relaxed">
                    Please ensure the Roll/Registration number matches your certificate exactly. This data is used for background verification with your University/Board.
                </p>
            </div>
        </div>
</div>
);
};

export default Education;
