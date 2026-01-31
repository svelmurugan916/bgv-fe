import React, {useEffect, useState} from 'react';
import {
    X,
    Save,
    Loader2,
    ClockIcon,
    CheckCircle2,
    MapPinIcon,
    ShieldCheckIcon,
    Phone, PlusIcon
} from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { METHOD, PHONE_NUMBER_REGEX } from "../../../constant/ApplicationConstant.js";
import InputComponent from "../../../page/bgv-form/InputComponent.jsx";
import CustomDatePicker from "../../common/CustomDatePicker.jsx";
import FormSingleDropdownSelect from "../../../page/bgv-form/FormSingleDropdownSelect.jsx";
import {SAVE_NEW_ADDRESS_ENDPOINT, UPDATE_ADDRESS_ENDPOINT} from "../../../constant/Endpoint.tsx";


const EditAddressModal = ({ isOpen, onClose, addressData = {}, onUpdateSuccess, addressId = null, candidateId = null }) => {
    const { authenticatedRequest } = useAuthApi();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditMode = !!addressId;

    const [formData, setFormData] = useState({
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        stayingFrom: '',
        stayingTo: '',
        isCurrentAddress: false,
        isSelfContact: true,
        siteContactMobile: ''
    });

    // Initialize/Reset form when modal opens or addressData changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                addressType: addressData.addressType || '',
                addressLine1: addressData.addressLine1 || '',
                addressLine2: addressData.addressLine2 || '',
                city: addressData.city || '',
                state: addressData.state || '',
                country: addressData.country || 'India',
                pincode: addressData.pinCode || addressData.pincode || '',
                stayingFrom: addressData.stayingFrom || '',
                stayingTo: addressData.stayingTo || '',
                isCurrentAddress: addressData.isCurrentAddress || false,
                isSelfContact: addressData.isSelfContact ?? true,
                siteContactMobile: addressData?.addressCandidateSubmittedResponse?.siteContactMobile || addressData.siteContactMobile || ''
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        const addr = formData;

        if (!addr.addressLine1) newErrors.addressLine1 = "Required";
        if (!addr.city) newErrors.city = "Required";
        if (!addr.state) newErrors.state = "Required";
        if (!addr.country) newErrors.country = "Required";
        if (!addr.addressType) newErrors.addressType = "Required";

        if (!addr.pincode || addr.pincode.length !== 6) {
            newErrors.pincode = "Invalid PIN";
        }

        if (!addr.isSelfContact && !PHONE_NUMBER_REGEX.test(addr.siteContactMobile)) {
            newErrors.siteContactMobile = "Invalid Mobile";
        }

        if (!addr.stayingFrom) newErrors.stayingFrom = "Required";

        if (!addr.isCurrentAddress && !addr.stayingTo) {
            newErrors.stayingTo = "Required";
        }

        if (addr.stayingFrom && addr.stayingTo && new Date(addr.stayingFrom) > new Date(addr.stayingTo)) {
            newErrors.stayingTo = "Must be after 'From' date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        let newData = { ...formData, [field]: value };

        if (field === 'addressType' && value === 'CURRENT') {
            newData.isCurrentAddress = true;
            newData.stayingTo = '';
        }
        if (field === 'isSelfContact' && value === true) {
            newData.siteContactMobile = '';
        }
        if (field === 'isCurrentAddress' && value === true) {
            newData.stayingTo = '';
        }

        setFormData(newData);

        // Clear error for this field as user corrects it
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                addressId: addressData.id
            };

            const endpoint = isEditMode
                ? `${UPDATE_ADDRESS_ENDPOINT}/${addressId}`
                : `${SAVE_NEW_ADDRESS_ENDPOINT}/${candidateId}`;
            const method = isEditMode ? METHOD.PUT : METHOD.POST;
            const response = await authenticatedRequest(payload, endpoint, method);
            if (response.status === 200) {
                onUpdateSuccess(payload);
                onClose();
            }
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Address Details' : 'Add New Address'}</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">{isEditMode ? 'Update residency information.' : 'Provide a new residency entry for verification.'}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    <div className="space-y-8">

                        {/* 1. Basic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <FormSingleDropdownSelect
                                    title={"Address Type"}
                                    isMandatory={true}
                                    label={"Address type"}
                                    error={errors.addressType}
                                    selected={formData.addressType}
                                    onSelect={(option) => handleChange('addressType', option)}
                                    isOccupyFullWidth={true}
                                    options={[
                                        { text: "Current Address", value: "CURRENT" },
                                        { text: "Permanent Address", value: "PERMANENT" },
                                        { text: "Past Address", value: "INTERMEDIATE" }
                                    ]}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <InputComponent
                                    label="Address Line 1"
                                    isMandatory={true}
                                    error={errors.addressLine1}
                                    value={formData.addressLine1}
                                    onChange={(v) => handleChange('addressLine1', v)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <InputComponent
                                    label="Address Line 2 (Optional)"
                                    value={formData.addressLine2}
                                    onChange={(v) => handleChange('addressLine2', v)}
                                />
                            </div>
                            <InputComponent
                                label="City"
                                isMandatory={true}
                                error={errors.city}
                                value={formData.city}
                                onChange={(v) => handleChange('city', v)}
                            />
                            <InputComponent
                                label="State"
                                isMandatory={true}
                                error={errors.state}
                                value={formData.state}
                                onChange={(v) => handleChange('state', v)}
                            />
                            <InputComponent
                                label="Pincode"
                                isMandatory={true}
                                error={errors.pincode}
                                value={formData.pincode}
                                onChange={(v) => handleChange('pincode', v)}
                            />
                            <InputComponent
                                label="Country"
                                isMandatory={true}
                                error={errors.country}
                                value={formData.country}
                                onChange={(v) => handleChange('country', v)}
                            />
                        </div>

                        {/* 2. Duration Section */}
                        <div className="p-6 bg-white rounded-[1.5rem] border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <ClockIcon size={16} className="text-[#5D4591]" />
                                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Duration of Stay</span>
                                </div>

                                <label className={`flex items-center gap-3 group ${formData.addressType === 'CURRENT' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#5D4591] transition-colors uppercase">Currently Staying Here</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox" className="sr-only peer"
                                            checked={formData.isCurrentAddress}
                                            disabled={formData.addressType === 'CURRENT'}
                                            onChange={(e) => handleChange('isCurrentAddress', e.target.checked)}
                                        />
                                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#5D4591] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                                    </div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomDatePicker
                                    label="Staying From"
                                    isMandatory={true}
                                    value={formData.stayingFrom}
                                    error={errors.stayingFrom}
                                    onChange={(v) => handleChange('stayingFrom', v)}
                                />

                                {!formData.isCurrentAddress ? (
                                    <CustomDatePicker
                                        label="Staying Until"
                                        isMandatory={true}
                                        value={formData.stayingTo}
                                        error={errors.stayingTo}
                                        onChange={(v) => handleChange('stayingTo', v)}
                                    />
                                ) : (
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Staying Until</label>
                                        <div className="w-full py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 text-emerald-600">
                                            <CheckCircle2 size={16} />
                                            <span className="text-xs uppercase tracking-widest">Present</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Location Verification Section */}
                        <div className="p-6 bg-[#F9F7FF]/50 rounded-[1.5rem] border border-[#5D4591]/10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#5D4591] rounded-xl text-white">
                                        <MapPinIcon size={16} />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-[#241B3B] uppercase tracking-wider block">Location Verification</label>
                                        <p className="text-[9px] text-[#5D4591]/80 font-black uppercase">Automated Geo-Check</p>
                                    </div>
                                </div>

                                <div className="flex w-fit bg-[#F0EDFF]/60 p-1 rounded-xl shadow-sm border border-[#5D4591]/10">
                                    <button onClick={() => handleChange('isSelfContact', true)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.isSelfContact ? 'bg-white text-[#5D4591] shadow-sm' : 'text-[#8B78B4]'}`}>Self</button>
                                    <button onClick={() => handleChange('isSelfContact', false)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!formData.isSelfContact ? 'bg-white text-[#5D4591] shadow-sm' : 'text-[#8B78B4]'}`}>Other</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {!formData.isSelfContact ? (
                                    <div className="animate-in slide-in-from-top-2">
                                        <p className="text-[11px] text-[#4A3675]/80 mb-3 font-bold uppercase tracking-tight">Enter the mobile number of someone currently at this address.</p>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B78B4]" />
                                            <input
                                                type="tel"
                                                placeholder="Contact number for SMS link"
                                                className={`w-full pl-10 p-3.5 bg-white border rounded-2xl text-sm outline-none transition-all ${errors.siteContactMobile ? 'border-red-500' : 'border-[#5D4591]/40 focus:border-[#5D4591]'}`}
                                                value={formData.siteContactMobile}
                                                onChange={(e) => handleChange('siteContactMobile', e.target.value)}
                                            />
                                        </div>
                                        {errors.siteContactMobile && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.siteContactMobile}</p>}
                                    </div>
                                ) : (
                                    <div className="flex gap-3 items-center p-4 bg-white/60 rounded-2xl border border-[#5D4591]/10">
                                        <CheckCircle2 size={16} className="text-[#5D4591] shrink-0" />
                                        <p className="text-[11px] text-[#4A3675] font-bold uppercase tracking-tight">Verification link will be sent to candidate's mobile.</p>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-[#5D4591]/10 flex items-center gap-2">
                                    <ShieldCheckIcon size={14} className="text-[#8B78B4]" />
                                    <p className="text-[10px] text-[#8B78B4] font-black uppercase tracking-tight">Secure geo-tagging replaces physical site visits.</p>
                                </div>
                            </div>
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
                        disabled={loading}
                        className="bg-[#5D4591] text-white px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#4a3675] transition-all shadow-xl shadow-[#5D4591]/20 active:scale-95 flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : isEditMode ? (
                            <Save size={16} />
                        ) : (
                            <PlusIcon size={16} />
                        )}
                        {isEditMode ? 'Save & Update Address' : 'Add Address Entry'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAddressModal;
