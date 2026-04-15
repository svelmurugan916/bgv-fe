import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRightIcon,
    SearchX,
    ArrowLeft,
    UserX2,
    FileQuestion
} from 'lucide-react';

const CandidateNotFound = ({ id }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F9FB] animate-in fade-in duration-500">
            {/* HEADER AREA (Matches CandidateShow structure) */}
            <div className="bg-white px-4 sm:px-8 pt-6 border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto">

                    {/* 1. BREADCRUMBS */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                            <span
                                className="text-slate-400 cursor-pointer hover:text-[#5D4591] transition-colors"
                                onClick={() => navigate('/candidate-list')}
                            >
                                Candidates
                            </span>
                            <ChevronRightIcon size={12} className="text-slate-300" />
                            <span className="text-rose-500">Error 404</span>
                        </div>
                    </div>

                    {/* 2. TITLE SECTION */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                            <UserX2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                Candidate Not Found
                            </h1>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                ID: <span className="text-slate-600">{id || 'Unknown'}</span>
                            </p>
                        </div>
                    </div>

                    {/* 3. COVER TAB (Placeholder to maintain UI height/consistency) */}
                    <div className="relative mt-4">
                        <div className="flex gap-8 border-b border-slate-100">
                            <div className="pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 border-b-2 border-rose-500 relative z-10">
                                Error Details
                            </div>
                            <div className="pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 cursor-not-allowed">
                                Checks
                            </div>
                            <div className="pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 cursor-not-allowed">
                                Timeline
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-[1600px] mx-auto py-20 px-4">
                <div className="flex flex-col items-center text-center max-w-md mx-auto">
                    <div className="relative mb-8">
                        {/* Decorative Background Circles */}
                        <div className="absolute inset-0 bg-[#5D4591]/5 rounded-full scale-[2.5] blur-2xl" />
                        <div className="relative w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center justify-center text-[#5D4591]">
                            <SearchX size={40} strokeWidth={1.5} />
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 mb-3">
                        We couldn't find this case
                    </h2>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
                        The candidate record you are looking for might have been removed,
                        merged, or the ID in the URL is incorrect. Please verify the
                        Case Number and try again.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                        <button
                            onClick={() => navigate('/candidate-list')}
                            className="w-full py-4 bg-[#5D4591] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#4a3675] transition-all shadow-xl shadow-[#5D4591]/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <ArrowLeft size={16} strokeWidth={3} /> Back to Candidates
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            Retry Search
                        </button>
                    </div>

                    {/* Support Link */}
                    <p className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Need help? <span className="text-[#5D4591] cursor-pointer hover:underline">Contact System Admin</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CandidateNotFound;
