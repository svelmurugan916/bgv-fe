// src/components/identity-check/components/DocumentPreview.jsx
import React, { useState } from 'react';
import { Eye, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';

const DocumentPreview = ({ imageUrl, documentLabel }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    return (
        <div className="bg-slate-900 rounded-[2rem] aspect-[4/3] flex items-center justify-center relative group overflow-hidden">
            {imageUrl ? (
                <img src={imageUrl} alt={`${documentLabel} Preview`} className="w-full h-full object-contain" />
            ) : (
                <div className="text-white/20 flex flex-col items-center gap-2">
                    <Eye size={48} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">{documentLabel} Not Available</p>
                </div>
            )}
            {imageUrl && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2"
                >
                    <Maximize2 size={18} /> View High-Res Document
                </button>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-full max-h-full flex flex-col">
                        <div className="flex justify-end p-2">
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-slate-900">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                            <img
                                src={imageUrl}
                                alt={`${documentLabel} High-Res`}
                                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                                className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out"
                            />
                        </div>
                        <div className="flex justify-center gap-4 p-4 border-t border-slate-200">
                            <button onClick={handleZoomIn} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200"><ZoomIn size={16} /> Zoom In</button>
                            <button onClick={handleZoomOut} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200"><ZoomOut size={16} /> Zoom Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentPreview;
