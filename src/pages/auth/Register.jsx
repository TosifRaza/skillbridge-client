import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser, clearAuthError } from '@/store/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Register = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '', role: 'customer' });
  const { email, password, role } = formData;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      
      // HARD REDIRECT
      const registeredRole = result.user.role;
      if (registeredRole === 'provider') window.location.href = '/worker/home';
      else window.location.href = '/customer/home';

    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-surface-900 dark:text-white mb-2">Join SkillBridge</h2>
      <p className="text-center text-surface-500 dark:text-surface-400 mb-8">Find the perfect opportunity or the perfect talent</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Email Address" 
          type="email" 
          name="email"
          value={email} 
          onChange={handleChange} 
          placeholder="you@example.com"
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          name="password"
          value={password} 
          onChange={handleChange} 
          placeholder="Min. 8 characters"
          required 
        />

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">I want to:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`p-4 border-2 rounded-xl text-left transition-all ${role === 'customer' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-glow' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'}`}
            >
              <span className="text-2xl">🏠</span>
              <p className="font-semibold mt-2 text-surface-900 dark:text-white">Hire for Jobs</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Find local & digital experts</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'provider' })}
              className={`p-4 border-2 rounded-xl text-left transition-all ${role === 'provider' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-glow' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'}`}
            >
              <span className="text-2xl">🛠️</span>
              <p className="font-semibold mt-2 text-surface-900 dark:text-white">Find Work</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Offer your professional skills</p>
            </button>
          </div>
        </div>

        <Button type="submit" isLoading={loading} className="w-full shadow-glow">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;