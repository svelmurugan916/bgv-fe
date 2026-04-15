import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    Building2,
    SearchX,
    ShieldAlert,
    HelpCircle
} from 'lucide-react';

const OrganizationNotFound = ({ id }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500 p-4 sm:p-8">
            <div className="max-w-[1600px] mx-auto">
                {/* 1. HEADER SECTION (Matches OrganizationCases layout) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/organisation-dashboard')}
                            className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#5D4591] hover:border-[#5D4591]/30 hover:bg-[#F9F7FF] transition-all shadow-sm"
                        >
                            <ArrowLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                <span className="text-rose-500">Organization Not Found</span>
                                <span className="text-slate-400 font-normal ml-2">/ Error</span>
                            </h1>
                            <p className="text-sm text-slate-500 mt-0.5 font-medium">The requested organization record could not be retrieved.</p>
                        </div>
                    </div>
                </div>

                {/* 2. DISABLED STATS RIBBON (To maintain visual layout) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 opacity-50 grayscale pointer-events-none">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="h-2 w-16 bg-slate-100 rounded mb-3" />
                            <div className="h-6 w-24 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>

                {/* 3. MAIN ERROR CONTENT */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="py-24 px-6 flex flex-col items-center text-center">
                        <div className="relative mb-10">
                            {/* Decorative Elements */}
                            <div className="absolute inset-0 bg-rose-500/5 rounded-full scale-[2.5] blur-3xl" />
                            <div className="relative w-28 h-28 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center justify-center text-rose-500">
                                <Building2 size={48} strokeWidth={1.5} className="opacity-20 absolute" />
                                <SearchX size={40} strokeWidth={2} className="relative z-10" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                            Organization ID Not Recognized
                        </h2>

                        <div className="max-w-md space-y-4 mb-10">
                            <p className="text-slate-500 font-medium leading-relaxed">
                                We couldn't find an organization matching the ID <code className="bg-slate-100 px-2 py-0.5 rounded text-[#5D4591] font-bold">{id}</code>.
                                This usually happens if the link is broken or the organization has been deactivated.
                            </p>

                            <div className="flex items-center justify-center gap-6 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <ShieldAlert size={14} className="text-rose-400" />
                                    Security Verified
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <HelpCircle size={14} className="text-blue-400" />
                                    System Status: OK
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                onClick={() => navigate('/organisation-dashboard')}
                                className="px-8 py-4 bg-[#5D4591] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#4a3675] transition-all shadow-xl shadow-[#5D4591]/20 flex items-center gap-2 active:scale-95"
                            >
                                <ArrowLeftIcon size={16} strokeWidth={3} /> Return to Dashboard
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                            Ref ID: {id} • Request Time: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationNotFound;
