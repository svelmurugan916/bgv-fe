import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import OperationsDashboard from "./OperationsDashboard.jsx";

const DashboardPage = () => {
    const { loggedInRole, loading } = useAuthApi();

    if (loading) return null; // Or a spinner

    if (loggedInRole === "ROLE_ADMIN") return <AdminDashboard />;
    if (loggedInRole === "ROLE_OPERATIONS_MANAGER") return <OperationsDashboard />;

    return (
        <div className="p-8">
            <h1 className="text-xl font-bold">No Dashboard Assigned</h1>
            <p>Please contact support to assign a role to your account.</p>
        </div>
    );
};

export default DashboardPage;