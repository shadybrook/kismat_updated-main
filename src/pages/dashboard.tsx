import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase, Event } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recurring' | 'oneTime'>('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!profile?.profile_completed) {
        router.push('/profile');
      } else if (!profile?.personality_completed) {
        router.push('/personality');
      } else {
        fetchEvents();
      }
    }
  }, [user, profile, authLoading]);

  async function fetchEvents() {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true });

      if (filter === 'recurring') {
        query = query.eq('is_recurring', true);
      } else if (filter === 'oneTime') {
        query = query.eq('is_recurring', false);
      }

      // Filter by gender if applicable
      if (profile?.gender) {
        query = query.or(`girls_only.is.null,girls_only.eq.${profile.gender === 'female'}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile) {
      fetchEvents();
    }
  }, [filter, profile]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {profile?.full_name || 'there'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">Discover events in {profile?.city || 'your city'}</p>
            </div>
            <Link
              href="/profile"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('recurring')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === 'recurring'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Weekly Events
          </button>
          <button
            onClick={() => setFilter('oneTime')}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === 'oneTime'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Special Events
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={event.image_url || '/images/placeholder.jpg'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.is_recurring && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Weekly
                    </span>
                  )}
                  {event.girls_only && (
                    <span className="absolute top-3 left-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Girls Only
                    </span>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📅</span>
                      {event.date} at {event.time}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">👥</span>
                      {event.spots_left}/{event.total_spots} spots left
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      ₹{event.price}
                    </span>
                    <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Business Inquiry Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">Business Inquiries:</p>
          
            href="mailto:findyourkismat@gmail.com"
            className="text-indigo-400 hover:text-indigo-300 font-semibold text-lg"
          >
            findyourkismat@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}