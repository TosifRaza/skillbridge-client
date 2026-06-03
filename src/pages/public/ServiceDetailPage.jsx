import { useParams, Link, Navigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineShieldCheck, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = PHASE_1_SERVICES.find(s => s.slug === `/services/${slug}`);

  // Redirect if service doesn't exist
  if (!service) return <Navigate to="/services" replace />;

  return (
    <div className="min-h-screen py-16 bg-surface-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-large p-12 text-center border border-surface-100 relative overflow-hidden">
          <span className="text-8xl opacity-10 absolute -top-4 -left-4">{service.emoji}</span>
          <Badge variant="success" className="mb-4">Verified Professionals</Badge>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4 relative z-10">{service.name}</h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-8 relative z-10">{service.shortDesc}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            {/* Updated link to safely route to dashboard, ProtectedRoute will handle auth redirect if needed */}
            <Link to="/dashboard/post-job"><Button size="lg" className="shadow-glow">Book Service</Button></Link>
            <Link to="/become-provider"><Button variant="outline" size="lg">Become a Provider</Button></Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Popular Tasks & Pricing */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-surface-900 mb-6">Popular Tasks</h2>
            <ul className="space-y-4">
              {/* Dynamically loading tasks from constants */}
              {service.popularTasks?.map((task, idx) => (
                <li key={idx} className="flex items-center gap-3 text-surface-700">
                  <span className="w-6 h-6 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                  {task}
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="p-8 bg-surface-900 text-white border-none">
            <h2 className="text-2xl font-bold mb-6">Estimated Pricing</h2>
            <p className="text-surface-300 mb-8">Prices vary based on city and job scope. You set the budget, workers send bids.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-surface-800 p-4 rounded-xl">
                <HiOutlineCurrencyDollar className="w-8 h-8 text-primary-400" />
                <div>
                  <p className="font-bold text-lg">Starting at {service.startingPrice}</p>
                  <p className="text-sm text-surface-400">Base rate for standard tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-surface-800 p-4 rounded-xl">
                <HiOutlineClock className="w-8 h-8 text-green-400" />
                <div>
                  <p className="font-bold text-lg">Hourly or Fixed</p>
                  <p className="text-sm text-surface-400">Choose how you want to pay</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Safety & CTA */}
        <Card className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-primary-500">
          <div className="flex items-center gap-4">
            <HiOutlineShieldCheck className="w-10 h-10 text-primary-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-surface-900">100% Safety Guaranteed</h3>
              <p className="text-surface-500">All workers are background verified. Payment is released only after your approval.</p>
            </div>
          </div>
          <Link to="/safety"><Button variant="outline">Learn About Safety</Button></Link>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDetailPage;