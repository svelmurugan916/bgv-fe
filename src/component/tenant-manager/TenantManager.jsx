import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import TenantStats from "./TenantStats.jsx";
import TenantTable from "./TenantTable.jsx";
import TenantDetailModal from "./TenantDetailModal.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import {TENANT_MANAGER_DASHBOARD} from "../../constant/Endpoint.tsx";
import CreateTenantDrawer from "./CreateTenantDrawer.jsx";

const TenantManager = () => {
    const { authenticatedRequest } = useAuthApi();

    // API States
    const [tenants, setTenants] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, size: 5, totalElements: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

    // UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTenants = useCallback(async (pageNumber = 0) => {
        setIsLoading(true);
        try {
            // Endpoint: /admin/tenants?page=0&size=5
            const response = await authenticatedRequest(
                null,
                `${TENANT_MANAGER_DASHBOARD}?page=${pageNumber}&size=5&search=${searchTerm}`,
                METHOD.GET
            );

            if (response.status === 200) {
                setTenants(response.data.content || []);
                setPageInfo(response.data.page || {});
            }
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
        } finally {
            setIsLoading(false);
        }
    }, [authenticatedRequest, searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTenants(0);
        }, 500); // Debounce search

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchTenants]);

    const handleViewTenant = (tenant) => {
        setSelectedTenant(tenant);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenant Ecosystem</h1>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider">Manage organizations and platform health</p>
                </div>
                <button
                    onClick={() => setIsCreateDrawerOpen(true)}
                    className="flex items-center gap-2 bg-[#5D4591] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:scale-[1.02] transition-all active:scale-95">
                    <Plus size={18} /> New Tenant
                </button>
            </div>

            {/* Top Insight Cards - Using totalElements from API */}
            <TenantStats tenants={tenants} totalCount={pageInfo.totalElements} />

            {/* Table Controls */}
            <div className="bg-white p-4 border border-slate-100 rounded-3xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name or ID..."
                        value={searchTerm}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#5D4591]/20 outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-slate-100 rounded-2xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-slate-100 rounded-2xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* The Main Table with Pagination */}
            <TenantTable
                tenants={tenants}
                isLoading={isLoading}
                pageInfo={pageInfo}
                onPageChange={(newPage) => fetchTenants(newPage)}
                onViewDetails={handleViewTenant}
            />
            {isCreateDrawerOpen && (
                <CreateTenantDrawer
                    onClose={() => setIsCreateDrawerOpen(false)}
                    onSuccess={() => {
                        setIsCreateDrawerOpen(false);
                        fetchTenants(0);
                    }}
                />
            )}

            {/* Detail Modal */}
            {isModalOpen && (
                <TenantDetailModal
                    tenant={selectedTenant}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TenantManager;
