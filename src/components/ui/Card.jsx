const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-2xl border border-surface-200 shadow-soft p-6 transition-all duration-200 ${hover ? 'hover:shadow-large hover:-translate-y-1 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;