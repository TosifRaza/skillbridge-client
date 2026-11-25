import { Outlet } from 'react-router-dom';
import BrandLogo from '@/components/ui/BrandLogo';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-soft w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandLogo markClassName="h-14 w-14" wordmarkClassName="text-3xl font-extrabold tracking-tight text-primary-700 dark:text-violet-300" />
          <p className="text-slate-500 mt-1">Every skill gets an opportunity</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
