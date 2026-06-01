import Card from '@/components/ui/Card';
import { HiOutlineShieldCheck, HiOutlineIdentification, HiOutlineStar, HiOutlineChatAlt, HiOutlineExclamation, HiOutlineSupport, HiOutlineUserGroup, HiOutlineScale } from 'react-icons/hi';

const features = [
  { icon: HiOutlineIdentification, title: 'Government ID Verification', desc: 'Every worker must submit valid Aadhaar/PAN before accepting jobs.' },
  { icon: HiOutlineStar, title: 'Ratings & Reviews', desc: 'Transparent feedback system holds workers and customers accountable.' },
  { icon: HiOutlineChatAlt, title: 'Secure Messaging', desc: 'Chat within the app. Your personal phone number stays private.' },
  { icon: HiOutlineExclamation, title: 'Fraud Protection', desc: 'AI and manual checks prevent fake profiles and scam bids.' },
  { icon: HiOutlineSupport, title: 'Dispute Resolution', desc: 'Dedicated support team steps in if there’s a disagreement.' },
  { icon: HiOutlineUserGroup, title: 'Customer Protection', desc: 'If the work isn’t done right, your payment is protected under Escrow.' },
  { icon: HiOutlineScale, title: 'Worker Protection', desc: 'Guaranteed payment for work completed. No more chasing clients.' },
  { icon: HiOutlineShieldCheck, title: 'Community Standards', desc: 'Strict code of conduct enforced to maintain a respectful environment.' },
];

const SafetyPage = () => {
  return (
    <div className="min-h-screen py-16 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-surface-900">Safety & Trust</h1>
          <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">Your safety is our #1 priority. We built SkillBridge so you can hire or work with complete peace of mind.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <Card key={idx} className="p-6 text-center hover:shadow-large transition">
              <feat.icon className="w-10 h-10 text-primary-500 mx-auto mb-4" />
              <h3 className="font-bold text-surface-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-surface-500">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;