import React, {useEffect, useRef, useState} from "react";
import {ChevronDown} from "lucide-react";

export const HeadingPicker = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCurrentLabel = () => {
        if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
        if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
        if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
        if (editor.isActive('heading', { level: 4 })) return 'Heading 4';
        if (editor.isActive('heading', { level: 5 })) return 'Heading 5';
        if (editor.isActive('heading', { level: 6 })) return 'Heading 6';
        return 'Normal text';
    };

    const options = [
        { label: 'Normal text', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph'), shortcut: '⌘⌥0', size: 'text-sm' },
        { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), shortcut: '⌘⌥1', size: 'text-2xl font-bold' },
        { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), shortcut: '⌘⌥2', size: 'text-xl font-bold' },
        { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), shortcut: '⌘⌥3', size: 'text-lg font-bold' },
        { label: 'Heading 4', action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), active: editor.isActive('heading', { level: 4 }), shortcut: '⌘⌥4', size: 'text-base font-bold' },
        { label: 'Heading 5', action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(), active: editor.isActive('heading', { level: 5 }), shortcut: '⌘⌥5', size: 'text-sm font-bold' },
        { label: 'Heading 6', action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(), active: editor.isActive('heading', { level: 6 }), shortcut: '⌘⌥6', size: 'text-xs font-bold uppercase' },
    ];

    return (
        <div className="relative" ref={pickerRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all text-slate-700 font-medium text-sm min-w-[120px] justify-between">
                {getCurrentLabel()}
                <ChevronDown size={14} className="text-slate-400" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 py-2 bg-white border border-slate-200 shadow-xl rounded-xl z-50 w-[240px]">
                    {options.map((opt, i) => (
                        <button key={i} onClick={() => { opt.action(); setIsOpen(false); }} className={`flex items-center justify-between w-full px-4 py-2 hover:bg-slate-50 transition-colors ${opt.active ? 'text-[#5D4591] bg-slate-50' : 'text-slate-700'}`}>
                            <span className={opt.size}>{opt.label}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{opt.shortcut}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};