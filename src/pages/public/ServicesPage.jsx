import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineSearch } from 'react-icons/hi';

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Next-Gen Filtering Logic
  const filteredServices = PHASE_1_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || service.serviceType === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen py-16 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-surface-900">Our Services</h1>
          <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
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
        <div className="flex justify-center gap-3 mb-12">
          {[
            { key: 'all', label: 'All Services' },
            { key: 'local', label: '📍 Local / In-Person' },
            { key: 'digital', label: '💻 Digital / Remote' },
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg font-medium transition text-sm ${activeTab === tab.key ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card key={service.id} hover className="p-8 flex flex-col items-center text-center group">
                <span className="text-6xl mb-6 group-hover:scale-110 transition-transform">{service.emoji}</span>
                <h2 className="text-2xl font-bold text-surface-900 mb-2">{service.name}</h2>
                <p className="text-surface-500 mb-6 flex-grow">{service.shortDesc}</p>
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