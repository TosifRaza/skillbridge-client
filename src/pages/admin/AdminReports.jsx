import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchReports, resolveReport } from '@/store/slices/adminSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

const AdminReports = () => {
  const dispatch = useAppDispatch();
  const { reports, totalReports, loading } = useAppSelector((state) => state.admin);
  const [statusFilter, setStatusFilter] = useState('Open');

  useEffect(() => {
    dispatch(fetchReports({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleResolve = async (id) => {
    const resolution = window.prompt('Enter resolution details:');
    if (resolution) {
      await dispatch(resolveReport({ id, resolution }));
      dispatch(fetchReports({ status: statusFilter }));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Disputes & Reports ({totalReports})</h1>

      <Card className="dark:bg-surface-800 p-4 mb-6">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-700 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="Open">Open</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
        </select>
      </Card>

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report._id} className="dark:bg-surface-800 p-6 border-l-4 border-l-red-500">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={report.status === 'Resolved' ? 'success' : 'danger'}>{report.status}</Badge>
                  <span className="text-xs text-surface-400">Reported on {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-surface-800 dark:text-surface-200 mb-1"><span className="font-bold">Reason:</span> {report.reason}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">{report.description}</p>
                <div className="mt-2 text-xs text-surface-500">
                  <span>Reported By: {report.reporter?.email}</span> | <span>Accused: {report.reportedUser?.email}</span>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 justify-end">
                {report.status !== 'Resolved' && (
                  <Button size="sm" onClick={() => handleResolve(report._id)}>Resolve</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {reports.length === 0 && (
          <div className="text-center py-10 text-surface-500 dark:text-surface-400">No reports found for this status.</div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;