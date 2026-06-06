import { useEffect, useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyApplications, withdrawApplication } from '@/store/slices/applicationSlice';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineChatAlt, HiOutlineX } from 'react-icons/hi';

const statusVariant = {
  Pending: 'warning', Accepted: 'success', Rejected: 'danger', Withdrawn: 'gray',
};

const MyContracts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myApplications, loading } = useAppSelector((state) => state.application);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    dispatch(fetchMyApplications({}));
  }, [dispatch]);

  const filteredApps = myApplications.filter(app => {
    if (activeTab === 'Pending') return app.status === 'Pending';
    if (activeTab === 'Active') return app.status === 'Accepted';
    if (activeTab === 'History') return ['Rejected', 'Withdrawn'].includes(app.status);
    return true;
  });

  const handleWithdraw = async (app_id, isAccepted) => {
    const confirmMessage = isAccepted 
      ? "Are you sure you want to cancel this contract? The job will be reopened for other workers and the customer will be notified." 
      : "Are you sure you want to withdraw this proposal?";

    if (window.confirm(confirmMessage)) {
      await dispatch(withdrawApplication(app_id));
      dispatch(fetchMyApplications({})); // Refresh list
    }
  };

  if (loading && myApplications.length === 0) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">My Contracts & Proposals</h1>

      <Tabs 
        tabs={[
          { value: 'Pending', label: 'Pending' },
          { value: 'Active', label: 'Active' },
          { value: 'History', label: 'History' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map(app => (
            <Card key={app._id} className={`dark:bg-surface-800 p-6 hover:shadow-medium transition-shadow border-l-4 ${app.status === 'Accepted' ? 'border-l-green-500' : 'border-l-surface-300 dark:border-l-surface-600'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={statusVariant[app.status]}>{app.status}</Badge>
                    <span className="text-xs text-surface-400">
                      {app.status === 'Accepted' ? 'Hired' : 'Applied'} on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                    {app.job?.title || 'Job Title Unavailable'}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-3">{app.proposalMessage}</p>
                  <div className="flex items-center gap-4 text-sm text-surface-600 dark:text-surface-300">
                    <span className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400">
                      <HiOutlineCurrencyDollar className="w-4 h-4" /> Bid: ₹{app.bidAmount}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="w-4 h-4" /> {app.estimatedCompletionTime}
                    </span>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 justify-end">
                  {app.status === 'Pending' && (
                    <Button variant="outline" size="sm" onClick={() => handleWithdraw(app._id, false)} className="text-red-500 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30">
                      Withdraw
                    </Button>
                  )}
                  
                  {app.status === 'Accepted' && (
                    <>
                      <Link to="/worker/chat">
                        <Button size="sm" className="flex items-center gap-1 w-full md:w-auto justify-center">
                          <HiOutlineChatAlt className="w-4 h-4" /> Message
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => handleWithdraw(app._id, true)} className="flex items-center gap-1 w-full md:w-auto justify-center">
                        <HiOutlineX className="w-4 h-4" /> Cancel Contract
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState 
            icon={activeTab === 'Active' ? "🤝" : "📋"} 
            title={`No ${activeTab} ${activeTab === 'Active' ? 'Contracts' : 'Proposals'}`} 
            description={activeTab === 'Pending' ? "You haven't submitted any proposals recently." : "You have no contracts in this category yet."} 
            actionLabel={activeTab === 'Pending' ? "Find Work" : undefined}
            onAction={activeTab === 'Pending' ? () => navigate('/worker/jobs') : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default MyContracts;