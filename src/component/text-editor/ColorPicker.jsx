import React, {useEffect, useRef, useState} from "react";
import {Baseline, ChevronDown} from "lucide-react";

export const ColorPicker = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef(null);

    const COLORS = [
        { name: 'Default', color: '#475569' },
        { name: 'Blue', color: '#2563eb' },
        { name: 'Teal', color: '#0d9488' },
        { name: 'Green', color: '#16a34a' },
        { name: 'Orange', color: '#ea580c' },
        { name: 'Red', color: '#dc2626' },
        { name: 'Purple', color: '#9333ea' },
        { name: 'Gray', color: '#64748b' },
        { name: 'Light Blue', color: '#60a5fa' },
        { name: 'Light Teal', color: '#2dd4bf' },
        { name: 'Light Green', color: '#4ade80' },
        { name: 'Yellow', color: '#facc15' },
        { name: 'Soft Red', color: '#f87171' },
        { name: 'Soft Purple', color: '#c084fc' },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentColor = editor.getAttributes('textStyle').color || '#475569';

    return (
        <div className="relative" ref={pickerRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
                <div className="flex flex-col items-center">
                    <Baseline size={18} style={{ color: currentColor }} />
                    <div className="w-4 h-0.5 mt-0.5" style={{ backgroundColor: currentColor }} />
                </div>
                <ChevronDown size={12} className="text-slate-400" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-slate-200 shadow-xl rounded-xl z-50 w-[220px]">
                    <div className="grid grid-cols-7 gap-2">
                        {COLORS.map((c) => (
                            <button key={c.color} onClick={() => { editor.chain().focus().setColor(c.color).run(); setIsOpen(false); }} className="w-6 h-6 rounded-md border border-slate-100 hover:scale-110 transition-transform" style={{ backgroundColor: c.color }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};