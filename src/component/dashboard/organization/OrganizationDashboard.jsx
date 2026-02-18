import React, {useEffect, useRef, useState} from 'react';
import { Plus } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import {useAuthApi} from "../../../provider/AuthApiProvider.jsx";
import {GET_ALL_ORGANIZATION} from "../../../constant/Endpoint.tsx";
import {METHOD} from "../../../constant/ApplicationConstant.js";
import StatsSkeleton from "./StatsSkeleton.jsx";
import StatsView from "../../analytics/StatsView.jsx";
import OrganizationCard from "./OrganizationCard.jsx";
import OrganizationSkeleton from "./OrganizationSkeleton.jsx";



const OrganizationDashboard = () => {
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [allOrganizationStatistics, setAllOrganizationStatistics] = useState({});
    const navigate = useNavigate();
    const { authenticatedRequest } = useAuthApi();
    const refMounted = useRef(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const getAllOrganisations = async () => {
            try {
                const response = await authenticatedRequest({}, GET_ALL_ORGANIZATION, METHOD.GET);
                console.log('response --', response);
                if(response.status === 200) {
                    const {data} = response;
                    setOrganizations(data?.organizations);
                    setAllOrganizationStatistics({
                        insufficientCases: data.insufficientCases,
                        inProgressCases: data?.inProgressCases,
                        totalCasesAcrossAll: data.totalCasesAcrossAll,
                        totalCompleted: data.totalCompleted,
                        totalOrganizations: data.totalOrganizations,
                    })
                    console.log(response);
                } else {
                    console.log("Error getting all organisations");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        if(!refMounted.current) {
            refMounted.current = true;
            getAllOrganisations();
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Organizations
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage and monitor background verification across clients.</p>
                </div>

                <button onClick={() => navigate("organisation-form")} className="flex items-center cursor-pointer justify-center gap-2 bg-[#5D4591] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#5D4591]/20 hover:bg-[#4A3675] transition-all">
                    <Plus className="w-5 h-5" />
                    Add Organization
                </button>
            </div>

            {/* Quick Stats Summary */}
            { loading ? <StatsSkeleton/> : <StatsView allOrganizationStatistics={allOrganizationStatistics} /> }

            {/* Organization Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { loading ? (
                [...Array(6)].map((_, i) => (
                    <OrganizationSkeleton key={i} />
                ))
            ) : (
                organizations.map(org => (
                    <OrganizationCard
                        key={org?.organizationId}
                        org={org}
                         isOpen={activeMenuId === org.organizationId}
                         onToggle={(e) => {
                             e.stopPropagation(); // Prevent the 'click outside' from firing
                             setActiveMenuId(activeMenuId === org.organizationId ? null : org.organizationId);
                         }}
                    />
                ))
            )}
            </div>

        </div>
    );
};

export default OrganizationDashboard;
