import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchConversations, markConversationRead } from '@/store/slices/chatSlice';
import ChatInterface from '@/components/shared/ChatInterface';
import Avatar from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { HiOutlineChatAlt, HiOutlineSearch, HiOutlineShieldCheck } from 'react-icons/hi';

const getPreview = (message, userId) => {
  if (!message) return 'Say hello to start chatting';
  if (message.type === 'call') {
    const callType = message.call?.callType === 'video' ? 'Video' : 'Audio';
    const state = message.call?.status === 'missed' ? 'missed' : message.call?.status === 'declined' ? 'declined' : 'call';
    return `${callType} ${state}`;
  }
  const imageCount = message.imageUrls?.length || (message.imageUrl ? 1 : 0);
  const attachmentPreview = message.attachment?.name || (imageCount > 1 ? `${imageCount} photos shared` : imageCount === 1 ? 'Photo shared' : 'New message');
  const text = message.text?.trim() || attachmentPreview;
  const senderId = message.sender?._id || message.sender;
  return senderId && userId && senderId.toString() === userId.toString() ? `You: ${text}` : text;
};
const getTime = (message) => {
  if (!message?.createdAt) return '';
  const date = new Date(message.createdAt);
  const today = new Date();
  return date.toDateString() === today.toDateString()
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatPage = ({ userRole }) => {
  const dispatch = useAppDispatch();
  const { conversations, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { dispatch(fetchConversations()); }, [dispatch]);

  const requestedConversationId = searchParams.get('conversationId');
  const selectedConversation = conversations.find((conversation) => conversation.conversationId === requestedConversationId);
  const activeConvo = selectedConversation?.conversationId;
  useEffect(() => {
    if (activeConvo) dispatch(markConversationRead(activeConvo));
  }, [activeConvo, dispatch]);

  const visibleConversations = useMemo(() => conversations.filter((conversation) => {
    const query = searchTerm.trim().toLowerCase();
    return !query || `${conversation.title || ''} ${conversation.participant?.fullName || ''} ${conversation.participant?.email || ''}`.toLowerCase().includes(query);
  }), [conversations, searchTerm]);

  const handleSelectConversation = (conversation) => {
    setSearchParams({ conversationId: conversation.conversationId }, { replace: true });
  };
  const handleBackToConversations = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="project-chat-page flex h-full min-h-0 w-full overflow-hidden bg-white dark:bg-surface-800">
      <aside className={`${activeConvo ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-slate-200/80 bg-[#fbfcff] dark:border-surface-700 dark:bg-surface-900 md:w-[300px] lg:w-[340px]`}>
        <div className="border-b border-slate-200/80 bg-white px-5 py-5 dark:border-surface-700 dark:bg-surface-800">
          <div className="flex items-center justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary-600 dark:text-primary-400">Your workspace</p><h2 className="mt-1 text-xl font-bold tracking-tight text-surface-900 dark:text-white">Messages</h2></div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-surface-700 dark:text-slate-300">{conversations.length}</span>
          </div>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">Project updates, all in one place.</p>
          <label className="mt-4 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-primary-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-900 dark:focus-within:bg-surface-900">
            <HiOutlineSearch className="h-4 w-4 shrink-0 text-slate-400"/><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search conversations" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"/>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? <div className="flex justify-center py-10"><Spinner /></div> : visibleConversations.length ? (
            visibleConversations.map((conversation) => {
              const participantName = conversation.participant?.fullName || conversation.participant?.email || (userRole === 'customer' ? 'Your worker' : 'Customer');
              const isActive = activeConvo === conversation.conversationId;
              const unreadCount = conversation.unreadCount || 0;
              return (
                <button key={conversation.conversationId} onClick={() => handleSelectConversation(conversation)} className={`group relative mx-2 my-1.5 flex w-[calc(100%-1rem)] items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition duration-200 ${isActive ? 'border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50/70 shadow-[0_8px_22px_rgba(79,70,229,.09)] dark:border-primary-800 dark:from-primary-900/25 dark:to-violet-900/15' : 'border-transparent bg-white hover:border-slate-200 hover:shadow-[0_6px_18px_rgba(15,23,42,.06)] dark:bg-surface-900 dark:hover:border-surface-700'}`}>
                  <div className="shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 p-[2px] dark:from-primary-800 dark:to-violet-900"><Avatar src={conversation.participant?.avatar?.url} name={participantName} size="md" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2"><p className={`truncate text-[13px] ${unreadCount ? 'font-bold text-surface-900 dark:text-white' : 'font-semibold text-surface-800 dark:text-slate-100'}`}>{conversation.title}</p><span className={`shrink-0 text-[10px] ${unreadCount ? 'font-semibold text-primary-600 dark:text-primary-300' : 'text-slate-400'}`}>{getTime(conversation.lastMessage)}</span></div>
                    <div className="mt-1 flex min-w-0 items-center gap-1.5"><p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{conversation.category || participantName}</p>{conversation.category && <><span className="h-1 w-1 shrink-0 rounded-full bg-slate-300"/><span className="truncate text-[10px] text-slate-400">{conversation.status}</span></>}</div>
                    <div className="mt-2 flex items-center justify-between gap-2"><p className={`truncate text-[11px] ${unreadCount ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>{getPreview(conversation.lastMessage, user?._id)}</p>{unreadCount > 0 && <span className="flex h-[20px] min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-primary-600/25">{unreadCount > 99 ? '99+' : unreadCount}</span>}</div>
                  </div>
                </button>
              );
            })
          ) : conversations.length ? (
            <div className="px-6 py-10 text-center"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-surface-800"><HiOutlineSearch className="h-5 w-5"/></div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No matches found</p><p className="mt-1 text-xs text-slate-400">Try a different job or name.</p></div>
          ) : (
            <EmptyState icon="💬" title="No conversations yet" description="Chat becomes available when a job is assigned to a worker." />
          )}
        </div>
        <div className="border-t border-slate-100 px-5 py-3 dark:border-surface-800"><div className="flex items-center gap-2 text-[10px] text-slate-400"><HiOutlineShieldCheck className="h-4 w-4 text-emerald-500"/>Your project chats are private</div></div>
      </aside>

      <div className={`${activeConvo ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
        {selectedConversation ? (
          <ChatInterface key={activeConvo} conversationId={activeConvo} otherUserEmail={selectedConversation.participant?.email} project={selectedConversation} projectHref={`/${userRole === 'provider' ? 'worker' : 'customer'}/jobs/${selectedConversation._id}`} userRole={userRole} onBack={handleBackToConversations} />
        ) : (
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,rgba(99,102,241,.09),transparent_42%),linear-gradient(145deg,#fbfcff,#f5f7fc)] p-8 text-center dark:bg-[radial-gradient(ellipse_at_50%_45%,rgba(99,102,241,.14),transparent_42%),linear-gradient(145deg,#111827,#0f172a)]">
            <div className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-indigo-100 bg-white text-primary-500 shadow-[0_12px_35px_rgba(99,102,241,.15)] dark:border-surface-700 dark:bg-surface-800"><HiOutlineChatAlt className="h-9 w-9" /></div>
            <h3 className="text-xl font-bold tracking-tight text-surface-800 dark:text-surface-100">Your next great conversation starts here</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-surface-500 dark:text-surface-400">Choose a project from your inbox to chat, share updates, and keep the work moving.</p>
            <div className="mt-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-500 dark:border-surface-700 dark:bg-surface-800/80 dark:text-slate-300"><HiOutlineShieldCheck className="h-4 w-4 text-emerald-500"/>Private project conversations</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
