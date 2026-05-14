import React, { useEffect, useRef, useState } from 'react';
import {
    Search, Plus, Trash2, GraduationCap,
    X, MapPin, AlertTriangle, Loader2, Check
} from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { BLOCK_LIST_COLLEGES_API } from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import SingleSelectDropdown from "../../component/dropdown/SingleSelectDropdown.jsx";

const BlocklistCollegePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Skeleton State
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Deletion States
    const [activeDeleteId, setActiveDeleteId] = useState(null);
    const [showLoader, setShowLoader] = useState(null);

    const { authenticatedRequest } = useAuthApi();
    const compInitRef = useRef(false);

    const [formData, setFormData] = useState({
        collegeName: '',
        city: '',
        state: '',
        blockListCategory: '',
    });
    const [errors, setErrors] = useState({});
    const [colleges, setColleges] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const onSelectCategory = (val) => {
        setFormData(prev => ({ ...prev, blockListCategory: val }));
        if (errors.blockListCategory) setErrors(prev => ({ ...prev, blockListCategory: null }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.collegeName) newErrors.collegeName = "Required";
        if (!formData.city) newErrors.city = "Required";
        if (!formData.state) newErrors.state = "Required";
        if (!formData.blockListCategory) newErrors.blockListCategory = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchBlockListColleges = async () => {
        setIsLoading(true);
        try {
            const response = await authenticatedRequest(undefined, BLOCK_LIST_COLLEGES_API, METHOD.GET);
            if (response.status === 200) {
                setColleges(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch colleges", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!compInitRef.current) {
            compInitRef.current = true;
            fetchBlockListColleges();
        }
    }, []);

    const handleAddClick = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await authenticatedRequest(formData, BLOCK_LIST_COLLEGES_API, METHOD.POST);
            if (response.status === 200 || response.status === 201) {
                setColleges(prev => [response.data, ...prev]);
                setIsModalOpen(false);
                setFormData({ collegeName: '', city: '', state: '', blockListCategory: '' });
            }
        } catch (err) {
            console.error("Creation failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleActionClick = (e, id) => {
        e.stopPropagation();
        setActiveDeleteId(id);
    };

    const handleDelete = async (id) => {
        setShowLoader(id);
        try {
            const response = await authenticatedRequest(undefined, `${BLOCK_LIST_COLLEGES_API}/${id}`, METHOD.DELETE);
            if (response.status === 200 || response.status === 204) {
                setColleges(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setShowLoader(null);
            setActiveDeleteId(null);
        }
    };

    const blockListCategoryOptions = [
        { text: "Diploma Mill", value: "DIPLOMA_MILL" },
        { text: "Forgery / Fraud", value: "FORGERY" },
        { text: "Unrecognized", value: "UNRECOGNIZED" },
        { text: "Accreditation Revoked", value: "ACCREDITATION_REVOKED" },
        { text: "Closed", value: "CLOSED" },
        { text: "Sanctioned", value: "SANCTIONED" },
        { text: "Predatory", value: "PREDATORY" },
        { text: "Ineligible Program", value: "INELIGIBLE_PROGRAM" },
        { text: "Misrepresentation", value: "MISREPRESENTATION" },
        { text: "Other", value: "OTHER" },
    ];

    const filteredColleges = colleges.filter(c =>
        c.collegeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-50 rounded w-1/2" />
                    <div className="h-6 bg-slate-50 rounded-lg w-20 mt-2" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Blocklisted Colleges</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and monitor flagged institutions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#5D4591] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#4a3675] transition-all"
                >
                    <Plus size={16} /> Add College
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                    type="text"
                    placeholder="Search blocklist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#5D4591] text-sm"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                ) : filteredColleges.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-medium">No colleges found matching your search.</div>
                ) : (
                    filteredColleges.map((college) => {
                        const isConfirmingDelete = activeDeleteId === college.id;
                        return (
                            <div key={college.id} className="group bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden">

                                {/* DELETING LOADER OVERLAY */}
                                {showLoader === college.id && (
                                    <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-xl bg-[#5D4591]/10 flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 text-[#5D4591] animate-spin" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-[#5D4591] animate-pulse">
                                                Deleting...
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591] transition-colors">
                                        <GraduationCap size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold text-slate-800 truncate pr-2">{college.collegeName}</h3>

                                            {/* ACTION BUTTONS CONTAINER */}
                                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                                                {!isConfirmingDelete ? (
                                                    <button
                                                        onClick={(e) => handleActionClick(e, college.id)}
                                                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-1 animate-in fade-in zoom-in duration-200">
                                                        <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter">Sure?</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(college.id); }}
                                                                className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setActiveDeleteId(null); }}
                                                                className="p-1 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                                            <MapPin size={10} /> {college.city}, {college.state}
                                        </div>
                                        <div className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-rose-50/50 border border-rose-100/50 rounded-lg w-fit">
                                            <AlertTriangle size={10} className="text-rose-500" />
                                            <span className="text-[9px] font-black text-rose-600 uppercase">{college.blockListCategory?.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Add to Blocklist</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400"><X size={18} /></button>
                        </div>

                        <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">College Name</label>
                                <input name="collegeName" value={formData.collegeName} onChange={handleInputChange} className={`w-full px-4 py-3 bg-slate-50/50 border ${errors.collegeName ? 'border-rose-500' : 'border-slate-100'} rounded-xl outline-none focus:border-[#5D4591] text-sm`} placeholder="Institution name" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-4 py-3 bg-slate-50/50 border ${errors.city ? 'border-rose-500' : 'border-slate-100'} rounded-xl outline-none focus:border-[#5D4591] text-sm`} placeholder="City" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">State</label>
                                    <input name="state" value={formData.state} onChange={handleInputChange} className={`w-full px-4 py-3 bg-slate-50/50 border ${errors.state ? 'border-rose-500' : 'border-slate-100'} rounded-xl outline-none focus:border-[#5D4591] text-sm`} placeholder="State" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Blocklist Category</label>
                                <SingleSelectDropdown
                                    label="Select Category"
                                    options={blockListCategoryOptions}
                                    selected={formData.blockListCategory}
                                    onSelect={onSelectCategory}
                                    isOccupyFullWidth={true}
                                    error={errors.blockListCategory}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleAddClick}
                                disabled={isSubmitting}
                                className="w-full bg-[#5D4591] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#4a3675] transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Add"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlocklistCollegePage;
