// ============================================
// FILE: api/events.ts
// ============================================
const events: Record<string, any> = {
  'bowling-friday': {
    id: 'bowling-friday',
    title: 'Bowling Night',
    date: 'Friday',
    time: '7:00 PM',
    location: 'Shott Mumbai',
    distance: '2.1 km away',
    spotsLeft: 2,
    totalSpots: 4,
    participants: ['Alex', 'Sarah'],
    price: 100,
    category: 'activities',
    description: 'Fun bowling session to meet new people!',
    createdAt: new Date().toISOString()
  },
  'dinner-saturday': {
    id: 'dinner-saturday',
    title: 'Dinner & Conversations',
    date: 'Saturday',
    time: '7:30 PM',
    location: 'Local Restaurant, Bandra',
    distance: '1.8 km away',
    spotsLeft: 4,
    totalSpots: 6,
    participants: ['Priya', 'Rohan'],
    price: 100,
    category: 'food',
    description: 'Intimate dinner setting.',
    createdAt: new Date().toISOString()
  },
  'pickleball-sunday': {
    id: 'pickleball-sunday',
    title: 'Pickleball Session',
    date: 'Sunday',
    time: '10:00 AM',
    location: 'Mumbai Sports Club',
    distance: '3.2 km away',
    spotsLeft: 4,
    totalSpots: 4,
    participants: [],
    price: 100,
    category: 'sports',
    description: 'Energetic pickleball session!',
    createdAt: new Date().toISOString()
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { eventId } = req.query;

  try {
    if (req.method === 'GET' && !eventId) {
      // Get all events
      const allEvents = Object.values(events);
      return res.status(200).json({ success: true, events: allEvents });
    }

    if (req.method === 'GET' && eventId) {
      // Get specific event
      const event = events[eventId as string];
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      return res.status(200).json({ success: true, event });
    }

    if (req.method === 'POST') {
      // Create new event
      const eventData = req.body;
      const newEventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      events[newEventId] = {
        id: newEventId,
        ...eventData,
        participants: eventData.participants || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return res.status(200).json({ success: true, event: events[newEventId] });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}