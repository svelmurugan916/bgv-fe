const UserListSkeleton = () => (
    <div className="p-4 rounded-2xl bg-white border border-transparent shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-2 bg-slate-50 rounded w-3/4" />
            </div>
        </div>
    </div>
);

export default UserListSkeleton;