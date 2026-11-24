import { useRef, useState } from 'react';
import {
  LuArrowDownLeft, LuArrowRight, LuHistory, LuPlus, LuReceiptText, LuShieldCheck, LuUpload, LuZap,
} from 'react-icons/lu';
import { SiRazorpay } from 'react-icons/si';
import Spinner from '@/components/ui/Spinner';
import './MobileCustomerWallet.css';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const formatAmount = (amount) => money.format(Number(amount) || 0);

const tabs = [
  { label: 'All', includes: () => true },
  { label: 'Added', includes: (transaction) => transaction.type === 'deposit' },
  { label: 'Payments', includes: (transaction) => transaction.type === 'debit' || transaction.status === 'Refunded' },
  { label: 'Protected', includes: (transaction) => transaction.type === 'escrow_hold' || transaction.status === 'InEscrow' },
];

const metrics = [
  { label: 'Protected Funds', field: 'inEscrow', icon: LuShieldCheck, tone: 'protected' },
  { label: 'Total Added', field: 'totalDeposited', icon: LuPlus, tone: 'added' },
  { label: 'Total Spent', field: 'totalSpent', icon: LuArrowRight, tone: 'spent' },
];

const benefits = [
  { label: 'Protected payments', icon: LuShieldCheck },
  { label: 'Refund history', icon: LuZap },
  { label: 'Clear history', icon: LuHistory },
];

const WalletTransaction = ({ transaction }) => {
  const isProtected = transaction.type === 'escrow_hold' || transaction.status === 'InEscrow';
  const isIncoming = ['credit', 'deposit', 'escrow_release'].includes(transaction.type);
  const Icon = isProtected ? LuShieldCheck : isIncoming ? LuArrowDownLeft : LuArrowRight;
  const tone = isProtected ? 'protected' : isIncoming ? 'added' : 'spent';
  const date = transaction.createdAt ? new Date(transaction.createdAt) : null;
  const dateLabel = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const showSign = transaction.status === 'Completed' || transaction.status === 'Refunded';

  return (
    <li className="customer-wallet-transaction">
      <span className={`customer-wallet-icon ${tone}`}><Icon aria-hidden="true" /></span>
      <span className="customer-wallet-transaction-copy">
        <strong>{transaction.title}</strong>
        <span>{dateLabel && <time dateTime={date.toISOString()}>{dateLabel} · </time>}{isProtected && transaction.status === 'InEscrow' ? 'Protected' : transaction.status}</span>
      </span>
      <strong className={isIncoming && showSign ? 'text-green-700 dark:text-green-300' : ''}>
        {showSign && (isIncoming ? '+' : '−')}{formatAmount(transaction.netAmount ?? transaction.amount)}
      </strong>
    </li>
  );
};

const MobileCustomerWallet = ({ wallet, transactions, loading, error, successMessage, onAddMoney, onRefresh, onDismiss }) => {
  const [tab, setTab] = useState('All');
  const history = useRef(null);
  const withdrawal = useRef(null);
  const currentTab = tabs.find(({ label }) => label === tab);
  const visibleTransactions = transactions.filter(currentTab.includes);
  const hasWallet = Boolean(wallet.id);
  const balance = hasWallet ? formatAmount(wallet.balance) : '—';
  const hasHistory = transactions.length > 0;
  const goToHistory = () => {
    setTab('All');
    history.current?.scrollIntoView({ block: 'start' });
    history.current?.focus({ preventScroll: true });
  };

  return (
    <section className="customer-wallet-mobile md:hidden">
      <header className="customer-wallet-heading">
        <h1>Wallet</h1>
        <p>Safe money for your jobs.</p>
      </header>

      <section className="customer-wallet-hero" aria-label="Wallet balance">
        <img className="customer-wallet-art" src="/images/customer-wallet-hero.webp" alt="" width="576" height="576" fetchPriority="high" />
        <div className="customer-wallet-balance">
          <p>Available Balance</p>
          <strong className={balance.length > 9 ? 'long-balance' : undefined}>{balance}</strong>
          <span><LuShieldCheck aria-hidden="true" />Secure Wallet</span>
        </div>
        <div className="customer-wallet-actions">
          <button type="button" className="customer-wallet-add" onClick={onAddMoney}><LuPlus aria-hidden="true" />Add Money</button>
          <button type="button" onClick={() => withdrawal.current?.showModal()}><LuUpload aria-hidden="true" />Withdraw</button>
          <button type="button" onClick={goToHistory}><LuHistory aria-hidden="true" />History</button>
        </div>
      </section>

      <dl className="customer-wallet-metrics">
        {metrics.map(({ label, field, icon: Icon, tone }) => (
          <div key={field} className={`customer-wallet-metric ${tone}`}>
            <dt><span className={`customer-wallet-icon ${tone}`}><Icon aria-hidden="true" /></span><span>{label}</span></dt>
            <dd>{hasWallet && wallet[field] != null ? formatAmount(wallet[field]) : '—'}</dd>
          </div>
        ))}
      </dl>

      {(successMessage || (error && hasWallet)) && (
        <div className="customer-wallet-notice" role={successMessage ? 'status' : 'alert'}>
          <span>{successMessage || error}</span><button type="button" onClick={onDismiss}>Dismiss</button>
        </div>
      )}

      <section ref={history} className="customer-wallet-history" aria-label="Transaction history" tabIndex={-1}>
        <div className="customer-wallet-tabs" role="group" aria-label="Filter transactions">
          {tabs.map(({ label }) => (
            <button type="button" key={label} aria-pressed={tab === label} onClick={() => setTab(label)}>{label}</button>
          ))}
        </div>

        <div className="customer-wallet-transactions" aria-busy={loading}>
          {!hasWallet && !error ? (
            <div className="customer-wallet-loading" role="status" aria-label="Loading wallet"><Spinner /></div>
          ) : !hasWallet && error ? (
            <div className="customer-wallet-empty" role="alert">
              <h2>Could not load your wallet</h2>
              <p>{error}</p>
              <button type="button" className="customer-wallet-checkout" onClick={onRefresh}>Try again</button>
            </div>
          ) : visibleTransactions.length ? (
            <ul aria-label={`${tab} transactions`}>
              {visibleTransactions.map((transaction) => <WalletTransaction key={transaction._id || transaction.referenceId} transaction={transaction} />)}
            </ul>
          ) : (
            <div className="customer-wallet-empty">
              <span className="customer-wallet-receipt"><LuReceiptText aria-hidden="true" /></span>
              <h2>{hasHistory ? `No ${tab === 'Added' ? 'deposits' : tab === 'Protected' ? 'protected transactions' : 'payments'} yet` : 'No transactions yet'}</h2>
              <p>{hasHistory ? 'Activity will appear here when it’s available.' : 'Your deposits and job payments will appear here.'}</p>
              {(!hasHistory || tab === 'Added') && (
                <button type="button" className="customer-wallet-checkout" onClick={onAddMoney}><SiRazorpay aria-hidden="true" />Add Money via Razorpay</button>
              )}
            </div>
          )}
        </div>
      </section>

      <ul className="customer-wallet-benefits">
        {benefits.map(({ label, icon: Icon }) => <li key={label}><Icon aria-hidden="true" /><span>{label}</span></li>)}
      </ul>

      <dialog ref={withdrawal} className="customer-wallet-dialog" aria-labelledby="wallet-withdraw-title">
        <h2 id="wallet-withdraw-title">Withdraw</h2>
        <p>Withdrawals are currently unavailable for customer wallets.</p>
        <form method="dialog"><button type="submit" className="customer-wallet-checkout">Done</button></form>
      </dialog>
    </section>
  );
};

export default MobileCustomerWallet;
