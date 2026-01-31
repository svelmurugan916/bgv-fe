import React, {useEffect, useRef, useState} from "react";
import {MoreHorizontal} from "lucide-react";

export const MoreMenu = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { label: 'Underline', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), shortcut: '⌘U' },
        { label: 'Strikethrough', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), shortcut: '⌘⇧S' },
        { label: 'Inline Code', action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), shortcut: '⌘E' },
        { label: 'Code Snippet', action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock'), shortcut: '⌘⌥C' },
        { label: 'Subscript', action: () => editor.chain().focus().toggleSubscript().run(), active: editor.isActive('subscript'), shortcut: '⌘⇧,' },
        { label: 'Superscript', action: () => editor.chain().focus().toggleSuperscript().run(), active: editor.isActive('superscript'), shortcut: '⌘⇧.' },
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-[#5D4591]/10 text-[#5D4591]' : 'text-slate-600 hover:bg-slate-100'}`}>
                <MoreHorizontal size={18} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 py-2 bg-white border border-slate-200 shadow-xl rounded-xl z-50 w-[220px]">
                    {options.map((opt, i) => (
                        <button key={i} onClick={() => { opt.action(); setIsOpen(false); }} className={`flex items-center justify-between w-full px-4 py-2 hover:bg-slate-50 transition-colors ${opt.active ? 'text-[#5D4591]' : 'text-slate-700'}`}>
                            <span className="text-sm">{opt.label}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{opt.shortcut}</span>
                        </button>
                    ))}
                    <div className="my-1 border-t border-slate-100" />
                    <button onClick={() => { editor.chain().focus().unsetAllMarks().clearNodes().run(); setIsOpen(false); }} className="flex items-center justify-between w-full px-4 py-2 hover:bg-slate-50 text-slate-400 transition-colors">
                        <span className="text-sm">Clear formatting</span>
                        <span className="text-[10px] font-mono bg-slate-50 px-1 rounded">⌘\</span>
                    </button>
                </div>
            )}
        </div>
    );
};