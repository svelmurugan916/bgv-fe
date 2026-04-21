import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, History, Lock, CheckCircle2 } from 'lucide-react';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {
    GET_COMMITTED_TRANSACTION_ACTIVITIES,
    GET_RESERVED_TRANSACTION_ACTIVITIES,
    GET_TRANSACTION_ACTIVITIES,
    GET_TRANSACTION_RESERVATION_ITEMS
} from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";

// Components
import TransactionTable from './TransactionTable.jsx';
import ReservationSplitTable from './ReservationSplitTable.jsx';
import TransactionDetailsDrawer from "./TransactionDetailsDrawer.jsx";

const TransactionActivities = () => {
    const { authenticatedRequest } = useAuthApi();
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedTxnId, setSelectedTxnId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // State buckets for each tab
    const [tabStates, setTabStates] = useState({
        ALL: { data: [], page: 0, hasMore: true, total: 0, loading: false },
        RESERVED: { data: [], page: 0, hasMore: true, total: 0, loading: false },
        COMMITTED: { data: [], page: 0, hasMore: true, total: 0, loading: false }
    });

    // 1. Tab Configuration Mapping
    const TAB_CONFIG = {
        ALL: {
            label: 'All Activities',
            icon: <History size={14} />,
            component: TransactionTable,
            endpoint: GET_TRANSACTION_ACTIVITIES,
            // Filter logic if API is shared
            filter: (data) => data
        },
        RESERVED: {
            label: 'Reserved Funds',
            icon: <Lock size={14} />,
            component: TransactionTable,
            endpoint: GET_RESERVED_TRANSACTION_ACTIVITIES,
            filter: (data) => data
        },
        COMMITTED: {
            label: 'Committed Funds',
            icon: <CheckCircle2 size={14} />,
            component: ReservationSplitTable,
            // Use your specific Committed Items endpoint here
            endpoint: GET_COMMITTED_TRANSACTION_ACTIVITIES,
            filter: (data) => data // Assuming this API returns flat list of items
        }
    };

    const fetchTabData = async (tabId, pageNum = 0, isLoadMore = false) => {
        const config = TAB_CONFIG[tabId];

        setTabStates(prev => ({
            ...prev,
            [tabId]: { ...prev[tabId], loading: !isLoadMore, loadingMore: isLoadMore }
        }));

        try {
            // Note: Update URL params based on what each specific API requires
            const url = `${config.endpoint}?page=${pageNum}&size=20`;
            const response = await authenticatedRequest(undefined, url, METHOD.GET);

            if (response.status === 200) {
                const responseData = response.data.data;
                const rawContent = responseData.content || responseData; // Handle different JSON structures
                const filteredData = config.filter(rawContent);

                setTabStates(prev => ({
                    ...prev,
                    [tabId]: {
                        data: isLoadMore ? [...prev[tabId].data, ...filteredData] : filteredData,
                        page: responseData.page?.number || 0,
                        hasMore: responseData.page ? (responseData.page.number < responseData.page.totalPages - 1) : false,
                        total: responseData.page?.totalElements || filteredData.length,
                        loading: false,
                        loadingMore: false
                    }
                }));
            }
        } catch (err) {
            console.error(`Error fetching ${tabId}:`, err);
            setTabStates(prev => ({ ...prev, [tabId]: { ...prev[tabId], loading: false, loadingMore: false } }));
        }
    };

    // Trigger API call when tab is clicked (if no data exists)
    useEffect(() => {
        if (tabStates[activeTab].data.length === 0) {
            fetchTabData(activeTab, 0);
        }
    }, [activeTab]);

    // Determine which component to render
    const ActiveComponent = TAB_CONFIG[activeTab].component;

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5D4591]/10 rounded-xl flex items-center justify-center text-[#5D4591]">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Ledger Activities</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">Wallet Management</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
                    {Object.keys(TAB_CONFIG).map((id) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                                activeTab === id
                                    ? 'bg-white text-[#5D4591] shadow-sm shadow-[#5D4591]/10 border border-slate-200'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {TAB_CONFIG[id].icon}
                            {TAB_CONFIG[id].label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => fetchTabData(activeTab, 0)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#5D4591] transition-all duration-500 shadow-sm cursor-pointer"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Dynamic Content Area */}
            <div className="min-h-[500px]">
                <ActiveComponent
                    // Common props passed to both Table types
                    data={tabStates[activeTab].data}
                    loading={tabStates[activeTab].loading}
                    loadingMore={tabStates[activeTab].loadingMore}
                    hasMore={tabStates[activeTab].hasMore}
                    total={tabStates[activeTab].total}
                    onLoadMore={() => fetchTabData(activeTab, tabStates[activeTab].page + 1, true)}
                    onViewDetails={(id) => { setSelectedTxnId(id); setIsDrawerOpen(true); }}
                    // Specific to ReservationSplitTable if needed
                    onRelease={() => fetchTabData(activeTab, 0)}
                    seperateTable={true}
                />
            </div>

            <TransactionDetailsDrawer
                txnId={selectedTxnId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default TransactionActivities;
