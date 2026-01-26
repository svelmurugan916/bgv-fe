import React, { useState } from 'react';
import { X, Save, Home, MapPin, Calendar, Phone, UserCheck, Loader2 } from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../../constant/ApplicationConstant.js";
// Replace with your actual update endpoint constant
const UPDATE_ADDRESS_ENDPOINT = "/api/v1/address/update";

const EditAddressModal = ({ isOpen, onClose, addressData, onUpdateSuccess }) => {
    const { authenticatedRequest } = useAuthApi();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        addressType: addressData.addressType || 'PERMANENT',
        addressLine1: addressData.addressLine1 || '',
        addressLine2: addressData.addressLine2 || '',
        city: addressData.city || '',
        state: addressData.state || '',
        country: addressData.country || 'India',
        pinCode: addressData.pinCode || '',
        stayingFrom: addressData.stayingFrom ? addressData.stayingFrom.split('T')[0] : '',
        stayingTo: addressData.stayingTo ? addressData.stayingTo.split('T')[0] : '',
        isCurrentAddress: addressData.isCurrentAddress || false,
        isSelfContact: addressData.isSelfContact ?? true,
        siteContactMobile: addressData?.addressCandidateSubmittedResponse?.siteContactMobile || ''
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            // Mapping back to your backend structure
            const payload = {
                ...formData,
                addressId: addressData.id
            };

            const response = await authenticatedRequest(payload, `${UPDATE_ADDRESS_ENDPOINT}/${addressData.id}`, METHOD.PUT);
            if (response.status === 200) {
                onUpdateSuccess();
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

            <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Edit Address Details</h3>
                        <p className="text-xs text-slate-500">Update the candidate's residence information.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"><X size={20} /></button>
                </div>

                {/* Form Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">

                        {/* Address Type */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Address Type</label>
                            <select
                                value={formData.addressType}
                                onChange={(e) => setFormData({...formData, addressType: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#5D4591]"
                            >
                                <option value="PERMANENT">Permanent Address</option>
                                <option value="CURRENT">Current Address</option>
                                <option value="OFFICE">Office Address</option>
                            </select>
                        </div>

                        {/* Pincode */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Pincode</label>
                            <input
                                type="text" value={formData.pinCode}
                                onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                            />
                        </div>

                        {/* Address Lines */}
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Address Line 1</label>
                            <input
                                type="text" value={formData.addressLine1}
                                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Address Line 2 (Optional)</label>
                            <input
                                type="text" value={formData.addressLine2}
                                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                            />
                        </div>

                        {/* City / State */}
                        <div className="col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">City</label>
                            <input
                                type="text" value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">State</label>
                            <input
                                type="text" value={formData.state}
                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                            />
                        </div>

                        {/* Dates */}
                        <div className="col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Staying From</label>
                            <input
                                type="date" value={formData.stayingFrom}
                                onChange={(e) => setFormData({...formData, stayingFrom: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Staying To</label>
                            <input
                                type="date" value={formData.stayingTo}
                                disabled={formData.isCurrentAddress}
                                onChange={(e) => setFormData({...formData, stayingTo: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="col-span-2 flex flex-wrap gap-6 py-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox" checked={formData.isCurrentAddress}
                                    onChange={(e) => setFormData({...formData, isCurrentAddress: e.target.checked, stayingTo: e.target.checked ? '' : formData.stayingTo})}
                                    className="w-4 h-4 rounded border-slate-300 text-[#5D4591] focus:ring-[#5D4591]"
                                />
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Currently Staying Here</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox" checked={formData.isSelfContact}
                                    onChange={(e) => setFormData({...formData, isSelfContact: e.target.checked})}
                                    className="w-4 h-4 rounded border-slate-300 text-[#5D4591] focus:ring-[#5D4591]"
                                />
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Self Verification</span>
                            </label>
                        </div>

                        {/* Contact Mobile */}
                        {!formData.isSelfContact && (
                            <div className="col-span-2 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Site Contact Mobile</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text" value={formData.siteContactMobile}
                                        onChange={(e) => setFormData({...formData, siteContactMobile: e.target.value})}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#5D4591]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#5D4591] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#4a3675] transition-all shadow-lg active:scale-95 disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Update Address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAddressModal;
