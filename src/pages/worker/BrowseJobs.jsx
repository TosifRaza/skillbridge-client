import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAvailableJobs } from '@/store/slices/jobSlice';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { PHASE_1_SERVICES } from '@/constants/services';

const BrowseJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs, totalPages, page, loading } = useAppSelector((state) => state.job);
  
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [serviceType, setServiceType] = useState('all');

  useEffect(() => {
    const params = {
      keyword,
      category: category !== 'All' ? category : undefined,
      serviceType: serviceType !== 'all' ? serviceType : undefined,
      page,
      limit: 10
    };
    dispatch(fetchAvailableJobs(params));
  }, [dispatch, keyword, category, serviceType, page]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Find Work</h1>
          <p className="text-surface-500 dark:text-surface-400">Browse local and digital jobs in your area.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="dark:bg-surface-800 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <SearchBar onSearch={(q) => setKeyword(q)} placeholder="Search jobs by title or description..." />
          </div>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-700 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All Categories</option>
            {PHASE_1_SERVICES.map(s => <option key={s.id} value={s.name}>{s.emoji} {s.name}</option>)}
          </select>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setServiceType('all')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${serviceType === 'all' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200' : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600'}`}>All</button>
            <button onClick={() => setServiceType('local')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${serviceType === 'local' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200' : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600'}`}>📍 Local</button>
            <button onClick={() => setServiceType('digital')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${serviceType === 'digital' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200' : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600'}`}>💻 Digital</button>
          </div>
        </div>
      </Card>

      {/* Job Listings */}
      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : 
       jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => (
            <Link to={`/worker/jobs/${job._id}`} key={job._id}>
              <Card hover className="dark:bg-surface-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success">{job.status}</Badge>
                    <Badge variant="primary">{job.serviceType || 'local'}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">{job.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-surface-500 dark:text-surface-400">
                    <span>📍 {job.location?.address || 'Remote'}</span>
                    <span>⏳ Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-end gap-2">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
                  <Button size="sm" variant="outline">View & Apply</Button>
                </div>
              </Card>
            </Link>
          ))}
          
          {/* Pagination Placeholder */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => dispatch(fetchAvailableJobs({ page: page - 1 }))}>Previous</Button>
              <span className="py-2 px-3 text-sm text-surface-600 dark:text-surface-300">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => dispatch(fetchAvailableJobs({ page: page + 1 }))}>Next</Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState icon="💼" title="No Jobs Found" description="Try adjusting your search or filter criteria." />
      )}
    </div>
  );
};

export default BrowseJobs;