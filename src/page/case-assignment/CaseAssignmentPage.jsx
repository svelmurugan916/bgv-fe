import React, { useState, useMemo } from 'react';
import { Users, Info, UserPlus } from 'lucide-react';
import CaseAssignmentTable from './CaseAssignmentTable';
import AssignPopOver from './AssignPopOver';
import MultiSelectDropdown from "../../component/dropdown/MultiSelectDropdown.jsx";
import SingleDropdownSearch from "../../component/dropdown/SingleDropdownSearch.jsx";

const CaseAssignmentPage = () => {
    const [tableData, setTableData] = useState([
        { id: '1', name: 'VelMurugan S', caseNo: '8821', type: 'Identity', status: 'New', assignedTo: null },
        { id: '2', name: 'Mamie Sandoval', caseNo: '8608', type: 'Address', status: 'In Review', assignedTo: 'Priya Kumar' },
        { id: '3', name: 'Bradley Lamb', caseNo: '8911', type: 'Criminal', status: 'New', assignedTo: null },
        { id: '4', name: 'Sneha Kapoor', caseNo: '9001', type: 'Education', status: 'In Review', assignedTo: 'Ankit Verma' },
        { id: '5', name: 'VelMurugan S', caseNo: '8822', type: 'Criminal', status: 'New', assignedTo: 'Priya Sharma' },
    ]);

    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [selectedCases, setSelectedCases] = useState([]);
    const [assignmentStatus, setAssignmentStatus] = useState({ key: 'all', value: 'All Status' });
    const [selectedAssigner, setSelectedAssigner] = useState({ key: '', value: '' });

    const [selectedIds, setSelectedIds] = useState([]);
    const [isPopOverOpen, setIsPopOverOpen] = useState(false);
    const [activeCase, setActiveCase] = useState(null);

    const candidateOptions = ["VelMurugan S", "Arjun Vardhan", "Sneha Kapoor", "Bradley Lamb", "Mamie Sandoval"];
    const caseTypeOptions = ["Identity", "Address", "Criminal", "Database", "Education", "Employment", "Reference"];
    const assignmentOptions = [
        { key: 'all', value: 'All Status' },
        { key: 'assigned', value: 'Assigned' },
        { key: 'unassigned', value: 'Not Assigned' }
    ];
    const operationalUsers = [
        { key: '1', value: 'Priya Kumar', email: 'priya@ford.com', wip: 2 },
        { key: '2', value: 'Ankit Verma', email: 'ankit@ford.com', wip: 8 },
        { key: '3', value: 'Deepika R', email: 'deepika@ford.com', wip: 5 },
        { key: '4', value: 'Naveen', email: 'Naveen@ford.com', wip: 2 },
        { key: '5', value: 'Prashanth', email: 'Prashanth@ford.com', wip: 8 },
        { key: '6', value: 'Anil', email: 'Anil@ford.com', wip: 5 }
    ];

    const filteredData = useMemo(() => {
        return tableData.filter(row => {
            const matchesCandidate = selectedCandidates.length === 0 || selectedCandidates.includes(row.name);
            const matchesCaseType = selectedCases.length === 0 || selectedCases.includes(row.type);
            let matchesAssignment = true;
            if (assignmentStatus.key === 'assigned') matchesAssignment = row.assignedTo !== null;
            if (assignmentStatus.key === 'unassigned') matchesAssignment = row.assignedTo === null;
            const matchesAssigner = selectedAssigner.key === '' || row.assignedTo === selectedAssigner.value;
            return matchesCandidate && matchesCaseType && matchesAssignment && matchesAssigner;
        });
    }, [tableData, selectedCandidates, selectedCases, assignmentStatus, selectedAssigner]);

    const handleAssignClick = (caseData) => {
        setActiveCase(caseData);
        setIsPopOverOpen(true);
    };

    const handleBulkAssignOpen = () => {
        const selectedRows = tableData.filter(row => selectedIds.includes(row.id));
        setActiveCase(selectedRows);
        setIsPopOverOpen(true);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredData.map(item => item.id));
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen animate-in fade-in duration-700">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Users className="text-[#5D4591]" size={28} />
                    Case Assignment Manager
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Candidate</label>
                    <MultiSelectDropdown
                        label="Filter Candidates"
                        options={candidateOptions}
                        selected={selectedCandidates}
                        onToggle={(opt) => setSelectedCandidates(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                        onClear={() => setSelectedCandidates([])}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Case Type</label>
                    <MultiSelectDropdown
                        label="Filter Cases"
                        options={caseTypeOptions}
                        selected={selectedCases}
                        onToggle={(opt) => setSelectedCases(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
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
                        isOccupyFullWidth={false}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Assigner (Ops User)</label>
                    <SingleDropdownSearch
                        label="Search User"
                        options={operationalUsers}
                        selectedKey={selectedAssigner.key}
                        onSelect={setSelectedAssigner}
                        isOccupyFullWidth={false}
                    />
                </div>
            </div>

            {/* Subtle Info Bar & Compact Bulk Button */}
            <div className="mb-3 flex items-center justify-between px-2">
                <p className="text-[11px] text-slate-400 italic">
                    {selectedIds.length > 0
                        ? `* ${selectedIds.length} cases selected for bulk assignment.`
                        : "* Select multiple checkboxes to assign cases in bulk to a single user."}
                </p>

                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkAssignOpen}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5D4591] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] transition-all animate-in fade-in zoom-in duration-300"
                    >
                        <UserPlus size={14} />
                        Assign Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <CaseAssignmentTable
                data={filteredData}
                onAssign={handleAssignClick}
                selectedIds={selectedIds}
                onSelectRow={toggleSelectRow}
                onSelectAll={toggleSelectAll}
            />

            <AssignPopOver
                isOpen={isPopOverOpen}
                onClose={() => {
                    setIsPopOverOpen(false);
                    setSelectedIds([]);
                }}
                activeCase={activeCase}
                users={operationalUsers}
            />
        </div>
    );
};

export default CaseAssignmentPage;
