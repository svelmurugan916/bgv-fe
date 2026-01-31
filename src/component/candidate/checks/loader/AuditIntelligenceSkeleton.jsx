const AuditIntelligenceSkeleton = () => {
    return (
        <div className="relative mt-10 animate-pulse">
            {/* 1. Bridge Line Skeleton */}
            <div className="absolute -top-10 left-[55px] h-10 w-[2px] border-l-2 border-dashed border-slate-100 pointer-events-none"></div>

            <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-sm">

                {/* 2. Header Skeleton */}
                <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-32 bg-slate-200 rounded-full"></div>
                                <div className="h-4 w-20 bg-slate-100 rounded-md"></div>
                            </div>
                            <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>
                    <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                </div>

                <div className="p-8 space-y-0">

                    {/* Segment 1: System Engine Placeholder */}
                    <div className="relative flex gap-6 pb-10">
                        <div className="flex flex-col items-center shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-slate-200 border-4 border-white shadow-sm"></div>
                            <div className="w-[2px] grow bg-slate-50 -mb-10"></div>
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-2.5 w-24 bg-slate-200 rounded-full"></div>
                                <div className="h-2.5 w-16 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="h-16 w-full bg-slate-50 rounded-2xl border border-slate-100"></div>
                        </div>
                    </div>

                    {/* Segment 2: Verifier Remarks Placeholder */}
                    <div className="relative flex gap-6 pb-10">
                        <div className="flex flex-col items-center shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 border-4 border-white shadow-sm"></div>
                            <div className="w-[2px] grow bg-slate-50 -mb-10"></div>
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-2.5 w-32 bg-slate-200 rounded-full"></div>
                                <div className="h-2.5 w-20 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="h-20 w-full bg-slate-50/50 rounded-2xl border border-slate-100"></div>
                        </div>
                    </div>

                    {/* Segment 3: Insufficiency Placeholder */}
                    <div className="relative flex gap-6">
                        <div className="flex flex-col items-center shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 border-4 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-28 bg-slate-100 rounded-full"></div>
                                    <div className="h-2.5 w-36 bg-slate-50 rounded-full"></div>
                                </div>
                            </div>
                            <div className="h-24 w-full bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-100"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuditIntelligenceSkeleton;
