import React, {useState, useEffect, useRef} from 'react';
import {
    Download,
    UserPlus,
    ArrowLeftIcon
} from 'lucide-react';
import TableSkeleton from './TableSkeleton';
import CandidatesTable from "./CandidatesTable.jsx";
import OperationalMetricsBar from "./OperationalMetricsBar.jsx";
import StatsSkeleton from "../dashboard/organization/StatsSkeleton.jsx";
import StatsView from "../analytics/StatsView.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {
    FORM_NOT_SUBMITTED_COUNT,
    GET_CANDIDATES_TASKS_FOR_ORGANIZATION, ORGANIZATION_STATISTICS
} from "../../constant/Endpoint.tsx"; // Assuming GET_ORG_CASES is defined in your constants
import {METHOD} from "../../constant/ApplicationConstant.js";

const OrganizationCases = () => {
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);
    const [stats, setStats] = useState({
        totalCases: 0,
        totalCompleted: 0,
        workInProgress: 0,
        insufficiency: 0
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [checkTypeFilter, setCheckTypeFilter] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [statisticLoading, setStatisticLoading] = useState(false);
    const [organizationDetails, setOrganizationDetails] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const componentInitRef = useRef(false);
    const { authenticatedRequest } = useAuthApi();
    const [formNonSubmittedAndStopCaseCount, setFormNonSubmittedAndStopCaseCount] = useState({});

    useEffect(() => {
        const fetchCases = async (organizationId) => {
            setLoading(true);
            try {
                const response = await authenticatedRequest(undefined, `${GET_CANDIDATES_TASKS_FOR_ORGANIZATION}/${organizationId}`, METHOD.GET);
                if (response.status === 200 && response.data) {
                    const apiData = response.data;
                    setCases(apiData);
                }
            } catch (error) {
                console.error("Failed to fetch cases:", error);
            } finally {
                setLoading(false);
            }
        };
        if(!componentInitRef.current && id) {
            componentInitRef.current = true;
            fetchCases(id);
            fetchOrganizationStatistics(id);
            getFormNotFillingCandidateCount(id);
        }

    }, [id]);

    const fetchOrganizationStatistics = async (organizationId) => {
        setStatisticLoading(true);
        try {
            const response = await authenticatedRequest(undefined, `${ORGANIZATION_STATISTICS}/${organizationId}`, METHOD.GET);
            if (response.status === 200 && response.data) {
                const apiData = response.data;
                setStats({
                    totalCases: apiData?.totalCases,
                    totalCompleted: apiData?.completedCases,
                    workInProgress: apiData?.inProgressCases,
                    insufficiency: apiData?.insufficientCases
                });
                setOrganizationDetails({
                    name: apiData?.organizationName,
                })
            } else {
                console.log("Error getting organization statistics: ", response);

            }
        } catch (err) {
            console.error("Error getting organization details:", err);
        } finally {
            setStatisticLoading(false);
        }

    }

    const getFormNotFillingCandidateCount = async (organizationId) => {
        try {
            const options = {
                params: {
                    organizationId: organizationId,
                }
            }
            const response = await authenticatedRequest(undefined, FORM_NOT_SUBMITTED_COUNT, METHOD.GET, options);
            if(response.status === 200) {
                setFormNonSubmittedAndStopCaseCount(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center cursor-pointer justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#5D4591] hover:border-[#5D4591]/30 hover:bg-[#F9F7FF] transition-all shadow-sm"
                    >
                        <ArrowLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                    </button>

                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {organizationDetails?.name} <span className="text-slate-400 font-normal">/ Cases</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5 font-medium">Manage and monitor individual candidate verifications.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Export List
                    </button>
                    <button onClick={() => navigate(`/add-candidate/${id}`)} className="flex items-center gap-2 px-4 py-2.5 bg-[#5D4591] text-white rounded-xl text-sm font-bold hover:bg-[#4a3675] transition-all shadow-lg shadow-[#5D4591]/20">
                        <UserPlus size={18} /> Add New Case
                    </button>
                </div>
            </div>

            {/* Summary Ribbon - Calculated from API data */}
            { statisticLoading ? (
                <StatsSkeleton parentDivClass={""}/>
            ) : (
                <StatsView
                    allOrganizationStatistics={{
                        totalCasesAcrossAll: stats.totalCases,
                        totalCompleted: stats.totalCompleted,
                        inProgressCases: stats.workInProgress,
                        insufficientCases: stats.insufficiency
                    }}
                    parentDivClass={""}
                />
            )}


            <OperationalMetricsBar
                invitedCount={formNonSubmittedAndStopCaseCount?.formNonSubmittedCandidateCount || 0}
                stopCaseCount={formNonSubmittedAndStopCaseCount?.stopCaseCount || 0}
                onInvitedClick={() => navigate(`/candidate/pending-invitation/${id}`)}
            />

            {/* Content Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? <TableSkeleton /> : <CandidatesTable
                    searchTerm={searchTerm}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    setSearchTerm={setSearchTerm}
                    checkTypeFilter={checkTypeFilter}
                    setCheckTypeFilter={setCheckTypeFilter}
                    selectedClient={undefined}
                    setSelectedClient={undefined}
                    candidates={cases}
                />}
            </div>
        </div>
    );
};

export default OrganizationCases;
