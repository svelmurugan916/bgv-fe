import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload, Check, Loader2, FileText, AlertCircle } from 'lucide-react';
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import FormSingleDropdownSelect from "./FormSingleDropdownSelect.jsx";
import InputComponent from "./InputComponent.jsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import {EXTRACT_EDUCATION_DOCUMENT} from "../../constant/Endpoint.tsx";
import { v4 as uuidv4 } from 'uuid';

const Education = () => {
    const { formData, updateFormData, errors, clearError, candidateId } = useForm();
    const { authenticatedRequest } = useAuthApi();
    const data = formData.education;

    // Track progress per file ID: { [fileId]: percentage }
    const [uploadProgress, setUploadProgress] = useState({});
    const [lastAddedId, setLastAddedId] = useState(null);

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
            year: '',
            gpa: '',
            rollNumber: '',
            documents: [],
            isExtracted: false,
            provideLater: false
        };
        updateFormData('education', [...data, newEntry]);
        setLastAddedId(newId);
    };

    const removeEducation = (id) => {
        if (data.length > 1) {
            updateFormData('education', data.filter(item => item.id !== id));
        }
    };

    const handleChange = (id, field, value) => {
        const updatedEducation = data.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        updateFormData('education', updatedEducation);
        if (value) clearError(`edu_${id}_${field}`);
        if (field === 'provideLater' && value === true) clearError(`edu_${id}_doc`);
    };

    const handleFileChange = async (eduId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempFileId = uuidv4();

        const updatedWithPlaceholder = data.map(item => {
            if (item.id === eduId) {
                return {
                    ...item,
                    provideLater: false,
                    documents: [...(item.documents || []), {
                        id: tempFileId,
                        name: file.name,
                        status: 'processing'
                    }]
                };
            }
            return item;
        });

        // Update UI immediately to show progress bar
        updateFormData('education', updatedWithPlaceholder);
        clearError(`edu_${eduId}_doc`);

        try {
            const filePayload = new FormData();
            filePayload.append('file', file);

            const response = await authenticatedRequest(
                filePayload,
                `${EXTRACT_EDUCATION_DOCUMENT}/${candidateId}`,
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

                const finalUpdate = updatedWithPlaceholder.map(edu => {
                    if (edu.id === eduId) {
                        const updatedDocs = edu.documents.map(doc =>
                            doc.id === tempFileId ? {
                                ...doc,
                                id: responseData.documentId, // Server ID
                                name: responseData.fileName || doc.name, // Server Filename
                                status: 'success'
                            } : doc
                        );

                        let finalRoll = edu.rollNumber;
                        if (!finalRoll && responseData.extractedData?.extractedPiiData) {
                            finalRoll = responseData.extractedData.extractedPiiData;
                        }

                        return {
                            ...edu,
                            documents: updatedDocs,
                            rollNumber: finalRoll,
                            isExtracted: !!responseData.extractedData?.extractedPiiData
                        };
                    }
                    return edu;
                });

                console.log('finalUpdate with Docs -- ', finalUpdate);
                updateFormData('education', finalUpdate);
            }
        } catch (error) {
            console.error("Upload failed", error);
            // If failed, remove the specific temp file from the placeholder list
            const errorUpdate = updatedWithPlaceholder.map(edu => {
                if (edu.id === eduId) {
                    return {
                        ...edu,
                        documents: edu.documents.filter(d => d.id !== tempFileId)
                    };
                }
                return edu;
            });

            updateFormData('education', errorUpdate);
        } finally {
            setUploadProgress(prev => {
                const next = { ...prev };
                delete next[tempFileId];
                return next;
            });
        }
        e.target.value = "";
    };


    const handleGPAChange = (id, value) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            handleChange(id, 'gpa', value);
        }
    };

    const handleRemoveFile = (eduId, fileId) => {
        const updated = data.map(item => {
            if (item.id === eduId) {
                return { ...item, documents: item.documents.filter(f => f.id !== fileId) };
            }
            return item;
        });
        updateFormData('education', updated);
    };

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
                {data.map((edu, index) => (
                    <div key={edu.id} id={`edu_card_${edu.id}`} className="px-4 py-6 sm:p-8 border border-slate-200 rounded-2xl bg-white shadow-sm relative animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-full bg-[#5D4591] text-white flex items-center justify-center text-[10px] font-bold">
                                0{index + 1}
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Education Details</h3>
                            {data.length > 1 && (
                                <button onClick={() => removeEducation(edu.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                                    onSelect={(option) => handleChange(edu.id, 'level', option)}
                                />
                            </div>

                            <div id={`edu_${edu.id}_degree`}>
                                <InputComponent
                                    label="Degree / Specialization"
                                    isMandatory={true}
                                    placeholder={"e.g. B.E Computer Science"}
                                    value={edu.degree}
                                    error={errors[`edu_${edu.id}_degree`]}
                                    onChange={(value) => handleChange(edu.id, 'degree', value)}
                                />
                            </div>

                            <div id={`edu_${edu.id}_college`}>
                                <InputComponent
                                    label="College / University"
                                    placeholder={"e.g. Stanford University"}
                                    isMandatory={true}
                                    value={edu.college}
                                    error={errors[`edu_${edu.id}_college`]}
                                    onChange={(value) => handleChange(edu.id, 'college', value)}
                                />
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
                                    onSelect={(option) => handleChange(edu.id, 'year', option)}
                                />
                            </div>

                            <div id={`edu_${edu.id}_gpa`}>
                                <InputComponent
                                    label="GPA / Percentage"
                                    placeholder={"e.g. 8.5"}
                                    isMandatory={true}
                                    value={edu.gpa}
                                    error={errors[`edu_${edu.id}_gpa`]}
                                    onChange={(value) => handleGPAChange(edu.id, value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5" id={`edu_${edu.id}_roll`}>
                                <div className="flex flex-col gap-1.5" id={`edu_${edu.id}_roll`}>
                                    <InputComponent
                                        label="Roll / Reg Number"
                                        isMandatory={true}
                                        tooltip="Used to verify degree authenticity with the University registrar."
                                        value={edu.rollNumber}
                                        placeholder="Extracted from document"
                                        onChange={(v) => handleChange(edu.id, 'rollNumber', v)}
                                        error={errors[`edu_${edu.id}_roll`]}
                                        isValid={edu.rollNumber?.length > 4}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-2" id={`edu_${edu.id}_doc`}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Upload Certificates / Marksheets *</label>

                                <div className="space-y-3 mb-4">
                                    {edu.documents?.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/30 rounded-2xl animate-in slide-in-from-left-2">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${file.status === 'processing' ? 'bg-[#F9F7FF] text-[#5D4591]' : 'bg-green-100 text-green-600'}`}>
                                                    {file.status === 'processing' ? <Loader2 size={18} className="animate-spin" /> : <FileText size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-sm font-bold text-slate-700 truncate max-w-[150px] sm:max-w-xs">{file.name}</p>
                                                        {file.status === 'processing' && (
                                                            <span className="text-[10px] font-bold text-[#5D4591]">{uploadProgress[file.id] || 0}%</span>
                                                        )}
                                                    </div>

                                                    {file.status === 'processing' ? (
                                                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-[#5D4591] h-full transition-all duration-300"
                                                                style={{ width: `${uploadProgress[file.id] || 0}%` }}
                                                            ></div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[9px] font-bold uppercase tracking-tight text-green-600">Verified & Scanned</p>
                                                    )}
                                                </div>
                                            </div>
                                            {file.status !== 'processing' && (
                                                <button onClick={() => handleRemoveFile(edu.id, file.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-all ml-2">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 
                                    ${edu.provideLater ? 'opacity-40 grayscale pointer-events-none' : ''}
                                    ${errors[`edu_${edu.id}_doc`] ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-[#F9F7FF]/30 hover:border-[#5D4591]/40'}`}>
                                    <input type="file" disabled={edu.provideLater} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(edu.id, e)} />
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                                        <Upload size={20} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-600 uppercase">
                                            {edu.documents?.length > 0 ? "Add Another Document" : "Click to upload document"}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Supports PDF, PNG, JPG (Max 5MB)</p>
                                    </div>
                                </div>

                                {/* Provide Later Toggle */}
                                <label className={`flex items-center gap-2 mt-4 p-3 rounded-xl cursor-pointer group transition-all 
                                    ${edu.provideLater
                                    ? 'bg-[#F9F7FF] border-[#5D4591]/30' // Branded state (Purple 50 equivalent)
                                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50' // Default state
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

                                {errors[`edu_${edu.id}_doc`] && !edu.provideLater && (
                                    <div className="flex items-center gap-1 mt-2 text-red-500">
                                        <AlertCircle size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{errors[`edu_${edu.id}_doc`]}</span>
                                    </div>
                                )}
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
