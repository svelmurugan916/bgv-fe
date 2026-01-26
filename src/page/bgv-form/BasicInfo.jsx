import React, { useState, useCallback } from 'react';
import { InfoIcon, Camera, Trash2, Crop, RefreshCw, X, Check, AlertCircle } from 'lucide-react';
import Cropper from 'react-easy-crop';
import InputComponent from "./InputComponent.jsx";
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import {getCroppedImg} from "./form-utils.js";
import FormSingleDropdownSelect from "./FormSingleDropdownSelect.jsx";
import {EMAIL_REGEX, PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";

const BasicInfo = () => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const data = formData.basic;

    // --- Cropper State ---
    const [originalImage, setOriginalImage] = useState(null); // WORKAROUND: Store original high-res image
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const validateField = (field, value) => {
        let isValid = false;
        switch (field) {
            case 'firstName':
            case 'lastName':
            case 'fatherName':
            case 'gender':
                isValid = value && value.trim().length > 0;
                break;
            case 'email':
                isValid = EMAIL_REGEX.test(value);
                break;
            case 'phone':
                isValid = PHONE_NUMBER_REGEX.test(value);
                break;
            default:
                isValid = true;
        }
        if (isValid) clearError(field);
    };

    const handleInputChange = (field, value) => {
        updateFormData('basic', { ...data, [field]: value });
        validateField(field, value);
    };

    // --- Image Handling Logic ---
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const imageResult = reader.result;
                setOriginalImage(imageResult); // Save the original
                setTempImage(imageResult);

                // Reset cropper position for new file
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setShowCropper(true);
            });
            reader.readAsDataURL(e.target.files[0]);
            e.target.value = "";
        }
    };

    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const saveCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
            updateFormData('basic', { ...data, profilePic: croppedImage });
            setShowCropper(false);
        } catch (e) {
            console.error(e);
        }
    };

    // Helper to handle recrop of existing image
    const handleRecrop = () => {
        // Use originalImage if available, otherwise fallback to current profilePic
        const imageToCrop = originalImage || data.profilePic;
        if (imageToCrop) {
            setTempImage(imageToCrop);
            // WORKAROUND: Reset states to ensure the cropper area is selectable/responsive
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setShowCropper(true);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <FormPageHeader heading={"Basic Information"} helperText={"Provide your personal and contact details."} />

            {/* --- PROFILE PICTURE SECTION --- */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                    <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-50
                        ${data.profilePic ? 'border-[#5D4591] border-solid' : 'border-slate-200 hover:border-[#5D4591]/60'}`}>

                        {data.profilePic ? (
                            <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <label className="flex flex-col items-center cursor-pointer p-4 text-center">
                                <Camera size={28} className="text-slate-400 mb-2" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Upload Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                            </label>
                        )}

                        {data.profilePic && (
                            <div className="absolute inset-0 bg-[#241B3B]/40 lg:bg-[#241B3B]/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={handleRecrop} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all" title="Recrop">
                                    <Crop size={18} />
                                </button>
                                <label className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white cursor-pointer transition-all" title="Change">
                                    <RefreshCw size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                                </label>
                                <button onClick={() => {
                                    updateFormData('basic', { ...data, profilePic: null });
                                    setOriginalImage(null); // Clear original too
                                }} className="p-2 bg-white/20 hover:bg-red-500 rounded-full text-white transition-all" title="Remove">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest">Candidate Profile Picture</p>
            </div>

            {/* --- PERSONAL DETAILS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                <div id={"firstName"}>
                    <InputComponent
                        label="First Name"
                        error={errors.firstName}
                        isMandatory={true}
                        value={data.firstName}
                        placeholder={"e.g. John"}
                        isValid={data.firstName.length > 2}
                        onChange={(v) => handleInputChange('firstName', v)}
                    />
                </div>
                <InputComponent
                    label="Middle Name (Optional)"
                    placeholder={"e.g. Smith (Optional)"}
                    value={data.middleName || ''}
                    onChange={(v) => handleInputChange('middleName', v)}
                />
                <div id={"lastName"}>
                    <InputComponent
                        label="Last Name"
                        value={data.lastName}
                        isMandatory={true}
                        error={errors.lastName}
                        placeholder={"e.g. Doe"}
                        isValid={data.lastName.length > 2}
                        onChange={(v) => handleInputChange('lastName', v)}
                    />
                </div>

                <div className="flex flex-col gap-1.5" id={"gender"}>
                    <FormSingleDropdownSelect
                        title={"Gender"}
                        isMandatory={true}
                        label={"Select Gender"}
                        error={errors.gender}
                        selected={data.gender}
                        onSelect={(option) => handleInputChange('gender', option)}
                        isOccupyFullWidth={true}
                        options={[
                            { text: "Male", value: "male" },
                            { text: "Female", value: "female" },
                            { text: "Other", value: "other" }
                        ]}
                    />
                    {errors.gender && (
                        <div className="flex items-center gap-1 mt-1 text-red-500">
                            <AlertCircle size={12} />
                            <span className="text-[10px] font-bold uppercase">{errors.gender}</span>
                        </div>
                    )}
                </div>

                <div id={"email"}>
                    <InputComponent
                        label="Email Address"
                        type="email"
                        isValid={EMAIL_REGEX.test(data.email)}
                        isMandatory={true}
                        error={errors.email}
                        placeholder={"e.g. name@example.com"}
                        value={data.email}
                        onChange={(v) => handleInputChange('email', v)}
                    />
                </div>

                <div id={"phone"}>
                    <InputComponent
                        label="Phone Number"
                        value={data.phone}
                        isMandatory={true}
                        error={errors.phone}
                        isValid={PHONE_NUMBER_REGEX.test(data.phone)}
                        placeholder={"10 Digit Mobile"}
                        onChange={(v) => handleInputChange('phone', v)}
                    />
                </div>

                <div id={"fatherName"}>
                    <InputComponent
                        label="Father's Name"
                        isMandatory={true}
                        placeholder={"e.g. Robert Sharma"}
                        value={data.fatherName}
                        error={errors.fatherName}
                        onChange={(v) => handleInputChange('fatherName', v)}
                    />
                </div>

            </div>

            {/* --- CROPPER MODAL --- */}
            {showCropper && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">Adjust Profile Picture</h3>
                            <button onClick={() => setShowCropper(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>

                        <div className="relative h-80 bg-slate-100">
                            <Cropper
                                image={tempImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1} max={3} step={0.1}
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#5D4591]"
                                />
                            </div>
                            <div className="flex gap-3 items-center justify-center">
                                {/* Desktop Buttons */}
                                <button onClick={() => setShowCropper(false)} className="hidden lg:block flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button onClick={saveCroppedImage} className="hidden lg:flex flex-1 py-3 bg-[#5D4591] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#5D4591]/10 items-center justify-center gap-2 hover:bg-[#4a3675] transition-all">
                                    <Check size={18} /> Save Photo
                                </button>

                                {/* Mobile Icons: Circular rounded style */}
                                <div className="flex lg:hidden w-full justify-around items-center py-2">
                                    <button
                                        onClick={() => setShowCropper(false)}
                                        className="w-8 h-8 rounded-full  flex items-center justify-center bg-white text-slate-500 active:scale-90 transition-transform"
                                    >
                                        <X size={24} />
                                    </button>
                                    <button
                                        onClick={saveCroppedImage}
                                        className="w-10 h-10 rounded-full bg-[#5D4591] flex items-center justify-center text-white shadow-xl shadow-[#5D4591]/10 active:scale-90 transition-transform"
                                    >
                                        <Check size={26} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 ">
                <InfoIcon size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">Ensure your details are active for verification.</p>
            </div>
        </div>
    );
};



export default BasicInfo;
