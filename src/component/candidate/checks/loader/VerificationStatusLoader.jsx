const VerificationStatusLoader = () => {
    return (
        <div className="flex items-center justify-between px-8 py-3 bg-slate-50/50 border-b border-slate-100 animate-pulse">
            {/* Left Side: Icon and Label Placeholder */}
            <div className="flex items-center gap-2">
                {/* Icon Circle/Square */}
                <div className="w-4 h-4 bg-slate-200 rounded-md" />
                {/* Label Bar */}
                <div className="w-24 h-3 bg-slate-200 rounded-full" />
            </div>

            {/* Right Side: System Verdict Placeholder */}
            <div className="flex items-center gap-1.5">
                {/* "System Verdict" Text Bar */}
                <div className="w-16 h-2 bg-slate-100 rounded-full" />
                {/* Status Dot */}
                <div className="w-2 h-2 bg-slate-200 rounded-full shadow-sm" />
            </div>
        </div>

    )
}

export default VerificationStatusLoader;