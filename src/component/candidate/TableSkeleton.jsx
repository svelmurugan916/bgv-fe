const TableSkeleton = () => {
    return (
        <div className="w-full animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
                    <div className="flex items-center gap-3 w-1/4">
                        <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-50 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="w-1/4 space-y-2">
                        <div className="h-2 bg-slate-100 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-50 rounded w-2/3"></div>
                    </div>
                    <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
                    <div className="w-12 h-8 bg-slate-50 rounded-lg"></div>
                    <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
                    <div className="w-20 h-8 bg-slate-50 rounded-lg"></div>
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;