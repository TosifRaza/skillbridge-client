const ServiceIcon = ({ serviceId, className = 'h-8 w-8' }) => (
  <img
    src={`/images/services/${serviceId}.svg`}
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
    className={`${className} object-contain`}
  />
);

export default ServiceIcon;
