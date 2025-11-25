

// // =============================================
// // FILE: src/utils/supabase.ts
// // Supabase client configuration
// // =============================================

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // =============================================
// // Authentication helpers
// // =============================================

// export const auth = {
//   async signUp(email: string, password: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user,
//       needsEmailConfirmation: data.user && !data.user.confirmed_at
//     }
//   },

//   async signIn(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user
//     }
//   },

//   async signInWithEmail(email: string) {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
//     return { success: !error, error: error?.message }
//   },

//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/reset-password`,
//     })
//     return { success: !error, error: error?.message }
//   },

//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     return { success: !error, error: error?.message }
//   },

//   async getCurrentUser() {
//     const { data: { user }, error } = await supabase.auth.getUser()
//     return { user, error: error?.message }
//   },

//   onAuthStateChange(callback: (user: any) => void) {
//     return supabase.auth.onAuthStateChange((_event, session) => {
//       callback(session?.user || null)
//     })
//   },

//   async isAdmin() {
//     const { user } = await this.getCurrentUser()
//     if (!user) return false

//     const { data } = await supabase
//       .from('admin_users')
//       .select('id')
//       .eq('auth_user_id', user.id)
//       .single()

//     return !!data
//   }
// }

// // =============================================
// // Database helpers
// // =============================================

// export const db = {
//   async getProfile(userId: string) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async createProfile(profile: any) {
//     const { user } = await auth.getCurrentUser()
    
//     if (!user) {
//       return { profile: null, error: 'No authenticated user' }
//     }

//     // Check if profile exists by auth_user_id
//     const { data: existingByAuth } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('auth_user_id', user.id)
//       .maybeSingle()

//     if (existingByAuth) {
//       // Update existing profile
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByAuth.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     // Check if email already exists
//     const { data: existingByEmail } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', user.email)
//       .maybeSingle()

//     if (existingByEmail) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           auth_user_id: user.id,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByEmail.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     // Create new profile
//     const { data, error } = await supabase
//       .from('profiles')
//       .insert({
//         name: profile.name,
//         age: profile.age,
//         gender: profile.gender,
//         pronouns: profile.pronouns,
//         work_study: profile.workStudy,
//         apartment: profile.location?.apartment,
//         locality: profile.location?.locality,
//         suburb: profile.location?.suburb,
//         city: profile.location?.city,
//         personality_answers: profile.personalityAnswers || {},
//         joined_events: profile.joinedEvents || [],
//         auth_user_id: user.id,
//         email: user.email
//       })
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async updateProfile(userId: string, updates: any) {
//     const dbUpdates: any = {}
    
//     if (updates.name) dbUpdates.name = updates.name
//     if (updates.age) dbUpdates.age = updates.age
//     if (updates.gender) dbUpdates.gender = updates.gender
//     if (updates.pronouns) dbUpdates.pronouns = updates.pronouns
//     if (updates.workStudy) dbUpdates.work_study = updates.workStudy
//     if (updates.personalityAnswers) dbUpdates.personality_answers = updates.personalityAnswers
//     if (updates.joinedEvents) dbUpdates.joined_events = updates.joinedEvents
//     if (updates.location) {
//       dbUpdates.apartment = updates.location.apartment
//       dbUpdates.locality = updates.location.locality
//       dbUpdates.suburb = updates.location.suburb
//       dbUpdates.city = updates.location.city
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(dbUpdates)
//       .eq('id', userId)
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async getEvents(includePending = false, userGender?: string) {
//     console.log('🔍 getEvents called with:', { includePending, userGender }); // Debug log
    
//     let query = supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })
    
//     if (!includePending) {
//       query = query.eq('status', 'approved')
//     }
    
//     const { data, error } = await query
    
//     if (error) {
//       console.error('❌ Error fetching events:', error);
//       return { events: [], error: error.message }
//     }
    
//     console.log('📦 Raw events from database:', data?.length);
    
//     // Filter out girls-only events for male users
//     let filteredEvents = data || []
    
//     if (userGender) {
//       const genderLower = userGender.toLowerCase().trim()
//       console.log('👤 User gender (normalized):', genderLower);
      
//       // Check if user is male - FIXED: Check male FIRST before contains check
//       const isMale = genderLower === 'male' || 
//                      genderLower === 'man' ||
//                      genderLower === 'm' ||
//                      (genderLower.includes('male') && !genderLower.includes('female'))
      
//       console.log('🚹 Is male user?', isMale);
      
//       if (isMale) {
//         // Filter out girls-only events
//         const beforeFilter = filteredEvents.length;
//         filteredEvents = filteredEvents.filter(event => {
//           const isGirlsOnly = event.girls_only === true;
//           console.log(`Event "${event.title}": girls_only=${isGirlsOnly}`);
//           return !isGirlsOnly;
//         });
//         const afterFilter = filteredEvents.length;
//         console.log(`✂️ Filtered ${beforeFilter - afterFilter} girls-only events`);
//       }
//     } else {
//       console.warn('⚠️ No userGender provided to getEvents - showing all events');
//     }
    
//     console.log('✅ Returning filtered events:', filteredEvents.length);
//     return { events: filteredEvents, error: null }
//   },

//   async canUserSeeEvent(eventId: string, userGender?: string) {
//     const { data: event, error } = await supabase
//       .from('events')
//       .select('girls_only')
//       .eq('id', eventId)
//       .single()
    
//     if (error || !event) {
//       return false
//     }
    
//     // If it's not a girls-only event, everyone can see it
//     if (!event.girls_only) {
//       return true
//     }
    
//     // If it's girls-only, only females can see it
//     if (!userGender) {
//       return false
//     }
    
//     const genderLower = userGender.toLowerCase().trim()
//     const isFemale = genderLower === 'female' || 
//                      genderLower === 'woman' ||
//                      genderLower === 'f' ||
//                      (genderLower.includes('female') || genderLower.includes('woman'))
    
//     return isFemale
//   },

//   async getEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('id', eventId)
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async getEventById(eventId: string) {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('id', eventId)
//         .single()
      
//       return { event: data, error: error?.message }
//     } catch (error) {
//       return { event: null, error: 'Failed to fetch event' }
//     }
//   },

//   async createEvent(eventData: any) {
//     try {
//       const { user } = await auth.getCurrentUser()
      
//       const insertData: any = {
//         title: eventData.title,
//         date: eventData.date,
//         time: eventData.time,
//         location: eventData.location,
//         distance: eventData.distance || 'Custom location',
//         spots_left: eventData.spotsLeft || eventData.totalSpots,
//         total_spots: eventData.totalSpots,
//         participants: eventData.participants || [],
//         price: eventData.price,
//         category: eventData.category,
//         description: eventData.description,
//         status: 'pending',
//         girls_only: eventData.girlsOnly || false,
//         creator_group_size: eventData.creatorGroupSize || 1,
//         creator_payment_amount: eventData.creatorPaymentAmount || 100,
//         min_participants: eventData.minParticipants || 2,
//         max_participants: eventData.maxParticipants,
//         creator_paid: eventData.creatorPaid || false,
//         event_filled: eventData.eventFilled || false
//       }
      
//       // Only add created_by if user exists
//       if (user?.id) {
//         insertData.created_by = user.id
//       }
      
//       const { data, error } = await supabase
//         .from('events')
//         .insert(insertData)
//         .select()
//         .single()
      
//       if (error) {
//         console.error('Supabase createEvent error:', error)
//         return { success: false, event: null, error: error.message }
//       }
      
//       return { success: true, event: data, error: null }
//     } catch (err: any) {
//       console.error('Unexpected error in createEvent:', err)
//       return { success: false, event: null, error: err.message }
//     }
//   },

//   async markEventAsPaid(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ creator_paid: true })
//         .eq('id', eventId)
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to mark event as paid' }
//     }
//   },

//   async approveEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'approved' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async rejectEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'rejected' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async joinEvent(eventId: string, userId: string, userName: string) {
//     const { event } = await this.getEvent(eventId)
//     if (!event || event.spots_left <= 0) {
//       return { success: false, error: 'Event is full' }
//     }

//     const { error: participantError } = await supabase
//       .from('event_participants')
//       .insert({
//         event_id: eventId,
//         user_id: userId,
//         user_name: userName
//       })

//     if (participantError) {
//       return { success: false, error: participantError.message }
//     }

//     const newParticipants = [...(event.participants || []), userName]
//     const newSpotsLeft = event.spots_left - 1
    
//     // Check if minimum participants reached (chat opens)
//     const chatOpens = newParticipants.length >= (event.min_participants || 2)

//     const { error: updateError } = await supabase
//       .from('events')
//       .update({ 
//         spots_left: newSpotsLeft,
//         participants: newParticipants,
//         event_filled: chatOpens // Event is "filled" when min participants reached
//       })
//       .eq('id', eventId)

//     return { 
//       success: !updateError, 
//       error: updateError?.message,
//       chatOpens: chatOpens 
//     }
//   },

//   async getUserEvents(userId: string) {
//     const { data, error } = await supabase
//       .from('event_participants')
//       .select(`
//         *,
//         events (*)
//       `)
//       .eq('user_id', userId)

//     return { events: data?.map(p => p.events) || [], error: error?.message }
//   },

//   async getAllProfiles() {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { profiles: data || [], error: error?.message }
//   },

//   async getPendingEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('status', 'pending')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getAllEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   // =============================================
//   // Chat Functions
//   // =============================================

//   async getChatMessages(eventId: string) {
//     try {
//       const sevenDaysAgo = new Date()
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('event_id', eventId)
//         .gte('created_at', sevenDaysAgo.toISOString())
//         .order('created_at', { ascending: true })
//         .limit(100)
      
//       return { messages: data || [], error: error?.message }
//     } catch (error) {
//       return { messages: [], error: 'Failed to fetch messages' }
//     }
//   },

//   async sendChatMessage(eventId: string, userId: string, userName: string, message: string) {
//     try {
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert({
//           event_id: eventId,
//           user_id: userId,
//           user_name: userName,
//           message: message
//         })
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to send message' }
//     }
//   }
// }





















// // =============================================
// // FILE: src/utils/supabase.ts
// // Supabase client configuration
// // =============================================

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // =============================================
// // Authentication helpers
// // =============================================

// export const auth = {
//   async signUp(email: string, password: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
    
//     console.log('🔐 SignUp Response:', {
//       user: data.user?.email,
//       session: data.session ? 'EXISTS' : 'NULL',
//       confirmed_at: data.user?.confirmed_at,
//       email_confirmed_at: data.user?.email_confirmed_at
//     });
    
//     // If session exists, user is auto-confirmed (email confirmation is disabled)
//     const isAutoConfirmed = data.session !== null;
    
//     // If user exists but no session, email confirmation is required
//     const needsEmailConfirmation = data.user !== null && data.session === null;
    
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user,
//       session: data.session,
//       needsEmailConfirmation: needsEmailConfirmation,
//       autoConfirmed: isAutoConfirmed
//     }
//   },

//   async signIn(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user
//     }
//   },

//   async signInWithEmail(email: string) {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
//     return { success: !error, error: error?.message }
//   },

//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/#reset-password`,
//     })
//     return { success: !error, error: error?.message }
//   },

//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     return { success: !error, error: error?.message }
//   },

//   async getCurrentUser() {
//     const { data: { user }, error } = await supabase.auth.getUser()
//     return { user, error: error?.message }
//   },

//   onAuthStateChange(callback: (user: any) => void) {
//     return supabase.auth.onAuthStateChange((_event, session) => {
//       callback(session?.user || null)
//     })
//   },

//   async isAdmin() {
//     const { user } = await this.getCurrentUser()
//     if (!user) return false

//     const { data } = await supabase
//       .from('admin_users')
//       .select('id')
//       .eq('auth_user_id', user.id)
//       .single()

//     return !!data
//   }
// }

// // =============================================
// // Database helpers
// // =============================================

// export const db = {
//   async getProfile(userId: string) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async createProfile(profile: any) {
//     const { user } = await auth.getCurrentUser()
    
//     if (!user) {
//       return { profile: null, error: 'No authenticated user' }
//     }

//     // Check if profile exists by auth_user_id
//     const { data: existingByAuth } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('auth_user_id', user.id)
//       .maybeSingle()

//     if (existingByAuth) {
//       // Update existing profile
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByAuth.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     // Check if email already exists
//     const { data: existingByEmail } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', user.email)
//       .maybeSingle()

//     if (existingByEmail) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           auth_user_id: user.id,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByEmail.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     // Create new profile
//     const { data, error } = await supabase
//       .from('profiles')
//       .insert({
//         name: profile.name,
//         age: profile.age,
//         gender: profile.gender,
//         pronouns: profile.pronouns,
//         work_study: profile.workStudy,
//         apartment: profile.location?.apartment,
//         locality: profile.location?.locality,
//         suburb: profile.location?.suburb,
//         city: profile.location?.city,
//         personality_answers: profile.personalityAnswers || {},
//         joined_events: profile.joinedEvents || [],
//         auth_user_id: user.id,
//         email: user.email
//       })
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async updateProfile(userId: string, updates: any) {
//     const dbUpdates: any = {}
    
//     if (updates.name) dbUpdates.name = updates.name
//     if (updates.age) dbUpdates.age = updates.age
//     if (updates.gender) dbUpdates.gender = updates.gender
//     if (updates.pronouns) dbUpdates.pronouns = updates.pronouns
//     if (updates.workStudy) dbUpdates.work_study = updates.workStudy
//     if (updates.personalityAnswers) dbUpdates.personality_answers = updates.personalityAnswers
//     if (updates.joinedEvents) dbUpdates.joined_events = updates.joinedEvents
//     if (updates.location) {
//       dbUpdates.apartment = updates.location.apartment
//       dbUpdates.locality = updates.location.locality
//       dbUpdates.suburb = updates.location.suburb
//       dbUpdates.city = updates.location.city
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(dbUpdates)
//       .eq('id', userId)
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async getEvents(includePending = false, userGender?: string) {
//     console.log('🔍 getEvents called with:', { includePending, userGender }); // Debug log
    
//     let query = supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })
    
//     if (!includePending) {
//       query = query.eq('status', 'approved')
//     }
    
//     const { data, error } = await query
    
//     if (error) {
//       console.error('❌ Error fetching events:', error);
//       return { events: [], error: error.message }
//     }
    
//     console.log('📦 Raw events from database:', data?.length);
    
//     // Filter out girls-only events for male users
//     let filteredEvents = data || []
    
//     if (userGender) {
//       const genderLower = userGender.toLowerCase().trim()
//       console.log('👤 User gender (normalized):', genderLower);
      
//       // Check if user is male - FIXED: Check male FIRST before contains check
//       const isMale = genderLower === 'male' || 
//                      genderLower === 'man' ||
//                      genderLower === 'm' ||
//                      (genderLower.includes('male') && !genderLower.includes('female'))
      
//       console.log('🚹 Is male user?', isMale);
      
//       if (isMale) {
//         // Filter out girls-only events
//         const beforeFilter = filteredEvents.length;
//         filteredEvents = filteredEvents.filter(event => {
//           const isGirlsOnly = event.girls_only === true;
//           console.log(`Event "${event.title}": girls_only=${isGirlsOnly}`);
//           return !isGirlsOnly;
//         });
//         const afterFilter = filteredEvents.length;
//         console.log(`✂️ Filtered ${beforeFilter - afterFilter} girls-only events`);
//       }
//     } else {
//       console.warn('⚠️ No userGender provided to getEvents - showing all events');
//     }
    
//     console.log('✅ Returning filtered events:', filteredEvents.length);
//     return { events: filteredEvents, error: null }
//   },

//   async canUserSeeEvent(eventId: string, userGender?: string) {
//     const { data: event, error } = await supabase
//       .from('events')
//       .select('girls_only')
//       .eq('id', eventId)
//       .single()
    
//     if (error || !event) {
//       return false
//     }
    
//     // If it's not a girls-only event, everyone can see it
//     if (!event.girls_only) {
//       return true
//     }
    
//     // If it's girls-only, only females can see it
//     if (!userGender) {
//       return false
//     }
    
//     const genderLower = userGender.toLowerCase().trim()
//     const isFemale = genderLower === 'female' || 
//                      genderLower === 'woman' ||
//                      genderLower === 'f' ||
//                      (genderLower.includes('female') || genderLower.includes('woman'))
    
//     return isFemale
//   },

//   async getEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('id', eventId)
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async getEventById(eventId: string) {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('id', eventId)
//         .single()
      
//       return { event: data, error: error?.message }
//     } catch (error) {
//       return { event: null, error: 'Failed to fetch event' }
//     }
//   },

//   async createEvent(eventData: any) {
//     try {
//       const { user } = await auth.getCurrentUser()
      
//       const insertData: any = {
//         title: eventData.title,
//         date: eventData.date,
//         time: eventData.time,
//         location: eventData.location,
//         distance: eventData.distance || 'Custom location',
//         spots_left: eventData.spotsLeft || eventData.totalSpots,
//         total_spots: eventData.totalSpots,
//         participants: eventData.participants || [],
//         price: eventData.price,
//         category: eventData.category,
//         description: eventData.description,
//         status: 'pending',
//         girls_only: eventData.girlsOnly || false,
//         creator_group_size: eventData.creatorGroupSize || 1,
//         creator_payment_amount: eventData.creatorPaymentAmount || 100,
//         min_participants: eventData.minParticipants || 2,
//         max_participants: eventData.maxParticipants,
//         creator_paid: eventData.creatorPaid || false,
//         event_filled: eventData.eventFilled || false
//       }
      
//       // Only add created_by if user exists
//       if (user?.id) {
//         insertData.created_by = user.id
//       }
      
//       const { data, error } = await supabase
//         .from('events')
//         .insert(insertData)
//         .select()
//         .single()
      
//       if (error) {
//         console.error('Supabase createEvent error:', error)
//         return { success: false, event: null, error: error.message }
//       }
      
//       return { success: true, event: data, error: null }
//     } catch (err: any) {
//       console.error('Unexpected error in createEvent:', err)
//       return { success: false, event: null, error: err.message }
//     }
//   },

//   async markEventAsPaid(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ creator_paid: true })
//         .eq('id', eventId)
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to mark event as paid' }
//     }
//   },

//   async approveEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'approved' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async rejectEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'rejected' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async joinEvent(eventId: string, userId: string, userName: string) {
//     const { event } = await this.getEvent(eventId)
//     if (!event || event.spots_left <= 0) {
//       return { success: false, error: 'Event is full' }
//     }

//     const { error: participantError } = await supabase
//       .from('event_participants')
//       .insert({
//         event_id: eventId,
//         user_id: userId,
//         user_name: userName
//       })

//     if (participantError) {
//       return { success: false, error: participantError.message }
//     }

//     const newParticipants = [...(event.participants || []), userName]
//     const newSpotsLeft = event.spots_left - 1
    
//     // Check if minimum participants reached (chat opens)
//     const chatOpens = newParticipants.length >= (event.min_participants || 2)

//     const { error: updateError } = await supabase
//       .from('events')
//       .update({ 
//         spots_left: newSpotsLeft,
//         participants: newParticipants,
//         event_filled: chatOpens // Event is "filled" when min participants reached
//       })
//       .eq('id', eventId)

//     return { 
//       success: !updateError, 
//       error: updateError?.message,
//       chatOpens: chatOpens 
//     }
//   },

//   async getUserEvents(userId: string) {
//     const { data, error } = await supabase
//       .from('event_participants')
//       .select(`
//         *,
//         events (*)
//       `)
//       .eq('user_id', userId)

//     return { events: data?.map(p => p.events) || [], error: error?.message }
//   },

//   async getAllProfiles() {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { profiles: data || [], error: error?.message }
//   },

//   async getPendingEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('status', 'pending')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getAllEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   // =============================================
//   // Chat Functions
//   // =============================================

//   async getChatMessages(eventId: string) {
//     try {
//       const sevenDaysAgo = new Date()
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('event_id', eventId)
//         .gte('created_at', sevenDaysAgo.toISOString())
//         .order('created_at', { ascending: true })
//         .limit(100)
      
//       return { messages: data || [], error: error?.message }
//     } catch (error) {
//       return { messages: [], error: 'Failed to fetch messages' }
//     }
//   },

//   async sendChatMessage(eventId: string, userId: string, userName: string, message: string) {
//     try {
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert({
//           event_id: eventId,
//           user_id: userId,
//           user_name: userName,
//           message: message
//         })
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to send message' }
//     }
//   }
// }



















































// // =============================================
// // FILE: src/utils/supabase.ts
// // Supabase client configuration
// // =============================================

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // =============================================
// // Authentication helpers
// // =============================================

// export const auth = {
//   async signUp(email: string, password: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
    
//     console.log('🔐 SignUp Response:', {
//       user: data.user?.email,
//       session: data.session ? 'EXISTS' : 'NULL',
//       confirmed_at: data.user?.confirmed_at,
//       email_confirmed_at: data.user?.email_confirmed_at
//     });
    
//     const isAutoConfirmed = data.session !== null;
//     const needsEmailConfirmation = data.user !== null && data.session === null;
    
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user,
//       session: data.session,
//       needsEmailConfirmation: needsEmailConfirmation,
//       autoConfirmed: isAutoConfirmed
//     }
//   },

//   async signIn(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user
//     }
//   },

//   async signInWithEmail(email: string) {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
//     return { success: !error, error: error?.message }
//   },

//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/#reset-password`,
//     })
//     return { success: !error, error: error?.message }
//   },

//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     return { success: !error, error: error?.message }
//   },

//   async getCurrentUser() {
//     const { data: { user }, error } = await supabase.auth.getUser()
//     return { user, error: error?.message }
//   },

//   onAuthStateChange(callback: (user: any) => void) {
//     return supabase.auth.onAuthStateChange((_event, session) => {
//       callback(session?.user || null)
//     })
//   },

//   async isAdmin() {
//     const { user } = await this.getCurrentUser()
//     if (!user) return false

//     const { data } = await supabase
//       .from('admin_users')
//       .select('id')
//       .eq('auth_user_id', user.id)
//       .single()

//     return !!data
//   }
// }

// // =============================================
// // Database helpers
// // =============================================

// export const db = {
//   async getProfile(userId: string) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async createProfile(profile: any) {
//     const { user } = await auth.getCurrentUser()
    
//     if (!user) {
//       return { profile: null, error: 'No authenticated user' }
//     }

//     const { data: existingByAuth } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('auth_user_id', user.id)
//       .maybeSingle()

//     if (existingByAuth) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByAuth.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     const { data: existingByEmail } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', user.email)
//       .maybeSingle()

//     if (existingByEmail) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           auth_user_id: user.id,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByEmail.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .insert({
//         name: profile.name,
//         age: profile.age,
//         gender: profile.gender,
//         pronouns: profile.pronouns,
//         work_study: profile.workStudy,
//         apartment: profile.location?.apartment,
//         locality: profile.location?.locality,
//         suburb: profile.location?.suburb,
//         city: profile.location?.city,
//         personality_answers: profile.personalityAnswers || {},
//         joined_events: profile.joinedEvents || [],
//         auth_user_id: user.id,
//         email: user.email
//       })
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async updateProfile(userId: string, updates: any) {
//     const dbUpdates: any = {}
    
//     if (updates.name) dbUpdates.name = updates.name
//     if (updates.age) dbUpdates.age = updates.age
//     if (updates.gender) dbUpdates.gender = updates.gender
//     if (updates.pronouns) dbUpdates.pronouns = updates.pronouns
//     if (updates.workStudy) dbUpdates.work_study = updates.workStudy
//     if (updates.personalityAnswers) dbUpdates.personality_answers = updates.personalityAnswers
//     if (updates.joinedEvents) dbUpdates.joined_events = updates.joinedEvents
//     if (updates.location) {
//       dbUpdates.apartment = updates.location.apartment
//       dbUpdates.locality = updates.location.locality
//       dbUpdates.suburb = updates.location.suburb
//       dbUpdates.city = updates.location.city
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(dbUpdates)
//       .eq('id', userId)
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async getEvents(includePending = false, userGender?: string) {
//     console.log('🔍 getEvents called with:', { includePending, userGender });
    
//     let query = supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })
    
//     if (!includePending) {
//       query = query.eq('status', 'approved')
//     }
    
//     const { data, error } = await query
    
//     if (error) {
//       console.error('❌ Error fetching events:', error);
//       return { events: [], error: error.message }
//     }
    
//     console.log('📦 Raw events from database:', data?.length);
    
//     let filteredEvents = data || []
    
//     if (userGender) {
//       const genderLower = userGender.toLowerCase().trim()
//       console.log('👤 User gender (normalized):', genderLower);
      
//       const isMale = genderLower === 'male' || 
//                      genderLower === 'man' ||
//                      genderLower === 'm' ||
//                      (genderLower.includes('male') && !genderLower.includes('female'))
      
//       console.log('🚹 Is male user?', isMale);
      
//       if (isMale) {
//         const beforeFilter = filteredEvents.length;
//         filteredEvents = filteredEvents.filter(event => {
//           const isGirlsOnly = event.girls_only === true;
//           console.log(`Event "${event.title}": girls_only=${isGirlsOnly}`);
//           return !isGirlsOnly;
//         });
//         const afterFilter = filteredEvents.length;
//         console.log(`✂️ Filtered ${beforeFilter - afterFilter} girls-only events`);
//       }
//     } else {
//       console.warn('⚠️ No userGender provided to getEvents - showing all events');
//     }
    
//     console.log('✅ Returning filtered events:', filteredEvents.length);
//     return { events: filteredEvents, error: null }
//   },

//   async canUserSeeEvent(eventId: string, userGender?: string) {
//     const { data: event, error } = await supabase
//       .from('events')
//       .select('girls_only')
//       .eq('id', eventId)
//       .single()
    
//     if (error || !event) {
//       return false
//     }
    
//     if (!event.girls_only) {
//       return true
//     }
    
//     if (!userGender) {
//       return false
//     }
    
//     const genderLower = userGender.toLowerCase().trim()
//     const isFemale = genderLower === 'female' || 
//                      genderLower === 'woman' ||
//                      genderLower === 'f' ||
//                      (genderLower.includes('female') || genderLower.includes('woman'))
    
//     return isFemale
//   },

//   async getEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('id', eventId)
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async getEventById(eventId: string) {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('id', eventId)
//         .single()
      
//       return { event: data, error: error?.message }
//     } catch (error) {
//       return { event: null, error: 'Failed to fetch event' }
//     }
//   },

//   async createEvent(eventData: any) {
//     try {
//       const { user } = await auth.getCurrentUser()
      
//       const insertData: any = {
//         title: eventData.title,
//         date: eventData.date,
//         time: eventData.time,
//         location: eventData.location,
//         distance: eventData.distance || 'Custom location',
//         spots_left: eventData.spotsLeft || eventData.totalSpots,
//         total_spots: eventData.totalSpots,
//         participants: eventData.participants || [],
//         price: eventData.price,
//         category: eventData.category,
//         description: eventData.description,
//         status: 'pending',
//         girls_only: eventData.girlsOnly || false,
//         creator_group_size: eventData.creatorGroupSize || 1,
//         creator_payment_amount: eventData.creatorPaymentAmount || 100,
//         min_participants: eventData.minParticipants || 2,
//         max_participants: eventData.maxParticipants,
//         creator_paid: eventData.creatorPaid || false,
//         event_filled: eventData.eventFilled || false
//       }
      
//       if (user?.id) {
//         insertData.created_by = user.id
//       }
      
//       const { data, error } = await supabase
//         .from('events')
//         .insert(insertData)
//         .select()
//         .single()
      
//       if (error) {
//         console.error('Supabase createEvent error:', error)
//         return { success: false, event: null, error: error.message }
//       }
      
//       return { success: true, event: data, error: null }
//     } catch (err: any) {
//       console.error('Unexpected error in createEvent:', err)
//       return { success: false, event: null, error: err.message }
//     }
//   },

//   async markEventAsPaid(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ creator_paid: true })
//         .eq('id', eventId)
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to mark event as paid' }
//     }
//   },

//   async approveEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'approved' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async rejectEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'rejected' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async joinEvent(eventId: string, userId: string, userName: string) {
//     const { event } = await this.getEvent(eventId)
//     if (!event || event.spots_left <= 0) {
//       return { success: false, error: 'Event is full' }
//     }

//     const { error: participantError } = await supabase
//       .from('event_participants')
//       .insert({
//         event_id: eventId,
//         user_id: userId,
//         user_name: userName
//       })

//     if (participantError) {
//       return { success: false, error: participantError.message }
//     }

//     const newParticipants = [...(event.participants || []), userName]
//     const newSpotsLeft = event.spots_left - 1
//     const chatOpens = newParticipants.length >= (event.min_participants || 2)

//     const { error: updateError } = await supabase
//       .from('events')
//       .update({ 
//         spots_left: newSpotsLeft,
//         participants: newParticipants,
//         event_filled: chatOpens
//       })
//       .eq('id', eventId)

//     return { 
//       success: !updateError, 
//       error: updateError?.message,
//       chatOpens: chatOpens 
//     }
//   },

//   async getUserEvents(userId: string) {
//     const { data, error } = await supabase
//       .from('event_participants')
//       .select(`
//         *,
//         events (*)
//       `)
//       .eq('user_id', userId)

//     return { events: data?.map(p => p.events) || [], error: error?.message }
//   },

//   async getAllProfiles() {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { profiles: data || [], error: error?.message }
//   },

//   async getPendingEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('status', 'pending')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getAllEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getChatMessages(eventId: string) {
//     try {
//       const sevenDaysAgo = new Date()
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('event_id', eventId)
//         .gte('created_at', sevenDaysAgo.toISOString())
//         .order('created_at', { ascending: true })
//         .limit(100)
      
//       return { messages: data || [], error: error?.message }
//     } catch (error) {
//       return { messages: [], error: 'Failed to fetch messages' }
//     }
//   },

//   async sendChatMessage(eventId: string, userId: string, userName: string, message: string) {
//     try {
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert({
//           event_id: eventId,
//           user_id: userId,
//           user_name: userName,
//           message: message
//         })
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to send message' }
//     }
//   }
// }

// // =============================================
// // Analytics Functions - ADDED HERE!
// // =============================================

// export const analytics = {
//   async trackVisit(pagePath: string, userId?: string) {
//     try {
//       await supabase.from('page_visits').insert({
//         page_path: pagePath,
//         user_id: userId,
//       });
//       await supabase.rpc('increment_visit');
//     } catch (error) {
//       console.error('Error tracking visit:', error);
//     }
//   },

//   async trackPayment(amount: number) {
//     try {
//       await supabase.rpc('increment_payment', { amount });
//     } catch (error) {
//       console.error('Error tracking payment:', error);
//     }
//   },

//   async getAnalytics() {
//     try {
//       const { data, error } = await supabase
//         .from('analytics')
//         .select('*')
//         .single();
//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       return null;
//     }
//   },
// };




























// // =============================================
// // FILE: src/utils/supabase.ts
// // Supabase client configuration
// // =============================================

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // =============================================
// // Authentication helpers
// // =============================================

// export const auth = {
//   async signUp(email: string, password: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
    
//     console.log('🔐 SignUp Response:', {
//       user: data.user?.email,
//       session: data.session ? 'EXISTS' : 'NULL',
//       confirmed_at: data.user?.confirmed_at,
//       email_confirmed_at: data.user?.email_confirmed_at
//     });
    
//     const isAutoConfirmed = data.session !== null;
//     const needsEmailConfirmation = data.user !== null && data.session === null;
    
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user,
//       session: data.session,
//       needsEmailConfirmation: needsEmailConfirmation,
//       autoConfirmed: isAutoConfirmed
//     }
//   },

//   async signIn(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user
//     }
//   },

//   async signInWithEmail(email: string) {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
//     return { success: !error, error: error?.message }
//   },

//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/#reset-password`,
//     })
//     return { success: !error, error: error?.message }
//   },

//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     return { success: !error, error: error?.message }
//   },

//   async getCurrentUser() {
//     const { data: { user }, error } = await supabase.auth.getUser()
//     return { user, error: error?.message }
//   },

//   onAuthStateChange(callback: (user: any) => void) {
//     return supabase.auth.onAuthStateChange((_event, session) => {
//       callback(session?.user || null)
//     })
//   },

//   async isAdmin() {
//     const { user } = await this.getCurrentUser()
//     if (!user) return false

//     const { data } = await supabase
//       .from('admin_users')
//       .select('id')
//       .eq('auth_user_id', user.id)
//       .single()

//     return !!data
//   }
// }

// // =============================================
// // Profile Helpers - BULLETPROOF VERSION
// // =============================================

// export const profileHelpers = {
//   async getCompleteProfile(authUserId: string) {
//     try {
//       // Try by auth_user_id first
//       let { data: profile, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('auth_user_id', authUserId)
//         .maybeSingle();

//       // If not found, try by matching with auth.users email
//       if (!profile) {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user?.email) {
//           const result = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('email', user.email)
//             .maybeSingle();
//           profile = result.data;
//         }
//       }

//       if (!profile) {
//         return { profile: null, isComplete: false, needsPersonality: false, isFullyComplete: false };
//       }

//       const isComplete = !!(
//         profile.name && 
//         profile.age && 
//         profile.gender && 
//         profile.city
//       );

//       const hasPersonality = !!(
//         profile.personality_answers && 
//         typeof profile.personality_answers === 'object' &&
//         Object.keys(profile.personality_answers).length >= 5
//       );

//       console.log('📊 Profile check:', {
//         email: profile.email,
//         isComplete,
//         hasPersonality,
//         answerCount: profile.personality_answers ? Object.keys(profile.personality_answers).length : 0
//       });

//       return {
//         profile,
//         isComplete,
//         needsPersonality: isComplete && !hasPersonality,
//         isFullyComplete: isComplete && hasPersonality
//       };
//     } catch (error) {
//       console.error('Error getting profile:', error);
//       return { profile: null, isComplete: false, needsPersonality: false, isFullyComplete: false };
//     }
//   }
// };

// // =============================================
// // Database helpers
// // =============================================

// export const db = {
//   async getProfile(userId: string) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async createProfile(profile: any) {
//     const { user } = await auth.getCurrentUser()
    
//     if (!user) {
//       return { profile: null, error: 'No authenticated user' }
//     }

//     const { data: existingByAuth } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('auth_user_id', user.id)
//       .maybeSingle()

//     if (existingByAuth) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByAuth.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     const { data: existingByEmail } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', user.email)
//       .maybeSingle()

//     if (existingByEmail) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           auth_user_id: user.id,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByEmail.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .insert({
//         name: profile.name,
//         age: profile.age,
//         gender: profile.gender,
//         pronouns: profile.pronouns,
//         work_study: profile.workStudy,
//         apartment: profile.location?.apartment,
//         locality: profile.location?.locality,
//         suburb: profile.location?.suburb,
//         city: profile.location?.city,
//         personality_answers: profile.personalityAnswers || {},
//         joined_events: profile.joinedEvents || [],
//         auth_user_id: user.id,
//         email: user.email
//       })
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async updateProfile(userId: string, updates: any) {
//     const dbUpdates: any = {}
    
//     if (updates.name) dbUpdates.name = updates.name
//     if (updates.age) dbUpdates.age = updates.age
//     if (updates.gender) dbUpdates.gender = updates.gender
//     if (updates.pronouns) dbUpdates.pronouns = updates.pronouns
//     if (updates.workStudy) dbUpdates.work_study = updates.workStudy
//     if (updates.personalityAnswers) dbUpdates.personality_answers = updates.personalityAnswers
//     if (updates.joinedEvents) dbUpdates.joined_events = updates.joinedEvents
//     if (updates.location) {
//       dbUpdates.apartment = updates.location.apartment
//       dbUpdates.locality = updates.location.locality
//       dbUpdates.suburb = updates.location.suburb
//       dbUpdates.city = updates.location.city
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(dbUpdates)
//       .eq('id', userId)
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async getEvents(includePending = false, userGender?: string) {
//     console.log('🔍 getEvents called with:', { includePending, userGender });
    
//     let query = supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })
    
//     if (!includePending) {
//       query = query.eq('status', 'approved')
//     }
    
//     const { data, error } = await query
    
//     if (error) {
//       console.error('❌ Error fetching events:', error);
//       return { events: [], error: error.message }
//     }
    
//     console.log('📦 Raw events from database:', data?.length);
    
//     let filteredEvents = data || []
    
//     if (userGender) {
//       const genderLower = userGender.toLowerCase().trim()
//       console.log('👤 User gender (normalized):', genderLower);
      
//       const isMale = genderLower === 'male' || 
//                      genderLower === 'man' ||
//                      genderLower === 'm' ||
//                      (genderLower.includes('male') && !genderLower.includes('female'))
      
//       console.log('🚹 Is male user?', isMale);
      
//       if (isMale) {
//         const beforeFilter = filteredEvents.length;
//         filteredEvents = filteredEvents.filter(event => {
//           const isGirlsOnly = event.girls_only === true;
//           console.log(`Event "${event.title}": girls_only=${isGirlsOnly}`);
//           return !isGirlsOnly;
//         });
//         const afterFilter = filteredEvents.length;
//         console.log(`✂️ Filtered ${beforeFilter - afterFilter} girls-only events`);
//       }
//     } else {
//       console.warn('⚠️ No userGender provided to getEvents - showing all events');
//     }
    
//     console.log('✅ Returning filtered events:', filteredEvents.length);
//     return { events: filteredEvents, error: null }
//   },

//   async canUserSeeEvent(eventId: string, userGender?: string) {
//     const { data: event, error } = await supabase
//       .from('events')
//       .select('girls_only')
//       .eq('id', eventId)
//       .single()
    
//     if (error || !event) {
//       return false
//     }
    
//     if (!event.girls_only) {
//       return true
//     }
    
//     if (!userGender) {
//       return false
//     }
    
//     const genderLower = userGender.toLowerCase().trim()
//     const isFemale = genderLower === 'female' || 
//                      genderLower === 'woman' ||
//                      genderLower === 'f' ||
//                      (genderLower.includes('female') || genderLower.includes('woman'))
    
//     return isFemale
//   },

//   async getEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('id', eventId)
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async getEventById(eventId: string) {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('id', eventId)
//         .single()
      
//       return { event: data, error: error?.message }
//     } catch (error) {
//       return { event: null, error: 'Failed to fetch event' }
//     }
//   },

//   async createEvent(eventData: any) {
//     try {
//       const { user } = await auth.getCurrentUser()
      
//       const insertData: any = {
//         title: eventData.title,
//         date: eventData.date,
//         time: eventData.time,
//         location: eventData.location,
//         distance: eventData.distance || 'Custom location',
//         spots_left: eventData.spotsLeft || eventData.totalSpots,
//         total_spots: eventData.totalSpots,
//         participants: eventData.participants || [],
//         price: eventData.price,
//         category: eventData.category,
//         description: eventData.description,
//         status: 'pending',
//         girls_only: eventData.girlsOnly || false,
//         creator_group_size: eventData.creatorGroupSize || 1,
//         creator_payment_amount: eventData.creatorPaymentAmount || 100,
//         min_participants: eventData.minParticipants || 2,
//         max_participants: eventData.maxParticipants,
//         creator_paid: eventData.creatorPaid || false,
//         event_filled: eventData.eventFilled || false
//       }
      
//       if (user?.id) {
//         insertData.created_by = user.id
//       }
      
//       const { data, error } = await supabase
//         .from('events')
//         .insert(insertData)
//         .select()
//         .single()
      
//       if (error) {
//         console.error('Supabase createEvent error:', error)
//         return { success: false, event: null, error: error.message }
//       }
      
//       return { success: true, event: data, error: null }
//     } catch (err: any) {
//       console.error('Unexpected error in createEvent:', err)
//       return { success: false, event: null, error: err.message }
//     }
//   },

//   async markEventAsPaid(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ creator_paid: true })
//         .eq('id', eventId)
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to mark event as paid' }
//     }
//   },

//   async approveEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'approved' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async rejectEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'rejected' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async joinEvent(eventId: string, userId: string, userName: string) {
//     const { event } = await this.getEvent(eventId)
//     if (!event || event.spots_left <= 0) {
//       return { success: false, error: 'Event is full' }
//     }

//     const { error: participantError } = await supabase
//       .from('event_participants')
//       .insert({
//         event_id: eventId,
//         user_id: userId,
//         user_name: userName
//       })

//     if (participantError) {
//       return { success: false, error: participantError.message }
//     }

//     const newParticipants = [...(event.participants || []), userName]
//     const newSpotsLeft = event.spots_left - 1
//     const chatOpens = newParticipants.length >= (event.min_participants || 2)

//     const { error: updateError } = await supabase
//       .from('events')
//       .update({ 
//         spots_left: newSpotsLeft,
//         participants: newParticipants,
//         event_filled: chatOpens
//       })
//       .eq('id', eventId)

//     return { 
//       success: !updateError, 
//       error: updateError?.message,
//       chatOpens: chatOpens 
//     }
//   },

//   async getUserEvents(userId: string) {
//     const { data, error } = await supabase
//       .from('event_participants')
//       .select(`
//         *,
//         events (*)
//       `)
//       .eq('user_id', userId)

//     return { events: data?.map(p => p.events) || [], error: error?.message }
//   },

//   async getAllProfiles() {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { profiles: data || [], error: error?.message }
//   },

//   async getPendingEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('status', 'pending')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getAllEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getChatMessages(eventId: string) {
//     try {
//       const sevenDaysAgo = new Date()
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('event_id', eventId)
//         .gte('created_at', sevenDaysAgo.toISOString())
//         .order('created_at', { ascending: true })
//         .limit(100)
      
//       return { messages: data || [], error: error?.message }
//     } catch (error) {
//       return { messages: [], error: 'Failed to fetch messages' }
//     }
//   },

//   async sendChatMessage(eventId: string, userId: string, userName: string, message: string) {
//     try {
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert({
//           event_id: eventId,
//           user_id: userId,
//           user_name: userName,
//           message: message
//         })
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to send message' }
//     }
//   }
// }

// // =============================================
// // Analytics Functions
// // =============================================

// export const analytics = {
//   async trackVisit(pagePath: string, userId?: string) {
//     try {
//       await supabase.from('page_visits').insert({
//         page_path: pagePath,
//         user_id: userId,
//       });
//       await supabase.rpc('increment_visit');
//     } catch (error) {
//       console.error('Error tracking visit:', error);
//     }
//   },

//   async trackPayment(amount: number) {
//     try {
//       await supabase.rpc('increment_payment', { amount });
//     } catch (error) {
//       console.error('Error tracking payment:', error);
//     }
//   },

//   async getAnalytics() {
//     try {
//       const { data, error } = await supabase
//         .from('analytics')
//         .select('*')
//         .single();
//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       return null;
//     }
//   },
// };



































// // =============================================
// // FILE: src/utils/supabase.ts
// // Supabase client configuration
// // =============================================

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // =============================================
// // Authentication helpers
// // =============================================

// export const auth = {
//   async signUp(email: string, password: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
    
//     console.log('🔐 SignUp Response:', {
//       user: data.user?.email,
//       session: data.session ? 'EXISTS' : 'NULL',
//       confirmed_at: data.user?.confirmed_at,
//       email_confirmed_at: data.user?.email_confirmed_at
//     });
    
//     const isAutoConfirmed = data.session !== null;
//     const needsEmailConfirmation = data.user !== null && data.session === null;
    
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user,
//       session: data.session,
//       needsEmailConfirmation: needsEmailConfirmation,
//       autoConfirmed: isAutoConfirmed
//     }
//   },

//   async signIn(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     return { 
//       success: !error, 
//       error: error?.message,
//       user: data.user
//     }
//   },

//   async signInWithEmail(email: string) {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: window.location.origin,
//       },
//     })
//     return { success: !error, error: error?.message }
//   },

//   async resetPassword(email: string) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/#reset-password`,
//     })
//     return { success: !error, error: error?.message }
//   },

//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     return { success: !error, error: error?.message }
//   },

//   async getCurrentUser() {
//     const { data: { user }, error } = await supabase.auth.getUser()
//     return { user, error: error?.message }
//   },

//   onAuthStateChange(callback: (user: any) => void) {
//     return supabase.auth.onAuthStateChange((_event, session) => {
//       callback(session?.user || null)
//     })
//   },

//   async isAdmin() {
//     const { user } = await this.getCurrentUser()
//     if (!user) return false

//     const { data } = await supabase
//       .from('admin_users')
//       .select('id')
//       .eq('auth_user_id', user.id)
//       .single()

//     return !!data
//   }
// }

// // =============================================
// // Profile Helpers - BULLETPROOF VERSION
// // =============================================

// export const profileHelpers = {
//   async getCompleteProfile(authUserId: string) {
//     try {
//       // Try by auth_user_id first
//       let { data: profile, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('auth_user_id', authUserId)
//         .maybeSingle();

//       // If not found, try by matching with auth.users email
//       if (!profile) {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user?.email) {
//           const result = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('email', user.email)
//             .maybeSingle();
//           profile = result.data;
//         }
//       }

//       if (!profile) {
//         return { profile: null, isComplete: false, needsPersonality: false, isFullyComplete: false };
//       }

//       const isComplete = !!(
//         profile.name && 
//         profile.age && 
//         profile.gender && 
//         profile.city
//       );

//       const hasPersonality = !!(
//         profile.personality_answers && 
//         typeof profile.personality_answers === 'object' &&
//         Object.keys(profile.personality_answers).length >= 5
//       );

//       console.log('📊 Profile check:', {
//         email: profile.email,
//         isComplete,
//         hasPersonality,
//         answerCount: profile.personality_answers ? Object.keys(profile.personality_answers).length : 0
//       });

//       return {
//         profile,
//         isComplete,
//         needsPersonality: isComplete && !hasPersonality,
//         isFullyComplete: isComplete && hasPersonality
//       };
//     } catch (error) {
//       console.error('Error getting profile:', error);
//       return { profile: null, isComplete: false, needsPersonality: false, isFullyComplete: false };
//     }
//   }
// };

// // =============================================
// // Database helpers
// // =============================================

// export const db = {
//   async getProfile(userId: string) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async createProfile(profile: any) {
//     const { user } = await auth.getCurrentUser()
    
//     if (!user) {
//       return { profile: null, error: 'No authenticated user' }
//     }

//     const { data: existingByAuth } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('auth_user_id', user.id)
//       .maybeSingle()

//     if (existingByAuth) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByAuth.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     const { data: existingByEmail } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', user.email)
//       .maybeSingle()

//     if (existingByEmail) {
//       const { data, error } = await supabase
//         .from('profiles')
//         .update({
//           auth_user_id: user.id,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           work_study: profile.workStudy,
//           apartment: profile.location?.apartment,
//           locality: profile.location?.locality,
//           suburb: profile.location?.suburb,
//           city: profile.location?.city,
//           personality_answers: profile.personalityAnswers,
//           joined_events: profile.joinedEvents || []
//         })
//         .eq('id', existingByEmail.id)
//         .select()
//         .single()
      
//       return { profile: data, error: error?.message }
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .insert({
//         name: profile.name,
//         age: profile.age,
//         gender: profile.gender,
//         pronouns: profile.pronouns,
//         work_study: profile.workStudy,
//         apartment: profile.location?.apartment,
//         locality: profile.location?.locality,
//         suburb: profile.location?.suburb,
//         city: profile.location?.city,
//         personality_answers: profile.personalityAnswers || {},
//         joined_events: profile.joinedEvents || [],
//         auth_user_id: user.id,
//         email: user.email
//       })
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async updateProfile(userId: string, updates: any) {
//     const dbUpdates: any = {}
    
//     if (updates.name) dbUpdates.name = updates.name
//     if (updates.age) dbUpdates.age = updates.age
//     if (updates.gender) dbUpdates.gender = updates.gender
//     if (updates.pronouns) dbUpdates.pronouns = updates.pronouns
//     if (updates.workStudy) dbUpdates.work_study = updates.workStudy
//     if (updates.personalityAnswers) dbUpdates.personality_answers = updates.personalityAnswers
//     if (updates.joinedEvents) dbUpdates.joined_events = updates.joinedEvents
//     if (updates.location) {
//       dbUpdates.apartment = updates.location.apartment
//       dbUpdates.locality = updates.location.locality
//       dbUpdates.suburb = updates.location.suburb
//       dbUpdates.city = updates.location.city
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(dbUpdates)
//       .eq('id', userId)
//       .select()
//       .single()
    
//     return { profile: data, error: error?.message }
//   },

//   async getEvents(adminMode = false, userGender?: string) {
//     console.log('🔍 getEvents called with:', { adminMode, userGender });
    
//     let query = supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })
    
//     // In admin mode, get all events regardless of status
//     if (!adminMode) {
//       query = query.eq('status', 'approved')
//     }
    
//     const { data, error } = await query
    
//     if (error) {
//       console.error('❌ Error fetching events:', error);
//       return { events: [], error: error.message }
//     }
    
//     console.log('📦 Raw events from database:', data?.length);
    
//     let filteredEvents = data || []
    
//     // Filter by gender for girls-only events (only in non-admin mode)
//     if (userGender && !adminMode) {
//       const genderLower = userGender.toLowerCase().trim()
//       console.log('👤 User gender (normalized):', genderLower);
      
//       const isMale = genderLower === 'male' || 
//                      genderLower === 'man' ||
//                      genderLower === 'm' ||
//                      (genderLower.includes('male') && !genderLower.includes('female'))
      
//       console.log('🚹 Is male user?', isMale);
      
//       if (isMale) {
//         const beforeFilter = filteredEvents.length;
//         filteredEvents = filteredEvents.filter(event => {
//           const isGirlsOnly = event.girls_only === true;
//           console.log(`Event "${event.title}": girls_only=${isGirlsOnly}`);
//           return !isGirlsOnly;
//         });
//         const afterFilter = filteredEvents.length;
//         console.log(`✂️ Filtered ${beforeFilter - afterFilter} girls-only events`);
//       }
//     } else if (!adminMode) {
//       console.warn('⚠️ No userGender provided to getEvents - showing all events');
//     }
    
//     console.log('✅ Returning filtered events:', filteredEvents.length);
//     return { events: filteredEvents, error: null }
//   },

//   async canUserSeeEvent(eventId: string, userGender?: string) {
//     const { data: event, error } = await supabase
//       .from('events')
//       .select('girls_only')
//       .eq('id', eventId)
//       .single()
    
//     if (error || !event) {
//       return false
//     }
    
//     if (!event.girls_only) {
//       return true
//     }
    
//     if (!userGender) {
//       return false
//     }
    
//     const genderLower = userGender.toLowerCase().trim()
//     const isFemale = genderLower === 'female' || 
//                      genderLower === 'woman' ||
//                      genderLower === 'f' ||
//                      (genderLower.includes('female') || genderLower.includes('woman'))
    
//     return isFemale
//   },

//   async getEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('id', eventId)
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async getEventById(eventId: string) {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('id', eventId)
//         .single()
      
//       return { event: data, error: error?.message }
//     } catch (error) {
//       return { event: null, error: 'Failed to fetch event' }
//     }
//   },

//   async createEvent(eventData: any) {
//     try {
//       const { user } = await auth.getCurrentUser()
      
//       const insertData: any = {
//         title: eventData.title,
//         date: eventData.date,
//         time: eventData.time,
//         location: eventData.location,
//         distance: eventData.distance || 'Custom location',
//         spots_left: eventData.spotsLeft || eventData.totalSpots,
//         total_spots: eventData.totalSpots,
//         participants: eventData.participants || [],
//         price: 150, // Always ₹150
//         category: eventData.category,
//         description: eventData.description,
//         status: 'pending',
//         girls_only: eventData.girlsOnly || false,
//         creator_group_size: eventData.creatorGroupSize || 1,
//         creator_payment_amount: eventData.creatorPaymentAmount || 150,
//         min_participants: eventData.minParticipants || 2,
//         max_participants: eventData.maxParticipants,
//         creator_paid: eventData.creatorPaid || false,
//         event_filled: eventData.eventFilled || false,
//         image_url: eventData.imageUrl,
//         city: eventData.city || 'Mumbai',
//         is_curated: false // User events are not curated
//       }
      
//       if (user?.id) {
//         insertData.created_by = user.id
//       }
      
//       const { data, error } = await supabase
//         .from('events')
//         .insert(insertData)
//         .select()
//         .single()
      
//       if (error) {
//         console.error('Supabase createEvent error:', error)
//         return { success: false, event: null, error: error.message }
//       }
      
//       return { success: true, event: data, error: null }
//     } catch (err: any) {
//       console.error('Unexpected error in createEvent:', err)
//       return { success: false, event: null, error: err.message }
//     }
//   },

//   async createCuratedEvent(eventData: {
//     title: string;
//     description: string;
//     category: string;
//     location: string;
//     date: string;
//     time: string;
//     total_spots: number;
//     image_url: string;
//   }) {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .insert([{
//           title: eventData.title,
//           description: eventData.description,
//           category: eventData.category,
//           location: eventData.location,
//           date: eventData.date,
//           time: eventData.time,
//           total_spots: eventData.total_spots,
//           spots_left: eventData.total_spots,
//           price: 150, // Always ₹150
//           image_url: eventData.image_url,
//           is_curated: true,
//           status: 'approved',
//           created_by: 'admin',
//           participants: [],
//           city: 'Mumbai',
//           girls_only: false,
//           creator_paid: true,
//           event_filled: false
//         }])
//         .select()
//         .single();

//       if (error) {
//         console.error('Error creating curated event:', error);
//         return { success: false, error: error.message };
//       }

//       return { success: true, event: data };
//     } catch (error) {
//       console.error('Exception creating curated event:', error);
//       return { success: false, error: 'Failed to create curated event' };
//     }
//   },

//   async deleteEvent(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('events')
//         .delete()
//         .eq('id', eventId);

//       if (error) {
//         console.error('Error deleting event:', error);
//         return { success: false, error: error.message };
//       }

//       return { success: true };
//     } catch (error) {
//       console.error('Exception deleting event:', error);
//       return { success: false, error: 'Failed to delete event' };
//     }
//   },

//   async updateEventStatus(eventId: string, status: 'approved' | 'rejected' | 'pending') {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .update({ status })
//         .eq('id', eventId)
//         .select()
//         .single();

//       if (error) {
//         console.error('Error updating event status:', error);
//         return { success: false, error: error.message };
//       }

//       return { success: true, event: data };
//     } catch (error) {
//       console.error('Exception updating event status:', error);
//       return { success: false, error: 'Failed to update event status' };
//     }
//   },

//   async uploadEventImage(file: File, userId: string) {
//     try {
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${userId}-${Date.now()}.${fileExt}`;
//       const filePath = `event-images/${fileName}`;

//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from('event-images')
//         .upload(filePath, file);

//       if (uploadError) {
//         console.error('Error uploading image:', uploadError);
//         return { success: false, error: uploadError.message };
//       }

//       const { data: urlData } = supabase.storage
//         .from('event-images')
//         .getPublicUrl(filePath);

//       return { success: true, url: urlData.publicUrl };
//     } catch (error) {
//       console.error('Exception uploading image:', error);
//       return { success: false, error: 'Failed to upload image' };
//     }
//   },

//   async markEventAsPaid(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ creator_paid: true })
//         .eq('id', eventId)
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to mark event as paid' }
//     }
//   },

//   async approveEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'approved' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async rejectEvent(eventId: string) {
//     const { data, error } = await supabase
//       .from('events')
//       .update({ status: 'rejected' })
//       .eq('id', eventId)
//       .select()
//       .single()
    
//     return { event: data, error: error?.message }
//   },

//   async joinEvent(eventId: string, userId: string, userName: string) {
//     const { event } = await this.getEvent(eventId)
//     if (!event || event.spots_left <= 0) {
//       return { success: false, error: 'Event is full' }
//     }

//     const { error: participantError } = await supabase
//       .from('event_participants')
//       .insert({
//         event_id: eventId,
//         user_id: userId,
//         user_name: userName
//       })

//     if (participantError) {
//       return { success: false, error: participantError.message }
//     }

//     const newParticipants = [...(event.participants || []), userName]
//     const newSpotsLeft = event.spots_left - 1
//     const chatOpens = newParticipants.length >= (event.min_participants || 2)

//     const { error: updateError } = await supabase
//       .from('events')
//       .update({ 
//         spots_left: newSpotsLeft,
//         participants: newParticipants,
//         event_filled: chatOpens
//       })
//       .eq('id', eventId)

//     return { 
//       success: !updateError, 
//       error: updateError?.message,
//       chatOpens: chatOpens 
//     }
//   },

//   async getUserEvents(userId: string) {
//     const { data, error } = await supabase
//       .from('event_participants')
//       .select(`
//         *,
//         events (*)
//       `)
//       .eq('user_id', userId)

//     return { events: data?.map(p => p.events) || [], error: error?.message }
//   },

//   async getAllProfiles() {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { profiles: data || [], error: error?.message }
//   },

//   async getPendingEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .eq('status', 'pending')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getAllEvents() {
//     const { data, error } = await supabase
//       .from('events')
//       .select('*')
//       .order('created_at', { ascending: false })

//     return { events: data || [], error: error?.message }
//   },

//   async getChatMessages(eventId: string) {
//     try {
//       const sevenDaysAgo = new Date()
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('event_id', eventId)
//         .gte('created_at', sevenDaysAgo.toISOString())
//         .order('created_at', { ascending: true })
//         .limit(100)
      
//       return { messages: data || [], error: error?.message }
//     } catch (error) {
//       return { messages: [], error: 'Failed to fetch messages' }
//     }
//   },

//   async sendChatMessage(eventId: string, userId: string, userName: string, message: string) {
//     try {
//       const { error } = await supabase
//         .from('chat_messages')
//         .insert({
//           event_id: eventId,
//           user_id: userId,
//           user_name: userName,
//           message: message
//         })
      
//       return { success: !error, error: error?.message }
//     } catch (error) {
//       return { success: false, error: 'Failed to send message' }
//     }
//   }
// }

// // =============================================
// // Analytics Functions
// // =============================================

// export const analytics = {
//   async trackVisit(pagePath: string, userId?: string) {
//     try {
//       await supabase.from('page_visits').insert({
//         page_path: pagePath,
//         user_id: userId,
//       });
//       await supabase.rpc('increment_visit');
//     } catch (error) {
//       console.error('Error tracking visit:', error);
//     }
//   },

//   async trackPayment(amount: number) {
//     try {
//       await supabase.rpc('increment_payment', { amount });
//     } catch (error) {
//       console.error('Error tracking payment:', error);
//     }
//   },

//   async getAnalytics() {
//     try {
//       const { data, error } = await supabase
//         .from('analytics')
//         .select('*')
//         .single();
//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       return null;
//     }
//   },
// };
























// =============================================
// FILE: src/utils/supabase.ts
// Supabase client configuration
// =============================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Diagnostic logging for environment variables
if (import.meta.env.DEV || window.location.hostname.includes('vercel')) {
  console.log('🔧 Supabase Configuration:', {
    url: supabaseUrl,
    urlValid: supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co'),
    keyExists: !!supabaseAnonKey && supabaseAnonKey !== 'placeholder-key',
    keyLength: supabaseAnonKey?.length || 0,
    environment: import.meta.env.MODE
  });
  
  // Warn if using placeholder values
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.error('❌ Supabase environment variables not set!');
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
  }
}

// Initialize Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a minimal client that won't crash
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };

// =============================================
// Authentication helpers
// =============================================

export const auth = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    
    console.log('🔐 SignUp Response:', {
      user: data.user?.email,
      session: data.session ? 'EXISTS' : 'NULL',
      confirmed_at: data.user?.confirmed_at,
      email_confirmed_at: data.user?.email_confirmed_at
    });
    
    const isAutoConfirmed = data.session !== null;
    const needsEmailConfirmation = data.user !== null && data.session === null;
    
    return { 
      success: !error, 
      error: error?.message,
      user: data.user,
      session: data.session,
      needsEmailConfirmation: needsEmailConfirmation,
      autoConfirmed: isAutoConfirmed
    }
  },

  async signIn(email: string, password: string) {
    try {
      // Check if Supabase is properly configured
      if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
        return {
          success: false,
          error: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
          user: null
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', {
          message: error.message,
          status: error.status,
          url: supabaseUrl
        });
        
        // Provide more helpful error messages
        let errorMessage = error.message;
        if (error.message === 'Failed to fetch') {
          errorMessage = 'Connection failed. Please check: 1) Supabase CORS settings include your Vercel domain, 2) Environment variables are set correctly, 3) Supabase project is active.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        }
        
        return {
          success: false,
          error: errorMessage,
          user: null
        };
      }

      return { 
        success: !error, 
        error: error?.message,
        user: data.user
      };
    } catch (err: any) {
      console.error('❌ Sign in exception:', err);
      return {
        success: false,
        error: err.message || 'Failed to connect to Supabase. Please check your network connection and Supabase configuration.',
        user: null
      };
    }
  },

  async signInWithEmail(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    return { success: !error, error: error?.message }
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#reset-password`,
    })
    return { success: !error, error: error?.message }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { success: !error, error: error?.message }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error: error?.message }
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null)
    })
  },

  async isAdmin() {
    try {
    const { user } = await this.getCurrentUser()
      if (!user) {
        console.log('👮 Admin check: No user found');
        return false;
      }

      console.log('👮 Checking admin status for user:', user.id, user.email);
      
      const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('auth_user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking admin status:', error);
        return false;
      }

      const isAdmin = !!data;
      console.log('👮 Admin status result:', isAdmin, data ? 'Found admin record' : 'No admin record');
      
      return isAdmin;
    } catch (error) {
      console.error('❌ Exception checking admin status:', error);
      return false;
    }
  }
}

// =============================================
// Profile Helpers - BULLETPROOF VERSION
// =============================================

export const profileHelpers = {
  async getCompleteProfile(authUserId: string) {
    try {
      // Try by auth_user_id first
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      // If not found, try by matching with auth.users email
      if (!profile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const result = await supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
          profile = result.data;
        }
      }

      if (!profile) {
        return { profile: null, isComplete: false, needsPersonality: false, isFullyComplete: false };
      }

      const isComplete = !!(
        profile.name && 
        profile.age && 
        profile.gender && 
        profile.city
      );

      // Check if personality answers exist and have meaningful content
      // More lenient check - require at least 1 meaningful answer
      const personalityAnswers = profile.personality_answers;
      const hasPersonality = !!(
        personalityAnswers && 
        typeof personalityAnswers === 'object' &&
        Object.keys(personalityAnswers).length >= 1 &&
        // Ensure at least one answer is not empty
        Object.values(personalityAnswers).some(val => {
          if (val === null || val === undefined || val === '') return false;
          if (Array.isArray(val) && val.length === 0) return false;
          if (typeof val === 'object' && Object.keys(val).length === 0) return false;
          return true;
        })
      );

      console.log('📊 Profile check:', {
        email: profile.email,
        isComplete,
        hasPersonality,
        answerCount: profile.personality_answers ? Object.keys(profile.personality_answers).length : 0,
        answerKeys: profile.personality_answers ? Object.keys(profile.personality_answers) : [],
        answerValues: profile.personality_answers ? Object.values(profile.personality_answers).slice(0, 3) : []
      });

      return {
        profile,
        isComplete,
        needsPersonality: isComplete && !hasPersonality,
        isFullyComplete: isComplete && hasPersonality
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return { profile: null, isComplete: false, needsPersonality: false, isFullyComplete: false };
    }
  }
};

// =============================================
// Database helpers
// =============================================

export const db = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { profile: data, error: error?.message }
  },

  async createProfile(profile: any) {
    const { user } = await auth.getCurrentUser()
    
    if (!user) {
      return { profile: null, error: 'No authenticated user' }
    }

    const { data: existingByAuth } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (existingByAuth) {
      // CRITICAL FIX: Always use new personality answers if provided, merge with existing
      const existingAnswers = existingByAuth.personality_answers || {};
      const newAnswers = profile.personalityAnswers || {};
      
      // If new answers are provided and have content, use them (merge with existing)
      // If existing answers are empty {} and new answers have content, use new answers
      let personalityAnswersToSave;
      
      if (newAnswers && typeof newAnswers === 'object' && Object.keys(newAnswers).length > 0) {
        // New answers provided - merge with existing (new takes precedence)
        personalityAnswersToSave = {
          ...existingAnswers,
          ...newAnswers
        };
      } else if (existingAnswers && typeof existingAnswers === 'object' && Object.keys(existingAnswers).length > 0) {
        // No new answers, but existing ones exist - keep existing
        personalityAnswersToSave = existingAnswers;
      } else {
        // Both empty - use empty object
        personalityAnswersToSave = {};
      }
      
      console.log('🔄 Merging personality answers:', {
        existingCount: Object.keys(existingAnswers).length,
        existingIsEmpty: Object.keys(existingAnswers).length === 0,
        newCount: Object.keys(newAnswers).length,
        newIsEmpty: Object.keys(newAnswers).length === 0,
        finalCount: Object.keys(personalityAnswersToSave).length,
        existingKeys: Object.keys(existingAnswers),
        newKeys: Object.keys(newAnswers),
        finalKeys: Object.keys(personalityAnswersToSave),
        willSave: Object.keys(personalityAnswersToSave).length > 0
      });
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          pronouns: profile.pronouns,
          work_study: profile.workStudy,
          photo_url: profile.photoUrl !== undefined ? profile.photoUrl : existingByAuth.photo_url,
          apartment: profile.location?.apartment,
          locality: profile.location?.locality,
          suburb: profile.location?.suburb,
          city: profile.location?.city,
          personality_answers: personalityAnswersToSave,
          joined_events: profile.joinedEvents?.length > 0 ? profile.joinedEvents : (existingByAuth.joined_events || [])
        })
        .eq('id', existingByAuth.id)
        .select()
        .single()
      
      console.log('💾 Updated profile with personality answers:', {
        saved: Object.keys(personalityAnswersToSave).length,
        keys: Object.keys(personalityAnswersToSave),
        success: !error
      });
      
      return { profile: data, error: error?.message }
    }

    const { data: existingByEmail } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .maybeSingle()

    if (existingByEmail) {
      // CRITICAL FIX: Always use new personality answers if provided, merge with existing
      const existingAnswers = existingByEmail.personality_answers || {};
      const newAnswers = profile.personalityAnswers || {};
      
      // Merge existing answers with new ones (new answers take precedence)
      const personalityAnswersToSave = {
        ...existingAnswers,
        ...newAnswers
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          auth_user_id: user.id,
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          pronouns: profile.pronouns,
          work_study: profile.workStudy,
          photo_url: profile.photoUrl !== undefined ? profile.photoUrl : existingByEmail.photo_url,
          apartment: profile.location?.apartment,
          locality: profile.location?.locality,
          suburb: profile.location?.suburb,
          city: profile.location?.city,
          personality_answers: personalityAnswersToSave,
          joined_events: profile.joinedEvents?.length > 0 ? profile.joinedEvents : (existingByEmail.joined_events || [])
        })
        .eq('id', existingByEmail.id)
        .select()
        .single()
      
      console.log('💾 Updated profile (by email) with personality answers:', {
        saved: Object.keys(personalityAnswersToSave).length,
        keys: Object.keys(personalityAnswersToSave)
      });
      
      return { profile: data, error: error?.message }
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        pronouns: profile.pronouns,
        work_study: profile.workStudy,
        photo_url: profile.photoUrl,
        apartment: profile.location?.apartment,
        locality: profile.location?.locality,
        suburb: profile.location?.suburb,
        city: profile.location?.city,
        personality_answers: profile.personalityAnswers || {},
        joined_events: profile.joinedEvents || [],
        auth_user_id: user.id,
        email: user.email
      })
      .select()
      .single()
    
    return { profile: data, error: error?.message }
  },

  async updateProfile(userId: string, updates: any) {
    const dbUpdates: any = {}
    
    if (updates.name) dbUpdates.name = updates.name
    if (updates.age) dbUpdates.age = updates.age
    if (updates.gender) dbUpdates.gender = updates.gender
    if (updates.pronouns) dbUpdates.pronouns = updates.pronouns
    if (updates.workStudy) dbUpdates.work_study = updates.workStudy
    if (updates.photoUrl !== undefined) dbUpdates.photo_url = updates.photoUrl
    if (updates.personalityAnswers) dbUpdates.personality_answers = updates.personalityAnswers
    if (updates.joinedEvents) dbUpdates.joined_events = updates.joinedEvents
    if (updates.location) {
      dbUpdates.apartment = updates.location.apartment
      dbUpdates.locality = updates.location.locality
      dbUpdates.suburb = updates.location.suburb
      dbUpdates.city = updates.location.city
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single()
    
    return { profile: data, error: error?.message }
  },

  async getEvents(adminMode = false, userGender?: string) {
    console.log('🔍 getEvents called with:', { adminMode, userGender });
    
    let query = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    
    // In admin mode, get all events regardless of status
    if (!adminMode) {
      query = query.eq('status', 'approved')
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('❌ Error fetching events:', error);
      return { events: [], error: error.message }
    }
    
    console.log('📦 Raw events from database:', data?.length);
    
    let filteredEvents = data || []
    
    // Filter out expired events (unless in admin mode)
    if (!adminMode) {
      const now = new Date();
      filteredEvents = filteredEvents.filter((event: any) => {
        // Keep TBD events (curated template events)
        if (!event.date || event.date.trim().toUpperCase() === 'TBD' || event.date.trim() === '') {
          return true;
        }
        
        // Parse event date
        try {
          // Try parsing date in various formats
          let eventDate: Date;
          if (event.date.includes('/')) {
            // Format: dd/mm/yyyy or dd/mm/yy
            const parts = event.date.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]) - 1; // Month is 0-indexed
              const year = parseInt(parts[2]) < 100 ? 2000 + parseInt(parts[2]) : parseInt(parts[2]);
              eventDate = new Date(year, month, day);
            } else {
              return true; // Can't parse, show it
            }
          } else {
            eventDate = new Date(event.date);
          }
          
          if (isNaN(eventDate.getTime())) {
            return true; // Invalid date, show it
          }
          
          // Parse time if available
          if (event.time && event.time !== 'TBD') {
            const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeMatch) {
              let hours = parseInt(timeMatch[1]);
              const minutes = parseInt(timeMatch[2]);
              const isPM = timeMatch[3].toUpperCase() === 'PM';
              if (isPM && hours !== 12) hours += 12;
              if (!isPM && hours === 12) hours = 0;
              eventDate.setHours(hours, minutes, 0, 0);
            } else {
              // Try 24-hour format
              const time24 = event.time.match(/(\d{1,2}):(\d{2})/);
              if (time24) {
                eventDate.setHours(parseInt(time24[1]), parseInt(time24[2]), 0, 0);
              }
            }
          }
          
          // Event expires after its date/time
          const isExpired = eventDate < now;
          
          if (isExpired) {
            console.log(`⏰ Filtering out expired event: "${event.title}" - Date: ${event.date} ${event.time || ''}`);
          }
          
          return !isExpired;
        } catch (err) {
          // If we can't parse the date, show the event (might be a template)
          console.warn(`⚠️ Could not parse date for event "${event.title}":`, err);
          return true;
        }
      });
      
      console.log('⏰ After expiration filter:', filteredEvents.length, 'events');
    }
    
    // Filter by gender for girls-only events (only in non-admin mode)
    if (userGender && !adminMode) {
      const genderLower = userGender.toLowerCase().trim()
      console.log('👤 User gender (normalized):', genderLower);
      
      const isMale = genderLower === 'male' || 
                     genderLower === 'man' ||
                     genderLower === 'm' ||
                     (genderLower.includes('male') && !genderLower.includes('female'))
      
      console.log('🚹 Is male user?', isMale);
      
      if (isMale) {
        const beforeFilter = filteredEvents.length;
        filteredEvents = filteredEvents.filter(event => {
          const isGirlsOnly = event.girls_only === true;
          console.log(`Event "${event.title}": girls_only=${isGirlsOnly}`);
          return !isGirlsOnly;
        });
        const afterFilter = filteredEvents.length;
        console.log(`✂️ Filtered ${beforeFilter - afterFilter} girls-only events`);
      }
    } else if (!adminMode) {
      console.warn('⚠️ No userGender provided to getEvents - showing all events');
    }
    
    console.log('✅ Returning filtered events:', filteredEvents.length);
    return { events: filteredEvents, error: null }
  },

  async canUserSeeEvent(eventId: string, userGender?: string) {
    const { data: event, error } = await supabase
      .from('events')
      .select('girls_only')
      .eq('id', eventId)
      .single()
    
    if (error || !event) {
      return false
    }
    
    if (!event.girls_only) {
      return true
    }
    
    if (!userGender) {
      return false
    }
    
    const genderLower = userGender.toLowerCase().trim()
    const isFemale = genderLower === 'female' || 
                     genderLower === 'woman' ||
                     genderLower === 'f' ||
                     (genderLower.includes('female') || genderLower.includes('woman'))
    
    return isFemale
  },

  async getEvent(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    
    return { event: data, error: error?.message }
  },

  async getEventById(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()
      
      return { event: data, error: error?.message }
    } catch (error) {
      return { event: null, error: 'Failed to fetch event' }
    }
  },

  async createEvent(eventData: any) {
    try {
      const { user } = await auth.getCurrentUser()
      
      console.log('🚀 Creating event with data:', eventData);
      
      const insertData: any = {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        distance: eventData.distance || 'Custom location',
        spots_left: eventData.spotsLeft || eventData.totalSpots,
        total_spots: eventData.totalSpots,
        participants: eventData.participants || [],
        price: 150, // Always ₹150
        category: eventData.category,
        description: eventData.description,
        status: 'approved', // CRITICAL: Set to 'approved' so event is visible to all users immediately
        girls_only: eventData.girlsOnly || false,
        creator_group_size: eventData.creatorGroupSize || 1,
        creator_payment_amount: eventData.creatorPaymentAmount || 150,
        min_participants: eventData.minParticipants || 2,
        max_participants: eventData.maxParticipants,
        creator_paid: eventData.creatorPaid || false,
        event_filled: eventData.eventFilled || false,
        image_url: eventData.imageUrl,
        city: eventData.city || 'Mumbai',
        is_curated: false // User events are not curated
      }
      
      if (user?.id) {
        insertData.created_by = user.id
      }
      
      console.log('📨 Inserting to Supabase:', insertData);
      
      const { data, error } = await supabase
        .from('events')
        .insert(insertData)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Supabase createEvent error:', error)
        return { success: false, event: null, error: error.message }
      }
      
      console.log('✅ Event created successfully:', data);
      return { success: true, event: data, error: null }
    } catch (err: any) {
      console.error('❌ Unexpected error in createEvent:', err)
      return { success: false, event: null, error: err.message }
    }
  },

  async createCuratedEvent(eventData: {
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    time: string;
    total_spots: number;
    image_url: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          location: eventData.location,
          date: eventData.date,
          time: eventData.time,
          total_spots: eventData.total_spots,
          spots_left: eventData.total_spots,
          price: 150, // Always ₹150
          image_url: eventData.image_url,
          is_curated: true,
          status: 'approved',
          created_by: 'admin',
          participants: [],
          city: 'Mumbai',
          girls_only: false,
          creator_paid: true,
          event_filled: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating curated event:', error);
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error) {
      console.error('Exception creating curated event:', error);
      return { success: false, error: 'Failed to create curated event' };
    }
  },

  async deleteEvent(eventId: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception deleting event:', error);
      return { success: false, error: 'Failed to delete event' };
    }
  },

  async updateEventStatus(eventId: string, status: 'approved' | 'rejected' | 'pending') {
    try {
      console.log(`🔄 Updating event ${eventId} status to: ${status}`);
      
      const { data, error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating event status:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Event status updated:', data);
      return { success: true, event: data };
    } catch (error) {
      console.error('❌ Exception updating event status:', error);
      return { success: false, error: 'Failed to update event status' };
    }
  },

  async uploadEventImage(file: File, userId: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { success: false, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Exception uploading image:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  },

  async uploadProfilePhoto(file: File, userId: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting if user uploads again
        });

      if (uploadError) {
        console.error('Error uploading profile photo:', uploadError);
        return { success: false, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Exception uploading profile photo:', error);
      return { success: false, error: 'Failed to upload photo' };
    }
  },

  async markEventAsPaid(eventId: string) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ creator_paid: true })
        .eq('id', eventId)
      
      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: 'Failed to mark event as paid' }
    }
  },

  async approveEvent(eventId: string) {
    console.log('✅ Approving event:', eventId);
    
    const { data, error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', eventId)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error approving event:', error);
    } else {
      console.log('✅ Event approved successfully:', data);
    }
    
    return { event: data, error: error?.message }
  },

  async rejectEvent(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .update({ status: 'rejected' })
      .eq('id', eventId)
      .select()
      .single()
    
    return { event: data, error: error?.message }
  },

  async joinEvent(eventId: string, userId: string, userName: string) {
    console.log('🎉 User joining event:', { eventId, userId, userName });
    
    const { event } = await this.getEvent(eventId)
    if (!event || event.spots_left <= 0) {
      return { success: false, error: 'Event is full' }
    }

    // Create event participant record
    const { error: participantError } = await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: userId,
        user_name: userName,
        payment_verified: true, // Auto-verify for now
        amount_paid: 150
      })

    if (participantError) {
      console.error('❌ Error creating participant:', participantError);
      return { success: false, error: participantError.message }
    }

    // Update event with new participant
    const newParticipants = [...(event.participants || []), userId]
    const newSpotsLeft = event.spots_left - 1
    const chatOpens = newParticipants.length >= (event.min_participants || 2)

    const { error: updateError } = await supabase
      .from('events')
      .update({ 
        spots_left: newSpotsLeft,
        participants: newParticipants,
        event_filled: chatOpens
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('❌ Error updating event:', updateError);
      return { success: false, error: updateError.message }
    }

    console.log('✅ User joined event successfully');
    return { 
      success: true, 
      chatOpens: chatOpens 
    }
  },

  async recordPayment(data: { 
    userId: string; 
    eventId: string; 
    amount: number; 
    userName: string;
  }) {
    try {
      console.log('💳 Recording payment (auto-approved):', data);

      // Create payment record as VERIFIED (auto-approve)
      const { data: paymentData, error: paymentError } = await supabase
        .from('event_participants')
        .insert({
          user_id: data.userId,
          event_id: data.eventId,
          amount_paid: data.amount,
          payment_verified: true, // AUTO-APPROVE
          payment_note: `Payment by ${data.userName}`,
          created_at: new Date().toISOString(),
          verified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (paymentError) {
        console.error('❌ Payment insert error:', paymentError);
        return { success: false, error: paymentError.message };
      }

      // Immediately update the event
      const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', data.eventId)
        .single();

      if (event) {
        const updatedParticipants = [...(event.participants || []), data.userId];
        const newSpotsLeft = Math.max(0, event.spots_left - 1);
        const isNowFilled = updatedParticipants.length >= (event.min_participants || 2);

        await supabase
          .from('events')
          .update({
            participants: updatedParticipants,
            spots_left: newSpotsLeft,
            event_filled: isNowFilled
          })
          .eq('id', data.eventId);
      }

      console.log('✅ Payment recorded and auto-approved');
      return { success: true, payment: paymentData };
    } catch (error: any) {
      console.error('❌ Record payment error:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserEvents(userId: string) {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        *,
        events (*)
      `)
      .eq('user_id', userId)
      .eq('payment_verified', true)

    return { events: data?.map(p => p.events) || [], error: error?.message }
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    return { profiles: data || [], error: error?.message }
  },

  async getPendingEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    return { events: data || [], error: error?.message }
  },

  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    return { events: data || [], error: error?.message }
  },

  async getChatMessages(eventId: string) {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('event_id', eventId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true })
        .limit(100)
      
      return { messages: data || [], error: error?.message }
    } catch (error) {
      return { messages: [], error: 'Failed to fetch messages' }
    }
  },

  async sendChatMessage(eventId: string, userId: string, userName: string, message: string) {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          event_id: eventId,
          user_id: userId,
          user_name: userName,
          message: message
        })
      
      return { success: !error, error: error?.message }
    } catch (error) {
      return { success: false, error: 'Failed to send message' }
    }
  }
}

// =============================================
// Analytics Functions
// =============================================

export const analytics = {
  async trackVisit(pagePath: string, userId?: string) {
    try {
      // Try to insert into analytics table (if it exists)
      const { error: analyticsError } = await supabase
        .from('analytics')
        .insert({
          event_type: 'page_view',
          page_name: pagePath,
          user_id: userId || null,
          created_at: new Date().toISOString()
        });
      
      // Silently ignore errors - analytics is optional
      if (analyticsError && !analyticsError.message?.includes('relation') && !analyticsError.message?.includes('does not exist')) {
        console.warn('Analytics tracking warning:', analyticsError.message);
      }
      
      // Try RPC function (if it exists) - silently fail if it doesn't
      const { error: rpcError } = await supabase.rpc('increment_visit');
      if (rpcError && !rpcError.message?.includes('function') && !rpcError.message?.includes('does not exist')) {
        // Only log if it's not a "function doesn't exist" error
        console.warn('RPC increment_visit warning:', rpcError.message);
      }
    } catch (error: any) {
      // Silently ignore - analytics is optional and shouldn't break the app
      if (error?.message && !error.message.includes('does not exist') && !error.message.includes('relation')) {
        console.warn('Analytics tracking error (non-critical):', error.message);
      }
    }
  },

  async trackPayment(amount: number) {
    try {
      // Try RPC function (if it exists) - silently fail if it doesn't
      const { error } = await supabase.rpc('increment_payment', { amount });
      if (error && !error.message?.includes('function') && !error.message?.includes('does not exist')) {
        console.warn('RPC increment_payment warning:', error.message);
      }
    } catch (error: any) {
      // Silently ignore - analytics is optional
      if (error?.message && !error.message.includes('does not exist')) {
        console.warn('Payment tracking error (non-critical):', error.message);
      }
    }
  },

  async getAnalytics() {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  },

  // =============================================
  // Admin Management Functions
  // =============================================
  async createAdminAccount(authUserId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          auth_user_id: authUserId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        // If user is already an admin, that's okay
        if (error.code === '23505') { // Unique constraint violation
          return { success: true, message: 'User is already an admin' };
        }
        throw error;
      }

      return { success: true, data, message: 'Admin account created successfully' };
    } catch (error: any) {
      console.error('Error creating admin account:', error);
      return { success: false, error: error.message };
    }
  },

  async removeAdminAccount(authUserId: string) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('auth_user_id', authUserId);

      if (error) throw error;

      return { success: true, message: 'Admin access removed successfully' };
    } catch (error: any) {
      console.error('Error removing admin account:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllAdmins() {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, admins: data || [] };
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      return { success: false, error: error.message, admins: [] };
    }
  },
};