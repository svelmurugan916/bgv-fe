import React, {useEffect, useRef, useState} from 'react';
import {
    Building2, Mail, Phone, Globe, MapPin,
    ChevronDown, ChevronUp, Camera, Info, ShieldCheck, ArrowLeftIcon, Loader2
} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
import {EMAIL_REGEX, METHOD, PHONE_NUMBER_REGEX} from "../../constant/ApplicationConstant.js";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {CREATE_ORGANIZATION, GET_ORGANIZATION, SAVE_ORGANIZATION} from "../../constant/Endpoint.tsx";
import SecureImage from "../../component/secure-document-api/SecureImage.jsx";
import ShowError from "../../component/common/ShowError.jsx";

const CreateOrganization = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAdditional, setShowAdditional] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // New loading state
    const { authenticatedRequest } = useAuthApi();
    const[loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const initiationRef = useRef(false);
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        logo: null,
        legalName: '',
        website: '',
        taxId: '',
        registrationNumber: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
    });

    useEffect(() => {
        const getOrganizationDetails = async (orgId) => {
            setLoading(true);
            try {
                const response = await authenticatedRequest({}, `${GET_ORGANIZATION}/${orgId}`, METHOD.GET);
                if (response.status === 200) {
                    setFormData({
                        name: response.data.name,
                        legalName: response.data.legalName || "",
                        email: response.data.contactEmail,
                        phone: response.data.contactPhone,
                        logo: response.data.logoUrl,
                        website: response.data.website || "",
                        taxId: response.data.taxId || "",
                        registrationNumber: response.data.registrationNumber || "",
                        street: response.data.legalAddress?.street || "",
                        city: response.data.legalAddress?.city || "",
                        state: response.data.legalAddress?.state || "",
                        country: response.data.legalAddress?.country || "",
                        zipCode: response.data.legalAddress?.zip || "",
                    })
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || 'Failed to fetch details.');
            } finally {
                setLoading(false);
            }
        }
        console.log(id)
        if(id) {
            if(!initiationRef.current) {
                initiationRef.current = true;
                getOrganizationDetails(id);
            }
        }
    }, [])

    // Error State
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, logo: file }));
            setErrors(prev => ({ ...prev, logo: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.logo) newErrors.logo = "Brand logo is required";
        if (!formData.name.trim()) newErrors.name = "Organization name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Contact email is required";
        } else if (!EMAIL_REGEX.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Contact number is required";
        } else if (!PHONE_NUMBER_REGEX.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Create FormData object for Multipart upload
        const dataToSend = new FormData();
        dataToSend.append('organizationName', formData.name);
        dataToSend.append('organizationEmail', formData.email);
        dataToSend.append('organizationContactNumber', formData.phone);
        if (formData.logo instanceof File) {
            dataToSend.append('logo', formData.logo);
        }
        dataToSend.append('legalName', formData.legalName || "");
        dataToSend.append('website', formData.website || "");
        dataToSend.append('taxId', formData.taxId || "");
        dataToSend.append('registrationNumber', formData.registrationNumber || "");
        dataToSend.append('street', formData.street || "");
        dataToSend.append('city', formData.city || "");
        dataToSend.append('state', formData.state || "");
        dataToSend.append('country', formData.country || "");
        dataToSend.append('zipCode', formData.zipCode || "");

        try {
            let response;
            if(id) {
                response = await authenticatedRequest(dataToSend,  `${SAVE_ORGANIZATION}/${id}`, METHOD.PUT);
            } else {
                response = await authenticatedRequest(dataToSend,  CREATE_ORGANIZATION);
            }
            if (response.status === 200) {
                if(id) {
                    navigate(`/organisation-dashboard/organisation-details/${id}`, {replace: true});
                } else {
                    const {data} = response;
                    navigate(`/organisation-dashboard/organisation-details/${data?.id}`, {replace: true});
                }
            } else {
                const errorData = await response;
                setErrors({ server: errorData.message || "Failed to save organization" });
            }
        } catch (error) {
            console.error("API Error:", error);
            setErrors({ server: "Network error. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        if(id) {
            navigate(`/organisation-dashboard/organisation-details/${id}`, {replace: true});
        } else {
            navigate(window.history.back())
        }
    }

    const inputStyle = (error) => `w-full px-4 py-3 rounded-xl border ${error ? 'border-red-400 focus:ring-red-500/5' : 'border-slate-200 focus:border-[#5D4591] focus:ring-[#5D4591]/5'} outline-none transition-all text-slate-700 placeholder:text-slate-400 bg-white shadow-sm`;
    const labelStyle = "block text-sm font-bold text-slate-600 mb-1.5 ml-1";
    const errorTextStyle = "text-[10px] font-bold text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1";

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 animate-spin text-[#5D4591]" />
        </div>
    );

    return (
        <>
            <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col lg:flex-row min-h-[600px]">

                {/* LEFT PANEL */}
                <div className="lg:w-1/3 bg-[#5D4591] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute cursor-pointer top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-all group z-20"
                    >
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
                    </button>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-black tracking-tight mb-4">Create<br/>Organization</h2>
                        <p className="text-[#D1C4E9] text-base leading-relaxed">
                            Add a new client to your verification ecosystem. Ensure all mandatory contact details are accurate.
                        </p>
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                <ShieldCheck className="w-6 h-6 text-[#A588E5]" />
                                <p className="text-sm font-medium">Enterprise Grade Security</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center lg:items-start">
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-[2rem] bg-white/10 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover:border-white/60 ${errors.logo ? 'border-red-400 bg-red-500/10' : 'border-white/30'}`}>
                                {
                                    logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="object-cover" />
                                        )
                                    :formData?.logo ? (
                                        <SecureImage fileUrl={formData?.logo} />
                                    ): (
                                    <Building2 className={`w-10 h-10 ${errors.logo ? 'text-red-300' : 'text-white/40'}`} />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 bg-white text-[#5D4591] p-2.5 rounded-2xl cursor-pointer shadow-xl hover:scale-110 transition-transform">
                                <Camera className="w-5 h-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                            </label>
                        </div>
                        <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${errors.logo ? 'text-red-300' : 'text-[#D1C4E9]'}`}>
                            {errors.logo || 'Company Brand Logo'}
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="lg:w-2/3 p-8 lg:p-12 bg-slate-50/30">
                    <ShowError error={error} />
                    <div className="flex items-center gap-2 mb-8 text-slate-400">
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Mandatory Information</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                            <label className={labelStyle}>Organization Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Legal Entity Name"
                                className={inputStyle(errors.name)}
                            />
                            {errors.name && <p className={errorTextStyle}>{errors.name}</p>}
                        </div>

                        <div>
                            <label className={labelStyle}>Contact Email *</label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${errors.email ? 'text-red-300' : 'text-slate-300'}`} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="hr@company.com"
                                    className={`${inputStyle(errors.email)} pl-12`}
                                />
                            </div>
                            {errors.email && <p className={errorTextStyle}>{errors.email}</p>}
                        </div>

                        <div>
                            <label className={labelStyle}>Contact Number *</label>
                            <div className="relative">
                                <Phone className={`absolute left-4 top-3.5 w-5 h-5 ${errors.phone ? 'text-red-300' : 'text-slate-300'}`} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91 98765 43210"
                                    className={`${inputStyle(errors.phone)} pl-12`}
                                />
                            </div>
                            {errors.phone && <p className={errorTextStyle}>{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Additional Details Accordion */}
                    <div className="mt-10">
                        <button
                            type="button"
                            onClick={() => setShowAdditional(!showAdditional)}
                            className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border ${
                                showAdditional ? 'bg-white border-[#5D4591]/20 shadow-md' : 'bg-slate-100/50 border-transparent hover:bg-slate-100'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${showAdditional ? 'bg-[#5D4591] text-white' : 'bg-white text-slate-400'}`}>
                                    <Globe className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-700">Additional & Legal Details</span>
                            </div>
                            {showAdditional ? <ChevronUp className="w-5 h-5 text-[#5D4591]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>

                        {/* Additional Details Accordion */}
                        {showAdditional && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in slide-in-from-top-4 duration-300">
                                <div>
                                    <label className={labelStyle}>Legal Registered Name</label>
                                    <input
                                        type="text"
                                        name="legalName"
                                        value={formData.legalName || ""}
                                        onChange={handleInputChange} // ADD THIS
                                        className={inputStyle()}
                                    />
                                </div>
                                <div>
                                    <label className={labelStyle}>Website URL</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website || ""} // ADD THIS
                                        onChange={handleInputChange} // ADD THIS
                                        placeholder="www.company.com"
                                        className={inputStyle()}
                                    />
                                </div>
                                <div>
                                    <label className={labelStyle}>Registration Number</label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber || ""} // ADD THIS
                                        onChange={handleInputChange} // ADD THIS
                                        className={inputStyle()}
                                    />
                                </div>
                                <div>
                                    <label className={labelStyle}>Tax ID / GSTIN</label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId || ""} // ADD THIS
                                        onChange={handleInputChange} // ADD THIS
                                        className={inputStyle()}
                                    />
                                </div>

                                <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 mb-6">
                                        <MapPin className="w-4 h-4 text-[#5D4591]" />
                                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Registered Office Address</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street || ""}
                                            onChange={handleInputChange}
                                            placeholder="Address Line 1"
                                            className={`${inputStyle()} md:col-span-2`}
                                        />
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city || ""}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            className={inputStyle()}
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state || ""}
                                            onChange={handleInputChange}
                                            placeholder="State"
                                            className={inputStyle()}
                                        />
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country || ""}
                                            onChange={handleInputChange}
                                            placeholder="Country"
                                            className={inputStyle()}
                                        />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode || ""}
                                            onChange={handleInputChange}
                                            placeholder="Pin Code"
                                            className={inputStyle()}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.server && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
                            {errors.server}
                        </div>
                    )}
                    {/* Footer Buttons */}
                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancelClick}
                            className="cursor-pointer px-8 py-3.5 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-10 py-3.5 rounded-xl font-bold text-white bg-[#5D4591] shadow-xl shadow-[#5D4591]/20 flex items-center gap-2 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4A3675] hover:-translate-y-0.5 active:scale-95'}`}
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? 'Saving...' : 'Save Organization'}
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CreateOrganization;
