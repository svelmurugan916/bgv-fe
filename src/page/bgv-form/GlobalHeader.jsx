import React from 'react';
import { HelpCircle, LogOut, User, Clock, CloudCheck } from 'lucide-react';

const GlobalHeader = ({ candidateName, appId }) => {
    return (
        <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-[60] shadow-sm">
            {/* MAIN HEADER ROW */}
            <div className="px-4 lg:px-8 py-3 flex items-center justify-between">
                <div className="inline-flex flex-col items-end">
                    <img src="/logo.png" alt="Trace-U" className="h-8 w-auto" />
                    <span className="text-[7px] font-bold text-slate-400 tracking-[0.15em] uppercase -mt-1 pr-0.5">
                    Secure Verification
                </span>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-1 lg:gap-4">
                    {/* App ID - Desktop Only */}
                    <div className="hidden lg:flex flex-col items-end border-r border-slate-100 pr-4 mr-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Application ID</p>
                        <p className="text-[11px] font-bold text-slate-900">{appId}</p>
                    </div>

                    {/* Desktop Info (Hidden on Mobile) */}
                    <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 mr-2">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#5D4591]" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">~8 mins</span>
                        </div>
                        <div className="w-px h-3 bg-slate-200"></div>
                        <div className="flex items-center gap-1.5">
                            <CloudCheck size={14} className="text-green-500" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Auto-saving</span>
                        </div>
                    </div>

                    {/* Action Icons & Candidate Name */}
                    <div className="flex items-center gap-1 lg:gap-2">
                        <button className="p-2 text-slate-400 hover:text-[#5D4591] hover:bg-[#F9F7FF] rounded-xl transition-colors" title="Help">
                            <HelpCircle size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Save & Exit">
                            <LogOut size={20} />
                        </button>

                        {/* CANDIDATE PROFILE SECTION */}
                        <div className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-100">
                            <div className="hidden sm:flex flex-col items-end">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Candidate</p>
                                <p className="text-[11px] font-bold text-slate-900 leading-tight">{candidateName}</p>
                            </div>
                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#F9F7FF] border border-[#5D4591]/10 flex items-center justify-center text-[#5D4591] shadow-inner">
                                <User size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE STATUS BAR */}
            <div className="lg:hidden px-4 py-2 bg-[#F9F7FF] border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#5D4591]" />
                    <p className="text-[9px] font-bold text-[#5D4591] uppercase tracking-tight">Takes ~8 mins</p>
                </div>
                {/* On mobile, we can show the name here if needed, or keep the auto-save status */}
                <div className="flex items-center gap-1.5">
                    <CloudCheck size={12} className="text-green-600" />
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Progress Auto-saved</p>
                </div>
            </div>
        </header>
    );
};

export default GlobalHeader;
