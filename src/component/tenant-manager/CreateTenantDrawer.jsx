import React, { useState, useRef } from 'react';
import { X, Upload, Globe, Mail, ShieldCheck, CreditCard, Layers, Smartphone, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import { TENANT_MANAGER_DASHBOARD } from "../../constant/Endpoint.tsx";

const CreateTenantDrawer = ({ onClose, onSuccess }) => {
    const { authenticatedRequest } = useAuthApi();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' }); // 'success' | 'error'

    // Form State
    const [formData, setFormData] = useState({
        name: '', tenantCode: '', domain: '', billingEmail: '',subDomain: '',
        primaryContactName: '', primaryContactPhone: '',
        plan: 'TRIAL', billingCycle: 'MONTHLY', currency: 'INR',
        initialCreditAmount: 0, initialCreditReason: 'Welcome Credit',
        planDurationMonths: 1, maxOrganizationsAllowed: 1,
        // Advanced
        smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '',
        dltEntityId: '', dltTemplateId: ''
    });

    const [files, setFiles] = useState({ logo: null, favicon: null });
    const [previews, setPreviews] = useState({ logo: null, favicon: null });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
            setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Organization name is required";
        if (!formData.tenantCode) newErrors.tenantCode = "Tenant code is required";
        if (!formData.domain) newErrors.domain = "domain is required";
        if (!formData.billingEmail) newErrors.billingEmail = "Billing email is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();

        // 1. Append text fields
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        // 2. Append files (Ensure keys 'logo' and 'favicon' match DTO)
        if (files.logo) data.append('logo', files.logo);
        if (files.favicon) data.append('favicon', files.favicon);

        try {
            // IMPORTANT: Do NOT set 'Content-Type' header manually.
            // The browser will set it automatically with the boundary string.
            const response = await authenticatedRequest(data, TENANT_MANAGER_DASHBOARD, METHOD.POST);

            if (response.status === 201 || response.status === 200) {
                setStatus({ type: 'success', message: 'Tenant provisioned successfully!' });
                setTimeout(() => onSuccess(), 1500);
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Server Error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Provision New Tenant</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Setup organization, billing, and infrastructure</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {status.message && (
                        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
                            <span className="text-sm font-black uppercase tracking-tight">{status.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* SEGMENT 1: BASIC DETAILS */}
                        <div className="space-y-8">
                            <SectionHeader icon={<Layers size={16}/>} title="Basic Identity" />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Organization Name *" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="e.g. Acme Corp" />
                                <FormInput label="Tenant Code *" name="tenantCode" value={formData.tenantCode} onChange={handleInputChange} error={errors.tenantCode} placeholder="ACME01" />
                            </div>

                            <FormInput label="domain *" name="domain" value={formData.domain} onChange={handleInputChange} error={errors.domain} placeholder="acme" icon={<Globe size={14}/>} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="Billing Email *" name="billingEmail" type="email" value={formData.billingEmail} onChange={handleInputChange} error={errors.billingEmail} icon={<Mail size={14}/>} />
                                <FormInput label="Primary Contact" name="primaryContactName" value={formData.primaryContactName} onChange={handleInputChange} />
                            </div>

                            <SectionHeader icon={<CreditCard size={16}/>} title="Plan & Billing" />

                            <div className="grid grid-cols-2 gap-4">
                                <FormSelect label="Subscription Plan" name="plan" value={formData.plan} onChange={handleInputChange} options={['TRIAL', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']} />
                                <FormSelect label="Billing Cycle" name="billingCycle" value={formData.billingCycle} onChange={handleInputChange} options={['MONTHLY', 'QUARTERLY', 'YEARLY']} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormInput label="Initial Credits" name="initialCreditAmount" type="number" value={formData.initialCreditAmount} onChange={handleInputChange} />
                                <FormInput label="Duration (Months)" name="planDurationMonths" type="number" value={formData.planDurationMonths} onChange={handleInputChange} />
                                <FormInput label="Max Orgs" name="maxOrganizationsAllowed" type="number" value={formData.maxOrganizationsAllowed} onChange={handleInputChange} />
                            </div>

                            <div className="flex gap-6 pt-4">
                                <FileUpload label="Company Logo" preview={previews.logo} onChange={(e) => handleFileChange(e, 'logo')} />
                                <FileUpload label="Favicon" preview={previews.favicon} onChange={(e) => handleFileChange(e, 'favicon')} isSmall />
                            </div>
                        </div>

                        {/* SEGMENT 2: ADVANCED DETAILS */}
                        <div className="space-y-8">
                            <SectionHeader icon={<Globe size={16}/>} title="Communication Infrastructure (SMTP)" />
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                                <FormInput label="SMTP Host" name="smtpHost" value={formData.smtpHost} onChange={handleInputChange} placeholder="smtp.sendgrid.net" />
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1"><FormInput label="Port" name="smtpPort" value={formData.smtpPort} onChange={handleInputChange} placeholder="587" /></div>
                                    <div className="col-span-2"><FormInput label="SMTP User" name="smtpUser" value={formData.smtpUser} onChange={handleInputChange} /></div>
                                </div>
                                <FormInput label="SMTP Password" name="smtpPass" type="password" value={formData.smtpPass} onChange={handleInputChange} />
                            </div>

                            <SectionHeader icon={<Smartphone size={16}/>} title="Messaging & DLT Settings" />
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                                <FormInput label="DLT Entity ID" name="dltEntityId" value={formData.dltEntityId} onChange={handleInputChange} />
                                <FormInput label="Default Template ID" name="dltTemplateId" value={formData.dltTemplateId} onChange={handleInputChange} />
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">DLT settings are mandatory for sending SMS notifications in certain regions (e.g., India).</p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] py-4 bg-[#5D4591] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                        {isSubmitting ? 'Provisioning...' : 'Confirm & Provision Tenant'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-[#5D4591]/10 text-[#5D4591] rounded-lg">{icon}</div>
        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
);

const FormInput = ({ label, error, icon, ...props }) => (
    <div className="space-y-1.5 flex-1">
        <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tight">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
            <input
                {...props}
                className={`w-full p-3.5 ${icon ? 'pl-10' : 'px-4'} bg-white border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#5D4591]/10 transition-all ${error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'}`}
            />
        </div>
        {error && <p className="text-[9px] font-bold text-rose-500 ml-1 uppercase">{error}</p>}
    </div>
);

const FormSelect = ({ label, options, ...props }) => (
    <div className="space-y-1.5 flex-1">
        <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tight">{label}</label>
        <select {...props} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none hover:border-slate-300 focus:ring-2 focus:ring-[#5D4591]/10 transition-all">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const FileUpload = ({ label, preview, onChange, isSmall }) => (
    <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 tracking-tight">{label}</label>
        <div className={`relative border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden hover:border-[#5D4591]/30 transition-all group ${isSmall ? 'w-20 h-20' : 'w-32 h-20'}`}>
            {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
            ) : (
                <Upload size={20} className="text-slate-300 group-hover:text-[#5D4591]" />
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} accept="image/*" />
        </div>
    </div>
);

export default CreateTenantDrawer;
