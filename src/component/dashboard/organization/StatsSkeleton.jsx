
const StatsSkeleton = ({ parentDivClass = "max-w-7xl" }) => {
    return (
        <div className={`${parentDivClass} mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-5 animate-pulse`}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5">
                    {/* Icon Placeholder */}
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>

                    {/* Text Placeholders */}
                    <div className="flex-1 space-y-3">
                        {/* Label */}
                        <div className="h-3 w-24 bg-slate-100 rounded-lg"></div>
                        {/* Value */}
                        <div className="h-6 w-12 bg-slate-200 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
 export default StatsSkeleton;