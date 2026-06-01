import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { HiOutlineIdentification, HiOutlineUserCircle, HiOutlineBriefcase, HiOutlineCurrencyDollar } from 'react-icons/hi';

const steps = [
  { icon: HiOutlineUserCircle, title: 'Create Account', desc: 'Sign up using your email and phone number.' },
  { icon: HiOutlineIdentification, title: 'Verify Identity', desc: 'Upload your Government ID (Aadhaar/PAN) for trust.' },
  { icon: HiOutlineBriefcase, title: 'Add Skills', desc: 'Select your expertise (Cleaning, Moving, etc.).' },
  { icon: HiOutlineCurrencyDollar, title: 'Start Earning', desc: 'Browse jobs, apply, and get paid securely.' },
];

const BecomeProviderPage = () => {
  return (
    <div className="min-h-screen py-16 bg-surface-50">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center animate-fade-in">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-surface-900">Turn your skills into an <span className="text-primary-600">opportunity.</span></h1>
        <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">Join thousands of workers on SkillBridge. Find flexible local work and get paid securely.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/auth/register?role=provider"><Button size="lg" className="shadow-glow">Register as Provider</Button></Link>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Card key={idx} className="text-center p-6 relative">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">{idx + 1}</div>
              <step.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
              <h3 className="font-bold text-surface-900 mb-1">{step.title}</h3>
              <p className="text-sm text-surface-500">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Earnings & CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-surface-900 text-white p-10 text-center border-none">
          <h2 className="text-3xl font-bold mb-4">Estimated Earnings</h2>
          <p className="text-surface-300 mb-6">Workers on SkillBridge earn an average of ₹15,000 - ₹30,000 per month working part-time.</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-800 p-4 rounded-xl">
              <p className="text-2xl font-bold text-primary-400">₹449+</p>
              <p className="text-xs text-surface-400 mt-1">House Cleaning</p>
            </div>
            <div className="bg-surface-800 p-4 rounded-xl">
              <p className="text-2xl font-bold text-green-400">₹699+</p>
              <p className="text-xs text-surface-400 mt-1">Moving Help</p>
            </div>
            <div className="bg-surface-800 p-4 rounded-xl">
              <p className="text-2xl font-bold text-yellow-400">₹399+</p>
              <p className="text-xs text-surface-400 mt-1">Gardening</p>
            </div>
          </div>
          <Link to="/auth/register?role=provider"><Button size="lg" className="bg-white text-primary-700 hover:bg-surface-100">Start Earning Today</Button></Link>
        </Card>
      </div>
    </div>
  );
};

export default BecomeProviderPage;