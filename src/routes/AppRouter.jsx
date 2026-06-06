// // // // import { createBrowserRouter, Navigate } from 'react-router-dom';
// // // // import PublicLayout from '@/components/layout/PublicLayout';
// // // // import CustomerLayout from '@/components/layout/CustomerLayout';
// // // // import WorkerLayout from '@/components/layout/WorkerLayout';
// // // // import DashboardLayout from '@/components/layout/DashboardLayout'; // Fallback for Admin temporarily

// // // // // Route Guards
// // // // import ProtectedRoute from '@/routes/ProtectedRoute';
// // // // import CustomerRoute from '@/routes/CustomerRoute';
// // // // import WorkerRoute from '@/routes/WorkerRoute';
// // // // import AdminRoute from '@/routes/AdminRoute';

// // // // // Public Marketing Pages
// // // // import HomePage from '@/pages/public/HomePage';
// // // // import ServicesPage from '@/pages/public/ServicesPage';
// // // // import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
// // // // import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
// // // // import HowItWorksPage from '@/pages/public/HowItWorksPage';
// // // // import SafetyPage from '@/pages/public/SafetyPage';
// // // // import PricingPage from '@/pages/public/PricingPage';
// // // // import ContactPage from '@/pages/public/ContactPage';

// // // // // Auth Pages
// // // // import Login from '@/pages/auth/Login';
// // // // import Register from '@/pages/auth/Register';

// // // // // Portal Home Pages
// // // // import CustomerHome from '@/pages/customer/CustomerHome';
// // // // import WorkerHome from '@/pages/worker/WorkerHome';

// // // // // Temporarily importing old Dashboard pages until we build out all Portal pages in Phase 3/4
// // // // import Dashboard from '@/pages/dashboard/Dashboard';
// // // // import PostJob from '@/pages/dashboard/PostJob';
// // // // import MyJobs from '@/pages/dashboard/MyJobs';
// // // // import JobDetail from '@/pages/dashboard/JobDetail';
// // // // import Chat from '@/pages/dashboard/Chat';
// // // // import Profile from '@/pages/dashboard/Profile';



// // // // import CustomerServices from '@/pages/customer/CustomerServices';
// // // // import WorkerProfile from '@/pages/customer/WorkerProfile';
// // // // import MyJobs from '@/pages/customer/MyJobs';
// // // // import JobDetail from '@/pages/customer/JobDetail';
// // // // import CustomerProfile from '@/pages/customer/CustomerProfile';

// // // // export const appRouter = createBrowserRouter([
// // // //   // ==========================================
// // // //   // PUBLIC MARKETING ROUTES
// // // //   // ==========================================
// // // //   {
// // // //     element: <PublicLayout />,
// // // //     children: [
// // // //       { path: '/', element: <HomePage /> },
// // // //       { path: '/services', element: <ServicesPage /> },
// // // //       { path: '/services/:slug', element: <ServiceDetailPage /> },
// // // //       { path: '/become-provider', element: <BecomeProviderPage /> },
// // // //       { path: '/how-it-works', element: <HowItWorksPage /> },
// // // //       { path: '/safety', element: <SafetyPage /> },
// // // //       { path: '/pricing', element: <PricingPage /> },
// // // //       { path: '/contact', element: <ContactPage /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // AUTH ROUTES (Dark mode wrappers added)
// // // //   // ==========================================
// // // //   {
// // // //     path: '/auth/login',
// // // //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Login /></div></div>,
// // // //   },
// // // //   {
// // // //     path: '/auth/register',
// // // //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Register /></div></div>,
// // // //   },

// // // //   // ==========================================
// // // //   // CUSTOMER PORTAL ROUTES
// // // //   // ==========================================
// // // //   {
// // // //     element: <CustomerRoute><CustomerLayout /></CustomerRoute>,
// // // //     children: [
// // // //       { path: '/customer/home', element: <CustomerHome /> },
// // // //       { path: '/customer/jobs', element: <MyJobs /> },
// // // //       { path: '/customer/jobs/post', element: <PostJob /> },
// // // //       { path: '/customer/jobs/:id', element: <JobDetail /> },
// // // //       { path: '/customer/chat', element: <Chat /> },
// // // //       { path: '/customer/profile', element: <Profile /> },
// // // //     ],
// // // //   },

// // // //   // Update Customer Portal children:
// // // //   {
// // // //     element: <CustomerRoute><CustomerLayout /></CustomerRoute>,
// // // //     children: [
// // // //       { path: '/customer/home', element: <CustomerHome /> },
// // // //       { path: '/customer/services', element: <CustomerServices /> },
// // // //       { path: '/customer/worker/:id', element: <WorkerProfile /> },
// // // //       { path: '/customer/jobs', element: <MyJobs /> },
// // // //       { path: '/customer/jobs/post', element: <PostJob /> },
// // // //       { path: '/customer/jobs/:id', element: <JobDetail /> },
// // // //       { path: '/customer/profile', element: <CustomerProfile /> },
// // // //     ],
// // // //   },
// // // //   // ==========================================
// // // //   // WORKER PORTAL ROUTES
// // // //   // ==========================================
// // // //   {
// // // //     element: <WorkerRoute><WorkerLayout /></WorkerRoute>,
// // // //     children: [
// // // //       { path: '/worker/home', element: <WorkerHome /> },
// // // //       { path: '/worker/jobs', element: <MyJobs /> },
// // // //       { path: '/worker/jobs/:id', element: <JobDetail /> },
// // // //       { path: '/worker/chat', element: <Chat /> },
// // // //       { path: '/worker/profile', element: <Profile /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // ADMIN PORTAL ROUTES (Using old layout temporarily)
// // // //   // ==========================================
// // // //   {
// // // //     element: <AdminRoute><DashboardLayout /></AdminRoute>,
// // // //     children: [
// // // //       { path: '/admin', element: <Dashboard /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // FALLBACK / REDIRECTS
// // // //   // ==========================================
// // // //   {
// // // //     // Old dashboard routes redirect to new customer routes to prevent 404s
// // // //     path: '/dashboard',
// // // //     element: <Navigate to="/customer/home" replace />,
// // // //   },
// // // //   {
// // // //     path: '/dashboard/jobs',
// // // //     element: <Navigate to="/customer/jobs" replace />,
// // // //   },
// // // //   {
// // // //     path: '*',
// // // //     element: <Navigate to="/" replace />,
// // // //   },
// // // // ]);












// // // // import { createBrowserRouter, Navigate } from 'react-router-dom';
// // // // import PublicLayout from '@/components/layout/PublicLayout';
// // // // import CustomerLayout from '@/components/layout/CustomerLayout';
// // // // import WorkerLayout from '@/components/layout/WorkerLayout';
// // // // import DashboardLayout from '@/components/layout/DashboardLayout'; // Temp for Admin

// // // // // Route Guards
// // // // import ProtectedRoute from '@/routes/ProtectedRoute';
// // // // import CustomerRoute from '@/routes/CustomerRoute';
// // // // import WorkerRoute from '@/routes/WorkerRoute';
// // // // import AdminRoute from '@/routes/AdminRoute';

// // // // // Public Marketing Pages
// // // // import HomePage from '@/pages/public/HomePage';
// // // // import ServicesPage from '@/pages/public/ServicesPage';
// // // // import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
// // // // import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
// // // // import HowItWorksPage from '@/pages/public/HowItWorksPage';
// // // // import SafetyPage from '@/pages/public/SafetyPage';
// // // // import PricingPage from '@/pages/public/PricingPage';
// // // // import ContactPage from '@/pages/public/ContactPage';

// // // // // Auth Pages
// // // // import Login from '@/pages/auth/Login';
// // // // import Register from '@/pages/auth/Register';

// // // // // ==========================================
// // // // // CUSTOMER PORTAL PAGES (New Structure)
// // // // // ==========================================
// // // // import CustomerHome from '@/pages/customer/CustomerHome';
// // // // import CustomerServices from '@/pages/customer/CustomerServices';
// // // // import WorkerProfile from '@/pages/customer/WorkerProfile';
// // // // import CustomerMyJobs from '@/pages/customer/MyJobs';
// // // // import CustomerJobDetail from '@/pages/customer/JobDetail';
// // // // import CustomerProfile from '@/pages/customer/CustomerProfile';
// // // // import PostJob from '@/pages/dashboard/PostJob'; // Keeping here temporarily, will move later

// // // // // ==========================================
// // // // // WORKER PORTAL PAGES (Old Structure - Temp)
// // // // // ==========================================
// // // // import Dashboard from '@/pages/dashboard/Dashboard';
// // // // import MyJobs from '@/pages/dashboard/MyJobs';
// // // // import JobDetail from '@/pages/dashboard/JobDetail';
// // // // import Chat from '@/pages/dashboard/Chat';
// // // // import Profile from '@/pages/dashboard/Profile';

// // // // export const appRouter = createBrowserRouter([
// // // //   // ==========================================
// // // //   // PUBLIC MARKETING ROUTES
// // // //   // ==========================================
// // // //   {
// // // //     element: <PublicLayout />,
// // // //     children: [
// // // //       { path: '/', element: <HomePage /> },
// // // //       { path: '/services', element: <ServicesPage /> },
// // // //       { path: '/services/:slug', element: <ServiceDetailPage /> },
// // // //       { path: '/become-provider', element: <BecomeProviderPage /> },
// // // //       { path: '/how-it-works', element: <HowItWorksPage /> },
// // // //       { path: '/safety', element: <SafetyPage /> },
// // // //       { path: '/pricing', element: <PricingPage /> },
// // // //       { path: '/contact', element: <ContactPage /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // AUTH ROUTES
// // // //   // ==========================================
// // // //   {
// // // //     path: '/auth/login',
// // // //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Login /></div></div>,
// // // //   },
// // // //   {
// // // //     path: '/auth/register',
// // // //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Register /></div></div>,
// // // //   },

// // // //   // ==========================================
// // // //   // CUSTOMER PORTAL ROUTES (Using New Files)
// // // //   // ==========================================
// // // //   {
// // // //     element: <CustomerRoute><CustomerLayout /></CustomerRoute>,
// // // //     children: [
// // // //       { path: '/customer/home', element: <CustomerHome /> },
// // // //       { path: '/customer/services', element: <CustomerServices /> },
// // // //       { path: '/customer/worker/:id', element: <WorkerProfile /> },
// // // //       { path: '/customer/jobs', element: <CustomerMyJobs /> },
// // // //       { path: '/customer/jobs/post', element: <PostJob /> },
// // // //       { path: '/customer/jobs/:id', element: <CustomerJobDetail /> },
// // // //       { path: '/customer/profile', element: <CustomerProfile /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // WORKER PORTAL ROUTES (Using Old Files Temp)
// // // //   // ==========================================
// // // //   {
// // // //     element: <WorkerRoute><WorkerLayout /></WorkerRoute>,
// // // //     children: [
// // // //       { path: '/worker/home', element: <Dashboard /> },
// // // //       { path: '/worker/jobs', element: <MyJobs /> },
// // // //       { path: '/worker/jobs/:id', element: <JobDetail /> },
// // // //       { path: '/worker/chat', element: <Chat /> },
// // // //       { path: '/worker/profile', element: <Profile /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // ADMIN PORTAL ROUTES (Temp)
// // // //   // ==========================================
// // // //   {
// // // //     element: <AdminRoute><DashboardLayout /></AdminRoute>,
// // // //     children: [
// // // //       { path: '/admin', element: <Dashboard /> },
// // // //     ],
// // // //   },

// // // //   // ==========================================
// // // //   // FALLBACK / REDIRECTS
// // // //   // ==========================================
// // // //   {
// // // //     path: '/dashboard',
// // // //     element: <Navigate to="/customer/home" replace />,
// // // //   },
// // // //   {
// // // //     path: '/dashboard/jobs',
// // // //     element: <Navigate to="/customer/jobs" replace />,
// // // //   },
// // // //   {
// // // //     path: '*',
// // // //     element: <Navigate to="/" replace />,
// // // //   },
// // // // ]);










// // // import { createBrowserRouter, Navigate } from 'react-router-dom';
// // // import PublicLayout from '@/components/layout/PublicLayout';
// // // import CustomerLayout from '@/components/layout/CustomerLayout';
// // // import WorkerLayout from '@/components/layout/WorkerLayout';
// // // import DashboardLayout from '@/components/layout/DashboardLayout';

// // // // Route Guards
// // // import ProtectedRoute from '@/routes/ProtectedRoute';
// // // import CustomerRoute from '@/routes/CustomerRoute';
// // // import WorkerRoute from '@/routes/WorkerRoute';
// // // import AdminRoute from '@/routes/AdminRoute';

// // // // Public Marketing Pages
// // // import HomePage from '@/pages/public/HomePage';
// // // import ServicesPage from '@/pages/public/ServicesPage';
// // // import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
// // // import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
// // // import HowItWorksPage from '@/pages/public/HowItWorksPage';
// // // import SafetyPage from '@/pages/public/SafetyPage';
// // // import PricingPage from '@/pages/public/PricingPage';
// // // import ContactPage from '@/pages/public/ContactPage';

// // // // Auth Pages
// // // import Login from '@/pages/auth/Login';
// // // import Register from '@/pages/auth/Register';

// // // // Customer Portal Pages
// // // import CustomerHome from '@/pages/customer/CustomerHome';
// // // import CustomerServices from '@/pages/customer/CustomerServices';
// // // // import WorkerProfile from '@/pages/customer/WorkerProfile';
// // // import CustomerMyJobs from '@/pages/customer/MyJobs';
// // // import CustomerJobDetail from '@/pages/customer/JobDetail';
// // // import CustomerProfile from '@/pages/customer/CustomerProfile';
// // // import PostJob from '@/pages/dashboard/PostJob';

// // // // Worker Portal Pages
// // // import Dashboard from '@/pages/dashboard/Dashboard';
// // // import MyJobs from '@/pages/dashboard/MyJobs';
// // // import JobDetail from '@/pages/dashboard/JobDetail';
// // // import Chat from '@/pages/dashboard/Chat';
// // // import Profile from '@/pages/dashboard/Profile';


// // // import WorkerHome from '@/pages/worker/WorkerHome';
// // // import BrowseJobs from '@/pages/worker/BrowseJobs';
// // // // We will create these in the next step, temporarily pointing to old files
// // // // import MyContracts from '@/pages/dashboard/MyJobs'; 
// // // import WorkerJobDetail from '@/pages/worker/WorkerJobDetail';
// // // import MyContracts from '@/pages/worker/MyContracts';
// // // import WorkerProfile from '@/pages/worker/WorkerProfile';
// // // // import JobDetail from '@/pages/dashboard/JobDetail'; 
// // // import CustomerChat from '@/pages/customer/CustomerChat';
// // // import WorkerChat from '@/pages/worker/WorkerChat';
// // // // import Chat from '@/pages/dashboard/Chat';
// // // // import Profile from '@/pages/dashboard/Profile';

// // // export const appRouter = createBrowserRouter([
// // //   // ==========================================
// // //   // PUBLIC MARKETING ROUTES
// // //   // ==========================================
// // //   {
// // //     element: <PublicLayout />,
// // //     children: [
// // //       { path: '/', element: <HomePage /> },
// // //       { path: '/services', element: <ServicesPage /> },
// // //       { path: '/services/:slug', element: <ServiceDetailPage /> },
// // //       { path: '/become-provider', element: <BecomeProviderPage /> },
// // //       { path: '/how-it-works', element: <HowItWorksPage /> },
// // //       { path: '/safety', element: <SafetyPage /> },
// // //       { path: '/pricing', element: <PricingPage /> },
// // //       { path: '/contact', element: <ContactPage /> },
// // //     ],
// // //   },

// // //   // ==========================================
// // //   // AUTH ROUTES
// // //   // ==========================================
// // //   {
// // //     path: '/auth/login',
// // //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Login /></div></div>,
// // //   },
// // //   {
// // //     path: '/auth/register',
// // //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Register /></div></div>,
// // //   },

// // //   // ==========================================
// // //   // CUSTOMER PORTAL ROUTES
// // //   // ==========================================
// // //   {
// // //     element: <CustomerRoute><CustomerLayout /></CustomerRoute>,
// // //     children: [
// // //       { path: '/customer/home', element: <CustomerHome /> },
// // //       { path: '/customer/services', element: <CustomerServices /> },
// // //       { path: '/customer/worker/:id', element: <WorkerProfile /> },
// // //       { path: '/customer/jobs', element: <CustomerMyJobs /> },
// // //       { path: '/customer/jobs/post', element: <PostJob /> },
// // //       { path: '/customer/jobs/:id', element: <CustomerJobDetail /> },
// // //       { path: '/customer/profile', element: <CustomerProfile /> },
// // //       { path: '/customer/chat', element: <Chat /> },
// // //       { path: '/customer/chat', element: <CustomerChat /> },
// // //     ],
// // //   },

// // //   // ==========================================
// // //   // WORKER PORTAL ROUTES
// // //   // ==========================================
// // //   // {
// // //   //   element: <WorkerRoute><WorkerLayout /></WorkerRoute>,
// // //   //   children: [
// // //   //     { path: '/worker/home', element: <Dashboard /> },
// // //   //     { path: '/worker/jobs', element: <MyJobs /> },
// // //   //     { path: '/worker/jobs/:id', element: <JobDetail /> },
// // //   //     { path: '/worker/chat', element: <Chat /> },
// // //   //     { path: '/worker/profile', element: <Profile /> },
// // //   //   ],
// // //   // },
// // //   {
// // //     element: <WorkerRoute><WorkerLayout /></WorkerRoute>,
// // //     children: [
// // //       { path: '/worker/home', element: <WorkerHome /> },
// // //       { path: '/worker/jobs', element: <BrowseJobs /> },
// // //       // { path: '/worker/jobs/:id', element: <JobDetail /> },
// // //        { path: '/worker/jobs/:id', element: <WorkerJobDetail /> }, // <-- UPDATED
// // //       { path: '/worker/contracts', element: <MyContracts /> }, // <-- UPDATED
// // //       { path: '/worker/chat', element: <Chat /> },
// // //       { path: '/worker/profile', element: <WorkerProfile /> }, // <-- UPDATED
// // //       { path: '/worker/chat', element: <WorkerChat /> },
// // //     ],
// // //   },

// // //   // ==========================================
// // //   // ADMIN PORTAL ROUTES (Temp)
// // //   // ==========================================
// // //   {
// // //     element: <AdminRoute><DashboardLayout /></AdminRoute>,
// // //     children: [
// // //       { path: '/admin', element: <Dashboard /> },
// // //     ],
// // //   },

// // //   // ==========================================
// // //   // FALLBACK / REDIRECTS
// // //   // ==========================================
// // //   {
// // //     path: '/dashboard',
// // //     element: <Navigate to="/customer/home" replace />,
// // //   },
// // //   {
// // //     path: '/dashboard/jobs',
// // //     element: <Navigate to="/customer/jobs" replace />,
// // //   },
// // //   {
// // //     path: '*',
// // //     element: <Navigate to="/" replace />,
// // //   },
// // // ]);



// // import { createBrowserRouter, Navigate } from 'react-router-dom';

// // // Layouts
// // import PublicLayout from '@/components/layout/PublicLayout';
// // import CustomerLayout from '@/components/layout/CustomerLayout';
// // import WorkerLayout from '@/components/layout/WorkerLayout';
// // import DashboardLayout from '@/components/layout/DashboardLayout'; // Temp for Admin

// // // Route Guards
// // import ProtectedRoute from '@/routes/ProtectedRoute';
// // import CustomerRoute from '@/routes/CustomerRoute';
// // import WorkerRoute from '@/routes/WorkerRoute';
// // import AdminRoute from '@/routes/AdminRoute';

// // // Public Marketing Pages
// // import HomePage from '@/pages/public/HomePage';
// // import ServicesPage from '@/pages/public/ServicesPage';
// // import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
// // import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
// // import HowItWorksPage from '@/pages/public/HowItWorksPage';
// // import SafetyPage from '@/pages/public/SafetyPage';
// // import PricingPage from '@/pages/public/PricingPage';
// // import ContactPage from '@/pages/public/ContactPage';

// // // Auth Pages
// // import Login from '@/pages/auth/Login';
// // import Register from '@/pages/auth/Register';

// // // ==========================================
// // // CUSTOMER PORTAL PAGES
// // // ==========================================
// // import CustomerHome from '@/pages/customer/CustomerHome';
// // import CustomerServices from '@/pages/customer/CustomerServices';
// // import WorkerProfile from '@/pages/customer/WorkerProfile'; // Viewing a worker's profile
// // import CustomerMyJobs from '@/pages/customer/MyJobs';
// // import CustomerJobDetail from '@/pages/customer/JobDetail';
// // import CustomerProfile from '@/pages/customer/CustomerProfile';
// // import CustomerChat from '@/pages/customer/CustomerChat'; // NEW: Real-time chat
// // import PostJob from '@/pages/dashboard/PostJob'; // Temporarily still in dashboard folder

// // // ==========================================
// // // WORKER PORTAL PAGES
// // // ==========================================
// // import WorkerHome from '@/pages/worker/WorkerHome';
// // import BrowseJobs from '@/pages/worker/BrowseJobs';
// // import WorkerJobDetail from '@/pages/worker/WorkerJobDetail';
// // import MyContracts from '@/pages/worker/MyContracts';
// // import WorkerProfile from '@/pages/worker/WorkerProfile';
// // import WorkerChat from '@/pages/worker/WorkerChat'; // NEW: Real-time chat

// // // ==========================================
// // // ADMIN PORTAL PAGES (Temporarily using old Dashboard)
// // // ==========================================
// // import Dashboard from '@/pages/dashboard/Dashboard';

// // export const appRouter = createBrowserRouter([
// //   // ==========================================
// //   // PUBLIC MARKETING ROUTES
// //   // ==========================================
// //   {
// //     element: <PublicLayout />,
// //     children: [
// //       { path: '/', element: <HomePage /> },
// //       { path: '/services', element: <ServicesPage /> },
// //       { path: '/services/:slug', element: <ServiceDetailPage /> },
// //       { path: '/become-provider', element: <BecomeProviderPage /> },
// //       { path: '/how-it-works', element: <HowItWorksPage /> },
// //       { path: '/safety', element: <SafetyPage /> },
// //       { path: '/pricing', element: <PricingPage /> },
// //       { path: '/contact', element: <ContactPage /> },
// //     ],
// //   },

// //   // ==========================================
// //   // AUTH ROUTES
// //   // ==========================================
// //   {
// //     path: '/auth/login',
// //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Login /></div></div>,
// //   },
// //   {
// //     path: '/auth/register',
// //     element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Register /></div></div>,
// //   },

// //   // ==========================================
// //   // CUSTOMER PORTAL ROUTES
// //   // ==========================================
// //   {
// //     element: <CustomerRoute><CustomerLayout /></CustomerRoute>,
// //     children: [
// //       { path: '/customer/home', element: <CustomerHome /> },
// //       { path: '/customer/services', element: <CustomerServices /> },
// //       { path: '/customer/worker/:id', element: <WorkerProfile /> },
// //       { path: '/customer/jobs', element: <CustomerMyJobs /> },
// //       { path: '/customer/jobs/post', element: <PostJob /> },
// //       { path: '/customer/jobs/:id', element: <CustomerJobDetail /> },
// //       { path: '/customer/profile', element: <CustomerProfile /> },
// //       { path: '/customer/chat', element: <CustomerChat /> }, // FIXED: Removed duplicate old Chat import
// //     ],
// //   },

// //   // ==========================================
// //   // WORKER PORTAL ROUTES
// //   // ==========================================
// //   {
// //     element: <WorkerRoute><WorkerLayout /></WorkerRoute>,
// //     children: [
// //       { path: '/worker/home', element: <WorkerHome /> },
// //       { path: '/worker/jobs', element: <BrowseJobs /> },
// //       { path: '/worker/jobs/:id', element: <WorkerJobDetail /> },
// //       { path: '/worker/contracts', element: <MyContracts /> },
// //       { path: '/worker/profile', element: <WorkerProfile /> },
// //       { path: '/worker/chat', element: <WorkerChat /> }, // FIXED: Removed duplicate old Chat import
// //     ],
// //   },

// //   // ==========================================
// //   // ADMIN PORTAL ROUTES (Temp)
// //   // ==========================================
// //   {
// //     element: <AdminRoute><DashboardLayout /></AdminRoute>,
// //     children: [
// //       { path: '/admin', element: <Dashboard /> },
// //     ],
// //   },

// //   // ==========================================
// //   // FALLBACK / REDIRECTS
// //   // ==========================================
// //   {
// //     path: '/dashboard',
// //     element: <Navigate to="/customer/home" replace />,
// //   },
// //   {
// //     path: '/dashboard/jobs',
// //     element: <Navigate to="/customer/jobs" replace />,
// //   },
// //   {
// //     path: '*',
// //     element: <Navigate to="/" replace />,
// //   },
// // ]);
// import { createBrowserRouter, Navigate } from 'react-router-dom';

// // Layouts
// import PublicLayout from '@/components/layout/PublicLayout';
// import CustomerLayout from '@/components/layout/CustomerLayout';
// import WorkerLayout from '@/components/layout/WorkerLayout';
// import DashboardLayout from '@/components/layout/DashboardLayout'; 

// // Route Guards
// import CustomerRoute from '@/routes/CustomerRoute';
// import WorkerRoute from '@/routes/WorkerRoute';
// import AdminRoute from '@/routes/AdminRoute';

// // Public Pages
// import HomePage from '@/pages/public/HomePage';
// import ServicesPage from '@/pages/public/ServicesPage';
// import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
// import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
// import HowItWorksPage from '@/pages/public/HowItWorksPage';
// import SafetyPage from '@/pages/public/SafetyPage';
// import PricingPage from '@/pages/public/PricingPage';
// import ContactPage from '@/pages/public/ContactPage';

// // Auth
// import Login from '@/pages/auth/Login';
// import Register from '@/pages/auth/Register';

// // Customer Pages
// import CustomerHome from '@/pages/customer/CustomerHome';
// import CustomerServices from '@/pages/customer/CustomerServices';
// import ViewWorkerProfile from '@/pages/customer/WorkerProfile';
// import CustomerMyJobs from '@/pages/customer/MyJobs';
// import CustomerJobDetail from '@/pages/customer/JobDetail';
// import CustomerProfile from '@/pages/customer/CustomerProfile';
// import CustomerChat from '@/pages/customer/CustomerChat'; // ONLY USE THIS ONE
// import PostJob from '@/pages/dashboard/PostJob'; 

// // Worker Pages
// import WorkerHome from '@/pages/worker/WorkerHome';
// import BrowseJobs from '@/pages/worker/BrowseJobs';
// import WorkerJobDetail from '@/pages/worker/WorkerJobDetail';
// import MyContracts from '@/pages/worker/MyContracts';
// import WorkerProfile from '@/pages/worker/WorkerProfile';
// import WorkerChat from '@/pages/worker/WorkerChat'; // ONLY USE THIS ONE

// // Admin Pages (Temp)
// import Dashboard from '@/pages/dashboard/Dashboard';

// export const appRouter = createBrowserRouter([
//   // PUBLIC
//   { element: <PublicLayout />, children: [
//     { path: '/', element: <HomePage /> },
//     { path: '/services', element: <ServicesPage /> },
//     { path: '/services/:slug', element: <ServiceDetailPage /> },
//     { path: '/become-provider', element: <BecomeProviderPage /> },
//     { path: '/how-it-works', element: <HowItWorksPage /> },
//     { path: '/safety', element: <SafetyPage /> },
//     { path: '/pricing', element: <PricingPage /> },
//     { path: '/contact', element: <ContactPage /> },
//   ]},

//   // AUTH
//   { path: '/auth/login', element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Login /></div></div> },
//   { path: '/auth/register', element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Register /></div></div> },

//   // CUSTOMER PORTAL
//   { element: <CustomerRoute><CustomerLayout /></CustomerRoute>, children: [
//     { path: '/customer/home', element: <CustomerHome /> },
//     { path: '/customer/services', element: <CustomerServices /> },
//     { path: '/customer/worker/:id', element: <ViewWorkerProfile /> },
//     { path: '/customer/jobs', element: <CustomerMyJobs /> },
//     { path: '/customer/jobs/post', element: <PostJob /> },
//     { path: '/customer/jobs/:id', element: <CustomerJobDetail /> },
//     { path: '/customer/profile', element: <CustomerProfile /> },
//     { path: '/customer/chat', element: <CustomerChat /> }, // NO DUPLICATES
//   ]},

//   // WORKER PORTAL
//   { element: <WorkerRoute><WorkerLayout /></WorkerRoute>, children: [
//     { path: '/worker/home', element: <WorkerHome /> },
//     { path: '/worker/jobs', element: <BrowseJobs /> },
//     { path: '/worker/jobs/:id', element: <WorkerJobDetail /> },
//     { path: '/worker/contracts', element: <MyContracts /> },
//     { path: '/worker/profile', element: <WorkerProfile /> },
//     { path: '/worker/chat', element: <WorkerChat /> }, // NO DUPLICATES
//   ]},

//   // ADMIN (Temp)
//   { element: <AdminRoute><DashboardLayout /></AdminRoute>, children: [
//     { path: '/admin', element: <Dashboard /> },
//   ]},

//   // REDIRECTS
//   { path: '/dashboard', element: <Navigate to="/customer/home" replace /> },
//   { path: '*', element: <Navigate to="/" replace /> },
// ]);

import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import CustomerLayout from '@/components/layout/CustomerLayout';
import WorkerLayout from '@/components/layout/WorkerLayout';
import DashboardLayout from '@/components/layout/DashboardLayout'; 

// Route Guards
import CustomerRoute from '@/routes/CustomerRoute';
import WorkerRoute from '@/routes/WorkerRoute';
import AdminRoute from '@/routes/AdminRoute';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import ServicesPage from '@/pages/public/ServicesPage';
import ServiceDetailPage from '@/pages/public/ServiceDetailPage';
import BecomeProviderPage from '@/pages/public/BecomeProviderPage';
import HowItWorksPage from '@/pages/public/HowItWorksPage';
import SafetyPage from '@/pages/public/SafetyPage';
import PricingPage from '@/pages/public/PricingPage';
import ContactPage from '@/pages/public/ContactPage';

// Auth
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Customer Pages
import CustomerHome from '@/pages/customer/CustomerHome';
import CustomerServices from '@/pages/customer/CustomerServices';
import ViewWorkerProfile from '@/pages/customer/WorkerProfile';
import CustomerMyJobs from '@/pages/customer/MyJobs';
import CustomerJobDetail from '@/pages/customer/JobDetail';
import CustomerProfile from '@/pages/customer/CustomerProfile';
import CustomerChat from '@/pages/customer/CustomerChat'; // ONLY THIS ONE
import PostJob from '@/pages/dashboard/PostJob'; 

// Worker Pages
import WorkerHome from '@/pages/worker/WorkerHome';
import BrowseJobs from '@/pages/worker/BrowseJobs';
import WorkerJobDetail from '@/pages/worker/WorkerJobDetail';
import MyContracts from '@/pages/worker/MyContracts';
import WorkerProfile from '@/pages/worker/WorkerProfile';
import WorkerChat from '@/pages/worker/WorkerChat'; // ONLY THIS ONE

// Admin Pages (Temp)
import Dashboard from '@/pages/dashboard/Dashboard';

export const appRouter = createBrowserRouter([
  // PUBLIC
  { element: <PublicLayout />, children: [
    { path: '/', element: <HomePage /> },
    { path: '/services', element: <ServicesPage /> },
    { path: '/services/:slug', element: <ServiceDetailPage /> },
    { path: '/become-provider', element: <BecomeProviderPage /> },
    { path: '/how-it-works', element: <HowItWorksPage /> },
    { path: '/safety', element: <SafetyPage /> },
    { path: '/pricing', element: <PricingPage /> },
    { path: '/contact', element: <ContactPage /> },
  ]},

  // AUTH
  { path: '/auth/login', element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Login /></div></div> },
  { path: '/auth/register', element: <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"><div className="bg-white dark:bg-surface-800 p-8 w-full max-w-md rounded-2xl shadow-large border border-surface-100 dark:border-surface-700"><Register /></div></div> },

  // CUSTOMER PORTAL
  { element: <CustomerRoute><CustomerLayout /></CustomerRoute>, children: [
    { path: '/customer/home', element: <CustomerHome /> },
    { path: '/customer/services', element: <CustomerServices /> },
    { path: '/customer/worker/:id', element: <ViewWorkerProfile /> },
    { path: '/customer/jobs', element: <CustomerMyJobs /> },
    { path: '/customer/jobs/post', element: <PostJob /> },
    { path: '/customer/jobs/:id', element: <CustomerJobDetail /> },
    { path: '/customer/profile', element: <CustomerProfile /> },
    { path: '/customer/chat', element: <CustomerChat /> },
  ]},

  // WORKER PORTAL
  { element: <WorkerRoute><WorkerLayout /></WorkerRoute>, children: [
    { path: '/worker/home', element: <WorkerHome /> },
    { path: '/worker/jobs', element: <BrowseJobs /> },
    { path: '/worker/jobs/:id', element: <WorkerJobDetail /> },
    { path: '/worker/contracts', element: <MyContracts /> },
    { path: '/worker/profile', element: <WorkerProfile /> },
    { path: '/worker/chat', element: <WorkerChat /> },
  ]},

  // ADMIN (Temp)
  { element: <AdminRoute><DashboardLayout /></AdminRoute>, children: [
    { path: '/admin', element: <Dashboard /> },
  ]},

  // REDIRECTS
  { path: '/dashboard', element: <Navigate to="/customer/home" replace /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);