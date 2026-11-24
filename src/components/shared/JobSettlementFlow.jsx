import { useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineLockClosed } from 'react-icons/hi';
import axiosInstance from '@/api/axiosInstance';

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
}).format(Number(value) || 0);

const JobSettlementFlow = ({ jobId, viewerRole, onUpdated }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [completionMessage, setCompletionMessage] = useState('');
  const [reference, setReference] = useState('');
  const onUpdatedRef = useRef(onUpdated);
  const lastStatusRef = useRef(null);
  const isCustomer = viewerRole === 'customer';

  useEffect(() => { onUpdatedRef.current = onUpdated; }, [onUpdated]);

  const refresh = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/jobs/${jobId}/qr-details`);
      setContract(data.data);
      if (lastStatusRef.current && lastStatusRef.current !== data.data.status) onUpdatedRef.current?.();
      lastStatusRef.current = data.data.status;
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load this job’s payment status.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    refresh(true);
    const timer = window.setInterval(() => refresh(), 7000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const submitCompletion = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await axiosInstance.post(`/jobs/${jobId}/complete-work`, { message: completionMessage });
      await refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not submit work completion.');
    } finally {
      setBusy(false);
    }
  };

  const confirmPayment = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await axiosInstance.post(`/jobs/${jobId}/confirm-qr-payment`, { reference });
      await refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not confirm payment.');
    } finally {
      setBusy(false);
    }
  };

  const confirmReceipt = async () => {
    setBusy(true);
    setError('');
    try {
      await axiosInstance.post(`/jobs/${jobId}/confirm-upi-received`);
      await refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not confirm payment receipt.');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !contract) {
    return <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-surface-800">Loading job payment status…</section>;
  }

  if (!contract) return <section role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</section>;

  return (
    <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm dark:border-slate-700 dark:bg-surface-800">
      <header className="flex items-center justify-between gap-3 bg-[#171d3c] px-4 py-3.5 text-white sm:px-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-violet-200">Job payment</p>
          <p className="mt-1 flex items-center gap-1 text-xl font-extrabold"><HiOutlineCurrencyRupee className="h-5 w-5" />{money(contract.contractAmount)}</p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-100">
          {contract.isCompleted ? 'Paid' : contract.workSubmitted ? 'Awaiting payment' : 'Work in progress'}
        </span>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        {contract.isCompleted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/25">
            <p className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200"><HiOutlineCheckCircle className="h-5 w-5" /> Customer confirmed payment</p>
            <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-200/80">Amount: {money(contract.paidAmount || contract.contractAmount)}</p>
            {contract.paymentReference && <p className="mt-1 break-all text-xs text-emerald-800/80 dark:text-emerald-200/80">UPI reference: {contract.paymentReference}</p>}
          </div>
        ) : contract.customerReportedPayment && !isCustomer ? (
          <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/25">
            <p className="font-semibold text-amber-900 dark:text-amber-200">Customer reports paying {money(contract.contractAmount)}</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">UPI reference: <span className="font-mono font-bold">{contract.paymentReference}</span></p>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">Check your UPI app or bank statement and confirm that exactly {money(contract.contractAmount)} was received before continuing.</p>
            <button type="button" onClick={confirmReceipt} disabled={busy} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60">{busy ? 'Confirming…' : 'Confirm payment received'}</button>
          </div>
        ) : !contract.workSubmitted ? (
          isCustomer ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100"><HiOutlineClock className="h-5 w-5 text-violet-600" /> Waiting for the worker to submit completion</p>
              <p className="mt-1.5">Once the worker confirms the work is done, the exact {money(contract.contractAmount)} payment QR will appear here.</p>
            </div>
          ) : (
            <form onSubmit={submitCompletion} className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">When the work is finished, notify the customer. They’ll see a payment QR for the posted price of {money(contract.contractAmount)}.</p>
              <textarea value={completionMessage} onChange={(event) => setCompletionMessage(event.target.value)} maxLength={1000} rows={2} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-950" placeholder="Completion note (optional)" />
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">{busy ? 'Sending…' : 'Mark work complete'}</button>
            </form>
          )
        ) : contract.customerReportedPayment && isCustomer ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            You reported the {money(contract.contractAmount)} payment with UPI reference <span className="font-mono font-bold">{contract.paymentReference}</span>. Waiting for the worker to confirm they received it.
          </div>
        ) : isCustomer ? (
          contract.legacyCheckoutExists ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              A previous protected checkout is still recorded for this job, so a second QR payment is blocked. Do not pay twice; refresh or resolve the earlier checkout first.
            </div>
          ) : !contract.worker?.hasUpi ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              The worker has not added a UPI payout ID yet. Message the worker to add one; the QR will appear here when it is available.
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                <p className="font-bold">Work marked complete</p>
                <p className="mt-1">{contract.workCompletionMessage || 'The worker has submitted the completed work.'}</p>
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700 sm:flex-row sm:text-left">
                <div className="rounded-xl bg-white p-2 shadow-sm"><QRCodeSVG value={contract.upiIntent} size={160} level="M" includeMargin /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Scan to pay {money(contract.contractAmount)}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Pay {contract.worker?.name || 'the assigned worker'} using any UPI app. The amount is fixed to the job’s posted price.</p>
                  <p className="mt-2 break-all text-xs font-semibold text-violet-700 dark:text-violet-300">UPI ID: {contract.worker?.upiId}</p>
                  <a href={contract.upiIntent} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-violet-600 px-4 text-xs font-bold text-white sm:hidden">Open UPI app</a>
                </div>
              </div>
              <form onSubmit={confirmPayment} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200" htmlFor={`upi-reference-${jobId}`}>UPI transaction reference / UTR</label>
                <input id={`upi-reference-${jobId}`} value={reference} onChange={(event) => setReference(event.target.value)} minLength={6} maxLength={64} required className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Enter the reference from your UPI app" />
                <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-400">After paying, enter the transaction reference. The worker will confirm receipt. The UPI transfer itself is made directly to the worker.</p>
                <button type="submit" disabled={busy || reference.trim().length < 6} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Confirming…' : `I paid ${money(contract.contractAmount)}`}</button>
              </form>
            </>
          )
        ) : (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
            <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100"><HiOutlineLockClosed className="h-5 w-5 text-violet-600" /> Completion sent to customer</p>
            <p className="mt-1.5">Waiting for the customer to pay {money(contract.contractAmount)} and submit the UPI reference.</p>
          </div>
        )}

        {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
      </div>
    </section>
  );
};

export default JobSettlementFlow;
