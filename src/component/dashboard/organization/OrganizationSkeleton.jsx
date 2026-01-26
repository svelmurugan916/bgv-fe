const OrganizationSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse">
            {/* Header: Logo and Menu Button */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                <div className="w-5 h-5 bg-slate-50 rounded-full"></div>
            </div>

            {/* Title Placeholder */}
            <div className="h-5 w-3/4 bg-slate-200 rounded-lg mb-2"></div>

            {/* TAT Badge Placeholder */}
            <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-28 bg-slate-100 rounded-lg"></div>
            </div>

            {/* Stats Grid Placeholder (4 Columns) */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                        <div className="h-2 w-8 bg-slate-100 rounded mb-2"></div>
                        <div className="h-5 w-10 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Progress Bar Placeholder */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                    <div className="h-3 w-8 bg-slate-100 rounded"></div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full"></div>
            </div>

            {/* Button Placeholder */}
            <div className="w-full h-[44px] bg-slate-100 rounded-xl"></div>
        </div>
    );
};

export default OrganizationSkeleton;