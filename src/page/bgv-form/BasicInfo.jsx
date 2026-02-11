import React, {useState, useCallback, useEffect} from 'react';
import {
    InfoIcon,
    Camera,
    Trash2,
    Crop,
    RefreshCw,
    X,
    Check,
    AlertCircle,
    Loader2,
    RefreshCwIcon,
    Trash2Icon, AlertCircleIcon, CheckIcon
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import InputComponent from "./InputComponent.jsx";
import FormPageHeader from "./FormPageHeader.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import {getCroppedImg} from "./form-utils.js";
import FormSingleDropdownSelect from "./FormSingleDropdownSelect.jsx";
import {EMAIL_REGEX, METHOD, PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";
import CustomDatePicker from "../../component/common/CustomDatePicker.jsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {REMOVE_PROFILE_PICTURE, UPLOAD_PROFILE_PICTURE} from "../../constant/Endpoint.tsx";

const BasicInfo = ({ checks }) => {
    const { formData, updateFormData, errors, clearError, candidateId } = useForm();
    const data = formData.basic;
    const { authenticatedRequest } = useAuthApi();

    // --- Cropper State ---
    const [originalImage, setOriginalImage] = useState(null); // WORKAROUND: Store original high-res image
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

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

    console.log("formData -- ", candidateId);

    const handleDeleteImage = async () => {
        setIsDeleting(true);
        try {

            const response = await authenticatedRequest(
               undefined,
                `${REMOVE_PROFILE_PICTURE.replace("{candidateId}", candidateId)}`, // Update with your actual endpoint
                METHOD.DELETE,
            );

            if (response.status === 200) {
                // Clear all local states upon successful deletion
                updateFormData('basic', { ...data, profilePic: null, profilePictureUrl: null });
                setOriginalImage(null);
                setUploadStatus('idle');
            }
        } catch (error) {
            console.error("Delete failed", error);
            setDeleteError(true);
            setUploadStatus('error');
        } finally {
            setIsDeleting(false);
        }
    };

    const uploadProfileImage = async (imageBlob) => {
        setUploadStatus('uploading');
        setUploadProgress(0);

        const file = new File([imageBlob], "profile.jpg", { type: "image/jpeg" });
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await authenticatedRequest(
                uploadData,
                `${UPLOAD_PROFILE_PICTURE.replace("{candidateId}", candidateId)}`,
                METHOD.POST,
                {
                    // This is where you pass the progress handler
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                }
            );

            if (response.status === 200) {
                setUploadStatus('success');
                setTimeout(() => setUploadStatus('idle'), 3000);
            }
        } catch (error) {
            setUploadStatus('error');
        }
    };


    const handleInputChange = (field, value) => {
        console.log('handleInputChange', field, value);
        updateFormData('basic', { ...data, [field]: value });
        validateField(field, value);
    };

    useEffect(() => {
        console.log('formData -- ', formData);
    }, [formData])

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

    useEffect(() => {
        if (data.profilePictureUrl && !data.profilePic) {
            setIsImageLoading(true);
        }
    }, [data.profilePictureUrl, data.profilePic]);

    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const saveCroppedImage = async () => {
        try {
            // getCroppedImg should return a blob/url
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);

            // 1. Update local UI state
            updateFormData('basic', { ...data, profilePic: croppedImage });
            setShowCropper(false);

            // 2. Trigger API Upload
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            await uploadProfileImage(blob);

        } catch (e) {
            console.error(e);
            setUploadStatus('error');
        }
    };

    // Helper to handle recrop of existing image
    const handleRecrop = () => {
        // Use originalImage if available, otherwise fallback to current profilePic
        const imageToCrop = originalImage || data.profilePic || data.profilePictureUrl;
        if (imageToCrop) {
            setTempImage(imageToCrop);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setShowCropper(true);
        }
    };

    const doesCheckContainsId = checks.includes("IDENTITY");
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <FormPageHeader heading={"Basic Information"} helperText={"Provide your personal and contact details."} />

            {/* --- PROFILE PICTURE SECTION --- */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                    <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden bg-slate-50 relative
                    ${uploadStatus === 'success' ? 'border-emerald-500 shadow-lg shadow-emerald-100' :
                        (data.profilePic || data.profilePictureUrl) ? 'border-[#5D4591] border-solid' : 'border-dashed border-slate-200 hover:border-[#5D4591]/60'}`}>

                        {/* 1. IMAGE DISPLAY */}
                        {(data.profilePic || data.profilePictureUrl) ? (
                            <img
                                src={data.profilePic || data.profilePictureUrl}
                                alt="Profile"
                                onLoad={() => setIsImageLoading(false)}
                                onError={() => setIsImageLoading(false)}
                                className={`w-full h-full object-cover transition-all duration-500 
                        ${(uploadStatus === 'uploading' || isImageLoading || isDeleting) ? 'opacity-0' : 'opacity-100'}`}
                            />
                        ) : (
                            <label className="flex flex-col items-center cursor-pointer p-4 text-center">
                                <Camera size={28} className="text-slate-400 mb-2" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Upload Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                            </label>
                        )}

                        {/* 2. S3 FETCHING LOADER */}
                        {isImageLoading && !uploadStatus === 'uploading' && !isDeleting && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 animate-pulse">
                                <div className="w-8 h-8 border-2 border-[#5D4591]/20 border-t-[#5D4591] rounded-full animate-spin mb-2" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Loading Image...</span>
                            </div>
                        )}

                        {/* 3. API UPLOADING OVERLAY */}
                        {uploadStatus === 'uploading' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
                                <Loader2 className="text-[#5D4591] animate-spin mb-2" size={24} />
                                <span className="text-[10px] font-black text-[#5D4591]">{uploadProgress}%</span>
                                <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
                                    <div className="h-full bg-[#5D4591] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            </div>
                        )}

                        {/* 4. DELETING OVERLAY */}
                        {isDeleting && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] z-40">
                                <Loader2 className="text-red-500 animate-spin mb-2" size={24} />
                                <span className="text-[10px] font-black text-red-500 uppercase">Deleting...</span>
                            </div>
                        )}

                        {/* 5. SUCCESS OVERLAY */}
                        {uploadStatus === 'success' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/10 animate-in fade-in duration-500 z-20">
                                <div className="bg-emerald-500 text-white rounded-full p-2 shadow-lg scale-110 animate-in zoom-in-50">
                                    <Check size={24} strokeWidth={3} />
                                </div>
                            </div>
                        )}

                        {/* 6. ERROR OVERLAY */}
                        {uploadStatus === 'error' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-50 animate-in fade-in">
                                <AlertCircle className="text-red-500 mb-1" size={24} />
                                <span className="text-[8px] font-bold text-red-500 uppercase">
                                    {deleteError ? 'Delete Failed' : 'Upload Failed'}
                                </span>
                                <button
                                    onClick={() => { setUploadStatus('idle'); setDeleteError(false); }}
                                    className="mt-2 text-[8px] font-bold underline text-slate-500 uppercase"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {/* 7. HOVER ACTIONS */}
                        {(data.profilePic || data.profilePictureUrl) && uploadStatus === 'idle' && !isImageLoading && !isDeleting && (
                            <div className="absolute inset-0 bg-[#241B3B]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                                {data.profilePic && (
                                    <button onClick={handleRecrop} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all" title="Recrop">
                                        <Crop size={18} />
                                    </button>
                                )}
                                <label className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white cursor-pointer transition-all" title="Change">
                                    <RefreshCw size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                                </label>
                                <button onClick={handleDeleteImage} className="p-2 bg-white/20 hover:bg-red-500 rounded-full text-white transition-all" title="Remove">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Text Logic */}
                <p className="text-[10px] font-bold uppercase mt-3 tracking-widest">
                    {uploadStatus === 'success' ? (
                        <span className="text-emerald-600 flex items-center gap-1"><Check size={12} /> Profile Picture Uploaded</span>
                    ) : uploadStatus === 'uploading' ? (
                        <span className="text-[#5D4591]">Uploading to server...</span>
                    ) : isDeleting ? (
                        <span className="text-red-500 animate-pulse">Removing Photo...</span>
                    ) : isImageLoading ? (
                        <span className="text-slate-400 animate-pulse">Fetching from S3...</span>
                    ) : (
                        <span className="text-slate-400">Candidate Profile Picture</span>
                    )}
                </p>
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
                {
                    !doesCheckContainsId && (
                        <div id={"dateOfBirth"}>
                            <CustomDatePicker
                                label="Date Of Birth"
                                isMandatory={true}
                                value={data.dateOfBirth}
                                error={errors.dateOfBirth}
                                onChange={(v) => handleInputChange('dateOfBirth', v)}
                            />
                        </div>
                    )
                }


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
