// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { UserProfile } from '../App';
// import { Camera, MapPin, Calendar, Users, Settings, Upload, LogOut } from 'lucide-react';
// import { db } from '../utils/supabase';

// interface UserDashboardProps {
//   profile: UserProfile;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
//   onLogout: () => void;
// }

// export function UserDashboard({ profile, userId, onNavigate, onLogout }: UserDashboardProps) {
//   const [uploadedSelfie, setUploadedSelfie] = useState(false);
//   const [userEvents, setUserEvents] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Load user's events
//   useEffect(() => {
//     if (userId) {
//       loadUserEvents();
//     }
//   }, [userId]);

//   const loadUserEvents = async () => {
//     if (!userId) return;
    
//     setIsLoading(true);
//     try {
//       //const result = await apiClient.getUserEvents(userId);
//       const result = await db.getUserEvents(userId);
//       if (result.success && result.events) {
//         setUserEvents(result.events);
//       } else {
//         console.error('Failed to load user events:', result.error);
//       }
//     } catch (error) {
//       console.error('Error loading user events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelfieUpload = () => {
//     // Simulate selfie upload
//     setUploadedSelfie(true);
//   };

//   const mockEvents = [
//     {
//       id: 'bowling-friday',
//       title: 'Bowling Night',
//       date: 'Friday, 7:00 PM',
//       location: 'Shott Mumbai',
//       status: 'upcoming',
//       participants: 3,
//       refundStatus: 'pending'
//     },
//     {
//       id: 'dinner-last-week',
//       title: 'Coffee & Chat',
//       date: 'Last Saturday, 4:00 PM',
//       location: 'Blue Tokai, Bandra',
//       status: 'completed',
//       participants: 4,
//       refundStatus: 'completed'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="bg-black text-white px-6 py-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Avatar className="w-16 h-16">
//               <AvatarFallback className="bg-gray-700 text-white text-xl">
//                 {profile.name.charAt(0)}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h1 className="text-xl">Welcome back, {profile.name}!</h1>
//               <p className="text-gray-300 text-sm">{profile.location.city}</p>
//             </div>
//           </div>
//           <Button
//             onClick={onLogout}
//             variant="outline"
//             size="sm"
//             className="text-white border-gray-600 hover:bg-gray-800"
//           >
//             <LogOut className="w-4 h-4 mr-2" />
//             Logout
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6">
//         <Tabs defaultValue="events" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="events">My Events</TabsTrigger>
//             <TabsTrigger value="profile">Profile</TabsTrigger>
//             <TabsTrigger value="refunds">Refunds</TabsTrigger>
//           </TabsList>

//           <TabsContent value="events" className="space-y-4 mt-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg">Your Events</h2>
//               <Button
//                 onClick={() => onNavigate('events')}
//                 className="bg-black text-white hover:bg-gray-800"
//               >
//                 Find Events
//               </Button>
//             </div>

//             {isLoading ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">Loading your events...</p>
//               </div>
//             ) : userEvents.length === 0 ? (
//               <Card className="border-gray-200 border-dashed">
//                 <CardContent className="p-8 text-center">
//                   <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg text-gray-600 mb-2">No events yet</h3>
//                   <p className="text-sm text-gray-500 mb-4">
//                     Join your first event to start meeting amazing people!
//                   </p>
//                   <Button
//                     onClick={() => onNavigate('events')}
//                     className="bg-black text-white hover:bg-gray-800"
//                   >
//                     Explore Events
//                   </Button>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-4">
//                 {userEvents.map((event) => {
//                   // Determine if event is upcoming or completed based on current date
//                   const today = new Date();
//                   let eventDate = new Date();
                  
//                   // Try to parse the event date (this is a simple implementation)
//                   if (event.date && event.date !== 'TBD') {
//                     // For demo purposes, assume all events are upcoming
//                     // In a real app, you'd have proper date handling
//                   }
                  
//                   const isUpcoming = true; // Simplification for demo
                  
//                   return (
//                     <Card key={event.id} className="border-gray-200">
//                       <CardContent className="p-4">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <h3 className="text-lg">{event.title}</h3>
//                             <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
//                               <div className="flex items-center space-x-1">
//                                 <Calendar className="w-4 h-4" />
//                                 <span>{event.time} {event.date}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <MapPin className="w-4 h-4" />
//                                 <span>{event.location}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Users className="w-4 h-4" />
//                                 <span>{event.participants.length} people</span>
//                               </div>
//                             </div>
//                           </div>
//                           <Badge 
//                             variant={isUpcoming ? 'default' : 'secondary'}
//                           >
//                             {isUpcoming ? 'upcoming' : 'completed'}
//                           </Badge>
//                         </div>

//                         {isUpcoming && (
//                           <div className="mt-3 flex space-x-2">
//                             <Button
//                               onClick={() => {
//                                 window.sessionStorage.setItem('selectedEvent', event.id);
//                                 onNavigate('chat');
//                               }}
//                               variant="outline"
//                               size="sm"
//                             >
//                               Chat Room
//                             </Button>
//                             <Button variant="outline" size="sm">
//                               Event Details
//                             </Button>
//                           </div>
//                         )}

//                         {!isUpcoming && (
//                           <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
//                             <p className="text-sm text-yellow-800 mb-2">
//                               Upload a selfie from the event to get your ₹{event.price} refund
//                             </p>
//                             <Button
//                               onClick={handleSelfieUpload}
//                               size="sm"
//                               className="bg-yellow-600 text-white hover:bg-yellow-700"
//                             >
//                               <Camera className="w-4 h-4 mr-2" />
//                               Upload Selfie
//                             </Button>
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}


//           </TabsContent>

//           <TabsContent value="profile" className="space-y-4 mt-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg">Your Profile</h2>
//               <Button variant="outline" size="sm">
//                 <Settings className="w-4 h-4 mr-2" />
//                 Edit
//               </Button>
//             </div>

//             <Card className="border-gray-200">
//               <CardHeader>
//                 <CardTitle>Personal Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span className="text-gray-600">Name:</span>
//                     <p>{profile.name}</p>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Age:</span>
//                     <p>{profile.age}</p>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Gender:</span>
//                     <p>{profile.gender}</p>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Pronouns:</span>
//                     <p>{profile.pronouns || 'Not specified'}</p>
//                   </div>
//                 </div>
//                 <div className="text-sm">
//                   <span className="text-gray-600">Work/Study:</span>
//                   <p>{profile.workStudy}</p>
//                 </div>
//                 <div className="text-sm">
//                   <span className="text-gray-600">Location:</span>
//                   <p>{profile.location.locality}, {profile.location.suburb}, {profile.location.city}</p>
//                 </div>
//                 {/* ADD THE BUTTON HERE - right before closing CardContent */}
//                 <div className="pt-3 border-t">
//                   <Button 
//                     variant="outline" 
//                     size="sm"
//                     onClick={() => onNavigate('profile')}
//                     className="w-full"
//                   >
//                     <Settings className="w-4 h-4 mr-2" />
//                     Edit Profile
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>


//           </TabsContent>

//           <TabsContent value="refunds" className="space-y-4 mt-6">
//             <h2 className="text-lg">Refund Status</h2>

//             <Card className="border-gray-200">
//               <CardHeader>
//                 <CardTitle className="text-lg">How Refunds Work</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 text-sm">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">1</div>
//                   <div>
//                     <p><strong>Pay ₹100 to book event</strong></p>
//                     <p className="text-gray-600">This is a refundable security deposit</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">2</div>
//                   <div>
//                     <p><strong>Attend the event</strong></p>
//                     <p className="text-gray-600">Have fun and meet new people!</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">3</div>
//                   <div>
//                     <p><strong>Upload verification selfie</strong></p>
//                     <p className="text-gray-600">Take a selfie at the event to verify attendance</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">✓</div>
//                   <div>
//                     <p><strong>Get full refund</strong></p>
//                     <p className="text-gray-600">₹100 returned within 24 hours</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {uploadedSelfie && (
//               <Card className="border-green-200 bg-green-50">
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
//                       <Camera className="w-4 h-4 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-green-800">
//                         <strong>Selfie uploaded successfully!</strong>
//                       </p>
//                       <p className="text-xs text-green-600">
//                         Your refund will be processed within 24 hours.
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }



















import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserProfile } from '../App';
import { Camera, MapPin, Calendar, Users, Settings, Upload, LogOut } from 'lucide-react';
import { db } from '../utils/supabase';

interface UserDashboardProps {
  profile: UserProfile;
  userId: string | null;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function UserDashboard({ profile, userId, onNavigate, onLogout }: UserDashboardProps) {
  const [uploadedSelfie, setUploadedSelfie] = useState(false);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's events
  useEffect(() => {
    if (userId) {
      loadUserEvents();
    }
  }, [userId]);

  const loadUserEvents = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const result = await db.getUserEvents(userId);
      if (result.events) {
        setUserEvents(result.events);
      } else {
        console.error('Failed to load user events:', result.error);
      }
    } catch (error) {
      console.error('Error loading user events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelfieUpload = () => {
    // Simulate selfie upload
    setUploadedSelfie(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gray-700 text-white text-xl">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl">Welcome back, {profile.name}!</h1>
              <p className="text-gray-300 text-sm">{profile.location.city}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="text-white border-gray-600 hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="refunds">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg">Your Events</h2>
              <Button
                onClick={() => onNavigate('events')}
                className="bg-black text-white hover:bg-gray-800"
              >
                Find Events
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading your events...</p>
              </div>
            ) : userEvents.length === 0 ? (
              <Card className="border-gray-200 border-dashed">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-600 mb-2">No events yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Join your first event to start meeting amazing people!
                  </p>
                  <Button
                    onClick={() => onNavigate('events')}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Explore Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userEvents.map((event) => {
                  const isUpcoming = true; // Simplification for demo
                  
                  return (
                    <Card key={event.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg">{event.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{event.time} {event.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{event.participants?.length || 0} people</span>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={isUpcoming ? 'default' : 'secondary'}
                          >
                            {isUpcoming ? 'upcoming' : 'completed'}
                          </Badge>
                        </div>

                        {isUpcoming && (
                          <div className="mt-3 flex space-x-2">
                            <Button
                              onClick={() => {
                                onNavigate('chat');
                              }}
                              variant="outline"
                              size="sm"
                            >
                              Chat Room
                            </Button>
                            <Button variant="outline" size="sm">
                              Event Details
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg">Your Profile</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate('profile')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <p>{profile.age}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gender:</span>
                    <p>{profile.gender}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Pronouns:</span>
                    <p>{profile.pronouns || 'Not specified'}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Work/Study:</span>
                  <p>{profile.workStudy}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Location:</span>
                  <p>{profile.location.locality}, {profile.location.suburb}, {profile.location.city}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UPDATED REFUNDS TAB */}
          <TabsContent value="refunds" className="space-y-4 mt-6">
            <h2 className="text-lg">Platform Fee Policy</h2>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">How Platform Fees Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">💰 For Event Joiners (₹100)</p>
                  <p className="text-blue-800">
                    When you join an event, you pay ₹100 platform fee. This is <strong>NON-REFUNDABLE</strong> and helps us maintain and improve Kismat.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold mb-2">🔄 For Event Creators</p>
                  <p className="text-green-800">
                    When you create an event, you pay ₹100 per person in your group. This fee is <strong>REFUNDABLE</strong> if NO ONE joins your event by the scheduled time.
                  </p>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-700 font-semibold mb-2">Why we charge platform fees:</p>
                  <ul className="text-gray-600 space-y-1 text-xs">
                    <li>✓ Maintain and improve the Kismat app</li>
                    <li>✓ Ensure quality events and user verification</li>
                    <li>✓ Cover operational costs (servers, support, safety)</li>
                    <li>✓ Keep building amazing features for you</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {uploadedSelfie && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-800">
                        <strong>Selfie uploaded successfully!</strong>
                      </p>
                      <p className="text-xs text-green-600">
                        Your refund will be processed within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}