import {CheckIcon} from "lucide-react";

const DocumentSection = ({ title, icon: Icon, isCompleted, children, description }) => (
    /*
       CHANGE: Removed border and bg on mobile (default).
       Added them back only for lg (laptop) screens.
       Reduced horizontal padding on mobile (px-0).
    */
    <div className={`mb-12 lg:mb-16 lg:p-8 lg:rounded-[2.5rem] lg:border-2 transition-all duration-500 ${
        isCompleted
            ? 'lg:bg-emerald-50/30 lg:border-emerald-100'
            : 'lg:bg-slate-50/50 lg:border-slate-100'
    }`}>
        {/* Header: Made more compact for mobile */}
        <div className="flex items-start lg:items-center justify-between mb-6 px-1 lg:px-2">
            <div className="flex items-center gap-3 lg:gap-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-[#F9F7FF] text-[#5D4591] border border-[#5D4591]/10'
                }`}>
                    <Icon size={20} className="lg:size-6" />
                </div>
                <div>
                    <h3 className="text-sm lg:text-lg font-black text-slate-900 tracking-tight leading-none lg:leading-normal">{title}</h3>
                    <p className="text-[10px] lg:text-xs text-slate-500 font-medium mt-1">{description}</p>
                </div>
            </div>

            {isCompleted && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-full shrink-0">
                    <CheckIcon size={12} strokeWidth={4} />
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Verified</span>
                </div>
            )}
        </div>

        {/* Content Area: No extra padding on mobile */}
        <div className="space-y-4 lg:space-y-6">
            {children}
        </div>
    </div>
);


export default DocumentSection;