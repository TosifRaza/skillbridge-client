import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import { PHASE_1_SERVICES } from '@/constants/services';

const CustomerServices = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...PHASE_1_SERVICES.map(s => s.name)];
  
  const filteredServices = PHASE_1_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || service.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Find Services</h1>
          <p className="text-surface-500 dark:text-surface-400">Browse categories or search for what you need.</p>
        </div>
        <SearchBar onSearch={(q) => setSearchQuery(q)} className="w-full md:w-72" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="dark:bg-surface-800 p-4 sticky top-24">
            <h3 className="font-bold text-surface-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeCategory === cat ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {filteredServices.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredServices.map(service => (
                <Card key={service.id} hover className="dark:bg-surface-800 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{service.emoji}</span>
                      <h3 className="text-xl font-bold text-surface-900 dark:text-white">{service.name}</h3>
                    </div>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">{service.shortDesc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{service.startingPrice}</span>
                      <Link to="/customer/jobs/post"><Button size="sm">Hire Now</Button></Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">No services found</h3>
              <p className="text-surface-500 mt-2">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerServices;