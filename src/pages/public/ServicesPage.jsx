import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PHASE_1_SERVICES } from '@/constants/services';

const ServicesPage = () => {
  return (
    <div className="min-h-screen py-16 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-surface-900">Our Services</h1>
          <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
            Professional, verified local workers for your everyday needs. Book with confidence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PHASE_1_SERVICES.map((service) => (
            <Card key={service.id} hover className="p-8 flex flex-col items-center text-center group">
              <span className="text-6xl mb-6 group-hover:scale-110 transition-transform">{service.emoji}</span>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">{service.name}</h2>
              <p className="text-surface-500 mb-6 flex-grow">{service.shortDesc}</p>
              <p className="text-xl font-bold text-primary-600 mb-6">Starting from {service.startingPrice}</p>
              <Link to={service.slug}><Button>Explore Service</Button></Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;