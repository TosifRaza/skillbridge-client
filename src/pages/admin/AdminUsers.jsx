import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, blockUser, unblockUser, verifyWorker, rejectWorkerVerification, connectWorkerPayoutAccount } from '@/store/slices/adminSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import SearchBar from '@/components/ui/SearchBar';

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, totalUsers, loading } = useAppSelector((state) => state.admin);
  const [roleFilter, setRoleFilter] = useState(''); // 'customer', 'provider', ''
  const [search, setSearch] = useState('');
  const [payoutWorker, setPayoutWorker] = useState(null);
  const [linkedAccountId, setLinkedAccountId] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ role: roleFilter, search }));
  }, [dispatch, roleFilter, search]);

  const handleAction = async (actionFn, id) => {
    await dispatch(actionFn(id));
    dispatch(fetchUsers({ role: roleFilter, search })); // Refresh list
  };

  const handlePayoutConnect = async (event) => {
    event.preventDefault();
    setSavingPayout(true);
    setPayoutError('');
    const result = await dispatch(connectWorkerPayoutAccount({ id: payoutWorker._id, linkedAccountId: linkedAccountId.trim() }));
    setSavingPayout(false);
    if (connectWorkerPayoutAccount.fulfilled.match(result)) {
      setPayoutWorker(null);
      setLinkedAccountId('');
      dispatch(fetchUsers({ role: roleFilter, search }));
    } else {
      setPayoutError(result.payload || 'Could not connect payout account');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">User Management ({totalUsers})</h1>

      <Card className="dark:bg-surface-800 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchBar onSearch={(q) => setSearch(q)} placeholder="Search by email..." className="flex-1 w-full md:w-auto" />
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-700 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Roles</option>
            <option value="customer">Customers</option>
            <option value="provider">Workers</option>
          </select>
        </div>
      </Card>

      <div className="overflow-x-auto shadow-soft border border-surface-200 dark:border-surface-700 sm:rounded-lg">
        <table className="w-full text-sm text-left text-surface-500 dark:text-surface-400">
          <thead className="text-xs text-surface-700 dark:text-surface-300 uppercase bg-surface-50 dark:bg-surface-700">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Verification</th>
              <th className="px-6 py-3">Payouts</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                <td className="px-6 py-4 font-medium text-surface-900 dark:text-white whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4"><Badge variant={user.role === 'provider' ? 'primary' : 'gray'}>{user.role}</Badge></td>
                <td className="px-6 py-4">
                  {user.role === 'provider' ? (
                    <Badge variant={user.verificationStatus === 'Verified' ? 'success' : user.verificationStatus === 'Pending' ? 'warning' : 'danger'}>
                      {user.verificationStatus}
                    </Badge>
                  ) : ('-')}
                </td>
                <td className="px-6 py-4">
                  {user.role === 'provider' ? (
                    <Badge variant={user.payoutStatus === 'Active' ? 'success' : 'warning'}>{user.payoutStatus || 'NotConnected'}</Badge>
                  ) : ('-')}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.isBlocked ? 'danger' : 'success'}>{user.isBlocked ? 'Blocked' : 'Active'}</Badge>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {user.isBlocked ? (
                    <Button size="sm" variant="outline" onClick={() => handleAction(unblockUser, user._id)}>Unblock</Button>
                  ) : (
                    <Button size="sm" variant="danger" onClick={() => handleAction(blockUser, user._id)}>Block</Button>
                  )}
                  {user.role === 'provider' && user.verificationStatus === 'Pending' && (
                    <>
                      <Button size="sm" onClick={() => handleAction(verifyWorker, user._id)}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(rejectWorkerVerification, user._id)}>Reject ID</Button>
                    </>
                  )}
                  {user.role === 'provider' && (
                    <Button size="sm" variant="outline" onClick={() => { setPayoutWorker(user); setLinkedAccountId(''); setPayoutError(''); }}>
                      {user.payoutStatus === 'Active' ? 'Update payout' : 'Connect payout'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payoutWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={() => setPayoutWorker(null)}>
          <form onSubmit={handlePayoutConnect} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-surface-700 dark:bg-surface-800">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Razorpay Route</p>
            <h2 className="mt-2 text-xl font-bold text-surface-900 dark:text-white">Connect worker payout</h2>
            <p className="mt-2 text-sm text-surface-500">Enter the worker's verified Razorpay linked account ID. Bank details remain inside Razorpay.</p>
            <div className="mt-5">
              <Input label="Linked account ID" value={linkedAccountId} onChange={(event) => setLinkedAccountId(event.target.value)} placeholder="acc_..." required />
            </div>
            {payoutError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{payoutError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setPayoutWorker(null)}>Cancel</Button>
              <Button type="submit" isLoading={savingPayout} disabled={!linkedAccountId.trim()}>Connect account</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
