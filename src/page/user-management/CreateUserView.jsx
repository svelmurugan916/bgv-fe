import React, { useState } from 'react';
import { X, Save, User, Mail, Phone, Shield, Loader2, AlertCircle, Plus, CheckIcon, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { CREATE_USER } from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";

const CreateUserView = ({ availableRoles, onCancel, onCreateSuccess }) => {
    const { authenticatedRequest } = useAuthApi();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        roleIds: []
    });

    const validateForm = () => {
        let errors = {};

        // Regex Patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,15}$/; // Standard 10-15 digit validation

        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.username.trim()) errors.username = "Username is required";

        // Email Validation
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.password.trim()) errors.password = "Password is required";

        // Phone Validation
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required";
        } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
            errors.phoneNumber = "Invalid phone (10-15 digits)";
        }

        if (formData.roleIds.length === 0) errors.roles = "Assign at least one role";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // FIXED: Corrected the 'prev' reference error here
    const toggleRole = (roleId) => {
        setFormData(prev => {
            const isSelected = prev.roleIds.includes(roleId);
            const newRoles = isSelected
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId];

            // Clear error if selection is valid
            if (newRoles.length > 0) {
                setFieldErrors(errs => ({ ...errs, roles: null }));
            }

            return { ...prev, roleIds: newRoles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await authenticatedRequest(formData, CREATE_USER, METHOD.POST);
            if (response.status === 200 || response.status === 201) {
                onCreateSuccess(response.data);
            } else {
                setApiError(response.data?.message || 'Failed to create user.');
            }
        } catch (err) {
            setApiError('A server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-12 max-w-4xl"
        >
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Create New User</h1>
                    <p className="text-slate-400 font-medium">Fill in the details to provide system access</p>
                </div>
                <button onClick={onCancel} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                    <X size={24} />
                </button>
            </div>

            {apiError && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in zoom-in-95">
                    <AlertCircle size={18} /> {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                <section className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <FormInput
                        label="First Name" name="firstName" value={formData.firstName}
                        onChange={handleChange} icon={<User size={16}/>}
                        error={fieldErrors.firstName}
                    />
                    <FormInput
                        label="Last Name" name="lastName" value={formData.lastName}
                        onChange={handleChange} icon={<User size={16}/>}
                        error={fieldErrors.lastName}
                    />
                    <FormInput
                        label="Username" name="username" value={formData.username}
                        onChange={handleChange} icon={<User size={16}/>}
                        error={fieldErrors.username}
                    />
                    <FormInput
                        label="Email Address" name="email" type="email" value={formData.email}
                        onChange={handleChange} icon={<Mail size={16}/>}
                        error={fieldErrors.email}
                    />
                    <FormInput
                        label="Password" name="password" type="password" value={formData.password}
                        onChange={handleChange} icon={<Lock size={16}/>}
                        error={fieldErrors.password}
                    />
                    <FormInput
                        label="Phone Number" name="phoneNumber" value={formData.phoneNumber}
                        onChange={handleChange} icon={<Phone size={16}/>}
                        error={fieldErrors.phoneNumber}
                    />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Shield size={16} className="text-[#5D4591]" /> Assign Roles
                        </h3>
                        {fieldErrors.roles && (
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight flex items-center gap-1">
                                <AlertCircle size={12} /> {fieldErrors.roles}
                            </span>
                        )}
                    </div>

                    <div className={`flex flex-wrap gap-3 p-4 rounded-2xl transition-colors ${fieldErrors.roles ? 'bg-rose-50/50 ring-1 ring-rose-100' : ''}`}>
                        {availableRoles.map(role => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => toggleRole(role.id)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 font-bold text-[11px] uppercase tracking-wider transition-all
                                ${formData.roleIds.includes(role.id)
                                    ? 'border-[#5D4591] bg-[#F9F7FF] text-[#5D4591]'
                                    : 'border-slate-50 bg-white text-slate-400 hover:border-slate-200'
                                }`}
                            >
                                {formData.roleIds.includes(role.id) ? (
                                    <CheckIcon size={12} strokeWidth={3} />
                                ) : (
                                    <Plus size={12} strokeWidth={3} />
                                )}
                                {role.name?.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="pt-6 border-t border-slate-100 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#5D4591] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#5D4591]/10 hover:bg-[#4a3675] disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Create User Account
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 bg-white text-slate-500 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

/* Internal Helper for Inputs */
const FormInput = ({ label, icon, error, ...props }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            <AnimatePresence mode="wait">
                {error && (
                    <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="text-[10px] font-bold text-rose-500 uppercase"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
        <div className="relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-400' : 'text-slate-300'}`}>
                {icon}
            </div>
            <input
                {...props}
                className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition-all
                ${error
                    ? 'border-rose-200 bg-rose-50/30 focus:bg-white focus:border-rose-400 focus:ring-4 ring-rose-50'
                    : 'border-slate-100 focus:bg-white focus:border-[#5D4591] focus:ring-4 ring-[#5D4591]/5'}`}
            />
        </div>
    </div>
);

export default CreateUserView;
