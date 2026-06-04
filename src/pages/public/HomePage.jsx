import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineCurrencyDollar, HiOutlineStar, HiOutlineClipboardList, HiOutlineThumbUp } from 'react-icons/hi';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${searchQuery}`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up text-center lg:text-left">
            <Badge variant="success" className="mb-4">🚀 Now Live in Top Cities</Badge>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight">
              Find Trusted <span className="text-primary-600">Experts</span> For Any Job
            </h1>
            <p className="mt-6 text-lg text-surface-500 dark:text-surface-400 max-w-lg mx-auto lg:mx-0">
              From house cleaning to web development. Get local help or hire digital talent, all with secure payments and verified professionals.
            </p>
            
            <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input 
                  type="text" 
                  placeholder="What service do you need?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-surface-200 dark:border-surface-700 dark:bg-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-soft text-sm"
                />
              </div>
              <Button type="submit" size="lg" className="shadow-glow">Search</Button>
            </form>

            <div className="mt-4 flex items-center gap-4 justify-center lg:justify-start text-xs text-surface-400">
              <span>Popular:</span>
              {['Cleaning', 'Plumber', 'Web Dev'].map(tag => (
                <button key={tag} onClick={() => navigate(`/services?q=${tag}`)} className="hover:text-primary-600 underline">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full filter blur-3xl opacity-20"></div>
            <div className="relative grid grid-cols-2 gap-4">
              {PHASE_1_SERVICES.slice(0, 4).map(service => (
                <Link to={service.slug} key={service.id} className="bg-white dark:bg-surface-800 p-4 rounded-xl border border-surface-100 dark:border-surface-700 shadow-soft hover:shadow-medium transition flex items-center gap-3 group">
                  <span className="text-3xl group-hover:scale-110 transition">{service.emoji}</span>
                  <div>
                    <p className="font-semibold text-surface-800 dark:text-surface-200 text-sm">{service.name}</p>
                    <p className="text-xs text-primary-600 font-bold">{service.startingPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURED CATEGORIES ================= */}
      <div id="services" className="bg-white dark:bg-surface-800 py-20 border-y border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Explore Our Services</h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">Professional local labor and digital talent at your fingertips.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHASE_1_SERVICES.map((service) => (
              <Link to={service.slug} key={service.id}>
                <Card hover className="p-6 group h-full flex flex-col dark:bg-surface-800">
                  <span className="text-5xl block mb-4">{service.emoji}</span>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{service.name}</h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm mb-4 flex-grow">{service.shortDesc}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-surface-100 dark:border-surface-700">
                    <span className="text-primary-600 font-bold text-sm">{service.startingPrice}</span>
                    <span className="text-primary-600 font-semibold text-sm group-hover:underline">Book Now →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="py-20 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white text-center mb-12">How SkillBridge Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: HiOutlineSearch, title: '1. Post Your Job', desc: 'Describe what you need, set your budget, and choose a location.' },
              { icon: HiOutlineClipboardList, title: '2. Get Bids', desc: 'Verified professionals see your job and send you proposals.' },
              { icon: HiOutlineThumbUp, title: '3. Get It Done', desc: 'Hire the best expert, pay securely, and leave a review.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-glow">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-surface-900 dark:text-white text-lg mb-2">{item.title}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TRUST & SAFETY ================= */}
      <div className="py-20 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="primary">Trust & Safety</Badge>
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mt-2">Your Security is Our Priority</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: HiOutlineShieldCheck, title: 'Verified Workers', desc: 'Government ID verified professionals for your peace of mind.' },
              { icon: HiOutlineCurrencyDollar, title: 'Secure Payments', desc: 'Funds are held securely until the job is completed right.' },
              { icon: HiOutlineStar, title: 'Honest Reviews', desc: 'Transparent community feedback ensures top-quality work.' },
            ].map((item, idx) => (
              <Card key={idx} className="text-center p-6 border-l-4 border-primary-500 dark:bg-surface-800">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-surface-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FINAL CTA ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="gradient-primary p-12 text-center text-white shadow-large border-none rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Join thousands of customers and workers on India's most trusted hybrid marketplace.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/register"><Button size="lg" className="bg-white text-primary-700 hover:bg-surface-100 shadow-glow">Sign Up Now</Button></Link>
            <Link to="/become-provider"><Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">Earn as a Pro</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;