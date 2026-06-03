// import { Link } from 'react-router-dom';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import Badge from '@/components/ui/Badge';
// import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineChatAlt } from 'react-icons/hi';
// import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

// const categories = [
//   { name: 'House Cleaning', phase: 'Phase 1' },
//   { name: 'Moving Helper', phase: 'Phase 1' },
//   { name: 'Electrician', phase: 'Phase 2' },
//   { name: 'Plumber', phase: 'Phase 2' },
//   { name: 'Web Development', phase: 'Phase 3' },
//   { name: 'Graphic Design', phase: 'Phase 3' },
// ];

// const features = [
//   { icon: HiOutlineShieldCheck, title: 'Verified Workers', desc: 'Government ID checks and review systems ensure trust and safety.' },
//   { icon: HiOutlineCurrencyDollar, title: 'Secure Escrow', desc: 'Funds are held securely until the job is completed and approved.' },
//   { icon: HiOutlineChatAlt, title: 'Real-Time Chat', desc: 'Communicate seamlessly with image sharing and instant updates.' },
// ];

// const LandingPage = () => {
//   return (
//     <div className="relative overflow-hidden">
//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div className="animate-slide-up">
//             <Badge variant="primary" className="mb-4">🚀 Launching Phase 1</Badge>
//             <h1 className="text-5xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-tight">
//               Every problem gets a <span className="text-primary-600">solution.</span>
//             </h1>
//             <p className="mt-6 text-lg text-surface-600 max-w-lg">
//               SkillBridge connects you with verified workers, talented freelancers, and local professionals. Post a job, get bids, and hire securely.
//             </p>
//             <div className="mt-10 flex gap-4">
//               <Link to="/register">
//                 <Button size="lg" className="shadow-glow">Get Started Free</Button>
//               </Link>
//               <Link to="/login">
//                 <Button variant="outline" size="lg">Find Work</Button>
//               </Link>
//             </div>
//           </div>

//           {/* Abstract Hero Graphic */}
//           <div className="hidden lg:block relative">
//             <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-30"></div>
//             <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
//             <div className="relative glass-card p-8 space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">$</div>
//                 <div>
//                   <p className="font-semibold text-surface-800">Job Completed!</p>
//                   <p className="text-sm text-surface-500">Payment of $150 released to worker.</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 bg-surface-50 p-4 rounded-xl">
//                 <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">🧹</div>
//                 <div>
//                   <p className="font-semibold text-surface-800">New Bid Received</p>
//                   <p className="text-sm text-surface-500">Mike offered to clean your house.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div id="how-it-works" className="bg-white py-24 border-y border-surface-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-surface-900">Why choose SkillBridge?</h2>
//             <p className="mt-4 text-surface-600">Built for trust, speed, and security.</p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feat) => (
//               <Card key={feat.title} className="text-center hover:shadow-large transition">
//                 <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
//                   <feat.icon className="w-7 h-7" />
//                 </div>
//                 <h3 className="text-xl font-bold text-surface-900 mb-2">{feat.title}</h3>
//                 <p className="text-surface-500">{feat.desc}</p>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Categories Section */}
//       <div id="categories" className="py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-surface-900">Explore Categories</h2>
//             <p className="mt-4 text-surface-600">From local labor to digital services.</p>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {categories.map((cat) => (
//               <div key={cat.name} className="bg-white border border-surface-200 rounded-xl p-4 text-center hover:border-primary-300 hover:shadow-medium transition cursor-pointer">
//                 <p className="font-semibold text-surface-800">{cat.name}</p>
//                 <Badge variant="gray" className="mt-2">{cat.phase}</Badge>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;






// import { Link } from 'react-router-dom';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import Badge from '@/components/ui/Badge';
// import { HiOutlineShieldCheck, HiOutlineStar, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi';

// // Data for Quick Services
// const quickServices = [
//   { name: 'Plumbing', emoji: '🔧', price: '50' },
//   { name: 'House Cleaning', emoji: '🧹', price: '45' },
//   { name: 'Moving Help', emoji: '📦', price: '70' },
//   { name: 'Gardening', emoji: '🌿', price: '40' },
//   { name: 'Electrician', emoji: '⚡', price: '60' },
// ];

// // Data for Popular Categories
// const categories = [
//   { name: 'Local Labor & Everyday Helpers', desc: 'Moving, cleaning, and heavy lifting.', emoji: '🏋️', price: '25', color: 'bg-green-50 border-green-200' },
//   { name: 'Professional Home Services', desc: 'Plumbing, electrical, and repairs.', emoji: '🛠️', price: '50', color: 'bg-blue-50 border-blue-200' },
//   { name: 'Digital & Remote Services', desc: 'Web dev, design, and writing.', emoji: '💻', price: '100', color: 'bg-purple-50 border-purple-200' },
// ];

// const LandingPage = () => {
//   return (
//     <div className="relative overflow-hidden">
      
//       {/* ========================================= */}
//       {/* HERO SECTION + STATS                      */}
//       {/* ========================================= */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
          
//           {/* Left Column - Text & Search */}
//           <div className="animate-slide-up">
//             <Badge variant="success" className="mb-4">🚀 Phase 1: Local Labor is Live</Badge>
//             <h1 className="text-4xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-tight">
//               Every problem gets a <span className="text-primary-600">solution,</span> and every skill gets an <span className="text-primary-600">opportunity.</span>
//             </h1>
//             <p className="mt-6 text-lg text-surface-500 max-w-lg">
//               SkillBridge connects you with verified local professionals and talented digital freelancers. Post a job, get bids, and hire securely.
//             </p>
            
//             {/* Search Bar */}
//             <div className="mt-8 flex shadow-large rounded-xl border border-surface-200 overflow-hidden bg-white">
//               <input 
//                 type="text" 
//                 placeholder="What do you need done? e.g. Plumber" 
//                 className="flex-1 px-5 py-4 focus:outline-none text-surface-800"
//               />
//               <Button className="rounded-none px-8 shadow-none">Search</Button>
//             </div>

//             {/* Hot Searches */}
//             <div className="mt-4 flex items-center gap-2 flex-wrap">
//               <span className="text-sm text-surface-400 font-medium">Hot:</span>
//               {['House Cleaning', 'Moving Helper', 'Plumber'].map(tag => (
//                 <button key={tag} className="text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100 transition font-medium">
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Right Column - Stats & Trust */}
//           <div className="hidden lg:block relative animate-fade-in">
//             <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-20"></div>
            
//             <div className="relative space-y-6">
//               {/* Quick Service Cards */}
//               <div className="grid grid-cols-2 gap-4">
//                 {quickServices.slice(0, 4).map(service => (
//                   <Card key={service.name} hover className="flex items-center gap-3 p-4">
//                     <span className="text-3xl">{service.emoji}</span>
//                     <div>
//                       <p className="font-semibold text-surface-800">{service.name}</p>
//                       <p className="text-sm text-primary-600 font-bold">From ${service.price}</p>
//                     </div>
//                   </Card>
//                 ))}
//               </div>

//               {/* Stats Block */}
//               <Card className="bg-surface-900 text-white p-6 border-none">
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div>
//                     <p className="text-3xl font-bold text-primary-400">50K+</p>
//                     <p className="text-sm text-surface-400 mt-1">Customers</p>
//                   </div>
//                   <div>
//                     <p className="text-3xl font-bold text-green-400">15K+</p>
//                     <p className="text-sm text-surface-400 mt-1">Verified Pros</p>
//                   </div>
//                   <div>
//                     <p className="text-3xl font-bold text-yellow-400">4.9★</p>
//                     <p className="text-sm text-surface-400 mt-1">Avg Rating</p>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================= */}
//       {/* TRUST & VERIFIED SECTION                  */}
//       {/* ========================================= */}
//       <div id="safety" className="bg-white py-16 border-y border-surface-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-10">
//             <h2 className="text-3xl font-bold text-surface-900">The SkillBridge Difference</h2>
//             <p className="mt-2 text-surface-500">Built for trust, safety, and quality.</p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="text-center border-t-4 border-t-green-500">
//               <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-600">
//                 <HiOutlineShieldCheck className="w-7 h-7" />
//               </div>
//               <h3 className="text-xl font-bold text-surface-900 mb-2">Verified & Trusted</h3>
//               <p className="text-surface-500">Every local pro undergoes Government ID verification and background checks.</p>
//             </Card>
//             <Card className="text-center border-t-4 border-t-primary-500">
//               <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
//                 <HiOutlineCurrencyDollar className="w-7 h-7" />
//               </div>
//               <h3 className="text-xl font-bold text-surface-900 mb-2">Secure Escrow</h3>
//               <p className="text-surface-500">Funds are held securely until the job is completed and approved by you.</p>
//             </Card>
//             <Card className="text-center border-t-4 border-t-yellow-500">
//               <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-yellow-600">
//                 <HiOutlineStar className="w-7 h-7" />
//               </div>
//               <h3 className="text-xl font-bold text-surface-900 mb-2">Top Rated Pros</h3>
//               <p className="text-surface-500">Transparent 1-to-5 star rating system based on real, verified reviews.</p>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* ========================================= */}
//       {/* POPULAR CATEGORIES SECTION                */}
//       {/* ========================================= */}
//       <div className="py-20 bg-surface-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-surface-900">Popular Categories</h2>
//             <p className="mt-2 text-surface-500">From local labor to digital talent.</p>
//           </div>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {categories.map((cat) => (
//               <Card key={cat.name} hover className={`p-8 border-2 ${cat.color} relative overflow-hidden group`}>
//                 <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">
//                   {cat.emoji}
//                 </div>
//                 <div className="relative z-10">
//                   <span className="text-4xl">{cat.emoji}</span>
//                   <h3 className="text-xl font-bold text-surface-900 mt-4 mb-2">{cat.name}</h3>
//                   <p className="text-surface-500 text-sm mb-4">{cat.desc}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-bold text-primary-600">From ${cat.price}</span>
//                     <Button variant="outline" size="sm">Explore</Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ========================================= */}
//       {/* DUAL CTA SECTION (HIRE / WORK)            */}
//       {/* ========================================= */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Hire CTA */}
//           <div className="gradient-primary rounded-2xl p-10 text-white relative overflow-hidden shadow-large">
//             <div className="relative z-10">
//               <h3 className="text-3xl font-bold mb-3">Need something done?</h3>
//               <p className="text-primary-100 mb-6">Post your job for free and receive bids from verified professionals within minutes.</p>
//               <Link to="/register">
//                 <Button className="bg-white text-primary-700 hover:bg-surface-100 shadow-medium">Hire a Pro</Button>
//               </Link>
//             </div>
//           </div>

//           {/* Work CTA */}
//           <div className="bg-surface-900 rounded-2xl p-10 text-white relative overflow-hidden shadow-large border border-surface-700">
//             <div className="relative z-10">
//               <h3 className="text-3xl font-bold mb-3">Have a skill?</h3>
//               <p className="text-surface-400 mb-6">Sign up as a professional, find local and digital jobs, and start earning money today.</p>
//               <Link to="/register">
//                 <Button variant="outline" className="border-surface-500 text-white hover:bg-surface-800">Become a Worker</Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default LandingPage;



import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineShieldCheck, HiOutlineCurrencyDollar, HiOutlineStar, HiOutlineChatAlt } from 'react-icons/hi';

const HomePage = () => {
  return (
    <div className="relative overflow-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <Badge variant="success" className="mb-4">🇮🇳 Now Live in Top Cities</Badge>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-tight">
              Find Trusted Local <span className="text-primary-600">Workers</span> Near You
            </h1>
            <p className="mt-6 text-lg text-surface-500 max-w-lg">
              House Cleaning, Moving Help, Gardening, Event Staffing and General Labor. Verified professionals, secure payments.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/services"><Button size="lg" className="shadow-glow w-full sm:w-auto">Find Services</Button></Link>
              <Link to="/become-provider"><Button variant="outline" size="lg" className="w-full sm:w-auto">Become a Provider</Button></Link>
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-20"></div>
            <div className="relative grid grid-cols-2 gap-4">
              {PHASE_1_SERVICES.slice(0, 4).map(service => (
                <Card key={service.id} hover className="flex items-center gap-3 p-4">
                  <span className="text-3xl">{service.emoji}</span>
                  <div>
                    <p className="font-semibold text-surface-800 text-sm">{service.name}</p>
                    <p className="text-xs text-primary-600 font-bold">From {service.startingPrice}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURED SERVICES ================= */}
      <div id="services" className="bg-white py-20 border-y border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900">Featured Services</h2>
            <p className="mt-2 text-surface-500">Professional local labor at your fingertips.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHASE_1_SERVICES.map((service) => (
              <Card key={service.id} hover className="p-6 text-center group">
                <span className="text-5xl block mb-4">{service.emoji}</span>
                <h3 className="text-xl font-bold text-surface-900 mb-2">{service.name}</h3>
                <p className="text-surface-500 text-sm mb-4">{service.shortDesc}</p>
                <Link to={service.slug}>
                  <Button variant="outline" size="sm">Explore</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ================= WHY CHOOSE SKILLBRIDGE ================= */}
      <div className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-surface-900 text-center mb-12">Why Choose SkillBridge?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: HiOutlineShieldCheck, title: 'Verified Workers', desc: 'Government ID verified professionals.' },
              { icon: HiOutlineCurrencyDollar, title: 'Secure Payments', desc: 'Pay only when the job is done right.' },
              { icon: HiOutlineStar, title: 'Ratings & Reviews', desc: 'Transparent community feedback.' },
              { icon: HiOutlineChatAlt, title: 'Local Jobs', desc: 'Find trusted help in your city.' },
            ].map((item, idx) => (
              <Card key={idx} className="text-center p-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-surface-900 mb-1">{item.title}</h3>
                <p className="text-surface-500 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FINAL CTA ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ">
        <Card className="gradient-primary p-12 text-center text-white shadow-large border-none">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Join thousands of customers and workers on India's most trusted local labor marketplace.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/register"><Button size="lg" className="bg-white text-primary-700 hover:bg-surface-100">Sign Up Now</Button></Link>
            <Link to="/become-provider"><Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">Become a Provider</Button></Link>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default HomePage;