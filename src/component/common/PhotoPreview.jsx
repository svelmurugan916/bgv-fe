import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import SecureImage from "../secure-document-api/SecureImage.jsx";

const PhotoPreview = ({ label, src }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* THE PREVIEW CARD */}
            <div
                className="group relative aspect-square bg-slate-100 rounded-[12px] overflow-hidden border border-slate-200 shadow-sm cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <SecureImage
                    fileUrl={src}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{label}</p>
                    <button className="flex items-center gap-2 text-white text-[11px] font-bold uppercase">
                        <Maximize2 size={14} /> View Full Image
                    </button>
                </div>

                {/* Top Label Tag */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-slate-200/50">
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">{label}</span>
                </div>
            </div>

            {/* FULL SCREEN MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Close Button */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Container */}
                    <div className="relative z-[105] w-full max-w-5xl max-h-full flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="bg-white p-2 rounded-2xl shadow-2xl">
                            <SecureImage
                                fileUrl={src}
                                className="max-w-full max-h-[80vh] rounded-xl object-contain"
                                alt={label}
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="text-white font-bold text-lg">{label}</h3>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Secure Evidence Capture</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PhotoPreview;
