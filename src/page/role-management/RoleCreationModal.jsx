import { AlignLeft, BarChart3, Loader2, Save, Shield, X, CheckCircle2, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const RoleCreationModal = ({ isSaving, setShowModal, handleCreateRole, setFormData, formData, isEditing, apiError }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleClose = () => {
        setIsMounted(false);
        setTimeout(() => {
            setShowModal(false);
        }, 400);
    };

    // Validation Logic
    const validateAndSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (!formData.roleName?.trim()) errors.roleName = "Role name is required";
        if (!formData.rank && formData.rank !== 0) errors.rank = "Rank is required";
        if (!formData.description?.trim()) errors.description = "Description is required";

        if (Object.keys(errors).length > 0) {
            setLocalErrors(errors);
            return;
        }

        setLocalErrors({});
        handleCreateRole(); // Call the parent submission logic
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
                    isMounted ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => !isSaving && handleClose()}
            />

            <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${
                isMounted ? "translate-x-0" : "translate-x-full"
            }`}>
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">{isEditing ? "Edit Role" : "Create New Role"}</h2>
                        <p className="text-xs text-slate-400 font-medium">Define system access and hierarchy</p>
                    </div>
                    <button type="button" onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* API ERROR DISPLAY */}
                    {apiError && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 animate-in zoom-in-95">
                            <AlertCircle className="text-rose-500 shrink-0" size={18} />
                            <p className="text-xs font-bold text-rose-700">{apiError}</p>
                        </div>
                    )}

                    <form id="role-form" onSubmit={validateAndSubmit} className="space-y-8">
                        {/* Role Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={12} className="text-[#5D4591]" /> Role Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Operations Manager"
                                value={formData.roleName}
                                onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                                className={`w-full bg-slate-50 border ${localErrors.roleName ? 'border-rose-300' : 'border-slate-100'} rounded-2xl p-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-[#5D4591] outline-none transition-all`}
                            />
                            {localErrors.roleName && <p className="text-[10px] font-bold text-rose-500 px-1">{localErrors.roleName}</p>}
                        </div>

                        {/* Role Rank */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={12} className="text-[#5D4591]" /> Role Rank
                            </label>
                            <input
                                type="number"
                                value={formData.rank}
                                onChange={(e) => setFormData({...formData, rank: e.target.value === '' ? '' : parseInt(e.target.value)})}
                                className={`w-full bg-slate-50 border ${localErrors.rank ? 'border-rose-300' : 'border-slate-100'} rounded-2xl p-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-[#5D4591] outline-none transition-all`}
                            />
                            {localErrors.rank && <p className="text-[10px] font-bold text-rose-500 px-1">{localErrors.rank}</p>}
                        </div>

                        {/* Role Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <AlignLeft size={12} className="text-[#5D4591]" /> Description
                            </label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className={`w-full bg-slate-50 border ${localErrors.description ? 'border-rose-300' : 'border-slate-100'} rounded-2xl p-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-[#5D4591] outline-none transition-all resize-none`}
                            />
                            {localErrors.description && <p className="text-[10px] font-bold text-rose-500 px-1">{localErrors.description}</p>}
                        </div>

                        {/* Status Toggle */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-[#5D4591]" /> Role Status
                            </label>
                            <div
                                onClick={() => setFormData({...formData, enabled: !formData.enabled})}
                                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-[#5D4591]/30 transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">Active Status</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Allow assignment to users</span>
                                </div>
                                <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${formData.enabled ? 'bg-[#5D4591]' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${formData.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={handleClose} className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
                        Cancel
                    </button>
                    <button
                        form="role-form"
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] flex items-center justify-center gap-2 bg-[#5D4591] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#5D4591]/20 hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : (isEditing ? 'Update Role' : 'Create Role')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleCreationModal;
