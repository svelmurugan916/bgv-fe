const CategoriesSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Label Skeleton */}
            <div className="h-3 w-32 bg-slate-100 rounded mb-6 ml-1"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="relative p-5 rounded-[2rem] border-2 border-slate-100 bg-white"
                    >
                        {/* Icon Placeholder */}
                        <div className="w-10 h-10 rounded-xl bg-slate-100 mb-4"></div>

                        {/* Title Placeholder */}
                        <div className="h-4 w-24 bg-slate-200 rounded-lg mb-2"></div>

                        {/* Description Placeholder (Two lines) */}
                        <div className="space-y-2">
                            <div className="h-2.5 w-full bg-slate-100 rounded"></div>
                            <div className="h-2.5 w-2/3 bg-slate-100 rounded"></div>
                        </div>

                        {/* Top-right Plus Icon Placeholder */}
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-50"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSkeleton;