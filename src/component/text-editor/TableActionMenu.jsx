import React, {useEffect, useRef, useState} from "react";
import {
    ChevronDown,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    Table as TableIcon,
    Trash2Icon
} from "lucide-react";

export const TableActionMenu = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor.isActive('table')) {
        return (
            <button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-all"
                title="Insert Table"
            >
                <TableIcon size={18} />
            </button>
        );
    }

    const tableActions = [
        { label: 'Add Row Above', icon: <ChevronUpIcon size={14} />, action: () => editor.chain().focus().addRowBefore().run() },
        { label: 'Add Row Below', icon: <ChevronDownIcon size={14} />, action: () => editor.chain().focus().addRowAfter().run() },
        { label: 'Delete Row', icon: <Trash2Icon size={14} />, action: () => editor.chain().focus().deleteRow().run() },
        { type: 'separator' },
        { label: 'Add Column Left', icon: <ChevronLeftIcon size={14} />, action: () => editor.chain().focus().addColumnBefore().run() },
        { label: 'Add Column Right', icon: <ChevronRightIcon size={14} />, action: () => editor.chain().focus().addColumnAfter().run() },
        { label: 'Delete Column', icon: <Trash2Icon size={14} />, action: () => editor.chain().focus().deleteColumn().run() },
        { type: 'separator' },
        { label: 'Delete Table', icon: <Trash2Icon size={14} className="text-red-500" />, action: () => editor.chain().focus().deleteTable().run() },
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 p-2 rounded-lg bg-[#5D4591]/10 text-[#5D4591] transition-all font-bold text-xs"
            >
                <TableIcon size={18} />
                <ChevronDown size={12} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 py-2 bg-white border border-slate-200 shadow-xl rounded-xl z-50 w-[180px]">
                    {tableActions.map((item, i) => (
                        item.type === 'separator' ? (
                            <div key={i} className="my-1 border-t border-slate-100" />
                        ) : (
                            <button
                                key={i}
                                onClick={() => { item.action(); setIsOpen(false); }}
                                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                                <span className="text-slate-400">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};