import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-soft w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-600">SkillBridge</h1>
          <p className="text-slate-500 mt-1">Every skill gets an opportunity</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;