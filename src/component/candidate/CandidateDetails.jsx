import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import {
    ChevronRightIcon, AlertTriangle, TimerIcon, GraduationCap
} from 'lucide-react';
import CriminalDatabaseCheck from './checks/CriminalDatabaseCheck';
import { useParams } from "react-router-dom";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    DOWNLOAD_CANDIDATE_REPORT,
    GET_CANDIDATE_DETAILS,
    MARK_CANDIDATE_AS_STOP_CASE,
    RESUME_CANDIDATE_STATUS
} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import SimpleLoader from "../common/SimpleLoader.jsx";
import CandidateStatusLabel from "./CandidateStatusLabel.jsx";
import CandidateDetailsPageHeaderLoader from "./CandidateDetailsPageHeaderLoader.jsx";
import CheckAddress from "./checks/address-check/CheckAddress.jsx";
import AssignPopOver from "../../page/case-assignment/AssignPopOver.jsx";
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
    const [isIDModalOpen, setIsIDModalOpen] = useState(false);
    const [selectedIDDocumentType, setSelectedIDDocumentType] = useState(null);

    const handleOpenIDVerificationModal = (docType) => {
        setSelectedIDDocumentType(docType);
        setIsIDModalOpen(true);
    };

    const handleCloseIDVerificationModal = () => {
        setIsIDModalOpen(false);
        setSelectedIDDocumentType(null);
    };

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

    const formatHourDuration = (hours) => {
        const parts = [];
        const days = Math.floor(hours / 24);
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours % 24 > 0) parts.push(`${hours % 24} hr${hours % 24 > 1 ? 's' : ''}`);
        return parts.join(', ');
    }

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

                                    {(consolidatedData?.totalTatHours !== undefined && consolidatedData?.totalTatHours > 0) && (
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

                                <div className="shrink-0 ml-auto lg:ml-0">
                                    <CaseActionDropdown setIsCreateModalOpen={setIsCreateModalOpen} handeStopCaseClick={handleToggleCaseStatus}
                                                        candidateStatus={consolidatedData?.status} handleDownloadReport={handleDownloadReport} isDownloading={isDownloading}

                                                        onOpenIDVerificationModal={handleOpenIDVerificationModal}/>
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
                            <CandidateChecksTab caseDetails={candidateData?.caseDetails} indicatorStyle={indicatorStyle}
                                                tabsRef={tabsRef} activeTab={activeTab} setActiveTab={setActiveTab} consolidatedData={consolidatedData} />
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
                                case 'aadhaar':
                                case 'pan':
                                case 'passport':
                                    return <CheckIdentity taskId={activeCheck.taskId}  />
                                case 'reference':
                                    return <CheckReferences taskId={activeCheck.taskId}  />
                                default:
                                    return <CaseTimelineTabContent candidateId={candidateData?.caseDetails?.candidateId} />;
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

            <IDVerificationModal
                isOpen={isIDModalOpen}
                onClose={handleCloseIDVerificationModal}
                documentType={selectedIDDocumentType}
                candidateId={candidateData?.caseDetails?.candidateId}
                onUpdateSuccess={(payload) => onSuccess(payload)}

            />

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold">Generic Create Modal</h2>
                        <p>This modal would open for 'Address' or other non-ID related items.</p>
                        <button onClick={() => setIsCreateModalOpen(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

/* --- SUB-COMPONENTS --- */




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
