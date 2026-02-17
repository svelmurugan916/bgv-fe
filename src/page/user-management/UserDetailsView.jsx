import { ArrowLeft, Edit2, Lock, Mail, Phone, Shield, User, Save, X, Loader2, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { motion, AnimatePresence } from "framer-motion";
import AssignedRoles from "./AssignedRoles.jsx";
import { formatDate } from "../../utils/date-util.js";
import InfoField from "./InfoField.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {EMAIL_RESET_URL, MANUAL_RESET_PASSWORD, TOGGLE_USER_ACTIVE, UPDATE_USER} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import PasswordResetModal from "./PasswordResetModal.jsx";

const UserDetailsView = ({ user, activeTab, setActiveTab, availableRoles, onUpdateSuccess, isEditing, setIsEditing, handleBack }) => {
    const [formData, setFormData] = useState({ ...user });
    const [saving, setSaving] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [resetStep, setResetStep] = useState('choice'); // 'choice', 'manual', or 'email'
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    const { authenticatedRequest } = useAuthApi();

    // 1. Add a ref to track the previous User ID
    const prevUserIdRef = useRef(user?.id);

    useEffect(() => {
        setFormData({ ...user });

        // 2. Only clear messages if the User ID actually changed (switching selection)
        // If the ID is the same, it means we just updated the current user, so keep the message.
        if (prevUserIdRef.current !== user?.id) {
            setMessage({ type: '', text: '' });
            prevUserIdRef.current = user?.id;
        }

        setShowConfirm(false);
    }, [user]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await authenticatedRequest(formData, `${UPDATE_USER}/${user?.id}`, METHOD.PUT);
            if (response.status === 200) {
                onUpdateSuccess(user.id, formData.roleSet, formData);
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });

                // Auto-hide success message after 3 seconds
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: response.data?.message || 'Update failed.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleUserActive = async () => {
        try {
            setIsToggling(true);
            const response = await authenticatedRequest(undefined, `${TOGGLE_USER_ACTIVE}/${user?.id}`, METHOD.PATCH);
            if (response.status === 200) {
                const updatedUser = { ...user, enabled: !user.enabled };
                onUpdateSuccess(user.id, user.roleSet, updatedUser);
                setShowConfirm(false);
                setMessage({
                    type: 'success',
                    text: `User ${updatedUser.enabled ? 'activated' : 'deactivated'} successfully.`
                });

                // Auto-hide success message after 3 seconds
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: response.data?.message || 'Status update failed.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server error occurred.' });
        } finally {
            setIsToggling(false);
        }
    };

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let retVal = "";
        for (let i = 0; i < 10; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setNewPassword(retVal);
    };

    const handleManualReset = async () => {
        setIsResetting(true);
        try {
            const response = await authenticatedRequest({ newPassword: newPassword }, `${MANUAL_RESET_PASSWORD}/${user.id}`, METHOD.PUT);
            if(response.status === 200) {
                setMessage({ type: 'success', text: 'Password updated manually!' });
                setShowResetModal(false);
                setResetStep('choice');
                setNewPassword('');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Manual reset failed.' });
        } finally {
            setIsResetting(false);
        }
    };

    const handleEmailReset = async () => {
        setIsResetting(true);
        try {
            const response = await authenticatedRequest(undefined, `${EMAIL_RESET_URL}/${user.email}`, METHOD.POST);
            if(response.status === 200) {
                setMessage({ type: 'success', text: 'Reset link sent to user email!' });
                setShowResetModal(false);
                setResetStep('choice');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send reset email.' });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative">
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 max-w-sm w-full text-center"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${user?.enabled ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h3>
                            <p className="text-slate-500 text-sm mb-8">
                                You are about to <span className="font-bold">{user?.enabled ? 'deactivate' : 'activate'}</span> {user?.firstName}.
                                {user?.enabled ? ' They will no longer be able to log in.' : ' They will regain system access.'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleToggleUserActive}
                                    disabled={isToggling}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2
                                        ${user?.enabled ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'} shadow-lg`}
                                >
                                    {isToggling ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Actions */}
            <div className="p-8 flex justify-between items-start">
                <div className="flex gap-2">
                    <button onClick={handleBack} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><ArrowLeft size={20} /></button>
                    {!isEditing ? (
                        <button onClick={() => { setMessage({ type: '', text: '' }); setIsEditing(true); }} className="p-2 hover:bg-[#F9F7FF] hover:text-[#5D4591] rounded-xl text-slate-400 transition-colors">
                            <Edit2 size={20} />
                        </button>
                    ) : (
                        <button onClick={() => { setIsEditing(false); setFormData({...user}); setMessage({ type: '', text: '' }); }} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-xl text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    {isEditing ? (
                        <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2 bg-[#5D4591] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#5D4591]/20 hover:opacity-90 transition-all flex items-center gap-2">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowResetModal(true)}
                                className="px-4 py-2 bg-[#F9F7FF] text-[#5D4591] text-xs font-bold rounded-xl border border-[#EBE5FF] hover:bg-[#5D4591] hover:text-white transition-all"
                            >
                                Reset Password
                            </button>
                            <button
                                onClick={() => setShowConfirm(true)}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all
                                    ${user?.enabled
                                    ? 'bg-white text-rose-500 border-rose-100 hover:bg-rose-50'
                                    : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}
                            >
                                {user?.enabled ? 'Deactivate User' : 'Activate User'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Profile Hero */}
            <div className="px-12 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-[#F9F7FF] border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-[#5D4591]">
                        {formData.firstName[0]?.toUpperCase()}{formData.lastName[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">
                            {isEditing ? `${formData.firstName} ${formData.lastName}` : `${user.firstName} ${user.lastName}`}
                        </h1>
                        <p className="text-slate-400 font-medium flex items-center gap-2 mt-1">
                            <Shield size={14} className="text-[#5D4591]" /> {user.roleSet[0]?.name} Control Access
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-12 border-b border-slate-100 flex gap-8">
                {['Profile', 'Assigned Roles'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-[#5D4591]' : 'text-slate-400 hover:text-slate-600'}`}>
                        <span className="relative z-10">{tab}</span>
                        {activeTab === tab && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#5D4591] rounded-t-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                    </button>
                ))}
            </div>

            <div className="p-12 max-w-4xl">
                {activeTab === 'Profile' && (
                    <div className="space-y-10">
                        <AnimatePresence>
                            {message.text && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}
                                >
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <p className="text-xs font-bold">{message.text}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <section>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User size={16} className="text-[#5D4591]" /> Account Information
                            </h3>
                            <div className="grid grid-cols-2 gap-8">
                                <InfoField label="First name" name="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleInputChange} icon={<User size={14} />} />
                                <InfoField label="Last name" name="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleInputChange} icon={<User size={14} />} />
                                <InfoField label="Username" name="username" value={formData.username} isEditing={isEditing} onChange={handleInputChange} icon={<User size={14} />} copyable />
                                <InfoField label="Email Address" name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} icon={<Mail size={14} />} copyable />
                                <InfoField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} isEditing={isEditing} onChange={handleInputChange} icon={<Phone size={14} />} />
                                <InfoField label="Primary Role" value={user.roleSet[0]?.name} isEditing={false} icon={<Shield size={14} />} />
                            </div>
                        </section>

                        <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Lock size={16} className="text-[#5D4591]" /> System Metadata
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <MetaItem label="Created On" value={formatDate(user?.createdAt)} />
                                <MetaItem label="Created by" value={user?.createdBy || 'System'} />
                                <MetaItem label="Last Login" value={user.lastLogin || 'NA'} />
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'Assigned Roles' && (
                    <AssignedRoles roleSet={user.roleSet} availableRoles={availableRoles} userId={user?.id} onUpdateSuccess={onUpdateSuccess} />
                )}
            </div>
            <PasswordResetModal
                showResetModal={showResetModal}
                setShowResetModal={setShowResetModal}
                setResetStep={setResetStep}
                resetStep={resetStep}
                handleEmailReset={handleEmailReset}
                handleManualReset={handleManualReset}
                newPassword={newPassword}
                generatePassword={generatePassword}
                setNewPassword={setNewPassword}
                isResetting={isResetting}
                user={user}
            />
        </div>
    );
};

const MetaItem = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
);

export default UserDetailsView;
