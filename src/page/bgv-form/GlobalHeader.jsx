import React from 'react';
import {
    Clock,
    CloudCheck,
    HelpCircle,
    User2
} from 'lucide-react';
import { useTenant } from "../../provider/TenantProvider.jsx";
import SupportDrawer from "../../component/app-basic-page/SupportDrawer.jsx";
import HeaderProfile from "./HeaderProfile.jsx";

const GlobalHeader = ({ candidateName, showAutoSaving = true, profilePictureUrl=undefined, setIsHelpOpen }) => {
    const { tenantConfig } = useTenant();

    return (
        <>
            <header className="w-full bg-white border-b border-slate-100 relative lg:sticky lg:top-0 z-[60] shadow-sm">
                <div className="px-4 lg:px-8 py-3 flex items-center justify-between">
                    <div className="inline-flex flex-col items-end">
                        <img src={tenantConfig?.logoUrl || "/logo.png"} alt="Vantira" className="h-8 w-auto"/>
                        <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 ml-1">
                           Secure Verification
                        </span>
                    </div>

                    <div className="flex items-center gap-1 lg:gap-4">
                        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 mr-2">
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-[#5D4591]" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase">~8 mins</span>
                            </div>
                            {showAutoSaving && (
                                <>
                                    <div className="w-px h-3 bg-slate-200"></div>
                                    <div className="flex items-center gap-1.5">
                                        <CloudCheck size={14} className="text-green-500" />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase">Auto-saving</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2">
                            {/* HELP TRIGGER */}
                            <button
                                onClick={() => setIsHelpOpen(true)}
                                className="p-2 text-slate-400 hover:text-[#5D4591] hover:bg-[#F9F7FF] rounded-xl transition-colors cursor-pointer"
                            >
                                <HelpCircle size={20} />
                            </button>
                            <HeaderProfile candidateName={candidateName} profilePictureUrl={profilePictureUrl} />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default GlobalHeader;
