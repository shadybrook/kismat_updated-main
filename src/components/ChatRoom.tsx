import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Users, MapPin, Clock, AlertCircle } from 'lucide-react';
import { UserProfile } from '../App';
import { db } from '../utils/supabase';

interface ChatRoomProps {
  eventId: string | null;
  profile: UserProfile;
  userId: string | null;
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  user_name: string;
  user_id: string;
  message: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  total_spots: number;
  status?: string;
  created_by?: string;
  event_filled?: boolean;
}

export function ChatRoom({ eventId, profile, userId, onNavigate }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🔐 ChatRoom loaded with:', {
      eventId,
      userId,
      profileName: profile.name,
      hasUserId: !!userId
    });
    
    if (!eventId) return;
    
    loadEventDetails();
    loadMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadEventDetails = async () => {
    if (!eventId) return;
    
    try {
      const result = await db.getEventById(eventId);
      if (result.event) {
        console.log('📋 Event loaded:', {
          title: result.event.title,
          status: result.event.status,
          event_filled: result.event.event_filled,
          created_by: result.event.created_by
        });
        setEvent(result.event);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    }
  };

  const loadMessages = async () => {
    if (!eventId) return;
    
    try {
      const result = await db.getChatMessages(eventId);
      if (result.messages) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageText = newMessage.trim();
    
    console.log('📨 Attempting to send message:', {
      messageText: messageText ? 'exists' : 'empty',
      eventId,
      userId,
      userName: profile.name
    });
    
    if (!messageText || !eventId || !userId) {
      console.error('❌ Missing required data:', { 
        hasMessageText: !!messageText, 
        hasEventId: !!eventId, 
        hasUserId: !!userId,
        userId: userId 
      });
      if (!userId) {
        alert('You must be logged in to send messages');
      }
      return;
    }

    setIsSending(true);
    try {
      console.log('Sending message:', { eventId, userId, userName: profile.name, message: messageText });
      
      const result = await db.sendChatMessage(eventId, userId, profile.name, messageText);
      
      if (result.success) {
        setNewMessage('');
        // Immediately load messages to show the new one
        await loadMessages();
      } else {
        console.error('Failed to send message:', result.error);
        alert(`Failed to send message: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!eventId || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isLoading ? 'Loading chat...' : 'Event not found'}
          </p>
          <Button 
            onClick={() => onNavigate('events')} 
            className="bg-black text-white hover:bg-gray-800"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  // CHECK IF EVENT IS PENDING APPROVAL
  const isPending = event.status === 'pending';
  
  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-black text-white px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => onNavigate('events')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Waiting for Approval Message */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Waiting for Approval
            </h2>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Your event is currently under review by our admin team. The chat will open once your event is approved.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                💡 <strong>What happens next?</strong><br/>
                Once approved, all participants will be able to chat and coordinate the event details.
              </p>
            </div>
            <Button
              onClick={() => onNavigate('dashboard')}
              className="bg-black text-white hover:bg-gray-800"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => onNavigate('events')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {event.title}
            </h1>
            <div className="flex items-center space-x-1 text-xs text-gray-300">
              <Users className="w-3 h-3" />
              <span>{event.participants.length} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Info Card */}
      <div className="px-4 pt-4 pb-2">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{event.time} on {event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{event.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {event.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {participant}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No messages yet
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Be the first to say hi! 👋
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.user_id === userId;
            
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                    isOwnMessage
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1 text-blue-600">
                      {msg.user_name}
                    </p>
                  )}
                  <p className="text-sm break-words" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {msg.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border-gray-300 rounded-full px-4"
            disabled={isSending}
            maxLength={500}
            style={{ fontFamily: 'Poppins, sans-serif' }}
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="bg-black text-white hover:bg-gray-800 rounded-full w-12 h-12 p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Messages are visible to all event participants
        </p>
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <Button
          onClick={() => onNavigate('dashboard')}
          variant="outline"
          className="w-full"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}