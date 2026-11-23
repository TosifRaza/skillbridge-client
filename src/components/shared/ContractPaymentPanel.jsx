import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useAppSelector } from '@/store/hooks';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationCircle,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
}).format(Number(value || 0));

const loadCheckout = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const existing = document.querySelector('script[data-razorpay-checkout]');
  if (existing) {
    existing.addEventListener('load', () => resolve(true), { once: true });
    existing.addEventListener('error', () => resolve(false), { once: true });
    return undefined;
  }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.dataset.razorpayCheckout = 'true';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
  return undefined;
});

const statusContent = {
  NotStarted: { label: 'Payment required', tone: 'amber', description: 'Fund the contract before work begins.' },
  Created: { label: 'Checkout pending', tone: 'amber', description: 'Complete the secure Razorpay payment.' },
  Funded: { label: 'Payment protected', tone: 'indigo', description: 'Worker earnings are secured until work approval.' },
  WorkSubmitted: { label: 'Work awaiting approval', tone: 'violet', description: 'Review the completed work before releasing payment.' },
  ReleasePending: { label: 'Release processing', tone: 'indigo', description: 'The settlement release is being processed.' },
  Released: { label: 'Worker paid', tone: 'emerald', description: 'The worker payment has been released.' },
  Failed: { label: 'Payment failed', tone: 'rose', description: 'Start a new secure payment attempt.' },
};

const toneClasses = {
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
};

const ContractPaymentPanel = ({ jobId, viewerRole, onUpdated }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/payments/job/${jobId}`);
      setPayment(response.data.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load contract payment');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    let active = true;
    axiosInstance.get(`/payments/job/${jobId}`)
      .then((response) => {
        if (!active) return;
        setPayment(response.data.data);
        setError('');
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load contract payment');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [jobId]);

  const handlePay = async () => {
    setAction('pay');
    setError('');
    try {
      const checkoutReady = await loadCheckout();
      if (!checkoutReady) throw new Error('Secure checkout could not be loaded');
      const orderResponse = await axiosInstance.post(`/payments/job/${jobId}/order`);
      const order = orderResponse.data.data;
      if (!order.publicKey) throw new Error('Razorpay checkout is not configured');
      const checkout = new window.Razorpay({
        key: order.publicKey,
        order_id: order.orderId,
        amount: Math.round(order.grossAmount * 100),
        currency: order.currency,
        name: 'SkillBridge',
        description: 'Protected contract payment',
        prefill: { name: user?.fullName || '', email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#4f46e5' },
        modal: { ondismiss: () => setAction('') },
        handler: async (result) => {
          try {
            await axiosInstance.post('/payments/verify', result);
            await fetchStatus();
            onUpdated?.();
          } catch (verificationError) {
            setError(verificationError.response?.data?.message || 'Payment verification failed');
          } finally {
            setAction('');
          }
        },
      });
      checkout.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed. Please try again.');
        setAction('');
      });
      checkout.open();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not start payment');
      setAction('');
    }
  };

  const runAction = async (type, path) => {
    setAction(type);
    setError('');
    try {
      await axiosInstance.post(path);
      await fetchStatus();
      onUpdated?.();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update the payment');
    } finally {
      setAction('');
    }
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-surface-900">Loading secure payment…</div>;
  if (!payment) return error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null;

  const content = statusContent[payment.status] || statusContent.NotStarted;
  const isCustomer = viewerRole === 'customer';

  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,.06)] dark:border-slate-800 dark:bg-surface-900">
      <div className="bg-[#171d3c] px-5 py-5 text-white">
        <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-indigo-200">SkillBridge protected payment</p><h3 className="mt-1.5 text-lg font-bold">{formatCurrency(payment.grossAmount)}</h3></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-300"><HiOutlineShieldCheck className="h-5 w-5" /></span></div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full transition-all ${payment.status === 'Released' ? 'w-full bg-emerald-400' : ['Funded', 'WorkSubmitted', 'ReleasePending'].includes(payment.status) ? 'w-2/3 bg-indigo-300' : 'w-1/3 bg-amber-300'}`} /></div>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[content.tone]}`}>{payment.status === 'Released' ? <HiOutlineCheckCircle className="h-5 w-5" /> : payment.status === 'Failed' ? <HiOutlineExclamationCircle className="h-5 w-5" /> : <HiOutlineLockClosed className="h-4 w-4" />}</span><div><p className="text-sm font-bold text-slate-900 dark:text-white">{content.label}</p><p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{content.description}</p></div></div>

        <div className="my-5 space-y-2.5 rounded-xl bg-slate-50 p-3.5 text-xs dark:bg-slate-950/50">
          <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Contract amount</span><span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(payment.grossAmount)}</span></div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Platform fee ({payment.commissionPercent}%)</span><span>- {formatCurrency(payment.commissionAmount)}</span></div>
          <div className="h-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex justify-between font-semibold text-slate-800 dark:text-white"><span>Worker receives</span><span className="text-emerald-600 dark:text-emerald-300">{formatCurrency(payment.workerAmount)}</span></div>
        </div>

        {!payment.workerPayoutReady && payment.status === 'NotStarted' && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[11px] leading-4 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">Worker payout account must be verified before payment can be funded.</div>}
        {error && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[11px] text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

        {isCustomer && payment.canPay && <button type="button" disabled={Boolean(action) || !payment.workerPayoutReady} onClick={handlePay} className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"><HiOutlineCurrencyRupee className="h-5 w-5" />{action === 'pay' ? 'Opening checkout…' : `Fund ${formatCurrency(payment.grossAmount)}`}</button>}
        {!isCustomer && payment.canSubmitWork && <button type="button" disabled={Boolean(action)} onClick={() => runAction('submit', `/payments/job/${jobId}/submit-work`)} className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><HiOutlineCheckCircle className="h-5 w-5" />{action === 'submit' ? 'Submitting…' : 'Submit completed work'}</button>}
        {isCustomer && payment.canRelease && <button type="button" disabled={Boolean(action)} onClick={() => runAction('release', `/payments/job/${jobId}/release`)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:opacity-50"><HiOutlineCurrencyRupee className="h-5 w-5" />{action === 'release' ? 'Releasing…' : `Approve & release ${formatCurrency(payment.workerAmount)}`}</button>}
        {!isCustomer && payment.status === 'NotStarted' && <p className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400"><HiOutlineClock className="h-4 w-4" />Waiting for customer funding</p>}
        {!isCustomer && payment.status === 'WorkSubmitted' && <p className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400"><HiOutlineClock className="h-4 w-4" />Waiting for customer approval</p>}
      </div>
    </section>
  );
};

export default ContractPaymentPanel;
