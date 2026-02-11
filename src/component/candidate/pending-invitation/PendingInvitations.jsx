import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeftIcon, Filter, RotateCcw, Search} from 'lucide-react';
import InvitationTable from './InvitationTable';
import BulkActionsBar from './BulkActionsBar';
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {
    INVITED_CANDIDATE_LIST,
    MARK_CANDIDATE_AS_STOP_CASE,
    RESEND_INVITE_NOTIFICATION
} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import SingleSelectDropdown from "../../dropdown/SingleSelectDropdown.jsx";
import {useParams} from "react-router-dom";

const PendingInvitations = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [checkTypeFilter, setCheckTypeFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!componentInitRef.current) {
            componentInitRef.current = true;
            fetchInvitedCandidates();
        }
    }, []);

    const fetchInvitedCandidates = async () => {
        setLoading(true)
        try {
            const options = {
                params: {
                    organizationId: id,
                }
            }
            const response = await authenticatedRequest(undefined, INVITED_CANDIDATE_LIST, METHOD.GET, options);
            if(response.status === 200) {
                setInvitations(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredInvitations = useMemo(() => {
        return invitations.filter(item => {
            const matchesSearch =
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone?.includes(searchTerm);

            const matchesStatus =
                checkTypeFilter === '' ||
                checkTypeFilter === 'All' ||
                (checkTypeFilter === 'Expired' && item.isExpired) ||
                (checkTypeFilter === item.status && !item.isExpired);

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, checkTypeFilter, invitations]);

    useEffect(() => {

    }, [checkTypeFilter])

    const handleStopCase = async (id) => {
        try {
            const response = await authenticatedRequest({}, `${MARK_CANDIDATE_AS_STOP_CASE}/${id}`, METHOD.PATCH);
            if (response.status === 200) {
                setInvitations(prev => prev.filter(invitation => invitation.id !== id));
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to stop case:", error);
            return false;
        }
    };

    const handleResend = async () => {
        try {
            const response = await authenticatedRequest(selectedIds, RESEND_INVITE_NOTIFICATION, METHOD.POST);
            return response.status === 200;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const handleSendInvitation = async (candidateId) => {
        try {
            return await authenticatedRequest([candidateId], RESEND_INVITE_NOTIFICATION, METHOD.POST);
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const handleSync = async () => {
        setIsSyncing(true);
        try { await fetchInvitedCandidates(); } finally { setIsSyncing(false); }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredInvitations.length) setSelectedIds([]);
        else setSelectedIds(filteredInvitations.map(i => i.id));
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="bg-slate-50 min-h-screen relative p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-start md:items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#5D4591] transition-all cursor-pointer shadow-sm"
                    >
                        <ArrowLeftIcon size={20} />
                    </button>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Pending Invitations
                            </h1>
                            {!loading && (
                                <span className="px-2 py-0.5 bg-[#5D4591]/10 text-[#5D4591] text-xs font-bold rounded-md">
                                    {filteredInvitations.length} Total
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            Manage candidates who haven't started their BGV form submission.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm
                            ${isSyncing ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer'}`}
                    >
                        <RotateCcw size={16} className={`${isSyncing ? 'animate-spin text-[#5D4591]' : 'text-slate-500'}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Status'}
                    </button>
                </div>
            </div>

            {/* MERGED CONTAINER: Search + Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-visible mb-20">

                {/* Search & Filter Header Area */}
                <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-t-[2rem]">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5D4591] transition-colors" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email or phone..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none transition-all focus:bg-white focus:border-[#5D4591]/30 focus:ring-4 focus:ring-[#5D4591]/5"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* CLEANER FILTER PILL */}
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <Filter size={14} className="text-slate-400" />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</span>
                            </div>
                            {/* The Dropdown Component */}
                            <SingleSelectDropdown
                                label="Select Status"
                                options={['All', 'Invited', 'Partially Filled', 'Expired']}
                                selected={checkTypeFilter}
                                onSelect={setCheckTypeFilter}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <InvitationTable
                    invitations={filteredInvitations}
                    loading={loading}
                    selectedIds={selectedIds}
                    onSelect={toggleSelect}
                    onSelectAll={toggleSelectAll}
                    onStopCase={handleStopCase}
                    onSendInvitation={(id) => handleSendInvitation(id)}
                />
            </div>

            <BulkActionsBar
                selectedCount={selectedIds.length}
                handleResend={handleResend}
                onClear={() => setSelectedIds([])}
            />
        </div>
    );
};

export default PendingInvitations;
