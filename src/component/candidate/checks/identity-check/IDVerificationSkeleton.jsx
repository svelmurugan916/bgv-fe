import React from 'react';

const IDVerificationSkeleton = ({ isPassport }) => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Document Card Skeleton */}
            <div className="space-y-4">
                <div className="h-4 w-48 bg-slate-200 rounded-md" />
                <div className="h-40 w-full bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200" />
            </div>

            {/* Form Fields Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white rounded-[2rem] border border-slate-100">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 w-24 bg-slate-200 rounded-md" />
                        <div className="h-12 w-full bg-slate-50 rounded-xl border border-slate-100" />
                    </div>
                ))}
            </div>

            {isPassport && (
                <>
                    <div className="h-px bg-slate-100 my-8" />
                    <div className="space-y-4">
                        <div className="h-4 w-48 bg-slate-200 rounded-md" />
                        <div className="h-40 w-full bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200" />
                    </div>
                </>
            )}

            {/* Consent Skeleton */}
            <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                <div className="w-6 h-6 bg-slate-200 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-full bg-slate-200 rounded-md" />
                    <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default IDVerificationSkeleton;
