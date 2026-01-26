import React, {useEffect, useRef, useState} from 'react';
import {
    Plus,
    CloudDownload,
    Loader2
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import CandidatesTable from "./CandidatesTable.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { GET_ALL_CANDIDATES_TASKS} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";
import StatsSkeleton from "../dashboard/organization/StatsSkeleton.jsx";
import CandidateStatsView from "./CandidateStatsView.jsx";
import TableSkeleton from "./TableSkeleton.jsx";

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [checkTypeFilter, setCheckTypeFilter] = useState('All');
    const [selectedClient, setSelectedClient] = useState('All');
    const navigate = useNavigate();
    const { authenticatedRequest } = useAuthApi();
    const pageInitRef = useRef(false);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setIsLoading(true);
                const response = await authenticatedRequest(null, GET_ALL_CANDIDATES_TASKS, METHOD.GET);

                if (response.data) {
                    setCandidates(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch candidates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if(!pageInitRef.current) {
            pageInitRef.current = true;
            fetchCandidates();
        }
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1. TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Candidate Management</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage background verifications and track SLA status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold cursor-pointer text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                        <CloudDownload size={18} />
                        Export
                    </button>
                    <button onClick={() => navigate("/add-candidate")} className="bg-[#5D4591] hover:bg-[#4a3675] text-white px-5 py-2.5 cursor-pointer rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#5D4591]/10">
                        <Plus size={18} />
                        Add Candidate
                    </button>
                </div>
            </div>

            {/* IMPROVISATION: Quick Stats Cards */}
            { isLoading ? <StatsSkeleton parentDivClass={""}/> : <CandidateStatsView candidates={candidates} parentDivClass={""}/> }

            {/* 3. PRIMARY DETAILS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <TableSkeleton />
                ) : (

                        <CandidatesTable
                            searchTerm={searchTerm}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            setSearchTerm={setSearchTerm}
                            checkTypeFilter={checkTypeFilter}
                            setCheckTypeFilter={setCheckTypeFilter}
                            selectedClient={selectedClient}
                            setSelectedClient={setSelectedClient}
                            candidates={candidates}
                        />
                )}
            </div>
        </div>
    );
};

export default Candidates;
