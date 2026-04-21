import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Loader2, FileText, Eye, Edit3 } from 'lucide-react';
import { useAuthApi } from "../../../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../../../constant/ApplicationConstant.js";
import RichTextEditor from "../../../text-editor/RichTextEditor.jsx";
import {useTenant} from "../../../../provider/TenantProvider.jsx";
import {SEND_VERIFICATION_MAIL_TO_HR} from "../../../../constant/Endpoint.tsx";

const SendHRMailModal = ({ isOpen, onClose, hrData, employmentData, documents, employmentId }) => {
    const { authenticatedRequest } = useAuthApi();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Toggle state

    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [attachDocs, setAttachDocs] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const {tenantConfig} = useTenant();

    useEffect(() => {
        if (isOpen && employmentData) {
            const company = employmentData?.fieldDetails?.companyName?.candidateEnteredData || "Company";
            const empId = employmentData?.fieldDetails?.employeeId?.candidateEnteredData || "N/A";

            setTo(hrData?.email || '');
            setCc(''); // Reset CC on open
            setSubject(`Employment Verification Request | ${company} | ID: ${empId}`);

            // Initialize the editor with just the greeting and intro paragraph
            const initialMessage = `
                <p>Dear <strong>${hrData?.name || 'HR Manager'}</strong>,</p>
                <p>Greetings from the Verification Team at <strong>${tenantConfig?.tenantName || "Trace-U"}</strong>.</p>
                <p>The following candidate has cited professional association with <strong>${company || "your organization"}</strong>. Please complete the verification form below by confirming the claimed details and providing the requested separation data.</p>
            `;
            setContent(initialMessage);
            setSelectedFiles(documents || []);
            setIsEditing(false); // Reset to Preview mode on open
        }
    }, [isOpen, hrData, employmentData, documents, tenantConfig]);

    const getFinalHtmlBody = (userMessage) => {
        const company = employmentData?.fieldDetails?.companyName?.candidateEnteredData || "Company";
        const empId = employmentData?.fieldDetails?.employeeId?.candidateEnteredData || "N/A";
        const designation = employmentData?.fieldDetails?.designation?.candidateEnteredData || "N/A";
        const doj = employmentData?.fieldDetails?.joiningDate?.candidateEnteredData || "N/A";
        const dor = employmentData?.currentEmployer ? "Currently working" : (employmentData?.fieldDetails?.relivingDate?.candidateEnteredData || "N/A");

        return `
<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; max-width: 750px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
    <div style="background-color: #5D4591; padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 5px; font-weight: 900;">Employment Verification Form</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Reference ID: VER-${employmentId || 'REQ-001'}</p>
    </div>

    <div style="padding: 40px 50px;">
        ${userMessage}

        <div style="margin-top: 30px; margin-bottom: 10px;">
            <h3 style="font-size: 11px; font-weight: 900; color: #5D4591; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; border-left: 4px solid #5D4591; padding-left: 10px;">Part A: Employment Details</h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 1px solid #f1f5f9;">
            <thead>
                <tr style="background-color: #f8fafc;">
                    <th style="padding: 15px; text-align: left; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; width: 30%;">Attribute</th>
                    <th style="padding: 15px; text-align: left; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; width: 35%;">Candidate Claimed</th>
                    <th style="padding: 15px; text-align: left; font-size: 10px; font-weight: 900; color: #5D4591; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; width: 35%;">HR Verification / Answer</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 15px; font-size: 12px; font-weight: 700; color: #64748b;">Designation</td>
                    <td style="padding: 15px; font-size: 13px; font-weight: 700; color: #1e293b;">${designation}</td>
                    <td style="padding: 15px; border-left: 1px solid #f1f5f9; color: #cbd5e1;">______________________</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 15px; font-size: 12px; font-weight: 700; color: #64748b;">Employee ID</td>
                    <td style="padding: 15px; font-size: 13px; font-weight: 700; color: #1e293b;">${empId}</td>
                    <td style="padding: 15px; border-left: 1px solid #f1f5f9; color: #cbd5e1;">______________________</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 15px; font-size: 12px; font-weight: 700; color: #64748b;">Joining Date</td>
                    <td style="padding: 15px; font-size: 13px; font-weight: 700; color: #1e293b;">${doj}</td>
                    <td style="padding: 15px; border-left: 1px solid #f1f5f9; color: #cbd5e1;">______________________</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 15px; font-size: 12px; font-weight: 700; color: #64748b;">Relieving Date</td>
                    <td style="padding: 15px; font-size: 13px; font-weight: 700; color: #1e293b;">${dor}</td>
                    <td style="padding: 15px; border-left: 1px solid #f1f5f9; color: #cbd5e1;">______________________</td>
                </tr>
                <tr>
                    <td style="padding: 15px; font-size: 12px; font-weight: 700; color: #64748b;">Last Salary (Monthly)</td>
                    <td style="padding: 15px; font-size: 12px; font-style: italic; color: #94a3b8;">Not Provided</td>
                    <td style="padding: 15px; border-left: 1px solid #f1f5f9; color: #cbd5e1;">______________________</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 40px; margin-bottom: 10px;">
            <h3 style="font-size: 11px; font-weight: 900; color: #5D4591; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; border-left: 4px solid #5D4591; padding-left: 10px;">Part B: Separation Analysis</h3>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px;">
            <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase;">1. Method of Exit (Please mark 'X' for one):</p>
            <table style="width: 100%; font-size: 11px; color: #64748b; font-weight: 700;">
                <tr>
                    <td style="padding: 5px 0;">[ ] RESIGNED</td>
                    <td style="padding: 5px 0;">[ ] TERMINATED</td>
                    <td style="padding: 5px 0;">[ ] ABSCONDED</td>
                    <td style="padding: 5px 0;">[ ] ASKED TO LEAVE</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0;">[ ] LAYOFF</td>
                    <td style="padding: 5px 0;">[ ] RETIRED</td>
                    <td style="padding: 5px 0;">[ ] INTERNSHIP ENDED</td>
                    <td style="padding: 5px 0;">[ ] CONTRACT ENDED</td>
                </tr>
            </table>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <div style="display: flex; margin-bottom: 20px;">
                <div style="width: 50%;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">2. Eligible for Re-hire?</p>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">[ ] YES &nbsp;&nbsp; [ ] NO</p>
                </div>
            </div>
            <p style="margin: 20px 0 8px 0; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">3. Exit Reason / HR Remarks:</p>
            <div style="height: 60px; border-bottom: 1px solid #cbd5e1; width: 100%;"></div>
        </div>

        <div style="background-color: #fff7ed; border-radius: 12px; padding: 20px; margin-top: 40px; border: 1px solid #ffedd5;">
            <p style="margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6;">
                <strong>Note to HR:</strong> This information is strictly for background screening purposes. Please provide accurate data to ensure a fair assessment of the candidate.
            </p>
        </div>

        <div style="margin-top: 40px;">
            <p style="font-size: 13px; color: #94A3B8; margin-bottom: 5px;">Regards,</p>
            <p style="margin: 0; font-size: 16px; font-weight: 900; color: #5D4591; text-transform: uppercase; letter-spacing: 1px;">
                ${tenantConfig?.tenantName || "Trace-U"} Verification Team
            </p>
        </div>
    </div>
    <div style="background-color: #F8FAFC; padding: 20px; text-align: center; border-top: 1px solid #F1F5F9;">
        <p style="margin: 0; font-size: 10px; color: #CBD5E1; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
            Strictly Confidential | Employment Audit Document
        </p>
    </div>
</div>`;
    };

    const handleSend = async () => {
        setLoading(true);
        const finalHtmlBody = getFinalHtmlBody(content);
        const payload = {
            to,
            cc,
            subject,
            body: finalHtmlBody,
            attachments: attachDocs ? selectedFiles.map(f => f.fileId) : []
        };

        try {
            const response = await authenticatedRequest(payload, `${SEND_VERIFICATION_MAIL_TO_HR}/${employmentId}`, METHOD.POST);
            if (response.status === 200) onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in duration-300">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5D4591] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D4591]/20"><Mail size={20} /></div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Send Verification Mail</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target: {hrData?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Input Fields Grid */}
                    <div className="space-y-4">
                        {/* Row 1: Recipient and CC */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Recipient</label>
                                <input
                                    value={to}
                                    onChange={e => setTo(e.target.value)}
                                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:ring-2 ring-[#5D4591]/10 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">CC (Optional)</label>
                                <input
                                    value={cc}
                                    onChange={e => setCc(e.target.value)}
                                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:ring-2 ring-[#5D4591]/10 outline-none"
                                    placeholder="hr.head@company.com"
                                />
                            </div>
                        </div>

                        {/* Row 2: Subject (Full Width) */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subject</label>
                            <input
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:ring-2 ring-[#5D4591]/10 outline-none"
                            />
                        </div>
                    </div>

                    {/* Toggle Content Area */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">
                                {isEditing ? "Modify Message Body" : "Email Preview"}
                            </label>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5D4591]/5 hover:bg-[#5D4591]/10 text-[#5D4591] border border-[#5D4591]/20 transition-all cursor-pointer"
                            >
                                {isEditing ? (
                                    <><Eye size={14} /><span className="text-[10px] font-black uppercase">View Preview</span></>
                                ) : (
                                    <><Edit3 size={14} /><span className="text-[10px] font-black uppercase">Modify Message</span></>
                                )}
                            </button>
                        </div>

                        <div className="min-h-[400px]">
                            {isEditing ? (
                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                    <RichTextEditor value={content} onChange={setContent} />
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div dangerouslySetInnerHTML={{ __html: getFinalHtmlBody(content) }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group w-fit">
                            <input type="checkbox" checked={attachDocs} onChange={e => setAttachDocs(e.target.checked)} className="w-5 h-5 accent-[#5D4591]" />
                            <span className="text-xs font-black uppercase text-slate-600 group-hover:text-[#5D4591] transition-colors">Attach Employer Documents</span>
                        </label>

                        {attachDocs && (
                            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                                {selectedFiles.map(file => (
                                    <div key={file.fileId} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-3 truncate">
                                            <FileText size={16} className="text-[#5D4591]" />
                                            <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                                        </div>
                                        <button onClick={() => setSelectedFiles(prev => prev.filter(f => f.fileId !== file.fileId))} className="text-slate-400 hover:text-rose-500 cursor-pointer"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-400 hover:bg-slate-100 transition-all cursor-pointer">Discard</button>
                    <button onClick={handleSend} disabled={loading} className="flex items-center gap-3 px-10 py-3 rounded-xl font-bold text-xs uppercase bg-[#5D4591] text-white shadow-xl shadow-[#5D4591]/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Send Verification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendHRMailModal;
