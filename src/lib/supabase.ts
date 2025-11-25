import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for your database
export interface Profile {
  auth_user_id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  city?: string;
  bio?: string;
  interests?: string;
  photo_url?: string;
  profile_completed?: boolean;
  personality_answers?: any;
  personality_completed?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  date: string;
  time: string;
  price: number;
  total_spots: number;
  spots_left: number;
  category: string;
  status: string;
  girls_only?: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  image_url?: string;
  participants?: string[];
  created_by?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  event_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_id?: string;
  amount: number;
  reminder_sent: boolean;
  confirmation_sent: boolean;
  created_at: string;
}