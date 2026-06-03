import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineChevronDown } from 'react-icons/hi';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-surface-200 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full text-left">
        <span className="font-semibold text-surface-800">{question}</span>
        <HiOutlineChevronDown className={`w-5 h-5 text-surface-400 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p className="mt-2 text-surface-600 text-sm leading-relaxed">{answer}</p>}
    </div>
  );
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submit logic for now
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero */}
      <div className="bg-white py-20 border-b border-surface-200 text-center">
        <h1 className="text-4xl font-bold text-surface-900 mb-4">Get in Touch</h1>
        <p className="text-surface-500 text-lg">We're here to help. Reach out to us anytime.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <span className="text-5xl">✉️</span>
                <h3 className="text-2xl font-bold text-surface-900 mt-4 mb-2">Message Sent!</h3>
                <p className="text-surface-500">We'll get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input label="Full Name" required />
                  <Input label="Email Address" type="email" required />
                </div>
                <Input label="Subject" required />
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Message</label>
                  <textarea rows="5" required className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition"></textarea>
                </div>
                <Button type="submit" className="shadow-glow">Send Message</Button>
              </form>
            )}
          </Card>
        </div>

        {/* Info & FAQ Sidebar */}
        <div className="space-y-8">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-surface-700">
              <HiOutlineMail className="w-5 h-5 text-primary-500" /> support@skillbridge.com
            </div>
            <div className="flex items-center gap-3 text-surface-700">
              <HiOutlinePhone className="w-5 h-5 text-primary-500" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-3 text-surface-700">
              <HiOutlineLocationMarker className="w-5 h-5 text-primary-500" /> Mumbai, India
            </div>
          </Card>

          <div>
            <h3 className="text-xl font-bold text-surface-900 mb-4">Frequently Asked Questions</h3>
            <FAQItem question="How do I post a job?" answer="Simply create a customer account, click 'Post a Job', fill in the details, and professionals will start bidding!" />
            <FAQItem question="How are workers verified?" answer="Workers must submit government-issued ID during onboarding, which our team manually verifies before granting the Verified badge." />
            <FAQItem question="Is my payment secure?" answer="Yes! We use an escrow system. Your funds are held safely until you mark the job as completed." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;