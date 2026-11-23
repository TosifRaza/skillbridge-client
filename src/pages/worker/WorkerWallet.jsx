import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchWallet,
  createDepositOrder,
  verifyDepositPayment,
  withdrawFunds,
  clearWalletNotice,
  setLocalPayoutDetails,
} from '@/store/slices/walletSlice';
import { updateCustomerProfile } from '@/store/slices/customerSlice';
import { updateLocalUser } from '@/store/slices/authSlice';
import {
  HiOutlineCreditCard,
  HiOutlineCurrencyRupee,
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlinePlus,
  HiOutlineExternalLink,
  HiOutlineX,
  HiOutlineDeviceMobile,
  HiOutlineLibrary,
  HiOutlineSparkles,
  HiOutlineCash,
  HiOutlinePrinter,
  HiOutlineCheck,
} from 'react-icons/hi';

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const WorkerWallet = () => {
  const dispatch = useAppDispatch();
  const {
    wallet,
    transactions,
    payoutDetails: walletPayoutDetails,
    payoutStatus: walletPayoutStatus,
    loading,
    actionLoading,
    error,
    successMessage,
  } = useAppSelector((state) => state.wallet);
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('all');

  // Modals
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showPayoutSetupModal, setShowPayoutSetupModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState('500');
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);

  // Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('upi'); // 'upi' | 'bank'
  const [withdrawError, setWithdrawError] = useState('');

  // Payout Setup Form
  const [payoutFormType, setPayoutFormType] = useState('upi'); // 'upi' | 'bank'
  const [payoutFormData, setPayoutFormData] = useState({
    upiId: user?.payoutDetails?.upiId || '',
    accountHolderName: user?.payoutDetails?.accountHolderName || user?.fullName || '',
    bankName: user?.payoutDetails?.bankName || '',
    accountNumber: user?.payoutDetails?.accountNumber || '',
    ifscCode: user?.payoutDetails?.ifscCode || '',
  });
  const [ifscLookupStatus, setIfscLookupStatus] = useState(null); // { loading, verified, bank, branch }
  const [payoutFormError, setPayoutFormError] = useState('');
  const [isSavingPayout, setIsSavingPayout] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const activePayout = user?.payoutDetails || walletPayoutDetails || {};
  const isPayoutLinked = Boolean(
    activePayout.upiId ||
    (activePayout.accountNumber && activePayout.ifscCode) ||
    walletPayoutStatus === 'Active' ||
    user?.payoutStatus === 'Active'
  );

  // Live IFSC Code Lookup using public Razorpay IFSC API
  const handleIfscChange = async (value) => {
    const uppercase = value.toUpperCase().trim();
    setPayoutFormData((prev) => ({ ...prev, ifscCode: uppercase }));

    if (uppercase.length === 11) {
      setIfscLookupStatus({ loading: true });
      try {
        const response = await fetch(`https://ifsc.razorpay.com/${uppercase}`);
        if (response.ok) {
          const data = await response.json();
          setIfscLookupStatus({
            loading: false,
            verified: true,
            bank: data.BANK,
            branch: `${data.BRANCH}, ${data.CITY}`,
          });
          setPayoutFormData((prev) => ({ ...prev, bankName: data.BANK }));
        } else {
          setIfscLookupStatus({ loading: false, verified: false, error: 'Invalid IFSC Code' });
        }
      } catch {
        setIfscLookupStatus({ loading: false, verified: false, error: 'Could not verify IFSC' });
      }
    } else {
      setIfscLookupStatus(null);
    }
  };

  const handleSavePayoutDetails = async (e) => {
    e.preventDefault();
    setPayoutFormError('');

    if (payoutFormType === 'upi') {
      if (!payoutFormData.upiId.trim() || !payoutFormData.upiId.includes('@')) {
        setPayoutFormError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank or 9876543210@paytm)');
        return;
      }
    } else {
      if (!payoutFormData.accountNumber.trim() || payoutFormData.accountNumber.length < 8) {
        setPayoutFormError('Please enter a valid Bank Account Number (8+ digits)');
        return;
      }
      if (!payoutFormData.ifscCode.trim() || payoutFormData.ifscCode.length !== 11) {
        setPayoutFormError('Please enter a valid 11-character IFSC Code');
        return;
      }
    }

    setIsSavingPayout(true);
    const cleanedPayout = {
      upiId: payoutFormData.upiId.trim(),
      accountHolderName: payoutFormData.accountHolderName.trim() || user?.fullName || '',
      bankName: payoutFormData.bankName.trim() || 'Bank Account',
      accountNumber: payoutFormData.accountNumber.trim(),
      ifscCode: payoutFormData.ifscCode.trim().toUpperCase(),
    };

    const res = await dispatch(updateCustomerProfile({ payoutDetails: cleanedPayout }));
    setIsSavingPayout(false);

    if (updateCustomerProfile.fulfilled.match(res)) {
      dispatch(updateLocalUser(res.payload));
      dispatch(setLocalPayoutDetails(cleanedPayout));
      setShowPayoutSetupModal(false);
      dispatch(fetchWallet());
    } else {
      setPayoutFormError(res.payload || 'Failed to update payout details');
    }
  };

  // Real Razorpay Deposit Flow
  const handleInitiateRazorpayDeposit = async (e) => {
    e.preventDefault();
    const amountNum = Number(depositAmount);
    if (!amountNum || amountNum < 10) return;

    setIsProcessingRazorpay(true);
    const hasScript = await loadRazorpay();
    if (!hasScript) {
      setIsProcessingRazorpay(false);
      alert('Could not load Razorpay payment gateway. Please check your internet connection.');
      return;
    }

    const orderResult = await dispatch(createDepositOrder({ amount: amountNum }));
    if (!createDepositOrder.fulfilled.match(orderResult)) {
      setIsProcessingRazorpay(false);
      return;
    }

    const orderData = orderResult.payload;

    const options = {
      key: orderData.keyId,
      amount: Math.round(amountNum * 100),
      currency: 'INR',
      name: 'SkillBridge Wallet',
      description: `Add ₹${amountNum.toLocaleString('en-IN')} to Wallet`,
      order_id: orderData.orderId,
      prefill: {
        name: user?.fullName || 'SkillBridge User',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#4f46e5',
      },
      handler: async (response) => {
        setIsProcessingRazorpay(false);
        setShowDepositModal(false);
        await dispatch(
          verifyDepositPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amountNum,
          })
        );
        dispatch(fetchWallet());
      },
      modal: {
        ondismiss: () => {
          setIsProcessingRazorpay(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Real Withdrawal Flow
  const handleOpenWithdraw = () => {
    if (!isPayoutLinked) {
      setShowPayoutSetupModal(true);
      return;
    }
    setWithdrawAmount(wallet.balance >= 100 ? String(Math.floor(wallet.balance)) : '');
    setWithdrawError('');
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async (e) => {
    e.preventDefault();
    const num = Number(withdrawAmount);
    if (!num || num < 50) {
      setWithdrawError('Minimum withdrawal amount is ₹50');
      return;
    }
    if (num > wallet.balance) {
      setWithdrawError(`Insufficient funds. Your available balance is ${formatINR(wallet.balance)}`);
      return;
    }

    setWithdrawError('');
    const destination = {
      upiId: activePayout.upiId || '',
      bankName: activePayout.bankName || '',
      accountNumber: activePayout.accountNumber || '',
      accountHolderName: activePayout.accountHolderName || user?.fullName || '',
    };

    const result = await dispatch(
      withdrawFunds({
        amount: num,
        payoutMethod: withdrawMethod,
        destination,
      })
    );

    if (withdrawFunds.fulfilled.match(result)) {
      setShowWithdrawModal(false);
      setReceiptData({
        referenceId: result.payload.transaction?.referenceId,
        amount: num,
        method: withdrawMethod,
        destination: withdrawMethod === 'upi' ? activePayout.upiId : `${activePayout.bankName} (•••• ${activePayout.accountNumber?.slice(-4)})`,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      });
      dispatch(fetchWallet());
    } else {
      setWithdrawError(result.payload || 'Failed to process withdrawal');
    }
  };

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'earnings') return transactions.filter((t) => t.type === 'credit' || t.type === 'escrow_release');
    if (activeTab === 'escrow') return transactions.filter((t) => t.type === 'escrow_hold' || t.status === 'InEscrow');
    if (activeTab === 'withdrawals') return transactions.filter((t) => t.type === 'withdrawal');
    return transactions;
  }, [transactions, activeTab]);

  return (
    <div className="mx-auto max-w-6xl animate-fade-in pb-16">
      {/* Top Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Earnings & Wallet
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Escrow
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time balance, contract protection, Razorpay gateway, and instant bank withdrawals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => dispatch(fetchWallet())}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-surface-900 dark:text-slate-200 dark:hover:bg-slate-800"
            title="Refresh balance"
          >
            <HiOutlineRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowDepositModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-200"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Money (Razorpay)
          </button>

          <button
            type="button"
            onClick={handleOpenWithdraw}
            disabled={wallet.balance < 50}
            className="gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <HiOutlineCash className="h-4 w-4" />
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Notifications */}
      {(successMessage || error) && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
            successMessage
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
          }`}
        >
          {successMessage ? (
            <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <HiOutlineExclamationCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span className="flex-1 font-medium">{successMessage || error}</span>
          <button
            type="button"
            onClick={() => dispatch(clearWalletNotice())}
            aria-label="Dismiss message"
            className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
          >
            <HiOutlineX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
              <HiOutlineCurrencyRupee className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Withdrawable
            </span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available Balance
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {formatINR(wallet.balance)}
          </h2>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">Ready for payout</span>
            <button
              type="button"
              onClick={handleOpenWithdraw}
              disabled={wallet.balance < 50}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-40 dark:text-indigo-400"
            >
              Withdraw →
            </button>
          </div>
        </div>

        {/* In Escrow */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              <HiOutlineShieldCheck className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              Protected
            </span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Funds In Escrow
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {formatINR(wallet.inEscrow)}
          </h2>
          <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            Released when client approves work
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
              <HiOutlineSparkles className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              Net 95%
            </span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Earned
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {formatINR(wallet.totalEarned)}
          </h2>
          <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            Contract payments approved
          </p>
        </div>

        {/* Total Withdrawn */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
              <HiOutlineArrowUp className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Settled
            </span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Withdrawn
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {formatINR(wallet.totalWithdrawn)}
          </h2>
          <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            Paid out to linked Bank / UPI
          </p>
        </div>
      </div>

      {/* Payout Destination Card with Direct Setup / Edit Modal */}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              {activePayout.upiId ? (
                <HiOutlineDeviceMobile className="h-6 w-6" />
              ) : (
                <HiOutlineLibrary className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Payout Destination
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    isPayoutLinked
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  }`}
                >
                  {isPayoutLinked ? 'Active & Ready' : 'Setup Required'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {isPayoutLinked ? (
                  <>
                    Earnings will transfer to{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {activePayout.upiId
                        ? `UPI (${activePayout.upiId})`
                        : `${activePayout.bankName || 'Bank'} (•••• ${activePayout.accountNumber?.slice(-4)})`}
                    </strong>
                    . Instant IMPS settlement enabled.
                  </>
                ) : (
                  'No UPI ID or bank account linked. Link your payout details to enable instant withdrawals.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPayoutSetupModal(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-200"
          >
            {isPayoutLinked ? 'Edit Payout Details' : 'Set Up Payout Account →'}
          </button>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="mt-8 rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Transaction History
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Live audit record of contract earnings, escrow releases, deposits, and bank withdrawals.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1 dark:border-slate-800 dark:bg-slate-950/50">
            {[
              { id: 'all', label: 'All' },
              { id: 'earnings', label: 'Earnings' },
              { id: 'escrow', label: 'Escrow Holds' },
              { id: 'withdrawals', label: 'Withdrawals' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-surface-800 dark:text-indigo-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'credit' || tx.type === 'deposit' || tx.type === 'escrow_release';
              const isEscrow = tx.type === 'escrow_hold' || tx.status === 'InEscrow';
              const isWithdrawal = tx.type === 'withdrawal';

              return (
                <div
                  key={tx._id || tx.referenceId}
                  className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : isEscrow
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}
                    >
                      {isCredit ? (
                        <HiOutlineArrowDown className="h-5 w-5" />
                      ) : isEscrow ? (
                        <HiOutlineShieldCheck className="h-5 w-5" />
                      ) : (
                        <HiOutlineArrowUp className="h-5 w-5" />
                      )}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {tx.title}
                        </p>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : tx.status === 'InEscrow'
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {tx.description}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span>{new Date(tx.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        <span>•</span>
                        <span className="font-mono">{tx.referenceId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <p
                      className={`text-base font-extrabold ${
                        isCredit
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isEscrow
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {isCredit ? '+' : isWithdrawal ? '-' : ''}
                      {formatINR(tx.netAmount || tx.amount)}
                    </p>
                    {tx.fee > 0 && (
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Platform Fee (5%): {formatINR(tx.fee)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-400">
                <HiOutlineCreditCard className="h-7 w-7" />
              </div>
              <p className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
                No Transactions Yet
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
                Your wallet is ready. When customers hire you and fund contracts via Razorpay, your earnings will appear here protected in escrow until job completion.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPayoutSetupModal(true)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-200"
                >
                  Link Bank or UPI
                </button>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(true)}
                  className="gradient-primary rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20"
                >
                  Add Money via Razorpay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Add Money Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900 sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <HiOutlineCreditCard className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Add Money via Razorpay
                  </h3>
                  <p className="text-xs text-slate-400">
                    UPI, Credit/Debit Cards & Netbanking
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateRazorpayDeposit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Enter Amount to Deposit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-base font-extrabold text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Quick Chips */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[200, 500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(String(amt))}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs text-indigo-900 dark:border-indigo-950/60 dark:bg-indigo-950/30 dark:text-indigo-200">
                <p className="font-semibold">Razorpay Secured Gateway</p>
                <p className="mt-0.5 text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                  Payments are processed instantly using 256-bit encryption. Supports all Indian banks, UPI apps (PhonePe, GPay, Paytm), and Visa/Mastercard/RuPay.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingRazorpay || !Number(depositAmount)}
                  className="gradient-primary flex w-2/3 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isProcessingRazorpay ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Opening Gateway...
                    </>
                  ) : (
                    `Proceed to Pay ${formatINR(depositAmount || 0)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Destination Setup Modal (With Live IFSC Verification) */}
      {showPayoutSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Configure Payout Destination
                </h3>
                <p className="text-xs text-slate-400">
                  Where SkillBridge should deposit your earnings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutSetupModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {payoutFormError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                {payoutFormError}
              </div>
            )}

            {/* Type Switcher */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/50">
              <button
                type="button"
                onClick={() => setPayoutFormType('upi')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  payoutFormType === 'upi'
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-surface-800 dark:text-indigo-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <HiOutlineDeviceMobile className="h-4 w-4" />
                UPI ID (Instant)
              </button>
              <button
                type="button"
                onClick={() => setPayoutFormType('bank')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                  payoutFormType === 'bank'
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-surface-800 dark:text-indigo-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <HiOutlineLibrary className="h-4 w-4" />
                Bank Account
              </button>
            </div>

            <form onSubmit={handleSavePayoutDetails} className="mt-4 space-y-4">
              {payoutFormType === 'upi' ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your UPI ID / VPA
                  </label>
                  <input
                    value={payoutFormData.upiId}
                    onChange={(e) => setPayoutFormData((prev) => ({ ...prev, upiId: e.target.value }))}
                    placeholder="e.g. yourname@okhdfcbank or 9870473896@paytm"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Compatible with Google Pay, PhonePe, Paytm, BHIM, or any bank UPI handle.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Account Holder Name
                    </label>
                    <input
                      value={payoutFormData.accountHolderName}
                      onChange={(e) => setPayoutFormData((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                      placeholder="As per bank passbook"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Bank Account Number
                    </label>
                    <input
                      value={payoutFormData.accountNumber}
                      onChange={(e) => setPayoutFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="e.g. 123456789012"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      IFSC Code (with live verification)
                    </label>
                    <input
                      value={payoutFormData.ifscCode}
                      onChange={(e) => handleIfscChange(e.target.value)}
                      placeholder="e.g. SBIN0001234 or HDFC0000001"
                      maxLength={11}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-mono uppercase text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    {ifscLookupStatus?.loading && (
                      <p className="mt-1 text-[11px] text-indigo-500">Checking IFSC code with RBI database...</p>
                    )}
                    {ifscLookupStatus?.verified && (
                      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <HiOutlineCheck className="h-4 w-4" />
                        {ifscLookupStatus.bank} — {ifscLookupStatus.branch}
                      </div>
                    )}
                    {ifscLookupStatus?.error && (
                      <p className="mt-1 text-[11px] text-rose-500">{ifscLookupStatus.error}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPayoutSetupModal(false)}
                  className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPayout}
                  className="gradient-primary flex w-2/3 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSavingPayout ? 'Saving Details...' : 'Save & Activate Payouts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900 sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <HiOutlineCash className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Withdraw to Bank / UPI
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instant payout to your linked account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {withdrawError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleConfirmWithdraw} className="mt-5 space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Withdrawal Amount (₹)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Available: <strong className="text-emerald-600">{formatINR(wallet.balance)}</strong>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="50"
                    max={wallet.balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount (min ₹50)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-base font-extrabold text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Quick Chips */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(String(amt))}
                      disabled={wallet.balance < amt}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(Math.floor(wallet.balance)))}
                    disabled={wallet.balance < 50}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Destination method selection */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Destination
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('upi')}
                    disabled={!activePayout.upiId}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                      withdrawMethod === 'upi'
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    <HiOutlineDeviceMobile className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">UPI Handle</p>
                      <p className="truncate text-[10px] text-slate-400">{activePayout.upiId || 'Not linked'}</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank')}
                    disabled={!activePayout.accountNumber}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                      withdrawMethod === 'bank'
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    <HiOutlineLibrary className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">Bank Account</p>
                      <p className="truncate text-[10px] text-slate-400">
                        {activePayout.accountNumber ? `•••• ${activePayout.accountNumber.slice(-4)}` : 'Not linked'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-slate-50 p-3.5 text-xs leading-5 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Transfer Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatINR(withdrawAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processing & Platform Fee:</span>
                  <span className="font-bold text-emerald-600">₹0 (Free)</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-slate-200/60 pt-1 font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                  <span>Net Credited to You:</span>
                  <span className="text-emerald-600">{formatINR(withdrawAmount || 0)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !Number(withdrawAmount) || Number(withdrawAmount) > wallet.balance}
                  className="gradient-primary flex w-2/3 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    'Confirm & Withdraw'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900 sm:p-7">
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                <HiOutlineCheckCircle className="h-9 w-9" />
              </span>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
                Payout Successful!
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Funds have been transferred to your destination account.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Reference Number:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {receiptData.referenceId}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Transferred Amount:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {formatINR(receiptData.amount)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Credited To:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {receiptData.destination}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-slate-700 dark:text-slate-300">{receiptData.date}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  COMPLETED
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex w-1/2 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <HiOutlinePrinter className="h-4 w-4" />
                Print Slip
              </button>
              <button
                type="button"
                onClick={() => setReceiptData(null)}
                className="gradient-primary w-1/2 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerWallet;
