// ============================================
// FILE: api/profiles.ts
// ============================================
import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage (replace with real database later)
const profiles: Record<string, any> = {};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId } = req.query;

  try {
    if (req.method === 'POST') {
      // Create new profile
      const profile = req.body;
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      profiles[newUserId] = {
        ...profile,
        id: newUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return res.status(200).json({ success: true, userId: newUserId });
    }

    if (req.method === 'GET' && userId) {
      // Get profile
      const profile = profiles[userId as string];
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Profile not found' });
      }
      return res.status(200).json({ success: true, profile });
    }

    if (req.method === 'PUT' && userId) {
      // Update profile
      const updates = req.body;
      const existingProfile = profiles[userId as string];
      
      if (!existingProfile) {
        return res.status(404).json({ success: false, error: 'Profile not found' });
      }
      
      profiles[userId as string] = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return res.status(200).json({ success: true, profile: profiles[userId as string] });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}