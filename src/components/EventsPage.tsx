

// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { UserProfile } from '../App';
// import { MapPin, Clock, Users, MessageCircle, Upload } from 'lucide-react';
// import { db } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   spots_left: number;
//   total_spots: number;
//   participants: string[];
//   price: number;
//   category: string;
//   description: string;
//   created_by?: string;
//   event_filled?: boolean;
//   min_participants?: number;
//   creator_paid?: boolean;
//   city?: string;
//   image_url?: string;
// }

// export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
//   const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
//   const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
//   const [eventImage, setEventImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '',
//     eventType: '',
//     location: '',
//     peopleCount: '',
//     date: '',
//     time: '',
//     price: 150,
//     description: ''
//   });

//   useEffect(() => {
//     console.log('👤 EventsPage loaded with profile:', {
//       name: profile.name,
//       gender: profile.gender,
//       city: profile.location.city,
//       userId: userId
//     });
//     loadEvents();
//     loadUserPaidEvents();
    
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         console.log('👁️ Page visible again - reloading events');
//         loadUserPaidEvents();
//       }
//     };
    
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [userId]);

//   const parseEventDate = (dateString: string): Date | null => {
//     try {
//       // Format: "5 Dec 2025" or "12 Jan 2026"
//       const months: { [key: string]: number } = {
//         'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
//         'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
//       };
      
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return null;
      
//       const day = parseInt(parts[0]);
//       const month = months[parts[1]];
//       const year = parseInt(parts[2]);
      
//       if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
//       const date = new Date(year, month, day);
//       date.setHours(0, 0, 0, 0);
//       return date;
//     } catch (error) {
//       console.error('Error parsing date:', dateString, error);
//       return null;
//     }
//   };

//   // FORMAT DATE LIKE MEETUP: "28 Nov @ 6:30 pm"
//   const formatMeetupStyleDate = (dateString: string, timeString: string): string => {
//     try {
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return `${dateString} @ ${timeString}`;
      
//       const day = parts[0];
//       const month = parts[1];
//       // Remove year, keep day and month only
      
//       return `${day} ${month} @ ${timeString.toLowerCase()}`;
//     } catch (error) {
//       return `${dateString} @ ${timeString}`;
//     }
//   };

//   const loadEvents = async () => {
//     setIsLoading(true);
//     try {
//       console.log('🔄 Loading events for city:', profile.location.city);
//       const result = await db.getEvents(false, profile.gender);
//       if (result.events) {
//         // Filter by user's city
//         let cityEvents = result.events.filter(event => {
//           if (profile.location.city === 'Other' || !profile.location.city) {
//             return true;
//           }
//           return event.city === profile.location.city || !event.city;
//         });

//         // Filter to show only NEXT 3 WEEKS
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
        
//         const threeWeeksFromNow = new Date(today);
//         threeWeeksFromNow.setDate(today.getDate() + 21);

//         const upcomingEvents = cityEvents.filter(event => {
//           const eventDate = parseEventDate(event.date);
//           if (!eventDate) return false;
          
//           return eventDate >= today && eventDate <= threeWeeksFromNow;
//         });

//         console.log('✅ Total events:', result.events.length);
//         console.log('📍 City filtered:', cityEvents.length);
//         console.log('📅 Next 3 weeks:', upcomingEvents.length);
        
//         setEvents(upcomingEvents);
//       } else {
//         console.error('Failed to load events:', result.error);
//       }
//     } catch (error) {
//       console.error('Error loading events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadUserPaidEvents = async () => {
//     if (!userId) {
//       console.log('⚠️ No userId - cannot load paid events');
//       return;
//     }
//     try {
//       console.log('💰 Loading paid events for user:', userId);
//       const result = await db.getUserEvents(userId);
//       if (result.events) {
//         const paidEventIds = new Set(result.events.map((e: any) => e.id));
//         console.log('✅ User has paid for these event IDs:', Array.from(paidEventIds));
//         setUserPaidEvents(paidEventIds);
//       } else {
//         console.log('⚠️ No paid events found or error:', result.error);
//         setUserPaidEvents(new Set());
//       }
//     } catch (error) {
//       console.error('❌ Error loading user events:', error);
//       setUserPaidEvents(new Set());
//     }
//   };

//   const calculateCreatorPayment = (groupSize: number) => {
//     return groupSize * 150;
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
      
//       setEventImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     if (!userId) {
//       alert('Please log in to join events');
//       return;
//     }
//     try {
//       localStorage.setItem('pendingJoinEventId', eventId);
//       localStorage.setItem('pendingJoinUserId', userId);
//       localStorage.setItem('pendingJoinUserName', profile.name);
      
//       onSelectEvent(eventId);
//       onNavigate('payment');
//     } catch (error) {
//       console.error('Error preparing to join event:', error);
//       alert('Failed to join event. Please try again.');
//     }
//   };

//   const handleOpenChat = (eventId: string) => {
//     onSelectEvent(eventId);
//     onNavigate('chat');
//   };

//   const isUserInEvent = (event: Event) => {
//     if (!userId) {
//       return false;
//     }
    
//     const hasPaid = userPaidEvents.has(event.id);
//     const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
    
//     return hasPaid || isCreatorAndPaid;
//   };

//   const categories = [
//     { id: 'all', label: 'All Events' },
//     { id: 'food', label: 'Food & Drinks' },
//     { id: 'activities', label: 'Activities' },
//     { id: 'sports', label: 'Sports' }
//   ];

//   const filteredEvents = selectedCategory === 'all' 
//     ? events 
//     : events.filter(event => event.category === selectedCategory);

//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!eventImage) {
//       alert('Please upload an event image');
//       return;
//     }
    
//     if (creatorGroupSize > 5) {
//       alert('Maximum group size is 5 people');
//       return;
//     }
    
//     if (!additionalPeopleRange) {
//       alert('Please select how many more people you need');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       let additionalPeople: number;
//       if (additionalPeopleRange === 'custom') {
//         additionalPeople = parseInt(customPeopleCount) || 1;
//       } else if (additionalPeopleRange === '6+') {
//         additionalPeople = 10;
//       } else {
//         additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
//       }
      
//       const totalSpots = creatorGroupSize + additionalPeople;
//       const creatorPaymentAmount = calculateCreatorPayment(creatorGroupSize);
      
//       const eventData = {
//         title: createEventForm.title || `${createEventForm.eventType} Event`,
//         date: createEventForm.date || 'TBD',
//         time: createEventForm.time || 'TBD',
//         location: createEventForm.location,
//         distance: 'Custom location',
//         spotsLeft: additionalPeople,
//         totalSpots: totalSpots,
//         participants: [],
//         price: 150,
//         category: getCategoryFromEventType(createEventForm.eventType),
//         description: createEventForm.description || `Join us for ${createEventForm.eventType.toLowerCase()}!`,
//         createdBy: userId,
//         girlsOnly: isGirlsOnly,
//         creatorGroupSize: creatorGroupSize,
//         creatorPaymentAmount: creatorPaymentAmount,
//         minParticipants: creatorGroupSize + 1,
//         maxParticipants: totalSpots,
//         creatorPaid: false,
//         eventFilled: false,
//         imageUrl: imagePreview,
//         city: profile.location.city
//       };

//       const result = await db.createEvent(eventData);
      
//       if (result.success) {
//         onSelectEvent(result.event.id);
        
//         localStorage.setItem('pendingPaymentAmount', creatorPaymentAmount.toString());
//         localStorage.setItem('pendingPaymentEventId', result.event.id);
        
//         onNavigate('payment');
        
//         alert(`🎉 Event created!\n\nYou need ${additionalPeople} more ${additionalPeople === 1 ? 'person' : 'people'} to join.\n\n💰 Platform fee: ₹${creatorPaymentAmount}\n\n✅ Chat opens when at least 1 person joins!`);
        
//         setShowCreateForm(false);
//         setCreateEventForm({
//           title: '',
//           eventType: '',
//           location: '',
//           peopleCount: '',
//           date: '',
//           time: '',
//           price: 150,
//           description: ''
//         });
//         setCreatorGroupSize(1);
//         setIsGirlsOnly(false);
//         setAdditionalPeopleRange('');
//         setCustomPeopleCount('');
//         setEventImage(null);
//         setImagePreview('');
//       } else {
//         alert(`Failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to create event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food',
//       'drinks': 'food',
//       'coffee': 'food',
//       'bowling': 'activities',
//       'movie': 'activities',
//       'cultural': 'activities',
//       'sports': 'sports',
//       'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="bg-black text-white px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               Hey {profile.name}!
//             </h1>
//             <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Events in {profile.location.city}
//             </p>
//           </div>
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <Users className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Choose an activity category:
//           </h2>
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="h-auto p-4"
//                 style={{ fontFamily: 'Poppins, sans-serif' }}
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Join Existing Activities
//           </h2>
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Loading events...</p>
//             </div>
//           ) : filteredEvents.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No events found for {profile.location.city}. Create your own!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredEvents.map((event) => {
//                 const userInEvent = isUserInEvent(event);
//                 const isFull = event.spots_left === 0;
                
//                 return (
//                   <Card key={event.id} className="border-gray-200">
//                     {event.image_url && (
//                       <img 
//                         src={event.image_url} 
//                         alt={event.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                       />
//                     )}
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <CardTitle className="text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                             {event.title}
//                           </CardTitle>
//                           <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
//                             <div className="flex items-center space-x-1">
//                               <Clock className="w-4 h-4" />
//                               {/* MEETUP-STYLE DATE FORMAT */}
//                               <span>{formatMeetupStyleDate(event.date, event.time)}</span>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
//                             <MapPin className="w-4 h-4" />
//                             <span>{event.location}</span>
//                           </div>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           <Badge variant={event.spots_left > 0 ? "default" : "secondary"}>
//                             {isFull ? 'FULL' : `${event.spots_left} spots`}
//                           </Badge>
//                           {event.event_filled && (
//                             <Badge className="bg-green-500 text-white">
//                               💬 Chat Open
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <p className="text-sm text-gray-600">{event.description}</p>

//                         <div className="flex items-center justify-end pt-3">
//                           {userInEvent ? (
//                             <Button
//                               onClick={() => handleOpenChat(event.id)}
//                               className="bg-blue-600 text-white hover:bg-blue-700"
//                               style={{ fontFamily: 'Poppins, sans-serif' }}
//                             >
//                               <MessageCircle className="w-4 h-4 mr-2" />
//                               Open Chat
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={() => handleJoinEvent(event.id)}
//                               disabled={isFull}
//                               className="bg-black text-white hover:bg-gray-800"
//                               style={{ fontFamily: 'Poppins, sans-serif' }}
//                             >
//                               {isFull ? 'Fully Booked' : 'Join'}
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <Card className="border-gray-200 border-dashed">
//           <CardContent className="p-6">
//             {!showCreateForm ? (
//               <div className="text-center">
//                 <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                   CREATE YOUR OWN PLAN
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Have something specific in mind? Create your own event.
//                 </p>
//                 <Button 
//                   onClick={() => setShowCreateForm(true)}
//                   variant="outline" 
//                   className="w-full"
//                   style={{ fontFamily: 'Poppins, sans-serif' }}
//                 >
//                   Create Event
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleCreateEventSubmit} className="space-y-4">
//                 <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                   Create Your Event
//                 </h3>
                
//                 <div>
//                   <Label htmlFor="eventType">What kind of event?</Label>
//                   <Select onValueChange={(value) => setCreateEventForm(prev => ({...prev, eventType: value}))}>
//                     <SelectTrigger className="border-gray-300">
//                       <SelectValue placeholder="Choose event type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="dinner">Dinner</SelectItem>
//                       <SelectItem value="drinks">Drinks</SelectItem>
//                       <SelectItem value="coffee">Coffee</SelectItem>
//                       <SelectItem value="bowling">Bowling</SelectItem>
//                       <SelectItem value="sports">Sports Activity</SelectItem>
//                       <SelectItem value="movie">Movie</SelectItem>
//                       <SelectItem value="cultural">Cultural Event</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="girlsOnly" className="flex items-center space-x-2 cursor-pointer">
//                     <input
//                       id="girlsOnly"
//                       type="checkbox"
//                       checked={isGirlsOnly}
//                       onChange={(e) => setIsGirlsOnly(e.target.checked)}
//                       className="w-4 h-4 rounded border-gray-300"
//                     />
//                     <span>Girls Only Event 👭</span>
//                   </Label>
//                 </div>

//                 <div>
//                   <Label htmlFor="title">Event Title (Optional)</Label>
//                   <Input
//                     id="title"
//                     value={createEventForm.title}
//                     onChange={(e) => setCreateEventForm(prev => ({...prev, title: e.target.value}))}
//                     placeholder="Custom title"
//                     className="border-gray-300"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="location">Where?</Label>
//                   <Input
//                     id="location"
//                     value={createEventForm.location}
//                     onChange={(e) => setCreateEventForm(prev => ({...prev, location: e.target.value}))}
//                     placeholder="Location"
//                     className="border-gray-300"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="date">Date</Label>
//                     <Input
//                       id="date"
//                       type="date"
//                       value={createEventForm.date}
//                       onChange={(e) => setCreateEventForm(prev => ({...prev, date: e.target.value}))}
//                       className="border-gray-300"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="time">Time</Label>
//                     <Input
//                       id="time"
//                       type="time"
//                       value={createEventForm.time}
//                       onChange={(e) => setCreateEventForm(prev => ({...prev, time: e.target.value}))}
//                       className="border-gray-300"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Input
//                     id="description"
//                     value={createEventForm.description}
//                     onChange={(e) => setCreateEventForm(prev => ({...prev, description: e.target.value}))}
//                     placeholder="What to expect..."
//                     className="border-gray-300"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="eventImage">Event Image *</Label>
//                   <input
//                     id="eventImage"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="block w-full text-sm text-gray-500 mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
//                     required
//                   />
//                   {imagePreview && (
//                     <div className="mt-3">
//                       <img 
//                         src={imagePreview} 
//                         alt="Preview" 
//                         className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="groupSize">How many people with you?</Label>
//                   <Select onValueChange={(value) => setCreatorGroupSize(parseInt(value))}>
//                     <SelectTrigger className="border-gray-300">
//                       <SelectValue placeholder="Select group size" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="1">Just me</SelectItem>
//                       <SelectItem value="2">Me + 1</SelectItem>
//                       <SelectItem value="3">Group of 3</SelectItem>
//                       <SelectItem value="4">Group of 4</SelectItem>
//                       <SelectItem value="5">Group of 5</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-sm font-semibold text-blue-600 mt-2">
//                     Fee: ₹{calculateCreatorPayment(creatorGroupSize)}
//                   </p>
//                 </div>

//                 <div>
//                   <Label htmlFor="additionalPeople">How many MORE needed?</Label>
//                   <Select 
//                     value={additionalPeopleRange}
//                     onValueChange={(value) => {
//                       setAdditionalPeopleRange(value);
//                       if (value !== 'custom') {
//                         setCustomPeopleCount('');
//                       }
//                     }}
//                   >
//                     <SelectTrigger className="border-gray-300">
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="1-3">1-3 people</SelectItem>
//                       <SelectItem value="4-6">4-6 people</SelectItem>
//                       <SelectItem value="6+">6+ people</SelectItem>
//                       <SelectItem value="custom">Custom</SelectItem>
//                     </SelectContent>
//                   </Select>
                  
//                   {additionalPeopleRange === 'custom' && (
//                     <Input
//                       type="number"
//                       min="1"
//                       max="50"
//                       value={customPeopleCount}
//                       onChange={(e) => setCustomPeopleCount(e.target.value)}
//                       placeholder="Enter number"
//                       className="border-gray-300 mt-2"
//                     />
//                   )}
//                 </div>

//                 <div className="flex space-x-2 pt-4">
//                   <Button
//                     type="button"
//                     onClick={() => {
//                       setShowCreateForm(false);
//                       setCreatorGroupSize(1);
//                       setAdditionalPeopleRange('');
//                       setCustomPeopleCount('');
//                       setIsGirlsOnly(false);
//                       setEventImage(null);
//                       setImagePreview('');
//                     }}
//                     variant="outline"
//                     className="flex-1"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="flex-1 bg-black text-white hover:bg-gray-800"
//                     disabled={isLoading || !createEventForm.eventType || !createEventForm.location || !additionalPeopleRange || !eventImage}
//                   >
//                     {isLoading ? 'Creating...' : 'Create Event'}
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto">
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="outline"
//             className="w-full"
//             style={{ fontFamily: 'Poppins, sans-serif' }}
//           >
//             My Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }









































































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { UserProfile } from '../App';
// import { MapPin, Users, MessageCircle } from 'lucide-react';
// import { db } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   spots_left: number;
//   total_spots: number;
//   participants: string[];
//   price: number;
//   category: string;
//   description: string;
//   created_by?: string;
//   event_filled?: boolean;
//   min_participants?: number;
//   creator_paid?: boolean;
//   city?: string;
//   image_url?: string;
// }

// interface GroupedEvent {
//   title: string;
//   category: string;
//   location: string;
//   description: string;
//   price: number;
//   image_url?: string;
//   dates: Event[];
// }

// export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
//   const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
//   const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
//   const [eventImage, setEventImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '', eventType: '', location: '', peopleCount: '',
//     date: '', time: '', price: 150, description: ''
//   });

//   useEffect(() => {
//     loadEvents();
//     loadUserPaidEvents();
//   }, [userId]);

//   const parseEventDate = (dateString: string): Date | null => {
//     try {
//       const months: { [key: string]: number } = {
//         'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
//         'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
//       };
      
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return null;
      
//       const day = parseInt(parts[0]);
//       const month = months[parts[1]];
//       const year = parseInt(parts[2]);
      
//       if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
//       return new Date(year, month, day);
//     } catch (error) {
//       return null;
//     }
//   };

//   const formatMeetupDate = (dateString: string, timeString: string): string => {
//     try {
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return dateString;
//       return `${parts[0]} ${parts[1]} @ ${timeString.toLowerCase()}`;
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const loadEvents = async () => {
//   setIsLoading(true);
//   try {
//     const result = await db.getEvents(false, profile.gender);
//     if (result.events) {
//       // Filter by city
//       let cityEvents = result.events.filter(event => {
//         if (profile.location.city === 'Other' || !profile.location.city) return true;
//         return event.city === profile.location.city || !event.city;
//       });

//       // Filter out PAST events only (keep ALL future events)
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const futureEvents = cityEvents.filter(event => {
//         const eventDate = parseEventDate(event.date);
//         if (!eventDate) return false;
//         return eventDate >= today; // Keep all future dates
//       });

//       console.log('📅 Future events loaded:', futureEvents.length);
//       setEvents(futureEvents);
//     }
//   } catch (error) {
//     console.error('Error loading events:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };
//   const loadUserPaidEvents = async () => {
//     if (!userId) return;
//     try {
//       const result = await db.getUserEvents(userId);
//       if (result.events) {
//         const paidEventIds = new Set(result.events.map((e: any) => e.id));
//         setUserPaidEvents(paidEventIds);
//       }
//     } catch (error) {
//       console.error('Error loading user events:', error);
//     }
//   };

//   // GROUP BY EXACT TITLE AND SHOW NEXT 3 DATES
//   const groupEvents = (eventsList: Event[]): GroupedEvent[] => {
//     console.log('🔄 GROUPING EVENTS...');
//     console.log('Total events to group:', eventsList.length);
    
//     const grouped = new Map<string, Event[]>();
    
//     // Group by EXACT title match (case-sensitive)
//     eventsList.forEach(event => {
//       const key = event.title.trim(); // Trim whitespace
      
//       if (!grouped.has(key)) {
//         grouped.set(key, []);
//       }
//       grouped.get(key)!.push(event);
//     });

//     console.log('📊 GROUPED MAP:');
//     grouped.forEach((dates, title) => {
//       console.log(`  "${title}": ${dates.length} occurrences`);
//       dates.forEach(d => console.log(`    - ${d.date} @ ${d.time}`));
//     });

//     const result: GroupedEvent[] = [];
    
//     grouped.forEach((dates, title) => {
//       // Sort by date ascending
//       const sorted = dates.sort((a, b) => {
//         const dateA = parseEventDate(a.date);
//         const dateB = parseEventDate(b.date);
//         if (!dateA || !dateB) return 0;
//         return dateA.getTime() - dateB.getTime();
//       });

//       // Take FIRST 3 dates only
//       const next3Dates = sorted.slice(0, 3);

//       if (next3Dates.length > 0) {
//         result.push({
//           title,
//           category: next3Dates[0].category,
//           location: next3Dates[0].location,
//           description: next3Dates[0].description,
//           price: next3Dates[0].price,
//           image_url: next3Dates[0].image_url,
//           dates: next3Dates
//         });
//       }
//     });

//     console.log('✅ FINAL GROUPED EVENTS:', result.length);
//     result.forEach(g => {
//       console.log(`  "${g.title}": ${g.dates.length} dates shown`);
//     });

//     return result;
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     if (!userId) {
//       alert('Please log in to join events');
//       return;
//     }
//     localStorage.setItem('pendingJoinEventId', eventId);
//     localStorage.setItem('pendingJoinUserId', userId);
//     localStorage.setItem('pendingJoinUserName', profile.name);
    
//     onSelectEvent(eventId);
//     onNavigate('payment');
//   };

//   const handleOpenChat = (groupTitle: string) => {
//     const userEvent = events.find(e => 
//       e.title === groupTitle && userPaidEvents.has(e.id)
//     );
    
//     if (userEvent) {
//       onSelectEvent(userEvent.id);
//       onNavigate('chat');
//     }
//   };

//   const isUserInGroup = (group: GroupedEvent) => {
//     if (!userId) return false;
//     return group.dates.some(event => {
//       const hasPaid = userPaidEvents.has(event.id);
//       const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
//       return hasPaid || isCreatorAndPaid;
//     });
//   };

//   const categories = [
//     { id: 'all', label: 'All Events' },
//     { id: 'food', label: 'Food & Drinks' },
//     { id: 'activities', label: 'Activities' },
//     { id: 'sports', label: 'Sports' }
//   ];

//   const groupedEvents = groupEvents(events);
//   const filteredGroups = selectedCategory === 'all' 
//     ? groupedEvents 
//     : groupedEvents.filter(g => g.category === selectedCategory);

//   const calculateCreatorPayment = (groupSize: number) => groupSize * 150;

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
//       setEventImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!eventImage) {
//       alert('Please upload an event image');
//       return;
//     }
    
//     if (creatorGroupSize > 5) {
//       alert('Maximum group size is 5 people');
//       return;
//     }
    
//     if (!additionalPeopleRange) {
//       alert('Please select how many more people you need');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       let additionalPeople: number;
//       if (additionalPeopleRange === 'custom') {
//         additionalPeople = parseInt(customPeopleCount) || 1;
//       } else if (additionalPeopleRange === '6+') {
//         additionalPeople = 10;
//       } else {
//         additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
//       }
      
//       const totalSpots = creatorGroupSize + additionalPeople;
//       const creatorPaymentAmount = calculateCreatorPayment(creatorGroupSize);
      
//       const eventData = {
//         title: createEventForm.title || `${createEventForm.eventType} Event`,
//         date: createEventForm.date || 'TBD',
//         time: createEventForm.time || 'TBD',
//         location: createEventForm.location,
//         distance: 'Custom location',
//         spotsLeft: additionalPeople,
//         totalSpots: totalSpots,
//         participants: [],
//         price: 150,
//         category: getCategoryFromEventType(createEventForm.eventType),
//         description: createEventForm.description || `Join us for ${createEventForm.eventType.toLowerCase()}!`,
//         createdBy: userId,
//         girlsOnly: isGirlsOnly,
//         creatorGroupSize: creatorGroupSize,
//         creatorPaymentAmount: creatorPaymentAmount,
//         minParticipants: creatorGroupSize + 1,
//         maxParticipants: totalSpots,
//         creatorPaid: false,
//         eventFilled: false,
//         imageUrl: imagePreview,
//         city: profile.location.city
//       };

//       const result = await db.createEvent(eventData);
      
//       if (result.success) {
//         onSelectEvent(result.event.id);
//         localStorage.setItem('pendingPaymentAmount', creatorPaymentAmount.toString());
//         localStorage.setItem('pendingPaymentEventId', result.event.id);
//         onNavigate('payment');
        
//         setShowCreateForm(false);
//         setCreateEventForm({
//           title: '', eventType: '', location: '', peopleCount: '',
//           date: '', time: '', price: 150, description: ''
//         });
//         setCreatorGroupSize(1);
//         setIsGirlsOnly(false);
//         setAdditionalPeopleRange('');
//         setCustomPeopleCount('');
//         setEventImage(null);
//         setImagePreview('');
//       } else {
//         alert(`Failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to create event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="bg-black text-white px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               Hey {profile.name}!
//             </h1>
//             <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Events in {profile.location.city}
//             </p>
//           </div>
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <Users className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Choose an activity category:
//           </h2>
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="h-auto p-4"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Join Existing Activities
//           </h2>
          
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Loading events...</p>
//             </div>
//           ) : filteredGroups.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No events found. Check console for debug info!</p>
//               <p className="text-xs text-gray-400 mt-2">Open browser console (F12) to see what's happening</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredGroups.map((group) => {
//                 const userInGroup = isUserInGroup(group);
//                 const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                 const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                 const isFull = selectedEvent.spots_left === 0;
                
//                 console.log(`🎯 Rendering "${group.title}" with ${group.dates.length} dates`);
                
//                 return (
//                   <Card key={group.title} className="border-gray-200">
//                     {group.image_url && (
//                       <img 
//                         src={group.image_url} 
//                         alt={group.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                       />
//                     )}
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                           {group.title}
//                         </CardTitle>
//                         <div className="flex flex-col gap-2">
//                           <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                             {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                           </Badge>
//                           {selectedEvent.event_filled && (
//                             <Badge className="bg-green-500 text-white">💬 Chat</Badge>
//                           )}
//                         </div>
//                       </div>

//                       {/* DATE SELECTOR - FIXED STYLING */}
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {group.dates.map((dateOption) => {
//                           const isSelected = selectedEventId === dateOption.id;
//                           console.log(`  📅 Date button: ${dateOption.date} @ ${dateOption.time}`);
//                           return (
//                             <button
//                               key={dateOption.id}
//                               onClick={() => setSelectedDates(prev => ({
//                                 ...prev,
//                                 [group.title]: dateOption.id
//                               }))}
//                               className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                               style={{ 
//                                 fontFamily: 'Poppins, sans-serif',
//                                 backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                 color: isSelected ? '#ffffff' : '#374151',
//                                 boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                               }}
//                             >
//                               {formatMeetupDate(dateOption.date, dateOption.time)}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div className="flex items-center space-x-1 text-sm text-gray-600">
//                         <MapPin className="w-4 h-4" />
//                         <span>{group.location}</span>
//                       </div>
//                     </CardHeader>
                    
//                     <CardContent>
//                       <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                       <div className="flex justify-end">
//                         {userInGroup ? (
//                           <Button
//                             onClick={() => handleOpenChat(group.title)}
//                             className="bg-blue-600 text-white hover:bg-blue-700"
//                           >
//                             <MessageCircle className="w-4 h-4 mr-2" />
//                             Open Chat
//                           </Button>
//                         ) : (
//                           <Button
//                             onClick={() => handleJoinEvent(selectedEvent.id)}
//                             disabled={isFull}
//                             className="bg-black text-white hover:bg-gray-800"
//                           >
//                             {isFull ? 'Fully Booked' : 'Join'}
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* CREATE EVENT FORM SHORTENED FOR SPACE */}
//         <Card className="border-gray-200 border-dashed">
//           <CardContent className="p-6">
//             <div className="text-center">
//               <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                 CREATE YOUR OWN PLAN
//               </h3>
//               <Button 
//                 onClick={() => setShowCreateForm(!showCreateForm)}
//                 variant="outline" 
//                 className="w-full"
//               >
//                 {showCreateForm ? 'Cancel' : 'Create Event'}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto">
//           <Button onClick={() => onNavigate('dashboard')} variant="outline" className="w-full">
//             My Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }




























// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { UserProfile } from '../App';
// import { MapPin, Users, MessageCircle } from 'lucide-react';
// import { db } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   spots_left: number;
//   total_spots: number;
//   participants: string[];
//   price: number;
//   category: string;
//   description: string;
//   created_by?: string;
//   event_filled?: boolean;
//   min_participants?: number;
//   creator_paid?: boolean;
//   city?: string;
//   image_url?: string;
// }

// interface GroupedEvent {
//   title: string;
//   category: string;
//   location: string;
//   description: string;
//   price: number;
//   image_url?: string;
//   dates: Event[];
// }

// export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
//   const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
//   const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
//   const [eventImage, setEventImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '', eventType: '', location: '', peopleCount: '',
//     date: '', time: '', price: 150, description: ''
//   });

//   useEffect(() => {
//     loadEvents();
//     loadUserPaidEvents();
//   }, [userId]);

//   const parseEventDate = (dateString: string): Date | null => {
//     try {
//       const months: { [key: string]: number } = {
//         'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
//         'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
//       };
      
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return null;
      
//       const day = parseInt(parts[0]);
//       const month = months[parts[1]];
//       const year = parseInt(parts[2]);
      
//       if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
//       return new Date(year, month, day);
//     } catch (error) {
//       return null;
//     }
//   };

//   const formatMeetupDate = (dateString: string, timeString: string): string => {
//     try {
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return dateString;
//       return `${parts[0]} ${parts[1]} @ ${timeString.toLowerCase()}`;
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const loadEvents = async () => {
//   setIsLoading(true);
//   try {
//     const result = await db.getEvents(false, profile.gender);
//     if (result.events) {
//       // Filter by city
//       let cityEvents = result.events.filter(event => {
//         if (profile.location.city === 'Other' || !profile.location.city) return true;
//         return event.city === profile.location.city || !event.city;
//       });

//       // Filter out PAST events only (keep ALL future events)
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const futureEvents = cityEvents.filter(event => {
//         const eventDate = parseEventDate(event.date);
//         if (!eventDate) return false;
//         return eventDate >= today; // Keep all future dates
//       });

//       setEvents(futureEvents);
//     }
//   } catch (error) {
//     console.error('Error loading events:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };
//   const loadUserPaidEvents = async () => {
//     if (!userId) return;
//     try {
//       const result = await db.getUserEvents(userId);
//       if (result.events) {
//         const paidEventIds = new Set(result.events.map((e: any) => e.id));
//         setUserPaidEvents(paidEventIds);
//       }
//     } catch (error) {
//       console.error('Error loading user events:', error);
//     }
//   };

//   // GROUP BY EXACT TITLE AND SHOW NEXT 3 DATES
//   const groupEvents = (eventsList: Event[]): GroupedEvent[] => {
//     const grouped = new Map<string, Event[]>();
    
//     // Group by EXACT title match (case-sensitive)
//     eventsList.forEach(event => {
//       const key = event.title.trim(); // Trim whitespace
      
//       if (!grouped.has(key)) {
//         grouped.set(key, []);
//       }
//       grouped.get(key)!.push(event);
//     });

//     const result: GroupedEvent[] = [];
    
//     grouped.forEach((dates, title) => {
//       // Sort by date ascending
//       const sorted = dates.sort((a, b) => {
//         const dateA = parseEventDate(a.date);
//         const dateB = parseEventDate(b.date);
//         if (!dateA || !dateB) return 0;
//         return dateA.getTime() - dateB.getTime();
//       });

//       // Take FIRST 3 dates only
//       const next3Dates = sorted.slice(0, 3);

//       if (next3Dates.length > 0) {
//         result.push({
//           title,
//           category: next3Dates[0].category,
//           location: next3Dates[0].location,
//           description: next3Dates[0].description,
//           price: next3Dates[0].price,
//           image_url: next3Dates[0].image_url,
//           dates: next3Dates
//         });
//       }
//     });

//     return result;
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     if (!userId) {
//       alert('Please log in to join events');
//       return;
//     }
    
//     // Store payment info with user's name for UPI note
//     localStorage.setItem('pendingJoinEventId', eventId);
//     localStorage.setItem('pendingJoinUserId', userId);
//     localStorage.setItem('pendingJoinUserName', profile.name);
//     localStorage.setItem('paymentNote', `kismat-${profile.name}`); // Format: kismat-username
    
//     onSelectEvent(eventId);
//     onNavigate('payment');
//   };

//   const handleOpenChat = (groupTitle: string) => {
//     const userEvent = events.find(e => 
//       e.title === groupTitle && userPaidEvents.has(e.id)
//     );
    
//     if (userEvent) {
//       onSelectEvent(userEvent.id);
//       onNavigate('chat');
//     }
//   };

//   const isUserInGroup = (group: GroupedEvent) => {
//     if (!userId) return false;
//     return group.dates.some(event => {
//       const hasPaid = userPaidEvents.has(event.id);
//       const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
//       return hasPaid || isCreatorAndPaid;
//     });
//   };

//   const categories = [
//     { id: 'all', label: 'All Events' },
//     { id: 'food', label: 'Food & Drinks' },
//     { id: 'activities', label: 'Activities' },
//     { id: 'sports', label: 'Sports' }
//   ];

//   const groupedEvents = groupEvents(events);
//   const filteredGroups = selectedCategory === 'all' 
//     ? groupedEvents 
//     : groupedEvents.filter(g => g.category === selectedCategory);

//   const calculateCreatorPayment = (groupSize: number) => groupSize * 150;

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
//       setEventImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!eventImage) {
//       alert('Please upload an event image');
//       return;
//     }
    
//     if (creatorGroupSize > 5) {
//       alert('Maximum group size is 5 people');
//       return;
//     }
    
//     if (!additionalPeopleRange) {
//       alert('Please select how many more people you need');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       let additionalPeople: number;
//       if (additionalPeopleRange === 'custom') {
//         additionalPeople = parseInt(customPeopleCount) || 1;
//       } else if (additionalPeopleRange === '6+') {
//         additionalPeople = 10;
//       } else {
//         additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
//       }
      
//       const totalSpots = creatorGroupSize + additionalPeople;
//       const creatorPaymentAmount = calculateCreatorPayment(creatorGroupSize);
      
//       const eventData = {
//         title: createEventForm.title || `${createEventForm.eventType} Event`,
//         date: createEventForm.date || 'TBD',
//         time: createEventForm.time || 'TBD',
//         location: createEventForm.location,
//         distance: 'Custom location',
//         spotsLeft: additionalPeople,
//         totalSpots: totalSpots,
//         participants: [],
//         price: 150,
//         category: getCategoryFromEventType(createEventForm.eventType),
//         description: createEventForm.description || `Join us for ${createEventForm.eventType.toLowerCase()}!`,
//         createdBy: userId,
//         girlsOnly: isGirlsOnly,
//         creatorGroupSize: creatorGroupSize,
//         creatorPaymentAmount: creatorPaymentAmount,
//         minParticipants: creatorGroupSize + 1,
//         maxParticipants: totalSpots,
//         creatorPaid: false,
//         eventFilled: false,
//         imageUrl: imagePreview,
//         city: profile.location.city
//       };

//       const result = await db.createEvent(eventData);
      
//       if (result.success) {
//         onSelectEvent(result.event.id);
//         localStorage.setItem('pendingPaymentAmount', creatorPaymentAmount.toString());
//         localStorage.setItem('pendingPaymentEventId', result.event.id);
//         localStorage.setItem('paymentNote', `kismat-${profile.name}`); // Format: kismat-username
//         onNavigate('payment');
        
//         setShowCreateForm(false);
//         setCreateEventForm({
//           title: '', eventType: '', location: '', peopleCount: '',
//           date: '', time: '', price: 150, description: ''
//         });
//         setCreatorGroupSize(1);
//         setIsGirlsOnly(false);
//         setAdditionalPeopleRange('');
//         setCustomPeopleCount('');
//         setEventImage(null);
//         setImagePreview('');
//       } else {
//         alert(`Failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to create event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="bg-black text-white px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               Hey {profile.name}!
//             </h1>
//             <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Events in {profile.location.city}
//             </p>
//           </div>
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <Users className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Choose an activity category:
//           </h2>
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="h-auto p-4"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Join Existing Activities
//           </h2>
          
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Loading events...</p>
//             </div>
//           ) : filteredGroups.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No events available in this category right now.</p>
//               <p className="text-xs text-gray-400 mt-2">Check back soon or try a different category!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredGroups.map((group) => {
//                 const userInGroup = isUserInGroup(group);
//                 const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                 const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                 const isFull = selectedEvent.spots_left === 0;
                
//                 return (
//                   <Card key={group.title} className="border-gray-200">
//                     {group.image_url && (
//                       <img 
//                         src={group.image_url} 
//                         alt={group.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                       />
//                     )}
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                           {group.title}
//                         </CardTitle>
//                         <div className="flex flex-col gap-2">
//                           <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                             {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                           </Badge>
//                           {selectedEvent.event_filled && (
//                             <Badge className="bg-green-500 text-white">💬 Chat</Badge>
//                           )}
//                         </div>
//                       </div>

//                       {/* DATE SELECTOR - FIXED STYLING */}
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {group.dates.map((dateOption) => {
//                           const isSelected = selectedEventId === dateOption.id;
//                           return (
//                             <button
//                               key={dateOption.id}
//                               onClick={() => setSelectedDates(prev => ({
//                                 ...prev,
//                                 [group.title]: dateOption.id
//                               }))}
//                               className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                               style={{ 
//                                 fontFamily: 'Poppins, sans-serif',
//                                 backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                 color: isSelected ? '#ffffff' : '#374151',
//                                 boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                               }}
//                             >
//                               {formatMeetupDate(dateOption.date, dateOption.time)}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div className="flex items-center space-x-1 text-sm text-gray-600">
//                         <MapPin className="w-4 h-4" />
//                         <span>{group.location}</span>
//                       </div>
//                     </CardHeader>
                    
//                     <CardContent>
//                       <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                       <div className="flex justify-end">
//                         {userInGroup ? (
//                           <Button
//                             onClick={() => handleOpenChat(group.title)}
//                             className="bg-blue-600 text-white hover:bg-blue-700"
//                           >
//                             <MessageCircle className="w-4 h-4 mr-2" />
//                             Open Chat
//                           </Button>
//                         ) : (
//                           <Button
//                             onClick={() => handleJoinEvent(selectedEvent.id)}
//                             disabled={isFull}
//                             className="bg-black text-white hover:bg-gray-800"
//                           >
//                             {isFull ? 'Fully Booked' : 'Join'}
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* CREATE EVENT FORM SHORTENED FOR SPACE */}
//         <Card className="border-gray-200 border-dashed">
//           <CardContent className="p-6">
//             <div className="text-center">
//               <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                 CREATE YOUR OWN PLAN
//               </h3>
//               <Button 
//                 onClick={() => setShowCreateForm(!showCreateForm)}
//                 variant="outline" 
//                 className="w-full"
//               >
//                 {showCreateForm ? 'Cancel' : 'Create Event'}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto">
//           <Button onClick={() => onNavigate('dashboard')} variant="outline" className="w-full">
//             My Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }













































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { UserProfile } from '../App';
// import { MapPin, Users, MessageCircle } from 'lucide-react';
// import { db } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   spots_left: number;
//   total_spots: number;
//   participants: string[];
//   price: number;
//   category: string;
//   description: string;
//   created_by?: string;
//   event_filled?: boolean;
//   min_participants?: number;
//   creator_paid?: boolean;
//   city?: string;
//   image_url?: string;
// }

// interface GroupedEvent {
//   title: string;
//   category: string;
//   location: string;
//   description: string;
//   price: number;
//   image_url?: string;
//   dates: Event[];
// }

// export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
//   const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
//   const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
//   const [eventImage, setEventImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '', eventType: '', location: '', peopleCount: '',
//     date: '', time: '', price: 150, description: ''
//   });

//   useEffect(() => {
//     loadEvents();
//     loadUserPaidEvents();
//   }, [userId]);

//   const parseEventDate = (dateString: string): Date | null => {
//     try {
//       const months: { [key: string]: number } = {
//         'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
//         'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
//       };
      
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return null;
      
//       const day = parseInt(parts[0]);
//       const month = months[parts[1]];
//       const year = parseInt(parts[2]);
      
//       if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
//       return new Date(year, month, day);
//     } catch (error) {
//       return null;
//     }
//   };

//   const formatMeetupDate = (dateString: string, timeString: string): string => {
//     try {
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return dateString;
//       return `${parts[0]} ${parts[1]} @ ${timeString.toLowerCase()}`;
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const loadEvents = async () => {
//   setIsLoading(true);
//   try {
//     const result = await db.getEvents(false, profile.gender);
//     if (result.events) {
//       // Filter by city
//       let cityEvents = result.events.filter(event => {
//         if (profile.location.city === 'Other' || !profile.location.city) return true;
//         return event.city === profile.location.city || !event.city;
//       });

//       // Filter out PAST events only (keep ALL future events)
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const futureEvents = cityEvents.filter(event => {
//         const eventDate = parseEventDate(event.date);
//         if (!eventDate) return false;
//         return eventDate >= today; // Keep all future dates
//       });

//       setEvents(futureEvents);
//     }
//   } catch (error) {
//     console.error('Error loading events:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };
//   const loadUserPaidEvents = async () => {
//     if (!userId) return;
//     try {
//       const result = await db.getUserEvents(userId);
//       if (result.events) {
//         const paidEventIds = new Set(result.events.map((e: any) => e.id));
//         setUserPaidEvents(paidEventIds);
//       }
//     } catch (error) {
//       console.error('Error loading user events:', error);
//     }
//   };

//   // GROUP BY EXACT TITLE AND SHOW NEXT 3 DATES
//   const groupEvents = (eventsList: Event[]): GroupedEvent[] => {
//     const grouped = new Map<string, Event[]>();
    
//     // Group by EXACT title match (case-sensitive)
//     eventsList.forEach(event => {
//       const key = event.title.trim(); // Trim whitespace
      
//       if (!grouped.has(key)) {
//         grouped.set(key, []);
//       }
//       grouped.get(key)!.push(event);
//     });

//     const result: GroupedEvent[] = [];
    
//     grouped.forEach((dates, title) => {
//       // Sort by date ascending
//       const sorted = dates.sort((a, b) => {
//         const dateA = parseEventDate(a.date);
//         const dateB = parseEventDate(b.date);
//         if (!dateA || !dateB) return 0;
//         return dateA.getTime() - dateB.getTime();
//       });

//       // Take FIRST 3 dates only
//       const next3Dates = sorted.slice(0, 3);

//       if (next3Dates.length > 0) {
//         result.push({
//           title,
//           category: next3Dates[0].category,
//           location: next3Dates[0].location,
//           description: next3Dates[0].description,
//           price: next3Dates[0].price,
//           image_url: next3Dates[0].image_url,
//           dates: next3Dates
//         });
//       }
//     });

//     return result;
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     if (!userId) {
//       alert('Please log in to join events');
//       return;
//     }
    
//     // Store payment info with user's name for UPI note
//     localStorage.setItem('pendingJoinEventId', eventId);
//     localStorage.setItem('pendingJoinUserId', userId);
//     localStorage.setItem('pendingJoinUserName', profile.name);
//     localStorage.setItem('paymentNote', `kismat-${profile.name}`); // Format: kismat-username
    
//     onSelectEvent(eventId);
//     onNavigate('payment');
//   };

//   const handleOpenChat = (groupTitle: string) => {
//     const userEvent = events.find(e => 
//       e.title === groupTitle && userPaidEvents.has(e.id)
//     );
    
//     if (userEvent) {
//       onSelectEvent(userEvent.id);
//       onNavigate('chat');
//     }
//   };

//   const isUserInGroup = (group: GroupedEvent) => {
//     if (!userId) return false;
//     return group.dates.some(event => {
//       const hasPaid = userPaidEvents.has(event.id);
//       const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
//       return hasPaid || isCreatorAndPaid;
//     });
//   };

//   const categories = [
//     { id: 'all', label: 'All Events' },
//     { id: 'food', label: 'Food & Drinks' },
//     { id: 'activities', label: 'Activities' },
//     { id: 'sports', label: 'Sports' }
//   ];

//   const groupedEvents = groupEvents(events);
//   const filteredGroups = selectedCategory === 'all' 
//     ? groupedEvents 
//     : groupedEvents.filter(g => g.category === selectedCategory);

//   const calculateCreatorPayment = (groupSize: number) => groupSize * 150;

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
//       setEventImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!eventImage) {
//       alert('Please upload an event image');
//       return;
//     }
    
//     if (creatorGroupSize > 5) {
//       alert('Maximum group size is 5 people');
//       return;
//     }
    
//     if (!additionalPeopleRange) {
//       alert('Please select how many more people you need');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       let additionalPeople: number;
//       if (additionalPeopleRange === 'custom') {
//         additionalPeople = parseInt(customPeopleCount) || 1;
//       } else if (additionalPeopleRange === '6+') {
//         additionalPeople = 10;
//       } else {
//         additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
//       }
      
//       const totalSpots = creatorGroupSize + additionalPeople;
//       const creatorPaymentAmount = calculateCreatorPayment(creatorGroupSize);
      
//       const eventData = {
//         title: createEventForm.title || `${createEventForm.eventType} Event`,
//         date: createEventForm.date || 'TBD',
//         time: createEventForm.time || 'TBD',
//         location: createEventForm.location,
//         distance: 'Custom location',
//         spotsLeft: additionalPeople,
//         totalSpots: totalSpots,
//         participants: [],
//         price: 150,
//         category: getCategoryFromEventType(createEventForm.eventType),
//         description: createEventForm.description || `Join us for ${createEventForm.eventType.toLowerCase()}!`,
//         createdBy: userId,
//         girlsOnly: isGirlsOnly,
//         creatorGroupSize: creatorGroupSize,
//         creatorPaymentAmount: creatorPaymentAmount,
//         minParticipants: creatorGroupSize + 1,
//         maxParticipants: totalSpots,
//         creatorPaid: false,
//         eventFilled: false,
//         imageUrl: imagePreview,
//         city: profile.location.city
//       };

//       const result = await db.createEvent(eventData);
      
//       if (result.success) {
//         onSelectEvent(result.event.id);
//         localStorage.setItem('pendingPaymentAmount', creatorPaymentAmount.toString());
//         localStorage.setItem('pendingPaymentEventId', result.event.id);
//         localStorage.setItem('paymentNote', `kismat-${profile.name}`); // Format: kismat-username
//         onNavigate('payment');
        
//         setShowCreateForm(false);
//         setCreateEventForm({
//           title: '', eventType: '', location: '', peopleCount: '',
//           date: '', time: '', price: 150, description: ''
//         });
//         setCreatorGroupSize(1);
//         setIsGirlsOnly(false);
//         setAdditionalPeopleRange('');
//         setCustomPeopleCount('');
//         setEventImage(null);
//         setImagePreview('');
//       } else {
//         alert(`Failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to create event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="bg-black text-white px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               Hey {profile.name}!
//             </h1>
//             <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Events in {profile.location.city}
//             </p>
//           </div>
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <Users className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Choose an activity category:
//           </h2>
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="h-auto p-4"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Join Existing Activities
//           </h2>
          
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Loading events...</p>
//             </div>
//           ) : filteredGroups.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No events available in this category right now.</p>
//               <p className="text-xs text-gray-400 mt-2">Check back soon or try a different category!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredGroups.map((group) => {
//                 const userInGroup = isUserInGroup(group);
//                 const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                 const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                 const isFull = selectedEvent.spots_left === 0;
                
//                 return (
//                   <Card key={group.title} className="border-gray-200">
//                     {group.image_url && (
//                       <img 
//                         src={group.image_url} 
//                         alt={group.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                       />
//                     )}
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                           {group.title}
//                         </CardTitle>
//                         <div className="flex flex-col gap-2">
//                           <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                             {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                           </Badge>
//                           {selectedEvent.event_filled && (
//                             <Badge className="bg-green-500 text-white">💬 Chat</Badge>
//                           )}
//                         </div>
//                       </div>

//                       {/* DATE SELECTOR - FIXED STYLING */}
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {group.dates.map((dateOption) => {
//                           const isSelected = selectedEventId === dateOption.id;
//                           return (
//                             <button
//                               key={dateOption.id}
//                               onClick={() => setSelectedDates(prev => ({
//                                 ...prev,
//                                 [group.title]: dateOption.id
//                               }))}
//                               className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                               style={{ 
//                                 fontFamily: 'Poppins, sans-serif',
//                                 backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                 color: isSelected ? '#ffffff' : '#374151',
//                                 boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                               }}
//                             >
//                               {formatMeetupDate(dateOption.date, dateOption.time)}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div className="flex items-center space-x-1 text-sm text-gray-600">
//                         <MapPin className="w-4 h-4" />
//                         <span>{group.location}</span>
//                       </div>
//                     </CardHeader>
                    
//                     <CardContent>
//                       <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                       <div className="flex justify-end">
//                         {userInGroup ? (
//                           <Button
//                             onClick={() => handleOpenChat(group.title)}
//                             className="bg-blue-600 text-white hover:bg-blue-700"
//                           >
//                             <MessageCircle className="w-4 h-4 mr-2" />
//                             Open Chat
//                           </Button>
//                         ) : (
//                           <Button
//                             onClick={() => handleJoinEvent(selectedEvent.id)}
//                             disabled={isFull}
//                             className="bg-black text-white hover:bg-gray-800"
//                           >
//                             {isFull ? 'Fully Booked' : 'Join'}
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* CREATE EVENT FORM */}
//         {showCreateForm && (
//           <Card className="border-2 border-blue-500">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   Create Your Event
//                 </CardTitle>
//                 <Button
//                   onClick={() => setShowCreateForm(false)}
//                   variant="ghost"
//                   size="sm"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCreateEventSubmit} className="space-y-4">
//                 {/* Image Upload */}
//                 <div>
//                   <Label>Event Image *</Label>
//                   {imagePreview ? (
//                     <div className="relative mt-2">
//                       <img 
//                         src={imagePreview} 
//                         alt="Preview" 
//                         className="w-full h-48 object-cover rounded-lg"
//                       />
//                       <Button
//                         type="button"
//                         onClick={() => {
//                           setEventImage(null);
//                           setImagePreview('');
//                         }}
//                         variant="destructive"
//                         size="sm"
//                         className="absolute top-2 right-2"
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="mt-2">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">Required - Max 5MB</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Event Title */}
//                 <div>
//                   <Label>Event Title *</Label>
//                   <Input
//                     value={createEventForm.title}
//                     onChange={(e) => setCreateEventForm({...createEventForm, title: e.target.value})}
//                     placeholder="e.g., Sunday Brunch Meetup"
//                     required
//                   />
//                 </div>

//                 {/* Event Type */}
//                 <div>
//                   <Label>Event Type *</Label>
//                   <select
//                     value={createEventForm.eventType}
//                     onChange={(e) => setCreateEventForm({...createEventForm, eventType: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select type</option>
//                     <option value="dinner">Dinner</option>
//                     <option value="drinks">Drinks</option>
//                     <option value="coffee">Coffee</option>
//                     <option value="bowling">Bowling</option>
//                     <option value="movie">Movie</option>
//                     <option value="cultural">Cultural</option>
//                     <option value="sports">Sports</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <Label>Location *</Label>
//                   <Input
//                     value={createEventForm.location}
//                     onChange={(e) => setCreateEventForm({...createEventForm, location: e.target.value})}
//                     placeholder="e.g., Starbucks, Bandra"
//                     required
//                   />
//                 </div>

//                 {/* Date and Time */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Date *</Label>
//                     <Input
//                       type="date"
//                       value={createEventForm.date}
//                       onChange={(e) => setCreateEventForm({...createEventForm, date: e.target.value})}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label>Time *</Label>
//                     <Input
//                       type="time"
//                       value={createEventForm.time}
//                       onChange={(e) => setCreateEventForm({...createEventForm, time: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Creator Group Size */}
//                 <div>
//                   <Label>How many people in your group? *</Label>
//                   <select
//                     value={creatorGroupSize}
//                     onChange={(e) => setCreatorGroupSize(parseInt(e.target.value))}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="1">Just me (1 person)</option>
//                     <option value="2">Me + 1 friend (2 people)</option>
//                     <option value="3">Me + 2 friends (3 people)</option>
//                     <option value="4">Me + 3 friends (4 people)</option>
//                     <option value="5">Me + 4 friends (5 people)</option>
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     You'll pay ₹{calculateCreatorPayment(creatorGroupSize)} total (₹150 × {creatorGroupSize})
//                   </p>
//                 </div>

//                 {/* Additional People Needed */}
//                 <div>
//                   <Label>How many more people do you need? *</Label>
//                   <select
//                     value={additionalPeopleRange}
//                     onChange={(e) => setAdditionalPeopleRange(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select range</option>
//                     <option value="1-2">1-2 people</option>
//                     <option value="3-4">3-4 people</option>
//                     <option value="5-6">5-6 people</option>
//                     <option value="6+">6+ people</option>
//                     <option value="custom">Custom amount</option>
//                   </select>
//                 </div>

//                 {/* Custom People Count */}
//                 {additionalPeopleRange === 'custom' && (
//                   <div>
//                     <Label>Custom number of people</Label>
//                     <Input
//                       type="number"
//                       value={customPeopleCount}
//                       onChange={(e) => setCustomPeopleCount(e.target.value)}
//                       min="1"
//                       max="20"
//                       placeholder="Enter number"
//                     />
//                   </div>
//                 )}

//                 {/* Girls Only Toggle */}
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="girlsOnly"
//                     checked={isGirlsOnly}
//                     onChange={(e) => setIsGirlsOnly(e.target.checked)}
//                     className="w-4 h-4"
//                   />
//                   <Label htmlFor="girlsOnly">Girls Only Event</Label>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <Label>Description (Optional)</Label>
//                   <textarea
//                     value={createEventForm.description}
//                     onChange={(e) => setCreateEventForm({...createEventForm, description: e.target.value})}
//                     placeholder="Tell people about your event..."
//                     className="w-full px-3 py-2 border rounded-md min-h-20"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading || !eventImage}
//                   className="w-full bg-black text-white hover:bg-gray-800"
//                 >
//                   {isLoading ? 'Creating...' : `Create Event & Pay ₹${calculateCreatorPayment(creatorGroupSize)}`}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* CREATE EVENT BUTTON (Only show when form is closed) */}
//         {!showCreateForm && (
//           <Card className="border-gray-200 border-dashed">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                   CREATE YOUR OWN PLAN
//                 </h3>
//                 <Button 
//                   onClick={() => setShowCreateForm(true)}
//                   variant="outline" 
//                   className="w-full"
//                 >
//                   Create Event
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto">
//           <Button onClick={() => onNavigate('dashboard')} variant="outline" className="w-full">
//             My Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }







































































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { UserProfile } from '../App';
// import { MapPin, Users, MessageCircle } from 'lucide-react';
// import { db } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   spots_left: number;
//   total_spots: number;
//   participants: string[];
//   price: number;
//   category: string;
//   description: string;
//   created_by?: string;
//   event_filled?: boolean;
//   min_participants?: number;
//   creator_paid?: boolean;
//   city?: string;
//   image_url?: string;
// }

// interface GroupedEvent {
//   title: string;
//   category: string;
//   location: string;
//   description: string;
//   price: number;
//   image_url?: string;
//   dates: Event[];
// }

// export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
//   const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
//   const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
//   const [eventImage, setEventImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '', eventType: '', location: '', peopleCount: '',
//     date: '', time: '', price: 150, description: ''
//   });

//   useEffect(() => {
//     loadEvents();
//     loadUserPaidEvents();
//   }, [userId]);

//   const parseEventDate = (dateString: string): Date | null => {
//     try {
//       const months: { [key: string]: number } = {
//         'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
//         'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
//       };
      
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return null;
      
//       const day = parseInt(parts[0]);
//       const month = months[parts[1]];
//       const year = parseInt(parts[2]);
      
//       if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
//       return new Date(year, month, day);
//     } catch (error) {
//       return null;
//     }
//   };

//   const formatMeetupDate = (dateString: string, timeString: string): string => {
//     try {
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return dateString;
//       return `${parts[0]} ${parts[1]} @ ${timeString.toLowerCase()}`;
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const loadEvents = async () => {
//   setIsLoading(true);
//   try {
//     const result = await db.getEvents(false, profile.gender);
//     if (result.events) {
//       // Filter by city
//       let cityEvents = result.events.filter(event => {
//         if (profile.location.city === 'Other' || !profile.location.city) return true;
//         return event.city === profile.location.city || !event.city;
//       });

//       // Filter out PAST events only (keep ALL future events)
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const futureEvents = cityEvents.filter(event => {
//         const eventDate = parseEventDate(event.date);
//         if (!eventDate) return false;
//         return eventDate >= today; // Keep all future dates
//       });

//       // Ensure all events are ₹150
//       const standardizedEvents = futureEvents.map(event => ({
//         ...event,
//         price: 150
//       }));

//       setEvents(standardizedEvents);
//     }
//   } catch (error) {
//     console.error('Error loading events:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };
//   const loadUserPaidEvents = async () => {
//     if (!userId) return;
//     try {
//       const result = await db.getUserEvents(userId);
//       if (result.events) {
//         const paidEventIds = new Set(result.events.map((e: any) => e.id));
//         setUserPaidEvents(paidEventIds);
//       }
//     } catch (error) {
//       console.error('Error loading user events:', error);
//     }
//   };

//   // GROUP BY EXACT TITLE AND SHOW NEXT 3 DATES
//   const groupEvents = (eventsList: Event[]): GroupedEvent[] => {
//     const grouped = new Map<string, Event[]>();
    
//     // Group by EXACT title match (case-sensitive)
//     eventsList.forEach(event => {
//       const key = event.title.trim(); // Trim whitespace
      
//       if (!grouped.has(key)) {
//         grouped.set(key, []);
//       }
//       grouped.get(key)!.push(event);
//     });

//     const result: GroupedEvent[] = [];
    
//     grouped.forEach((dates, title) => {
//       // Sort by date ascending
//       const sorted = dates.sort((a, b) => {
//         const dateA = parseEventDate(a.date);
//         const dateB = parseEventDate(b.date);
//         if (!dateA || !dateB) return 0;
//         return dateA.getTime() - dateB.getTime();
//       });

//       // Take FIRST 3 dates only
//       const next3Dates = sorted.slice(0, 3);

//       if (next3Dates.length > 0) {
//         result.push({
//           title,
//           category: next3Dates[0].category,
//           location: next3Dates[0].location,
//           description: next3Dates[0].description,
//           price: next3Dates[0].price,
//           image_url: next3Dates[0].image_url,
//           dates: next3Dates
//         });
//       }
//     });

//     return result;
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     if (!userId) {
//       alert('Please log in to join events');
//       return;
//     }
    
//     // Store payment info with user's name for UPI note
//     localStorage.setItem('pendingJoinEventId', eventId);
//     localStorage.setItem('pendingJoinUserId', userId);
//     localStorage.setItem('pendingJoinUserName', profile.name);
//     localStorage.setItem('paymentNote', `kismat-${profile.name}`); // Format: kismat-username
    
//     onSelectEvent(eventId);
//     onNavigate('payment');
//   };

//   const handleOpenChat = (groupTitle: string) => {
//     const userEvent = events.find(e => 
//       e.title === groupTitle && userPaidEvents.has(e.id)
//     );
    
//     if (userEvent) {
//       onSelectEvent(userEvent.id);
//       onNavigate('chat');
//     }
//   };

//   const isUserInGroup = (group: GroupedEvent) => {
//     if (!userId) return false;
//     return group.dates.some(event => {
//       const hasPaid = userPaidEvents.has(event.id);
//       const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
//       return hasPaid || isCreatorAndPaid;
//     });
//   };

//   const categories = [
//     { id: 'all', label: 'All Events' },
//     { id: 'food', label: 'Food & Drinks' },
//     { id: 'activities', label: 'Activities' },
//     { id: 'sports', label: 'Sports' }
//   ];

//   const groupedEvents = groupEvents(events);
//   const filteredGroups = selectedCategory === 'all' 
//     ? groupedEvents 
//     : groupedEvents.filter(g => g.category === selectedCategory);

//   // Separate curated and recommended events
//   const curatedGroups = filteredGroups.filter(g => 
//     g.dates.some(event => event.created_by === 'admin' || (event as any).is_curated)
//   );
//   const recommendedGroups = filteredGroups.filter(g => 
//     !g.dates.some(event => event.created_by === 'admin' || (event as any).is_curated)
//   );

//   const hasCuratedEvents = curatedGroups.length > 0;

//   const calculateCreatorPayment = (groupSize: number) => groupSize * 150;

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
//       setEventImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!eventImage) {
//       alert('Please upload an event image');
//       return;
//     }
    
//     if (creatorGroupSize > 5) {
//       alert('Maximum group size is 5 people');
//       return;
//     }
    
//     if (!additionalPeopleRange) {
//       alert('Please select how many more people you need');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       let additionalPeople: number;
//       if (additionalPeopleRange === 'custom') {
//         additionalPeople = parseInt(customPeopleCount) || 1;
//       } else if (additionalPeopleRange === '6+') {
//         additionalPeople = 10;
//       } else {
//         additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
//       }
      
//       const totalSpots = creatorGroupSize + additionalPeople;
//       const creatorPaymentAmount = calculateCreatorPayment(creatorGroupSize);
      
//       const eventData = {
//         title: createEventForm.title || `${createEventForm.eventType} Event`,
//         date: createEventForm.date || 'TBD',
//         time: createEventForm.time || 'TBD',
//         location: createEventForm.location,
//         distance: 'Custom location',
//         spotsLeft: additionalPeople,
//         totalSpots: totalSpots,
//         participants: [],
//         price: 150,
//         category: getCategoryFromEventType(createEventForm.eventType),
//         description: createEventForm.description || `Join us for ${createEventForm.eventType.toLowerCase()}!`,
//         createdBy: userId,
//         girlsOnly: isGirlsOnly,
//         creatorGroupSize: creatorGroupSize,
//         creatorPaymentAmount: creatorPaymentAmount,
//         minParticipants: creatorGroupSize + 1,
//         maxParticipants: totalSpots,
//         creatorPaid: false,
//         eventFilled: false,
//         imageUrl: imagePreview,
//         city: profile.location.city
//       };

//       const result = await db.createEvent(eventData);
      
//       if (result.success) {
//         onSelectEvent(result.event.id);
//         localStorage.setItem('pendingPaymentAmount', creatorPaymentAmount.toString());
//         localStorage.setItem('pendingPaymentEventId', result.event.id);
//         localStorage.setItem('paymentNote', `kismat-${profile.name}`); // Format: kismat-username
//         onNavigate('payment');
        
//         setShowCreateForm(false);
//         setCreateEventForm({
//           title: '', eventType: '', location: '', peopleCount: '',
//           date: '', time: '', price: 150, description: ''
//         });
//         setCreatorGroupSize(1);
//         setIsGirlsOnly(false);
//         setAdditionalPeopleRange('');
//         setCustomPeopleCount('');
//         setEventImage(null);
//         setImagePreview('');
//       } else {
//         alert(`Failed: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to create event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="bg-black text-white px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               Hey {profile.name}!
//             </h1>
//             <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Events in {profile.location.city}
//             </p>
//           </div>
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <Users className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Choose an activity category:
//           </h2>
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="h-auto p-4"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         {/* CURATED EVENTS SECTION - Only show if curated events exist */}
//         {hasCuratedEvents && (
//           <div>
//             <h2 className="text-lg mb-4 flex items-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               <span className="mr-2">⭐</span>
//               Curated Events
//             </h2>
            
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">Loading events...</p>
//               </div>
//             ) : (
//               <div className="space-y-4 mb-8">
//                 {curatedGroups.map((group) => {
//                   const userInGroup = isUserInGroup(group);
//                   const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                   const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                   const isFull = selectedEvent.spots_left === 0;
                  
//                   return (
//                     <Card key={group.title} className="border-2 border-purple-200 bg-purple-50">
//                       {group.image_url && (
//                         <img 
//                           src={group.image_url} 
//                           alt={group.title}
//                           className="w-full h-48 object-cover rounded-t-lg"
//                         />
//                       )}
//                       <CardHeader className="pb-3">
//                         <div className="flex justify-between items-start mb-3">
//                           <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                             {group.title}
//                           </CardTitle>
//                           <div className="flex flex-col gap-2">
//                             <Badge className="bg-purple-600 text-white">Curated</Badge>
//                             <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                               {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                             </Badge>
//                             {selectedEvent.event_filled && (
//                               <Badge className="bg-green-500 text-white">💬 Chat</Badge>
//                             )}
//                           </div>
//                         </div>

//                         {/* DATE SELECTOR */}
//                         <div className="flex flex-wrap gap-2 mb-3">
//                           {group.dates.map((dateOption) => {
//                             const isSelected = selectedEventId === dateOption.id;
//                             return (
//                               <button
//                                 key={dateOption.id}
//                                 onClick={() => setSelectedDates(prev => ({
//                                   ...prev,
//                                   [group.title]: dateOption.id
//                                 }))}
//                                 className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                                 style={{ 
//                                   fontFamily: 'Poppins, sans-serif',
//                                   backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                   color: isSelected ? '#ffffff' : '#374151',
//                                   boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                                 }}
//                               >
//                                 {formatMeetupDate(dateOption.date, dateOption.time)}
//                               </button>
//                             );
//                           })}
//                         </div>

//                         <div className="flex items-center space-x-1 text-sm text-gray-600">
//                           <MapPin className="w-4 h-4" />
//                           <span>{group.location}</span>
//                         </div>
//                       </CardHeader>
                      
//                       <CardContent>
//                         <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                         <div className="flex items-center justify-between mb-3">
//                           <span className="text-lg font-bold text-purple-700">₹150 per person</span>
//                         </div>
//                         <div className="flex justify-end">
//                           {userInGroup ? (
//                             <Button
//                               onClick={() => handleOpenChat(group.title)}
//                               className="bg-blue-600 text-white hover:bg-blue-700"
//                             >
//                               <MessageCircle className="w-4 h-4 mr-2" />
//                               Open Chat
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={() => handleJoinEvent(selectedEvent.id)}
//                               disabled={isFull}
//                               className="bg-purple-600 text-white hover:bg-purple-700"
//                             >
//                               {isFull ? 'Fully Booked' : 'Join for ₹150'}
//                             </Button>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* RECOMMENDED EVENTS SECTION */}
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Recommended Events
//           </h2>
          
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Loading events...</p>
//             </div>
//           ) : recommendedGroups.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No events available in this category right now.</p>
//               <p className="text-xs text-gray-400 mt-2">Check back soon or try a different category!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recommendedGroups.map((group) => {
//                 const userInGroup = isUserInGroup(group);
//                 const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                 const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                 const isFull = selectedEvent.spots_left === 0;
                
//                 return (
//                   <Card key={group.title} className="border-gray-200">
//                     {group.image_url && (
//                       <img 
//                         src={group.image_url} 
//                         alt={group.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                       />
//                     )}
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                           {group.title}
//                         </CardTitle>
//                         <div className="flex flex-col gap-2">
//                           <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                             {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                           </Badge>
//                           {selectedEvent.event_filled && (
//                             <Badge className="bg-green-500 text-white">💬 Chat</Badge>
//                           )}
//                         </div>
//                       </div>

//                       {/* DATE SELECTOR - FIXED STYLING */}
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {group.dates.map((dateOption) => {
//                           const isSelected = selectedEventId === dateOption.id;
//                           return (
//                             <button
//                               key={dateOption.id}
//                               onClick={() => setSelectedDates(prev => ({
//                                 ...prev,
//                                 [group.title]: dateOption.id
//                               }))}
//                               className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                               style={{ 
//                                 fontFamily: 'Poppins, sans-serif',
//                                 backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                 color: isSelected ? '#ffffff' : '#374151',
//                                 boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                               }}
//                             >
//                               {formatMeetupDate(dateOption.date, dateOption.time)}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div className="flex items-center space-x-1 text-sm text-gray-600">
//                         <MapPin className="w-4 h-4" />
//                         <span>{group.location}</span>
//                       </div>
//                     </CardHeader>
                    
//                     <CardContent>
//                       <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-lg font-bold text-black">₹150 per person</span>
//                       </div>
//                       <div className="flex justify-end">
//                         {userInGroup ? (
//                           <Button
//                             onClick={() => handleOpenChat(group.title)}
//                             className="bg-blue-600 text-white hover:bg-blue-700"
//                           >
//                             <MessageCircle className="w-4 h-4 mr-2" />
//                             Open Chat
//                           </Button>
//                         ) : (
//                           <Button
//                             onClick={() => handleJoinEvent(selectedEvent.id)}
//                             disabled={isFull}
//                             className="bg-black text-white hover:bg-gray-800"
//                           >
//                             {isFull ? 'Fully Booked' : 'Join for ₹150'}
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* CREATE EVENT FORM */}
//         {showCreateForm && (
//           <Card className="border-2 border-blue-500">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   Create Your Event
//                 </CardTitle>
//                 <Button
//                   onClick={() => setShowCreateForm(false)}
//                   variant="ghost"
//                   size="sm"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCreateEventSubmit} className="space-y-4">
//                 {/* Image Upload */}
//                 <div>
//                   <Label>Event Image *</Label>
//                   {imagePreview ? (
//                     <div className="relative mt-2">
//                       <img 
//                         src={imagePreview} 
//                         alt="Preview" 
//                         className="w-full h-48 object-cover rounded-lg"
//                       />
//                       <Button
//                         type="button"
//                         onClick={() => {
//                           setEventImage(null);
//                           setImagePreview('');
//                         }}
//                         variant="destructive"
//                         size="sm"
//                         className="absolute top-2 right-2"
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="mt-2">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">Required - Max 5MB</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Event Title */}
//                 <div>
//                   <Label>Event Title *</Label>
//                   <Input
//                     value={createEventForm.title}
//                     onChange={(e) => setCreateEventForm({...createEventForm, title: e.target.value})}
//                     placeholder="e.g., Sunday Brunch Meetup"
//                     required
//                   />
//                 </div>

//                 {/* Event Type */}
//                 <div>
//                   <Label>Event Type *</Label>
//                   <select
//                     value={createEventForm.eventType}
//                     onChange={(e) => setCreateEventForm({...createEventForm, eventType: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select type</option>
//                     <option value="dinner">Dinner</option>
//                     <option value="drinks">Drinks</option>
//                     <option value="coffee">Coffee</option>
//                     <option value="bowling">Bowling</option>
//                     <option value="movie">Movie</option>
//                     <option value="cultural">Cultural</option>
//                     <option value="sports">Sports</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <Label>Location *</Label>
//                   <Input
//                     value={createEventForm.location}
//                     onChange={(e) => setCreateEventForm({...createEventForm, location: e.target.value})}
//                     placeholder="e.g., Starbucks, Bandra"
//                     required
//                   />
//                 </div>

//                 {/* Date and Time */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Date *</Label>
//                     <Input
//                       type="date"
//                       value={createEventForm.date}
//                       onChange={(e) => setCreateEventForm({...createEventForm, date: e.target.value})}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label>Time *</Label>
//                     <Input
//                       type="time"
//                       value={createEventForm.time}
//                       onChange={(e) => setCreateEventForm({...createEventForm, time: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Creator Group Size */}
//                 <div>
//                   <Label>How many people in your group? *</Label>
//                   <select
//                     value={creatorGroupSize}
//                     onChange={(e) => setCreatorGroupSize(parseInt(e.target.value))}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="1">Just me (1 person)</option>
//                     <option value="2">Me + 1 friend (2 people)</option>
//                     <option value="3">Me + 2 friends (3 people)</option>
//                     <option value="4">Me + 3 friends (4 people)</option>
//                     <option value="5">Me + 4 friends (5 people)</option>
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     You'll pay ₹{calculateCreatorPayment(creatorGroupSize)} total (₹150 × {creatorGroupSize})
//                   </p>
//                 </div>

//                 {/* Additional People Needed */}
//                 <div>
//                   <Label>How many more people do you need? *</Label>
//                   <select
//                     value={additionalPeopleRange}
//                     onChange={(e) => setAdditionalPeopleRange(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select range</option>
//                     <option value="1-2">1-2 people</option>
//                     <option value="3-4">3-4 people</option>
//                     <option value="5-6">5-6 people</option>
//                     <option value="6+">6+ people</option>
//                     <option value="custom">Custom amount</option>
//                   </select>
//                 </div>

//                 {/* Custom People Count */}
//                 {additionalPeopleRange === 'custom' && (
//                   <div>
//                     <Label>Custom number of people</Label>
//                     <Input
//                       type="number"
//                       value={customPeopleCount}
//                       onChange={(e) => setCustomPeopleCount(e.target.value)}
//                       min="1"
//                       max="20"
//                       placeholder="Enter number"
//                     />
//                   </div>
//                 )}

//                 {/* Girls Only Toggle */}
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="girlsOnly"
//                     checked={isGirlsOnly}
//                     onChange={(e) => setIsGirlsOnly(e.target.checked)}
//                     className="w-4 h-4"
//                   />
//                   <Label htmlFor="girlsOnly">Girls Only Event</Label>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <Label>Description (Optional)</Label>
//                   <textarea
//                     value={createEventForm.description}
//                     onChange={(e) => setCreateEventForm({...createEventForm, description: e.target.value})}
//                     placeholder="Tell people about your event..."
//                     className="w-full px-3 py-2 border rounded-md min-h-20"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading || !eventImage}
//                   className="w-full bg-black text-white hover:bg-gray-800"
//                 >
//                   {isLoading ? 'Creating...' : `Create Event & Pay ₹${calculateCreatorPayment(creatorGroupSize)}`}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* CREATE EVENT BUTTON (Only show when form is closed) */}
//         {!showCreateForm && (
//           <Card className="border-gray-200 border-dashed">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                   CREATE YOUR OWN PLAN
//                 </h3>
//                 <Button 
//                   onClick={() => setShowCreateForm(true)}
//                   variant="outline" 
//                   className="w-full"
//                 >
//                   Create Event
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto">
//           <Button onClick={() => onNavigate('dashboard')} variant="outline" className="w-full">
//             My Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }





















































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Textarea } from './ui/textarea';
// import { UserProfile } from '../App';
// import { MapPin, Clock, Users, Calendar, Plus, X, Upload, ImageIcon, CheckCircle } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   date: string;
//   time: string;
//   price: number;
//   total_spots: number;
//   spots_left: number;
//   participants: string[];
//   category: string;
//   image_url?: string;
//   is_recurring?: boolean;
//   recurrence_pattern?: string;
//   city: string;
//   created_by?: string;
//   creator_paid?: boolean;
//   status?: string;
// }

// const EventsPage: React.FC<EventsPageProps> = ({ profile, userId, onSelectEvent, onNavigate }) => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [selectedCity, setSelectedCity] = useState(profile.city);
  
//   // Create event form state
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '',
//     eventType: '',
//     location: '',
//     date: '',
//     time: '',
//     description: '',
//   });
  
//   // Image upload state
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [imageError, setImageError] = useState('');
  
//   // Creator group size and payment
//   const [creatorGroupSize, setCreatorGroupSize] = useState(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState('');
//   const [customPeopleCount, setCustomPeopleCount] = useState('');
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Calculate payment for creator
//   const calculateCreatorPayment = (groupSize: number) => {
//     return groupSize * 100; // ₹100 per person
//   };

//   // Load events on mount and when city changes
//   useEffect(() => {
//     loadEvents();
    
//     // Track page view in analytics
//     if (analytics) {
//       analytics.trackPageView('events_page');
//     }

//     // 🔥 CHECK FOR SAVED FORM DATA FROM PAYMENT
//     checkForSavedFormData();
//   }, [selectedCity]);

//   // 🔥 NEW: Check if there's saved form data after payment
//   const checkForSavedFormData = () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (savedFormData) {
//       try {
//         const formData = JSON.parse(savedFormData);
        
//         // Restore form state
//         setCreateEventForm({
//           title: formData.title || '',
//           eventType: formData.eventType || '',
//           location: formData.location || '',
//           date: formData.date || '',
//           time: formData.time || '',
//           description: formData.description || '',
//         });
        
//         setCreatorGroupSize(formData.creatorGroupSize || 1);
//         setAdditionalPeopleRange(formData.additionalPeopleRange || '');
//         setCustomPeopleCount(formData.customPeopleCount || '');
//         setIsGirlsOnly(formData.isGirlsOnly || false);
//         setImagePreview(formData.imagePreview || '');
        
//         // Show the form automatically so user can continue
//         setShowCreateForm(true);
        
//         console.log('Restored form data from localStorage after payment');
//       } catch (error) {
//         console.error('Error restoring form data:', error);
//       }
//     }
//   };

//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await db
//         .from('events')
//         .select('*')
//         .eq('city', selectedCity)
//         .gte('date', new Date().toISOString().split('T')[0])
//         .order('date', { ascending: true });

//       if (error) throw error;
      
//       setEvents(data || []);
//     } catch (error) {
//       console.error('Error loading events:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 IMPROVED: Better image upload handler with validation
//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setImageError('');
    
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       setImageError('Please select an image file');
//       return;
//     }

//     // Validate file size (5MB max)
//     const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//     if (file.size > maxSize) {
//       setImageError('Image must be less than 5MB');
//       return;
//     }

//     setSelectedImage(file);
    
//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Handle joining an event
//   const handleJoinEvent = async (event: Event) => {
//     // Store pending join in localStorage
//     localStorage.setItem('pendingEventJoin', JSON.stringify({
//       eventId: event.id,
//       eventTitle: event.title,
//       price: event.price,
//       userId: userId,
//       username: profile.username,
//     }));

//     // Track join attempt
//     if (analytics) {
//       await analytics.trackPaymentAttempt(event.price, 'event_join', event.id);
//     }

//     // Navigate to payment page
//     onNavigate('payment');
//   };

//   // 🔥 FIXED: Handle create event submission with localStorage persistence
//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation
//     if (!selectedImage) {
//       alert('Please upload an event image');
//       return;
//     }

//     if (!createEventForm.title || !createEventForm.eventType || !createEventForm.location || 
//         !createEventForm.date || !createEventForm.time) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     if (!additionalPeopleRange) {
//       alert('Please select how many additional people you need');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Calculate total spots
//       const additionalPeople = additionalPeopleRange === 'custom' 
//         ? parseInt(customPeopleCount) 
//         : parseInt(additionalPeopleRange);
      
//       const totalSpots = creatorGroupSize + additionalPeople;

//       // 🔥 SAVE ALL FORM DATA TO LOCALSTORAGE BEFORE PAYMENT
//       const formDataToSave = {
//         title: createEventForm.title,
//         eventType: createEventForm.eventType,
//         location: createEventForm.location,
//         date: createEventForm.date,
//         time: createEventForm.time,
//         description: createEventForm.description,
//         creatorGroupSize,
//         additionalPeopleRange,
//         customPeopleCount,
//         isGirlsOnly,
//         totalSpots,
//         imagePreview, // Save the base64 preview
//         imageFile: selectedImage ? {
//           name: selectedImage.name,
//           type: selectedImage.type,
//           size: selectedImage.size,
//         } : null,
//         userId,
//         username: profile.username,
//         city: selectedCity,
//         timestamp: new Date().toISOString(),
//       };

//       localStorage.setItem('pendingEventCreation', JSON.stringify(formDataToSave));

//       // Also store payment info
//       const paymentAmount = calculateCreatorPayment(creatorGroupSize);
//       localStorage.setItem('pendingCreatorPayment', JSON.stringify({
//         amount: paymentAmount,
//         type: 'event_creation',
//         groupSize: creatorGroupSize,
//         eventTitle: createEventForm.title,
//         userId,
//         username: profile.username,
//       }));

//       console.log('Form data saved to localStorage. Amount:', paymentAmount);

//       // Track payment attempt
//       if (analytics) {
//         await analytics.trackPaymentAttempt(paymentAmount, 'event_creation', 'new_event');
//       }

//       // Navigate to payment page
//       onNavigate('payment');

//     } catch (error) {
//       console.error('Error preparing event creation:', error);
//       alert('Failed to prepare event. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-IN', { 
//       weekday: 'short', 
//       day: 'numeric', 
//       month: 'short' 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading events...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-black text-white px-6 py-6 sticky top-0 z-10">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
//             Events in {selectedCity}
//           </h1>
//           <Button
//             onClick={() => onNavigate('profile')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             Profile
//           </Button>
//         </div>

//         {/* City Selector */}
//         <div className="flex items-center space-x-2">
//           <MapPin className="w-4 h-4" />
//           <select
//             value={selectedCity}
//             onChange={(e) => setSelectedCity(e.target.value)}
//             className="bg-gray-800 text-white rounded-lg px-3 py-1 text-sm"
//           >
//             <option value="Mumbai">Mumbai</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Bangalore">Bangalore</option>
//             <option value="Pune">Pune</option>
//             <option value="Hyderabad">Hyderabad</option>
//           </select>
//         </div>
//       </div>

//       {/* Create Event Button */}
//       <div className="px-6 py-4">
//         <Button
//           onClick={() => setShowCreateForm(!showCreateForm)}
//           className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
//           style={{ fontFamily: 'Poppins, sans-serif' }}
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Create Your Own Event
//         </Button>
//       </div>

//       {/* Create Event Form */}
//       {showCreateForm && (
//         <div className="px-6 mb-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   Create New Event
//                 </CardTitle>
//                 <Button
//                   onClick={() => {
//                     setShowCreateForm(false);
//                     // Clear form
//                     setCreateEventForm({
//                       title: '',
//                       eventType: '',
//                       location: '',
//                       date: '',
//                       time: '',
//                       description: '',
//                     });
//                     setSelectedImage(null);
//                     setImagePreview('');
//                     setCreatorGroupSize(1);
//                     setAdditionalPeopleRange('');
//                     setCustomPeopleCount('');
//                     setIsGirlsOnly(false);
//                   }}
//                   variant="ghost"
//                   size="sm"
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCreateEventSubmit} className="space-y-4">
//                 {/* 🔥 IMPROVED IMAGE UPLOAD UI */}
//                 <div>
//                   <Label className="text-sm font-semibold mb-2 block">
//                     Event Image * (Required)
//                   </Label>
                  
//                   {imagePreview ? (
//                     // Show preview with remove button
//                     <div className="relative group">
//                       <img 
//                         src={imagePreview} 
//                         alt="Event preview" 
//                         className="w-full h-56 object-cover rounded-lg border-2 border-gray-200"
//                       />
//                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
//                         <Button
//                           type="button"
//                           onClick={() => {
//                             setSelectedImage(null);
//                             setImagePreview('');
//                             setImageError('');
//                           }}
//                           variant="destructive"
//                           size="sm"
//                           className="opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X className="w-4 h-4 mr-1" />
//                           Remove Image
//                         </Button>
//                       </div>
//                       <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
//                         <CheckCircle className="w-3 h-3 mr-1" />
//                         Image Added
//                       </div>
//                     </div>
//                   ) : (
//                     // Show upload button
//                     <label className="block cursor-pointer">
//                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-500 hover:bg-purple-50 transition-all">
//                         <div className="flex flex-col items-center justify-center text-center">
//                           <div className="bg-purple-100 p-4 rounded-full mb-3">
//                             <ImageIcon className="w-8 h-8 text-purple-600" />
//                           </div>
//                           <p className="text-sm font-semibold text-gray-700 mb-1">
//                             Click to upload event image
//                           </p>
//                           <p className="text-xs text-gray-500 mb-2">
//                             JPG, PNG or GIF (max 5MB)
//                           </p>
//                           <div className="flex items-center space-x-2 text-xs text-gray-400">
//                             <Upload className="w-3 h-3" />
//                             <span>Drag and drop or click to browse</span>
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageSelect}
//                         className="hidden"
//                       />
//                     </label>
//                   )}
                  
//                   {imageError && (
//                     <p className="text-red-500 text-xs mt-2 flex items-center">
//                       <X className="w-3 h-3 mr-1" />
//                       {imageError}
//                     </p>
//                   )}
                  
//                   <p className="text-xs text-gray-500 mt-2">
//                     💡 Tip: Use a clear, attractive image that represents your event
//                   </p>
//                 </div>

//                 {/* Event Title */}
//                 <div>
//                   <Label>Event Title *</Label>
//                   <Input
//                     value={createEventForm.title}
//                     onChange={(e) => setCreateEventForm({ ...createEventForm, title: e.target.value })}
//                     placeholder="e.g., Sunday Morning Coffee & Chat"
//                     required
//                   />
//                 </div>

//                 {/* Event Type */}
//                 <div>
//                   <Label>Event Type *</Label>
//                   <select
//                     value={createEventForm.eventType}
//                     onChange={(e) => setCreateEventForm({ ...createEventForm, eventType: e.target.value })}
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
//                     required
//                   >
//                     <option value="">Select event type</option>
//                     <option value="coffee">☕ Coffee & Chat</option>
//                     <option value="dinner">🍽️ Dinner</option>
//                     <option value="drinks">🍹 Drinks</option>
//                     <option value="sports">⚽ Sports</option>
//                     <option value="gaming">🎮 Gaming</option>
//                     <option value="movie">🎬 Movie</option>
//                     <option value="concert">🎵 Concert</option>
//                     <option value="workshop">📚 Workshop</option>
//                     <option value="outdoor">🏕️ Outdoor Activity</option>
//                     <option value="other">✨ Other</option>
//                   </select>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <Label>Location *</Label>
//                   <Input
//                     value={createEventForm.location}
//                     onChange={(e) => setCreateEventForm({ ...createEventForm, location: e.target.value })}
//                     placeholder="e.g., Starbucks, Bandra West"
//                     required
//                   />
//                 </div>

//                 {/* Date and Time */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label>Date *</Label>
//                     <Input
//                       type="date"
//                       value={createEventForm.date}
//                       onChange={(e) => setCreateEventForm({ ...createEventForm, date: e.target.value })}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label>Time *</Label>
//                     <Input
//                       type="time"
//                       value={createEventForm.time}
//                       onChange={(e) => setCreateEventForm({ ...createEventForm, time: e.target.value })}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Creator Group Size */}
//                 <div>
//                   <Label>How many people are coming with you? *</Label>
//                   <p className="text-xs text-gray-500 mb-2">
//                     Including yourself (You + your friends)
//                   </p>
//                   <div className="flex space-x-2">
//                     {[1, 2, 3, 4, 5].map((size) => (
//                       <Button
//                         key={size}
//                         type="button"
//                         onClick={() => setCreatorGroupSize(size)}
//                         variant={creatorGroupSize === size ? "default" : "outline"}
//                         className={creatorGroupSize === size ? "bg-black" : ""}
//                       >
//                         {size} {size === 1 ? 'person' : 'people'}
//                       </Button>
//                     ))}
//                   </div>
//                   <p className="text-xs text-purple-600 font-semibold mt-2">
//                     💰 Your payment: ₹{calculateCreatorPayment(creatorGroupSize)} (₹100 × {creatorGroupSize})
//                   </p>
//                 </div>

//                 {/* Additional People Needed */}
//                 <div>
//                   <Label>How many more people do you need? *</Label>
//                   <select
//                     value={additionalPeopleRange}
//                     onChange={(e) => {
//                       setAdditionalPeopleRange(e.target.value);
//                       if (e.target.value !== 'custom') {
//                         setCustomPeopleCount('');
//                       }
//                     }}
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
//                     required
//                   >
//                     <option value="">Select range</option>
//                     <option value="1">1 more person</option>
//                     <option value="2">2 more people</option>
//                     <option value="3">3 more people</option>
//                     <option value="5">5 more people</option>
//                     <option value="custom">Custom number</option>
//                   </select>
                  
//                   {additionalPeopleRange === 'custom' && (
//                     <Input
//                       type="number"
//                       value={customPeopleCount}
//                       onChange={(e) => setCustomPeopleCount(e.target.value)}
//                       placeholder="Enter number of people"
//                       min="1"
//                       max="50"
//                       className="mt-2"
//                       required
//                     />
//                   )}
//                 </div>

//                 {/* Girls Only Checkbox */}
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="girlsOnly"
//                     checked={isGirlsOnly}
//                     onChange={(e) => setIsGirlsOnly(e.target.checked)}
//                     className="w-4 h-4 rounded"
//                   />
//                   <Label htmlFor="girlsOnly" className="cursor-pointer">
//                     👭 Girls Only Event
//                   </Label>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <Label>Description</Label>
//                   <Textarea
//                     value={createEventForm.description}
//                     onChange={(e) => setCreateEventForm({ ...createEventForm, description: e.target.value })}
//                     placeholder="Tell people what to expect at your event..."
//                     rows={3}
//                   />
//                 </div>

//                 {/* Payment Info Card */}
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
//                   <p className="text-sm font-semibold text-blue-900">
//                     💳 Payment Summary
//                   </p>
//                   <div className="text-xs text-blue-700 space-y-1">
//                     <p>• Your group: {creatorGroupSize} {creatorGroupSize === 1 ? 'person' : 'people'} × ₹100 = <strong>₹{calculateCreatorPayment(creatorGroupSize)}</strong></p>
//                     <p>• Platform fee per person: ₹100</p>
//                     <p>• You pay now, others pay when they join</p>
//                   </div>
//                 </div>

//                 {/* Refund Policy */}
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                   <p className="text-xs font-semibold text-yellow-800 mb-1">🔄 Refund Policy</p>
//                   <p className="text-xs text-yellow-700">
//                     Your ₹{calculateCreatorPayment(creatorGroupSize)} will be <strong>refunded</strong> if no one joins your event by the scheduled time.
//                   </p>
//                 </div>

//                 {/* Submit Buttons */}
//                 <div className="flex space-x-2 pt-4">
//                   <Button
//                     type="button"
//                     onClick={() => {
//                       setShowCreateForm(false);
//                       // Clear form
//                       setCreateEventForm({
//                         title: '',
//                         eventType: '',
//                         location: '',
//                         date: '',
//                         time: '',
//                         description: '',
//                       });
//                       setSelectedImage(null);
//                       setImagePreview('');
//                       setCreatorGroupSize(1);
//                       setAdditionalPeopleRange('');
//                       setCustomPeopleCount('');
//                       setIsGirlsOnly(false);
//                     }}
//                     variant="outline"
//                     className="flex-1"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="flex-1 bg-black text-white hover:bg-gray-800"
//                     disabled={isLoading || !selectedImage}
//                   >
//                     {isLoading ? 'Processing...' : `Create & Pay ₹${calculateCreatorPayment(creatorGroupSize)}`}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Events List */}
//       <div className="px-6 space-y-4">
//         {events.length === 0 ? (
//           <Card>
//             <CardContent className="py-12 text-center">
//               <p className="text-gray-600 mb-4">
//                 No events in {selectedCity} yet
//               </p>
//               <Button
//                 onClick={() => setShowCreateForm(true)}
//                 className="bg-black text-white"
//               >
//                 Create First Event
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           events.map((event) => (
//             <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//               {event.image_url && (
//                 <img 
//                   src={event.image_url} 
//                   alt={event.title}
//                   className="w-full h-48 object-cover"
//                 />
//               )}
//               <CardContent className="p-4">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex-1">
//                     <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                       {event.title}
//                     </h3>
//                     <Badge variant="secondary" className="text-xs">
//                       {event.category}
//                     </Badge>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-purple-600">
//                       ₹{event.price}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2 text-sm text-gray-600 mb-4">
//                   <div className="flex items-center">
//                     <MapPin className="w-4 h-4 mr-2" />
//                     {event.location}
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="w-4 h-4 mr-2" />
//                     {formatDate(event.date)}
//                   </div>
//                   <div className="flex items-center">
//                     <Clock className="w-4 h-4 mr-2" />
//                     {event.time}
//                   </div>
//                   <div className="flex items-center">
//                     <Users className="w-4 h-4 mr-2" />
//                     {event.spots_left} / {event.total_spots} spots left
//                   </div>
//                 </div>

//                 {event.description && (
//                   <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                     {event.description}
//                   </p>
//                 )}

//                 <Button
//                   onClick={() => handleJoinEvent(event)}
//                   className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
//                   disabled={event.spots_left === 0}
//                   style={{ fontFamily: 'Poppins, sans-serif' }}
//                 >
//                   {event.spots_left === 0 ? 'Event Full' : 'Join Event'}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>

//       {/* Footer */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto flex items-center justify-between">
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="outline"
//             className="flex-1 mr-2"
//           >
//             My Dashboard
//           </Button>
//           <Button
//             onClick={() => onNavigate('profile')}
//             variant="ghost"
//             className="flex-1"
//           >
//             Profile
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { EventsPage };











































































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { UserProfile } from '../App';
// import { MapPin, Clock, Users, Calendar, Plus, X, Upload, ImageIcon, CheckCircle, MessageCircle } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface EventsPageProps {
//   profile: UserProfile;
//   userId: string | null;
//   onSelectEvent: (eventId: string) => void;
//   onNavigate: (screen: string) => void;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   spots_left: number;
//   total_spots: number;
//   participants: string[];
//   price: number;
//   category: string;
//   description: string;
//   created_by?: string;
//   event_filled?: boolean;
//   min_participants?: number;
//   creator_paid?: boolean;
//   city?: string;
//   image_url?: string;
// }

// interface GroupedEvent {
//   title: string;
//   category: string;
//   location: string;
//   description: string;
//   price: number;
//   image_url?: string;
//   dates: Event[];
// }

// export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGirlsOnly, setIsGirlsOnly] = useState(false);
//   const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
//   const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
//   const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
//   const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
//   const [eventImage, setEventImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [imageError, setImageError] = useState<string>('');
//   const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  
//   const [createEventForm, setCreateEventForm] = useState({
//     title: '',
//     eventType: '',
//     location: '',
//     date: '',
//     time: '',
//     description: '',
//   });

//   useEffect(() => {
//     loadEvents();
//     loadUserPaidEvents();
    
//     // Track page view
//     if (analytics) {
//       analytics.trackVisit('events_page');
//     }

//     // 🔥 CHECK FOR SAVED FORM DATA FROM PAYMENT
//     checkForSavedFormData();
//   }, [userId]);

//   // 🔥 NEW: Check if there's saved form data after payment
//   const checkForSavedFormData = () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (savedFormData) {
//       try {
//         const formData = JSON.parse(savedFormData);
        
//         // Restore form state
//         setCreateEventForm({
//           title: formData.title || '',
//           eventType: formData.eventType || '',
//           location: formData.location || '',
//           date: formData.date || '',
//           time: formData.time || '',
//           description: formData.description || '',
//         });
        
//         setCreatorGroupSize(formData.creatorGroupSize || 1);
//         setAdditionalPeopleRange(formData.additionalPeopleRange || '');
//         setCustomPeopleCount(formData.customPeopleCount || '');
//         setIsGirlsOnly(formData.isGirlsOnly || false);
//         setImagePreview(formData.imagePreview || '');
        
//         // Show the form automatically
//         setShowCreateForm(true);
        
//         console.log('✅ Restored form data from localStorage');
//       } catch (error) {
//         console.error('Error restoring form data:', error);
//       }
//     }
//   };

//   const parseEventDate = (dateString: string): Date | null => {
//     try {
//       const months: { [key: string]: number } = {
//         'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
//         'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
//       };
      
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return null;
      
//       const day = parseInt(parts[0]);
//       const month = months[parts[1]];
//       const year = parseInt(parts[2]);
      
//       if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
//       return new Date(year, month, day);
//     } catch (error) {
//       return null;
//     }
//   };

//   const formatMeetupDate = (dateString: string, timeString: string): string => {
//     try {
//       const parts = dateString.split(' ');
//       if (parts.length !== 3) return dateString;
//       return `${parts[0]} ${parts[1]} @ ${timeString.toLowerCase()}`;
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const loadEvents = async () => {
//     setIsLoading(true);
//     try {
//       const result = await db.getEvents(false, profile.gender);
//       if (result.events) {
//         // Filter by city
//         let cityEvents = result.events.filter((event: Event) => {
//           if (profile.location.city === 'Other' || !profile.location.city) return true;
//           return event.city === profile.location.city || !event.city;
//         });

//         // Filter out PAST events
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const futureEvents = cityEvents.filter((event: Event) => {
//           const eventDate = parseEventDate(event.date);
//           if (!eventDate) return false;
//           return eventDate >= today;
//         });

//         setEvents(futureEvents);
//       }
//     } catch (error) {
//       console.error('Error loading events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadUserPaidEvents = async () => {
//     if (!userId) return;
//     try {
//       const result = await db.getUserEvents(userId);
//       if (result.events) {
//         const paidEventIds = new Set(result.events.map((e: any) => e.id));
//         setUserPaidEvents(paidEventIds);
//       }
//     } catch (error) {
//       console.error('Error loading user events:', error);
//     }
//   };

//   const groupEvents = (eventsList: Event[]): GroupedEvent[] => {
//     const grouped = new Map<string, Event[]>();
    
//     eventsList.forEach(event => {
//       const key = event.title.trim();
      
//       if (!grouped.has(key)) {
//         grouped.set(key, []);
//       }
//       grouped.get(key)!.push(event);
//     });

//     const result: GroupedEvent[] = [];
    
//     grouped.forEach((dates, title) => {
//       const sorted = dates.sort((a, b) => {
//         const dateA = parseEventDate(a.date);
//         const dateB = parseEventDate(b.date);
//         if (!dateA || !dateB) return 0;
//         return dateA.getTime() - dateB.getTime();
//       });

//       const next3Dates = sorted.slice(0, 3);

//       if (next3Dates.length > 0) {
//         result.push({
//           title,
//           category: next3Dates[0].category,
//           location: next3Dates[0].location,
//           description: next3Dates[0].description,
//           price: next3Dates[0].price,
//           image_url: next3Dates[0].image_url,
//           dates: next3Dates
//         });
//       }
//     });

//     return result;
//   };

//   // 🔥 IMPROVED: Better image upload handler
//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setImageError('');
    
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setImageError('Please select an image file');
//       return;
//     }

//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setImageError('Image must be less than 5MB');
//       return;
//     }

//     setEventImage(file);
    
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     if (!userId) {
//       alert('Please log in to join events');
//       return;
//     }
    
//     // Store payment info
//     localStorage.setItem('pendingJoinEventId', eventId);
//     localStorage.setItem('pendingJoinUserId', userId);
//     localStorage.setItem('pendingJoinUserName', profile.name);
    
//     onSelectEvent(eventId);
//     onNavigate('payment');
//   };

//   const handleOpenChat = (groupTitle: string) => {
//     const userEvent = events.find(e => 
//       e.title === groupTitle && userPaidEvents.has(e.id)
//     );
    
//     if (userEvent) {
//       onSelectEvent(userEvent.id);
//       onNavigate('chat');
//     }
//   };

//   const isUserInGroup = (group: GroupedEvent) => {
//     if (!userId) return false;
//     return group.dates.some(event => {
//       const hasPaid = userPaidEvents.has(event.id);
//       const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
//       return hasPaid || isCreatorAndPaid;
//     });
//   };

//   // 🔥 FIXED: Handle create event with localStorage persistence
//   const handleCreateEventSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!eventImage && !imagePreview) {
//       alert('Please upload an event image');
//       return;
//     }

//     if (!createEventForm.title || !createEventForm.eventType || !createEventForm.location || 
//         !createEventForm.date || !createEventForm.time) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     if (!additionalPeopleRange) {
//       alert('Please select how many additional people you need');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       let additionalPeople: number;
//       if (additionalPeopleRange === 'custom') {
//         additionalPeople = parseInt(customPeopleCount) || 1;
//       } else if (additionalPeopleRange === '6+') {
//         additionalPeople = 10;
//       } else {
//         additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
//       }
      
//       const totalSpots = creatorGroupSize + additionalPeople;
//       const creatorPaymentAmount = creatorGroupSize * 150;

//       // 🔥 SAVE TO LOCALSTORAGE BEFORE PAYMENT
//       const formDataToSave = {
//         title: createEventForm.title,
//         eventType: createEventForm.eventType,
//         location: createEventForm.location,
//         date: createEventForm.date,
//         time: createEventForm.time,
//         description: createEventForm.description,
//         creatorGroupSize,
//         additionalPeopleRange,
//         customPeopleCount,
//         isGirlsOnly,
//         totalSpots,
//         additionalPeople,
//         imagePreview,
//         userId,
//         username: profile.name,
//         city: profile.location.city,
//         timestamp: new Date().toISOString(),
//       };

//       localStorage.setItem('pendingEventCreation', JSON.stringify(formDataToSave));

//       // Save payment info
//       localStorage.setItem('pendingCreatorPayment', JSON.stringify({
//         amount: creatorPaymentAmount,
//         type: 'event_creation',
//         groupSize: creatorGroupSize,
//         eventTitle: createEventForm.title,
//         userId,
//         username: profile.name,
//       }));

//       console.log('💾 Form data saved to localStorage');

//       // Navigate to payment
//       onNavigate('payment');

//     } catch (error) {
//       console.error('Error preparing event creation:', error);
//       alert('Failed to prepare event. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   const categories = [
//     { id: 'all', label: 'All Events' },
//     { id: 'food', label: 'Food & Drinks' },
//     { id: 'activities', label: 'Activities' },
//     { id: 'sports', label: 'Sports' }
//   ];

//   const groupedEvents = groupEvents(events);
//   const filteredGroups = selectedCategory === 'all' 
//     ? groupedEvents 
//     : groupedEvents.filter(g => g.category === selectedCategory);

//   const curatedGroups = filteredGroups.filter(g => 
//     g.dates.some(event => event.created_by === 'admin' || (event as any).is_curated)
//   );
//   const recommendedGroups = filteredGroups.filter(g => 
//     !g.dates.some(event => event.created_by === 'admin' || (event as any).is_curated)
//   );

//   const hasCuratedEvents = curatedGroups.length > 0;
//   const calculateCreatorPayment = (groupSize: number) => groupSize * 150;

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="bg-black text-white px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               Hey {profile.name}!
//             </h1>
//             <p className="text-gray-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Events in {profile.location.city}
//             </p>
//           </div>
//           <Button
//             onClick={() => onNavigate('dashboard')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <Users className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Choose an activity category:
//           </h2>
//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className="h-auto p-4"
//               >
//                 {category.label}
//               </Button>
//             ))}
//           </div>
//         </div>

//         {/* CREATE EVENT FORM */}
//         {showCreateForm && (
//           <Card className="border-2 border-blue-500">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   Create Your Event
//                 </CardTitle>
//                 <Button
//                   onClick={() => {
//                     setShowCreateForm(false);
//                     setCreateEventForm({ title: '', eventType: '', location: '', date: '', time: '', description: '' });
//                     setEventImage(null);
//                     setImagePreview('');
//                     setCreatorGroupSize(1);
//                     setAdditionalPeopleRange('');
//                     setCustomPeopleCount('');
//                     setIsGirlsOnly(false);
//                   }}
//                   variant="ghost"
//                   size="sm"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCreateEventSubmit} className="space-y-4">
//                 {/* 🔥 IMPROVED IMAGE UPLOAD */}
//                 <div>
//                   <Label className="text-sm font-semibold mb-2 block">
//                     Event Image * (Required)
//                   </Label>
                  
//                   {imagePreview ? (
//                     <div className="relative group">
//                       <img 
//                         src={imagePreview} 
//                         alt="Event preview" 
//                         className="w-full h-56 object-cover rounded-lg border-2 border-gray-200"
//                       />
//                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
//                         <Button
//                           type="button"
//                           onClick={() => {
//                             setEventImage(null);
//                             setImagePreview('');
//                             setImageError('');
//                           }}
//                           variant="destructive"
//                           size="sm"
//                           className="opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X className="w-4 h-4 mr-1" />
//                           Remove
//                         </Button>
//                       </div>
//                       <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
//                         <CheckCircle className="w-3 h-3 mr-1" />
//                         Added
//                       </div>
//                     </div>
//                   ) : (
//                     <label className="block cursor-pointer">
//                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 transition-all">
//                         <div className="flex flex-col items-center justify-center text-center">
//                           <div className="bg-blue-100 p-4 rounded-full mb-3">
//                             <ImageIcon className="w-8 h-8 text-blue-600" />
//                           </div>
//                           <p className="text-sm font-semibold text-gray-700 mb-1">
//                             Click to upload event image
//                           </p>
//                           <p className="text-xs text-gray-500 mb-2">
//                             JPG, PNG or GIF (max 5MB)
//                           </p>
//                           <div className="flex items-center space-x-2 text-xs text-gray-400">
//                             <Upload className="w-3 h-3" />
//                             <span>Drag and drop or click to browse</span>
//                           </div>
//                         </div>
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageSelect}
//                         className="hidden"
//                       />
//                     </label>
//                   )}
                  
//                   {imageError && (
//                     <p className="text-red-500 text-xs mt-2 flex items-center">
//                       <X className="w-3 h-3 mr-1" />
//                       {imageError}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label>Event Title *</Label>
//                   <Input
//                     value={createEventForm.title}
//                     onChange={(e) => setCreateEventForm({...createEventForm, title: e.target.value})}
//                     placeholder="e.g., Sunday Brunch Meetup"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label>Event Type *</Label>
//                   <select
//                     value={createEventForm.eventType}
//                     onChange={(e) => setCreateEventForm({...createEventForm, eventType: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select type</option>
//                     <option value="dinner">Dinner</option>
//                     <option value="drinks">Drinks</option>
//                     <option value="coffee">Coffee</option>
//                     <option value="bowling">Bowling</option>
//                     <option value="movie">Movie</option>
//                     <option value="cultural">Cultural</option>
//                     <option value="sports">Sports</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 <div>
//                   <Label>Location *</Label>
//                   <Input
//                     value={createEventForm.location}
//                     onChange={(e) => setCreateEventForm({...createEventForm, location: e.target.value})}
//                     placeholder="e.g., Starbucks, Bandra"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Date *</Label>
//                     <Input
//                       type="date"
//                       value={createEventForm.date}
//                       onChange={(e) => setCreateEventForm({...createEventForm, date: e.target.value})}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label>Time *</Label>
//                     <Input
//                       type="time"
//                       value={createEventForm.time}
//                       onChange={(e) => setCreateEventForm({...createEventForm, time: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label>How many people in your group? *</Label>
//                   <select
//                     value={creatorGroupSize}
//                     onChange={(e) => setCreatorGroupSize(parseInt(e.target.value))}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="1">Just me (1 person)</option>
//                     <option value="2">Me + 1 friend (2 people)</option>
//                     <option value="3">Me + 2 friends (3 people)</option>
//                     <option value="4">Me + 3 friends (4 people)</option>
//                     <option value="5">Me + 4 friends (5 people)</option>
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     You'll pay ₹{calculateCreatorPayment(creatorGroupSize)} total (₹150 × {creatorGroupSize})
//                   </p>
//                 </div>

//                 <div>
//                   <Label>How many more people do you need? *</Label>
//                   <select
//                     value={additionalPeopleRange}
//                     onChange={(e) => setAdditionalPeopleRange(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select range</option>
//                     <option value="1-2">1-2 people</option>
//                     <option value="3-4">3-4 people</option>
//                     <option value="5-6">5-6 people</option>
//                     <option value="6+">6+ people</option>
//                     <option value="custom">Custom amount</option>
//                   </select>
//                 </div>

//                 {additionalPeopleRange === 'custom' && (
//                   <div>
//                     <Label>Custom number of people</Label>
//                     <Input
//                       type="number"
//                       value={customPeopleCount}
//                       onChange={(e) => setCustomPeopleCount(e.target.value)}
//                       min="1"
//                       max="20"
//                       placeholder="Enter number"
//                     />
//                   </div>
//                 )}

//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="girlsOnly"
//                     checked={isGirlsOnly}
//                     onChange={(e) => setIsGirlsOnly(e.target.checked)}
//                     className="w-4 h-4"
//                   />
//                   <Label htmlFor="girlsOnly">Girls Only Event</Label>
//                 </div>

//                 <div>
//                   <Label>Description (Optional)</Label>
//                   <textarea
//                     value={createEventForm.description}
//                     onChange={(e) => setCreateEventForm({...createEventForm, description: e.target.value})}
//                     placeholder="Tell people about your event..."
//                     className="w-full px-3 py-2 border rounded-md min-h-20"
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={isLoading || (!eventImage && !imagePreview)}
//                   className="w-full bg-black text-white hover:bg-gray-800"
//                 >
//                   {isLoading ? 'Processing...' : `Create Event & Pay ₹${calculateCreatorPayment(creatorGroupSize)}`}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* CREATE EVENT BUTTON */}
//         {!showCreateForm && (
//           <Card className="border-gray-200 border-dashed">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//                   CREATE YOUR OWN PLAN
//                 </h3>
//                 <Button 
//                   onClick={() => setShowCreateForm(true)}
//                   variant="outline" 
//                   className="w-full"
//                 >
//                   Create Event
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* CURATED EVENTS */}
//         {hasCuratedEvents && (
//           <div>
//             <h2 className="text-lg mb-4 flex items-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//               <span className="mr-2">⭐</span>
//               Curated Events
//             </h2>
            
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">Loading events...</p>
//               </div>
//             ) : (
//               <div className="space-y-4 mb-8">
//                 {curatedGroups.map((group) => {
//                   const userInGroup = isUserInGroup(group);
//                   const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                   const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                   const isFull = selectedEvent.spots_left === 0;
                  
//                   return (
//                     <Card key={group.title} className="border-2 border-purple-200 bg-purple-50">
//                       {group.image_url && (
//                         <img 
//                           src={group.image_url} 
//                           alt={group.title}
//                           className="w-full h-48 object-cover rounded-t-lg"
//                         />
//                       )}
//                       <CardHeader className="pb-3">
//                         <div className="flex justify-between items-start mb-3">
//                           <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                             {group.title}
//                           </CardTitle>
//                           <div className="flex flex-col gap-2">
//                             <Badge className="bg-purple-600 text-white">Curated</Badge>
//                             <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                               {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                             </Badge>
//                           </div>
//                         </div>

//                         <div className="flex flex-wrap gap-2 mb-3">
//                           {group.dates.map((dateOption) => {
//                             const isSelected = selectedEventId === dateOption.id;
//                             return (
//                               <button
//                                 key={dateOption.id}
//                                 onClick={() => setSelectedDates(prev => ({
//                                   ...prev,
//                                   [group.title]: dateOption.id
//                                 }))}
//                                 className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                                 style={{ 
//                                   fontFamily: 'Poppins, sans-serif',
//                                   backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                   color: isSelected ? '#ffffff' : '#374151',
//                                   boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                                 }}
//                               >
//                                 {formatMeetupDate(dateOption.date, dateOption.time)}
//                               </button>
//                             );
//                           })}
//                         </div>

//                         <div className="flex items-center space-x-1 text-sm text-gray-600">
//                           <MapPin className="w-4 h-4" />
//                           <span>{group.location}</span>
//                         </div>
//                       </CardHeader>
                      
//                       <CardContent>
//                         <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                         <div className="flex items-center justify-between mb-3">
//                           <span className="text-lg font-bold text-purple-700">₹150 per person</span>
//                         </div>
//                         <div className="flex justify-end">
//                           {userInGroup ? (
//                             <Button
//                               onClick={() => handleOpenChat(group.title)}
//                               className="bg-blue-600 text-white hover:bg-blue-700"
//                             >
//                               <MessageCircle className="w-4 h-4 mr-2" />
//                               Open Chat
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={() => handleJoinEvent(selectedEvent.id)}
//                               disabled={isFull}
//                               className="bg-purple-600 text-white hover:bg-purple-700"
//                             >
//                               {isFull ? 'Fully Booked' : 'Join for ₹150'}
//                             </Button>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* RECOMMENDED EVENTS */}
//         <div>
//           <h2 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
//             Recommended Events
//           </h2>
          
//           {isLoading ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Loading events...</p>
//             </div>
//           ) : recommendedGroups.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No events available in this category right now.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recommendedGroups.map((group) => {
//                 const userInGroup = isUserInGroup(group);
//                 const selectedEventId = selectedDates[group.title] || group.dates[0].id;
//                 const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
//                 const isFull = selectedEvent.spots_left === 0;
                
//                 return (
//                   <Card key={group.title} className="border-gray-200">
//                     {group.image_url && (
//                       <img 
//                         src={group.image_url} 
//                         alt={group.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                       />
//                     )}
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start mb-3">
//                         <CardTitle className="text-lg flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                           {group.title}
//                         </CardTitle>
//                         <Badge variant={selectedEvent.spots_left > 0 ? "default" : "secondary"}>
//                           {isFull ? 'FULL' : `${selectedEvent.spots_left} spots`}
//                         </Badge>
//                       </div>

//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {group.dates.map((dateOption) => {
//                           const isSelected = selectedEventId === dateOption.id;
//                           return (
//                             <button
//                               key={dateOption.id}
//                               onClick={() => setSelectedDates(prev => ({
//                                 ...prev,
//                                 [group.title]: dateOption.id
//                               }))}
//                               className="px-4 py-2 rounded-full text-sm font-medium transition-all"
//                               style={{ 
//                                 fontFamily: 'Poppins, sans-serif',
//                                 backgroundColor: isSelected ? '#1f2937' : '#f3f4f6',
//                                 color: isSelected ? '#ffffff' : '#374151',
//                                 boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
//                               }}
//                             >
//                               {formatMeetupDate(dateOption.date, dateOption.time)}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div className="flex items-center space-x-1 text-sm text-gray-600">
//                         <MapPin className="w-4 h-4" />
//                         <span>{group.location}</span>
//                       </div>
//                     </CardHeader>
                    
//                     <CardContent>
//                       <p className="text-sm text-gray-600 mb-3">{group.description}</p>
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-lg font-bold text-black">₹150 per person</span>
//                       </div>
//                       <div className="flex justify-end">
//                         {userInGroup ? (
//                           <Button
//                             onClick={() => handleOpenChat(group.title)}
//                             className="bg-blue-600 text-white hover:bg-blue-700"
//                           >
//                             <MessageCircle className="w-4 h-4 mr-2" />
//                             Open Chat
//                           </Button>
//                         ) : (
//                           <Button
//                             onClick={() => handleJoinEvent(selectedEvent.id)}
//                             disabled={isFull}
//                             className="bg-black text-white hover:bg-gray-800"
//                           >
//                             {isFull ? 'Fully Booked' : 'Join for ₹150'}
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
//         <div className="max-w-md mx-auto">
//           <Button onClick={() => onNavigate('dashboard')} variant="outline" className="w-full">
//             My Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }









































import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserProfile } from '../App';
import { MapPin, Users, MessageCircle, Clock, X, Upload, ImageIcon, CheckCircle } from 'lucide-react';
import { db, analytics } from '../utils/supabase';
import { BrandHeader } from './BrandHeader';

interface EventsPageProps {
  profile: UserProfile;
  userId: string | null;
  onSelectEvent: (eventId: string) => void;
  onNavigate: (screen: string) => void;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  spots_left: number;
  total_spots: number;
  participants: string[];
  price: number;
  category: string;
  description: string;
  created_by?: string;
  event_filled?: boolean;
  min_participants?: number;
  creator_paid?: boolean;
  city?: string;
  image_url?: string;
  status?: string;
}

interface GroupedEvent {
  title: string;
  category: string;
  location: string;
  description: string;
  price: number;
  image_url?: string;
  dates: Event[];
  isCreatedByUser: boolean;
}

export function EventsPage({ profile, userId, onSelectEvent, onNavigate }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGirlsOnly, setIsGirlsOnly] = useState(false);
  const [creatorGroupSize, setCreatorGroupSize] = useState<number>(1);
  const [additionalPeopleRange, setAdditionalPeopleRange] = useState<string>('');
  const [customPeopleCount, setCustomPeopleCount] = useState<string>('');
  const [userPaidEvents, setUserPaidEvents] = useState<Set<string>>(new Set());
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  
  const [createEventForm, setCreateEventForm] = useState({
    title: '',
    eventType: '',
    location: '',
    date: '',
    time: '',
    description: '',
  });

  const EVENT_ORDER = [
    'After-Work Drinks',
    'Tech Geeks / Coders Kismat Circle',
    'Introverts Socialising',
    'Founders + Startup Networking',
    'Comic / Anime / Geek Kismat Circle',
    'Yoga Enthusiasts',
    'Tall Folks Kismat Circle',
    'Short Folks Kismat Circle',
    'Moms Walk',
    'Dads Walk',
    'Filmmakers / Actors Meetup'
  ];

  const EVENT_IMAGES: Record<string, string> = {
    'After-Work Drinks': '/events/after-work-drinks.jpg',
    'Tech Geeks / Coders Kismat Circle': '/events/tech-geeks.jpg',
    'Introverts Socialising': '/events/introverts.jpg',
    'Founders + Startup Networking': '/events/founders-networking.jpg',
    'Comic / Anime / Geek Kismat Circle': '/events/comic-anime-geek.jpg',
    'Yoga Enthusiasts': '/events/yoga.jpg',
    'Tall Folks Kismat Circle': '/events/tall-folks.jpg',
    'Short Folks Kismat Circle': '/events/short-folks.jpg',
    'Moms Walk': '/events/moms-walk.jpg',
    'Dads Walk': '/events/dads-walk.jpg',
    'Filmmakers / Actors Meetup': '/events/filmmakers-actors.jpg'
  };

  useEffect(() => {
    console.log('🔄 EventsPage mounted, loading events...');
    loadEvents();
    loadUserPaidEvents();
    
    if (analytics) {
      analytics.trackVisit('events_page');
    }

    checkForSavedFormData();
  }, [userId, profile.location.city]);

  const checkForSavedFormData = () => {
    const savedFormData = localStorage.getItem('pendingEventCreation');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        setCreateEventForm({
          title: formData.title || '',
          eventType: formData.eventType || '',
          location: formData.location || '',
          date: formData.date || '',
          time: formData.time || '',
          description: formData.description || '',
        });
        setCreatorGroupSize(formData.creatorGroupSize || 1);
        setAdditionalPeopleRange(formData.additionalPeopleRange || '');
        setCustomPeopleCount(formData.customPeopleCount || '');
        setIsGirlsOnly(formData.isGirlsOnly || false);
        setImagePreview(formData.imagePreview || '');
        setShowCreateForm(true);
        console.log('✅ Restored form data from localStorage');
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  };

  const parseEventDate = (dateString: string): Date | null => {
    try {
      const months: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const parts = dateString.split(' ');
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      if (isNaN(day) || month === undefined || isNaN(year)) return null;
      return new Date(year, month, day);
    } catch (error) {
      return null;
    }
  };

  const formatMeetupDate = (dateString: string, timeString: string): string => {
    try {
      const parts = dateString.split(' ');
      if (parts.length !== 3) return dateString;
      return `${parts[0]} ${parts[1]} @ ${timeString.toLowerCase()}`;
    } catch (error) {
      return dateString;
    }
  };

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      console.log('📥 Loading events for user in city:', profile.location.city);
      console.log('👤 User gender:', profile.gender);
      
      const result = await db.getEvents(false, profile.gender);
      console.log('📦 Raw events received:', result.events?.length);
      
      if (result.events) {
        console.log('🔍 Filtering events...');
        
        // Filter by city
        let cityEvents = result.events.filter((event: Event) => {
          const userCity = profile.location.city?.trim().toLowerCase();
          const eventCity = event.city?.trim().toLowerCase();
          
          console.log(`Event: "${event.title}" | Event City: "${eventCity}" | User City: "${userCity}" | Status: ${event.status}`);
          
          // Show events from user's city OR events with no city set
          const matchesCity = !eventCity || eventCity === userCity;
          
          // Only show APPROVED events
          const isApproved = event.status === 'approved';
          
          const shouldShow = matchesCity && isApproved;
          
          if (!shouldShow) {
            console.log(`❌ Filtered out: "${event.title}" - City match: ${matchesCity}, Approved: ${isApproved}`);
          } else {
            console.log(`✅ Showing: "${event.title}"`);
          }
          
          return shouldShow;
        });

        console.log('🏙️ After city filter:', cityEvents.length, 'events');

        // Filter out EXPIRED events (events that have passed their date/time)
        const now = new Date();
        const futureEvents = cityEvents.filter((event: Event) => {
          // If date is TBD or empty, show the event (it's a template/curated event)
          if (!event.date || event.date.trim().toUpperCase() === 'TBD' || event.date.trim() === '') {
            console.log(`✅ Showing TBD event: "${event.title}"`);
            return true;
          }
          
          const eventDate = parseEventDate(event.date);
          if (!eventDate) {
            // If we can't parse the date, show it anyway (might be a template)
            console.log(`⚠️ Could not parse date for "${event.title}", showing anyway`);
            return true;
          }
          
          // Parse time and set it on the event date
          const timeParts = event.time?.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeParts) {
            let hours = parseInt(timeParts[1]);
            const minutes = parseInt(timeParts[2]);
            const isPM = timeParts[3].toUpperCase() === 'PM';
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            eventDate.setHours(hours, minutes, 0, 0);
          } else if (event.time) {
            // Try 24-hour format (HH:MM)
            const time24 = event.time.match(/(\d{1,2}):(\d{2})/);
            if (time24) {
              eventDate.setHours(parseInt(time24[1]), parseInt(time24[2]), 0, 0);
            }
          }
          
          // Event expires after its date/time - filter out past events
          const isExpired = eventDate < now;
          
          if (isExpired) {
            console.log(`⏰ Event expired: "${event.title}" - Date: ${event.date} ${event.time || ''}`);
          }
          
          return !isExpired; // Only show future events
        });

        console.log('📅 After date filter:', futureEvents.length, 'events');
        console.log('✅ Final events:', futureEvents.map(e => ({ title: e.title, city: e.city, status: e.status })));

        setEvents(futureEvents);
      }
    } catch (error) {
      console.error('❌ Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPaidEvents = async () => {
    if (!userId) return;
    try {
      const result = await db.getUserEvents(userId);
      if (result.events) {
        const paidEventIds = new Set(result.events.map((e: any) => e.id));
        setUserPaidEvents(paidEventIds);
        console.log('💰 User paid events:', paidEventIds.size);
      }
    } catch (error) {
      console.error('Error loading user events:', error);
    }
  };

  const groupEvents = (eventsList: Event[]): GroupedEvent[] => {
    const grouped = new Map<string, Event[]>();
    
    eventsList.forEach(event => {
      const key = event.title.trim();
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    });

    const result: GroupedEvent[] = [];
    
    grouped.forEach((dates, title) => {
      const sorted = dates.sort((a, b) => {
        const dateA = parseEventDate(a.date);
        const dateB = parseEventDate(b.date);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
      });

      const next3Dates = sorted.slice(0, 3);
      const isCreatedByUser = next3Dates.some(e => e.created_by === userId);

      if (next3Dates.length > 0) {
        result.push({
          title,
          category: next3Dates[0].category,
          location: next3Dates[0].location,
          description: next3Dates[0].description,
          price: next3Dates[0].price,
          image_url: EVENT_IMAGES[title] || next3Dates[0].image_url,
          dates: next3Dates,
          isCreatedByUser
        });
      }
    });

    return result.sort((a, b) => {
      if (a.isCreatedByUser && !b.isCreatedByUser) return -1;
      if (!a.isCreatedByUser && b.isCreatedByUser) return 1;
      const aIndex = EVENT_ORDER.indexOf(a.title);
      const bIndex = EVENT_ORDER.indexOf(b.title);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.title.localeCompare(b.title);
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file');
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError('Image must be less than 5MB');
      return;
    }
    setEventImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!userId) {
      alert('Please log in to join events');
      return;
    }
    localStorage.setItem('pendingJoinEventId', eventId);
    localStorage.setItem('pendingJoinUserId', userId);
    localStorage.setItem('pendingJoinUserName', profile.name);
    onSelectEvent(eventId);
    onNavigate('payment');
  };

  const handleOpenChat = (groupTitle: string) => {
    const userEvent = events.find(e => 
      e.title === groupTitle && userPaidEvents.has(e.id)
    );
    if (userEvent) {
      onSelectEvent(userEvent.id);
      onNavigate('chat');
    }
  };

  const isUserInGroup = (group: GroupedEvent) => {
    if (!userId) return false;
    return group.dates.some(event => {
      const hasPaid = userPaidEvents.has(event.id);
      const isCreatorAndPaid = event.created_by === userId && event.creator_paid === true;
      return hasPaid || isCreatorAndPaid;
    });
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventImage && !imagePreview) {
      alert('Please upload an event image');
      return;
    }
    if (!createEventForm.title || !createEventForm.eventType || !createEventForm.location || 
        !createEventForm.date || !createEventForm.time) {
      alert('Please fill in all required fields');
      return;
    }
    if (!additionalPeopleRange) {
      alert('Please select how many additional people you need');
      return;
    }
    setIsLoading(true);
    try {
      let imageUrl = imagePreview; // Default to existing preview if available
      
      // Upload image to Supabase if we have a new file
      if (eventImage && userId) {
        console.log('📤 Uploading event image...');
        const uploadResult = await db.uploadEventImage(eventImage, userId);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          console.log('✅ Image uploaded successfully:', imageUrl);
        } else {
          console.error('❌ Image upload failed:', uploadResult.error);
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      let additionalPeople: number;
      if (additionalPeopleRange === 'custom') {
        additionalPeople = parseInt(customPeopleCount) || 1;
      } else if (additionalPeopleRange === '6+') {
        additionalPeople = 10;
      } else {
        additionalPeople = parseInt(additionalPeopleRange.split('-')[1]);
      }
      const totalSpots = creatorGroupSize + additionalPeople;
      const creatorPaymentAmount = creatorGroupSize * 150;
      
      const formDataToSave = {
        title: createEventForm.title,
        eventType: createEventForm.eventType,
        location: createEventForm.location,
        date: createEventForm.date,
        time: createEventForm.time,
        description: createEventForm.description,
        creatorGroupSize,
        additionalPeopleRange,
        customPeopleCount,
        isGirlsOnly,
        totalSpots,
        additionalPeople,
        imageUrl, // Use the uploaded URL
        imagePreview: imageUrl, // Keep for backward compatibility
        userId,
        username: profile.name,
        city: profile.location.city,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem('pendingEventCreation', JSON.stringify(formDataToSave));
      localStorage.setItem('pendingCreatorPayment', JSON.stringify({
        amount: creatorPaymentAmount,
        type: 'event_creation',
        groupSize: creatorGroupSize,
        eventTitle: createEventForm.title,
        userId,
        username: profile.name,
      }));
      console.log('💾 Form data saved to localStorage with image URL:', imageUrl);
      onNavigate('payment');
    } catch (error) {
      console.error('Error preparing event creation:', error);
      alert('Failed to prepare event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryFromEventType = (eventType: string): string => {
    const categoryMap: Record<string, string> = {
      'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
      'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
      'sports': 'sports', 'other': 'activities'
    };
    return categoryMap[eventType] || 'activities';
  };

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'food', label: 'Food & Drinks' },
    { id: 'activities', label: 'Activities' },
    { id: 'sports', label: 'Sports' }
  ];

  const groupedEvents = groupEvents(events);
  const filteredGroups = selectedCategory === 'all' 
    ? groupedEvents 
    : groupedEvents.filter(g => g.category === selectedCategory);

  const calculateCreatorPayment = (groupSize: number) => groupSize * 150;

  return (
    <section className="kismat-screen kismat-screen--scroll" data-page="events">
      <div className="kismat-panel">
        <div className="kismat-panel__content">
          <BrandHeader
            align="left"
            title={`Hey ${profile.name}!`}
            subtitle={`Find your people in ${profile.location.city}`}
            badge={
              <Button
                onClick={() => onNavigate('dashboard')}
                variant="ghost"
                size="sm"
                className="kismat-btn--ghost"
              >
                <Users className="w-4 h-4" />
          </Button>
            }
          />

          <div className="kismat-category-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`kismat-category-tab ${
                  selectedCategory === category.id ? 'kismat-category-tab--active' : ''
                }`}
              >
                {category.label}
              </button>
            ))}
        </div>

        {showCreateForm && (
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Create Your Event</CardTitle>
                <Button onClick={() => {
                    setShowCreateForm(false);
                    setCreateEventForm({ title: '', eventType: '', location: '', date: '', time: '', description: '' });
                    setEventImage(null);
                    setImagePreview('');
                    setCreatorGroupSize(1);
                    setAdditionalPeopleRange('');
                    setCustomPeopleCount('');
                    setIsGirlsOnly(false);
                  }} variant="ghost" size="sm">
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEventSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Event Image * (Required)</Label>
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="Event preview" className="w-full h-56 object-cover rounded-lg border-2 border-gray-200"/>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        <Button type="button" onClick={() => { setEventImage(null); setImagePreview(''); setImageError(''); }}
                          variant="destructive" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4 mr-1" />Remove
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />Added
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="bg-blue-100 p-4 rounded-full mb-3">
                            <ImageIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload event image</p>
                          <p className="text-xs text-gray-500 mb-2">JPG, PNG or GIF (max 5MB)</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Upload className="w-3 h-3" />
                            <span>Drag and drop or click to browse</span>
                          </div>
                        </div>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden"/>
                    </label>
                  )}
                  {imageError && (
                    <p className="text-red-500 text-xs mt-2 flex items-center">
                      <X className="w-3 h-3 mr-1" />{imageError}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Event Title *</Label>
                  <Input value={createEventForm.title}
                    onChange={(e) => setCreateEventForm({...createEventForm, title: e.target.value})}
                    placeholder="e.g., Sunday Brunch Meetup" required/>
                </div>
                <div>
                  <Label>Event Type *</Label>
                  <select value={createEventForm.eventType}
                    onChange={(e) => setCreateEventForm({...createEventForm, eventType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md" required>
                    <option value="">Select type</option>
                    <option value="dinner">Dinner</option>
                    <option value="drinks">Drinks</option>
                    <option value="coffee">Coffee</option>
                    <option value="bowling">Bowling</option>
                    <option value="movie">Movie</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input value={createEventForm.location}
                    onChange={(e) => setCreateEventForm({...createEventForm, location: e.target.value})}
                    placeholder="e.g., Starbucks, Bandra" required/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Date *</Label>
                    <Input type="date" value={createEventForm.date}
                      onChange={(e) => setCreateEventForm({...createEventForm, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]} required/>
                  </div>
                  <div>
                    <Label>Time *</Label>
                    <Input type="time" value={createEventForm.time}
                      onChange={(e) => setCreateEventForm({...createEventForm, time: e.target.value})} required/>
                  </div>
                </div>
                <div>
                  <Label>How many people in your group? *</Label>
                  <select value={creatorGroupSize} onChange={(e) => setCreatorGroupSize(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md" required>
                    <option value="1">Just me (1 person)</option>
                    <option value="2">Me + 1 friend (2 people)</option>
                    <option value="3">Me + 2 friends (3 people)</option>
                    <option value="4">Me + 3 friends (4 people)</option>
                    <option value="5">Me + 4 friends (5 people)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    You'll pay ₹{calculateCreatorPayment(creatorGroupSize)} total (₹150 × {creatorGroupSize})
                  </p>
                </div>
                <div>
                  <Label>How many more people do you need? *</Label>
                  <select value={additionalPeopleRange} onChange={(e) => setAdditionalPeopleRange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md" required>
                    <option value="">Select range</option>
                    <option value="1-2">1-2 people</option>
                    <option value="3-4">3-4 people</option>
                    <option value="5-6">5-6 people</option>
                    <option value="6+">6+ people</option>
                    <option value="custom">Custom amount</option>
                  </select>
                </div>
                {additionalPeopleRange === 'custom' && (
                  <div>
                    <Label>Custom number of people</Label>
                    <Input type="number" value={customPeopleCount}
                      onChange={(e) => setCustomPeopleCount(e.target.value)}
                      min="1" max="20" placeholder="Enter number"/>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="girlsOnly" checked={isGirlsOnly}
                    onChange={(e) => setIsGirlsOnly(e.target.checked)} className="w-4 h-4"/>
                  <Label htmlFor="girlsOnly">Girls Only Event</Label>
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <textarea value={createEventForm.description}
                    onChange={(e) => setCreateEventForm({...createEventForm, description: e.target.value})}
                    placeholder="Tell people about your event..." className="w-full px-3 py-2 border rounded-md min-h-20"/>
                </div>
                <Button type="submit" disabled={isLoading || (!eventImage && !imagePreview)}
                  className="w-full bg-black text-white hover:bg-gray-800">
                  {isLoading ? 'Processing...' : `Create Event & Pay ₹${calculateCreatorPayment(creatorGroupSize)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!showCreateForm && (
          <Card className="border-gray-200 border-dashed">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                  CREATE YOUR OWN PLAN
                </h3>
                <Button onClick={() => setShowCreateForm(true)} variant="outline" className="w-full">
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
            <h3 className="kismat-section-title">Join existing activities</h3>
          
          {isLoading ? (
              <div className="kismat-empty">
                <div className="kismat-loader mx-auto mb-4" />
                <p>Loading events...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
              <div className="kismat-empty">
                <p>No upcoming events found in {profile.location.city}</p>
                <p className="text-sm mt-2 opacity-75">Be the first to create one!</p>
            </div>
          ) : (
              <div className="kismat-events-grid">
              {filteredGroups.map((group) => {
                const userInGroup = isUserInGroup(group);
                const selectedEventId = selectedDates[group.title] || group.dates[0].id;
                const selectedEvent = group.dates.find(e => e.id === selectedEventId) || group.dates[0];
                const isFull = selectedEvent.spots_left === 0;
                
                return (
                    <div key={group.title} className="kismat-event-card">
                    {group.image_url && (
                        <img 
                          src={group.image_url} 
                          alt={group.title} 
                          className="kismat-event-card__image"
                        />
                    )}
                      
                          {group.isCreatedByUser && (
                        <div className="kismat-event-card__badge">Your Event</div>
                          )}
                      
                      <div className="kismat-event-card__content">
                        <h4 className="kismat-event-card__title">{group.title}</h4>
                        
                        <div className="kismat-event-card__meta">
                          <span className="kismat-chip">
                            <MapPin className="w-3 h-3" />
                            {group.location || 'Location TBD'}
                          </span>
                          <span className="kismat-chip">
                            <Users className="w-3 h-3" />
                            {isFull ? 'FULL' : `${selectedEvent.spots_left} spots left`}
                          </span>
                          <span className="kismat-chip">
                            <Clock className="w-3 h-3" />
                            ₹{selectedEvent.price || 150}
                          </span>
                          {selectedEvent.girls_only && (
                            <span className="kismat-chip" style={{ background: 'rgba(255, 182, 193, 0.2)', color: '#d63384' }}>
                              👩 Girls Only
                            </span>
                          )}
                          {selectedEvent.event_filled && (
                            <span className="kismat-chip" style={{ background: 'rgba(40, 167, 69, 0.2)', color: '#28a745' }}>
                              💬 Chat Active
                            </span>
                          )}
                        </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {group.dates.map((dateOption) => (
                            <button
                              key={dateOption.id}
                              onClick={() => setSelectedDates(prev => ({
                              ...prev, [group.title]: dateOption.id
                            }))}
                              className={`kismat-chip cursor-pointer transition-all ${
                              selectedEventId === dateOption.id
                                  ? 'bg-white text-[#c83838] font-semibold'
                                  : 'hover:bg-white/20'
                              }`}
                            >
                            {formatMeetupDate(dateOption.date, dateOption.time)}
                          </button>
                        ))}
                      </div>

                        <p className="text-sm opacity-80 mb-4 line-clamp-2">{group.description}</p>
                        
                        <div className="kismat-event-card__details">
                          <div className="flex justify-between items-center text-xs opacity-75 mb-3">
                            <span>Min: {selectedEvent.min_participants || 2} people</span>
                            <span>Max: {selectedEvent.max_participants || selectedEvent.total_spots} people</span>
                      </div>
                          
                          {selectedEvent.total_spots && (
                            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                              <div 
                                className="bg-gradient-to-r from-[#c83838] to-[#ff6b6b] h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.max(10, ((selectedEvent.total_spots - selectedEvent.spots_left) / selectedEvent.total_spots) * 100)}%` 
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="kismat-event-card__actions">
                        {userInGroup ? (
                            <Button
                              onClick={() => handleOpenChat(group.title)}
                              className="flex-1"
                              variant="secondary"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Open Chat
                          </Button>
                        ) : (
                            <Button
                              onClick={() => handleJoinEvent(selectedEvent.id)}
                              disabled={isFull}
                              className="flex-1"
                            >
                              {isFull ? 'Fully Booked' : `Join Event - ₹${selectedEvent.price || 150}`}
                          </Button>
                        )}
                      </div>
                      </div>
                    </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
        </div>
    </section>
  );
}