import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineSearch } from 'react-icons/hi';

const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');

  // Next-Gen Filtering Logic
  const filteredServices = PHASE_1_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || service.serviceType === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-900 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white sm:text-4xl">Our Services</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-surface-500 dark:text-surface-400 sm:mt-4 sm:text-lg">
            Professional, verified local workers for your everyday needs. Book with confidence.
          </p>
          
          <div className="mt-8 max-w-xl mx-auto relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search services (e.g., Cleaning, Moving)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-surface-200 focus:ring-2 focus:ring-primary-500 shadow-soft text-sm"
            />
          </div>
        </div>

        {/* Service Type Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
          {[
            { key: 'all', label: 'All Services' },
            { key: 'local', label: '📍 Local / In-Person' },
            { key: 'digital', label: '💻 Digital / Remote' },
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === tab.key ? 'border border-primary-200 bg-primary-50 text-primary-700' : 'border border-surface-200 bg-white text-surface-600 hover:bg-surface-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {filteredServices.map((service) => (
              <Card key={service.id} hover className="group flex flex-col items-center p-5 text-center sm:p-8">
                <span className="mb-4 text-5xl transition-transform group-hover:scale-110 sm:mb-6 sm:text-6xl">{service.emoji}</span>
                <h2 className="mb-2 text-xl font-bold text-surface-900 dark:text-white sm:text-2xl">{service.name}</h2>
                <p className="mb-5 flex-grow text-sm text-surface-500 dark:text-surface-400 sm:mb-6 sm:text-base">{service.shortDesc}</p>
                <p className="text-xl font-bold text-primary-600 mb-6">Starting from {service.startingPrice}</p>
                <Link to={service.slug}><Button>Explore Service</Button></Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-surface-800 mb-2">No services found</h3>
            <p className="text-surface-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
