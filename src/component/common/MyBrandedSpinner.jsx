import React from 'react';
import { ShieldCheck } from 'lucide-react';

const MyBrandedSpinner = ({ message = "Verifying your details..." }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-md">
            <div className="relative flex items-center justify-center">

                {/* 1. THE SMOOTH TAIL SPINNER */}
                {/* This uses a conic gradient and a blur filter to create the 'shadow tail' effect */}
                <div className="relative w-24 h-24">
                    <div
                        className="absolute inset-0 rounded-full animate-spin blur-[1px]"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0%, #5D4591 100%)',
                            maskImage: 'radial-gradient(transparent 58%, black 60%)',
                            WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)'
                        }}
                    ></div>

                    {/* Secondary soft glow tail for extra smoothness */}
                    <div
                        className="absolute inset-0 rounded-full animate-spin opacity-30 blur-md"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 30%, #5D4591 100%)',
                        }}
                    ></div>
                </div>

                {/* 2. CENTER SHIELD ICON */}
                <div className="absolute flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-sm border border-slate-100">
                    <ShieldCheck
                        size={24}
                        className="text-[#5D4591] animate-pulse"
                        strokeWidth={2.5}
                    />
                </div>

                {/* Decorative outer static ring */}
                <div className="absolute w-24 h-24 border-[1px] border-slate-200 rounded-full opacity-50"></div>
            </div>

            {/* Loading Text Section */}
            <div className="mt-10 flex flex-col items-center text-center px-6">
                <p className="text-sm text-slate-500 font-bold mt-2 max-w-[250px] leading-relaxed">
                    {message}
                </p>
            </div>

            {/* Brand subtle footer */}
            <div className="absolute bottom-10 flex flex-col items-center gap-2">
                <div className="h-[1px] w-12 bg-slate-200 mb-2"></div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Trace-U Verification Engine
                </div>
            </div>
        </div>
    );
};

export default MyBrandedSpinner;
