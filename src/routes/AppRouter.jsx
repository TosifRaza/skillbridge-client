// // import { createBrowserRouter } from 'react-router-dom';
// // import PublicLayout from '@/components/layout/PublicLayout';
// // import AuthLayout from '@/components/layout/AuthLayout';
// // import DashboardLayout from '@/components/layout/DashboardLayout';
// // import ProtectedRoute from '@/routes/ProtectedRoute';

// // // Placeholder pages (Will be built out in later steps)
// // const LandingPage = () => <div className="p-8 text-2xl font-bold">Welcome to SkillBridge Landing Page</div>;
// // const LoginPage = () => <div>Login Form Goes Here</div>;
// // const RegisterPage = () => <div>Register Form Goes Here</div>;
// // const CustomerDashboard = () => <div>Customer Dashboard Content</div>;

// // export const appRouter = createBrowserRouter([
// //   {
// //     element: <PublicLayout />,
// //     children: [
// //       { path: '/', element: <LandingPage /> },
// //     ],
// //   },
// //   {
// //     element: <AuthLayout />,
// //     children: [
// //       { path: '/login', element: <LoginPage /> },
// //       { path: '/register', element: <RegisterPage /> },
// //     ],
// //   },
// //   {
// //     element: (
// //       <ProtectedRoute>
// //         <DashboardLayout />
// //       </ProtectedRoute>
// //     ),
// //     children: [
// //       { path: '/dashboard', element: <CustomerDashboard /> },
// //     ],
// //   },
// // ]);


// import { createBrowserRouter } from 'react-router-dom';
// import PublicLayout from '@/components/layout/PublicLayout';
// import AuthLayout from '@/components/layout/AuthLayout';
// import DashboardLayout from '@/components/layout/DashboardLayout';
// import ProtectedRoute from '@/routes/ProtectedRoute';

// // Import the real pages
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import Dashboard from '@/pages/Dashboard';

// const LandingPage = () => <div className="p-8 text-center"><h1 className="text-4xl font-bold text-primary-600 mb-4">Every problem gets a solution.</h1><p className="text-xl text-slate-600">The marketplace for local labor, home services, and digital freelancing.</p></div>;

// export const appRouter = createBrowserRouter([
//   {
//     element: <PublicLayout />,
//     children: [
//       { path: '/', element: <LandingPage /> },
//     ],
//   },
//   {
//     element: <AuthLayout />,
//     children: [
//       { path: '/login', element: <Login /> },
//       { path: '/register', element: <Register /> },
//     ],
//   },
//   {
//     element: (
//       <ProtectedRoute>
//         <DashboardLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: '/dashboard', element: <Dashboard /> },
//     ],
//   },
// ]);



// import { createBrowserRouter } from 'react-router-dom';

// import PublicLayout from '@/components/layout/PublicLayout';
// import AuthLayout from '@/components/layout/AuthLayout';
// import DashboardLayout from '@/components/layout/DashboardLayout';
// import ProtectedRoute from '@/routes/ProtectedRoute';

// // Pages
// import LandingPage from '@/pages/LandingPage';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import Dashboard from '@/pages/Dashboard';
// import MyJobs from '../pages/MyJobs';
// import Chat from '../pages/Chat';
// import Profile from '../pages/Profile';
// import PostJob from '../pages/PostJob';

// export const appRouter = createBrowserRouter([
//   {
//     element: <PublicLayout />,
//     children: [
//       { path: '/', element: <LandingPage /> },
//     ],
//   },

//   {
//     element: <AuthLayout />,
//     children: [
//       { path: '/login', element: <Login /> },
//       { path: '/register', element: <Register /> },
//     ],
//   },

//   {
//     element: (
//       <ProtectedRoute>
//         <DashboardLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: '/dashboard', element: <Dashboard /> },
//       { path: '/dashboard/jobs', element: <MyJobs /> },      // <-- ADDED
//       { path: '/dashboard/chat', element: <Chat /> },         // <-- ADDED
//       { path: '/dashboard/profile', element: <Profile /> },   // <-- ADDED
//        { path: '/dashboard/post-job', element: <PostJob /> },
//     ],
//   },
// ]);






// import { createBrowserRouter } from 'react-router-dom';
// import PublicLayout from '@/components/layout/PublicLayout';
// import DashboardLayout from '@/components/layout/DashboardLayout';
// import ProtectedRoute from '@/routes/ProtectedRoute';

// // Public & Auth Pages
// import LandingPage from '@/pages/LandingPage';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';

// // Dashboard Pages
// import Dashboard from '@/pages/Dashboard';
// import PostJob from '@/pages/PostJob';
// import MyJobs from '@/pages/MyJobs';
// import JobDetail from '@/pages/JobDetail'; // Important for Phase 4!
// import Chat from '@/pages/Chat';
// import Profile from '@/pages/Profile';

// export const appRouter = createBrowserRouter([
//   // Public Routes
//   {
//     element: <PublicLayout />,
//     children: [
//       { path: '/', element: <LandingPage /> },
//     ],
//   },
  
//   // Auth Routes
//   {
//     path: '/login',
//     element: <div className="min-h-screen flex items-center justify-center bg-surface-50"><div className="glass-card p-8 w-full max-w-md"><Login /></div></div>,
//   },
//   {
//     path: '/register',
//     element: <div className="min-h-screen flex items-center justify-center bg-surface-50"><div className="glass-card p-8 w-full max-w-md"><Register /></div></div>,
//   },

//   // Protected Dashboard Routes
//   {
//     element: (
//       <ProtectedRoute>
//         <DashboardLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: '/dashboard', element: <Dashboard /> },
//       { path: '/dashboard/post-job', element: <PostJob /> }, // <-- ENSURE THIS EXISTS
//       { path: '/dashboard/jobs', element: <MyJobs /> },
//       { path: '/dashboard/jobs/:id', element: <JobDetail /> }, // <-- ENSURE THIS EXISTS
//       { path: '/dashboard/chat', element: <Chat /> },
//       { path: '/dashboard/profile', element: <Profile /> },
//     ],
//   },
// ]);

import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';

// Public Marketing Pages
import HomePage from '@/pages/public/HomePage';
import ServicesPage from '@/pages/public/ServicesPage';
import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
import HowItWorksPage from '@/pages/public/HowItWorksPage';
import SafetyPage from '@/pages/public/SafetyPage';
import PricingPage from '@/pages/public/PricingPage';
import ContactPage from '@/pages/public/ContactPage'; // NEW

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Dashboard Pages (Keeping these alive for Phase 2 transition)
import Dashboard from '@/pages/dashboard/Dashboard';
import PostJob from '@/pages/dashboard/PostJob';
import MyJobs from '@/pages/dashboard/MyJobs';
import JobDetail from '@/pages/dashboard/JobDetail';
import Chat from '@/pages/dashboard/Chat';
import Profile from '@/pages/dashboard/Profile';

export const appRouter = createBrowserRouter([
  // ==========================================
  // PUBLIC MARKETING ROUTES
  // ==========================================
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/services/:slug', element: <ServiceDetailPage /> }, // FIXED: Plural to match constants
      { path: '/become-provider', element: <BecomeProviderPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/safety', element: <SafetyPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/contact', element: <ContactPage /> }, // NEW
    ],
  },

  // ==========================================
  // AUTH ROUTES
  // ==========================================
  {
    path: '/auth/login',
    element: <div className="min-h-screen flex items-center justify-center bg-surface-50"><div className="glass-card p-8 w-full max-w-md"><Login /></div></div>,
  },
  {
    path: '/auth/register',
    element: <div className="min-h-screen flex items-center justify-center bg-surface-50"><div className="glass-card p-8 w-full max-w-md"><Register /></div></div>,
  },

  // ==========================================
  // PROTECTED DASHBOARD ROUTES (Temporary until Phase 2)
  // ==========================================
  {
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/dashboard/post-job', element: <PostJob /> },
      { path: '/dashboard/jobs', element: <MyJobs /> },
      { path: '/dashboard/jobs/:id', element: <JobDetail /> },
      { path: '/dashboard/chat', element: <Chat /> },
      { path: '/dashboard/profile', element: <Profile /> },
    ],
  },
]);