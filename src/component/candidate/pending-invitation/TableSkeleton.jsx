const TableSkeleton = () => {
    return (
        <>
            {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                            <div className="space-y-2">
                                <div className="h-3 w-32 bg-slate-200 rounded"></div>
                                <div className="h-2 w-48 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-2">
                            <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-2">
                            <div className="h-2 w-32 bg-slate-200 rounded"></div>
                            <div className="h-2 w-28 bg-slate-100 rounded"></div>
                            <div className="h-2 w-36 bg-slate-100 rounded"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="h-8 w-28 bg-slate-200 rounded-xl ml-auto"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;