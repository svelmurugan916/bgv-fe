import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from "./component/sidebar/Sidebar.jsx";
import Header from "./component/header/Header.jsx";
import TopBarLoader from "./component/common/TopBarLoader.jsx";
import {useAuthApi} from "./provider/AuthApiProvider.jsx";
import SSEListener from "./component/listener/SSEListener.jsx";
import EnterpriseFooter from "./component/footer/EnterpriseFooter.jsx";

const MainLayout = () => {
    const location = useLocation();
    const { user } = useAuthApi();

    // Match this to your Header's height
    const HEADER_HEIGHT = "72px";

    return (
        /*
           1. ROOT: Must be min-h-screen.
           NO overflow-hidden, NO h-screen.
        */
        <div className="flex flex-col min-h-screen bg-[#F9FAFB]">

            {/*
               2. STICKY BOUNDARY:
               The Header and Sidebar are inside this div.
               When this div ends, they scroll away.
            */}
            <div className="flex flex-col flex-1">

                {/* 3. STICKY HEADER: Locked to top of window */}
                <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
                    <Header />
                </header>

                {user && <SSEListener />}

                {/* 4. CONTENT ROW */}
                <div className="flex flex-1 relative items-start">

                    {/*
                        5. STICKY SIDEBAR:
                        - sticky: Pins it.
                        - top: Sits below the header.
                        - h-[calc...]: Fills the viewport height.
                        - self-start: CRITICAL. Prevents sidebar from stretching
                          to the height of the main content.
                    */}
                    <aside
                        className="sticky z-40 self-start shrink-0 border-r border-gray-100 bg-white"
                        style={{
                            top: HEADER_HEIGHT,
                            height: `calc(100vh - ${HEADER_HEIGHT})`
                        }}
                    >
                        <Sidebar />
                    </aside>

                    {/* 6. MAIN CONTENT: Window handles the scroll */}
                    <main className="flex-1 min-w-0 p-8">
                        <Suspense key={location.pathname} fallback={<TopBarLoader />}>
                            <Outlet />
                        </Suspense>
                    </main>
                </div>
            </div>

            {/*
                7. THE FOOTER:
                Located OUTSIDE the boundary.
                When the main content is over, this appears and 'pushes'
                the header and sidebar up.
            */}
            <EnterpriseFooter />
        </div>
    );
};

export default MainLayout;
