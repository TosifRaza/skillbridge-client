// // import { Outlet, Link } from 'react-router-dom';
// // import Button from '@/components/ui/Button';

// // const PublicLayout = () => {
// //   return (
// //     <div className="min-h-screen flex flex-col bg-surface-50">
// //       {/* Sticky Frosted Navbar */}
// //       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200 shadow-soft">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
// //           <Link to="/" className="flex items-center gap-2">
// //             <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
// //             <span className="text-xl font-bold text-surface-900">SkillBridge</span>
// //           </Link>
          
// //           <div className="hidden md:flex items-center gap-8">
// //             <a href="#how-it-works" className="text-surface-600 hover:text-primary-600 transition font-medium">How it Works</a>
// //             <a href="#categories" className="text-surface-600 hover:text-primary-600 transition font-medium">Categories</a>
// //           </div>

// //           <div className="flex items-center gap-3">
// //             <Link to="/login">
// //               <Button variant="ghost" className="text-surface-700 hover:text-primary-600">Log In</Button>
// //             </Link>
// //             <Link to="/register">
// //               <Button>Sign Up</Button>
// //             </Link>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Main Content */}
// //       <main className="flex-grow">
// //         <Outlet />
// //       </main>

// //       {/* Professional Footer */}
// //       <footer className="bg-surface-900 text-surface-400 py-12 mt-20">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
// //           <div>
// //             <div className="flex items-center gap-2 mb-4">
// //               <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
// //               <span className="text-xl font-bold text-white">SkillBridge</span>
// //             </div>
// //             <p className="text-sm">Every problem gets a solution. Every skill gets an opportunity.</p>
// //           </div>
// //           <div>
// //             <h4 className="text-white font-semibold mb-3">For Customers</h4>
// //             <ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition">Post a Job</a></li><li><a href="#" className="hover:text-white transition">Find Workers</a></li></ul>
// //           </div>
// //           <div>
// //             <h4 className="text-white font-semibold mb-3">For Workers</h4>
// //             <ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition">Find Jobs</a></li><li><a href="#" className="hover:text-white transition">Create Profile</a></li></ul>
// //           </div>
// //           <div>
// //             <h4 className="text-white font-semibold mb-3">Company</h4>
// //             <ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition">About Us</a></li><li><a href="#" className="hover:text-white transition">Contact</a></li></ul>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default PublicLayout;





// import { Outlet, Link } from 'react-router-dom';
// import Button from '@/components/ui/Button';
// import { HiOutlineLocationMarker, HiOutlineSearch } from 'react-icons/hi';

// const PublicLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col bg-surface-50">
//       {/* Sticky Frosted Navbar */}
//       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200 shadow-soft">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          
//           {/* Left: Logo & Location */}
//           <div className="flex items-center gap-6">
//             <Link to="/" className="flex items-center gap-2 flex-shrink-0">
//               <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
//               <span className="text-xl font-bold text-surface-900 hidden md:block">SkillBridge</span>
//             </Link>
            
//             {/* Location Picker (Phase 1 Essential) */}
//             <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-primary-600 transition border border-surface-200 rounded-lg px-3 py-1.5">
//               <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
//               New York, NY
//             </button>
//           </div>

//           {/* Center: Search Bar
//           <div className="flex-1 max-w-xl hidden md:block">
//             <div className="relative">
//               <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
//               <input 
//                 type="text" 
//                 placeholder="What service do you need? (e.g., Plumber)" 
//                 className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-surface-50"
//               />
//             </div>
//           </div> */}

//           {/* Right: Auth Links */}
//           <div className="flex items-center gap-3 flex-shrink-0">
//             <Link to="/register" className="hidden md:block text-sm font-semibold text-primary-600 hover:text-primary-700 transition">
//               Become a Pro
//             </Link>
//             <Link to="/login">
//               <Button variant="ghost" className="text-surface-700 hover:text-primary-600">Log In</Button>
//             </Link>
//             <Link to="/register">
//               <Button>Sign Up</Button>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="flex-grow">
//         <Outlet />
//       </main>

//       {/* Professional Footer (Keep as built previously) */}
//       <footer className="bg-surface-900 text-surface-400 py-12 mt-20">
//         {/* ... footer content ... */}
//         <div className="max-w-7xl mx-auto px-4 text-center text-sm">
//           © {new Date().getFullYear()} SkillBridge. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PublicLayout;

import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCity } from '@/store/slices/locationSlice';
import { PHASE_1_SERVICES } from '@/constants/services';
import { CITIES } from '@/constants/locations';
import Button from '@/components/ui/Button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { HiOutlineLocationMarker, HiMenu, HiX } from 'react-icons/hi';

const PublicLayout = () => {
  const dispatch = useAppDispatch();
  const { city } = useAppSelector((state) => state.location);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-surface-900/95 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 shadow-soft transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-xl font-bold text-surface-900 dark:text-white">SkillBridge</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-surface-600 dark:text-surface-300 relative">
            
            {/* Find Services - Mega Dropdown Trigger */}
            <div 
              className="relative" 
              onMouseEnter={() => setServicesOpen(true)} 
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="hover:text-primary-600 dark:hover:text-primary-400 transition font-semibold py-5">
                Find Services
              </button>

              {/* Mega Dropdown */}
              {servicesOpen && (
                <div className="absolute top-16 left-0 w-64 bg-white dark:bg-surface-800 rounded-xl shadow-large border border-surface-200 dark:border-surface-700 py-2 animate-fade-in">
                  {PHASE_1_SERVICES.map((service) => (
                    <Link 
                      key={service.id} 
                      to={service.slug}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700 transition"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="text-2xl">{service.emoji}</span>
                      <div>
                        <p className="font-semibold text-surface-900 dark:text-white text-sm">{service.name}</p>
                        <p className="text-xs text-surface-400 dark:text-surface-500">From {service.startingPrice}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/become-provider" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition font-semibold">
              Become a Provider
            </Link>
            <NavLink to="/how-it-works" className={({isActive}) => isActive ? "text-primary-600 dark:text-primary-400 font-semibold" : "hover:text-primary-600 dark:hover:text-primary-400 transition"}>How it Works</NavLink>
            <NavLink to="/safety" className={({isActive}) => isActive ? "text-primary-600 dark:text-primary-400 font-semibold" : "hover:text-primary-600 dark:hover:text-primary-400 transition"}>Safety & Trust</NavLink>
            <NavLink to="/pricing" className={({isActive}) => isActive ? "text-primary-600 dark:text-primary-400 font-semibold" : "hover:text-primary-600 dark:hover:text-primary-400 transition"}>Pricing</NavLink>
          </div>

          {/* Right Section: Location, Dark Mode & Auth */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* City Selector */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-1.5 bg-white dark:bg-surface-800">
              <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
              <select 
                value={city} 
                onChange={(e) => dispatch(setCity(e.target.value))}
                className="bg-transparent focus:outline-none text-surface-700 dark:text-surface-300 font-medium cursor-pointer"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            <Link to="/auth/login" className="hidden md:block">
              <Button variant="ghost" className="text-surface-700 dark:text-surface-300 hover:text-primary-600">Log In</Button>
            </Link>
            <Link to="/auth/register" className="hidden md:block">
              <Button>Sign Up</Button>
            </Link>

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-surface-700 dark:text-surface-300">
              {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-surface-700 shadow-medium animate-fade-in">
            <div className="p-4 space-y-2">
              <select 
                value={city} 
                onChange={(e) => dispatch(setCity(e.target.value))}
                className="w-full bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-lg p-2 mb-4"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <p className="text-xs text-surface-400 dark:text-surface-500 font-bold uppercase mt-4 mb-2">Services</p>
              {PHASE_1_SERVICES.map(service => (
                <Link key={service.id} to={service.slug} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200">
                  <span>{service.emoji}</span> <span className="font-medium">{service.name}</span>
                </Link>
              ))}

              <div className="border-t border-surface-100 dark:border-surface-700 pt-2 mt-2 space-y-2">
                <Link to="/become-provider" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-semibold text-primary-600 dark:text-primary-400">Become a Provider</Link>
                <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-medium text-surface-700 dark:text-surface-300">How it Works</Link>
                <Link to="/safety" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-medium text-surface-700 dark:text-surface-300">Safety & Trust</Link>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-medium text-surface-700 dark:text-surface-300">Pricing</Link>
              </div>

              {/* Mobile Appearance Toggle */}
              <div className="flex items-center justify-between mt-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Appearance</span>
                <DarkModeToggle />
              </div>

              <div className="flex gap-2 mt-4">
                <Link to="/auth/login" className="flex-1"><Button variant="outline" className="w-full">Log In</Button></Link>
                <Link to="/auth/register" className="flex-1"><Button className="w-full">Sign Up</Button></Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Professional Footer */}
      <footer className="bg-surface-900 dark:bg-black text-surface-400 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="text-xl font-bold text-white">SkillBridge</span>
            </div>
            <p className="text-sm">Every problem gets a solution, and every worker gets an opportunity.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              {PHASE_1_SERVICES.map(s => <li key={s.id}><Link to={s.slug} className="hover:text-white transition">{s.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm"><li><Link to="/how-it-works" className="hover:text-white transition">How it Works</Link></li><li><Link to="/safety" className="hover:text-white transition">Safety</Link></li><li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li></ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Workers</h4>
            <ul className="space-y-2 text-sm"><li><Link to="/become-provider" className="hover:text-white transition">Become a Provider</Link></li></ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;










// import { useState } from 'react';
// import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
// import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { setCity } from '@/store/slices/locationSlice';
// import { PHASE_1_SERVICES } from '@/constants/services';
// import { CITIES } from '@/constants/locations';
// import Button from '@/components/ui/Button';
// import { HiOutlineLocationMarker, HiMenu, HiX, HiChevronDown } from 'react-icons/hi';

// const PublicLayout = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { city } = useAppSelector((state) => state.location);
  
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [megaMenuOpen, setMegaMenuOpen] = useState(false);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     // We will build this route in Sub-step B, but routing it now doesn't hurt
//     navigate(`/services?q=${e.target.search.value}`);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-surface-50">
//       {/* ================= STICKY NAVBAR ================= */}
//       <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-surface-200 shadow-soft">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 flex-shrink-0">
//             <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
//             <span className="text-xl font-bold text-surface-900">SkillBridge</span>
//           </Link>

//           {/* Desktop Nav Links */}
//           <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-surface-600 relative">
            
//             {/* Mega Menu Trigger */}
//             <div 
//               className="relative h-full flex items-center" 
//               onMouseEnter={() => setMegaMenuOpen(true)} 
//               onMouseLeave={() => setMegaMenuOpen(false)}
//             >
//               <button className="hover:text-primary-600 transition font-semibold flex items-center gap-1 py-5">
//                 Services <HiChevronDown className={`w-4 h-4 transition ${megaMenuOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {/* Mega Dropdown */}
//               {megaMenuOpen && (
//                 <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-xl shadow-large border border-surface-200 p-6 grid grid-cols-2 gap-4 animate-fade-in">
//                   {PHASE_1_SERVICES.map((service) => (
//                     <Link 
//                       key={service.id} 
//                       to={service.slug}
//                       className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-50 transition group"
//                       onClick={() => setMegaMenuOpen(false)}
//                     >
//                       <span className="text-3xl group-hover:scale-110 transition">{service.emoji}</span>
//                       <div>
//                         <p className="font-semibold text-surface-900 text-sm">{service.name}</p>
//                         <p className="text-xs text-surface-400">From {service.startingPrice}</p>
//                       </div>
//                     </Link>
//                   ))}
//                   <div className="col-span-2 mt-2 pt-4 border-t border-surface-100 text-center">
//                     <Link to="/services" onClick={() => setMegaMenuOpen(false)} className="text-primary-600 font-semibold text-sm hover:underline">
//                       View All Services →
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <NavLink to="/become-provider" className={({isActive}) => `text-primary-600 hover:text-primary-700 transition font-semibold ${isActive ? 'underline' : ''}`}>
//               Become a Provider
//             </NavLink>
//             <NavLink to="/how-it-works" className={({isActive}) => isActive ? "text-primary-600 font-semibold" : "hover:text-primary-600 transition"}>How it Works</NavLink>
//             <NavLink to="/safety" className={({isActive}) => isActive ? "text-primary-600 font-semibold" : "hover:text-primary-600 transition"}>Safety</NavLink>
//             <NavLink to="/pricing" className={({isActive}) => isActive ? "text-primary-600 font-semibold" : "hover:text-primary-600 transition"}>Pricing</NavLink>
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-3 flex-shrink-0">
//             {/* City Selector */}
//             <div className="hidden md:flex items-center gap-2 text-sm font-medium border border-surface-200 rounded-lg px-3 py-1.5 bg-white">
//               <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
//               <select 
//                 value={city} 
//                 onChange={(e) => dispatch(setCity(e.target.value))}
//                 className="bg-transparent focus:outline-none text-surface-700 font-medium cursor-pointer"
//               >
//                 {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>

//             <Link to="/auth/login" className="hidden md:block">
//               <Button variant="ghost" className="text-surface-700 hover:text-primary-600">Log In</Button>
//             </Link>
//             <Link to="/auth/register" className="hidden md:block">
//               <Button>Sign Up</Button>
//             </Link>

//             {/* Mobile Hamburger */}
//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-surface-700">
//               {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Drawer Menu */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden bg-white border-t border-surface-100 shadow-medium animate-fade-in max-h-[80vh] overflow-y-auto">
//             <div className="p-4 space-y-2">
//               <div className="flex items-center gap-2 mb-4 bg-surface-50 p-2 rounded-lg">
//                 <HiOutlineLocationMarker className="text-primary-500" />
//                 <select value={city} onChange={(e) => dispatch(setCity(e.target.value))} className="w-full bg-transparent focus:outline-none text-sm font-medium">
//                   {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//               </div>
              
//               <p className="text-xs text-surface-400 font-bold uppercase mt-4 mb-2">Top Services</p>
//               {PHASE_1_SERVICES.map(service => (
//                 <Link key={service.id} to={service.slug} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50">
//                   <span className="text-xl">{service.emoji}</span> <span className="font-medium text-surface-800">{service.name}</span>
//                 </Link>
//               ))}

//               <div className="border-t border-surface-100 pt-2 mt-2 space-y-1">
//                 <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-semibold text-surface-800">All Services</Link>
//                 <Link to="/become-provider" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-semibold text-primary-600">Become a Provider</Link>
//                 <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-medium text-surface-700">How it Works</Link>
//                 <Link to="/safety" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-medium text-surface-700">Safety</Link>
//                 <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block p-2 font-medium text-surface-700">Pricing</Link>
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <Link to="/auth/login" className="flex-1"><Button variant="outline" className="w-full">Log In</Button></Link>
//                 <Link to="/auth/register" className="flex-1"><Button className="w-full">Sign Up</Button></Link>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-grow">
//         <Outlet />
//       </main>

//       {/* ================= PREMIUM FOOTER ================= */}
//       <footer className="bg-surface-900 text-surface-400 pt-16 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8 mb-12">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
//                 <span className="text-xl font-bold text-white">SkillBridge</span>
//               </div>
//               <p className="text-sm leading-relaxed">Every problem gets a solution, and every worker gets an opportunity. India's most trusted hybrid marketplace.</p>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Top Services</h4>
//               <ul className="space-y-2 text-sm">
//                 {PHASE_1_SERVICES.slice(0, 5).map(s => <li key={s.id}><Link to={s.slug} className="hover:text-white transition">{s.name}</Link></li>)}
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><Link to="/how-it-works" className="hover:text-white transition">How it Works</Link></li>
//                 <li><Link to="/safety" className="hover:text-white transition">Safety & Trust</Link></li>
//                 <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
//                 <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Workers</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><Link to="/become-provider" className="hover:text-white transition">Become a Provider</Link></li>
//                 <li><Link to="#" className="hover:text-white transition">Community</Link></li>
//                 <li><Link to="#" className="hover:text-white transition">Help Center</Link></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-surface-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
//             <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
//             <div className="flex gap-4 mt-4 md:mt-0">
//               <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
//               <Link to="#" className="hover:text-white transition">Terms of Service</Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PublicLayout;