import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import {
    Download, MoreVertical, ChevronRightIcon, FileCheck, Search,
    CheckCircle2, Clock, AlertCircle, XCircle, AlertTriangle, TimerIcon
} from 'lucide-react';
import CriminalDatabaseCheck from './checks/CriminalDatabaseCheck';
import { useParams } from "react-router-dom";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    DOWNLOAD_CANDIDATE_REPORT,
    FILE_GET,
    GET_CANDIDATE_DETAILS,
    MARK_CANDIDATE_AS_STOP_CASE,
    RESUME_CANDIDATE_STATUS
} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import SimpleLoader from "../common/SimpleLoader.jsx";
import CheckIcon from "../common/CheckIcon.jsx";
import CandidateStatusLabel from "./CandidateStatusLabel.jsx";
import CandidateDetailsPageHeaderLoader from "./CandidateDetailsPageHeaderLoader.jsx";
import CheckAddress from "./checks/CheckAddress.jsx";
import AssignPopOver from "../../page/case-assignment/AssignPopOver.jsx";
import CaseActionDropdown from "./CaseActionDropdown.jsx";
import EditAddressModal from "./checks/EditAddressModal.jsx";
import CandidateCheckIconStatus from "../common/CandidateCheckIconStatus.jsx";
import CheckEducation from "./checks/CheckEducation.jsx";
import Employment from "../../page/bgv-form/Employment.jsx";
import CheckExperience from "./checks/CheckExperience.jsx";
import CheckDatabase from "./checks/CheckDatabase.jsx";
import CheckIdentity from "./checks/CheckIdentity.jsx";
import CheckReferences from "./checks/CheckReferences.jsx";

const CandidateShow = () => {
    const [activeTab, setActiveTab] = useState(null);
    const { id } = useParams();
    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();
    const [candidateData, setCandidateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({});
    const [isPopOverOpen, setIsPopOverOpen] = useState(false);
    const [activeCase, setActiveCase] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const operationalUsers = [
        { key: '1', value: 'Priya Kumar', email: 'priya@ford.com', wip: 2 },
        { key: '2', value: 'Ankit Verma', email: 'ankit@ford.com', wip: 8 },
        { key: '3', value: 'Deepika R', email: 'deepika@ford.com', wip: 5 },
        { key: '4', value: 'Naveen', email: 'Naveen@ford.com', wip: 2 },
        { key: '5', value: 'Prashanth', email: 'Prashanth@ford.com', wip: 8 },
        { key: '6', value: 'Anil', email: 'Anil@ford.com', wip: 5 }
    ];

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

    const handleAssignClick = (caseData) => {
        setActiveCase(caseData);
        setIsPopOverOpen(true);
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
        setIsPopOverOpen(false);
        try {

            const response = await authenticatedRequest({}, `${consolidatedData.status === 'STOP_CASE' ? RESUME_CANDIDATE_STATUS : MARK_CANDIDATE_AS_STOP_CASE}/${candidateData.candidateInfo?.candidateId}`, METHOD.PATCH);
            if(response.status === 200) {
                await fetchCandidateDetails();
            }
        } catch (err) {
            console.log(err);
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
                totalTatHours: candidateData?.candidateInfo?.totalTatHours
            };
        }
        return {};
    }, [candidateData]);

    return (
        <div className="min-h-screen bg-[#F8F9FB] animate-in fade-in duration-500">
            <div className="bg-white px-4 sm:px-8 pt-6 border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto">
                    {loading ? <CandidateDetailsPageHeaderLoader /> : (
                        <>
                            {/* 1. BREADCRUMBS */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400 cursor-pointer hover:text-[#5D4591]" onClick={() => window.history.back()}>Candidates</span>
                                    <ChevronRightIcon size={12} className="text-slate-300" />
                                    <span className="text-[#5D4591]">{consolidatedData?.caseNo}</span>
                                </div>
                            </div>

                            {/* 2. TITLE & METRICS ROW - Fixed for Resolutions */}
                            <div className="flex flex-wrap items-start lg:items-center justify-between gap-6 mb-8">
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums shrink-0">{consolidatedData?.caseNo}</span>
                                        <div className="hidden sm:block w-[1px] h-6 bg-slate-200" />
                                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate max-w-[200px] lg:max-w-xs" title={consolidatedData?.name}>
                                            {consolidatedData?.name}
                                        </h1>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden lg:block w-[1px] h-6 bg-slate-200" />
                                        <div className="flex items-center gap-1 shrink-0">
                                            <CandidateCheckIconStatus checks={consolidatedData?.checks} candidateStatus={candidateData?.caseDetails?.status} />
                                        </div>
                                    </div>

                                    {consolidatedData?.totalTatHours && (
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
                                                        {consolidatedData?.totalTatHours} Hrs
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

                                <div className="shrink-0 ml-auto lg:ml-0">
                                    <CaseActionDropdown setIsCreateModalOpen={setIsCreateModalOpen} handeStopCaseClick={handleToggleCaseStatus}
                                                        candidateStatus={consolidatedData?.status} handleDownloadReport={handleDownloadReport} isDownloading={isDownloading} />
                                </div>
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
                            <div className="relative flex items-center gap-2 border-b border-slate-100">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar relative">
                                    <div
                                        className="absolute bottom-0 h-0.5 bg-[#5D4591] transition-all duration-300 ease-out z-10 rounded-full"
                                        style={{
                                            left: indicatorStyle.left,
                                            width: indicatorStyle.width
                                        }}
                                    />

                                    {candidateData?.caseDetails?.checks.map((check) => (
                                        <TabItem
                                            ref={el => tabsRef.current[check.taskId] = el}
                                            key={check.taskId}
                                            label={check.taskName}
                                            status={check.status}
                                            active={activeTab === check.taskId}
                                            onClick={() => setActiveTab(check.taskId)}
                                            candidateStatus={consolidatedData?.status}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="max-w-[1600px] mx-auto py-4">
                {loading ? <SimpleLoader size="lg" className="py-20" /> : (
                    <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                        {(() => {
                            const activeCheck = candidateData?.caseDetails?.checks.find(c => c.taskId === activeTab);
                            switch (activeCheck?.taskName) {
                                case 'address':
                                    return <CheckAddress addressId={activeCheck.taskId} setIsPopOverOpen={setIsPopOverOpen} />;
                                case 'education':
                                    return <CheckEducation educationId={activeCheck.taskId}/>
                                case 'employment':
                                    return <CheckExperience employmentId={activeCheck.taskId}/>
                                case 'criminal':
                                    return <CriminalDatabaseCheck taskId={activeCheck.taskId}  />
                                case 'database':
                                    return <CheckDatabase taskId={activeCheck.taskId}/>
                                case 'identity':
                                    return <CheckIdentity taskId={activeCheck.taskId}  />
                                case 'reference':
                                    return <CheckReferences taskId={activeCheck.taskId}  />
                                default:
                                    return null;
                            }

                        })()}
                    </div>
                )}
            </div>
            {/* Popovers and Modals remain unchanged */}
            <AssignPopOver
                isOpen={isPopOverOpen}
                onClose={() => {
                    setIsPopOverOpen(false);
                    setSelectedIds([]);
                }}
                activeCase={activeCase}
                users={operationalUsers}
            />
            <EditAddressModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                candidateId={candidateData?.caseDetails?.candidateId}
                onUpdateSuccess={(payload) => onSuccess(payload)}
            />
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const TabItem = forwardRef(({ label, active, status, onClick, candidateStatus }, ref) => {
    const getDotColor = () => {
        if(candidateStatus === 'STOP_CASE' && !['CLEARED', 'FAILED', 'UNABLE_TO_VERIFY'].includes(status))
            return 'bg-slate-300'
        switch (status) {
            case 'CLEARED': return 'bg-emerald-500';
            case 'INSUFFICIENCY': return 'bg-orange-500';
            case 'FAILED': return 'bg-red-500';
            case 'NEEDS_REVIEW': return 'bg-violet-500';
            case 'IN_PROGRESS': return 'bg-blue-500';
            case 'UNABLE_TO_VERIFY': return 'bg-amber-400';
            default: return 'bg-slate-300';
        }
    };

    return (
        <button
            ref={ref}
            onClick={onClick}
            className="group relative flex items-center gap-2.5 pb-4 pt-2 px-4 transition-all cursor-pointer whitespace-nowrap"
        >
            <div className={`flex items-center gap-2 transition-all duration-300 ${active ? 'scale-105' : 'opacity-70 group-hover:opacity-100'}`}>
                {status && (
                    <div className="relative flex items-center justify-center">
                        {['IN_PROGRESS', 'INSUFFICIENCY', 'NEEDS_REVIEW'].includes(status) && (candidateStatus !== 'STOP_CASE') && (
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${getDotColor()}`}></span>
                        )}
                        <div className={`w-2 h-2 rounded-full relative ${getDotColor()}`} />
                    </div>
                )}
                <span className={`text-[13px] capitalize tracking-tight transition-colors ${active ? 'text-[#5D4591] font-bold' : 'font-semibold text-slate-500'}`}>
                    {label}
                </span>
            </div>
        </button>
    );
});


const Attribute = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <span className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight">{label}</span>
        <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold truncate max-w-[150px]" title={value}>{value}</span>
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
