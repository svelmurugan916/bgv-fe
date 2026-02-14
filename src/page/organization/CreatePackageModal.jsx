import {
    AlertCircle,
    Briefcase,
    Check,
    DatabaseIcon, FileText,
    GraduationCap, Loader2,
    MapPin,
    Plus,
    ShieldCheck,
    UserCheck,
    UserPlus,
    X
} from "lucide-react";
import CategoriesSkeleton from "./CategoriesSkeleton.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {GET_ALL_CHECK_TYPE} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import ShowError from "../../component/common/ShowError.jsx";

const CreateOrganizationModal = ({setIsModalOpen, selectedChecks,
                                     toggleCheck, checkConfigs, packageName,
                                     toggleSubOption, updateConfig, setPackageName,
                                     setCheckTypes, checkTypes, savePackage, showButtonLoader,
                                     showEditLoading}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const {authenticatedRequest} = useAuthApi()
    const initiationRef = useRef(false);
    const fetchCheckTypes = async () => {
        setLoading(true);
        setError(undefined);
        try {
            const response = await authenticatedRequest({}, GET_ALL_CHECK_TYPE, METHOD.GET);
            if(response.status === 200) {
                setCheckTypes(response.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Something went wrong, Please try again!.");
        } finally {
            setLoading(false);
        }
    }

    const handleNumericChange = (checkId, key, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        updateConfig(checkId, key, numericValue);
    };

    useEffect(() => {
        console.log('checkTypes -- ', checkTypes);
        if(checkTypes.length === 0 && !initiationRef.current) {
            initiationRef.current = true;
            fetchCheckTypes();
        }
    }, [])

    const getIcon = (checkCode) => {
        switch (checkCode) {
            case 'IDENTITY':
                return UserCheck;
            case 'CRIMINAL':
                return ShieldCheck;
            case 'EDUCATION':
                return GraduationCap;
            case 'EMPLOYMENT':
                return Briefcase;
            case 'DATABASE':
                return DatabaseIcon;
            case 'REFERENCE':
                return UserPlus;
            case 'ADDRESS':
                return MapPin;
            default:
                return FileText;
        }
    }
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div><h2 className="text-2xl font-black text-slate-800">Create Custom Package</h2><p className="text-sm text-slate-500 font-medium">Configure specific verification requirements.</p></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 cursor-pointer rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm"><X className="w-6 h-6" /></button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto space-y-10">

                    {/* --- ADD THE ERROR ALERT HERE --- */}
                    <ShowError error={error} />
                    {/* Step 1: Name */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 mb-3 ml-1 uppercase tracking-[0.2em]">1. Package Name</label>
                        <input type="text" placeholder="e.g. Senior Management Bundle" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-[#5D4591] focus:ring-4 focus:ring-[#5D4591]/5 outline-none transition-all text-lg font-bold text-slate-700" value={packageName} onChange={(e) => setPackageName(e.target.value)} />
                    </div>

                    {/* Step 2: Selection */}
                    <div>
                        {
                            loading || showEditLoading ? (
                                <CategoriesSkeleton />
                            ) : (
                                <>
                                    <label className="block text-xs font-black text-slate-400 mb-4 ml-1 uppercase tracking-[0.2em]">2. Select Categories</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {checkTypes.map((check) => {
                                            const isSelected = selectedChecks.includes(check.code);
                                            const Icon = getIcon(check.code);
                                            return (
                                                <div key={check.code} onClick={() => toggleCheck(check.code)} className={`relative group p-5 rounded-[2rem] border-2 transition-all cursor-pointer ${isSelected ? 'border-[#5D4591] bg-[#5D4591]/5 shadow-lg shadow-[#5D4591]/10' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-[#5D4591] text-white' : 'bg-slate-100 text-slate-400'}`}><Icon className="w-5 h-5" /></div>
                                                    <h4 className={`font-black text-sm mb-1 ${isSelected ? 'text-[#5D4591]' : 'text-slate-700'}`}>{check.name}</h4>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-tight">{check.description}</p>
                                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-[#5D4591] text-white scale-110' : 'bg-slate-100 text-slate-300'}`}>{isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )
                        }
                    </div>


                    {/* Step 3: Drill-down Configuration */}
                    {!(loading || showEditLoading) && selectedChecks.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <label className="block text-xs font-black text-slate-400 mb-4 ml-1 uppercase tracking-[0.2em]">3. Configure Details</label>
                            <div className="space-y-4">
                                {selectedChecks.map(checkId => {
                                    const checkInfo = checkTypes.find(c => c.code === checkId);
                                    const Icon = getIcon(checkInfo.code);
                                    return (
                                        <div key={checkId} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5D4591] shadow-sm"><Icon className="w-5 h-5" /></div>
                                                <span className="font-black text-slate-700 text-sm">{checkInfo.name}</span>
                                            </div>

                                            <div className="flex-1 flex flex-wrap items-center gap-3">
                                                {/* IDENTITY */}
                                                {checkId === "IDENTITY" && ['PAN', 'AADHAR', 'PASSPORT'].map(opt => (
                                                    <button key={opt} onClick={() => toggleSubOption('IDENTITY', 'mandatory', opt)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${checkConfigs.IDENTITY.mandatory.includes(opt) ? 'bg-[#5D4591] text-white border-[#5D4591]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>{opt}</button>
                                                ))}

                                                {/* EMPLOYMENT - Updated 'Others' to 'Past' */}
                                                {checkId === 'EMPLOYMENT' && (
                                                    <>
                                                        {[
                                                            { id: 'latest', label: 'Latest Only' },
                                                            { id: '2', label: '2 Years' },
                                                            { id: '5', label: '5 Years' },
                                                            { id: 'past', label: 'Past' }
                                                        ].map(opt => (
                                                            <button key={opt.id} onClick={() => updateConfig(checkId, 'history', opt.id)} className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all ${checkConfigs[checkId].history === opt.id ? 'bg-[#5D4591] text-white border-[#5D4591]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>{opt.label}</button>
                                                        ))}
                                                        {checkConfigs[checkId].history === 'past' && (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Years"
                                                                className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#5D4591] bg-white"
                                                                value={checkConfigs[checkId].customHistory || ''}
                                                                onChange={(e) => handleNumericChange(checkId, 'customHistory', e.target.value)}
                                                            />
                                                        )}
                                                    </>
                                                )}

                                                {/* ADDRESS - Updated to Current, Permanent, Past(Other) */}
                                                {checkId === 'ADDRESS' && (
                                                    <>
                                                        {[
                                                            { id: 'current', label: 'Current' },
                                                            { id: 'permanent', label: 'Permanent' },
                                                            { id: 'past', label: 'Past(Other)' }
                                                        ].map(opt => (
                                                            <button key={opt.id} onClick={() => updateConfig(checkId, 'history', opt.id)} className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all ${checkConfigs[checkId].history === opt.id ? 'bg-[#5D4591] text-white border-[#5D4591]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>{opt.label}</button>
                                                        ))}
                                                        {checkConfigs[checkId].history === 'past' && (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Years"
                                                                className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#5D4591] bg-white"
                                                                value={checkConfigs[checkId].customHistory || ''}
                                                                onChange={(e) => handleNumericChange(checkId, 'customHistory', e.target.value)}
                                                            />
                                                        )}
                                                    </>
                                                )}

                                                {/* CRIMINAL - Updated to Current, Permanent, Past(Other) */}
                                                {checkId === 'CRIMINAL' && (
                                                    <>
                                                        {[
                                                            { id: 'current', label: 'Current' },
                                                            { id: 'permanent', label: 'Permanent' },
                                                            { id: 'past', label: 'Past(Other)' }
                                                        ].map(opt => (
                                                            <button key={opt.id} onClick={() => updateConfig('CRIMINAL', 'duration', opt.id)} className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all ${checkConfigs.CRIMINAL.duration === opt.id ? 'bg-[#5D4591] text-white border-[#5D4591]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>{opt.label}</button>
                                                        ))}
                                                        {checkConfigs.CRIMINAL.duration === 'past' && (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Years"
                                                                className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#5D4591] bg-white"
                                                                value={checkConfigs.CRIMINAL.customDuration || ''}
                                                                onChange={(e) => handleNumericChange('CRIMINAL', 'customDuration', e.target.value)}
                                                            />
                                                        )}
                                                    </>
                                                )}

                                                {/* EDUCATION */}
                                                {checkId === 'EDUCATION' && [
                                                    {
                                                        label: "10th",
                                                        value: "SSLC"
                                                    },
                                                    {
                                                        label: "12th",
                                                        value: "HSC"
                                                    },
                                                    {
                                                        label: " Diploma",
                                                        value: "DIPLOMA"
                                                    },
                                                    {
                                                        label: "UG",
                                                        value: "UNDER_GRADUATE"
                                                    },
                                                    {
                                                        label: "PG",
                                                        value: "POST_GRADUATE"
                                                    }
                                                ].map(opt => (
                                                    <button key={opt.value} onClick={() => toggleSubOption('EDUCATION', 'levels', opt.value)} className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all ${checkConfigs.EDUCATION.levels.includes(opt.value) ? 'bg-[#5D4591] text-white border-[#5D4591]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>{opt.label}</button>
                                                ))}

                                                {/* DEFAULT FOR OTHERS */}
                                                {['REFERENCE', 'DATABASE'].includes(checkId) && (
                                                    <span className="text-xs font-bold text-slate-400 italic py-2">Standard verification protocols applied.</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-400"><span className="text-[#5D4591]">{selectedChecks.length}</span> categories configured</p>
                    <div className="flex gap-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 rounded-2xl font-bold text-slate-400 hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>

                        <button
                            onClick={savePackage}
                            disabled={!packageName || selectedChecks.length === 0 || showButtonLoader}
                            className={`px-10 py-3.5 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center min-w-[180px] ${
                                (selectedChecks.length > 0 && packageName && !showButtonLoader)
                                    ? 'bg-[#5D4591] shadow-[#5D4591]/20 hover:-translate-y-0.5 cursor-pointer'
                                    : 'bg-slate-300 cursor-not-allowed'
                            }`}
                        >
                            {showButtonLoader ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                "Save Package"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateOrganizationModal;
