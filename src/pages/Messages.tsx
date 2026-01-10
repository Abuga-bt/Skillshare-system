import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<{ full_name: string; avatar_url: string | null } | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      const userParam = searchParams.get('user');
      if (userParam) {
        setSelectedUser(userParam);
        fetchMessages(userParam);
        fetchUserProfile(userParam);
      }
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === user.id || newMsg.receiver_id === user.id) {
            if (selectedUser && (newMsg.sender_id === selectedUser || newMsg.receiver_id === selectedUser)) {
              setMessages((prev) => [...prev, newMsg]);
            }
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    // Get all unique conversations
    const { data: allMessages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
      .order('created_at', { ascending: false });

    if (error || !allMessages) {
      setLoading(false);
      return;
    }

    // Group by conversation partner
    const conversationMap = new Map<string, { messages: Message[]; unread: number }>();
    
    allMessages.forEach((msg) => {
      const partnerId = msg.sender_id === user!.id ? msg.receiver_id : msg.sender_id;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, { messages: [], unread: 0 });
      }
      conversationMap.get(partnerId)!.messages.push(msg);
      if (msg.receiver_id === user!.id && !msg.read) {
        conversationMap.get(partnerId)!.unread++;
      }
    });

    // Fetch profiles for all partners
    const partnerIds = Array.from(conversationMap.keys());
    if (partnerIds.length === 0) {
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', partnerIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const convos: Conversation[] = partnerIds.map((partnerId) => {
      const { messages: msgs, unread } = conversationMap.get(partnerId)!;
      const profile = profileMap.get(partnerId);
      return {
        user_id: partnerId,
        full_name: profile?.full_name || 'Anonymous',
        avatar_url: profile?.avatar_url || null,
        last_message: msgs[0]?.content || '',
        last_message_time: msgs[0]?.created_at || '',
        unread_count: unread,
      };
    });

    convos.sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
    setConversations(convos);
    setLoading(false);
  };

  const fetchMessages = async (partnerId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user!.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user!.id})`
      )
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', partnerId)
        .eq('receiver_id', user!.id);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setSelectedUserProfile(data);
    }
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUser(userId);
    const convo = conversations.find((c) => c.user_id === userId);
    if (convo) {
      setSelectedUserProfile({ full_name: convo.full_name, avatar_url: convo.avatar_url });
    }
    fetchMessages(userId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;
    setSending(true);

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedUser,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage('');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((convo) => (
                  <button
                    key={convo.user_id}
                    onClick={() => handleSelectConversation(convo.user_id)}
                    className={cn(
                      "w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left",
                      selectedUser === convo.user_id && "bg-secondary"
                    )}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={convo.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {convo.full_name?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{convo.full_name}</span>
                        {convo.unread_count > 0 && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {convo.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {convo.last_message}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedUserProfile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {selectedUserProfile?.full_name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{selectedUserProfile?.full_name || 'Anonymous'}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn("flex", isMine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] px-4 py-2 rounded-2xl",
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-secondary text-secondary-foreground rounded-bl-md"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
