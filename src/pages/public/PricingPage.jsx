import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    <div className="min-h-screen py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-surface-900">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-surface-500">No hidden fees. No subscriptions. Only pay when a job is done.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <Card className="p-8 border-2 border-primary-200 relative">
            <div className="absolute -top-3 left-6 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">FOR CUSTOMERS</div>
            <h2 className="text-2xl font-bold text-surface-900 mt-2 mb-4">Post Jobs Free</h2>
            <p className="text-surface-500 mb-6">You only pay the agreed amount to the worker upon successful job completion. Zero risk.</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-surface-700"><span className="text-green-500 font-bold">✓</span> Free Job Posting</li>
              <li className="flex items-center gap-2 text-surface-700"><span className="text-green-500 font-bold">✓</span> No Commitment Required</li>
              <li className="flex items-center gap-2 text-surface-700"><span className="text-green-500 font-bold">✓</span> Secure Escrow Protection</li>
            </ul>
            <div className="text-4xl font-extrabold text-primary-600">0%<span className="text-lg font-normal text-surface-400 ml-1">Service Fee</span></div>
            <Link to="/auth/register"><Button className="w-full mt-8">Get Started</Button></Link>
          </Card>

          {/* Worker Card */}
          <Card className="p-8 border-2 border-surface-200 relative">
            <div className="absolute -top-3 left-6 bg-surface-800 text-white text-xs font-bold px-3 py-1 rounded-full">FOR PROVIDERS</div>
            <h2 className="text-2xl font-bold text-surface-900 mt-2 mb-4">Keep What You Earn</h2>
            <p className="text-surface-500 mb-6">A small platform fee is deducted only after you successfully complete a job and get paid.</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-surface-700"><span className="text-green-500 font-bold">✓</span> Browse & Apply Free</li>
              <li className="flex items-center gap-2 text-surface-700"><span className="text-green-500 font-bold">✓</span> Guaranteed Payment</li>
              <li className="flex items-center gap-2 text-surface-700"><span className="text-green-500 font-bold">✓</span> Build Your Career</li>
            </ul>
            <div className="text-4xl font-extrabold text-surface-900">10%<span className="text-lg font-normal text-surface-400 ml-1">Platform Fee</span></div>
            <Link to="/auth/register?role=provider"><Button variant="outline" className="w-full mt-8">Start Earning</Button></Link>
          </Card>
        </div>

        {/* Example Calculation */}
        <div className="mt-16 max-w-3xl mx-auto bg-surface-50 p-8 rounded-2xl border border-surface-200 text-center">
          <h3 className="text-xl font-bold text-surface-900 mb-4">How the 10% Commission Works</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
            <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-soft w-full md:w-1/3">
              <p className="text-surface-400 text-sm">Customer Pays</p>
              <p className="text-3xl font-bold text-surface-900">₹1000</p>
            </div>
            <span className="text-2xl text-surface-300">→</span>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-soft w-full md:w-1/3">
              <p className="text-green-600 text-sm">Worker Receives</p>
              <p className="text-3xl font-bold text-green-700">₹900</p>
            </div>
            <span className="text-2xl text-surface-300">+</span>
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-200 shadow-soft w-full md:w-1/3">
              <p className="text-primary-600 text-sm">SkillBridge Fee</p>
              <p className="text-3xl font-bold text-primary-700">₹100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;