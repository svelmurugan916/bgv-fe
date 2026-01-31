import React from 'react';

const ContentDisplay = ({ htmlContent }) => {
    return (
        <div className="w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            {/*
          The 'prose' classes here MUST match the ones in your editor
          to ensure headings, tables, and code look the same.
      */}
            <div
                className={[
                    'prose prose-sm max-w-none text-slate-700 font-medium',
                    // Heading Styles
                    '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-slate-900',
                    '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-slate-900',
                    '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-slate-900',
                    '[&_h4]:text-lg [&_h4]:font-bold [&_h4]:mb-1 [&_h4]:text-slate-900',
                    '[&_h5]:text-sm [&_h5]:font-bold [&_h5]:mb-1 [&_h5]:text-slate-900',
                    '[&_h6]:text-xs [&_h6]:font-bold [&_h6]:uppercase [&_h6]:tracking-wider [&_h6]:mb-1 [&_h6]:text-slate-900',
                    // List styles
                    '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
                    // Code Block Styles
                    '[&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:my-4',
                    '[&_code]:bg-slate-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-[#5D4591]',
                    // Table Styles
                    '[&_table]:border-collapse [&_table]:table-fixed [&_table]:w-full [&_table]:my-4',
                    '[&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left [&_th]:font-bold',
                    '[&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_td]:align-top',
                ].join(' ')}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};

export default ContentDisplay;
