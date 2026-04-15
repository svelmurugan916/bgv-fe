import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import AdminDashboard from "./tenant-admin-dashboard/AdminDashboard.jsx";
import {lazy} from "react";
import OperationsDashboard from "./operation-dashboard/OperationsDashboard.jsx";
import AdminSystemDashboard from "./admin-dashboard/AdminSystemDashboard.jsx";


const DashboardPage = () => {
    const { loggedInRole, loading } = useAuthApi();

    if (loading) return null; // Or a spinner

    if (loggedInRole === "ROLE_TENANT_ADMIN") return <AdminDashboard />;
    if (loggedInRole === "ROLE_ADMIN") return <AdminSystemDashboard />;
    if (loggedInRole === "ROLE_TENANT_OPERATIONS_MANAGER") return <AdminDashboard />;
    if (loggedInRole === "ROLE_TENANT_OPERATIONS") return <OperationsDashboard />;

    return (
        <div className="p-8">
            <h1 className="text-xl font-bold">No Dashboard Assigned</h1>
            <p>Please contact support to assign a role to your account.</p>
        </div>
    );
};

export default DashboardPage;