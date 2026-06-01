import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearAuthError } from '@/store/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      // Redirect based on role
      const role = result.payload.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'provider') navigate('/dashboard');
      else navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Sign In</h2>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      <Input 
        label="Email Address" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <Input 
        label="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />

      <Button type="submit" isLoading={loading} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-600 mt-4">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary-600 hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default Login;




// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { loginUser, clearAuthError } from '@/store/slices/authSlice';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';

// const Login = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useAppSelector((state) => state.auth);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(clearAuthError());
//     const result = await dispatch(loginUser({ email, password }));
    
//     if (loginUser.fulfilled.match(result)) {
//       const role = result.payload.user.role;
//       if (role === 'admin') navigate('/admin/dashboard');
//       else if (role === 'provider') navigate('/dashboard/browse-jobs');
//       else navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="animate-fade-in">
//       <h2 className="text-2xl font-bold text-center text-surface-900 mb-2">Welcome Back</h2>
//       <p className="text-center text-surface-500 mb-8">Sign in to your SkillBridge account</p>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
//           <span className="mr-2">⚠️</span> {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <Input 
//           label="Email Address" 
//           type="email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//           placeholder="you@example.com"
//           required 
//         />
//         <Input 
//           label="Password" 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           placeholder="••••••••"
//           required 
//         />

//         <Button type="submit" isLoading={loading} className="w-full shadow-glow">
//           Sign In
//         </Button>
//       </form>

//       <p className="text-center text-sm text-surface-500 mt-6">
//         Don't have an account?{' '}
//         <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
//           Create one
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Login;