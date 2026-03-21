import { Navigate } from 'react-router-dom';
import { useAuthApi } from './provider/AuthApiProvider';
import SimpleLoader from "./component/common/SimpleLoader.jsx";

const RootRedirect = () => {
    const { isAuthenticated, loggedInRole, loading } = useAuthApi();

    if (loading)  return <SimpleLoader />; // Or a loader

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    console.log('loggedInRole -- ', loggedInRole);
    // Redirect based on Role
    switch (loggedInRole) {
        case 'ROLE_ADMIN':
        case 'ROLE_OPERATIONS_MANAGER':
            return <Navigate to="/dashboard" replace />;
        case 'ROLE_OPERATIONS':
            return <Navigate to="/ops-dashboard" replace />;
        default:
            return <Navigate to="/unauthorized" replace />;
    }
};

export default RootRedirect;