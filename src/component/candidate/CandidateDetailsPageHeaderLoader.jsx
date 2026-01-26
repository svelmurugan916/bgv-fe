import React from "react";

const CandidateDetailsPageHeaderLoader = () => {
    return (
        <div className="animate-pulse">
            {/* Breadcrumbs Skeleton */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-24 h-3 bg-slate-100 rounded-full" />
                <div className="w-3 h-3 bg-slate-50 rounded-full" />
                <div className="w-16 h-3 bg-slate-100 rounded-full" />
            </div>

            {/* Title Row Skeleton */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-8 bg-slate-100 rounded-lg" />
                    <div className="w-[1px] h-6 bg-slate-100" />
                    <div className="w-48 h-8 bg-slate-100 rounded-lg" />
                    <div className="flex items-center gap-1 ml-4 pl-6 border-l border-slate-50">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-8 h-8 bg-slate-50 rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-40 h-10 bg-slate-100 rounded-xl" />
                    <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                </div>
            </div>

            {/* Attributes Row Skeleton */}
            <div className="flex items-center gap-12 mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="w-12 h-2 bg-slate-50 rounded-full" />
                        <div className="w-24 h-4 bg-slate-100 rounded-md" />
                    </div>
                ))}
            </div>

            {/* Tabs Skeleton */}
            <div className="flex items-center gap-8 border-b border-slate-50">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="w-20 h-6 bg-slate-50 rounded-t-lg mb-4" />
                ))}
            </div>
        </div>
    )
}

export default CandidateDetailsPageHeaderLoader;