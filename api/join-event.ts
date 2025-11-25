// ============================================
// FILE: api/join-event.ts
// ============================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { eventId, userId, userName } = req.body;
    
    const event = events[eventId];
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.participants.includes(userName)) {
      return res.status(400).json({ success: false, error: 'Already joined' });
    }

    if (event.participants.length >= event.totalSpots) {
      return res.status(400).json({ success: false, error: 'Event is full' });
    }

    event.participants.push(userName);
    event.spotsLeft = event.totalSpots - event.participants.length;
    event.updatedAt = new Date().toISOString();

    return res.status(200).json({ success: true, event });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}