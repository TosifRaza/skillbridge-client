import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { syncAuthRole } from '@/store/slices/authSlice';
import { getAuthForRole } from '@/utils/authStorage';

const WorkerRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // If another tab logged in as customer/admin, but worker session exists in storage, sync Redux!
  const workerAuth = getAuthForRole('provider');

  useEffect(() => {
    if (user?.role !== 'provider' && workerAuth) {
      dispatch(syncAuthRole('provider'));
    }
  }, [user?.role, workerAuth, dispatch]);

  const effectiveUser = user?.role === 'provider' ? user : (workerAuth ? workerAuth.user : user);
  const effectiveToken = user?.role === 'provider' ? accessToken : (workerAuth ? workerAuth.token : accessToken);

  if (!effectiveToken || !effectiveUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (effectiveUser.isBlocked) {
    return <Navigate to="/auth/login?blocked=true" replace />;
  }

  if (!workerAuth && effectiveUser.role === 'customer') return <Navigate to="/customer/home" replace />;
  if (!workerAuth && effectiveUser.role === 'admin') return <Navigate to="/admin" replace />;

  return children;
};

export default WorkerRoute;
