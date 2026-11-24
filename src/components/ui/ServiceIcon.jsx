const ServiceIcon = ({ serviceId, className = 'h-7 w-7' }) => {
  const shared = {
    viewBox: '0 0 48 48',
    className,
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
    focusable: 'false',
  };

  if (serviceId === 'house-cleaning') {
    return (
      <svg {...shared}>
        <path d="m28.8 7.2 3.4 3.4-16.7 19.2-4.2-4.2L28.8 7.2Z" fill="#F3A64A" stroke="#5B35B6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m10.1 24.5 8.2 8.2-7.2 7.2a2.7 2.7 0 0 1-3.8-3.8l2.8-11.6Z" fill="#FFC857" stroke="#5B35B6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m10.3 31.1 5 5M8.9 35l4.2 4.2" stroke="#E99328" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m37 8 .8 2.3 2.2.8-2.2.8L37 14l-.8-2.1-2.2-.8 2.2-.8L37 8Z" fill="#8B5CF6" />
      </svg>
    );
  }

  if (serviceId === 'moving-help') {
    return (
      <svg {...shared}>
        <path d="m8 15 15.8-8 16.1 8.1v20.2l-16 7.6L8 35.3V15Z" fill="#DFA66C" stroke="#69432E" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m8.4 15.2 15.5 8.1 15.5-8.1M23.9 23.3v19.1" stroke="#69432E" strokeWidth="2" strokeLinejoin="round" />
        <path d="m17.4 10.3 15.8 8.2-8.7 4.5-15.5-8.1 8.4-4.6Z" fill="#F3C28D" stroke="#69432E" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m21.1 12.2 8.2 4.2-2.6 1.3-8.1-4.2 2.5-1.3Z" fill="#FFF1D9" />
        <path d="M12.4 31.2v2.4l3 1.5v-2.4l-3-1.5Z" fill="#A96E3E" />
      </svg>
    );
  }

  if (serviceId === 'gardening') {
    return (
      <svg {...shared}>
        <path d="M12 38c8.2-7.2 14.6-15.9 21.8-28" stroke="#32854C" strokeWidth="3" strokeLinecap="round" />
        <path d="M15.4 34.3c-7.8-.2-11-5.3-10.8-10.5 6.6-.5 12 2.5 13.8 8.1M21.2 27c-1.2-7.8 3-12 8.1-13.1 2.2 6.2.7 12.1-4.7 15.4M27.3 18.7c1.1-7.3 5.9-10.1 11-9.5.1 6.4-3 11.3-8.8 12.8M18.2 31.4c-1.2-6.2.7-10.1 4.5-12.4" fill="#71C956" stroke="#32854C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.8 32.1c-2.7-.6-4.2-2.1-5-4.3 3 .1 5.2 1.2 6.5 3.7M25.9 26c-.2-2.7.8-4.5 2.7-6 1 2.8.5 5.1-1.5 7.1M31 17.6c.8-2.5 2.3-3.8 4.6-4.5-.3 2.8-1.6 4.8-4.1 5.8" fill="#A4E478" />
      </svg>
    );
  }

  if (serviceId === 'event-staffing') {
    return (
      <svg {...shared}>
        <path d="m10.1 30.1 9.1-17.8a2.5 2.5 0 0 1 4.2-.5l11.8 11.8a2.5 2.5 0 0 1-.5 4.2l-17.8 9.1a3.2 3.2 0 0 1-4.3-4.3l-2.5-2.5Z" fill="#FFC94A" stroke="#5B35B6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m17.1 18.8 12.1 12.1" stroke="#F48A55" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20.6" cy="23.4" r="1.7" fill="#EF476F" />
        <circle cx="25.8" cy="28.6" r="1.7" fill="#8B5CF6" />
        <path d="m32.9 8 .7 3 2.8 1.2-2.8.8-.9 2.9-.8-2.9-2.8-.9 2.8-1 .9-3.1ZM11 9l.6 2.1 2 .7-2 .7L11 15l-.7-2.5-2-.7 2-.7L11 9Z" fill="#8B5CF6" />
        <path d="m37.6 19 1.6 1.7M9 20l1.9-1.3M29.2 6.2l.5-2" stroke="#EF476F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (serviceId === 'general-labor') {
    return (
      <svg {...shared}>
        <path d="M7 17.5 24 8l17 9.5-17 9.7L7 17.5Z" fill="#F0B44D" stroke="#5B35B6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M7 17.5v14L24 41l17-9.5v-14M24 27.2V41" stroke="#5B35B6" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m15.2 12.2 17 9.5-8.2 4.7-17-9.5 8.2-4.7Z" fill="#FFE2A3" stroke="#9A662E" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m20.5 30.1 2.1 1.2v3.1l-2.1-1.2v-3.1ZM12.4 25.6l2.1 1.2v3.1l-2.1-1.2v-3.1Z" fill="#A96E3E" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <rect x="10" y="14" width="28" height="23" rx="4" fill="#E9E3FF" stroke="#6840D8" strokeWidth="2.2" />
      <path d="M16 14v-3a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3M10 22h28" stroke="#6840D8" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m18 30 4 4 8-9" stroke="#6840D8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default ServiceIcon;
