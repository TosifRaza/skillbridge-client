import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { syncAuthRole } from '@/store/slices/authSlice';
import { getAuthForRole } from '@/utils/authStorage';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // If another tab logged in, but admin session exists in storage, sync Redux!
  const adminAuth = getAuthForRole('admin');

  useEffect(() => {
    if (user?.role !== 'admin' && adminAuth) {
      dispatch(syncAuthRole('admin'));
    }
  }, [user?.role, adminAuth, dispatch]);

  const effectiveUser = user?.role === 'admin' ? user : (adminAuth ? adminAuth.user : user);
  const effectiveToken = user?.role === 'admin' ? accessToken : (adminAuth ? adminAuth.token : accessToken);

  if (!effectiveToken || !effectiveUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (effectiveUser.isBlocked) {
    return <Navigate to="/auth/login?blocked=true" replace />;
  }

  if (!adminAuth && effectiveUser.role === 'customer') return <Navigate to="/customer/home" replace />;
  if (!adminAuth && effectiveUser.role === 'provider') return <Navigate to="/worker/home" replace />;

  return children;
};

export default AdminRoute;
