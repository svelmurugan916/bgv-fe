import {Check, CopyIcon, Edit3, Loader2, Package, Plus, Trash2Icon, X} from "lucide-react";
import React from "react";

const AssignedPackage = ({organizationPackage, activeDeleteId, setActiveDeleteId, handleActionClick, checkNameType, handleClickEdit, handleClickClone, handleDeletePackage, handleCreateCustomPackage}) => {
    const [showLoader, setShowLoader] = React.useState(false);
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[500px]">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black text-slate-800 leading-tight">Assigned Packages</h2>
                            {/* Repositioned Active Badge */}
                            <div className="bg-[#5D4591]/10 px-2.5 py-1 rounded-lg text-[#5D4591] font-black text-[10px] uppercase tracking-widest">
                                {organizationPackage?.length || 0} Active
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">View and manage verification bundles for this client.</p>
                    </div>

                    {/* Create Custom Package Button */}
                    <button
                        onClick={() => handleCreateCustomPackage()}
                        className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#5D4591] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create Custom Package
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organizationPackage?.map((pkg) => {
                        const isConfirmingDelete = activeDeleteId === pkg.id;
                        return (
                            <div
                                key={pkg.id}
                                className="group p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:border-[#5D4591]/30 hover:bg-white hover:shadow-xl hover:shadow-[#5D4591]/5 transition-all relative"
                            >
                                {showLoader === pkg.id && (
                                    <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-[#5D4591]/10 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-[#5D4591] animate-spin" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4591] animate-pulse">
                                            Deleting...
                                        </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#5D4591]">
                                        <Package className="w-6 h-6" />
                                    </div>

                                    {/* Action Buttons Container */}
                                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                                        {!isConfirmingDelete ? (
                                            <>
                                                {/* Edit */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleClickEdit(pkg); }}
                                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#5D4591] transition-colors cursor-pointer"
                                                    title="Edit Package"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                {/* Clone */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleClickClone(pkg); }}
                                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                    title="Clone Package"
                                                >
                                                    <CopyIcon className="w-4 h-4" />
                                                </button>

                                                {/* Delete Trigger */}
                                                <button
                                                    onClick={(e) => handleActionClick(e, pkg.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    title="Delete Package"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            /* Delete Confirmation UI */
                                    <div className="flex items-center gap-2 px-2 animate-in fade-in zoom-in duration-200">
                                        <span className="text-[10px] font-black uppercase text-red-500 tracking-tighter">Are you sure?</span>
                                        <div className="flex gap-1">
                                            <button
                                            onClick={(e) => { e.stopPropagation(); setShowLoader(pkg.id); handleDeletePackage(pkg.id); setActiveDeleteId(null); }}
                                         className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveDeleteId(null); }}
                                        className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                    )}
                    </div>
                    </div>

                        <h4 className="font-black text-slate-800 mb-1">{pkg.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {pkg.checks.map((c, i) => (
                                <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg uppercase tracking-tighter">
                                                {checkNameType[c] || c}
                                                </span>
                            ))}
                        </div>
                    </div>
                    );
                    })}
                </div>

            </div>
        </div>
    )
}

export default AssignedPackage;
