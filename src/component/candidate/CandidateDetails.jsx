import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import {
    ChevronRightIcon, AlertTriangle, TimerIcon, GraduationCap, HistoryIcon, ShieldAlertIcon
} from 'lucide-react';
import CriminalCheck from './checks/criminal-check/CriminalCheck.jsx';
import { useParams } from "react-router-dom";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    DELETE_CANDIDATE_PII,
    DOWNLOAD_CANDIDATE_REPORT,
    GET_CANDIDATE_DETAILS,
    MARK_CANDIDATE_AS_STOP_CASE,
    RESUME_CANDIDATE_STATUS
} from "../../constant/Endpoint.tsx";
import {METHOD, TASK_COMPLETED_STATUS} from "../../constant/ApplicationConstant.js";
import SimpleLoader from "../common/SimpleLoader.jsx";
import CandidateStatusLabel from "./CandidateStatusLabel.jsx";
import CandidateDetailsPageHeaderLoader from "./CandidateDetailsPageHeaderLoader.jsx";
import CheckAddress from "./checks/address-check/CheckAddress.jsx";
import CaseActionDropdown from "./CaseActionDropdown.jsx";
import EditAddressModal from "./checks/address-check/EditAddressModal.jsx";
import CandidateCheckIconStatus from "../common/CandidateCheckIconStatus.jsx";
import CheckEducation from "./checks/education-check/CheckEducation.jsx";
import CheckExperience from "./checks/employement-check/CheckExperience.jsx";
import CheckDatabase from "./checks/CheckDatabase.jsx";
import CheckIdentity from "./checks/identity-check/CheckIdentity.jsx";
import CheckReferences from "./checks/CheckReferences.jsx";
import CandidateChecksTab from "./CandidateChecksTab.jsx";
import CaseTimelineTabContent from "./timeline/Timeline.jsx";
import IDVerificationModal from "./checks/identity-check/IDVerificationModal.jsx";
import CandidateNotFound from "./CandidateNotFound.jsx";
import DpdpWipedPlaceholder from "./DpdpWipedPlaceholder.jsx";
import DeleteCandidateModal from "./DeleteCandidateModal.jsx";
import TaskReservationDrawer from "../transaction/TaskReservationDrawer.jsx";

const CandidateShow = () => {
    const [activeTab, setActiveTab] = useState(null);
    const { id } = useParams();
    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();
    const [candidateData, setCandidateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isIDModalOpen, setIsIDModalOpen] = useState(false);
    const [selectedIDDocumentType, setSelectedIDDocumentType] = useState(null);
    const [taskTypes, setTaskTypes] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [caseBillingStatus, setCaseBillingStatus] = useState(undefined);

    const handleOpenIDVerificationModal = (docType) => {
        setSelectedIDDocumentType(docType);
        setIsIDModalOpen(true);
    };

    const handleCloseIDVerificationModal = () => {
        setIsIDModalOpen(false);
        setSelectedIDDocumentType(null);
    };

    const tabsRef = useRef({});
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const activeElement = tabsRef.current[activeTab];
        if (activeElement) {
            setIndicatorStyle({
                left: activeElement.offsetLeft,
                width: activeElement.offsetWidth
            });
        }
    }, [activeTab, loading]);

    const handleDeleteCandidateData = async () => {
        // Assuming DELETE_CANDIDATE_PII is defined in your constants
        const response = await authenticatedRequest(
            { reason: "Manual deletion requested by Admin" },
            `${DELETE_CANDIDATE_PII}/${id}`,
            METHOD.DELETE
        );

        if (response.status !== 200) {
            throw new Error(response.message || "Deletion failed");
        }
        return response;
    };

    const handleDownloadReport = async () => {
        const candidateId = candidateData?.caseDetails?.candidateId;
        if (!candidateId) return;
        setIsDownloading(true);
        try {
            const downloadUrl = `${DOWNLOAD_CANDIDATE_REPORT}/${candidateId}`;
            const response = await authenticatedRequest(null, downloadUrl, METHOD.GET, {
                responseType: 'blob'
            });

            const blob = response.data ? response.data : response;

            if (!(blob instanceof Blob)) {
                console.error("The response is not a blob.");
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', candidateId || 'document');
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setIsDownloading(null);
        }
    };

    const handleToggleCaseStatus = async () => {
        try {
            const response = await authenticatedRequest({}, `${consolidatedData.status === 'STOP_CASE' ? RESUME_CANDIDATE_STATUS : MARK_CANDIDATE_AS_STOP_CASE}/${candidateData.candidateInfo?.candidateId}`, METHOD.PATCH);
            if(response.status === 200) {
                await fetchCandidateDetails();
            }
            return response;
        } catch (err) {
            console.error("Download failed:", err);
            console.log('error response ; ',  err.response);
            throw err;
        }
    }

    const onSuccess = () => {
        fetchCandidateDetails();
    }

    const fetchCandidateDetails = async () => {
        setLoading(true);
        try {
            const response = await authenticatedRequest({}, `${GET_CANDIDATE_DETAILS}/${id}`, METHOD.GET);
            if (response.status === 200) {
                setCandidateData(response.data);
                const caseDetails = response.data?.caseDetails;
                setCaseBillingStatus(response.data?.candidateInfo?.caseBillingStatus)
                const taskTypes = caseDetails?.checks?.map(c => c.taskName);
                setTaskTypes(taskTypes);
                console.log(taskTypes);
                setMetrics({
                    totalChecks: caseDetails?.totalChecks,
                    inProgressChecks: caseDetails?.inProgressChecks,
                    unableToVerify: caseDetails?.unableToVerify,
                    failedCount: caseDetails?.failedCount,
                    clearedChecks: caseDetails?.clearedChecks,
                    insufficientChecks: caseDetails?.insufficientChecks,
                    progressPercentage: caseDetails?.progressPercentage,
                })
                if (response.data?.caseDetails?.checks?.length > 0) {
                    setActiveTab(response.data.caseDetails.checks[0].taskId);
                }
            } else if (response.status === 404) {
                setNotFound(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchCandidateDetails();
        }
    }, [id]);

    const consolidatedData = useMemo(() => {
        if(candidateData) {
            return {
                caseNo: candidateData.candidateInfo.caseNo,
                name: candidateData.candidateInfo.name,
                client: candidateData.candidateInfo.client,
                package: candidateData.candidateInfo.packageName,
                initiatedDate: candidateData.candidateInfo.initiatedDate,
                dueDate: candidateData.candidateInfo.dueDate || 'TBD',
                status: candidateData.caseDetails.status,
                checks: candidateData?.caseDetails?.checks,
                isSlaBreached: candidateData?.candidateInfo?.isSlaBreached,
                totalTatHours: candidateData?.candidateInfo?.totalTatHours,
                isWiped: false,
                wipedAt: "2026-03-26",
                wipeReason: "Data has been deleted as per the DPDP Act"
            };
        }
        return {};
    }, [candidateData]);

    const formatHourDuration = (hours) => {
        if (hours < 1 && hours >= 0) return "< 1 hr";
        const parts = [];
        const days = Math.floor(hours / 24);
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours % 24 > 0) parts.push(`${hours % 24} hr${hours % 24 > 1 ? 's' : ''}`);
        return parts.join(', ');
    }

    if (notFound) {
        return <CandidateNotFound id={id} />;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] animate-in fade-in duration-500">
            <div className="bg-white px-4 sm:px-8 pt-6 border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto">
                    {loading ? <CandidateDetailsPageHeaderLoader /> : (
                        <>
                            {/* 1. BREADCRUMBS */}
                            {/* Add this block in CandidateShow.jsx */}
                            {caseBillingStatus === 'INSUFFICIENT_FUNDS' && (
                                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[1.5rem] flex items-center justify-between animate-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                            <ShieldAlertIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-none mb-1.5">
                                                Funding Exception
                                            </p>
                                            <p className="text-xs font-bold text-amber-700/90 leading-relaxed">
                                                Insufficient funds in the wallet. The fund allocation for this case has been paused. Please top up your account to resume verification.
                                            </p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 bg-amber-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 active:scale-95">
                                        Add Funds
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400 cursor-pointer hover:text-[#5D4591]" onClick={() => window.history.back()}>Candidates</span>
                                    <ChevronRightIcon size={12} className="text-slate-300" />
                                    <span className="text-[#5D4591]">{consolidatedData?.caseNo}</span>
                                </div>
                                {consolidatedData.isWiped && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 animate-pulse">
                                        <ShieldAlertIcon size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">PII Purged (DPDP Compliant)</span>
                                    </div>
                                )}
                            </div>

                            {/* 2. TITLE & METRICS ROW - Fixed for Resolutions */}
                            <div className="flex flex-wrap items-start lg:items-center justify-between gap-6 mb-8">
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold text-slate-900 tabular-nums">{consolidatedData?.caseNo}</span>
                                        <div className="w-[1px] h-6 bg-slate-200" />
                                        <h1 className={`text-2xl font-bold tracking-tight ${consolidatedData.isWiped ? 'text-slate-400 italic' : 'text-slate-900'}`}>
                                            {consolidatedData.isWiped ? "Data Purged (DPDP)" : consolidatedData?.name}
                                        </h1>
                                    </div>

                                    {consolidatedData.isWiped && (
                                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                            <HistoryIcon size={14} className="text-slate-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Wiped On</span>
                                                <span className="text-xs font-bold text-slate-600">{consolidatedData.wipedAt}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6">
                                        <div className="hidden lg:block w-[1px] h-6 bg-slate-200" />
                                        <div className="flex items-center gap-1 shrink-0">
                                            <CandidateCheckIconStatus checks={consolidatedData?.checks} candidateStatus={candidateData?.caseDetails?.status} />
                                        </div>
                                    </div>

                                    {(consolidatedData?.totalTatHours !== undefined && consolidatedData?.totalTatHours >= 0) && (
                                        <div className="flex items-center gap-4 lg:pl-6 lg:border-l lg:border-slate-200">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Turnaround</p>
                                                <div className="flex items-center gap-2">
                                                    {consolidatedData?.isSlaBreached ? (
                                                        <AlertTriangle size={12} className="animate-pulse text-rose-600" />
                                                    ) : (
                                                        <TimerIcon size={12} className={"text-emerald-600"}/>
                                                    )}
                                                    <span className={`text-xs font-bold tabular-nums ${consolidatedData?.isSlaBreached ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {formatHourDuration(consolidatedData?.totalTatHours)}
                                                    </span>
                                                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                        consolidatedData?.isSlaBreached ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {consolidatedData?.isSlaBreached ? 'Breached' : 'On Track'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1.5 lg:pl-6 lg:border-l lg:border-slate-200">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[9px] font-black text-[#5D4591] uppercase tracking-widest">Case Health</span>
                                            <span className="text-[9px] font-black text-emerald-500">{metrics?.progressPercentage}% Complete</span>
                                        </div>
                                        <div className="flex h-2 w-64 bg-slate-100 rounded-full overflow-visible items-center">
                                            <HealthSegment count={metrics?.clearedChecks} total={metrics?.totalChecks} color="bg-emerald-500" label="Cleared" />
                                            <HealthSegment count={metrics?.inProgressChecks} total={metrics?.totalChecks} color="bg-blue-400" label="In Progress" />
                                            <HealthSegment count={metrics?.insufficientChecks} total={metrics?.totalChecks} color="bg-orange-500" label="Insufficient" />
                                            <HealthSegment count={metrics?.unableToVerify} total={metrics?.totalChecks} color="bg-amber-400" label="Unable to Verify" />
                                            <HealthSegment count={metrics?.failedCount} total={metrics?.totalChecks} color="bg-red-600" label="Failed" />
                                        </div>
                                    </div>

                                </div>

                                {!consolidatedData.isWiped && (
                                    <div className="shrink-0 ml-auto lg:ml-0">
                                        <CaseActionDropdown setIsCreateModalOpen={setIsCreateModalOpen} handeStopCaseClick={handleToggleCaseStatus}
                                                            candidateStatus={consolidatedData?.status} handleDownloadReport={handleDownloadReport} isDownloading={isDownloading}
                                                            onOpenIDVerificationModal={handleOpenIDVerificationModal} taskTypes={taskTypes} disableStopCase={TASK_COMPLETED_STATUS.includes(candidateData?.caseDetails?.taskStatus?.toUpperCase())}
                                                            onDeleteClick={() => setIsDeleteModalOpen(true)}
                                        />
                                    </div>
                                )}

                            </div>

                            {/* 3. ATTRIBUTES - Responsive Gaps */}
                            <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-12 gap-y-6 mb-8">
                                <CandidateStatusLabel label={"Overall Status"} status={consolidatedData?.status} />
                                <Attribute label="Organization" value={consolidatedData?.client} />
                                <Attribute label="Check Pack" value={consolidatedData?.package} />
                                <Attribute label="init Date" value={consolidatedData?.initiatedDate} />
                                <Attribute label={`${(consolidatedData?.status === "GREEN") ? "Completed Date" : consolidatedData.status === 'STOP_CASE' ? 'Case Stopped at' : "Due Date"}`} value={consolidatedData?.dueDate || 'TBD'}/>
                            </div>

                            {/* 4. NAVIGATION TABS */}
                            <CandidateChecksTab caseDetails={candidateData?.caseDetails} indicatorStyle={indicatorStyle}
                                                tabsRef={tabsRef} activeTab={activeTab} setActiveTab={setActiveTab} consolidatedData={consolidatedData} />
                        </>
                    )}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="max-w-[1600px] mx-auto py-4">
                {loading ? <SimpleLoader size="lg" className="py-20" /> : (
                    consolidatedData.isWiped ? (
                        <>
                        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                            <DpdpWipedPlaceholder
                                reason={consolidatedData.wipeReason}
                                date={consolidatedData.wipedAt}
                                checkType={candidateData?.caseDetails?.checks.find(c => c.taskId === activeTab)?.taskName}
                            />
                        </div>
                        </>
                        ) : (
                            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                                {(() => {
                                    const activeCheck = candidateData?.caseDetails?.checks.find(c => c.taskId === activeTab);
                                    switch (activeCheck?.taskName) {
                                        case 'address':
                                            return <CheckAddress addressId={activeCheck.taskId} caseStatus={consolidatedData.status} caseBillingStatus={caseBillingStatus}/>;
                                        case 'education':
                                            return <CheckEducation educationId={activeCheck.taskId} caseStatus={consolidatedData.status}/>
                                        case 'employment':
                                            return <CheckExperience employmentId={activeCheck.taskId} caseStatus={consolidatedData.status}/>
                                        case 'criminal':
                                            return <CriminalCheck taskId={activeCheck.taskId} caseStatus={consolidatedData.status} caseBillingStatus={caseBillingStatus}/>
                                        case 'database':
                                            return <CheckDatabase taskId={activeCheck.taskId} caseStatus={consolidatedData.status}/>
                                        case 'identity':
                                        case 'aadhaar':
                                        case 'pan':
                                        case 'passport':
                                            return <CheckIdentity taskId={activeCheck.taskId}  caseStatus={consolidatedData.status} />
                                        case 'reference':
                                            return <CheckReferences taskId={activeCheck.taskId}  caseStatus={consolidatedData.status} />
                                        default:
                                            return <CaseTimelineTabContent candidateId={candidateData?.caseDetails?.candidateId} />;
                                    }

                                })()}
                            </div>
                    )
                )}
            </div>
            <EditAddressModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                candidateId={candidateData?.caseDetails?.candidateId}
                onUpdateSuccess={(payload) => onSuccess(payload)}
            />

            <IDVerificationModal
                isOpen={isIDModalOpen}
                onClose={handleCloseIDVerificationModal}
                documentType={selectedIDDocumentType}
                candidateId={candidateData?.caseDetails?.candidateId}
                onUpdateSuccess={(payload) => onSuccess(payload)}

            />

            <DeleteCandidateModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                caseNo={consolidatedData?.caseNo}
                onDeleteConfirm={handleDeleteCandidateData}
            />
        </div>
    );
};

const Attribute = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold truncate max-w-[150px]">{label}</span>
        <span className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight" title={value}>{value}</span>
    </div>
);

const HealthSegment = ({ count, total, color, label }) => {
    if (count === 0) return null;
    const width = (count / total) * 100;
    return (
        <div
            className={`relative h-full ${color} transition-all duration-500 group/seg hover:h-4 hover:z-20 cursor-help`}
            style={{ width: `${width}%` }}
        >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/seg:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover/seg:translate-y-0 z-30">
                <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg shadow-xl flex flex-col items-center min-w-max">
                    <span className="text-[10px] font-black whitespace-nowrap uppercase tracking-widest opacity-70">{label}</span>
                    <span className="text-xs font-bold">{count} {count === 1 ? 'Check' : 'Checks'}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
            </div>
        </div>
    );
};

export default CandidateShow;
