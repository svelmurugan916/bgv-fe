import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

const MyBrandedSpinner = ({
                              message = "Verifying your details...",
                              subtext = "Please wait while we prepare your workspace.",
                              brandLabel = "Security Engine"
                          }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            {/* Subtle background pattern for Enterprise feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ backgroundImage: `radial-gradient(#5D4591 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
            </div>

            <div className="relative flex items-center justify-center">
                {/* 1. THE SMOOTH TAIL SPINNER */}
                <div className="relative w-28 h-28">
                    <div
                        className="absolute inset-0 rounded-full animate-spin blur-[1px]"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0%, #5D4591 100%)',
                            maskImage: 'radial-gradient(transparent 58%, black 60%)',
                            WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)'
                        }}
                    ></div>
                    <div
                        className="absolute inset-0 rounded-full animate-spin opacity-20 blur-xl"
                        style={{ background: 'conic-gradient(from 0deg, transparent 30%, #5D4591 100%)' }}
                    ></div>
                </div>

                {/* 2. CENTER ICON */}
                <div className="absolute flex items-center justify-center bg-white rounded-full w-14 h-14 shadow-xl border border-slate-50">
                    <ShieldCheck
                        size={28}
                        className="text-[#5D4591] animate-pulse"
                        strokeWidth={1.5}
                    />
                </div>

                {/* Decorative outer static ring */}
                <div className="absolute w-28 h-28 border-[1px] border-slate-100 rounded-full"></div>
            </div>

            {/* Loading Text Section */}
            <div className="mt-12 flex flex-col items-center text-center px-6 max-w-sm">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                    {message}
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed italic">
                    {subtext}
                </p>
            </div>

            {/* Brand subtle footer */}
            <div className="absolute bottom-12 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-8 bg-slate-200"></div>
                    <Loader2 size={14} className="animate-spin text-slate-300" />
                    <div className="h-[1px] w-8 bg-slate-200"></div>
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    Vantira {brandLabel}
                </div>
            </div>
        </div>
    );
};

export default MyBrandedSpinner;
