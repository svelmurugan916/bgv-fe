import React, {useEffect, useRef, useState} from 'react';
import {ShieldCheck, ShieldX, ShieldQuestion, Clock, History, FileText, ShieldAlertIcon, ClockIcon} from 'lucide-react';
import StatusActionDropdown from "./StatusActionDropdown.jsx";
import CheckAuditTrail from "./CheckAuditTrail.jsx";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {GET_TASK_AUDIT_DETAILS, UPDATE_TASK_STAUS} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import AuditTrailSkeleton from "./loader/AuditTrailSkeleton.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import AuditIntelligence from "./AuditIntelligence.jsx";
import {formatFullDateTime} from "../../../utils/date-util.js";
import EvidenceVault from "./EvidenceVault.jsx";
import AuditIntelligenceSkeleton from "./loader/AuditIntelligenceSkeleton.jsx";

const BaseCheckLayout = ({
             title,
             description,
             status,
             checkId,
             onStatusUpdate,
             setIsEditModalOpen,
             badgeConfig, // { label: string, colorClass: string, icon: ReactNode }
             children
     }) => {

    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();
    const [auditData, setAuditData] = useState({});
    const [isAuditLoading, setIsAuditLoading] = useState(false);

    const fetchAuditDetails = async (taskId) => {
        try {
            setIsAuditLoading(true);
            const response = await authenticatedRequest(undefined, `${GET_TASK_AUDIT_DETAILS}/${taskId}`, METHOD.GET);
            if (response.status === 200) {
                setAuditData(response.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAuditLoading(false);
        }
    }
    useEffect(() => {
        if(!componentInitRef.current && checkId) {
            componentInitRef.current = true;
            fetchAuditDetails(checkId)
        }
    }, [checkId]);

    const statusConfig = {
        'CLEARED': { bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-700', icon: <ShieldCheck size={16} />, label: 'Verification Cleared' },
        'INSUFFICIENCY': { bg: 'bg-orange-500', lightBg: 'bg-orange-50', text: 'text-orange-700', icon: <ShieldX size={16} />, label: 'Source Stopper: Action Required' },
        'NEEDS_REVIEW': { bg: 'bg-orange-500', lightBg: 'bg-orange-50', text: 'text-orange-700', icon: <ShieldQuestion size={16} />, label: 'Manual Review Required' },
        'UNABLE_TO_VERIFY': { bg: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-700', icon: <ShieldQuestion size={16} />, label: 'Unable to Verify' },
        'FAILED': { bg: 'bg-red-500', lightBg: 'bg-red-50', text: 'text-red-700', icon: <ShieldAlertIcon size={16} />, label: 'Verification Failed' },
        'IN_PROGRESS': { bg: 'bg-yellow-500', lightBg: 'bg-yellow-50', text: 'text-yellow-700', icon: <ClockIcon size={16} />, label: 'Verification In Progress' }
    };

    const updateFeedback = (feedback) => {
        setAuditData(prevAuditData => {
            return {...prevAuditData, verifierNotes: feedback};
        })
    }

    const updateFileDataOnUploadSuccess = (data) => {
        setAuditData(prevAuditData => {
            return {...prevAuditData, verificationProofDocuments:[...prevAuditData.verificationProofDocuments, data]};
        })
    }

    const onStatusChange = async (status, notes) => {
        try {
            const payload = {
                taskId: checkId,
                status: status,
                verifierNotes: notes,
            }
            const response = await authenticatedRequest(payload, UPDATE_TASK_STAUS, METHOD.PUT);
            if (response.status !== 200) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Server Error");
            }
            console.log("calling ...... ");
            if(response.status === 200 && onStatusUpdate){
                onStatusUpdate();
            }
        } catch (error) {
            throw error;
        }
    }

    const currentStatus = statusConfig[status] || { bg: 'bg-slate-400', lightBg: 'bg-slate-50', text: 'text-slate-600', icon: <Clock size={16} />, label: 'Verification Pending' };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* COMMON: Top Status Banner */}
            <div className={`flex items-center justify-between px-8 py-3 ${currentStatus.lightBg} border-b border-slate-100`}>
                <div className={`flex items-center gap-2 ${currentStatus.text}`}>
                    {currentStatus.icon}
                    <span className="text-[11px] font-black uppercase tracking-[0.1em]">{currentStatus.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">System Verdict</span>
                    <div className={`w-2 h-2 rounded-full ${currentStatus.bg} shadow-sm`} />
                </div>
            </div>

            {/* COMMON: Header Section */}
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                        {badgeConfig && (
                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${badgeConfig.colorClass}`}>
                                {badgeConfig.icon}
                                {badgeConfig.label}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">{description}</p>
                </div>

                {status !== 'CLEARED' && (
                    <StatusActionDropdown
                        setIsEditModalOpen={setIsEditModalOpen}
                        onStatusChange={(status, notes) => onStatusChange(status, notes)}
                        currentStatus={status}
                    />
                )}
            </div>

            {/* SPECIFIC CONTENT: Grid and Evidence injected here */}
            {children}

            {/* COMMON: Audit and Feedback Footer */}
            <div className="p-8 border-t border-slate-100">
                <div className="space-y-8">
                    {
                        isAuditLoading ? <>
                            <AuditTrailSkeleton />
                            <AuditIntelligenceSkeleton />
                        </> : <>
                            <CheckAuditTrail data={auditData} checkId={checkId} />
                            <AuditIntelligence data={auditData} hasInsufficiency={true} formatFullDateTime={formatFullDateTime} isInsufficiencyCleared={false} />
                            {auditData?.verificationProofDocuments?.length > 0 && (
                                <EvidenceVault evidences={auditData.verificationProofDocuments}/>
                            )}
                        </>
                    }
                    <FeedbackForm taskId={checkId}
                                  onSuccessFileUpload={(data) => updateFileDataOnUploadSuccess(data)}
                                  onSuccessSubmitFeedback={(feedback) => updateFeedback(feedback)}/>
                </div>
            </div>
        </div>
    );
};

export default BaseCheckLayout;
