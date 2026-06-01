import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineSearch } from 'react-icons/hi';

// Dummy data for UI structure
const conversations = [
  { id: 1, name: 'John Doe (Plumber)', lastMessage: 'I will be there at 3 PM', time: '2m ago', unread: 2 },
  { id: 2, name: 'Jane Smith (Designer)', lastMessage: 'Draft is ready!', time: '1h ago', unread: 0 },
];

const Chat = () => {
  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold text-surface-900 mb-6">Messages</h1>
      
      <div className="flex gap-6 h-full rounded-2xl overflow-hidden border border-surface-200 shadow-soft">
        {/* Sidebar - Conversation List */}
        <div className="w-1/3 bg-white border-r border-surface-200 flex flex-col">
          <div className="p-4 border-b border-surface-100">
            <Input placeholder="Search conversations..." icon={HiOutlineSearch} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((convo) => (
              <div key={convo.id} className={`flex items-center gap-3 p-4 cursor-pointer transition ${convo.id === 1 ? 'bg-primary-50 border-l-4 border-primary-500' : 'hover:bg-surface-50 border-l-4 border-transparent'}`}>
                <Avatar name={convo.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-surface-900 truncate">{convo.name}</h4>
                    <span className="text-xs text-surface-400">{convo.time}</span>
                  </div>
                  <p className="text-sm text-surface-500 truncate">{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 && <Badge variant="primary">{convo.unread}</Badge>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-2/3 bg-surface-50 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 bg-white border-b border-surface-200 flex items-center px-6 shadow-sm">
            <Avatar name="John Doe" size="sm" />
            <div className="ml-3">
              <p className="font-semibold text-surface-900 text-sm">John Doe</p>
              <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-md">
                <p className="text-surface-800 text-sm">Hi, I can fix the sink tomorrow. Will that work?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="gradient-primary p-3 rounded-xl rounded-tr-none shadow-sm max-w-md">
                <p className="text-white text-sm">Yes, that works perfectly! What time?</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-md">
                <p className="text-surface-800 text-sm">I will be there at 3 PM.</p>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-surface-200">
            <div className="flex gap-3">
              <Input className="flex-1" placeholder="Type a message..." />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;