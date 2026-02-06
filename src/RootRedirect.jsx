import { Navigate } from 'react-router-dom';
import { useAuthApi } from './provider/AuthApiProvider';
import SimpleLoader from "./component/common/SimpleLoader.jsx";

const RootRedirect = () => {
    const { isAuthenticated, loggedInRole, loading } = useAuthApi();

    if (loading)  return <SimpleLoader />; // Or a loader

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on Role
    switch (loggedInRole) {
        case 'ADMIN':
            return <Navigate to="/organisation-dashboard" replace />;
        case 'OPERATION':
            return <Navigate to="/ops-dashboard" replace />;
        default:
            return <Navigate to="/dashboard" replace />;
    }
};

export default RootRedirect;