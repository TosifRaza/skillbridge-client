import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearAuthError } from '@/store/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      const role = result.user.role;
      const defaultPath = role === 'admin' ? '/admin' : role === 'provider' ? '/worker/home' : '/customer/home';
      const requestedRoute = location.state?.from;
      const requestedPath = requestedRoute?.pathname;
      const requestedUrl = requestedPath
        ? `${requestedPath}${requestedRoute.search || ''}${requestedRoute.hash || ''}`
        : null;
      const allowedPrefix = role === 'admin' ? '/admin' : role === 'provider' ? '/worker/' : '/customer/';
      const canReturnToRequestedPage = requestedPath && (
        requestedPath === allowedPrefix || requestedPath.startsWith(allowedPrefix)
      );
      navigate(canReturnToRequestedPage ? requestedUrl : defaultPath, { replace: true });

    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-surface-900 dark:text-white mb-6">Sign In</h2>
      
      {error && <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">⚠️ {error}</div>}

      <Input 
        label="Email Address" 
        type="email" 
        autoComplete="email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <Input 
        label="Password" 
        type="password" 
        autoComplete="current-password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />

      <Button type="submit" isLoading={loading} className="w-full shadow-glow">
        Sign In
      </Button>

      <p className="text-center text-sm text-surface-600 dark:text-surface-400 mt-4">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default Login;
