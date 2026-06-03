import { cn } from '@/utils/helpers';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-surface-200">
      <nav className="flex gap-6 -mb-px" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.value
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300"
            )}
          >
            {tab.label} {tab.count !== undefined && <span className="ml-2 bg-surface-100 text-surface-600 py-0.5 px-2 rounded-full text-xs">{tab.count}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;