import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { syncAuthRole } from '@/store/slices/authSlice';
import { getAuthForRole } from '@/utils/authStorage';

const CustomerRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // If another tab logged in as worker/admin, but customer session exists in storage, sync Redux!
  const customerAuth = getAuthForRole('customer');

  useEffect(() => {
    if (user?.role !== 'customer' && customerAuth) {
      dispatch(syncAuthRole('customer'));
    }
  }, [user?.role, customerAuth, dispatch]);

  const effectiveUser = user?.role === 'customer' ? user : (customerAuth ? customerAuth.user : user);
  const effectiveToken = user?.role === 'customer' ? accessToken : (customerAuth ? customerAuth.token : accessToken);

  if (!effectiveToken || !effectiveUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (effectiveUser.isBlocked) {
    return <Navigate to="/auth/login?blocked=true" replace />;
  }

  if (!customerAuth && effectiveUser.role === 'provider') return <Navigate to="/worker/home" replace />;
  if (!customerAuth && effectiveUser.role === 'admin') return <Navigate to="/admin" replace />;

  return children;
};

export default CustomerRoute;
