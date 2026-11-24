import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWorkers } from '@/store/slices/customerSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineTag, HiOutlineStar, HiOutlineArrowRight } from 'react-icons/hi';

const serviceVisuals = {
  'house-cleaning': { label: 'House Cleaning', description: 'Deep cleans and regular home cleaning.' },
  'moving-help': { label: 'Moving Help', description: 'Packing, loading, and furniture moving.' },
  gardening: { label: 'Gardening', description: 'Lawn mowing and yard cleanup.' },
  'event-staffing': { label: 'Event Staffing', description: 'Event setup, servers, and cleanup.' },
  'general-labor': { label: 'General Labor', description: 'Everyday help for home and work.' },
};

const getPrice = (service) => Number(String(service.startingPrice || '').replace(/[^0-9]/g, '')) || 0;
const formatPrice = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const getServiceRating = (service, workers) => {
  const query = `${service.id.replaceAll('-', ' ')} ${service.name}`.toLowerCase();
  const matchingWorkers = workers.filter((worker) => worker.skills?.some((skill) => {
    const normalizedSkill = String(skill).toLowerCase();
    return normalizedSkill.includes(query.split(' ')[0]) || query.includes(normalizedSkill);
  }) && Number(worker.totalReviews) > 0);
  const reviewCount = matchingWorkers.reduce((total, worker) => total + Number(worker.totalReviews || 0), 0);
  const average = reviewCount
    ? matchingWorkers.reduce((total, worker) => total + Number(worker.averageRating || 0) * Number(worker.totalReviews || 0), 0) / reviewCount
    : 0;
  return { average, reviewCount };
};

const CustomerServices = () => {
  const dispatch = useAppDispatch();
  const { workers = [] } = useAppSelector((state) => state.customer);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { if (!workers.length) dispatch(fetchWorkers()); }, [dispatch, workers.length]);

  const categories = ['All', ...PHASE_1_SERVICES.map(s => s.name)];

  const servicesWithRatings = useMemo(() => PHASE_1_SERVICES.map((service) => ({
    ...service,
    ...serviceVisuals[service.id],
    price: getPrice(service),
    rating: getServiceRating(service, workers),
  })), [workers]);

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = servicesWithRatings.filter((service) => {
      const matchesSearch = `${service.name} ${service.shortDesc}`.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || service.name === activeCategory;
      const matchesNearby = activeFilter !== 'Near Me' || service.serviceType === 'local';
      return matchesSearch && matchesCategory && matchesNearby;
    });
    if (activeFilter === 'Low Price') return filtered.sort((a, b) => a.price - b.price);
    if (activeFilter === 'Top Rated') return filtered.sort((a, b) => b.rating.average - a.rating.average);
    return filtered;
  }, [activeCategory, activeFilter, searchQuery, servicesWithRatings]);

  return (
    <div className="animate-fade-in">
      <div className="space-y-5 md:hidden">
        <section className="relative min-h-[174px] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#382080] via-[#612dd2] to-[#823ff1] px-5 py-5 text-white shadow-[0_14px_32px_rgba(91,48,194,.2)]">
          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-white/15"/><div className="absolute bottom-[-52px] right-7 h-36 w-36 rounded-full bg-violet-200/30"/>
          <div className="relative z-10 max-w-[68%]"><h1 className="text-[29px] font-extrabold leading-tight tracking-tight">Find Services</h1><p className="mt-2 text-[15px] leading-snug text-violet-100">Choose a service or search what you need.</p></div>
          <img src="/images/skillbridge-worker-hero.png" alt="Friendly SkillBridge service professional giving a thumbs-up" className="absolute bottom-0 right-0 z-10 h-[136px] w-[126px] object-contain object-bottom drop-shadow-[0_8px_10px_rgba(30,15,80,.2)] sm:right-4" />
          <span aria-hidden="true" className="absolute bottom-8 right-[120px] z-10 text-xl">✦</span>
        </section>

        <label className="flex min-h-[60px] items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 shadow-[0_4px_14px_rgba(25,30,70,.05)] focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100 dark:border-slate-700 dark:bg-surface-800 dark:focus-within:ring-violet-950/50">
          <HiOutlineSearch className="h-6 w-6 shrink-0 text-slate-500"/><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search for a service" className="w-full bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-500 dark:text-white" aria-label="Search services"/>
        </label>

        <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { label: 'All', icon: null },
            { label: 'Near Me', icon: HiOutlineLocationMarker },
            { label: 'Low Price', icon: HiOutlineTag },
            { label: 'Top Rated', icon: HiOutlineStar },
          ].map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => setActiveFilter(label)} className={`flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold transition ${activeFilter === label ? 'bg-gradient-to-r from-[#5324c0] to-[#7138df] text-white shadow-sm' : 'bg-violet-50 text-slate-900 dark:bg-violet-950/50 dark:text-slate-100'}`}>{Icon && <Icon className="h-5 w-5 text-violet-700 dark:text-violet-300"/>}{label}</button>)}
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-[20px] font-extrabold tracking-tight text-slate-950 dark:text-white">Categories</h2><button type="button" onClick={() => setActiveCategory('All')} className="flex items-center gap-1 text-[14px] font-bold text-violet-700 dark:text-violet-300">See All <HiOutlineArrowRight className="h-4 w-4"/></button></div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {servicesWithRatings.map((service) => <button key={service.id} type="button" onClick={() => setActiveCategory(service.name)} className={`flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-[18px] border bg-white px-1 py-2 text-center shadow-[0_4px_12px_rgba(25,30,70,.05)] transition active:scale-[.97] dark:bg-surface-800 ${activeCategory === service.name ? 'border-violet-400 ring-2 ring-violet-100 dark:ring-violet-900/60' : 'border-slate-200 dark:border-slate-700'}`}><span className="flex h-9 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40"><ServiceIcon serviceId={service.id} className="h-7 w-7" /></span><span className="text-[10px] font-semibold leading-tight text-slate-900 dark:text-slate-100">{service.label || service.name}</span></button>)}
          </div>
        </section>

        <section>
          <h2 className="mb-3 px-1 text-[20px] font-extrabold tracking-tight text-slate-950 dark:text-white">Popular Services</h2>
          {filteredServices.length ? <div className="space-y-3">
            {filteredServices.map((service) => <article key={service.id} className="flex min-h-[142px] items-center gap-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_4px_14px_rgba(25,30,70,.04)] dark:border-slate-700 dark:bg-surface-800">
              <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[20px] bg-violet-50 dark:bg-violet-950/40"><ServiceIcon serviceId={service.id} className="h-14 w-14" /></div>
              <div className="min-w-0 flex-1 self-stretch py-1"><h3 className="text-[15px] font-extrabold leading-tight text-slate-950 dark:text-white">{service.label || service.name}</h3><p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-600 dark:text-slate-300">{service.description || service.shortDesc}</p><p className="mt-2 text-[15px] font-extrabold text-violet-700 dark:text-violet-300">From {formatPrice(service.price)}</p></div>
              <div className="flex h-full min-w-[92px] flex-col items-center justify-center gap-2 border-l border-slate-200 pl-2 dark:border-slate-700"><span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-violet-50 px-2 py-1 text-[11px] font-bold text-slate-900 dark:bg-violet-950/50 dark:text-slate-100"><HiOutlineStar className="h-4 w-4 fill-amber-400 text-amber-400"/>{service.rating.average > 0 ? service.rating.average.toFixed(1) : 'New'}{service.rating.reviewCount > 0 && <span className="font-medium text-slate-500">({service.rating.reviewCount.toLocaleString('en-IN')})</span>}</span><Link to={`/customer/jobs/post?category=${encodeURIComponent(service.name)}`} className="flex min-h-10 w-full items-center justify-center gap-1 rounded-[14px] bg-gradient-to-r from-[#5324c0] to-[#7138df] px-2 text-[13px] font-bold text-white shadow-sm">Book <HiOutlineArrowRight className="h-4 w-4"/></Link></div>
            </article>)}
          </div> : <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center dark:border-slate-700 dark:bg-surface-800"><p className="font-bold text-slate-900 dark:text-white">No services found</p><p className="mt-1 text-sm text-slate-500">Try a different search or filter.</p><button type="button" onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveFilter('All'); }} className="mt-3 text-sm font-bold text-violet-700 dark:text-violet-300">Clear filters</button></div>}
        </section>
      </div>

      <div className="hidden md:block">
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
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/40"><ServiceIcon serviceId={service.id} className="h-9 w-9" /></span>
                      <h3 className="text-xl font-bold text-surface-900 dark:text-white">{service.name}</h3>
                    </div>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">{service.shortDesc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{service.startingPrice}</span>
                      <Link to={`/customer/jobs/post?category=${encodeURIComponent(service.name)}`}><Button size="sm">Book Service</Button></Link>
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
    </div>
  );
};

export default CustomerServices;
