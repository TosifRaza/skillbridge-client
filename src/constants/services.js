export const PHASE_1_SERVICES = [
  {
    id: 'house-cleaning',
    name: 'House Cleaning',
    slug: '/services/house-cleaning',
    emoji: '🧹',
    shortDesc: 'Deep cleans, move-in/move-out, and regular maintenance.',
    startingPrice: '₹449',
    serviceType: 'local', // NEW: Enables Local/Digital filtering
    popularTasks: ['Deep Home Cleaning', 'Kitchen & Bathroom Scrubbing', 'Move-in/Move-out Cleaning', 'Sofa & Carpet Vacuuming'] // NEW: Moved from UI
  },
  {
    id: 'moving-help',
    name: 'Moving Help',
    slug: '/services/moving-help',
    emoji: '📦',
    shortDesc: 'Packing, loading, unloading, and furniture rearrangement.',
    startingPrice: '₹699',
    serviceType: 'local',
    popularTasks: ['Packing & Unpacking', 'Loading & Unloading Truck', 'Furniture Rearrangement', 'Office Relocation Help']
  },
  {
    id: 'gardening',
    name: 'Gardening & Landscaping',
    slug: '/services/gardening',
    emoji: '🌿',
    shortDesc: 'Lawn mowing, weed pulling, and seasonal yard cleanup.',
    startingPrice: '₹399',
    serviceType: 'local',
    popularTasks: ['Lawn Mowing', 'Weed Removal', 'Tree Trimming', 'Seasonal Yard Cleanup']
  },
  {
    id: 'event-staffing',
    name: 'Event Staffing',
    slug: '/services/event-staffing',
    emoji: '🎉',
    shortDesc: 'Party setup, servers, cleanup crews, and event helpers.',
    startingPrice: '₹599',
    serviceType: 'local',
    popularTasks: ['Party Setup & Decor', 'Waiters & Servers', 'Cleanup Crews', 'Bartending Assistance']
  },
  {
    id: 'general-labor',
    name: 'General Labor',
    slug: '/services/general-labor',
    emoji: '🏋️',
    shortDesc: 'Garage organization, junk removal, and basic handyman help.',
    startingPrice: '₹349',
    serviceType: 'local',
    popularTasks: ['Garage Organization', 'Junk Removal', 'Assembly (Furniture/Appliances)', 'Warehouse Labor']
  }
];