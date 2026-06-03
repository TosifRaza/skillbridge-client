import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { cn } from '@/utils/helpers';

const SearchBar = ({ 
  placeholder = "Search for services (e.g., Plumber, Web Dev)...", 
  className,
  onSearch 
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) onSearch(query);
      else navigate(`/services?q=${query}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full relative", className)}>
      <div className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-12 pr-10 py-3.5 rounded-xl border shadow-soft",
            "bg-white dark:bg-surface-800",
            "text-surface-900 dark:text-surface-100",
            "placeholder:text-surface-400 dark:placeholder:text-surface-500",
            "border-surface-200 dark:border-surface-700",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "transition-all duration-200"
          )}
        />
        {query && (
          <button 
            type="button" 
            onClick={clearSearch} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;