import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import {
    Download, MoreVertical, ChevronRightIcon, FileCheck, Search,
    CheckCircle2, Clock, AlertCircle, XCircle
} from 'lucide-react';
import CriminalDatabaseCheck from './checks/CriminalDatabaseCheck';
import { useParams } from "react-router-dom";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { GET_CANDIDATE_DETAILS } from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import SimpleLoader from "../common/SimpleLoader.jsx";
import CheckIcon from "../common/CheckIcon.jsx";
import CandidateStatusLabel from "./CandidateStatusLabel.jsx";
import CandidateDetailsPageHeaderLoader from "./CandidateDetailsPageHeaderLoader.jsx";
import CheckAddress from "./checks/CheckAddress.jsx";
import AssignPopOver from "../../page/case-assignment/AssignPopOver.jsx";
import CaseActionDropdown from "./CaseActionDropdown.jsx";
import EditAddressModal from "./checks/EditAddressModal.jsx";

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

    const operationalUsers = [
        { key: '1', value: 'Priya Kumar', email: 'priya@ford.com', wip: 2 },
        { key: '2', value: 'Ankit Verma', email: 'ankit@ford.com', wip: 8 },
        { key: '3', value: 'Deepika R', email: 'deepika@ford.com', wip: 5 },
        { key: '4', value: 'Naveen', email: 'Naveen@ford.com', wip: 2 },
        { key: '5', value: 'Prashanth', email: 'Prashanth@ford.com', wip: 8 },
        { key: '6', value: 'Anil', email: 'Anil@ford.com', wip: 5 }
    ];

    // --- SLIDING TAB LOGIC ---
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

    const mappedCandidates = useMemo(() => {
        if(candidateData) {
            const grouped = candidateData?.caseDetails?.checks?.reduce((acc, check) => {
                let category = check.taskName.toUpperCase();
                if (category.includes('ADDRESS')) category = 'ADDRESS';
                else if (category.includes('IDENTITY') || category.includes('ID ')) category = 'IDENTITY';
                else if (category.includes('EDUCATION')) category = 'EDUCATION';
                else if (category.includes('EMPLOYMENT') || category.includes('EXPERIENCE')) category = 'EMPLOYMENT';
                else if (category.includes('CRIMINAL')) category = 'CRIMINAL';
                else if (category.includes('REFERENCE')) category = 'REFERENCE';
                else if (category.includes('DATABASE') || category.includes('DB ')) category = 'DATABASE';

                if (!acc[category]) acc[category] = [];
                acc[category].push(check);
                return acc;
            }, {});

            const processedChecks = grouped ? Object.keys(grouped).map(taskName => {
                const checks = grouped[taskName];
                const hasFailed = checks.some(c => c.status.toLowerCase().includes('failed'));
                const hasInsufficiency = checks.some(c => c.status.toLowerCase().includes('insufficiency'));
                const hasUnable = checks.some(c => c.status.toLowerCase().includes('unable_to_verify'));
                const hasInProgress = checks.some(c =>
                    c.status.toLowerCase() === 'in_progress' || c.status.toLowerCase() === 'needs_review'
                );
                const allUnassigned = checks.every(c => !c.assignedToUserId);

                let finalStatus = 'cleared';

                if (hasFailed) finalStatus = 'failed';
                else if (hasInsufficiency) finalStatus = 'insufficiency';
                else if (hasUnable) finalStatus = 'unableto_verify';
                else if (allUnassigned) finalStatus = 'unassigned';
                else if (hasInProgress) finalStatus = 'inprogress';

                return {
                    taskName: taskName,
                    status: finalStatus
                };
            }) : [];

            return {
                caseNo: candidateData.candidateInfo.caseNo,
                name: candidateData.candidateInfo.name,
                client: candidateData.candidateInfo.client,
                package: candidateData.candidateInfo.packageName,
                initiatedDate: candidateData.candidateInfo.initiatedDate,
                dueDate: candidateData.candidateInfo.dueDate || 'TBD',
                status: candidateData.caseDetails.status,
                checks: processedChecks
            };
        }
        return null;
    }, [candidateData]);

    return (
        <div className="min-h-screen bg-[#F8F9FB] animate-in fade-in duration-500">
            <div className="bg-white px-8 pt-6 border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto">
                    {loading ? <CandidateDetailsPageHeaderLoader /> : (
                        <>
                            {/* 1. BREADCRUMBS */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-400 cursor-pointer hover:text-[#5D4591]" onClick={() => window.history.back()}>Candidates</span>
                                    <ChevronRightIcon size={12} className="text-slate-300" />
                                    <span className="text-[#5D4591]">{mappedCandidates?.caseNo}</span>
                                </div>
                            </div>

                            {/* 2. TITLE & METRICS ROW */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <span className="text-2xl font-bold text-slate-900 tabular-nums">{mappedCandidates?.caseNo}</span>
                                    <div className="w-[1px] h-6 bg-slate-200" />
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{mappedCandidates?.name}</h1>

                                    <div className="relative flex items-center ml-4 pl-6 border-l border-slate-100 gap-6">
                                        <div className="flex items-center gap-1">
                                            {mappedCandidates?.checks.map((check, idx) => (
                                                <CheckIcon key={idx} status={check.status} label={check.taskName} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-[1px] h-6 bg-slate-200" />
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[9px] font-black text-[#5D4591] uppercase tracking-widest">Case Health</span>
                                            <span className="text-[9px] font-black text-emerald-500">{metrics?.progressPercentage}% Complete</span>
                                        </div>
                                        <div className="flex h-2 w-64 bg-slate-100 rounded-full overflow-visible items-center">
                                            <HealthSegment count={metrics?.clearedChecks} total={metrics?.totalChecks} color="bg-emerald-500" label="Cleared" />
                                            <HealthSegment count={metrics?.inProgressChecks} total={metrics?.totalChecks} color="bg-yellow-400" label="In Progress" />
                                            <HealthSegment count={metrics?.insufficientChecks} total={metrics?.totalChecks} color="bg-orange-500" label="Insufficient" />
                                            <HealthSegment count={metrics?.unableToVerify} total={metrics?.totalChecks} color="bg-amber-400" label="Unable to Verify" />
                                            <HealthSegment count={metrics?.failedCount} total={metrics?.totalChecks} color="bg-red-600" label="Failed" />
                                        </div>
                                    </div>
                                </div>

                                <CaseActionDropdown setIsCreateModalOpen={setIsCreateModalOpen} />
                            </div>

                            {/* 3. ATTRIBUTES */}
                            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 mb-8">
                                <CandidateStatusLabel label={"Overall Status"} status={mappedCandidates?.status} />
                                <Attribute label="Organization" value={mappedCandidates?.client} />
                                <Attribute label="Check Pack" value={mappedCandidates?.package} />
                                <Attribute label="init Date" value={mappedCandidates?.initiatedDate} />
                                <Attribute label={`${(mappedCandidates?.status === "GREEN") ? "Completed Date" : "Due Date"}`} value={mappedCandidates?.dueDate || 'TBD'}/>
                            </div>

                            {/* 4. NAVIGATION TABS WITH SMOOTH SLIDING INDICATOR */}
                            <div className="relative flex items-center gap-2 border-b border-slate-100">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar relative">
                                    {/* The Sleek Moving Underline */}
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
                        {candidateData?.caseDetails?.checks.find(c => c.taskId === activeTab)?.taskName === 'criminal' && <CriminalDatabaseCheck />}
                        {(() => {
                            const activeCheck = candidateData?.caseDetails?.checks.find(c => c.taskId === activeTab);

                            if (activeCheck?.taskName === 'address') {
                                // Passing taskId as addressId, change to activeCheck.id if your API uses a different field
                                return <CheckAddress addressId={activeCheck.taskId} setIsPopOverOpen={setIsPopOverOpen} />;
                            }
                            return null;
                        })()}
                    </div>
                )}
            </div>
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
                onUpdateSuccess={(payload) => onSuccess(payload)} // Refresh data after update
            />
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const TabItem = forwardRef(({ label, active, status, onClick }, ref) => {
    const getDotColor = () => {
        switch (status) {
            // Success State
            case 'CLEARED':
                return 'bg-emerald-500';
            case 'INSUFFICIENCY':
                return 'bg-orange-500';
            case 'FAILED':
                return 'bg-red-500';
            case 'NEEDS_REVIEW':
                return 'bg-yellow-500';
            case 'IN_PROGRESS':
                return 'bg-yellow-500';
            case 'UNABLE_TO_VERIFY':
                return 'bg-amber-400';
            default:
                return 'bg-slate-300';
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
                        {/* Ping animation for active or critical states */}
                        {['IN_PROGRESS', 'INSUFFICIENCY', 'NEEDS_REVIEW'].includes(status) && (
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${getDotColor()}`}></span>
                        )}
                        <div className={`w-2 h-2 rounded-full relative ${getDotColor()}`} />
                    </div>
                )}
                <span className={`text-[13px] capitalize tracking-tight transition-colors ${active ? 'text-[#5D4591] font-bold' : 'font-semibold text-slate-500'}`}>
                    {label}
                </span>
            </div>

            {/* Active indicator line */}
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5D4591] rounded-full animate-in fade-in slide-in-from-bottom-1" />
            )}
        </button>
    );
});


const Attribute = ({ label, value }) => (
    <div className="flex items-center gap-3">
        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{label}</span>
        <span className="text-[11px] text-slate-500 font-bold">{value}</span>
    </div>
);

const HealthSegment = ({ count, total, color, label }) => {
    if (count === 0) return null;
    const width = (count / total) * 100;

    return (
        <div
            className={`relative h-full ${color} transition-all duration-500  group/seg hover:h-4 hover:z-20 cursor-help`}
            style={{ width: `${width}%` }}
        >
            {/* TOOLTIP ON HOVER */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/seg:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover/seg:translate-y-0 z-30">
                <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg shadow-xl flex flex-col items-center min-w-max">
                    <span className="text-[10px] font-black whitespace-nowrap uppercase tracking-widest opacity-70">{label}</span>
                    <span className="text-xs font-bold">{count} {count === 1 ? 'Check' : 'Checks'}</span>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
            </div>
        </div>
    );
};


export default CandidateShow;
