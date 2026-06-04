import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';

const WorkerHome = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Worker Portal</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8">Welcome back! Find jobs and grow your earnings.</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="dark:bg-surface-800 p-6 flex items-center gap-4 border-l-4 border-green-500">
          <HiOutlineSearch className="w-10 h-10 text-green-500" />
          <div>
            <h3 className="font-bold text-surface-900 dark:text-white text-lg">Find Available Work</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Browse local and digital jobs in your area.</p>
          </div>
          <Link to="/worker/jobs" className="ml-auto"><Button size="sm" variant="outline">Browse Jobs</Button></Link>
        </Card>
      </div>
    </div>
  );
};

export default WorkerHome;