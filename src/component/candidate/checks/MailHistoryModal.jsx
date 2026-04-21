import React, { useState, useEffect } from 'react';
import {X, Mail, Clock, User, Paperclip, ChevronRight, Search, Inbox, FileTextIcon} from 'lucide-react';
import {HR_MAIL_HISTORY} from "../../../constant/Endpoint.tsx";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";

const MailHistoryModal = ({ isOpen, onClose, employmentId, allDocuments }) => {
    const { authenticatedRequest } = useAuthApi();
    const [loading, setLoading] = useState(true);
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchMailHistory();
        }
    }, [isOpen]);

    const fetchMailHistory = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${HR_MAIL_HISTORY}/${employmentId}`, METHOD.GET);
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                setEmails(data);
                if (data.length > 0) setSelectedEmail(data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch mail history", err);
        } finally {
            setLoading(false);
        }
    };

    const getAttachments = (ids) => {
        if (!ids || !allDocuments) return [];
        return allDocuments.filter(doc => ids.includes(fileId));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in duration-300">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5D4591]/10 rounded-xl flex items-center justify-center text-[#5D4591]">
                            <Inbox size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Verification Outreach History</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Communication Audit Log</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 flex overflow-hidden bg-slate-50/30">
                    {/* Left Sidebar: Mail List */}
                    <div className="w-[380px] border-r border-slate-100 bg-white flex flex-col">
                        <div className="px-6 py-3 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outreach History</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#5D4591]/5 rounded-full border border-[#5D4591]/10">
                                <span className="text-[10px] font-black text-[#5D4591]">
                                    {loading ? "..." : emails.length} Sent
                                </span>
                            </div>
                        </div>


                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="space-y-2 animate-pulse">
                                            <div className="h-3 w-24 bg-slate-100 rounded" />
                                            <div className="h-4 w-full bg-slate-100 rounded" />
                                            <div className="h-3 w-40 bg-slate-50 rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : emails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                                    <Mail size={32} className="mb-2 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No emails sent yet</p>
                                </div>
                            ) : (
                                emails.map((email) => (
                                    <div
                                        key={email.id}
                                        onClick={() => setSelectedEmail(email)}
                                        className={`p-5 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 group relative ${selectedEmail?.id === email.id ? 'bg-[#F9F7FF]' : ''}`}
                                    >
                                        {selectedEmail?.id === email.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5D4591]" />}
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-black text-[#5D4591] uppercase truncate pr-4">{email.toEmail}</span>
                                            <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                                                {new Date(email.sentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <h4 className={`text-xs font-bold truncate mb-1 ${selectedEmail?.id === email.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {email.subject}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 line-clamp-1 font-medium italic">
                                            Sent by: {email.sentByUserName}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Mail View */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        {loading ? (
                            <div className="p-10 space-y-6">
                                <div className="h-8 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
                                <div className="h-20 w-full bg-slate-50 rounded-2xl animate-pulse" />
                                <div className="space-y-3 pt-10">
                                    <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                                    <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-slate-50 rounded animate-pulse" />
                                </div>
                            </div>
                        ) : selectedEmail ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Mail Header */}
                                <div className="p-8 border-b border-slate-100">
                                    <h2 className="text-xl font-black text-slate-900 mb-6 leading-tight">{selectedEmail.subject}</h2>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-900">Trace-U Verification Team</span>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">From</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                    <span>To: {selectedEmail.toEmail}</span>
                                                    {selectedEmail.ccEmail && <span>• CC: {selectedEmail.ccEmail}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sent Date</p>
                                            <p className="text-xs font-black text-slate-700">
                                                {new Date(selectedEmail.sentAt).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mail Body */}
                                {/* Email Content Area - Scrollable */}
                                <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
                                    <div className="max-w-[850px] mx-auto">

                                        {/* THE EMAIL CARD */}
                                        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]  border border-slate-200/60 overflow-hidden min-h-[600px]">

                                            {/* Scoped Reset Styles for the Preview */}
                                            <style>{`
                .email-body-container {
                    padding: 30px !important; /* Large internal padding for the 'Letter' look */
                    color: #334155 !important;
                    line-height: 1.7 !important;
                }
                .email-body-container table { 
                    border-collapse: collapse !important; 
                    width: 100% !important; 
                    margin: 30px 0 !important; 
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }
                .email-body-container td { 
                    border: 1px solid #f1f5f9 !important; 
                    padding: 16px 20px !important;
                    vertical-align: top !important;
                }
                .email-body-container strong {
                    color: #1e293b !important;
                    font-weight: 700 !important;
                }
                .email-body-container h2 {
                    margin-top: 0 !important;
                    font-size: 24px !important;
                    font-weight: 900 !important;
                    color: #5D4591 !important;
                }
                /* Target the purple header if it exists as a div */
                .email-body-container div[style*="background-color: #5D4591"] {
                    margin: -60px -60px 40px -60px !important; /* Negative margin to make header bleed to edges */
                    padding: 40px !important;
                }
            `}</style>

                                            <div
                                                className=""
                                                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                                            />
                                        </div>

                                        {/* Attachments Section - Placed with same alignment as the card */}
                                        {selectedEmail.attachmentDocumentIds?.length > 0 && (
                                            <div className="mt-12 mb-10 px-4">
                                                <div className="flex items-center gap-2 text-slate-400 mb-5">
                                                    <Paperclip size={14} className="text-[#5D4591]" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Attachments sent ({selectedEmail.attachmentDocumentIds.length})</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {allDocuments?.filter(d => selectedEmail.attachmentDocumentIds.includes(d.fileId)).map(file => (
                                                        <a
                                                            key={file.fileId}
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-4 p-5 bg-white border border-slate-200/60 rounded-[1.5rem] hover:border-[#5D4591] hover:shadow-xl transition-all group"
                                                        >
                                                            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#5D4591]/10 text-slate-400 group-hover:text-[#5D4591] transition-colors">
                                                                <FileTextIcon size={20} />
                                                            </div>
                                                            <div className="flex flex-col truncate">
                                                                <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">View Document</span>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                                <Mail size={64} strokeWidth={1} className="mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-[0.2em]">Select an email to preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailHistoryModal;
