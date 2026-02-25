const CaseVelocityLoader = () => {
    return (
        <div className="flex flex-col h-full animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-8 shrink-0">
                <div className="space-y-3">
                    <div className="h-7 w-56 bg-slate-100 rounded-xl" />
                    <div className="h-3 w-36 bg-slate-50 rounded-lg" />
                </div>
                <div className="flex gap-4">
                    <div className="h-4 w-20 bg-slate-50 rounded-lg" />
                    <div className="h-4 w-20 bg-slate-50 rounded-lg" />
                </div>
            </div>

            {/* Chart Area Skeleton */}
            <div className="flex-grow min-h-[300px] w-full bg-slate-50/30 rounded-[24px] border border-slate-50 flex items-end justify-around p-8">
                <div className="h-[40%] w-10 bg-slate-100 rounded-t-xl" />
                <div className="h-[70%] w-10 bg-slate-100 rounded-t-xl" />
                <div className="h-[55%] w-10 bg-slate-100 rounded-t-xl" />
                <div className="h-[85%] w-10 bg-slate-100 rounded-t-xl" />
                <div className="h-[30%] w-10 bg-slate-100 rounded-t-xl" />
                <div className="h-[60%] w-10 bg-slate-100 rounded-t-xl" />
            </div>

            {/* Metric Cards Skeleton */}
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-6 shrink-0">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-[24px] border border-slate-50 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                            <div className="h-3 w-20 bg-slate-100 rounded-md" />
                        </div>
                        <div className="h-7 w-24 bg-slate-100 rounded-xl" />
                        <div className="h-2 w-32 bg-slate-50 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CaseVelocityLoader;