import React, {useEffect} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold, Italic, List, ListOrdered,
    Undo, Redo
} from 'lucide-react';

import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {HeadingPicker} from "./HeadingPicker.jsx";
import {TableActionMenu} from "./TableActionMenu.jsx";
import {ColorPicker} from "./ColorPicker.jsx";
import {MoreMenu} from "./MoreMenu.jsx";

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const btnClass = (active) => `
        p-2 rounded-lg transition-all
        ${active ? 'bg-[#5D4591]/10 text-[#5D4591]' : 'text-slate-600 hover:bg-slate-100'}
    `;

    return (
        <div className="flex items-center flex-wrap gap-1 p-1.5 border-b border-slate-200 bg-white">
            <HeadingPicker editor={editor} />
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
                <Bold size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
                <Italic size={18} />
            </button>

            <MoreMenu editor={editor} />

            <div className="w-px h-6 bg-slate-200 mx-1" />
            <ColorPicker editor={editor} />

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <TableActionMenu editor={editor} />

            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet List">
                <List size={18} />
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Ordered List">
                <ListOrdered size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Undo">
                <Undo size={18} />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Redo">
                <Redo size={18} />
            </button>
        </div>
    );
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            Subscript,
            Superscript,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: placeholder || 'Enter verifier remarks...',
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const isReallyEmpty = editor.getText().trim().length === 0;
            onChange(isReallyEmpty ? "" : html);
        },
        editorProps: {
            attributes: {
                class: [
                    'prose prose-sm max-w-none p-6 focus:outline-none min-h-[200px] text-slate-700 font-medium',
                    '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-slate-900',
                    '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-slate-900',
                    '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-slate-900',
                    '[&_h4]:text-lg [&_h4]:font-bold [&_h4]:mb-1 [&_h4]:text-slate-900',
                    '[&_h5]:text-sm [&_h5]:font-bold [&_h5]:mb-1 [&_h5]:text-slate-900',
                    '[&_h6]:text-xs [&_h6]:font-bold [&_h6]:uppercase [&_h6]:tracking-wider [&_h6]:mb-1 [&_h6]:text-slate-900',
                    '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
                    '[&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:my-4',
                    '[&_code]:bg-slate-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-[#5D4591]',
                    '[&_table]:border-collapse [&_table]:table-fixed [&_table]:w-full [&_table]:my-4',
                    '[&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left [&_th]:font-bold',
                    '[&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_td]:align-top',
                    '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
                    '[&_.is-editor-empty:first-child::before]:text-slate-400',
                    '[&_.is-editor-empty:first-child::before]:float-left',
                    '[&_.is-editor-empty:first-child::before]:pointer-events-none',
                    '[&_.is-editor-empty:first-child::before]:h-0'
                ].join(' '),
            },
        },
    });

    useEffect(() => {
        if (!editor) return;

        // Check if the external value (prop) is different from the internal editor content
        const currentEditorContent = editor.getHTML();

        // We handle the empty string case specifically to ensure it clears
        if (value === "" && currentEditorContent !== "<p></p>") {
            editor.commands.setContent("");
        }
        // Also handle cases where value is updated externally to something else
        else if (value !== undefined && value !== currentEditorContent && value !== "") {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm focus-within:ring-2 focus-within:ring-[#5D4591]/10 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;
