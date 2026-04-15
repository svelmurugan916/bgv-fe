import React from 'react';

export const TransactionSkeleton = () => (
    <div className="w-full space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                    <div className="space-y-2">
                        <div className="w-32 h-3 bg-slate-100 rounded" />
                        <div className="w-20 h-2 bg-slate-50 rounded" />
                    </div>
                </div>
                <div className="w-24 h-4 bg-slate-100 rounded" />
                <div className="hidden lg:block w-40 h-4 bg-slate-100 rounded" />
            </div>
        ))}
    </div>
);