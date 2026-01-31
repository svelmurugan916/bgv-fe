import React from 'react';

const AuditTrailSkeleton = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10 animate-pulse">
            {/* 1. Header Skeleton */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                    <div className="space-y-2">
                        <div className="h-2 w-24 bg-slate-100 rounded" />
                        <div className="h-4 w-40 bg-slate-200 rounded" />
                        <div className="h-2 w-32 bg-slate-50 rounded" />
                    </div>
                </div>
                {/* SLA Box Skeleton */}
                <div className="rounded-[1.5rem] p-5 h-24 min-w-[360px] bg-slate-900/5 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <div className="space-y-2">
                            <div className="h-2 w-20 bg-slate-200 rounded" />
                            <div className="h-3 w-32 bg-slate-200 rounded" />
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <div className="h-2 w-12 bg-slate-200 rounded ml-auto" />
                        <div className="h-6 w-16 bg-slate-200 rounded ml-auto" />
                    </div>
                </div>
            </div>

            {/* 2. Timeline Grid Skeleton */}
            <div className="space-y-8">
                <div className="h-3 w-48 bg-slate-100 rounded mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-50">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-2 w-16 bg-slate-100 rounded" />
                            <div className="h-3 w-32 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditTrailSkeleton;
