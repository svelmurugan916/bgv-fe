import React, {useState, useEffect, useRef} from 'react';
import {Search, RotateCcw, ArrowLeftIcon} from 'lucide-react';
import InvitationTable from './InvitationTable';
import BulkActionsBar from './BulkActionsBar';
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {
    INVITED_CANDIDATE_LIST,
    MARK_CANDIDATE_AS_STOP_CASE,
    RESEND_INVITE_NOTIFICATION
} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";

const PendingInvitations = () => {
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const { authenticatedRequest } = useAuthApi();
    const componentInitRef = useRef(false);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if(!componentInitRef.current) {
            componentInitRef.current = true;
            fetchInvitedCandidates();
        }
    }, []);

    const fetchInvitedCandidates = async () => {
        setLoading(true)
        try {
            const response = await authenticatedRequest(undefined, INVITED_CANDIDATE_LIST, METHOD.GET);
            if(response.status === 200) {
                setInvitations(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // UPDATED ASYNC STOP CASE LOGIC
    const handleStopCase = async (id) => {
        try {
            // Simulated API Endpoint for Stopping Case
            // const response = await authenticatedRequest({ id }, STOP_CASE_ENDPOINT, METHOD.POST);

            // Simulating API delay and random failure for testing
            const response = await authenticatedRequest({}, `${MARK_CANDIDATE_AS_STOP_CASE}/${id}`, METHOD.PATCH);
            if(response.status === 200) {
                setInvitations(prev => prev.filter(invitation => invitation.id !== id));
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
                return true;
            } else {
                return false;
            }
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

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await fetchInvitedCandidates();
        } finally {
            setIsSyncing(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === invitations.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(invitations.map(i => i.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="bg-slate-50 min-h-screen relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-start md:items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#5D4591] transition-all cursor-pointer"
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
                                    {invitations.length} Total
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
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border
                            ${isSyncing ? 'bg-slate-100 text-slate-400 border-slate-200 disabled' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer'}`}
                    >
                        <RotateCcw size={16} className={`${isSyncing ? 'animate-spin text-[#5D4591]' : 'text-slate-500'}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Status'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-20">
                <InvitationTable
                    invitations={invitations}
                    loading={loading}
                    selectedIds={selectedIds}
                    onSelect={toggleSelect}
                    onSelectAll={toggleSelectAll}
                    onStopCase={handleStopCase}
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
