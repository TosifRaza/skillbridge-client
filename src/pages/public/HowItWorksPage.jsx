import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const customerFlow = [
  { step: 1, title: 'Post Job', desc: 'Describe your problem, set budget and deadline.' },
  { step: 2, title: 'Receive Applications', desc: 'Verified workers bid on your job.' },
  { step: 3, title: 'Chat With Worker', desc: 'Discuss details before hiring.' },
  { step: 4, title: 'Hire Worker', desc: 'Select the best person for the job.' },
  { step: 5, title: 'Job Completed', desc: 'Work is done to your satisfaction.' },
  { step: 6, title: 'Release Payment', desc: 'Pay securely only after approval.' },
];

const workerFlow = [
  { step: 1, title: 'Create Profile', desc: 'Add your skills and verification ID.' },
  { step: 2, title: 'Browse Jobs', desc: 'Find local jobs in your city.' },
  { step: 3, title: 'Apply', desc: 'Send proposals with your bid.' },
  { step: 4, title: 'Get Hired', desc: 'Customer accepts your application.' },
  { step: 5, title: 'Complete Work', desc: 'Do the job and upload proof.' },
  { step: 6, title: 'Earn Money', desc: 'Get paid directly to your bank.' },
];

const Timeline = ({ data, color }) => (
  <div className="space-y-6">
    {data.map((item) => (
      <div key={item.step} className="flex gap-4 items-start">
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${color === 'primary' ? 'gradient-primary' : 'bg-green-500'}`}>
          {item.step}
        </div>
        <div>
          <h3 className="font-bold text-surface-900 text-lg">{item.title}</h3>
          <p className="text-surface-500">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-surface-900">How SkillBridge Works</h1>
          <p className="mt-4 text-lg text-surface-500">Simple, transparent, and secure for everyone.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="p-8 border-t-4 border-t-primary-500">
            <Badge variant="primary" className="mb-6">For Customers</Badge>
            <Timeline data={customerFlow} color="primary" />
          </Card>
          
          <Card className="p-8 border-t-4 border-t-green-500">
            <Badge variant="success" className="mb-6">For Workers</Badge>
            <Timeline data={workerFlow} color="green" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;