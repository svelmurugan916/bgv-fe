import React, {useState, useEffect, useMemo} from 'react';
import {
    Plus, Trash2, User, Mail, Phone,
    AlertCircle, Info, CheckCircle2, ArrowLeft, Send,
    Loader2, Building2, Package, FileUp, ArrowLeftIcon
} from 'lucide-react';
import { EMAIL_REGEX, PHONE_NUMBER_REGEX, METHOD } from "../../constant/ApplicationConstant.js";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { GET_ALL_ORGANIZATIONS, GET_PACKAGES_BY_ORG, INITIATE_BULK_VERIFICATION } from "../../constant/Endpoint.tsx";
import SingleSelectDropdown from "../dropdown/SingleSelectDropdown.jsx";
import ShowError from "../common/ShowError.jsx";
import SingleDropdownSearch from "../dropdown/SingleDropdownSearch.jsx";

const BulkCreateCandidates = () => {
    const { authenticatedRequest } = useAuthApi();

    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // Success state
    const [isPackageLoading, setIsPackageLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({
        org: false,
        package: false,
        rows: {}
    });
    const initialRows = [
        { id: Date.now(), firstName: '', lastName: '', email: '', phone: '' },
        { id: Date.now() + 1, firstName: '', lastName: '', email: '', phone: '' },
        { id: Date.now() + 2, firstName: '', lastName: '', email: '', phone: '' },
    ]

    const [rows, setRows] = useState(initialRows);



    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const response = await authenticatedRequest({}, GET_ALL_ORGANIZATIONS, METHOD.GET);
                if (response.status === 200) {
                    const orgDataJson = response.data?.map(org => ({
                        key: org.id,
                        value: org.name,
                    }));
                    setOrganizations(orgDataJson);
                }
            } catch (err) { console.error("Failed to fetch orgs", err); }
        };
        fetchOrgs();
    }, []);

    useEffect(() => {
        if (!selectedOrg) {
            setPackages([]);
            setSelectedPackage(null);
            return;
        }
        const fetchPackages = async () => {
            setIsPackageLoading(true);
            try {
                const response = await authenticatedRequest({}, `${GET_PACKAGES_BY_ORG}/${selectedOrg.key}`, METHOD.GET);
                if (response.status === 200) {
                    const packageDataJson = response.data?.map(org => ({
                        key: org.id,
                        value: org.name,
                    }));
                    setPackages(packageDataJson);
                }
            } catch (err) {
                console.error("Failed to fetch packages", err);
            } finally {
                setIsPackageLoading(false);
            }
        };
        fetchPackages();
    }, [selectedOrg]);

    const handleInputChange = (id, field, value) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
        if (fieldErrors.rows[id]?.[field]) {
            setFieldErrors(prev => ({
                ...prev,
                rows: {
                    ...prev.rows,
                    [id]: { ...prev.rows[id], [field]: false }
                }
            }));
        }
    };

    const addRows = (count) => {
        const newRows = Array.from({ length: count }).map(() => ({
            id: Date.now() + Math.random(), firstName: '', lastName: '', email: '', phone: ''
        }));
        setRows([...rows, ...newRows]);
    };

    const isRowValid = (row) => {
        return row.firstName && row.lastName && row.email && EMAIL_REGEX.test(row.email) && row.phone && PHONE_NUMBER_REGEX.test(row.phone);
    };

    const handleInitiate = async () => {
        setError(null);
        setSuccess(null);
        let newFieldErrors = { org: false, package: false, rows: {} };
        let hasError = false;

        if (!selectedOrg) { newFieldErrors.org = true; hasError = true; }
        if (!selectedPackage) { newFieldErrors.package = true; hasError = true; }

        const activeRows = rows.filter(row =>
            row.firstName.trim() !== "" || row.lastName.trim() !== "" ||
            row.email.trim() !== "" || row.phone.trim() !== ""
        );

        if (activeRows.length === 0) {
            setError("Enter at least one candidate details");
            return;
        }

        activeRows.forEach(row => {
            let rowErrors = {};
            if (!row.firstName.trim()) rowErrors.firstName = true;
            if (!row.lastName.trim()) rowErrors.lastName = true;
            if (!row.email.trim() || !EMAIL_REGEX.test(row.email)) rowErrors.email = true;
            if (!row.phone.trim() || !PHONE_NUMBER_REGEX.test(row.phone)) rowErrors.phone = true;

            if (Object.keys(rowErrors).length > 0) {
                newFieldErrors.rows[row.id] = rowErrors;
                hasError = true;
            }
        });

        if (hasError) {
            setFieldErrors(newFieldErrors);
            setError("Please fix the highlighted errors before proceeding.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                organizationId: selectedOrg.key,
                packageId: selectedPackage.key,
                candidateDetails: activeRows
            };
            const response = await authenticatedRequest(payload, INITIATE_BULK_VERIFICATION, METHOD.POST);

            if (response.status === 200) {
                setSuccess("Success! Verification invites have been sent to all candidates.");
                setRows(initialRows); // Reset form
                setFieldErrors({ org: false, package: false, rows: {} });
            } else if (response.status === 400 && response.data?.errors) {
                setError("Verification failed for some candidates. Highlighted fields may already exist.");
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                const errorData = err.response.data; // This is your { totalInvited, errors: [], ... } object

                if (errorData?.errors) {
                    setError(errorData.errors); // Set the array of error messages to show in the banner

                    let backendFieldErrors = {};

                    // Map the error messages to the specific input fields in the table
                    errorData.errors.forEach(errStr => {
                        activeRows.forEach(row => {
                            // If the error message mentions the row's email, highlight it
                            if (errStr.includes(row.email)) {
                                backendFieldErrors[row.id] = {
                                    ...backendFieldErrors[row.id],
                                    email: true
                                };
                            }
                        });
                    });
                    setFieldErrors(prev => ({ ...prev, rows: backendFieldErrors }));
                }
            } else {
                // Handle other errors (500, 404, etc.)
                setError(["An unexpected error occurred. Please try again later."]);
            }
            console.error("Initiate failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputClass = (rowId, field) => {
        const hasError = fieldErrors.rows[rowId]?.[field];
        return `w-full px-4 py-2.5 bg-slate-50 border ${hasError ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-transparent focus:border-[#5D4591]/30'} rounded-xl text-xs font-bold focus:bg-white outline-none transition-all`;
    };

    return (
        <div className="max-w-[1440px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-4">

            {/* HEADER */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => window.history.back()}
                    className="cursor-pointer group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#5D4591] hover:border-[#5D4591]/30 hover:bg-[#F9F7FF] transition-all shadow-sm shrink-0"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                </button>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Bulk Candidate Onboarding</h1>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="space-y-4">
                {/* Success/Error Banners */}
                {error && <ShowError error={error} />}
                {success && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in duration-300">
                        <div className="p-2 bg-emerald-500 rounded-lg text-white">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-sm font-bold text-emerald-700">{success}</p>
                    </div>
                )}

                {/* CONTROLS CLUSTER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#5D4591]/10 rounded-2xl flex items-center justify-center text-[#5D4591]">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Candidate Entries</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Enter details manually or use the bulk upload tool.</p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                <span className="text-[10px] font-black text-[#5D4591] uppercase tracking-wider">Total: {rows.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#F9F7FF] border-2 border-dashed border-[#5D4591]/30 rounded-xl text-[#5D4591] font-bold text-xs hover:border-[#5D4591] hover:bg-[#F0EDFF] transition-all cursor-pointer group">
                            <FileUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                            Upload Excel Template (.xlsx)
                        </button>

                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                            <div className={`flex items-center gap-4 bg-slate-50 p-1.5 pl-4 rounded-xl border ${fieldErrors.org ? 'border-red-400' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Building2 size={16} className="text-[#5D4591]" />
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.12em]">Org</label>
                                </div>
                                <div className="w-64"><SingleDropdownSearch label="Choose Organization" options={organizations} selectedKey={selectedOrg?.key} onSelect={(orgObj) => { setSelectedOrg(organizations.find(o => o.key === orgObj.key)); setFieldErrors(prev => ({ ...prev, org: false })); }} /></div>
                            </div>

                            <div className={`flex items-center gap-4 bg-slate-50 p-1.5 pl-4 rounded-xl border ${fieldErrors.package ? 'border-red-400' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Package size={16} className="text-[#5D4591]" />
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.12em]">Pkg</label>
                                    {isPackageLoading && <Loader2 size={14} className="animate-spin text-[#5D4591] ml-1" />}
                                </div>
                                <div className="w-64"><SingleDropdownSearch label={isPackageLoading ? "Loading..." : "Choose Package"} options={packages} selectedKey={selectedPackage?.key} onSelect={(pkgObj) => { setSelectedPackage(packages.find(o => o.key === pkgObj.key)); setFieldErrors(prev => ({ ...prev, package: false })); }} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">Status</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</th>
                                <th className="pr-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {rows.map((row, index) => (
                                <tr key={row.id} className="hover:bg-[#F9F7FF]/30 transition-colors group">
                                    <td className="pl-8 py-4">
                                        {isRowValid(row) ? (
                                            <CheckCircle2 size={18} className="text-emerald-500 animate-in zoom-in" />
                                        ) : (
                                            <span className="text-[11px] font-black text-slate-300">{(index + 1).toString().padStart(2, '0')}</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-4"><input type="text" placeholder="First Name" value={row.firstName} onChange={(e) => handleInputChange(row.id, 'firstName', e.target.value)} className={getInputClass(row.id, 'firstName')} /></td>
                                    <td className="px-2 py-4"><input type="text" placeholder="Last Name" value={row.lastName} onChange={(e) => handleInputChange(row.id, 'lastName', e.target.value)} className={getInputClass(row.id, 'lastName')} /></td>
                                    <td className="px-2 py-4"><input type="email" placeholder="email@company.com" value={row.email} onChange={(e) => handleInputChange(row.id, 'email', e.target.value)} className={getInputClass(row.id, 'email')} /></td>
                                    <td className="px-2 py-4"><input type="tel" placeholder="+91..." value={row.phone} onChange={(e) => handleInputChange(row.id, 'phone', e.target.value)} className={getInputClass(row.id, 'phone')} /></td>
                                    <td className="pr-8 py-4 text-right">
                                        <button onClick={() => setRows(rows.filter(r => r.id !== row.id))} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => addRows(1)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-[#5D4591] hover:border-[#5D4591] transition-all cursor-pointer"><Plus size={14} /> Add 1 Row</button>
                            <button onClick={() => addRows(5)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-all cursor-pointer">Add 5 Rows</button>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 bg-white px-4 py-2 rounded-lg border border-slate-100">
                            <Info size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Tab to navigate</span>
                        </div>
                    </div>
                </div>

                {/* FOOTER ACTION BAR - Gap Removed */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0"><AlertCircle size={24} /></div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Review Information</h4>
                            <p className="text-xs text-slate-500 font-medium">Please ensure all candidate details are accurate before initiating.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => {setRows([{ id: Date.now(), firstName: '', lastName: '', email: '', phone: '' }]); setSuccess(null); setError(null);}} className="flex-1 md:flex-none px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all cursor-pointer">Clear All</button>
                        <button
                            onClick={handleInitiate}
                            disabled={isSubmitting}
                            className="flex-1 cursor-pointer md:flex-none flex items-center justify-center gap-3 bg-[#5D4591] hover:bg-[#4a3675] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-[#5D4591]/30 active:scale-95 disabled:opacity-50 min-w-[240px]"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={18} /> Processing...</>
                            ) : (
                                <><Send size={18} /> Initiate Verifications</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkCreateCandidates;
