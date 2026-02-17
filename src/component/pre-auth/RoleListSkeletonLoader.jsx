import React from "react";

const RoleListSkeletonLoader = () => {
    return (
        [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-5 rounded-2xl border-2 border-slate-100 bg-white animate-pulse">
                <div className="w-12 h-12 rounded-full bg-slate-100 mr-4 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-50 rounded w-3/4" />
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-50" />
            </div>
        ))
    )
}

export default RoleListSkeletonLoader