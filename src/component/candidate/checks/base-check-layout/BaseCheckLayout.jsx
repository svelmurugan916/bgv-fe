import React, {useEffect, useRef, useState} from 'react';
import {
    ShieldCheck,
    ShieldX,
    ShieldQuestion,
    Clock,
    ShieldAlertIcon,
    ClockIcon,
    InfoIcon, AlertCircleIcon
} from 'lucide-react';
import StatusActionDropdown from "../StatusActionDropdown.jsx";
import CheckAuditTrail from "./CheckAuditTrail.jsx";
import {useAuthApi} from "../../../../provider/AuthApiProvider.jsx";
import {GET_TASK_AUDIT_DETAILS, UPDATE_TASK_STAUS} from "../../../../constant/Endpoint.tsx";
import {METHOD, READ_ONLY_TASK_STATUS} from "../../../../constant/ApplicationConstant.js";
import AuditTrailSkeleton from "../loader/AuditTrailSkeleton.jsx";
import FeedbackForm from "./FeedbackForm.jsx";
import AuditIntelligence from "./AuditIntelligence.jsx";
import {formatFullDateTime} from "../../../../utils/date-util.js";
import EvidenceVault from "./EvidenceVault.jsx";
import AuditIntelligenceSkeleton from "../loader/AuditIntelligenceSkeleton.jsx";
import VerificationStatusLoader from "../loader/VerificationStatusLoader.jsx";

const BaseCheckLayout = ({
             title,
             description,
             checkId,
             onStatusUpdate,
             eyebrow,
             setIsEditModalOpen,
             badgeConfig, // { label: string, colorClass: string, icon: ReactNode }
             children,
             onStatusUpdateSuccess,
             isFundReleasedOrCancelled = false
     }) => {

    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();
    const [auditData, setAuditData] = useState({});
    const [isAuditLoading, setIsAuditLoading] = useState(true);
    const [status, setStatus] = useState(undefined);

    const fetchAuditDetails = async (taskId) => {
        try {
            setIsAuditLoading(true);
            const response = await authenticatedRequest(undefined, `${GET_TASK_AUDIT_DETAILS}/${taskId}`, METHOD.GET);
            if (response.status === 200) {
                setAuditData(response.data);
                setStatus(response.data?.status);
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
        'NEEDS_REVIEW': { bg: 'bg-violet-500', lightBg: 'bg-violet-50', text: 'text-violet-700', icon: <ShieldQuestion size={16} />, label: 'Manual Review Required' },
        'UNABLE_TO_VERIFY': { bg: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-700', icon: <ShieldQuestion size={16} />, label: 'Unable to Verify' },
        'FAILED': { bg: 'bg-red-500', lightBg: 'bg-red-50', text: 'text-red-700', icon: <ShieldAlertIcon size={16} />, label: 'Verification Failed' },
        'IN_PROGRESS': { bg: 'bg-blue-500', lightBg: 'bg-blue-50', text: 'text-blue-700', icon: <ClockIcon size={16} />, label: 'Verification In Progress' },
        'FUND_RELEASED': { bg: 'text-slate-600', lightBg: 'bg-slate-100', text: 'text-blue-700', icon: <AlertCircleIcon size={16} />, label: 'VERIFICATION HALTED' }
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
            console.error(error);
            // throw error;
        }
    }

    const onRemoveSuccess = (fileId) => {
        setAuditData(prevAuditData => {
            return {...prevAuditData, verificationProofDocuments:prevAuditData.verificationProofDocuments.filter(f => f.fileId !== fileId)};
        })
    }

    console.log("statusstatus -- ", status);
    const currentStatus = isFundReleasedOrCancelled ? statusConfig["FUND_RELEASED"] : (statusConfig[status] || { bg: 'bg-slate-400', lightBg: 'bg-slate-50', text: 'text-slate-600', icon: <Clock size={16} />, label: 'Verification Pending' });

    const isReadOnly = READ_ONLY_TASK_STATUS.includes(status?.toUpperCase());
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* COMMON: Top Status Banner */}
            {
                isAuditLoading ? <VerificationStatusLoader /> : (
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
                )
            }

            {/* COMMON: Header Section */}
            <div className="p-10 pb-8 border-b border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-1">
                        {/* Point 1: Eyebrow Layout */}
                        {eyebrow && (
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
                                {eyebrow}
                            </span>
                        )}

                        <div className="flex items-center gap-3">
                            {/* Main Title */}
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>

                            {/* Point 2: Anchored Status Badge */}
                            {badgeConfig && (
                                <div className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${badgeConfig.colorClass}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    {badgeConfig.label}
                                </div>
                            )}
                        </div>

                        {/* Point 4: Description with Protocol Icon */}
                        <div className="flex items-center gap-2 mt-2">
                            <InfoIcon size={14} className="text-slate-300" />
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">{description}</p>
                        </div>
                    </div>

                    {/* Point 3: Consolidated System Verdict & Dropdown */}
                    <div className="flex items-center gap-6 self-end md:self-auto">
                        {!isAuditLoading && (
                            <StatusActionDropdown
                                setIsEditModalOpen={setIsEditModalOpen}
                                onStatusChange={(status, notes) => onStatusChange(status, notes)}
                                currentStatus={status}
                                onStatusChangeSuccess={onStatusUpdateSuccess}
                            />
                        )}
                    </div>
                </div>
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
                                <EvidenceVault evidences={auditData.verificationProofDocuments} onRemoveSuccess={(fileId) => onRemoveSuccess(fileId)} isReadOnly={isReadOnly} />
                            )}
                        </>
                    }
                    {
                        (!isReadOnly) && (
                            <FeedbackForm taskId={checkId}
                                          onSuccessFileUpload={(data) => updateFileDataOnUploadSuccess(data)}
                                          onSuccessSubmitFeedback={(feedback) => updateFeedback(feedback)}/>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default BaseCheckLayout;
