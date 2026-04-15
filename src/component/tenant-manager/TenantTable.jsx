import React from 'react';
import { ExternalLink, Zap, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const TenantTable = ({ tenants, isLoading, pageInfo, onPageChange, onViewDetails }) => {

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Warning': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Suspended': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    // Skeleton Loader Row
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="px-8 py-5"><div className="h-10 w-40 bg-slate-100 rounded-xl"></div></td>
            <td className="px-6 py-5"><div className="h-8 w-24 bg-slate-50 rounded-lg"></div></td>
            <td className="px-6 py-5"><div className="h-4 w-32 bg-slate-50 rounded-full"></div></td>
            <td className="px-6 py-5"><div className="h-4 w-12 bg-slate-50 rounded-full"></div></td>
            <td className="px-6 py-5 text-right"><div className="h-8 w-20 bg-slate-100 rounded-xl ml-auto"></div></td>
        </tr>
    );

    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan & Status</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage (API)</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                    ) : tenants.length > 0 ? (
                        tenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#5D4591]/5 flex items-center justify-center text-[#5D4591] font-black">
                                            <img src={tenant?.favIconUrl} alt={tenant.name?.charAt(0)}/>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm">{tenant.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                {tenant.code} | {tenant.domain} <ExternalLink size={10} />
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-slate-700 uppercase">{tenant.plan}</span>
                                        <span className={`w-fit px-2 py-0.5 rounded-md border text-[9px] font-black uppercase ${getStatusStyle(tenant.status)}`}>
                                                {tenant.status}
                                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="w-32">
                                        <div className="flex justify-between text-[9px] font-black mb-1 text-slate-400 uppercase">
                                            <span>Monthly</span>
                                            <span className={tenant.stats?.apiUsage > 80 ? 'text-rose-500' : 'text-slate-600'}>
                                                    {tenant.stats?.apiUsage || 0}%
                                                </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${tenant.stats?.apiUsage > 80 ? 'bg-rose-500' : 'bg-[#5D4591]'}`}
                                                style={{ width: `${tenant.stats?.apiUsage || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className={`flex items-center gap-1.5 font-black text-xs ${tenant.stats?.healthScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        <Zap size={14} fill="currentColor" /> {tenant.stats?.healthScore || 0}%
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => onViewDetails(tenant)}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-[#5D4591] hover:text-white transition-all"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-20 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <Inbox size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No Tenants Found</p>
                                    <p className="text-[10px] font-medium mt-1">Try adjusting your search or filters</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Showing {tenants.length} of {pageInfo.totalElements || 0} Organizations
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={pageInfo.number === 0 || isLoading}
                        onClick={() => onPageChange(pageInfo.number - 1)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-[#5D4591] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-1">
                        {[...Array(pageInfo.totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onPageChange(i)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${pageInfo.number === i ? 'bg-[#5D4591] text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={pageInfo.number + 1 >= pageInfo.totalPages || isLoading}
                        onClick={() => onPageChange(pageInfo.number + 1)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-[#5D4591] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantTable;
