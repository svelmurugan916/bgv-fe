import React, { useState, useRef, useEffect, useCallback } from 'react';
import { XIcon} from 'lucide-react';
import CaseAssignmentTable from './CaseAssignmentTable';
import AssignPopOver from './AssignPopOver';
import MultiSelectDropdown from "../../component/dropdown/MultiSelectDropdown.jsx";
import SingleDropdownSearch from "../../component/dropdown/SingleDropdownSearch.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    GET_ALL_OPERATIONS_MEMBERS,
    GET_ALL_PENDING_CANDIDATES,
    SEARCH_PENDING_TASKS // This should now point to /task/search
} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";

const CaseAssignmentPage = () => {
    const [tableData, setTableData] = useState([]);
    const [isTasksLoading, setIsTasksLoading] = useState(false);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filter States
    const [selectedCandidates, setSelectedCandidates] = useState([]); // Array of IDs
    const [selectedCases, setSelectedCases] = useState([]); // Array of Strings
    const [assignmentStatus, setAssignmentStatus] = useState({ key: 'all', value: 'All Status' });
    const [selectedAssigner, setSelectedAssigner] = useState({ key: '', value: '' });

    const { authenticatedRequest } = useAuthApi();
    const initComponentRef = useRef(false);

    const [operationalUsers, setOperationalUsers] = useState([]);
    const [operationalUserOptions, setOperationalUserOptions] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [candidateOptions, setCandidateOptions] = useState([]);
    const [candidateLoading, setCandidateLoading] = useState(false);

    const [selectedIds, setSelectedIds] = useState([]);
    const [isPopOverOpen, setIsPopOpen] = useState(false);
    const [activeCase, setActiveCase] = useState(null);

    const caseTypeOptions = [
        { key: 'IdentityCheck', value: 'Identity' },
        { key: 'AddressCheck', value: 'Address' },
        { key: 'CriminalRecordCheck', value: 'Criminal' },
        { key: 'DatabaseCheck', value: 'Database' },
        { key: 'EducationCheck', value: 'Education' },
        { key: 'EmploymentCheck', value: 'Employment' },
        { key: 'ReferenceCheck', value: 'Reference' }
    ];

    const assignmentOptions = [
        { key: 'all', value: 'All Status' },
        { key: 'assigned', value: 'Assigned' },
        { key: 'unassigned', value: 'Not Assigned' }
    ];

    const fetchTasks = useCallback(async () => {
        setIsTasksLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('size', 20);

            if (selectedCandidates.length > 0) params.append('candidateId', selectedCandidates[0]); // API takes single UUID
            const reqCaseType = (caseTypeOptions.find(c => c.key === selectedCases[0])?.value?.toUpperCase());
            if (selectedCases.length > 0) params.append('checkType', reqCaseType); // API takes single String

            if (assignmentStatus.key === 'assigned') params.append('assigned', 'true');
            if (assignmentStatus.key === 'unassigned') params.append('assigned', 'false');

            if (selectedAssigner.key) params.append('assignedVerifierId', selectedAssigner.key);

            const url = `${SEARCH_PENDING_TASKS}?${params.toString()}`;
            const response = await authenticatedRequest(undefined, url, METHOD.GET);

            if (response.status === 200) {
                const checkResponse = response.data.content;
                setTableData(checkResponse.sort((a, b) => {
                    if (a.assignedUserId === null && b.assignedUserId !== null) return -1;
                    if (a.assignedUserId !== null && b.assignedUserId === null) return 1;
                    return 0;
                }));
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setIsTasksLoading(false);
        }
    }, [currentPage, selectedCandidates, selectedCases, assignmentStatus, selectedAssigner, authenticatedRequest]);

    useEffect(() => {
        setCurrentPage(0);
    }, [selectedCandidates, selectedCases, assignmentStatus, selectedAssigner]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (!initComponentRef.current) {
            initComponentRef.current = true;
            getOperationsTeamMemberStats();
            getPendingCandidates();
        }
    }, []);

    const getPendingCandidates = async () => {
        try {
            setCandidateLoading(true);
            const response = await authenticatedRequest(undefined, GET_ALL_PENDING_CANDIDATES, METHOD.GET);
            if (response.status === 200) {
                setCandidateOptions(response.data.map(opt => ({ key: opt.id, value: opt.candidateName })));
            }
        } catch (error) { console.log(error); } finally { setCandidateLoading(false); }
    };

    const getOperationsTeamMemberStats = async () => {
        setIsUsersLoading(true);
        try {
            const response = await authenticatedRequest(undefined, GET_ALL_OPERATIONS_MEMBERS, METHOD.GET);
            if (response.status === 200) {
                setOperationalUsers(response.data);
                setOperationalUserOptions(response.data.map(opt => ({ key: opt.verifierId, value: opt.verifierName })));
            }
        } catch (err) { console.error(err); } finally { setIsUsersLoading(false); }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedIds([]);
    };

    // Inside CaseAssignmentPage.jsx

    const onClose = (status, selectedUserId, previousUserId) => {
        setIsPopOpen(false);
        setSelectedIds([]);

        if (status === 'success') {
            setOperationalUsers(prevUsers =>
                prevUsers.map(user => {
                    // 1. INCREMENT logic (New User)
                    if (user.verifierId === selectedUserId) {
                        const increment = Array.isArray(activeCase) ? activeCase.length : 1;
                        return {
                            ...user,
                            activeTaskCount: user.activeTaskCount + increment
                        };
                    }

                    if (previousUserId && user.verifierId === previousUserId) {
                        return {
                            ...user,
                            activeTaskCount: Math.max(0, user.activeTaskCount - 1)
                        };
                    }

                    return user;
                })
            );
            fetchTasks();
        }
    };


    const handleBulkAssignOpen = () => {
        const selectedRows = tableData.filter(row => selectedIds.includes(row.taskId));
        setActiveCase(selectedRows);
        setIsPopOpen(true);
    };

    const handleClearAll = () => {
        setSelectedCandidates([]);
        setSelectedCases([]);
        setAssignmentStatus({ key: 'all', value: 'All Status' });
        setSelectedAssigner({ key: '', value: '' });
        setCurrentPage(0); // Reset pagination as well
        setSelectedIds([]); // Clear any table selections
    };

    const hasActiveFilters =
        selectedCandidates.length > 0 ||
        selectedCases.length > 0 ||
        assignmentStatus.key !== 'all' ||
        selectedAssigner.key !== '';

    const hadleOnSelectAll = () => {
        const unassignedIds = tableData
            .filter(row => !row.assignedUserId)
            .map(row => row.taskId);

        if (selectedIds.length === unassignedIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(unassignedIds);
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen animate-in fade-in duration-700">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Case Assignment Manager</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Assign the cases to the Operations team.</p>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all w-fit"
                    >
                        <XIcon size={14} />
                        Clear All Filters
                    </button>
                )}
            </div>

            {/* RESPONSIVE GRID: 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Candidate</label>
                    <MultiSelectDropdown
                        label="Filter Candidates"
                        options={candidateOptions}
                        isOccupyFullWidth={true}
                        selected={selectedCandidates}
                        isLoading={candidateLoading}
                        onToggle={(id) => setSelectedCandidates(prev => prev.includes(id) ? prev.filter(i => i !== id) : [id])}
                        onClear={() => setSelectedCandidates([])}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Case Type</label>
                    <MultiSelectDropdown
                        label="Filter Cases"
                        options={caseTypeOptions}
                        isOccupyFullWidth={true}
                        selected={selectedCases}
                        onToggle={(key) => setSelectedCases(prev => prev.includes(key) ? [] : [key])}
                        onClear={() => setSelectedCases([])}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Assignment Status</label>
                    <SingleDropdownSearch
                        label="All Status"
                        options={assignmentOptions}
                        selectedKey={assignmentStatus.key}
                        onSelect={setAssignmentStatus}
                        isOccupyFullWidth={true} // Set to true
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Assigner (Ops User)</label>
                    <SingleDropdownSearch
                        label="Search User"
                        options={operationalUserOptions}
                        selectedKey={selectedAssigner.key}
                        onSelect={setSelectedAssigner}
                        isLoading={isUsersLoading}
                        isOccupyFullWidth={true} // Set to true
                    />
                </div>
            </div>

            <CaseAssignmentTable
                data={tableData}
                onAssign={(caseData) => { setActiveCase(caseData); setIsPopOpen(true); }}
                onBulkAssign={handleBulkAssignOpen} // Add this line
                selectedIds={selectedIds}
                onSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                onSelectAll={hadleOnSelectAll}
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={handlePageChange}
                isLoading={isTasksLoading}
            />

            <AssignPopOver
                isOpen={isPopOverOpen}
                key={Array.isArray(activeCase) ? 'bulk' : activeCase?.taskId || 'empty'}
                onClose={(status, selectedUserId, previousUserId) => onClose(status, selectedUserId, previousUserId)}
                activeCase={activeCase}
                users={operationalUsers}
                isLoadingUsers={isUsersLoading}
            />
        </div>
    );
};

export default CaseAssignmentPage;
