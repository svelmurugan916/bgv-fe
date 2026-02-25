import {Skeleton} from "./SkeletonLoading.jsx";
import {

    ArrowUpRight,
    ArrowDownRight, HelpCircle,
} from 'lucide-react';
import {useState} from "react";

const StatCard = ({ icon: Icon, label, value, subText, trend, trendType, color, density, loading, popoverContent, infoText }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isInfoHovered, setIsInfoHovered] = useState(false); // New state for info tooltip

    if (loading) return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex justify-between mb-4"><Skeleton className="w-10 h-10" /><Skeleton className="w-16 h-4" /></div>
            <Skeleton className="w-24 h-4 mb-2" /><Skeleton className="w-32 h-8" />
        </div>
    );

    const isCompact = density === 'compact';

    return (
        <div className={`bg-white rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-md duration-300 ${isCompact ? 'p-4' : 'p-6'}`}>
            <div className={`flex justify-between items-start ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div className={`${isCompact ? 'p-2' : 'p-3'} rounded-2xl ${color} bg-opacity-10 text-slate-700`}>
                    <Icon size={isCompact ? 18 : 22} className="text-white" />
                </div>

                {/* Header Actions Area: Trend + Info */}
                <div className="flex items-center gap-2">
                    {trend && (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight ${
                            trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                            {trendType === 'up' ? <ArrowUpRight size={12} strokeWidth={3}/> : <ArrowDownRight size={12} strokeWidth={3}/>}
                            {trend}
                        </div>
                    )}

                    {/* NEW: Info Text Element */}
                    {infoText && (
                        <div
                            className="relative"
                            onMouseEnter={() => setIsInfoHovered(true)}
                            onMouseLeave={() => setIsInfoHovered(false)}
                        >
                            <HelpCircle
                                size={14}
                                className="text-slate-300 hover:text-indigo-500 cursor-help transition-colors"
                            />
                            {isInfoHovered && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 text-white text-[10px] p-3 rounded-xl shadow-2xl z-[60] font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-200">
                                    <div className="absolute -top-1 right-1 w-2 h-2 bg-slate-900 rotate-45" /> {/* Tooltip Arrow */}
                                    {infoText}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-black text-slate-800 tracking-tight`}>{value}</h3>

                    {/* Hoverable Subtext Area (Existing Logic Kept) */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {subText && (
                            <span className={`text-[10px] font-bold text-slate-400 ${popoverContent ? 'cursor-help border-b border-dotted border-slate-300' : ''}`}>
                                {subText}
                            </span>
                        )}

                        {/* Drill-down Popover (Existing Logic Kept) */}
                        {isHovered && popoverContent && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                                {popoverContent}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;