import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineChevronDown } from 'react-icons/hi';

const faqs = [
  ['How do I post a job?', "Create a customer account, choose Post a Job, and add the task, budget, and schedule. Workers can then send proposals."],
  ['How are workers verified?', 'Worker profiles show their current verification status. Contact support if you need help understanding a profile status.'],
  ['How are payments protected?', 'Payments for eligible contracts are held until the customer approves the submitted work.'],
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = `faq-${question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className="border-b border-surface-200 py-4 dark:border-surface-700">
      <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setIsOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between gap-4 text-left">
        <span className="font-semibold text-surface-800 dark:text-surface-100">{question}</span>
        <HiOutlineChevronDown className={`h-5 w-5 shrink-0 text-surface-400 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p id={answerId} className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">{answer}</p>}
    </div>
  );
};

const ContactPage = () => {
  const [draftReady, setDraftReady] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`[SkillBridge] ${values.get('subject')}`);
    const body = encodeURIComponent(`Name: ${values.get('name')}\nEmail: ${values.get('email')}\n\n${values.get('message')}`);
    window.location.assign(`mailto:support@skillbridge.com?subject=${subject}&body=${body}`);
    setDraftReady(true);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="border-b border-surface-200 bg-white px-4 py-12 text-center dark:border-surface-700 dark:bg-surface-800 sm:py-20">
        <h1 className="mb-3 text-3xl font-bold text-surface-900 dark:text-white sm:mb-4 sm:text-4xl">Get in Touch</h1>
        <p className="text-base text-surface-500 dark:text-surface-400 sm:text-lg">We're here to help. Reach out to us anytime.</p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <Card className="p-5 sm:p-8">
            {draftReady ? (
              <div className="py-8 text-center sm:py-12">
                <HiOutlineMail className="mx-auto h-10 w-10 text-primary-600" />
                <h2 className="mb-2 mt-4 text-2xl font-bold text-surface-900 dark:text-white">Your email draft is ready</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400">Send it from your email app to contact support. If it did not open, email support@skillbridge.com.</p>
                <Button variant="outline" className="mt-6" onClick={() => setDraftReady(false)}>Write another message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input name="name" label="Full Name" autoComplete="name" required />
                  <Input name="email" label="Email Address" type="email" autoComplete="email" required />
                </div>
                <Input name="subject" label="Subject" required />
                <div>
                  <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Message</label>
                  <textarea id="contact-message" name="message" rows={5} required className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm text-surface-900 transition focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white" />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Open Email to Send</Button>
              </form>
            )}
          </Card>
        </div>

        <aside className="space-y-8">
          <Card className="space-y-2 p-5 sm:p-6">
            <a href="mailto:support@skillbridge.com" className="flex min-h-11 items-center gap-3 break-all text-surface-700 hover:text-primary-700 dark:text-surface-200">
              <HiOutlineMail className="h-5 w-5 shrink-0 text-primary-500" /> support@skillbridge.com
            </a>
            <a href="tel:+919876543210" className="flex min-h-11 items-center gap-3 text-surface-700 hover:text-primary-700 dark:text-surface-200">
              <HiOutlinePhone className="h-5 w-5 shrink-0 text-primary-500" /> +91 98765 43210
            </a>
            <div className="flex min-h-11 items-center gap-3 text-surface-700 dark:text-surface-200">
              <HiOutlineLocationMarker className="h-5 w-5 shrink-0 text-primary-500" /> Mumbai, India
            </div>
          </Card>

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="mb-2 text-xl font-bold text-surface-900 dark:text-white">Frequently Asked Questions</h2>
            {faqs.map(([question, answer]) => <FAQItem key={question} question={question} answer={answer} />)}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
