import SecureImage from "../../secure-document-api/SecureImage.jsx";
import {ArrowUpRight, Building2, Clock, Edit3, EyeIcon, MoreVertical, SettingsIcon, Trash2Icon} from "lucide-react";
import React from "react";
import {useNavigate} from "react-router-dom";

const OrganizationCard = ({ org, isOpen, onToggle }) => {
    const completionRate = Math.round((org?.completedCases / org?.totalCases) * 100);
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#5D4591]/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
                {
                    org?.logoUrl ? (
                        <div className={"w-12 h-12"}>
                            <SecureImage
                                className="w-full h-full object-contain"
                                alt={org?.organizationName}
                                fileUrl={org?.logoUrl}
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-[#5D4591]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#5D4591] transition-colors">
                            <Building2 className="w-6 h-6 text-[#5D4591] group-hover:text-white transition-colors" />
                        </div>
                    )
                }

                <div className="relative">
                    <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in duration-200">
                            <button onClick={() => navigate(`organisation-details/${org?.organizationId}`)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors">
                                <EyeIcon className="w-4 h-4 text-slate-400" /> View Details
                            </button>
                            <button onClick={() => navigate(`organisation-form/${org?.organizationId}`)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                                <Edit3 className="w-4 h-4" /> Edit Details
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                                <SettingsIcon className="w-4 h-4" /> Config Rules
                            </button>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                                <Trash2Icon className="w-4 h-4" /> Deactivate
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{org.organizationName}</h3>

            {/* Replaced Growth with Avg TAT */}
            <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/50">
                    <Clock className="w-3 h-3" />
                    Avg TAT: {org?.averageTatDays || '0'} Days
                </span>
            </div>

            {/* Stats Grid - Now 4 Columns */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Total</p>
                    <p className="text-base font-bold text-slate-800">{org.totalCases}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Closed</p>
                    <p className="text-base font-bold text-emerald-600">{org.completedCases}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">WIP</p>
                    <p className="text-base font-bold text-amber-500">{org.inProgressCases}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Insuff.</p>
                    <p className="text-base font-bold text-rose-600">{org.insufficientCases || '0'}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-slate-600">Completion</p>
                    <p className="text-sm font-bold text-[#5D4591]">{completionRate || 0}%</p>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#5D4591] rounded-full transition-all duration-1000"
                        style={{ width: `${completionRate || 0}%` }}
                    ></div>
                </div>
            </div>

            <button onClick={() => navigate(`organisation-cases/${org?.organizationId}`)} className="w-full py-3 flex items-center cursor-pointer justify-center gap-2 text-sm font-bold text-[#5D4591] bg-[#5D4591]/5 rounded-xl hover:bg-[#5D4591] hover:text-white transition-all">
                View All Cases
                <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default OrganizationCard;