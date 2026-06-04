import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { user, accessToken } = useAppSelector((state) => state.auth); // FIX: accessToken

  if (!accessToken || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.isBlocked) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('skillbridge_user');
    return <Navigate to="/auth/login?blocked=true" replace />;
  }

  if (user.role === 'customer') return <Navigate to="/customer/home" replace />;
  if (user.role === 'provider') return <Navigate to="/worker/home" replace />;

  return children;
};

export default AdminRoute;