import { Navigate, Outlet } from 'react-router-dom';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loggedInRole, loading } = useAuthApi();

    // 1. While loading is true, stay here and show spinner
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4591]"></div>
            </div>
        );
    }

    // 2. If loading is finished and user is still null/undefined, redirect
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If roles are required, check them
    if (allowedRoles && !allowedRoles.includes(loggedInRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};


export default ProtectedRoute;
