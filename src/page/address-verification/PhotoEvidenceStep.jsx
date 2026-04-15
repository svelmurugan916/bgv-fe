import React from 'react';
import { useForm } from "../../provider/FormProvider.jsx";
import FormPageHeader from "../bgv-form/FormPageHeader.jsx";
import { AlertCircle, UserCircle, Home, User } from "lucide-react";
import LivePhotoCapture from "./LivePhotoCapture.jsx";

const PhotoEvidenceStep = () => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const avData = formData.addressVerification;
    const photos = avData?.photos;

    const handleCapture = (field, file) => {
        updateFormData('addressVerification', { ...avData, photos: { ...photos, [field]: file } });
        clearError(`av_${field}`);
    };

    const handleFieldChange = (field, value) => {
        updateFormData('addressVerification', { ...avData, [field]: value });
        clearError(`av_${field}`);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <FormPageHeader
                heading="Live Visual Evidence"
                helperText="Capture photos and provide residence details to complete this step."
            />

            <div className="space-y-6">
                <div id="av_frontDoor">
                    <LivePhotoCapture
                        title="Front Door (Live Capture) *"
                        error={errors.av_frontDoor}
                        capturedFile={photos?.frontDoor}
                        onCapture={(file) => handleCapture('frontDoor', file)}
                        onRemove={() => handleCapture('frontDoor', null)}
                    />
                </div>

                <div id="av_landmark">
                    <LivePhotoCapture
                        title="Landmark/Street (Live Capture) *"
                        error={errors.av_landmark}
                        capturedFile={photos?.landmark}
                        onCapture={(file) => handleCapture('landmark', file)}
                        onRemove={() => handleCapture('landmark', null)}
                    />
                </div>

                {/* --- RESIDENCE DETAILS SECTION --- */}
                <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#5D4591] rounded-lg text-white">
                            <Home size={18} />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Residence Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Respondent Name (Text Input) */}
                        <div id="av_respondentName">
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Respondent Name *</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name of respondent"
                                    value={avData.respondentName}
                                    onChange={(e) => handleFieldChange('respondentName', e.target.value)}
                                    className={`w-full p-3.5 pl-11 bg-white border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#5D4591]/20 transition-all ${errors.av_respondentName ? 'border-red-300' : 'border-slate-200'}`}
                                />
                            </div>
                        </div>

                        {/* House Ownership Dropdown */}
                        <div id="av_houseOwnership">
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">House Ownership *</label>
                            <select
                                value={avData.houseOwnership}
                                onChange={(e) => handleFieldChange('houseOwnership', e.target.value)}
                                className={`w-full p-3.5 bg-white border rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all ${errors.av_houseOwnership ? 'border-red-300' : 'border-slate-200'}`}
                            >
                                <option value="">Select Option</option>
                                <option value="Owned">Owned</option>
                                <option value="Rented">Rented</option>
                                <option value="Leased">Leased</option>
                                <option value="Renewed">Renewed</option>
                                <option value="PG">PG</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Company_Provided">Company Provided</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Relationship Dropdown */}
                        <div id="av_relationship" className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Relationship with Candidate *</label>
                            <select
                                value={avData.relationship}
                                onChange={(e) => handleFieldChange('relationship', e.target.value)}
                                className={`w-full p-3.5 bg-white border rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5D4591]/20 outline-none transition-all ${errors.av_relationship ? 'border-red-300' : 'border-slate-200'}`}
                            >
                                <option value="Self">Self (I am the candidate)</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Neighbor">Neighbor</option>
                                <option value="Landlord">Landlord</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoEvidenceStep;
