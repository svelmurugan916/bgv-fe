import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // 1. Import useLocation
import Sidebar from "./component/sidebar/Sidebar.jsx";
import Header from "./component/header/Header.jsx";
import TopBarLoader from "./component/common/TopBarLoader.jsx";
import {useAuthApi} from "./provider/AuthApiProvider.jsx";
import SSEListener from "./component/listener/SSEListener.jsx";

const MainLayout = () => {
    const location = useLocation();
    const { user } = useAuthApi();
    const API_BASE = import.meta.env.VITE_API_URL || "";
    const sseEndpoint = `${API_BASE}/api/v1/sse/notifications`;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#F9FAFB]">
            <Header />
            {user && <SSEListener sseUrl={sseEndpoint} />}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <Suspense key={location.pathname} fallback={<TopBarLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
