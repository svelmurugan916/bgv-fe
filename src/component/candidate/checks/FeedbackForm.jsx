import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, Loader2, CheckCircle2, AlertCircle, X,
    PaperclipIcon, Upload, File, Trash2, Check, CloudUpload
} from 'lucide-react';
import { useAuthApi } from "../../../provider/AuthApiProvider.jsx";
import { SUBMIT_TASK_FEEDBACK_DETAILS, UPLOAD_INTERNAL_PROOF } from "../../../constant/Endpoint.tsx"; // Added placeholder for upload endpoint
import { METHOD } from "../../../constant/ApplicationConstant.js";
import RichTextEditor from "../../text-editor/RichTextEditor.jsx";
import FileUploadModal from "./FileUploadModal.jsx";

const FeedbackForm = ({ taskId, onSuccessSubmitFeedback, onSuccessFileUpload }) => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // Modal State
    const { authenticatedRequest } = useAuthApi();

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            showNotification("Please add some remarks before submitting.", "error");
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = { taskId, feedback };
            const response = await authenticatedRequest(payload, SUBMIT_TASK_FEEDBACK_DETAILS, METHOD.POST);
            if (response.status === 200) {
                showNotification("Feedback submitted successfully!", "success");
                setFeedback('');
                onSuccessSubmitFeedback(feedback);
            }
        } catch (error) {
            showNotification("Could not save feedback. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {

    }, [isUploadModalOpen])

    return (
        <div className="relative">
            <FileUploadModal
                taskId={taskId}
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadComplete={() => showNotification("All files uploaded successfully!")}
                onSuccessFileUpload={onSuccessFileUpload}
            />

            {/* Toast Component (Same as before) */}
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 transition-all duration-500 ease-out ${
                toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
            }`}>
                <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border ${
                    toast.type === 'success' ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-900 border-rose-500/30'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                            {toast.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={20} /> : <AlertCircle className="text-rose-400" size={20} />}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{toast.type === 'success' ? 'System Success' : 'System Error'}</p>
                            <p className="text-sm font-medium text-white">{toast.message}</p>
                        </div>
                    </div>
                    <button onClick={() => setToast({ ...toast, show: false })} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"><X size={18} /></button>
                </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-[12px] p-8">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Verifier Remark</label>
                <RichTextEditor value={feedback} onChange={setFeedback} placeholder="Add detailed remarks..." />

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                    >
                        <PaperclipIcon size={16} className="text-[#5D4591]" /> Internal Proof
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#5D4591] text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#4a3675] transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
