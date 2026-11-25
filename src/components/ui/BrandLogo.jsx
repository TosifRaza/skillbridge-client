const BrandLogo = ({
  className = '',
  markClassName = 'h-9 w-9',
  wordmarkClassName = 'text-lg font-extrabold tracking-tight text-slate-900 dark:text-white',
  showName = true,
  name = 'SkillBridge',
}) => {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`} aria-label={showName ? undefined : name}>
      <img
        src="/images/skillbridge-brand-logo.png"
        alt=""
        aria-hidden="true"
        className={`block shrink-0 object-contain ${markClassName}`}
      />
      {showName && <span className={`truncate ${wordmarkClassName}`}>{name}</span>}
    </span>
  );
};

export default BrandLogo;
