// import { useSelector } from 'react-redux';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';

// const ProtectedRoute = () => {
//     const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
//     const location = useLocation();

//     if (isLoading) {
//         return <div>Loading...</div>; // Or a proper loading spinner
//     }

//     return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
// };

// export default ProtectedRoute;

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Optional: Check if user is verified
    if (user && !user.isVerified) {
        return <Navigate to="/verify-account" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;