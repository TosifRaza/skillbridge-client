import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  // Mock user role extraction (will be replaced by Redux state in Step 13)
  let userRole = null;
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      userRole = JSON.parse(storedUser).role;
    } catch (e) {
      userRole = null;
    }
  }

  if (!token || !userRole) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
}

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;