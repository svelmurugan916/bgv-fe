import React from "react";

const RoleCardSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-slate-100 rounded-lg w-1/2" />
            <div className="h-5 bg-slate-50 rounded-full w-16" />
        </div>
        <div className="h-3 bg-slate-50 rounded w-1/4 mb-6" />

        <div className="space-y-2 mb-8">
            <div className="h-3 bg-slate-50 rounded w-full" />
            <div className="h-3 bg-slate-50 rounded w-5/6" />
        </div>

        <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white" />
                    ))}
                </div>
                <div className="h-3 bg-slate-50 rounded w-20" />
            </div>
            <div className="h-4 bg-slate-100 rounded w-16" />
        </div>
    </div>
);

export default RoleCardSkeleton;