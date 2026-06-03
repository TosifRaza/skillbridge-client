// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem('accessToken');
//   const location = useLocation();

//   // Mock user role extraction (will be replaced by Redux state in Step 13)
//   let userRole = null;
//   const storedUser = localStorage.getItem('user');
//   if (storedUser) {
//     try {
//       userRole = JSON.parse(storedUser).role;
//     } catch (e) {
//       userRole = null;
//     }
//   }

//   if (!token || !userRole) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
// }

//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const { user, accessToken } = useAppSelector(
    (state) => state.auth
  );

  if (!accessToken) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.isBlocked) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('skillbridge_user');

    return (
      <Navigate
        to="/auth/login"
        state={{ blocked: true }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;