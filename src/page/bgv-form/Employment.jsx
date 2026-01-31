import React, { useState, useEffect } from 'react';
import {Plus, Trash2, Upload, Check, Loader2, FileText, AlertCircle, Briefcase, Sparkles} from 'lucide-react';
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import InputComponent from "./InputComponent.jsx";
import {EMAIL_REGEX, METHOD, PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {UPLOAD_EMPLOYMENT_DOCUMENT} from "../../constant/Endpoint.tsx";
import { v4 as uuidv4 } from 'uuid';
import CustomDatePicker from "../../component/common/CustomDatePicker.jsx";

const Employment = () => {
    const { formData, updateFormData, errors, clearError, candidateId } = useForm();
    const { authenticatedRequest } = useAuthApi();

    const employmentState = formData.employment;
    const isFresher = employmentState.isFresher || false;
    const details = employmentState.details || [];

    const [uploadProgress, setUploadProgress] = useState({});
    const [lastAddedId, setLastAddedId] = useState(null);

    useEffect(() => {
        if (lastAddedId) {
            const element = document.getElementById(`emp_card_${lastAddedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setLastAddedId(null);
            }
        }
    }, [details.length, lastAddedId]);

    const handleFresherToggle = (checked) => {
        updateFormData('employment', {
            ...employmentState,
            isFresher: checked,
            details: checked ? [] : (details.length > 0 ? details : [createNewEntry()])
        });

        if (checked) {
            Object.keys(errors).forEach(key => {
                if (key.startsWith('emp_') || key === 'employment_general') clearError(key);
            });
        }
    };

    const createNewEntry = () => ({
        id: uuidv4(),
        company: '',
        designation: '',
        employeeId: '',
        joinedDate: '',
        relievedDate: '',
        isCurrent: false,
        hrName: '',
        hrEmail: '',
        hrContact: '',
        doNotContact: false,
        reason: '',
        documents: [],
        provideLater: false
    });

    const addEmployment = () => {
        const newEntry = createNewEntry();
        updateFormData('employment', {
            ...employmentState,
            details: [...details, newEntry]
        });
        setLastAddedId(newEntry.id);
    };

    useEffect(() => {
        if (!isFresher && details.length === 0) {
            addEmployment();
        }
    }, [isFresher, details.length]);

    const removeEmployment = (id) => {
        if (details.length > 1) {
            updateFormData('employment', {
                ...employmentState,
                details: details.filter(item => item.id !== id)
            });
        }
    };

    const handleChange = (id, field, value) => {
        const updatedDetails = details.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'isCurrent' && value === true) {
                    updatedItem.relievedDate = '';
                    updatedItem.reason = '';
                    clearError(`emp_${id}_relievedDate`);
                    clearError(`emp_${id}_reason`);
                }
                return updatedItem;
            }
            return item;
        });
        updateFormData('employment', { ...employmentState, details: updatedDetails });

        if (value !== undefined && value !== '') clearError(`emp_${id}_${field}`);
        if (field === 'provideLater' && value === true) clearError(`emp_${id}_doc`);
    };

    const handleFileChange = async (empId, e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        const tempFiles = selectedFiles.map(file => ({
            tempId: Math.random().toString(36).substr(2, 9),
            name: file.name
        }));

        const placeholderDetails = details.map(item => item.id === empId ? {
            ...item,
            provideLater: false,
            documents: [
                ...(item.documents || []),
                ...tempFiles.map(tf => ({ id: tf.tempId, name: tf.name, status: 'processing' }))
            ]
        } : item);

        updateFormData('employment', { ...employmentState, details: placeholderDetails });

        try {
            const filePayload = new FormData();
            selectedFiles.forEach(file => filePayload.append('files', file));

            const response = await authenticatedRequest(
                filePayload,
                `${UPLOAD_EMPLOYMENT_DOCUMENT?.replace("{candidateId}", candidateId)}`,
                METHOD.POST,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => {
                            const next = { ...prev };
                            tempFiles.forEach(tf => { next[tf.tempId] = percent; });
                            return next;
                        });
                    }
                }
            );

            if (response.status === 200 && response.data.uploadedFiles) {
                const serverFiles = response.data.uploadedFiles;

                const successDetails = placeholderDetails.map(emp => {
                    if (emp.id !== empId) return emp;

                    let updatedDocs = [...(emp.documents || [])];
                    tempFiles.forEach((tf, index) => {
                        const sFile = serverFiles[index];
                        if (sFile) {
                            updatedDocs = updatedDocs.map(d => d.id === tf.tempId ? {
                                id: sFile.documentId,
                                name: sFile.fileName,
                                status: 'success'
                            } : d);
                        }
                    });

                    return { ...emp, documents: updatedDocs };
                });

                updateFormData('employment', { ...employmentState, details: successDetails });
            }
        } catch (error) {
            const errorDetails = placeholderDetails.map(emp => emp.id === empId ? {
                ...emp,
                documents: emp.documents.filter(d => !tempFiles.map(tf => tf.tempId).includes(d.id))
            } : emp);

            updateFormData('employment', { ...employmentState, details: errorDetails });
        } finally {
            setUploadProgress(prev => {
                const next = { ...prev };
                tempFiles.forEach(tf => delete next[tf.tempId]);
                return next;
            });
        }

        e.target.value = "";
    };

    const handleRemoveFile = (empId, fileId) => {
        const updatedDetails = details.map(item => item.id === empId ? { ...item, documents: item.documents.filter(f => f.id !== fileId) } : item);
        updateFormData('employment', { ...employmentState, details: updatedDetails });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex items-start justify-between gap-4">
                <FormPageHeader heading={"Employment Details"} helperText={"Add your professional experience."} />
            </div>

            {errors.experience_general && (
                <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest leading-none mb-1.5">Education Requirement</p>
                        <p className="text-xs font-bold text-rose-600/90 leading-relaxed">{errors.experience_general}</p>
                    </div>
                </div>
            )}

            <div className="mb-8 p-4 bg-[#F9F7FF] border border-[#5D4591]/20 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5D4591] shadow-sm">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700">Are you a Fresher?</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Toggle this if you have no prior work experience.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isFresher} onChange={(e) => handleFresherToggle(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D4591]"></div>
                </label>
            </div>

            {!isFresher ? (
                <>
                    <div className="grid grid-cols-1 gap-6">
                        {details.map((emp, index) => (
                            <div key={emp.id} id={`emp_card_${emp.id}`} className="px-4 py-6 sm:p-8 border border-slate-200 rounded-2xl bg-white shadow-sm relative animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 rounded-full bg-[#5D4591] text-white flex items-center justify-center text-[10px] font-bold">
                                        0{index + 1}
                                    </div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Experience Details</h3>
                                    {details.length > 1 && (
                                        <button onClick={() => removeEmployment(emp.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div id={`emp_${emp.id}_company`}>
                                        <InputComponent label="Company Name" isMandatory={true} placeholder="e.g. Microsoft" value={emp.company} error={errors[`emp_${emp.id}_company`]} onChange={(v) => handleChange(emp.id, 'company', v)} />
                                    </div>
                                    <div id={`emp_${emp.id}_designation`}>
                                        <InputComponent label="Designation" isMandatory={true} placeholder="e.g. Software Engineer" value={emp.designation} error={errors[`emp_${emp.id}_designation`]} onChange={(v) => handleChange(emp.id, 'designation', v)} />
                                    </div>
                                    <div id={`emp_${emp.id}_employeeId`}>
                                        <InputComponent label="Employee ID" isMandatory={true} placeholder="e.g. EMP12345" value={emp.employeeId} error={errors[`emp_${emp.id}_employeeId`]} onChange={(v) => handleChange(emp.id, 'employeeId', v)} />
                                    </div>

                                    {/* DATE SECTION WITH CUSTOM DATE PICKER */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div id={`emp_${emp.id}_joinedDate`}>
                                                <CustomDatePicker
                                                    label="Joining Date"
                                                    isMandatory={true}
                                                    disableFuture={true}
                                                    value={emp.joinedDate}
                                                    error={errors[`emp_${emp.id}_joinedDate`]}
                                                    onChange={(v) => handleChange(emp.id, 'joinedDate', v)}
                                                />
                                            </div>
                                            <div id={`emp_${emp.id}_relievedDate`}>
                                                {!emp.isCurrent ? (
                                                    <CustomDatePicker
                                                        label="Relieved Date"
                                                        isMandatory={true}
                                                        disableFuture={true}
                                                        value={emp.relievedDate}
                                                        error={errors[`emp_${emp.id}_relievedDate`]}
                                                        onChange={(v) => handleChange(emp.id, 'relievedDate', v)}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Relieved Date</label>
                                                        <div className="w-full py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 text-emerald-600">
                                                            <Check size={16} />
                                                            <span className="text-xs uppercase tracking-widest">Present (Current)</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* CURRENTLY WORKING HERE TOGGLE BELOW DATES */}
                                        <div className="flex items-center gap-2">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={emp.isCurrent}
                                                    onChange={(e) => handleChange(emp.id, 'isCurrent', e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300 accent-[#5D4591] text-[#5D4591] focus:ring-[#5D4591]/20 cursor-pointer transition-colors"
                                                />
                                                <span className={`text-xs font-bold uppercase tracking-tight transition-colors ${emp.isCurrent ? 'text-[#5D4591]' : 'text-slate-500 group-hover:text-[#5D4591]'}`}>
                                                    I currently work here
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="md:col-span-3 flex items-center gap-2 border-b border-slate-200 pb-3">
                                            <Briefcase size={14} className="text-slate-400" />
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">HR / Reporting Manager Details</h4>
                                        </div>
                                        <div id={`emp_${emp.id}_hrName`}>
                                            <InputComponent label="HR Name" isMandatory={true} placeholder="e.g. John Doe" value={emp.hrName} error={errors[`emp_${emp.id}_hrName`]} onChange={(v) => handleChange(emp.id, 'hrName', v)} />
                                        </div>
                                        <div id={`emp_${emp.id}_hrEmail`}>
                                            <InputComponent label="HR Email ID" isValid={EMAIL_REGEX.test(emp.hrEmail)} isMandatory={true} placeholder="hr@company.com" value={emp.hrEmail} error={errors[`emp_${emp.id}_hrEmail`]} onChange={(v) => handleChange(emp.id, 'hrEmail', v)} />
                                        </div>
                                        <div id={`emp_${emp.id}_hrContact`}>
                                            <InputComponent label="HR Contact No" isMandatory={true} placeholder="10 Digit Mobile" value={emp.hrContact} error={errors[`emp_${emp.id}_hrContact`]} tooltip="Verification contact." isValid={PHONE_NUMBER_REGEX.test(emp.hrContact)} onChange={(v) => handleChange(emp.id, 'hrContact', v)} />

                                            <label className="flex items-center gap-2 mt-2 cursor-pointer group w-fit">
                                                <input
                                                    type="checkbox"
                                                    checked={emp.doNotContact || false}
                                                    onChange={(e) => handleChange(emp.id, 'doNotContact', e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded border-slate-300 accent-red-500 text-red-500 cursor-pointer"
                                                />
                                                <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${emp.doNotContact ? 'text-red-500' : 'text-slate-500 group-hover:text-red-500'}`}>
                                                    Do not contact this employer
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {!emp.isCurrent && (
                                        <div className="md:col-span-2" id={`emp_${emp.id}_reason`}>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Reason for Relieving *</label>
                                            <textarea rows="2" placeholder="Briefly explain why you left..." value={emp.reason} onChange={(e) => handleChange(emp.id, 'reason', e.target.value)} className={`w-full p-3 border rounded-xl outline-none text-sm transition-all ${errors[`emp_${emp.id}_reason`] ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-[#5D4591]'}`} />
                                        </div>
                                    )}

                                    <div className="md:col-span-2 mt-2" id={`emp_${emp.id}_doc`}>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Experience Certificate / Payslips *</label>
                                        <div className="space-y-3 mb-4">
                                            {emp.documents?.map((file) => (
                                                <div key={file.id} className="flex items-center justify-between p-4 border border-slate-100 bg-white rounded-2xl shadow-sm animate-in slide-in-from-left-2">
                                                    <div className="flex items-center gap-3 w-full">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${file.status === 'processing' ? 'bg-[#F9F7FF] text-[#5D4591]' : 'bg-green-50 text-green-600'}`}>
                                                            {file.status === 'processing' ? <Loader2 size={18} className="animate-spin" /> : <FileText size={20} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                                                                {file.status === 'processing' && <span className="text-[10px] font-bold text-[#5D4591]">{uploadProgress[file.id] || 0}%</span>}
                                                            </div>
                                                            {file.status === 'processing' ? (
                                                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                                    <div className="bg-[#5D4591] h-full transition-all duration-300" style={{ width: `${uploadProgress[file.id] || 0}%` }}></div>
                                                                </div>
                                                            ) : <p className="text-[9px] font-bold uppercase tracking-tight text-green-600">Attached & Verified</p>}
                                                        </div>
                                                    </div>
                                                    {file.status !== 'processing' && <button onClick={() => handleRemoveFile(emp.id, file.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-all ml-2"><Trash2 size={18} /></button>}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 
                                            ${emp.provideLater ? 'opacity-40 grayscale pointer-events-none' : ''}
                                            ${errors[`emp_${emp.id}_doc`] ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-[#F9F7FF]/30 hover:border-[#5D4591]/40'}`}>
                                            <input type="file" multiple disabled={emp.provideLater} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(emp.id, e)} />
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400"><Upload size={20} /></div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-slate-600 uppercase">{emp.documents?.length > 0 ? "Add More Documents" : "Click to upload document"}</p>
                                            </div>
                                        </div>

                                        <label className={`flex items-center gap-2 mt-4 p-3 rounded-xl cursor-pointer group transition-all ${emp.provideLater ? 'bg-[#F9F7FF] border-[#5D4591]/30' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50'} border`}>
                                            <input type="checkbox" checked={emp.provideLater || false} onChange={(e) => handleChange(emp.id, 'provideLater', e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-[#5D4591] text-[#5D4591] cursor-pointer" />
                                            <span className={`text-[10px] font-bold uppercase tracking-tight ${emp.provideLater ? 'text-[#5D4591]' : 'text-slate-500'}`}>I will provide documents later.</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button onClick={addEmployment} className="cursor-pointer flex items-center justify-center bg-[#5D4591] text-white hover:bg-[#4a3675] transition-all duration-300 shadow-lg shadow-[#5D4591]/10 w-12 h-12 rounded-full sm:w-auto sm:px-8 sm:py-4 sm:rounded-2xl sm:gap-2 active:scale-95">
                            <Plus size={20} strokeWidth={3} />
                            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Add Another Experience</span>
                        </button>
                    </div>
                </>
            ) : (
                <div className="py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#5D4591] mb-4">
                        <Sparkles size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-700">Fresher Status Confirmed</h4>
                    <p className="text-sm text-slate-500 max-w-xs mt-2">
                        You have indicated that you are a fresher. No employment history is required to proceed.
                    </p>
                    <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100">
                        <Check size={16} strokeWidth={3} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Ready to proceed</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employment;
