import React, {useState, useEffect, useRef} from 'react';
import {
    Building2, Mail, Phone, MapPin, ShieldCheck,
    Plus, ArrowLeft, ExternalLink,
    FileText, Hash,
    Loader2,
} from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {DELETE_PACKAGE, GET_ORGANIZATION, SAVE_CHECK_PACKAGE} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import SecureImage from "../../component/secure-document-api/SecureImage.jsx";
import CreateOrganizationModal from "./CreatePackageModal.jsx";
import AssignedPackage from "./AssignedPackage.jsx";

const OrganizationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authenticatedRequest } = useAuthApi();
    const [searchParams] = useSearchParams();
    const initializationRef = useRef(false);

    // State
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChecks, setSelectedChecks] = useState([]);
    const [packageName, setPackageName] = useState("");
    const [checkTypes, setCheckTypes] = useState([]);
    const [organizationPackage, setOrganizationPackage] = useState([]);
    const [showButtonLoader, setShowButtonLoader] = useState(false);
    const [activeDeleteId, setActiveDeleteId] = useState(null);
    const [currentOpenedPackId, setCurrentOpenedPackId] = useState(null);

    const checkConfigInitialData = {
        IDENTITY: { mandatory: [] },
        ADDRESS: { history: 'latest', customHistory: '' },
        EDUCATION: { levels: [] },
        CRIMINAL: { duration: '5', customDuration: '' },
        EMPLOYMENT: { history: 'latest', customHistory: '' },
        DATABASE: { scope: 'past' },
        REFERENCE: { scope: 'past' }
    }

    const checkNameType = {
        ADDRESS: "Address Verification",
        EDUCATION: "Education Verification",
        REFERENCE: "Reference Check",
        IDENTITY: "Identity Verification",
        CRIMINAL: "Criminal Record Search",
        EMPLOYMENT: "Employment Verification",
        DATABASE: "Database Check"
    }

    const handleActionClick = (e, pkgId) => {
        e.stopPropagation();
        setActiveDeleteId(pkgId);
    };

    const [checkConfigs, setCheckConfigs] = useState(checkConfigInitialData);
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [showEditLoading, setShowEditLoading] = useState(false);

    const handleClickEdit = (p) => {
        setIsModalOpen(true);
        setPackageName("")
        setShowEditLoading(true);
        setTimeout(() => {
            setPackageName(p?.name);
            setSelectedChecks(p?.checks);
            setCheckConfigs(getCheckConfigForEdit(p?.checkConfigs));
            setCurrentOpenedPackId(p?.id);
            setShowEditLoading(false);
        }, 800);
    }

    const handleClickClone = (p) => {
        setIsModalOpen(true);
        setPackageName("")
        setShowEditLoading(true);
        setCurrentOpenedPackId(undefined);
        setTimeout(() => {
            setPackageName(p?.name);
            setSelectedChecks(p?.checks);
            setCheckConfigs(getCheckConfigForEdit(p?.checkConfigs));
            setShowEditLoading(false);
        }, 800);
    }

    const handleDeletePackage = async (packId) => {
        try {
            const response = await authenticatedRequest({}, `${DELETE_PACKAGE}/${packId}`, METHOD.DELETE);
            if(response.status === 200) {
                setOrganizationPackage(prevState => prevState.filter(p => p?.id !== packId));
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    const getCheckConfigForEdit = (checkConfig) => {
        const mergedConfig = { ...checkConfig };
        Object.entries(checkConfigInitialData).forEach(([key, defaultValue]) => {
            if (!mergedConfig[key]) {
                mergedConfig[key] = defaultValue;
            } else {
                mergedConfig[key] = { ...defaultValue, ...mergedConfig[key] };
            }
        });
        return mergedConfig;
    }

    const savePackage = async () => {
        setShowButtonLoader(true);
        try {
            const finalCheckConfig = {};
            selectedChecks.forEach(check => {
                finalCheckConfig[check] = checkConfigs[check];
            })
            const payloadRequest = {
                id: currentOpenedPackId,
                organizationId: org?.id,
                packageName: packageName,
                checkTypes: selectedChecks,
                checkConfigs: finalCheckConfig,
            }
            const response = await authenticatedRequest(payloadRequest, SAVE_CHECK_PACKAGE);
            if (response.status === 200) {
                if(currentOpenedPackId === response.data?.id) {
                    setOrganizationPackage(prevPackages =>
                        prevPackages.map(pkg => {
                            if (pkg.id === currentOpenedPackId) {
                                return {
                                    ...pkg,
                                    checkConfigs: response.data?.checkConfigs,
                                    checks: response.data?.checks,
                                    name: response.data?.name
                                };
                            }
                            return pkg;
                        })
                    );
                } else {
                    setOrganizationPackage(prevState => [...prevState, response.data]);
                }
                setIsModalOpen(false);
                setCheckConfigs(checkConfigInitialData);
                setSelectedChecks([]);
                setPackageName("")
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setShowButtonLoader(false);
        }
    }

    useEffect(() => {
        const fetchOrganization = async () => {
            setLoading(true);
            const orgId = searchParams.get('id') || id;
            if (!orgId) {
                setStatus('error');
                setErrorMessage('Organization ID not found.');
                return;
            }
            try {
                const response = await authenticatedRequest({}, `${GET_ORGANIZATION}/${orgId}`, METHOD.GET);
                if (response.status === 200) {
                    setOrg(response.data);
                    setOrganizationPackage(response.data?.packages);
                } else {
                    setStatus('error');
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.response?.data?.message || 'Failed to fetch details.');
            } finally {
                setLoading(false);
            }
        }
        if(!initializationRef.current) {
            initializationRef.current = true;
            fetchOrganization();
        }
    }, [id, searchParams]);

    const toggleCheck = (checkId) => {
        setSelectedChecks(prev =>
            prev.includes(checkId) ? prev.filter(i => i !== checkId) : [...prev, checkId]
        );
    };

    const updateConfig = (checkId, key, value) => {
        setCheckConfigs(prev => ({
            ...prev,
            [checkId]: { ...prev[checkId], [key]: value }
        }));
    };

    const toggleSubOption = (checkId, key, option) => {
        const current = checkConfigs[checkId][key];
        const updated = current.includes(option)
            ? current.filter(o => o !== option)
            : [...current, option];
        updateConfig(checkId, key, updated);
    };

    const handleCreateCustomPackage = () => {
        setIsModalOpen(true);
        setCurrentOpenedPackId(undefined);
        setCheckConfigs(checkConfigInitialData);
        setSelectedChecks([]);
        setPackageName("")
    }

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 animate-spin text-[#5D4591]" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* TOP NAVIGATION BAR */}
            <div className=" px-8 py-4 top-0 z-30 flex items-center justify-between">
                <button onClick={() => navigate("/organisation-dashboard")} className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-[#5D4591] transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wider">Back to Organizations</span>
                </button>
                <div className="flex gap-3">
                    <button onClick={() => navigate(`/organisation-dashboard/organisation-form/${org?.id}`)} className="px-5 py-2 cursor-pointer rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">Edit Organization</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: IDENTITY & INFO */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5D4591]/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>
                            <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-6 border-4 border-white shadow-xl overflow-hidden p-2">
                                {org?.logoUrl ? (
                                    <SecureImage fileUrl={org.logoUrl?.replace("/uploads/", "")} className="w-full h-full object-contain" alt="Company Logo" />
                                ) : (
                                    <Building2 className="w-10 h-10 text-slate-300" />
                                )}
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 leading-tight mb-2">{org?.name}</h1>
                            {org?.website && (
                                <a href={org.website} target="_blank" className="text-[#5D4591] font-bold text-sm flex items-center gap-1 hover:underline">
                                    {org.website?.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400"><Mail className="w-5 h-5" /></div>
                                    <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</p><p className="text-sm font-bold text-slate-700">{org?.contactEmail}</p></div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400"><Phone className="w-5 h-5" /></div>
                                    <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</p><p className="text-sm font-bold text-slate-700">{org?.contactPhone}</p></div>
                                </div>
                            </div>
                        </div>

                        {/* Legal & Address Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Legal Information</h3>
                            <div className="space-y-6">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Tax ID / GST</label><p className="font-bold text-slate-700 flex items-center gap-2"><Hash className="w-4 h-4 text-[#5D4591]" /> {org?.taxId || "-"}</p></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Registration No</label><p className="font-bold text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4 text-[#5D4591]" /> {org?.registrationNumber || "-"}</p></div>
                                <div className="pt-4 border-t border-slate-100">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Registered Address</label>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed mt-1 flex gap-2">
                                        <MapPin className="w-4 h-4 text-[#5D4591]" />
                                        {org?.legalAddress ? (<>{org.legalAddress?.street},<br/>{org.legalAddress?.city}, {org.legalAddress?.state}<br/>{org.legalAddress?.zip}</>) : ("-")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PACKAGES */}
                    <AssignedPackage
                        organizationPackage={organizationPackage}
                        activeDeleteId={activeDeleteId}
                        setActiveDeleteId={setActiveDeleteId}
                        handleActionClick={handleActionClick}
                        checkNameType={checkNameType}
                        handleClickEdit={handleClickEdit}
                        handleClickClone={handleClickClone}
                        handleDeletePackage={handleDeletePackage}
                        handleCreateCustomPackage={handleCreateCustomPackage}
                    />
                </div>
            </div>

            {/* CUSTOM PACKAGE MODAL */}
            {isModalOpen && (
                <CreateOrganizationModal
                    setIsModalOpen={setIsModalOpen}
                    selectedChecks={selectedChecks}
                    toggleCheck={toggleCheck}
                    checkConfigs={checkConfigs}
                    packageName={packageName}
                    toggleSubOption={toggleSubOption}
                    updateConfig={updateConfig}
                    setPackageName={setPackageName}
                    setCheckTypes={setCheckTypes}
                    checkTypes={checkTypes}
                    savePackage={savePackage}
                    showButtonLoader={showButtonLoader}
                    showEditLoading={showEditLoading}
                />
            )}
        </div>
    );
};

export default OrganizationDetail;
