// UploadedDocumentsDisplay.jsx
import React from 'react';
import { FileIcon, Download, FileImage, Trash2, User } from 'lucide-react'; // Added Trash2, User icons
import { formatFullDateTime } from "../../../../utils/date-util.js"; // Assuming this utility exists

const UploadedDocumentsDisplay = ({ documents }) => {

    // Helper function to determine file type for rendering
    const getFileType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
            return 'image';
        }
        if (extension === 'pdf') {
            return 'pdf';
        }
        return 'document'; // Default for other document types
    };

    // Placeholder for handleRemoveFile - actual implementation would come from parent/context
    const handleRemoveFile = (fileId) => {
        console.log(`Delete file with ID: ${fileId}`);
        // In a real scenario, this would trigger a state update in the parent
        // or a call to an API to remove the file.
        alert(`Simulating delete for file ID: ${fileId}`);
    };

    return (
        <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-[2rem] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2">
                <FileIcon size={16} className="text-[#5D4591]" /> {/* Changed from FileText to FileIcon for consistency */}
                <h4 className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest">Candidate Uploaded Documents</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Increased gap for better spacing */}
                {documents.map((doc, index) => {
                    const fileType = getFileType(doc.name);
                    const fileId = doc.fileId || `doc-${index}`; // Use fileId if available, otherwise index

                    return (
                        <div
                            key={fileId}
                            className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#5D4591]/20 transition-all duration-300"
                        >
                            <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                                <div className="transition-transform duration-500 group-hover:scale-110 w-full h-full flex items-center justify-center">
                                    {fileType === 'image' ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                            <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                                        </a>
                                    ) : fileType === 'pdf' ? (
                                        <FileIcon className="text-red-400/50" size={48} strokeWidth={1} />
                                    ) : (
                                        <FileIcon className="text-slate-300" size={48} strokeWidth={1} />
                                    )}
                                </div>

                                {/* Delete Button - positioned at top right */}
                                <button
                                    onClick={() => handleRemoveFile(fileId)} // Placeholder click handler
                                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all cursor-pointer"
                                    title="Delete Document"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="p-4 relative bg-white">
                                <div className="pr-10 space-y-1">
                                    {/* File Name */}
                                    <p className="text-[11px] font-bold text-slate-700 truncate" title={doc.name}>
                                        {doc.name}
                                    </p>

                                    {/* Upload Date */}
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {doc.proofUploadedAt ? formatFullDateTime(doc.proofUploadedAt) : 'N/A'}
                                    </p>

                                    {/* Uploaded By */}
                                    <div className="group/user relative w-fit">
                                        {/* Tooltip for Uploaded By */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-800 text-white text-[8px] font-black uppercase tracking-tighter rounded opacity-0 group-hover/user:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                            Uploaded By
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#5D4591] uppercase tracking-tighter truncate bg-[#5D4591]/5 px-1.5 py-0.5 rounded cursor-help transition-colors group-hover/user:bg-[#5D4591]/10">
                                            <User size={10} className="shrink-0" />
                                            <span className="truncate">{doc.proofUploadedBy || 'System'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Download Button - positioned at bottom right */}
                                <a
                                    href={doc.url}
                                    download={doc.name} // Add download attribute for direct download
                                    className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-[#5D4591] hover:bg-slate-50 rounded-full transition-all cursor-pointer"
                                    title="Download Document"
                                >
                                    <Download size={14} />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UploadedDocumentsDisplay;
