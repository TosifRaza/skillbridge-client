const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const Avatar = ({ src, name, size = 'md' }) => {
  const initials = name ? name.charAt(0).toUpperCase() : '?';

  return src ? (
    <img src={src} alt={name} className={`${sizeStyles[size]} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div className={`${sizeStyles[size]} rounded-full gradient-primary flex items-center justify-center text-white font-bold ring-2 ring-white`}>
      {initials}
    </div>
  );
};

export default Avatar;