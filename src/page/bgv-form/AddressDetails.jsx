import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Phone,
    AlertCircle,
    CheckCircle2,
    ShieldCheckIcon,
    MapPinIcon,
    CalendarIcon,
    ClockIcon
} from 'lucide-react';
import FormPageHeader from "./FormPageHeader.jsx";
import InputComponent from "./InputComponent.jsx";
import { useForm } from "../../provider/FormProvider.jsx";
import FormSingleDropdownSelect from "./FormSingleDropdownSelect.jsx";
import {PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";
import { v4 as uuidv4 } from 'uuid';
import CustomDatePicker from "../../component/common/CustomDatePicker.jsx";

const AddressDetails = () => {
    const { formData, updateFormData, errors, clearError } = useForm();

    const data = formData?.basic || {};
    const addresses = data.addresses || [];

    const [lastAddedId, setLastAddedId] = useState(null);

    useEffect(() => {
        if (addresses.length === 0) {
            addAddress();
        }
    }, [addresses.length]);

    useEffect(() => {
        if (lastAddedId) {
            const element = document.getElementById(`address_card_${lastAddedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setLastAddedId(null);
            }
        }
    }, [addresses.length, lastAddedId]);

    const handleSameAsPermanent = (index) => {
        const permanentAddr = addresses.find(a => a.addressType === 'PERMANENT');
        if (!permanentAddr) return;

        const newAddresses = [...addresses];
        newAddresses[index] = {
            ...newAddresses[index],
            addressLine1: permanentAddr.addressLine1,
            addressLine2: permanentAddr.addressLine2,
            city: permanentAddr.city,
            state: permanentAddr.state,
            pincode: permanentAddr.pincode,
            country: permanentAddr.country
        };
        updateFormData('basic', { ...data, addresses: newAddresses });
        ['addressLine1', 'city', 'state', 'pincode'].forEach(f => clearError(`addr_${index}_${f}`));
    };

    const addAddress = () => {
        const newId = uuidv4();
        const emptyAddress = {
            id: newId,
            addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
            country: 'India', addressType: '', isSelfContact: true, siteContactMobile: '',
            stayingFrom: '', stayingTo: '', isCurrentAddress: false
        };

        updateFormData('basic', { ...data, addresses: [...addresses, emptyAddress] });
        setLastAddedId(newId);
    };

    const removeAddress = (index) => {
        if (addresses.length > 1) {
            const newAddresses = addresses.filter((_, i) => i !== index);
            updateFormData('basic', { ...data, addresses: newAddresses });
        }
    };

    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = { ...newAddresses[index], [field]: value };

        // AUTO-LOGIC: If Address Type is CURRENT, force "Currently Staying Here" to true
        if (field === 'addressType' && value === 'CURRENT') {
            newAddresses[index].isCurrentAddress = true;
            newAddresses[index].stayingTo = '';
            clearError(`addr_${index}_stayingTo`);
        }

        if (field === 'isSelfContact' && value === true) {
            newAddresses[index].siteContactMobile = '';
            clearError(`addr_${index}_siteContactMobile`);
        }

        if (field === 'isCurrentAddress' && value === true) {
            newAddresses[index].stayingTo = '';
            clearError(`addr_${index}_stayingTo`);
        }

        updateFormData('basic', { ...data, addresses: newAddresses });
        validateField(field, value, index, newAddresses[index]);
    };

    const validateField = (field, value, index, currentAddr) => {
        let isValid = false;
        let errorKey = `addr_${index}_${field}`;

        switch (field) {
            case 'addressLine1':
            case 'city':
            case 'state':
            case 'addressType':
                isValid = value?.toString().trim().length > 0;
                break;
            case 'siteContactMobile':
                if (currentAddr.isSelfContact) isValid = true;
                else isValid = PHONE_NUMBER_REGEX.test(value);
                break;
            case 'pincode':
                isValid = /^\d{6}$/.test(value);
                break;
            default:
                isValid = true;
        }
        if (isValid) clearError(errorKey);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex items-start justify-between gap-4">
                <FormPageHeader heading={"Address Details"} helperText={"Provide your address details."} />
            </div>

            {errors.addr_general && (
                <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest leading-none mb-1.5">Residency Requirement</p>
                        <p className="text-xs font-bold text-rose-600/90 leading-relaxed">{errors.addr_general}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 mb-12">
                {addresses.map((addr, index) => (
                    <div key={addr.id || index} id={`address_card_${addr.id}`} className="px-6 py-8 border border-slate-200 rounded-[2rem] bg-white shadow-sm relative animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#5D4591]/10 text-[#5D4591] flex items-center justify-center text-xs font-black">
                                    0{index + 1}
                                </div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Address Entry</h3>
                            </div>

                            <div className="flex items-center gap-3">
                                {addr.addressType === 'CURRENT' && addresses.some(a => a.addressType === 'PERMANENT') && (
                                    <button
                                        onClick={() => handleSameAsPermanent(index)}
                                        className="text-[10px] font-bold text-[#5D4591] uppercase bg-[#F9F7FF] px-4 py-2 rounded-xl hover:bg-[#F0EDFF] transition-colors cursor-pointer"
                                    >
                                        Same as Permanent
                                    </button>
                                )}

                                {addresses.length > 1 && (
                                    <button
                                        onClick={() => removeAddress(index)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex flex-col gap-1.5" id={`addr_${index}_addressType`}>
                                <FormSingleDropdownSelect
                                    title={"Address Type"}
                                    isMandatory={true}
                                    label={"Address type"}
                                    error={errors[`addr_${index}_addressType`]}
                                    selected={addr.addressType}
                                    onSelect={(option) => handleAddressChange(index, 'addressType', option)}
                                    isOccupyFullWidth={true}
                                    options={[{ text: "Current Address", value: "CURRENT" }, { text: "Permanent Address", value: "PERMANENT" }, { text: "Past Address", value: "PAST" }]}
                                />
                            </div>

                            <div className="md:col-span-2" id={`addr_${index}_addressLine1`}>
                                <InputComponent
                                    label="Address Line 1"
                                    placeholder={"e.g. Flat No. 101, Springfield Apartments"}
                                    isMandatory={true}
                                    value={addr.addressLine1}
                                    error={errors[`addr_${index}_addressLine1`]}
                                    onChange={(v) => handleAddressChange(index, 'addressLine1', v)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <InputComponent
                                    placeholder={"e.g. Near City Park, Koramangala"}
                                    label="Address Line 2 (Optional)"
                                    value={addr.addressLine2}
                                    onChange={(v) => handleAddressChange(index, 'addressLine2', v)}
                                />
                            </div>
                            <div id={`addr_${index}_city`}>
                                <InputComponent
                                    label="City"
                                    placeholder={"e.g. Bangalore"}
                                    isMandatory={true}
                                    error={errors[`addr_${index}_city`]}
                                    value={addr.city}
                                    onChange={(v) => handleAddressChange(index, 'city', v)}
                                />
                            </div>
                            <div id={`addr_${index}_state`}>
                                <InputComponent
                                    label="State"
                                    placeholder={"e.g. Karnataka"}
                                    isMandatory={true}
                                    value={addr.state}
                                    error={errors[`addr_${index}_state`]}
                                    onChange={(v) => handleAddressChange(index, 'state', v)}
                                />
                            </div>
                            <div id={`addr_${index}_pincode`}>
                                <InputComponent
                                    label="Pincode"
                                    placeholder={"e.g. 560034"}
                                    isMandatory={true}
                                    value={addr.pincode}
                                    error={errors[`addr_${index}_pincode`]}
                                    onChange={(v) => handleAddressChange(index, 'pincode', v)}
                                />
                            </div>
                            <div id={`addr_${index}_country`}>
                                <InputComponent
                                    label="Country"
                                    placeholder={"e.g. India"}
                                    isMandatory={true}
                                    value={addr.country}
                                    error={errors[`addr_${index}_country`]}
                                    onChange={(v) => handleAddressChange(index, 'country', v)}
                                />
                            </div>

                            <div className="md:col-span-2 mt-4 p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <ClockIcon size={16} className="text-[#5D4591]" />
                                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Duration of Stay</span>
                                    </div>

                                    <label className={`flex items-center gap-3 group ${addr.addressType === 'CURRENT' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#5D4591] transition-colors uppercase">Currently Staying Here</span>
                                        <div className="relative">
                                            <input
                                                type="checkbox" className="sr-only peer"
                                                checked={addr.isCurrentAddress}
                                                disabled={addr.addressType === 'CURRENT'} // Disable if address type is CURRENT
                                                onChange={(e) => handleAddressChange(index, 'isCurrentAddress', e.target.checked)}
                                            />
                                            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#5D4591] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                                        </div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomDatePicker
                                        label="Staying From"
                                        isMandatory={true}
                                        disableFuture={true}
                                        value={addr.stayingFrom}
                                        error={errors[`addr_${index}_stayingFrom`]}
                                        onChange={(v) => handleAddressChange(index, 'stayingFrom', v)}
                                    />

                                    {!addr.isCurrentAddress ? (
                                        <CustomDatePicker
                                            label="Staying Until"
                                            isMandatory={true}
                                            disableFuture={true}
                                            value={addr.stayingTo}
                                            error={errors[`addr_${index}_stayingTo`]}
                                            onChange={(v) => handleAddressChange(index, 'stayingTo', v)}
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

                            <div className="md:col-span-2 p-6 bg-[#F9F7FF]/50 rounded-[1.5rem] border border-[#5D4591]/10 mt-2">
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
                                        <button onClick={() => handleAddressChange(index, 'isSelfContact', true)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${addr.isSelfContact ? 'bg-white text-[#5D4591] shadow-sm' : 'text-[#8B78B4]'} cursor-pointer`}>Self</button>
                                        <button onClick={() => handleAddressChange(index, 'isSelfContact', false)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!addr.isSelfContact ? 'bg-white text-[#5D4591] shadow-sm' : 'text-[#8B78B4]'} cursor-pointer`}>Other</button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {!addr.isSelfContact ? (
                                        <div className="animate-in slide-in-from-top-2 duration-300" id={`addr_${index}_siteContactMobile`}>
                                            <p className="text-[11px] text-[#4A3675]/80 mb-3 font-bold uppercase tracking-tight">Enter the mobile number of someone currently at this address.</p>
                                            <div className="relative">
                                                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B78B4]" />
                                                <input type="tel" placeholder="Contact number for SMS link" className={`w-full pl-10 p-3.5 bg-white border rounded-2xl text-sm outline-none transition-all ${errors[`addr_${index}_siteContactMobile`] ? 'border-red-500' : 'border-[#5D4591]/40 focus:border-[#5D4591]'}`} value={addr.siteContactMobile} onChange={(e) => handleAddressChange(index, 'siteContactMobile', e.target.value)} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 items-center p-4 bg-white/60 rounded-2xl border border-[#5D4591]/10 animate-in fade-in">
                                            <CheckCircle2 size={16} className="text-[#5D4591] shrink-0" />
                                            <p className="text-[11px] text-[#4A3675] font-bold uppercase tracking-tight">A verification link will be sent to your mobile. Open it while at this address.</p>
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
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={addAddress}
                    className="flex items-center justify-center bg-[#5D4591] text-white hover:bg-[#4a3675] transition-all duration-300 shadow-xl shadow-[#5D4591]/20 cursor-pointer
                        w-14 h-14 rounded-full
                        sm:w-auto sm:px-10 sm:py-5 sm:rounded-[2rem] sm:gap-3
                        active:scale-95"
                >
                    <Plus size={24} strokeWidth={3} />
                    <span className="hidden sm:inline text-xs font-black uppercase tracking-[0.2em]">
                        Add Another Address
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AddressDetails;
