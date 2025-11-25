

// import React, { useState, useEffect } from 'react';
// import { LandingPage } from './components/LandingPage';
// import { AuthPage } from './components/AuthPage';
// import { AuthCallback } from './components/AuthCallback';
// import { ProfileCreation } from './components/ProfileCreation';
// import { PersonalityQuestions } from './components/PersonalityQuestions';
// import { ConfirmationPage } from './components/ConfirmationPage';
// import { EventsPage } from './components/EventsPage';
// import { PaymentPage } from './components/PaymentPage';
// import { ChatRoom } from './components/ChatRoom';
// import { UserDashboard } from './components/UserDashboard';
// import { AdminDashboard } from './components/AdminDashboard';
// import { ResetPasswordPage } from './components/ResetPasswordPage';
// import { auth, db, analytics } from './utils/supabase';

// export type Screen = 
//   | 'landing'
//   | 'auth'
//   | 'auth-callback'
//   | 'profile'
//   | 'personality'
//   | 'confirmation'
//   | 'events'
//   | 'payment'
//   | 'chat'
//   | 'dashboard'
//   | 'admin'
//   | 'reset-password';

// export type UserProfile = {
//   id?: string;
//   email?: string;
//   name: string;
//   age: string;
//   gender: string;
//   pronouns: string;
//   workStudy: string;
//   location: {
//     apartment: string;
//     locality: string;
//     suburb: string;
//     city: string;
//   };
//   personalityAnswers: Record<string, any>;
//   joinedEvents: string[];
// };

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check auth state on mount
//   useEffect(() => {
//     console.log('🚀 App starting, checking auth state...');
    
//     // Check if coming from email link
//     const hash = window.location.hash;
//     if (hash && hash.includes('type=recovery')) {
//       console.log('🔑 Password recovery link detected');
//       setCurrentScreen('reset-password');
//       return;
//     }
    
//     checkAuthState();

//     // Listen for auth changes
//     const { data: { subscription } } = auth.onAuthStateChange(async (user) => {
//       console.log('🔄 Auth state changed:', user ? 'User logged in' : 'User logged out');
//       if (user) {
//         // Don't auto-redirect if coming from email link
//         const hash = window.location.hash;
//         if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
//           console.log('📧 Email link detected, not auto-redirecting');
//           return;
//         }
//         await loadUserData(user.id);
//       } else {
//         setUserProfile(null);
//         setUserId(null);
//         setIsAdmin(false);
//         setCurrentScreen('landing');
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   // NEW: Prevent re-showing profile/personality pages for completed profiles
//   useEffect(() => {
//     const preventBackNavigation = async () => {
//       if (!userId) return;
      
//       const { profile } = await db.getProfile(userId);
      
//       if (profile) {
//         // Check if profile is complete
//         const hasCompletedProfile = profile.name && 
//                                     profile.age && 
//                                     profile.gender && 
//                                     profile.city;
        
//         const hasCompletedPersonality = profile.personality_answers && 
//                                         Object.keys(profile.personality_answers).length > 0;
        
//         // CRITICAL: If profile exists and is complete, NEVER show profile/personality pages again
//         if (hasCompletedProfile && hasCompletedPersonality) {
//           if (currentScreen === 'profile' || 
//               currentScreen === 'personality' || 
//               currentScreen === 'confirmation') {
//             console.log('⚠️ Profile complete! Redirecting to dashboard from:', currentScreen);
//             setCurrentScreen(isAdmin ? 'admin' : 'dashboard');
//           }
//         }
//       }
//     };

//     preventBackNavigation();
//   }, [userId, currentScreen, isAdmin]);

//   // NEW: Track page visits for analytics
//   useEffect(() => {
//     const trackPageView = () => {
//       const pageName = currentScreen;
//       analytics.trackVisit(pageName, userId || undefined);
//       console.log('📊 Analytics: Page visit tracked -', pageName);
//     };

//     trackPageView();
//   }, [currentScreen, userId]);

//   const checkAuthState = async () => {
//     setIsLoading(true);
//     const { user } = await auth.getCurrentUser();
    
//     console.log('👤 Current user:', user ? user.id : 'No user');
    
//     if (user) {
//       await loadUserData(user.id);
//     } else {
//       console.log('⚠️ No authenticated user found');
//     }
    
//     setIsLoading(false);
//   };

//   const loadUserData = async (authUserId: string) => {
//     console.log('📥 Loading user data for:', authUserId);
    
//     // Check if admin
//     const adminStatus = await auth.isAdmin();
//     setIsAdmin(adminStatus);
//     console.log('👮 Is admin:', adminStatus);

//     // Load profile
//     const { profile } = await db.getProfile(authUserId);
    
//     console.log('📋 Profile loaded:', profile);
    
//     if (profile) {
//       // Profile exists - check if it's complete
//       const isProfileComplete = profile.name && 
//                                 profile.age && 
//                                 profile.gender && 
//                                 profile.city;
      
//       const hasPersonalityAnswers = profile.personality_answers && 
//                                     Object.keys(profile.personality_answers).length > 0;

//       console.log('✅ Profile complete:', isProfileComplete, 'Has personality:', hasPersonalityAnswers);

//       if (isProfileComplete && hasPersonalityAnswers) {
//         // Profile is complete, load it and go to dashboard (or admin)
//         const loadedProfile = {
//           id: profile.id,
//           email: profile.email,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns,
//           workStudy: profile.work_study,
//           location: {
//             apartment: profile.apartment || '',
//             locality: profile.locality || '',
//             suburb: profile.suburb || '',
//             city: profile.city || ''
//           },
//           personalityAnswers: profile.personality_answers || {},
//           joinedEvents: profile.joined_events || []
//         };
        
//         setUserProfile(loadedProfile);
//         setUserId(profile.id);
        
//         // FIXED: Always go to dashboard (or admin) when profile is complete
//         setCurrentScreen(adminStatus ? 'admin' : 'dashboard');
//         console.log('🎉 Profile complete! Going to:', adminStatus ? 'admin' : 'dashboard');
//       } else {
//         // Profile incomplete - determine where to send them
//         setUserId(authUserId);
        
//         if (!isProfileComplete) {
//           console.log('⚠️ Profile incomplete, going to profile creation');
//           setCurrentScreen('profile');
//         } else if (!hasPersonalityAnswers) {
//           console.log('⚠️ Missing personality answers, going to personality questions');
//           // Load partial profile first
//           setUserProfile({
//             id: profile.id,
//             email: profile.email,
//             name: profile.name,
//             age: profile.age,
//             gender: profile.gender,
//             pronouns: profile.pronouns,
//             workStudy: profile.work_study,
//             location: {
//               apartment: profile.apartment || '',
//               locality: profile.locality || '',
//               suburb: profile.suburb || '',
//               city: profile.city || ''
//             },
//             personalityAnswers: {},
//             joinedEvents: profile.joined_events || []
//           });
//           setCurrentScreen('personality');
//         }
//       }
//     } else {
//       // New user - needs to create profile
//       console.log('🆕 New user, going to profile creation');
//       setUserId(authUserId);
//       setCurrentScreen('profile');
//     }
//   };

//   const navigateTo = (screen: Screen) => {
//     console.log('🧭 Navigating to:', screen);
//     setCurrentScreen(screen);
//   };

//   const updateProfile = (updates: Partial<UserProfile>) => {
//     console.log('📝 Updating profile with:', updates);
//     setUserProfile(prev => {
//       if (prev) {
//         return { ...prev, ...updates };
//       }
//       // If prev is null, create a new profile with defaults + updates
//       return {
//         name: '',
//         age: '',
//         gender: '',
//         pronouns: '',
//         workStudy: '',
//         location: { apartment: '', locality: '', suburb: '', city: '' },
//         personalityAnswers: {},
//         joinedEvents: [],
//         ...updates
//       };
//     });
//   };

//   const saveProfileToBackend = async () => {
//     if (!userProfile) {
//       console.error('❌ No profile to save!');
//       return;
//     }

//     console.log('💾 Saving profile to database...', userProfile);
//     setIsLoading(true);
//     try {
//       const result = await db.createProfile(userProfile);
//       if (result.profile) {
//         console.log('✅ Profile saved successfully!', result.profile);
//         const savedProfile = {
//           id: result.profile.id,
//           email: result.profile.email,
//           name: result.profile.name,
//           age: result.profile.age,
//           gender: result.profile.gender,
//           pronouns: result.profile.pronouns,
//           workStudy: result.profile.work_study,
//           location: {
//             apartment: result.profile.apartment || '',
//             locality: result.profile.locality || '',
//             suburb: result.profile.suburb || '',
//             city: result.profile.city || ''
//           },
//           personalityAnswers: result.profile.personality_answers || {},
//           joinedEvents: result.profile.joined_events || []
//         };
//         setUserProfile(savedProfile);
//         setUserId(result.profile.id);
        
//         // FIXED: Go to dashboard after saving
//         console.log('🎉 Redirecting to dashboard');
//         setCurrentScreen(isAdmin ? 'admin' : 'dashboard');
//       } else {
//         console.error('❌ Failed to save profile:', result.error);
//         alert('Failed to save profile: ' + result.error);
//       }
//     } catch (error) {
//       console.error('❌ Error saving profile:', error);
//       alert('Error saving profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAuthSuccess = (authUserId: string, hasProfile: boolean) => {
//     console.log('🔐 Auth success! User ID:', authUserId, 'Has profile:', hasProfile);
//     loadUserData(authUserId);
//   };

//   const handleLogout = async () => {
//     console.log('👋 Logging out...');
//     await auth.signOut();
//     setUserProfile(null);
//     setUserId(null);
//     setIsAdmin(false);
//     setCurrentScreen('landing');
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const renderScreen = () => {
//     switch (currentScreen) {
//       case 'landing':
//         return <LandingPage onNavigate={navigateTo} />;
//       case 'auth':
//         return <AuthPage onNavigate={navigateTo} />;
//       case 'auth-callback':
//         return <AuthCallback onAuthSuccess={handleAuthSuccess} />;
//       case 'profile':
//         return (
//           <ProfileCreation
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onUpdateProfile={updateProfile}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'personality':
//         return (
//           <PersonalityQuestions
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onUpdateProfile={updateProfile}
//             onNavigate={navigateTo}
//             onSaveProfile={saveProfileToBackend}
//           />
//         );
//       case 'confirmation':
//         return (
//           <ConfirmationPage
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onNavigate={navigateTo}
//             onSaveProfile={saveProfileToBackend}
//             isLoading={false}
//           />
//         );
//       case 'events':
//         return (
//           <EventsPage
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onSelectEvent={setSelectedEvent}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'payment':
//         return (
//           <PaymentPage
//             eventId={selectedEvent}
//             userId={userId}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'chat':
//         return (
//           <ChatRoom
//             eventId={selectedEvent}
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'dashboard':
//         return (
//           <UserDashboard
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onNavigate={navigateTo}
//             onLogout={handleLogout}
//           />
//         );
//       case 'admin':
//         return (
//           <AdminDashboard
//             onNavigate={navigateTo}
//             onLogout={handleLogout}
//           />
//         );
//       case 'reset-password':
//         return <ResetPasswordPage onNavigate={navigateTo} />;
//       default:
//         return <LandingPage onNavigate={navigateTo} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
//       {renderScreen()}
//     </div>
//   );
// }






























// import React, { useState, useEffect } from 'react';
// import { LandingPage } from './components/LandingPage';
// import { AuthPage } from './components/AuthPage';
// import { AuthCallback } from './components/AuthCallback';
// import { ProfileCreation } from './components/ProfileCreation';
// import { PersonalityQuestions } from './components/PersonalityQuestions';
// import { ConfirmationPage } from './components/ConfirmationPage';
// import { EventsPage } from './components/EventsPage';
// import { PaymentPage } from './components/PaymentPage';
// import { ChatRoom } from './components/ChatRoom';
// import { UserDashboard } from './components/UserDashboard';
// import { AdminDashboard } from './components/AdminDashboard';
// import { ResetPasswordPage } from './components/ResetPasswordPage';
// import { auth, db, analytics, supabase } from './utils/supabase';

// export type Screen = 
//   | 'landing'
//   | 'auth'
//   | 'auth-callback'
//   | 'profile'
//   | 'personality'
//   | 'confirmation'
//   | 'events'
//   | 'payment'
//   | 'chat'
//   | 'dashboard'
//   | 'admin'
//   | 'reset-password';

// export type UserProfile = {
//   id?: string;
//   email?: string;
//   name: string;
//   age: string;
//   gender: string;
//   pronouns: string;
//   workStudy: string;
//   location: {
//     apartment: string;
//     locality: string;
//     suburb: string;
//     city: string;
//   };
//   personalityAnswers: Record<string, any>;
//   joinedEvents: string[];
// };

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check auth state on mount
//   useEffect(() => {
//     console.log('🚀 App starting, checking auth state...');
    
//     // Check if coming from email link
//     const hash = window.location.hash;
//     if (hash && hash.includes('type=recovery')) {
//       console.log('🔑 Password recovery link detected');
//       setCurrentScreen('reset-password');
//       setIsLoading(false);
//       return;
//     }
    
//     checkAuthState();

//     // Listen for auth changes
//     const { data: { subscription } } = auth.onAuthStateChange(async (user) => {
//       console.log('🔄 Auth state changed:', user ? 'User logged in' : 'User logged out');
//       if (user) {
//         // Don't auto-redirect if coming from email link
//         const hash = window.location.hash;
//         if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
//           console.log('📧 Email link detected, not auto-redirecting');
//           return;
//         }
//         await loadUserData(user.id);
//       } else {
//         setUserProfile(null);
//         setUserId(null);
//         setIsAdmin(false);
//         setCurrentScreen('landing');
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   // Prevent re-showing profile/personality pages for completed profiles
//   useEffect(() => {
//     const preventBackNavigation = async () => {
//       if (!userId) return;
      
//       try {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('auth_user_id', userId)
//           .maybeSingle();
        
//         if (profile) {
//           // Check if profile is complete
//           const hasCompletedProfile = !!(
//             profile.name && 
//             profile.age && 
//             profile.gender && 
//             profile.city
//           );
          
//           const hasCompletedPersonality = !!(
//             profile.personality_answers && 
//             Object.keys(profile.personality_answers).length > 5
//           );
          
//           // CRITICAL: If profile exists and is complete, NEVER show profile/personality pages again
//           if (hasCompletedProfile && hasCompletedPersonality) {
//             if (currentScreen === 'profile' || 
//                 currentScreen === 'personality' || 
//                 currentScreen === 'confirmation') {
//               console.log('⚠️ Profile complete! Redirecting to dashboard from:', currentScreen);
//               setCurrentScreen(isAdmin ? 'admin' : 'dashboard');
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error checking profile:', error);
//       }
//     };

//     preventBackNavigation();
//   }, [userId, currentScreen, isAdmin]);

//   // Track page visits for analytics
//   useEffect(() => {
//     const trackPageView = () => {
//       const pageName = currentScreen;
//       analytics.trackVisit(pageName, userId || undefined);
//       console.log('📊 Analytics: Page visit tracked -', pageName);
//     };

//     trackPageView();
//   }, [currentScreen, userId]);

//   const checkAuthState = async () => {
//     setIsLoading(true);
//     try {
//       const { user } = await auth.getCurrentUser();
      
//       console.log('👤 Current user:', user ? user.email : 'No user');
      
//       if (user) {
//         await loadUserData(user.id);
//       } else {
//         console.log('⚠️ No authenticated user found');
//         setCurrentScreen('landing');
//       }
//     } catch (error) {
//       console.error('Error checking auth state:', error);
//       setCurrentScreen('landing');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadUserData = async (authUserId: string) => {
//     console.log('📥 Loading user data for:', authUserId);
    
//     try {
//       // Check if admin
//       const adminStatus = await auth.isAdmin();
//       setIsAdmin(adminStatus);
//       console.log('👮 Is admin:', adminStatus);

//       // Load profile using auth_user_id
//       const { data: profile, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('auth_user_id', authUserId)
//         .maybeSingle();
      
//       if (error) {
//         console.error('Error loading profile:', error);
//         // New user - needs to create profile
//         setUserId(authUserId);
//         setCurrentScreen('profile');
//         return;
//       }
      
//       console.log('📋 Profile loaded:', profile);
      
//       if (profile) {
//         // Check if profile is complete
//         const isProfileComplete = !!(
//           profile.name && 
//           profile.age && 
//           profile.gender && 
//           profile.city
//         );
        
//         const hasPersonalityAnswers = !!(
//           profile.personality_answers && 
//           Object.keys(profile.personality_answers).length > 5 // At least 5 answers
//         );

//         console.log('✅ Profile status:', {
//           isComplete: isProfileComplete,
//           hasPersonality: hasPersonalityAnswers,
//           answerCount: profile.personality_answers ? Object.keys(profile.personality_answers).length : 0
//         });

//         if (isProfileComplete && hasPersonalityAnswers) {
//           // ✅ PROFILE IS COMPLETE - ALWAYS GO TO DASHBOARD
//           const loadedProfile = {
//             id: profile.id,
//             email: profile.email,
//             name: profile.name,
//             age: profile.age,
//             gender: profile.gender,
//             pronouns: profile.pronouns || '',
//             workStudy: profile.work_study || '',
//             location: {
//               apartment: profile.apartment || '',
//               locality: profile.locality || '',
//               suburb: profile.suburb || '',
//               city: profile.city || ''
//             },
//             personalityAnswers: profile.personality_answers || {},
//             joinedEvents: profile.joined_events || []
//           };
          
//           setUserProfile(loadedProfile);
//           setUserId(profile.id);
          
//           // CRITICAL: Always go to dashboard when profile is complete
//           console.log('🎉 Profile complete! Going to dashboard');
//           setCurrentScreen(adminStatus ? 'admin' : 'dashboard');
//         } else {
//           // Profile incomplete
//           setUserId(authUserId);
          
//           if (!isProfileComplete) {
//             console.log('⚠️ Profile incomplete, going to profile creation');
//             setCurrentScreen('profile');
//           } else if (!hasPersonalityAnswers) {
//             console.log('⚠️ Missing personality answers, going to personality questions');
//             // Load partial profile
//             setUserProfile({
//               id: profile.id,
//               email: profile.email,
//               name: profile.name,
//               age: profile.age,
//               gender: profile.gender,
//               pronouns: profile.pronouns || '',
//               workStudy: profile.work_study || '',
//               location: {
//                 apartment: profile.apartment || '',
//                 locality: profile.locality || '',
//                 suburb: profile.suburb || '',
//                 city: profile.city || ''
//               },
//               personalityAnswers: {},
//               joinedEvents: profile.joined_events || []
//             });
//             setCurrentScreen('personality');
//           }
//         }
//       } else {
//         // New user - needs to create profile
//         console.log('🆕 New user, going to profile creation');
//         setUserId(authUserId);
//         setCurrentScreen('profile');
//       }
//     } catch (error) {
//       console.error('Error in loadUserData:', error);
//       setUserId(authUserId);
//       setCurrentScreen('profile');
//     }
//   };

//   const navigateTo = (screen: Screen) => {
//     console.log('🧭 Navigating to:', screen);
//     setCurrentScreen(screen);
//   };

//   const updateProfile = (updates: Partial<UserProfile>) => {
//     console.log('📝 Updating profile with:', updates);
//     setUserProfile(prev => {
//       if (prev) {
//         return { ...prev, ...updates };
//       }
//       return {
//         name: '',
//         age: '',
//         gender: '',
//         pronouns: '',
//         workStudy: '',
//         location: { apartment: '', locality: '', suburb: '', city: '' },
//         personalityAnswers: {},
//         joinedEvents: [],
//         ...updates
//       };
//     });
//   };

//   const saveProfileToBackend = async () => {
//     if (!userProfile) {
//       console.error('❌ No profile to save!');
//       return;
//     }

//     console.log('💾 Saving profile to database...', userProfile);
//     setIsLoading(true);
//     try {
//       const result = await db.createProfile(userProfile);
//       if (result.profile) {
//         console.log('✅ Profile saved successfully!', result.profile);
//         const savedProfile = {
//           id: result.profile.id,
//           email: result.profile.email,
//           name: result.profile.name,
//           age: result.profile.age,
//           gender: result.profile.gender,
//           pronouns: result.profile.pronouns,
//           workStudy: result.profile.work_study,
//           location: {
//             apartment: result.profile.apartment || '',
//             locality: result.profile.locality || '',
//             suburb: result.profile.suburb || '',
//             city: result.profile.city || ''
//           },
//           personalityAnswers: result.profile.personality_answers || {},
//           joinedEvents: result.profile.joined_events || []
//         };
//         setUserProfile(savedProfile);
//         setUserId(result.profile.id);
        
//         console.log('🎉 Redirecting to dashboard');
//         setCurrentScreen(isAdmin ? 'admin' : 'dashboard');
//       } else {
//         console.error('❌ Failed to save profile:', result.error);
//         alert('Failed to save profile: ' + result.error);
//       }
//     } catch (error) {
//       console.error('❌ Error saving profile:', error);
//       alert('Error saving profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAuthSuccess = (authUserId: string, hasProfile: boolean) => {
//     console.log('🔐 Auth success! User ID:', authUserId, 'Has profile:', hasProfile);
//     loadUserData(authUserId);
//   };

//   const handleLogout = async () => {
//     console.log('👋 Logging out...');
//     await auth.signOut();
//     setUserProfile(null);
//     setUserId(null);
//     setIsAdmin(false);
//     setCurrentScreen('landing');
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const renderScreen = () => {
//     switch (currentScreen) {
//       case 'landing':
//         return <LandingPage onNavigate={navigateTo} />;
//       case 'auth':
//         return <AuthPage onNavigate={navigateTo} />;
//       case 'auth-callback':
//         return <AuthCallback onAuthSuccess={handleAuthSuccess} />;
//       case 'profile':
//         return (
//           <ProfileCreation
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onUpdateProfile={updateProfile}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'personality':
//         return (
//           <PersonalityQuestions
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onUpdateProfile={updateProfile}
//             onNavigate={navigateTo}
//             onSaveProfile={saveProfileToBackend}
//           />
//         );
//       case 'confirmation':
//         return (
//           <ConfirmationPage
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onNavigate={navigateTo}
//             onSaveProfile={saveProfileToBackend}
//             isLoading={false}
//           />
//         );
//       case 'events':
//         return (
//           <EventsPage
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onSelectEvent={setSelectedEvent}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'payment':
//         return (
//           <PaymentPage
//             eventId={selectedEvent}
//             userId={userId}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'chat':
//         return (
//           <ChatRoom
//             eventId={selectedEvent}
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'dashboard':
//         return (
//           <UserDashboard
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onNavigate={navigateTo}
//             onLogout={handleLogout}
//           />
//         );
//       case 'admin':
//         return (
//           <AdminDashboard
//             onNavigate={navigateTo}
//             onLogout={handleLogout}
//           />
//         );
//       case 'reset-password':
//         return <ResetPasswordPage onNavigate={navigateTo} />;
//       default:
//         return <LandingPage onNavigate={navigateTo} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
//       {renderScreen()}
//     </div>
//   );
// }































// import React, { useState, useEffect } from 'react';
// import { LandingPage } from './components/LandingPage';
// import { AuthPage } from './components/AuthPage';
// import { AuthCallback } from './components/AuthCallback';
// import { ProfileCreation } from './components/ProfileCreation';
// import { PersonalityQuestions } from './components/PersonalityQuestions';
// import { ConfirmationPage } from './components/ConfirmationPage';
// import { EventsPage } from './components/EventsPage';
// import { PaymentPage } from './components/PaymentPage';
// import { ChatRoom } from './components/ChatRoom';
// import { UserDashboard } from './components/UserDashboard';
// import { AdminDashboard } from './components/AdminDashboard';
// import { ResetPasswordPage } from './components/ResetPasswordPage';
// import { auth, db, analytics, supabase, profileHelpers } from './utils/supabase';
// import { auth, db, analytics, supabase, profileHelpers } from './utils/supabase';
// import { ResetPasswordPage } from './components/ResetPasswordPage'

// export type Screen = 
//   | 'landing'
//   | 'auth'
//   | 'auth-callback'
//   | 'profile'
//   | 'personality'
//   | 'confirmation'
//   | 'events'
//   | 'payment'
//   | 'chat'
//   | 'dashboard'
//   | 'admin'
//   | 'reset-password';

// export type UserProfile = {
//   id?: string;
//   email?: string;
//   name: string;
//   age: string;
//   gender: string;
//   pronouns: string;
//   workStudy: string;
//   location: {
//     apartment: string;
//     locality: string;
//     suburb: string;
//     city: string;
//   };
//   personalityAnswers: Record<string, any>;
//   joinedEvents: string[];
// };

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     console.log('🚀 App starting, checking auth state...');
    
//     const hash = window.location.hash;
//     if (hash && hash.includes('type=recovery')) {
//       console.log('🔑 Password recovery link detected');
//       setCurrentScreen('reset-password');
//       setIsLoading(false);
//       return;
//     }
    
//     checkAuthState();

//     const { data: { subscription } } = auth.onAuthStateChange(async (user) => {
//       console.log('🔄 Auth state changed:', user ? 'User logged in' : 'User logged out');
//       if (user) {
//         const hash = window.location.hash;
//         if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
//           console.log('📧 Email link detected, not auto-redirecting');
//           return;
//         }
//         await loadUserData(user.id);
//       } else {
//         setUserProfile(null);
//         setUserId(null);
//         setIsAdmin(false);
//         setCurrentScreen('landing');
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     const preventBackNavigation = async () => {
//       if (!userId) return;
      
//       try {
//         const { isFullyComplete } = await profileHelpers.getCompleteProfile(userId);
        
//         if (isFullyComplete) {
//           if (currentScreen === 'profile' || 
//               currentScreen === 'personality' || 
//               currentScreen === 'confirmation') {
//             console.log('⚠️ Profile complete! Redirecting to dashboard from:', currentScreen);
//             setCurrentScreen(isAdmin ? 'admin' : 'events');
//           }
//         }
//       } catch (error) {
//         console.error('Error checking profile:', error);
//       }
//     };

//     preventBackNavigation();
//   }, [userId, currentScreen, isAdmin]);

//   useEffect(() => {
//     const trackPageView = () => {
//       const pageName = currentScreen;
//       analytics.trackVisit(pageName, userId || undefined);
//       console.log('📊 Analytics: Page visit tracked -', pageName);
//     };

//     trackPageView();
//   }, [currentScreen, userId]);

//   const checkAuthState = async () => {
//     setIsLoading(true);
//     try {
//       const { user } = await auth.getCurrentUser();
      
//       console.log('👤 Current user:', user ? user.email : 'No user');
      
//       if (user) {
//         await loadUserData(user.id);
//       } else {
//         console.log('⚠️ No authenticated user found');
//         setCurrentScreen('landing');
//       }
//     } catch (error) {
//       console.error('Error checking auth state:', error);
//       setCurrentScreen('landing');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadUserData = async (authUserId: string) => {
//     console.log('📥 Loading user data for:', authUserId);
    
//     try {
//       const adminStatus = await auth.isAdmin();
//       setIsAdmin(adminStatus);
//       console.log('👮 Is admin:', adminStatus);

//       const { profile, isComplete, needsPersonality, isFullyComplete } = 
//         await profileHelpers.getCompleteProfile(authUserId);

//       if (!profile) {
//         console.log('🆕 New user - going to profile creation');
//         setUserId(authUserId);
//         setCurrentScreen('profile');
//         return;
//       }

//       if (isFullyComplete) {
//         const loadedProfile = {
//           id: profile.id,
//           email: profile.email,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns || '',
//           workStudy: profile.work_study || '',
//           location: {
//             apartment: profile.apartment || '',
//             locality: profile.locality || '',
//             suburb: profile.suburb || '',
//             city: profile.city || ''
//           },
//           personalityAnswers: profile.personality_answers || {},
//           joinedEvents: profile.joined_events || []
//         };
        
//         setUserProfile(loadedProfile);
//         setUserId(profile.id);
//         setCurrentScreen(adminStatus ? 'admin' : 'events');
//         console.log('✅ Complete profile - going to dashboard');
//         return;
//       }

//       setUserId(authUserId);
      
//       if (!isComplete) {
//         console.log('⚠️ Profile incomplete');
//         setCurrentScreen('profile');
//       } else if (needsPersonality) {
//         console.log('⚠️ Needs personality answers');
//         setUserProfile({
//           id: profile.id,
//           email: profile.email,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           pronouns: profile.pronouns || '',
//           workStudy: profile.work_study || '',
//           location: {
//             apartment: profile.apartment || '',
//             locality: profile.locality || '',
//             suburb: profile.suburb || '',
//             city: profile.city || ''
//           },
//           personalityAnswers: {},
//           joinedEvents: profile.joined_events || []
//         });
//         setCurrentScreen('personality');
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//       setUserId(authUserId);
//       setCurrentScreen('profile');
//     }
//   };

//   const navigateTo = (screen: Screen) => {
//     console.log('🧭 Navigating to:', screen);
//     setCurrentScreen(screen);
//   };

//   const updateProfile = (updates: Partial<UserProfile>) => {
//     console.log('📝 Updating profile with:', updates);
//     setUserProfile(prev => {
//       if (prev) {
//         return { ...prev, ...updates };
//       }
//       return {
//         name: '',
//         age: '',
//         gender: '',
//         pronouns: '',
//         workStudy: '',
//         location: { apartment: '', locality: '', suburb: '', city: '' },
//         personalityAnswers: {},
//         joinedEvents: [],
//         ...updates
//       };
//     });
//   };

//   const saveProfileToBackend = async () => {
//     if (!userProfile) {
//       console.error('❌ No profile to save!');
//       return;
//     }

//     console.log('💾 Saving profile to database...', userProfile);
//     setIsLoading(true);
//     try {
//       const result = await db.createProfile(userProfile);
//       if (result.profile) {
//         console.log('✅ Profile saved successfully!', result.profile);
//         const savedProfile = {
//           id: result.profile.id,
//           email: result.profile.email,
//           name: result.profile.name,
//           age: result.profile.age,
//           gender: result.profile.gender,
//           pronouns: result.profile.pronouns,
//           workStudy: result.profile.work_study,
//           location: {
//             apartment: result.profile.apartment || '',
//             locality: result.profile.locality || '',
//             suburb: result.profile.suburb || '',
//             city: result.profile.city || ''
//           },
//           personalityAnswers: result.profile.personality_answers || {},
//           joinedEvents: result.profile.joined_events || []
//         };
//         setUserProfile(savedProfile);
//         setUserId(result.profile.id);
        
//         console.log('🎉 Redirecting to dashboard');
//         setCurrentScreen(isAdmin ? 'admin' : 'dashboard');
//       } else {
//         console.error('❌ Failed to save profile:', result.error);
//         alert('Failed to save profile: ' + result.error);
//       }
//     } catch (error) {
//       console.error('❌ Error saving profile:', error);
//       alert('Error saving profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAuthSuccess = (authUserId: string, hasProfile: boolean) => {
//     console.log('🔐 Auth success! User ID:', authUserId, 'Has profile:', hasProfile);
//     loadUserData(authUserId);
//   };

//   const handleLogout = async () => {
//     console.log('👋 Logging out...');
//     await auth.signOut();
//     setUserProfile(null);
//     setUserId(null);
//     setIsAdmin(false);
//     setCurrentScreen('landing');
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const renderScreen = () => {
//     switch (currentScreen) {
//       case 'landing':
//         return <LandingPage onNavigate={navigateTo} />;
//       case 'auth':
//         return <AuthPage onNavigate={navigateTo} />;
//       case 'auth-callback':
//         return <AuthCallback onAuthSuccess={handleAuthSuccess} />;
//       case 'profile':
//         return (
//           <ProfileCreation
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onUpdateProfile={updateProfile}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'personality':
//         return (
//           <PersonalityQuestions
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onUpdateProfile={updateProfile}
//             onNavigate={navigateTo}
//             onSaveProfile={saveProfileToBackend}
//           />
//         );
//       case 'confirmation':
//         return (
//           <ConfirmationPage
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             onNavigate={navigateTo}
//             onSaveProfile={saveProfileToBackend}
//             isLoading={false}
//           />
//         );
//       case 'events':
//         return (
//           <EventsPage
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onSelectEvent={setSelectedEvent}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'payment':
//         return (
//           <PaymentPage
//             eventId={selectedEvent}
//             userId={userId}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'chat':
//         return (
//           <ChatRoom
//             eventId={selectedEvent}
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onNavigate={navigateTo}
//           />
//         );
//       case 'dashboard':
//         return (
//           <UserDashboard
//             profile={userProfile || {
//               name: '',
//               age: '',
//               gender: '',
//               pronouns: '',
//               workStudy: '',
//               location: {
//                 apartment: '',
//                 locality: '',
//                 suburb: '',
//                 city: ''
//               },
//               personalityAnswers: {},
//               joinedEvents: []
//             }}
//             userId={userId}
//             onNavigate={navigateTo}
//             onLogout={handleLogout}
//           />
//         );
//       case 'admin':
//         return (
//           <AdminDashboard
//             onNavigate={navigateTo}
//             onLogout={handleLogout}
//           />
//         );
//       case 'reset-password':
//         return <ResetPasswordPage onNavigate={navigateTo} />;
//       default:
//         return <LandingPage onNavigate={navigateTo} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
//       {renderScreen()}
//     </div>
//   );
// }






























import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { AuthCallback } from './components/AuthCallback';
import { ProfileCreation } from './components/ProfileCreation';
//import { PersonalityQuestions } from './components/PersonalityQuestions';
import PersonalityQuestions from './components/PersonalityQuestions';
import { ConfirmationPage } from './components/ConfirmationPage';
import { EventsPage } from './components/EventsPage';
import { PaymentPage } from './components/PaymentPage';
import { ChatRoom } from './components/ChatRoom';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { FixedLogo } from './components/FixedLogo';
import { auth, db, analytics, supabase, profileHelpers } from './utils/supabase';

export type Screen = 
  | 'landing'
  | 'auth'
  | 'auth-callback'
  | 'profile'
  | 'personality'
  | 'confirmation'
  | 'events'
  | 'payment'
  | 'chat'
  | 'dashboard'
  | 'admin'
  | 'reset-password';

export type UserProfile = {
  id?: string;
  email?: string;
  name: string;
  age: string;
  gender: string;
  pronouns: string;
  workStudy: string;
  photoUrl?: string;
  location: {
    apartment: string;
    locality: string;
    suburb: string;
    city: string;
  };
  personalityAnswers: Record<string, any>;
  joinedEvents: string[];
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null); // Track auth user ID separately
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 App starting, checking auth state...');
    
    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Loading timeout - showing landing page');
      setIsLoading(false);
      setCurrentScreen('landing');
    }, 5000); // 5 second timeout
    
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      console.log('🔑 Password recovery link detected');
      setCurrentScreen('reset-password');
      setIsLoading(false);
      clearTimeout(loadingTimeout);
      return;
    }
    
    // Wrap in try-catch to handle Supabase initialization errors
    try {
      checkAuthState().finally(() => {
        clearTimeout(loadingTimeout);
      });

    const { data: { subscription } } = auth.onAuthStateChange(async (user) => {
      console.log('🔄 Auth state changed:', user ? 'User logged in' : 'User logged out');
      if (user) {
        const hash = window.location.hash;
        if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
          console.log('📧 Email link detected, not auto-redirecting');
          return;
        }
        await loadUserData(user.id);
      } else {
        setUserProfile(null);
        setUserId(null);
        setIsAdmin(false);
        setCurrentScreen('landing');
      }
    });

      return () => {
        clearTimeout(loadingTimeout);
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      clearTimeout(loadingTimeout);
      // If Supabase fails, just show landing page
      setCurrentScreen('landing');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const preventBackNavigation = async () => {
      // Use authUserId if available, otherwise userId (for backwards compatibility)
      const userIdToCheck = authUserId || userId;
      if (!userIdToCheck) return;
      
      try {
        // If user is admin, always redirect to admin dashboard if they try to access profile/personality
        if (isAdmin) {
          if (currentScreen === 'profile' || 
              currentScreen === 'personality' || 
              currentScreen === 'confirmation' ||
              currentScreen === 'events') {
            console.log('⚠️ Admin user detected! Redirecting to admin dashboard from:', currentScreen);
            setCurrentScreen('admin');
            return;
          }
        }
        
        // For non-admin users, check if profile is complete
        // Use authUserId for profile lookup (getCompleteProfile expects auth_user_id)
        const userIdForProfileCheck = authUserId || userIdToCheck;
        const { isFullyComplete } = await profileHelpers.getCompleteProfile(userIdForProfileCheck);
        
        if (isFullyComplete) {
          if (currentScreen === 'profile' || 
              currentScreen === 'personality' || 
              currentScreen === 'confirmation') {
            console.log('⚠️ Profile complete! Redirecting to events from:', currentScreen);
            setCurrentScreen('events');
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    preventBackNavigation();
  }, [userId, authUserId, currentScreen, isAdmin]);

  // ============================================
  // ANALYTICS TRACKING - UPDATED TO FIX "0 VISITS"
  // ============================================
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Track with existing analytics utility (if it exists)
        if (analytics && analytics.trackVisit) {
          const pageName = currentScreen;
          analytics.trackVisit(pageName, userId || undefined);
        }
        
        // CRITICAL: Also track directly to Supabase analytics table
        // This ensures visits are always counted
        const { error: analyticsError } = await supabase
          .from('analytics')
          .insert({
            user_id: userId || null,
            event_type: 'page_view',
            page_name: currentScreen
          });
        
        // Silently ignore errors - analytics is optional and shouldn't break the app
        if (analyticsError) {
          // Only log if it's not a "table doesn't exist" or RLS error
          if (!analyticsError.message?.includes('row-level security') && 
              !analyticsError.message?.includes('relation') && 
              !analyticsError.message?.includes('does not exist')) {
            console.warn('Analytics tracking warning (non-critical):', analyticsError.message);
          }
        } else {
        console.log('📊 Analytics: Page view tracked -', currentScreen);
        }
      } catch (error: any) {
        // Silently ignore - analytics is optional
        if (error?.message && 
            !error.message.includes('row-level security') && 
            !error.message.includes('relation') && 
            !error.message.includes('does not exist')) {
          console.warn('Analytics tracking error (non-critical):', error.message);
        }
      }
    };

    trackPageView();
  }, [currentScreen, userId]);
  // ============================================

  const checkAuthState = async () => {
    setIsLoading(true);
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE') || supabaseUrl.includes('placeholder')) {
        console.warn('⚠️ Supabase not configured - showing landing page without auth');
        setCurrentScreen('landing');
        setIsLoading(false);
        return;
      }
      
      const { user } = await auth.getCurrentUser();
      
      console.log('👤 Current user:', user ? user.email : 'No user');
      
      if (user) {
        await loadUserData(user.id);
      } else {
        console.log('⚠️ No authenticated user found');
        setCurrentScreen('landing');
      }
    } catch (error: any) {
      console.error('Error checking auth state:', error);
      // If Supabase is not configured, just show landing page
      if (error?.message?.includes('YOUR_SUPABASE') || error?.message?.includes('placeholder')) {
        console.warn('⚠️ Supabase not configured - showing landing page');
      }
      setCurrentScreen('landing');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (authUserId: string) => {
    console.log('📥 Loading user data for:', authUserId);
    
    try {
      // CRITICAL: Check admin status FIRST - before any other operations
      console.log('🔍 Checking admin status first...');
      const adminStatus = await auth.isAdmin();
      setIsAdmin(adminStatus);
      console.log('👮 Admin check result:', adminStatus);

      // If user is admin, IMMEDIATELY go to admin dashboard - NO profile checks
      if (adminStatus) {
        console.log('✅ ADMIN DETECTED - Bypassing ALL profile checks, going directly to admin dashboard');
        setAuthUserId(authUserId);
        setUserId(authUserId);
        setCurrentScreen('admin');
        console.log('🎯 Admin dashboard set as current screen');
        return; // CRITICAL: Exit function here
      }

      console.log('👤 Regular user - proceeding with profile checks...');

      // For non-admin users, check profile status
      const { profile, isComplete, needsPersonality, isFullyComplete } = 
        await profileHelpers.getCompleteProfile(authUserId);

      if (!profile) {
        console.log('🆕 New user - going to profile creation');
        setAuthUserId(authUserId);
        setUserId(authUserId);
        setCurrentScreen('profile');
        return;
      }

      if (isFullyComplete) {
        const loadedProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          pronouns: profile.pronouns || '',
          workStudy: profile.work_study || '',
          photoUrl: profile.photo_url || undefined,
          location: {
            apartment: profile.apartment || '',
            locality: profile.locality || '',
            suburb: profile.suburb || '',
            city: profile.city || ''
          },
          personalityAnswers: profile.personality_answers || {},
          joinedEvents: profile.joined_events || []
        };
        
        setUserProfile(loadedProfile);
        setAuthUserId(authUserId); // Keep authUserId for profile lookups
        setUserId(profile.id); // Use profile.id for events/other operations
        setCurrentScreen('events');
        console.log('✅ Complete profile - going to events', {
          profileId: profile.id,
          authUserId: authUserId,
          personalityAnswersCount: Object.keys(loadedProfile.personalityAnswers).length
        });
        return;
      }

      setAuthUserId(authUserId);
      setUserId(authUserId);
      
      if (!isComplete) {
        console.log('⚠️ Profile incomplete');
        setCurrentScreen('profile');
      } else if (needsPersonality) {
        console.log('⚠️ Profile complete but needs personality answers');
        console.log('📝 Existing personality answers:', profile.personality_answers);
        
        // Load existing personality answers if any, don't reset to empty
        const existingAnswers = profile.personality_answers || {};
        const loadedProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          pronouns: profile.pronouns || '',
          workStudy: profile.work_study || '',
          photoUrl: profile.photo_url || undefined,
          location: {
            apartment: profile.apartment || '',
            locality: profile.locality || '',
            suburb: profile.suburb || '',
            city: profile.city || ''
          },
          personalityAnswers: existingAnswers, // Preserve existing answers
          joinedEvents: profile.joined_events || []
        };
        
        setUserProfile(loadedProfile);
        setCurrentScreen('personality');
        
        console.log('🔄 Set personality screen with existing answers:', {
          answerCount: Object.keys(existingAnswers).length,
          answerKeys: Object.keys(existingAnswers)
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthUserId(authUserId);
      setUserId(authUserId);
      // If error occurs but user is admin, still try to go to admin dashboard
      const adminStatus = await auth.isAdmin();
      if (adminStatus) {
        setIsAdmin(true);
        setCurrentScreen('admin');
      } else {
      setCurrentScreen('profile');
      }
    }
  };

  const navigateTo = (screen: Screen) => {
    console.log('🧭 Navigating to:', screen);
    setCurrentScreen(screen);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    console.log('📝 Updating profile with:', updates);
    
    // Special logging for personality answers
    if (updates.personalityAnswers) {
      console.log('🧠 Personality answers being updated:', {
        answerCount: Object.keys(updates.personalityAnswers).length,
        answerKeys: Object.keys(updates.personalityAnswers),
        sampleAnswers: Object.entries(updates.personalityAnswers).slice(0, 3)
      });
    }
    
    setUserProfile(prev => {
      const updated = prev ? { ...prev, ...updates } : {
        name: '',
        age: '',
        gender: '',
        pronouns: '',
        workStudy: '',
        location: { apartment: '', locality: '', suburb: '', city: '' },
        personalityAnswers: {},
        joinedEvents: [],
        ...updates
      };
      
      console.log('📋 Profile state updated:', {
        hasPersonalityAnswers: !!updated.personalityAnswers,
        personalityAnswerCount: updated.personalityAnswers ? Object.keys(updated.personalityAnswers).length : 0
      });
      
      return updated;
    });
  };

  const saveProfileToBackend = async () => {
    if (!userProfile) {
      console.error('❌ No profile to save!');
      return;
    }

    // Log personality answers being saved
    const personalityAnswerCount = userProfile.personalityAnswers 
      ? Object.keys(userProfile.personalityAnswers).length 
      : 0;
    
    console.log('💾 Saving profile to database...', {
      hasPersonalityAnswers: !!userProfile.personalityAnswers,
      answerCount: personalityAnswerCount,
      answerKeys: userProfile.personalityAnswers ? Object.keys(userProfile.personalityAnswers) : [],
      sampleAnswers: userProfile.personalityAnswers ? Object.entries(userProfile.personalityAnswers).slice(0, 3) : []
    });
    
    // CRITICAL: Verify we have personality answers before saving
    if (!userProfile.personalityAnswers || Object.keys(userProfile.personalityAnswers).length === 0) {
      console.warn('⚠️ WARNING: No personality answers in userProfile! This might cause empty answers to be saved.');
      console.warn('⚠️ Current userProfile:', {
        name: userProfile.name,
        email: userProfile.email,
        personalityAnswers: userProfile.personalityAnswers
      });
    }

    setIsLoading(true);
    try {
      const result = await db.createProfile(userProfile);
      if (result.profile) {
        console.log('✅ Profile saved successfully!', {
          profileId: result.profile.id,
          savedPersonalityAnswers: result.profile.personality_answers 
            ? Object.keys(result.profile.personality_answers).length 
            : 0
        });
        
        const savedProfile = {
          id: result.profile.id,
          email: result.profile.email,
          name: result.profile.name,
          age: result.profile.age,
          gender: result.profile.gender,
          pronouns: result.profile.pronouns,
          workStudy: result.profile.work_study,
          photoUrl: result.profile.photo_url || undefined,
          location: {
            apartment: result.profile.apartment || '',
            locality: result.profile.locality || '',
            suburb: result.profile.suburb || '',
            city: result.profile.city || ''
          },
          personalityAnswers: result.profile.personality_answers || {},
          joinedEvents: result.profile.joined_events || []
        };
        
        // Verify personality answers were saved
        const savedAnswerCount = Object.keys(savedProfile.personalityAnswers).length;
        console.log('✅ Profile loaded from DB:', {
          savedAnswerCount,
          answerKeys: Object.keys(savedProfile.personalityAnswers)
        });
        
        setUserProfile(savedProfile);
        setUserId(result.profile.id);
        
        console.log('🎉 Redirecting to dashboard');
        setCurrentScreen(isAdmin ? 'admin' : 'events');
      } else {
        console.error('❌ Failed to save profile:', result.error);
        alert('Failed to save profile: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (authUserId: string, hasProfile: boolean) => {
    console.log('🔐 Auth success! User ID:', authUserId, 'Has profile:', hasProfile);
    loadUserData(authUserId);
  };

  const handleLogout = async () => {
    console.log('👋 Logging out...');
    await auth.signOut();
    setUserProfile(null);
    setUserId(null);
    setAuthUserId(null);
    setIsAdmin(false);
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return (
      <div className="kismat-shell">
        <div className="kismat-screen">
          <div className="kismat-panel kismat-panel--narrow text-center space-y-4">
            <div className="kismat-loader mx-auto" />
            <p className="text-sm text-[var(--kismat-muted)]">
              Warming up the experience for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    // CRITICAL: If user is admin, always show admin dashboard (except for landing/auth/reset-password)
    // The useEffect hook will handle redirecting, but this ensures we don't render profile pages for admins
    if (isAdmin && (currentScreen === 'profile' || currentScreen === 'personality' || currentScreen === 'confirmation' || currentScreen === 'events')) {
      return <AdminDashboard onNavigate={navigateTo} onLogout={handleLogout} />;
    }
    
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      
      case 'auth':
        return <AuthPage onNavigate={navigateTo} />;
      
      case 'auth-callback':
        return <AuthCallback onAuthSuccess={handleAuthSuccess} />;
      
      case 'profile':
        return (
          <ProfileCreation
            profile={userProfile || {
              name: '',
              age: '',
              gender: '',
              pronouns: '',
              workStudy: '',
              location: {
                apartment: '',
                locality: '',
                suburb: '',
                city: ''
              },
              personalityAnswers: {},
              joinedEvents: []
            }}
            onUpdateProfile={updateProfile}
            onNavigate={navigateTo}
          />
        );
      
      case 'personality':
        return (
          <PersonalityQuestions
            profile={userProfile || {
              name: '',
              age: '',
              gender: '',
              pronouns: '',
              workStudy: '',
              location: {
                apartment: '',
                locality: '',
                suburb: '',
                city: ''
              },
              personalityAnswers: {},
              joinedEvents: []
            }}
            onUpdateProfile={updateProfile}
            onNavigate={navigateTo}
            onSaveProfile={async () => {
              // Ensure we wait for state update, then save
              await new Promise(resolve => setTimeout(resolve, 150));
              await saveProfileToBackend();
            }}
          />
        );
      
      case 'confirmation':
        return (
          <ConfirmationPage
            profile={userProfile || {
              name: '',
              age: '',
              gender: '',
              pronouns: '',
              workStudy: '',
              location: {
                apartment: '',
                locality: '',
                suburb: '',
                city: ''
              },
              personalityAnswers: {},
              joinedEvents: []
            }}
            onNavigate={navigateTo}
            onSaveProfile={saveProfileToBackend}
            isLoading={false}
          />
        );
      
      case 'events':
        return (
          <EventsPage
            profile={userProfile || {
              name: '',
              age: '',
              gender: '',
              pronouns: '',
              workStudy: '',
              location: {
                apartment: '',
                locality: '',
                suburb: '',
                city: ''
              },
              personalityAnswers: {},
              joinedEvents: []
            }}
            userId={userId}
            onSelectEvent={setSelectedEvent}
            onNavigate={navigateTo}
          />
        );
      
      case 'payment':
        return (
          <PaymentPage
            eventId={selectedEvent}
            userId={userId}
            onNavigate={navigateTo}
            onBack={() => navigateTo('events')}
          />
        );
      
      case 'chat':
        return (
          <ChatRoom
            eventId={selectedEvent}
            profile={userProfile || {
              name: '',
              age: '',
              gender: '',
              pronouns: '',
              workStudy: '',
              location: {
                apartment: '',
                locality: '',
                suburb: '',
                city: ''
              },
              personalityAnswers: {},
              joinedEvents: []
            }}
            userId={userId}
            onNavigate={navigateTo}
          />
        );
      
      case 'dashboard':
        return (
          <UserDashboard
            profile={userProfile || {
              name: '',
              age: '',
              gender: '',
              pronouns: '',
              workStudy: '',
              location: {
                apartment: '',
                locality: '',
                suburb: '',
                city: ''
              },
              personalityAnswers: {},
              joinedEvents: []
            }}
            userId={userId}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      
      case 'admin':
        return (
          <AdminDashboard
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      
      case 'reset-password':
        return <ResetPasswordPage onNavigate={navigateTo} />;
      
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="kismat-shell">
      <FixedLogo />
      {renderScreen()}
    </div>
  );
}