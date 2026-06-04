import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

const CustomerRoute = ({ children }) => {
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

  if (user.role === 'provider') return <Navigate to="/worker/home" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  return children;
};

export default CustomerRoute;