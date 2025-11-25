

// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Badge } from './ui/badge';
// import { db } from '../utils/supabase';
// import { CheckCircle, XCircle, Trash2, Plus, Upload } from 'lucide-react';

// interface AdminDashboardProps {
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
//   category: string;
//   status: string;
//   is_curated: boolean;
//   image_url?: string;
//   created_at: string;
// }

// export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [curatedEvents, setCuratedEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCuratedForm, setShowCuratedForm] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
  
//   const [curatedForm, setCuratedForm] = useState({
//     title: '',
//     description: '',
//     category: '',
//     location: '',
//     date: '',
//     time: '',
//     totalSpots: '10',
//   });

//   useEffect(() => {
//     loadAllEvents();
//   }, []);

//   const loadAllEvents = async () => {
//     setIsLoading(true);
//     try {
//       // Load regular events (pending approval)
//       const result = await db.getEvents(true); // true = admin mode, gets all events
//       if (result.events) {
//         const pending = result.events.filter((e: Event) => !e.is_curated && e.status === 'pending');
//         setEvents(pending);
        
//         const curated = result.events.filter((e: Event) => e.is_curated);
//         setCuratedEvents(curated);
//       }
//     } catch (error) {
//       console.error('Error loading events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateCuratedEvent = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!selectedImage) {
//       alert('Please upload an event image');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Upload image first
//       const imageResult = await db.uploadEventImage(selectedImage, 'admin');
//       if (!imageResult.success || !imageResult.url) {
//         alert('Failed to upload image');
//         setIsLoading(false);
//         return;
//       }

//       // Create curated event
//       const eventData = {
//         title: curatedForm.title,
//         description: curatedForm.description,
//         category: curatedForm.category,
//         location: curatedForm.location,
//         date: curatedForm.date,
//         time: curatedForm.time,
//         total_spots: parseInt(curatedForm.totalSpots),
//         spots_left: parseInt(curatedForm.totalSpots),
//         price: 150, // Always ₹150
//         image_url: imageResult.url,
//         is_curated: true,
//         status: 'approved',
//         created_by: 'admin'
//       };

//       const result = await db.createCuratedEvent(eventData);
      
//       if (result.success) {
//         alert('✅ Curated event created successfully!');
        
//         // Reset form
//         setCuratedForm({
//           title: '',
//           description: '',
//           category: '',
//           location: '',
//           date: '',
//           time: '',
//           totalSpots: '10',
//         });
//         setSelectedImage(null);
//         setImagePreview('');
//         setShowCuratedForm(false);
        
//         // Reload events
//         loadAllEvents();
//       } else {
//         alert(`Failed to create event: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error creating curated event:', error);
//       alert('Failed to create curated event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleApproveEvent = async (eventId: string) => {
//     try {
//       const result = await db.updateEventStatus(eventId, 'approved');
//       if (result.success) {
//         alert('✅ Event approved!');
//         loadAllEvents();
//       } else {
//         alert('Failed to approve event');
//       }
//     } catch (error) {
//       console.error('Error approving event:', error);
//     }
//   };

//   const handleRejectEvent = async (eventId: string) => {
//     if (confirm('Are you sure you want to reject this event?')) {
//       try {
//         const result = await db.updateEventStatus(eventId, 'rejected');
//         if (result.success) {
//           alert('❌ Event rejected');
//           loadAllEvents();
//         } else {
//           alert('Failed to reject event');
//         }
//       } catch (error) {
//         console.error('Error rejecting event:', error);
//       }
//     }
//   };

//   const handleDeleteCuratedEvent = async (eventId: string) => {
//     if (confirm('Are you sure you want to delete this curated event?')) {
//       try {
//         const result = await db.deleteEvent(eventId);
//         if (result.success) {
//           alert('🗑️ Event deleted');
//           loadAllEvents();
//         } else {
//           alert('Failed to delete event');
//         }
//       } catch (error) {
//         console.error('Error deleting event:', error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-black text-white px-6 py-8">
//         <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-300 text-sm mt-1">Manage events and approvals</p>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         {/* CREATE CURATED EVENT SECTION */}
//         <Card className="border-2 border-purple-500">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-purple-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                 ⭐ Create Curated Event
//               </CardTitle>
//               <Button
//                 onClick={() => setShowCuratedForm(!showCuratedForm)}
//                 variant="outline"
//                 size="sm"
//               >
//                 {showCuratedForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> New Curated Event</>}
//               </Button>
//             </div>
//           </CardHeader>
          
//           {showCuratedForm && (
//             <CardContent>
//               <form onSubmit={handleCreateCuratedEvent} className="space-y-4">
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
//                           setSelectedImage(null);
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
//                       <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                         <div className="text-center">
//                           <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                           <span className="text-sm text-gray-500">Click to upload image</span>
//                         </div>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   )}
//                 </div>

//                 {/* Event Title */}
//                 <div>
//                   <Label>Event Title *</Label>
//                   <Input
//                     value={curatedForm.title}
//                     onChange={(e) => setCuratedForm({...curatedForm, title: e.target.value})}
//                     placeholder="e.g., Premium Wine Tasting Evening"
//                     required
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <Label>Description *</Label>
//                   <textarea
//                     value={curatedForm.description}
//                     onChange={(e) => setCuratedForm({...curatedForm, description: e.target.value})}
//                     placeholder="Describe this curated experience..."
//                     className="w-full px-3 py-2 border rounded-md min-h-24"
//                     required
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <Label>Category *</Label>
//                   <select
//                     value={curatedForm.category}
//                     onChange={(e) => setCuratedForm({...curatedForm, category: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select category</option>
//                     <option value="food">Food & Drinks</option>
//                     <option value="activities">Activities</option>
//                     <option value="sports">Sports</option>
//                     <option value="wellness">Wellness</option>
//                     <option value="social">Social</option>
//                     <option value="nightlife">Nightlife</option>
//                   </select>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <Label>Location *</Label>
//                   <Input
//                     value={curatedForm.location}
//                     onChange={(e) => setCuratedForm({...curatedForm, location: e.target.value})}
//                     placeholder="e.g., The Wine Company, Bandra"
//                     required
//                   />
//                 </div>

//                 {/* Date and Time */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Date *</Label>
//                     <Input
//                       type="date"
//                       value={curatedForm.date}
//                       onChange={(e) => setCuratedForm({...curatedForm, date: e.target.value})}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label>Time *</Label>
//                     <Input
//                       type="time"
//                       value={curatedForm.time}
//                       onChange={(e) => setCuratedForm({...curatedForm, time: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Total Spots */}
//                 <div>
//                   <Label>Total Spots *</Label>
//                   <Input
//                     type="number"
//                     value={curatedForm.totalSpots}
//                     onChange={(e) => setCuratedForm({...curatedForm, totalSpots: e.target.value})}
//                     min="2"
//                     max="50"
//                     required
//                   />
//                 </div>

//                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                   <p className="text-sm text-purple-800">
//                     💎 <strong>Curated Event</strong> - Price: ₹150 per person
//                   </p>
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading || !selectedImage}
//                   className="w-full bg-purple-600 text-white hover:bg-purple-700"
//                 >
//                   {isLoading ? 'Creating...' : 'Create Curated Event'}
//                 </Button>
//               </form>
//             </CardContent>
//           )}
//         </Card>

//         {/* EXISTING CURATED EVENTS */}
//         {curatedEvents.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//                 ⭐ Curated Events ({curatedEvents.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {curatedEvents.map(event => (
//                 <div key={event.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
//                   {event.image_url && (
//                     <img 
//                       src={event.image_url} 
//                       alt={event.title}
//                       className="w-full h-32 object-cover rounded-lg mb-3"
//                     />
//                   )}
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-purple-900">{event.title}</h3>
//                       <p className="text-sm text-purple-700">{event.location}</p>
//                       <p className="text-xs text-purple-600 mt-1">{event.date} @ {event.time}</p>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <Badge className="bg-purple-600 text-white">Curated</Badge>
//                       <span className="text-sm font-bold">₹150</span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3">{event.description}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-600">{event.spots_left}/{event.total_spots} spots left</span>
//                     <Button
//                       onClick={() => handleDeleteCuratedEvent(event.id)}
//                       variant="destructive"
//                       size="sm"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         )}

//         {/* PENDING APPROVAL EVENTS */}
//         <Card>
//           <CardHeader>
//             <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Pending User Events ({events.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {isLoading ? (
//               <p className="text-center py-8 text-gray-500">Loading...</p>
//             ) : events.length === 0 ? (
//               <p className="text-center py-8 text-gray-500">No events pending approval</p>
//             ) : (
//               events.map(event => (
//                 <div key={event.id} className="border rounded-lg p-4">
//                   {event.image_url && (
//                     <img 
//                       src={event.image_url} 
//                       alt={event.title}
//                       className="w-full h-32 object-cover rounded-lg mb-3"
//                     />
//                   )}
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h3 className="font-semibold">{event.title}</h3>
//                       <p className="text-sm text-gray-600">{event.location}</p>
//                       <p className="text-xs text-gray-500 mt-1">{event.date} @ {event.time}</p>
//                     </div>
//                     <Badge variant="outline" className="text-yellow-600 border-yellow-600">
//                       Pending
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3">{event.description}</p>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       onClick={() => handleApproveEvent(event.id)}
//                       className="flex-1 bg-green-600 text-white hover:bg-green-700"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-2" />
//                       Approve
//                     </Button>
//                     <Button
//                       onClick={() => handleRejectEvent(event.id)}
//                       variant="destructive"
//                       className="flex-1"
//                     >
//                       <XCircle className="w-4 h-4 mr-2" />
//                       Reject
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>

//         {/* Back Button */}
//         <Button
//           onClick={() => onNavigate('events')}
//           variant="outline"
//           className="w-full"
//         >
//           Back to Events
//         </Button>
//       </div>
//     </div>
//   );
// }
































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Badge } from './ui/badge';
// import { db, supabase } from '../utils/supabase';
// import { CheckCircle, XCircle, Trash2, Plus, Upload } from 'lucide-react';

// interface AdminDashboardProps {
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
//   category: string;
//   status: string;
//   is_curated: boolean;
//   image_url?: string;
//   created_at: string;
// }

// export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [curatedEvents, setCuratedEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCuratedForm, setShowCuratedForm] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
  
//   const [curatedForm, setCuratedForm] = useState({
//     title: '',
//     description: '',
//     category: '',
//     location: '',
//     date: '',
//     time: '',
//     totalSpots: '10',
//   });

//   useEffect(() => {
//     loadAllEvents();
//   }, []);

//   const loadAllEvents = async () => {
//     setIsLoading(true);
//     try {
//       // Load regular events (pending approval)
//       const result = await db.getEvents(true); // true = admin mode, gets all events
//       if (result.events) {
//         const pending = result.events.filter((e: Event) => !e.is_curated && e.status === 'pending');
//         setEvents(pending);
        
//         const curated = result.events.filter((e: Event) => e.is_curated);
//         setCuratedEvents(curated);
//       }
//     } catch (error) {
//       console.error('Error loading events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateCuratedEvent = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!selectedImage) {
//       alert('Please upload an event image');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Upload image first
//       const imageResult = await db.uploadEventImage(selectedImage, 'admin');
//       if (!imageResult.success || !imageResult.url) {
//         alert('Failed to upload image');
//         setIsLoading(false);
//         return;
//       }

//       // Create curated event
//       const eventData = {
//         title: curatedForm.title,
//         description: curatedForm.description,
//         category: curatedForm.category,
//         location: curatedForm.location,
//         date: curatedForm.date,
//         time: curatedForm.time,
//         total_spots: parseInt(curatedForm.totalSpots),
//         spots_left: parseInt(curatedForm.totalSpots),
//         price: 150, // Always ₹150
//         image_url: imageResult.url,
//         is_curated: true,
//         status: 'approved',
//         created_by: 'admin'
//       };

//       const result = await db.createCuratedEvent(eventData);
      
//       if (result.success) {
//         alert('✅ Curated event created successfully!');
        
//         // Reset form
//         setCuratedForm({
//           title: '',
//           description: '',
//           category: '',
//           location: '',
//           date: '',
//           time: '',
//           totalSpots: '10',
//         });
//         setSelectedImage(null);
//         setImagePreview('');
//         setShowCuratedForm(false);
        
//         // Reload events
//         loadAllEvents();
//       } else {
//         alert(`Failed to create event: ${result.error}`);
//       }
//     } catch (error) {
//       console.error('Error creating curated event:', error);
//       alert('Failed to create curated event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleApproveEvent = async (eventId: string) => {
//     try {
//       // Get event details first
//       const eventToApprove = events.find(e => e.id === eventId);
//       if (!eventToApprove) {
//         alert('Event not found');
//         return;
//       }

//       // Approve the event
//       const result = await db.updateEventStatus(eventId, 'approved');
      
//       if (result.success) {
//         alert('✅ Event approved!');
        
//         // Send approval email to creator
//         try {
//           // Get creator email from profiles table
//           const { data: creatorProfile } = await supabase
//             .from('profiles')
//             .select('email, name')
//             .eq('auth_user_id', eventToApprove.created_by)
//             .single();

//           if (creatorProfile?.email) {
//             // Send email (you'll implement this based on your email service)
//             await sendApprovalEmail({
//               to: creatorProfile.email,
//               eventTitle: eventToApprove.title,
//               eventDate: eventToApprove.date,
//               eventTime: eventToApprove.time,
//               eventLocation: eventToApprove.location
//             });
//             console.log('📧 Approval email sent to:', creatorProfile.email);
//           }
//         } catch (emailError) {
//           console.error('Failed to send email, but event approved:', emailError);
//           // Don't fail approval if email fails
//         }
        
//         loadAllEvents();
//       } else {
//         alert('Failed to approve event');
//       }
//     } catch (error) {
//       console.error('Error approving event:', error);
//     }
//   };

//   // Email sending function
//   const sendApprovalEmail = async (data: {
//     to: string;
//     eventTitle: string;
//     eventDate: string;
//     eventTime: string;
//     eventLocation: string;
//   }) => {
//     // Simple console log for now - integrate with your email service
//     console.log('📧 Sending approval email:', data);
    
//     // TODO: Integrate with Resend, SendGrid, or Supabase Edge Functions
//     // Example with fetch to a backend API:
//     /*
//     await fetch('/api/send-approval-email', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     */
//   };

//   const handleRejectEvent = async (eventId: string) => {
//     if (confirm('Are you sure you want to reject this event?')) {
//       try {
//         const result = await db.updateEventStatus(eventId, 'rejected');
//         if (result.success) {
//           alert('❌ Event rejected');
//           loadAllEvents();
//         } else {
//           alert('Failed to reject event');
//         }
//       } catch (error) {
//         console.error('Error rejecting event:', error);
//       }
//     }
//   };

//   const handleDeleteCuratedEvent = async (eventId: string) => {
//     if (confirm('Are you sure you want to delete this curated event?')) {
//       try {
//         const result = await db.deleteEvent(eventId);
//         if (result.success) {
//           alert('🗑️ Event deleted');
//           loadAllEvents();
//         } else {
//           alert('Failed to delete event');
//         }
//       } catch (error) {
//         console.error('Error deleting event:', error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-black text-white px-6 py-8">
//         <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-300 text-sm mt-1">Manage events and approvals</p>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         {/* CREATE CURATED EVENT SECTION */}
//         <Card className="border-2 border-purple-500">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-purple-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                 ⭐ Create Curated Event
//               </CardTitle>
//               <Button
//                 onClick={() => setShowCuratedForm(!showCuratedForm)}
//                 variant="outline"
//                 size="sm"
//               >
//                 {showCuratedForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> New Curated Event</>}
//               </Button>
//             </div>
//           </CardHeader>
          
//           {showCuratedForm && (
//             <CardContent>
//               <form onSubmit={handleCreateCuratedEvent} className="space-y-4">
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
//                           setSelectedImage(null);
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
//                       <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                         <div className="text-center">
//                           <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                           <span className="text-sm text-gray-500">Click to upload image</span>
//                         </div>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   )}
//                 </div>

//                 {/* Event Title */}
//                 <div>
//                   <Label>Event Title *</Label>
//                   <Input
//                     value={curatedForm.title}
//                     onChange={(e) => setCuratedForm({...curatedForm, title: e.target.value})}
//                     placeholder="e.g., Premium Wine Tasting Evening"
//                     required
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <Label>Description *</Label>
//                   <textarea
//                     value={curatedForm.description}
//                     onChange={(e) => setCuratedForm({...curatedForm, description: e.target.value})}
//                     placeholder="Describe this curated experience..."
//                     className="w-full px-3 py-2 border rounded-md min-h-24"
//                     required
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <Label>Category *</Label>
//                   <select
//                     value={curatedForm.category}
//                     onChange={(e) => setCuratedForm({...curatedForm, category: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-md"
//                     required
//                   >
//                     <option value="">Select category</option>
//                     <option value="food">Food & Drinks</option>
//                     <option value="activities">Activities</option>
//                     <option value="sports">Sports</option>
//                     <option value="wellness">Wellness</option>
//                     <option value="social">Social</option>
//                     <option value="nightlife">Nightlife</option>
//                   </select>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <Label>Location *</Label>
//                   <Input
//                     value={curatedForm.location}
//                     onChange={(e) => setCuratedForm({...curatedForm, location: e.target.value})}
//                     placeholder="e.g., The Wine Company, Bandra"
//                     required
//                   />
//                 </div>

//                 {/* Date and Time */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Date *</Label>
//                     <Input
//                       type="date"
//                       value={curatedForm.date}
//                       onChange={(e) => setCuratedForm({...curatedForm, date: e.target.value})}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label>Time *</Label>
//                     <Input
//                       type="time"
//                       value={curatedForm.time}
//                       onChange={(e) => setCuratedForm({...curatedForm, time: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Total Spots */}
//                 <div>
//                   <Label>Total Spots *</Label>
//                   <Input
//                     type="number"
//                     value={curatedForm.totalSpots}
//                     onChange={(e) => setCuratedForm({...curatedForm, totalSpots: e.target.value})}
//                     min="2"
//                     max="50"
//                     required
//                   />
//                 </div>

//                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                   <p className="text-sm text-purple-800">
//                     💎 <strong>Curated Event</strong> - Price: ₹150 per person
//                   </p>
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading || !selectedImage}
//                   className="w-full bg-purple-600 text-white hover:bg-purple-700"
//                 >
//                   {isLoading ? 'Creating...' : 'Create Curated Event'}
//                 </Button>
//               </form>
//             </CardContent>
//           )}
//         </Card>

//         {/* EXISTING CURATED EVENTS */}
//         {curatedEvents.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//                 ⭐ Curated Events ({curatedEvents.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {curatedEvents.map(event => (
//                 <div key={event.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
//                   {event.image_url && (
//                     <img 
//                       src={event.image_url} 
//                       alt={event.title}
//                       className="w-full h-32 object-cover rounded-lg mb-3"
//                     />
//                   )}
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-purple-900">{event.title}</h3>
//                       <p className="text-sm text-purple-700">{event.location}</p>
//                       <p className="text-xs text-purple-600 mt-1">{event.date} @ {event.time}</p>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <Badge className="bg-purple-600 text-white">Curated</Badge>
//                       <span className="text-sm font-bold">₹150</span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3">{event.description}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-600">{event.spots_left}/{event.total_spots} spots left</span>
//                     <Button
//                       onClick={() => handleDeleteCuratedEvent(event.id)}
//                       variant="destructive"
//                       size="sm"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         )}

//         {/* PENDING APPROVAL EVENTS */}
//         <Card>
//           <CardHeader>
//             <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Pending User Events ({events.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {isLoading ? (
//               <p className="text-center py-8 text-gray-500">Loading...</p>
//             ) : events.length === 0 ? (
//               <p className="text-center py-8 text-gray-500">No events pending approval</p>
//             ) : (
//               events.map(event => (
//                 <div key={event.id} className="border rounded-lg p-4">
//                   {event.image_url && (
//                     <img 
//                       src={event.image_url} 
//                       alt={event.title}
//                       className="w-full h-32 object-cover rounded-lg mb-3"
//                     />
//                   )}
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h3 className="font-semibold">{event.title}</h3>
//                       <p className="text-sm text-gray-600">{event.location}</p>
//                       <p className="text-xs text-gray-500 mt-1">{event.date} @ {event.time}</p>
//                     </div>
//                     <Badge variant="outline" className="text-yellow-600 border-yellow-600">
//                       Pending
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3">{event.description}</p>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       onClick={() => handleApproveEvent(event.id)}
//                       className="flex-1 bg-green-600 text-white hover:bg-green-700"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-2" />
//                       Approve
//                     </Button>
//                     <Button
//                       onClick={() => handleRejectEvent(event.id)}
//                       variant="destructive"
//                       className="flex-1"
//                     >
//                       <XCircle className="w-4 h-4 mr-2" />
//                       Reject
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>

//         {/* Back Button */}
//         <Button
//           onClick={() => onNavigate('events')}
//           variant="outline"
//           className="w-full"
//         >
//           Back to Events
//         </Button>
//       </div>
//     </div>
//   );
// }














































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { 
//   Users, TrendingUp, DollarSign, Calendar, 
//   CheckCircle, XCircle, Trash2, Eye, Mail,
//   BarChart3, Activity, Clock, MapPin
// } from 'lucide-react';
// import { db, supabase } from '../utils/supabase';

// interface AdminDashboardProps {
//   onNavigate: (screen: string) => void;
//   onLogout: () => void;
// }

// interface AnalyticsData {
//   totalVisits: number;
//   totalSignups: number;
//   totalPayments: number;
//   totalRevenue: number;
//   todayVisits: number;
//   todaySignups: number;
//   todayPayments: number;
//   todayRevenue: number;
// }

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   city: string;
//   price: number;
//   total_spots: number;
//   spots_left: number;
//   participants: string[];
//   creator_paid: boolean;
//   created_by: string;
//   created_at: string;
//   status: string;
//   image_url?: string;
//   description?: string;
// }

// interface Payment {
//   id: string;
//   user_id: string;
//   event_id: string;
//   amount: number;
//   payment_note: string;
//   status: string;
//   created_at: string;
//   user_name?: string;
//   event_title?: string;
//   verified: boolean;
// }

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   city: string;
//   created_at: string;
//   joined_events: string[];
// }

// export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
//   const [analytics, setAnalytics] = useState<AnalyticsData>({
//     totalVisits: 0,
//     totalSignups: 0,
//     totalPayments: 0,
//     totalRevenue: 0,
//     todayVisits: 0,
//     todaySignups: 0,
//     todayPayments: 0,
//     todayRevenue: 0,
//   });
//   const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
//   const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
//   const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
//   const [verifiedPayments, setVerifiedPayments] = useState<Payment[]>([]);
//   const [allUsers, setAllUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     loadAllData();
//   }, []);

//   const loadAllData = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       console.log('🔄 Loading admin data...');
      
//       await Promise.all([
//         loadAnalytics(),
//         loadEvents(),
//         loadPayments(),
//         loadUsers(),
//       ]);
      
//       console.log('✅ Admin data loaded successfully');
//     } catch (error) {
//       console.error('❌ Error loading admin data:', error);
//       setError('Failed to load dashboard data. Please refresh.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       // Simple count queries that will work even with empty tables
//       const { count: profilesCount } = await supabase
//         .from('profiles')
//         .select('*', { count: 'exact', head: true });

//       const { count: participantsCount } = await supabase
//         .from('event_participants')
//         .select('*', { count: 'exact', head: true });

//       const { data: participants } = await supabase
//         .from('event_participants')
//         .select('amount_paid');

//       const totalRevenue = participants?.reduce((sum, p) => sum + (p.amount_paid || 150), 0) || 0;

//       // Try to get analytics data, but don't fail if table is empty
//       const { data: analyticsData } = await supabase
//         .from('analytics')
//         .select('*');

//       const totalVisits = analyticsData?.filter(a => a.event_type === 'page_view').length || 0;

//       setAnalytics({
//         totalVisits,
//         totalSignups: profilesCount || 0,
//         totalPayments: participantsCount || 0,
//         totalRevenue,
//         todayVisits: 0,
//         todaySignups: 0,
//         todayPayments: 0,
//         todayRevenue: 0,
//       });

//       console.log('✅ Analytics loaded');
//     } catch (error) {
//       console.error('Error loading analytics:', error);
//       // Don't throw - use default values
//     }
//   };

//   const loadEvents = async () => {
//     try {
//       const { data: events, error } = await supabase
//         .from('events')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const pending = events?.filter(e => e.status === 'pending_approval') || [];
//       const approved = events?.filter(e => e.status === 'approved') || [];

//       setPendingEvents(pending);
//       setApprovedEvents(approved);
      
//       console.log(`✅ Events loaded: ${pending.length} pending, ${approved.length} approved`);
//     } catch (error) {
//       console.error('Error loading events:', error);
//       setPendingEvents([]);
//       setApprovedEvents([]);
//     }
//   };

//   const loadPayments = async () => {
//     try {
//       const { data: participants, error } = await supabase
//         .from('event_participants')
//         .select(`
//           id,
//           user_id,
//           event_id,
//           payment_verified,
//           payment_note,
//           amount_paid,
//           created_at
//         `)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       // Get user and event info separately
//       const paymentsWithInfo: Payment[] = await Promise.all(
//         (participants || []).map(async (p) => {
//           const { data: profile } = await supabase
//             .from('profiles')
//             .select('name')
//             .eq('id', p.user_id)
//             .single();

//           const { data: event } = await supabase
//             .from('events')
//             .select('title')
//             .eq('id', p.event_id)
//             .single();

//           return {
//             id: p.id,
//             user_id: p.user_id,
//             event_id: p.event_id,
//             amount: p.amount_paid || 150,
//             payment_note: p.payment_note || '',
//             status: p.payment_verified ? 'verified' : 'pending',
//             created_at: p.created_at,
//             user_name: profile?.name || 'Unknown User',
//             event_title: event?.title || 'Unknown Event',
//             verified: p.payment_verified || false,
//           };
//         })
//       );

//       const pending = paymentsWithInfo.filter(p => !p.verified);
//       const verified = paymentsWithInfo.filter(p => p.verified);

//       setPendingPayments(pending);
//       setVerifiedPayments(verified);
      
//       console.log(`✅ Payments loaded: ${pending.length} pending, ${verified.length} verified`);
//     } catch (error) {
//       console.error('Error loading payments:', error);
//       setPendingPayments([]);
//       setVerifiedPayments([]);
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       const { data: users, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       setAllUsers(users || []);
//       console.log(`✅ Users loaded: ${users?.length || 0}`);
//     } catch (error) {
//       console.error('Error loading users:', error);
//       setAllUsers([]);
//     }
//   };

//   const handleApproveEvent = async (eventId: string) => {
//     if (!confirm('Approve this event?')) return;

//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ 
//           status: 'approved',
//           approved_at: new Date().toISOString()
//         })
//         .eq('id', eventId);

//       if (error) throw error;

//       alert('✅ Event approved!');
//       loadEvents();
//     } catch (error) {
//       console.error('Error approving event:', error);
//       alert('Failed to approve event');
//     }
//   };

//   const handleRejectEvent = async (eventId: string) => {
//     const reason = prompt('Reason for rejection:');
//     if (!reason) return;

//     try {
//       const { error } = await supabase
//         .from('events')
//         .update({ 
//           status: 'rejected',
//           rejection_reason: reason
//         })
//         .eq('id', eventId);

//       if (error) throw error;

//       alert('❌ Event rejected.');
//       loadEvents();
//     } catch (error) {
//       console.error('Error rejecting event:', error);
//       alert('Failed to reject event');
//     }
//   };

//   const handleDeleteEvent = async (eventId: string) => {
//     if (!confirm('⚠️ DELETE this event permanently? This cannot be undone!')) return;
//     if (!confirm('Are you ABSOLUTELY sure? All participants will lose access!')) return;

//     try {
//       // Delete participants first
//       await supabase
//         .from('event_participants')
//         .delete()
//         .eq('event_id', eventId);

//       // Delete event
//       const { error } = await supabase
//         .from('events')
//         .delete()
//         .eq('id', eventId);

//       if (error) throw error;

//       alert('🗑️ Event deleted permanently!');
//       loadEvents();
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       alert('Failed to delete event');
//     }
//   };

//   const handleVerifyPayment = async (paymentId: string) => {
//     if (!confirm('Verify this payment as received?')) return;

//     try {
//       const { error } = await supabase
//         .from('event_participants')
//         .update({ 
//           payment_verified: true,
//           verified_at: new Date().toISOString()
//         })
//         .eq('id', paymentId);

//       if (error) throw error;

//       alert('✅ Payment verified!');
//       loadPayments();
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       alert('Failed to verify payment');
//     }
//   };

//   const handleRejectPayment = async (paymentId: string, eventId: string, userId: string) => {
//     if (!confirm('⚠️ REJECT this payment? User will lose event access!')) return;

//     try {
//       const { error } = await supabase
//         .from('event_participants')
//         .delete()
//         .eq('id', paymentId);

//       if (error) throw error;

//       // Update event spots
//       const { data: event } = await supabase
//         .from('events')
//         .select('spots_left, participants')
//         .eq('id', eventId)
//         .single();

//       if (event) {
//         const updatedParticipants = event.participants.filter((id: string) => id !== userId);
//         await supabase
//           .from('events')
//           .update({
//             spots_left: event.spots_left + 1,
//             participants: updatedParticipants
//           })
//           .eq('id', eventId);
//       }

//       alert('❌ Payment rejected. User removed from event.');
//       loadPayments();
//       loadEvents();
//     } catch (error) {
//       console.error('Error rejecting payment:', error);
//       alert('Failed to reject payment');
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading admin dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <Card className="max-w-md">
//           <CardContent className="pt-6 text-center">
//             <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <div className="flex space-x-2">
//               <Button onClick={loadAllData} className="flex-1">
//                 Try Again
//               </Button>
//               <Button onClick={onLogout} variant="outline" className="flex-1">
//                 Logout
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-black text-white px-6 py-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
//             Admin Dashboard
//           </h1>
//           <div className="flex items-center space-x-3">
//             <Button
//               onClick={loadAllData}
//               variant="ghost"
//               size="sm"
//               className="text-white hover:bg-gray-800"
//             >
//               🔄 Refresh
//             </Button>
//             <Button
//               onClick={onLogout}
//               variant="ghost"
//               size="sm"
//               className="text-white hover:bg-gray-800"
//             >
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 py-6">
//         <Tabs defaultValue="overview" className="w-full">
//           <TabsList className="w-full grid grid-cols-5">
//             <TabsTrigger value="overview">📊 Overview</TabsTrigger>
//             <TabsTrigger value="events">📅 Events</TabsTrigger>
//             <TabsTrigger value="payments">💰 Payments</TabsTrigger>
//             <TabsTrigger value="users">👥 Users</TabsTrigger>
//             <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
//           </TabsList>

//           {/* OVERVIEW TAB */}
//           <TabsContent value="overview">
//             <div className="space-y-6 mt-6">
//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
//                     <Activity className="w-4 h-4 text-gray-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalVisits}</div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                     <Users className="w-4 h-4 text-gray-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalSignups}</div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
//                     <TrendingUp className="w-4 h-4 text-gray-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalPayments}</div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                     <DollarSign className="w-4 h-4 text-gray-600" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Quick Actions */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Card className="cursor-pointer hover:shadow-lg transition-shadow">
//                   <CardContent className="pt-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Pending Events</p>
//                         <p className="text-3xl font-bold">{pendingEvents.length}</p>
//                       </div>
//                       <Calendar className="w-8 h-8 text-orange-600" />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="cursor-pointer hover:shadow-lg transition-shadow">
//                   <CardContent className="pt-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Pending Payments</p>
//                         <p className="text-3xl font-bold">{pendingPayments.length}</p>
//                       </div>
//                       <Clock className="w-8 h-8 text-yellow-600" />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="cursor-pointer hover:shadow-lg transition-shadow">
//                   <CardContent className="pt-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Total Users</p>
//                         <p className="text-3xl font-bold">{allUsers.length}</p>
//                       </div>
//                       <Users className="w-8 h-8 text-blue-600" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           {/* EVENTS TAB */}
//           <TabsContent value="events">
//             <div className="space-y-6 mt-6">
//               <h2 className="text-xl font-bold">Pending Approval ({pendingEvents.length})</h2>
//               {pendingEvents.length === 0 ? (
//                 <Card>
//                   <CardContent className="py-8 text-center text-gray-500">
//                     No pending events
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingEvents.map(event => (
//                     <Card key={event.id}>
//                       <CardContent className="pt-6">
//                         <h3 className="text-lg font-bold mb-2">{event.title}</h3>
//                         <p className="text-sm text-gray-600 mb-4">
//                           {event.date} at {event.time} • {event.location}
//                         </p>
//                         <div className="flex space-x-2">
//                           <Button
//                             onClick={() => handleApproveEvent(event.id)}
//                             className="flex-1 bg-green-600 text-white"
//                           >
//                             <CheckCircle className="w-4 h-4 mr-2" />
//                             Approve
//                           </Button>
//                           <Button
//                             onClick={() => handleRejectEvent(event.id)}
//                             variant="destructive"
//                             className="flex-1"
//                           >
//                             <XCircle className="w-4 h-4 mr-2" />
//                             Reject
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}

//               <h2 className="text-xl font-bold mt-8">Approved Events ({approvedEvents.length})</h2>
//               {approvedEvents.length === 0 ? (
//                 <Card>
//                   <CardContent className="py-8 text-center text-gray-500">
//                     No approved events
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-4">
//                   {approvedEvents.map(event => (
//                     <Card key={event.id}>
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-bold">{event.title}</h3>
//                             <p className="text-sm text-gray-600">
//                               {event.date} • {event.participants?.length || 0} participants
//                             </p>
//                           </div>
//                           <Button
//                             onClick={() => handleDeleteEvent(event.id)}
//                             variant="destructive"
//                             size="sm"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           {/* PAYMENTS TAB */}
//           <TabsContent value="payments">
//             <div className="space-y-6 mt-6">
//               <h2 className="text-xl font-bold">Pending Verification ({pendingPayments.length})</h2>
//               {pendingPayments.length === 0 ? (
//                 <Card>
//                   <CardContent className="py-8 text-center text-gray-500">
//                     No pending payments
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingPayments.map(payment => (
//                     <Card key={payment.id}>
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="font-bold">{payment.user_name}</h3>
//                             <p className="text-sm text-gray-600">{payment.event_title}</p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Note: <code>{payment.payment_note || 'Not provided'}</code>
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-2xl font-bold text-green-600">
//                               {formatCurrency(payment.amount)}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button
//                             onClick={() => handleVerifyPayment(payment.id)}
//                             className="flex-1 bg-green-600 text-white"
//                           >
//                             <CheckCircle className="w-4 h-4 mr-2" />
//                             Verify
//                           </Button>
//                           <Button
//                             onClick={() => handleRejectPayment(payment.id, payment.event_id, payment.user_id)}
//                             variant="destructive"
//                             className="flex-1"
//                           >
//                             <XCircle className="w-4 h-4 mr-2" />
//                             Reject
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           {/* USERS TAB */}
//           <TabsContent value="users">
//             <div className="space-y-4 mt-6">
//               <h2 className="text-xl font-bold">All Users ({allUsers.length})</h2>
//               {allUsers.map(user => (
//                 <Card key={user.id}>
//                   <CardContent className="pt-6">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="font-semibold">{user.name}</h3>
//                         <p className="text-sm text-gray-600">{user.email}</p>
//                         <p className="text-xs text-gray-500">{user.city}</p>
//                       </div>
//                       <Badge>{user.joined_events?.length || 0} events</Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           {/* ANALYTICS TAB */}
//           <TabsContent value="analytics">
//             <div className="space-y-6 mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Platform Metrics</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between">
//                       <span>Total Users</span>
//                       <span className="font-bold">{analytics.totalSignups}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Total Payments</span>
//                       <span className="font-bold">{analytics.totalPayments}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Total Revenue</span>
//                       <span className="font-bold text-green-600">
//                         {formatCurrency(analytics.totalRevenue)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Avg Per User</span>
//                       <span className="font-bold">
//                         {formatCurrency(Math.round(analytics.totalRevenue / (analytics.totalPayments || 1)))}
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }


































































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { 
//   Users, TrendingUp, DollarSign, Calendar, 
//   CheckCircle, XCircle, Trash2, Filter, Search,
//   Activity, Clock, MapPin, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { supabase } from '../utils/supabase';

// interface AdminDashboardProps {
//   onNavigate: (screen: string) => void;
//   onLogout: () => void;
// }

// export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
//   const [analytics, setAnalytics] = useState({ totalVisits: 0, totalSignups: 0, totalPayments: 0, totalRevenue: 0 });
//   const [pendingEvents, setPendingEvents] = useState([]);
//   const [approvedEvents, setApprovedEvents] = useState([]);
//   const [pendingPayments, setPendingPayments] = useState([]);
//   const [verifiedPayments, setVerifiedPayments] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedCity, setSelectedCity] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 20;

//   useEffect(() => {
//     loadAllData();
//   }, []);

//   const loadAllData = async () => {
//     setIsLoading(true);
//     try {
//       await Promise.all([loadAnalytics(), loadEvents(), loadPayments(), loadUsers()]);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
//       const { count: participantsCount } = await supabase.from('event_participants').select('*', { count: 'exact', head: true });
//       const { data: participants } = await supabase.from('event_participants').select('amount_paid');
//       const totalRevenue = participants?.reduce((sum, p) => sum + (p.amount_paid || 150), 0) || 0;
//       const { data: analyticsData } = await supabase.from('analytics').select('*');
//       const totalVisits = analyticsData?.filter(a => a.event_type === 'page_view').length || 0;
      
//       setAnalytics({
//         totalVisits,
//         totalSignups: profilesCount || 0,
//         totalPayments: participantsCount || 0,
//         totalRevenue,
//       });
//     } catch (error) {
//       console.error('Error loading analytics:', error);
//     }
//   };

//   const loadEvents = async () => {
//     try {
//       const { data: events } = await supabase.from('events').select('*').order('date', { ascending: true });
//       const eventsWithDay = events?.map(e => ({
//         ...e,
//         day_of_week: new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' })
//       })) || [];
//       setPendingEvents(eventsWithDay.filter(e => e.status === 'pending_approval'));
//       setApprovedEvents(eventsWithDay.filter(e => e.status === 'approved'));
//       console.log('✅ Events loaded:', eventsWithDay.length);
//     } catch (error) {
//       console.error('Error loading events:', error);
//     }
//   };

//   const loadPayments = async () => {
//     try {
//       console.log('🔄 Loading payments...');
//       const { data: participants } = await supabase.from('event_participants').select('*').order('created_at', { ascending: false });
      
//       if (!participants || participants.length === 0) {
//         setPendingPayments([]);
//         setVerifiedPayments([]);
//         return;
//       }

//       const userIds = [...new Set(participants.map(p => p.user_id))];
//       const eventIds = [...new Set(participants.map(p => p.event_id))];

//       const { data: profiles } = await supabase.from('profiles').select('id, name, email').in('id', userIds);
//       const { data: events } = await supabase.from('events').select('id, title').in('id', eventIds);

//       console.log('👥 Profiles loaded:', profiles?.length);
//       console.log('📅 Events loaded:', events?.length);

//       const profileMap = new Map();
//       profiles?.forEach(p => {
//         profileMap.set(p.id, p.name || p.email || 'Unknown');
//       });

//       const eventMap = new Map();
//       events?.forEach(e => {
//         eventMap.set(e.id, e.title || 'Unknown Event');
//       });

//       const paymentsWithInfo = participants.map(p => ({
//         id: p.id,
//         user_id: p.user_id,
//         event_id: p.event_id,
//         amount: p.amount_paid || 150,
//         payment_note: p.payment_note || 'Not provided',
//         created_at: p.created_at,
//         user_name: profileMap.get(p.user_id) || 'User ' + p.user_id.slice(0, 8),
//         event_title: eventMap.get(p.event_id) || 'Event ' + p.event_id.slice(0, 8),
//         verified: p.payment_verified || false,
//       }));

//       console.log('💰 Payments mapped:', paymentsWithInfo.length);
//       console.log('Sample payment:', paymentsWithInfo[0]);

//       setPendingPayments(paymentsWithInfo.filter(p => !p.verified));
//       setVerifiedPayments(paymentsWithInfo.filter(p => p.verified));
//     } catch (error) {
//       console.error('❌ Error loading payments:', error);
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
//       setAllUsers(users || []);
//     } catch (error) {
//       console.error('Error loading users:', error);
//     }
//   };

//   const handleApproveEvent = async (eventId) => {
//     if (!confirm('Approve this event?')) return;
//     try {
//       await supabase.from('events').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', eventId);
//       alert('✅ Event approved!');
//       await loadEvents();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to approve event');
//     }
//   };

//   const handleRejectEvent = async (eventId) => {
//     const reason = prompt('Reason for rejection:');
//     if (!reason) return;
//     try {
//       await supabase.from('events').update({ status: 'rejected', rejection_reason: reason }).eq('id', eventId);
//       alert('❌ Event rejected');
//       await loadEvents();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to reject event');
//     }
//   };

//   const handleDeleteEvent = async (eventId, eventTitle) => {
//     if (!confirm(`⚠️ DELETE "${eventTitle}"? Cannot be undone!`)) return;
//     if (!confirm('ABSOLUTELY sure? All participants lose access!')) return;
//     try {
//       await supabase.from('event_participants').delete().eq('event_id', eventId);
//       await supabase.from('events').delete().eq('id', eventId);
//       alert('🗑️ Event deleted!');
//       await loadEvents();
//       await loadPayments();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to delete: ' + error.message);
//     }
//   };

//   const handleVerifyPayment = async (paymentId) => {
//     if (!confirm('✅ Verify payment as received?')) return;
//     try {
//       await supabase.from('event_participants').update({ payment_verified: true, verified_at: new Date().toISOString() }).eq('id', paymentId);
//       alert('✅ Payment verified!');
//       await loadPayments();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to verify');
//     }
//   };

//   const handleRejectPayment = async (paymentId, eventId, userId) => {
//     if (!confirm('⚠️ REJECT payment? User loses access!')) return;
//     try {
//       console.log('🔄 Rejecting payment:', paymentId);
      
//       await supabase.from('event_participants').delete().eq('id', paymentId);
      
//       const { data: event } = await supabase.from('events').select('spots_left, participants').eq('id', eventId).single();
      
//       if (event) {
//         const updatedParticipants = (event.participants || []).filter(id => id !== userId);
//         await supabase.from('events').update({
//           spots_left: event.spots_left + 1,
//           participants: updatedParticipants
//         }).eq('id', eventId);
//       }
      
//       alert('❌ Payment rejected. User removed.');
      
//       console.log('🔄 Refreshing all data...');
//       await loadPayments();
//       await loadEvents();
//       await loadAnalytics();
//       console.log('✅ Data refreshed!');
//     } catch (error) {
//       console.error('❌ Error:', error);
//       alert('Failed to reject');
//     }
//   };

//   const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const cities = ['all', ...new Set(approvedEvents.map(e => e.city))];
//   const filteredEvents = approvedEvents.filter(event => {
//     const matchesCity = selectedCity === 'all' || event.city === selectedCity;
//     const matchesSearch = searchQuery === '' || 
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.location.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCity && matchesSearch;
//   });

//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//   const startIndex = (currentPage - 1) * eventsPerPage;
//   const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-black text-white px-6 py-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <div className="flex items-center space-x-3">
//             <Button onClick={loadAllData} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
//               🔄 Refresh
//             </Button>
//             <Button onClick={onLogout} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 py-6">
//         <Tabs defaultValue="overview" className="w-full">
//           <TabsList className="w-full flex justify-start gap-2 h-auto p-2 bg-gray-100 rounded-lg overflow-x-auto">
//             <TabsTrigger value="overview">📊 Overview</TabsTrigger>
//             <TabsTrigger value="events">📅 Events</TabsTrigger>
//             <TabsTrigger value="payments">💰 Payments</TabsTrigger>
//             <TabsTrigger value="users">👥 Users</TabsTrigger>
//             <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview">
//             <div className="space-y-6 mt-6">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
//                     <Activity className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalVisits}</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                     <Users className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalSignups}</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
//                     <TrendingUp className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalPayments}</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                     <DollarSign className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="events">
//             <div className="space-y-6 mt-6">
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Pending Approval ({pendingEvents.length})</h2>
//                 {pendingEvents.length === 0 ? (
//                   <Card><CardContent className="py-8 text-center text-gray-500">No pending events</CardContent></Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingEvents.map(event => (
//                       <Card key={event.id}>
//                         <CardContent className="pt-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-lg font-bold">{event.title}</h3>
//                               <div className="text-sm text-gray-600 space-y-1 mt-2">
//                                 <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{event.day_of_week}, {formatDate(event.date)} at {event.time}</p>
//                                 <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{event.location}, {event.city}</p>
//                               </div>
//                             </div>
//                             <Badge className="bg-orange-500">{formatCurrency(event.price)}</Badge>
//                           </div>
//                           <div className="flex space-x-2">
//                             <Button onClick={() => handleApproveEvent(event.id)} className="flex-1 bg-green-600 hover:bg-green-700">
//                               <CheckCircle className="w-4 h-4 mr-2" />Approve
//                             </Button>
//                             <Button onClick={() => handleRejectEvent(event.id)} variant="destructive" className="flex-1">
//                               <XCircle className="w-4 h-4 mr-2" />Reject
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold">Approved Events ({approvedEvents.length})</h2>
//                 </div>
//                 <div className="flex gap-4 mb-4">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg"
//                     />
//                   </div>
//                   <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg">
//                     {cities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}
//                   </select>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
//                 </p>
//                 {paginatedEvents.length === 0 ? (
//                   <Card><CardContent className="py-8 text-center text-gray-500">No events</CardContent></Card>
//                 ) : (
//                   <div className="space-y-3">
//                     {paginatedEvents.map(event => (
//                       <Card key={event.id}>
//                         <CardContent className="pt-4 pb-4">
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h3 className="font-bold text-base">{event.title}</h3>
//                               <div className="text-sm text-gray-600 space-y-1 mt-1">
//                                 <p>📅 {event.day_of_week}, {formatDate(event.date)} • {event.time}</p>
//                                 <p>📍 {event.location}, <strong>{event.city}</strong></p>
//                                 <p>👥 {event.participants?.length || 0}/{event.total_spots} participants • {event.spots_left} spots left</p>
//                               </div>
//                             </div>
//                             <Button onClick={() => handleDeleteEvent(event.id, event.title)} variant="destructive" size="sm">
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//                 {totalPages > 1 && (
//                   <div className="flex justify-center items-center gap-4 mt-6">
//                     <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="outline" size="sm">
//                       <ChevronLeft className="w-4 h-4" />Previous
//                     </Button>
//                     <span className="text-sm">Page {currentPage} of {totalPages}</span>
//                     <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="outline" size="sm">
//                       Next<ChevronRight className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="payments">
//             <div className="space-y-6 mt-6">
//               <h2 className="text-xl font-bold">Pending Verification ({pendingPayments.length})</h2>
//               {pendingPayments.length === 0 ? (
//                 <Card><CardContent className="py-8 text-center text-gray-500">✅ No pending payments!</CardContent></Card>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingPayments.map(payment => (
//                     <Card key={payment.id} className="border-yellow-200">
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between mb-4">
//                           <div>
//                             <h3 className="font-bold text-lg">{payment.user_name}</h3>
//                             <p className="text-sm text-gray-600">{payment.event_title}</p>
//                             <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-1 rounded mt-1">{payment.payment_note}</p>
//                           </div>
//                           <p className="text-2xl font-bold text-green-600">{formatCurrency(payment.amount)}</p>
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button onClick={() => handleVerifyPayment(payment.id)} className="flex-1 bg-green-600">
//                             <CheckCircle className="w-4 h-4 mr-2" />Verify
//                           </Button>
//                           <Button onClick={() => handleRejectPayment(payment.id, payment.event_id, payment.user_id)} variant="destructive" className="flex-1">
//                             <XCircle className="w-4 h-4 mr-2" />Reject
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="users">
//             <div className="space-y-4 mt-6">
//               <h2 className="text-xl font-bold">All Users ({allUsers.length})</h2>
//               {allUsers.slice(0, 50).map(user => (
//                 <Card key={user.id}>
//                   <CardContent className="pt-6">
//                     <div className="flex justify-between">
//                       <div>
//                         <h3 className="font-semibold">{user.name}</h3>
//                         <p className="text-sm text-gray-600">{user.email}</p>
//                         <p className="text-xs text-gray-500">{user.city}</p>
//                       </div>
//                       <Badge>{user.joined_events?.length || 0} events</Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="analytics">
//             <div className="space-y-6 mt-6">
//               <Card>
//                 <CardHeader><CardTitle>Platform Metrics</CardTitle></CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between py-2 border-b">
//                       <span>Total Users</span>
//                       <span className="font-bold">{analytics.totalSignups}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b">
//                       <span>Total Payments</span>
//                       <span className="font-bold">{analytics.totalPayments}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b">
//                       <span>Total Revenue</span>
//                       <span className="font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }



























// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { 
//   Users, TrendingUp, DollarSign, Calendar, 
//   CheckCircle, XCircle, Trash2, Filter, Search,
//   Activity, Clock, MapPin, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { supabase } from '../utils/supabase';

// interface AdminDashboardProps {
//   onNavigate: (screen: string) => void;
//   onLogout: () => void;
// }

// export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
//   const [analytics, setAnalytics] = useState({ totalVisits: 0, totalSignups: 0, totalPayments: 0, totalRevenue: 0 });
//   const [pendingEvents, setPendingEvents] = useState([]);
//   const [approvedEvents, setApprovedEvents] = useState([]);
//   const [pendingPayments, setPendingPayments] = useState([]);
//   const [verifiedPayments, setVerifiedPayments] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedCity, setSelectedCity] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 20;

//   useEffect(() => {
//     loadAllData();
//     // Auto-refresh every 10 seconds
//     const interval = setInterval(loadAllData, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const loadAllData = async () => {
//     setIsLoading(true);
//     try {
//       await Promise.all([loadAnalytics(), loadEvents(), loadPayments(), loadUsers()]);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
//       const { count: participantsCount } = await supabase.from('event_participants').select('*', { count: 'exact', head: true });
//       const { data: participants } = await supabase.from('event_participants').select('amount_paid');
//       const totalRevenue = participants?.reduce((sum, p) => sum + (p.amount_paid || 150), 0) || 0;
//       const { data: analyticsData } = await supabase.from('analytics').select('*');
//       const totalVisits = analyticsData?.filter(a => a.event_type === 'page_view').length || 0;
      
//       setAnalytics({
//         totalVisits,
//         totalSignups: profilesCount || 0,
//         totalPayments: participantsCount || 0,
//         totalRevenue,
//       });
//     } catch (error) {
//       console.error('Error loading analytics:', error);
//     }
//   };

//   const loadEvents = async () => {
//     try {
//       const { data: events } = await supabase.from('events').select('*').order('date', { ascending: true });
//       const eventsWithDay = events?.map(e => ({
//         ...e,
//         day_of_week: new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' })
//       })) || [];
      
//       // FIX: Look for BOTH "pending" AND "pending_approval"
//       setPendingEvents(eventsWithDay.filter(e => e.status === 'pending_approval' || e.status === 'pending'));
//       setApprovedEvents(eventsWithDay.filter(e => e.status === 'approved'));
//       console.log('✅ Events loaded:', eventsWithDay.length, 'Pending:', eventsWithDay.filter(e => e.status === 'pending_approval' || e.status === 'pending').length);
//     } catch (error) {
//       console.error('Error loading events:', error);
//     }
//   };

//   const loadPayments = async () => {
//     try {
//       console.log('🔄 Loading payments...');
//       const { data: participants } = await supabase.from('event_participants').select('*').order('created_at', { ascending: false });
      
//       if (!participants || participants.length === 0) {
//         setPendingPayments([]);
//         setVerifiedPayments([]);
//         return;
//       }

//       const userIds = [...new Set(participants.map(p => p.user_id))];
//       const eventIds = [...new Set(participants.map(p => p.event_id))];

//       const { data: profiles } = await supabase.from('profiles').select('id, name, email').in('id', userIds);
//       const { data: events } = await supabase.from('events').select('id, title').in('id', eventIds);

//       const profileMap = new Map();
//       profiles?.forEach(p => {
//         profileMap.set(p.id, p.name || p.email || 'Unknown');
//       });

//       const eventMap = new Map();
//       events?.forEach(e => {
//         eventMap.set(e.id, e.title || 'Unknown Event');
//       });

//       const paymentsWithInfo = participants.map(p => ({
//         id: p.id,
//         user_id: p.user_id,
//         event_id: p.event_id,
//         amount: p.amount_paid || 150,
//         payment_note: p.payment_note || 'Not provided',
//         created_at: p.created_at,
//         user_name: profileMap.get(p.user_id) || 'User ' + p.user_id.slice(0, 8),
//         event_title: eventMap.get(p.event_id) || 'Event ' + p.event_id.slice(0, 8),
//         verified: p.payment_verified || false,
//       }));

//       setPendingPayments(paymentsWithInfo.filter(p => !p.verified));
//       setVerifiedPayments(paymentsWithInfo.filter(p => p.verified));
//     } catch (error) {
//       console.error('❌ Error loading payments:', error);
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
//       setAllUsers(users || []);
//     } catch (error) {
//       console.error('Error loading users:', error);
//     }
//   };

//   const handleApproveEvent = async (eventId) => {
//     if (!confirm('Approve this event?')) return;
//     try {
//       await supabase.from('events').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', eventId);
//       alert('✅ Event approved!');
//       await loadEvents();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to approve event');
//     }
//   };

//   const handleRejectEvent = async (eventId) => {
//     const reason = prompt('Reason for rejection:');
//     if (!reason) return;
//     try {
//       await supabase.from('events').update({ status: 'rejected', rejection_reason: reason }).eq('id', eventId);
//       alert('❌ Event rejected');
//       await loadEvents();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to reject event');
//     }
//   };

//   const handleDeleteEvent = async (eventId, eventTitle) => {
//     if (!confirm(`⚠️ DELETE "${eventTitle}"? Cannot be undone!`)) return;
//     if (!confirm('ABSOLUTELY sure? All participants lose access!')) return;
//     try {
//       await supabase.from('event_participants').delete().eq('event_id', eventId);
//       await supabase.from('events').delete().eq('id', eventId);
//       alert('🗑️ Event deleted!');
//       await loadEvents();
//       await loadPayments();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to delete: ' + error.message);
//     }
//   };

//   const handleVerifyPayment = async (paymentId) => {
//     if (!confirm('✅ Verify payment as received?')) return;
//     try {
//       await supabase.from('event_participants').update({ payment_verified: true, verified_at: new Date().toISOString() }).eq('id', paymentId);
//       alert('✅ Payment verified!');
//       await loadPayments();
//       await loadAnalytics();
//     } catch (error) {
//       alert('Failed to verify');
//     }
//   };

//   const handleRejectPayment = async (paymentId, eventId, userId) => {
//     if (!confirm('⚠️ REJECT payment? User loses access!')) return;
//     try {
//       console.log('🔄 Rejecting payment:', paymentId);
      
//       // Delete payment record
//       await supabase.from('event_participants').delete().eq('id', paymentId);
      
//       // Get event and update participants
//       const { data: event } = await supabase.from('events').select('spots_left, participants').eq('id', eventId).single();
      
//       if (event) {
//         const updatedParticipants = (event.participants || []).filter(id => id !== userId);
//         await supabase.from('events').update({
//           spots_left: event.spots_left + 1,
//           participants: updatedParticipants
//         }).eq('id', eventId);
//       }
      
//       alert('❌ Payment rejected. User removed.');
      
//       // Refresh everything
//       await loadPayments();
//       await loadEvents();
//       await loadAnalytics();
//     } catch (error) {
//       console.error('❌ Error:', error);
//       alert('Failed to reject: ' + error.message);
//     }
//   };

//   const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const cities = ['all', ...new Set(approvedEvents.map(e => e.city))];
//   const filteredEvents = approvedEvents.filter(event => {
//     const matchesCity = selectedCity === 'all' || event.city === selectedCity;
//     const matchesSearch = searchQuery === '' || 
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.location.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCity && matchesSearch;
//   });

//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//   const startIndex = (currentPage - 1) * eventsPerPage;
//   const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-black text-white px-6 py-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <div className="flex items-center space-x-3">
//             <Button onClick={loadAllData} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
//               🔄 Refresh
//             </Button>
//             <Button onClick={onLogout} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="px-6 py-6">
//         <Tabs defaultValue="overview" className="w-full">
//           <TabsList className="w-full flex justify-start gap-2 h-auto p-2 bg-gray-100 rounded-lg overflow-x-auto">
//             <TabsTrigger value="overview">📊 Overview</TabsTrigger>
//             <TabsTrigger value="events">📅 Events</TabsTrigger>
//             <TabsTrigger value="payments">💰 Payments</TabsTrigger>
//             <TabsTrigger value="users">👥 Users</TabsTrigger>
//             <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview">
//             <div className="space-y-6 mt-6">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
//                     <Activity className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalVisits}</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                     <Users className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalSignups}</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
//                     <TrendingUp className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{analytics.totalPayments}</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                     <DollarSign className="w-4 h-4" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="events">
//             <div className="space-y-6 mt-6">
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Pending Approval ({pendingEvents.length})</h2>
//                 {pendingEvents.length === 0 ? (
//                   <Card><CardContent className="py-8 text-center text-gray-500">No pending events</CardContent></Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingEvents.map(event => (
//                       <Card key={event.id}>
//                         <CardContent className="pt-6">
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-lg font-bold">{event.title}</h3>
//                               <div className="text-sm text-gray-600 space-y-1 mt-2">
//                                 <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{event.day_of_week}, {formatDate(event.date)} at {event.time}</p>
//                                 <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{event.location}, {event.city}</p>
//                               </div>
//                             </div>
//                             <Badge className="bg-orange-500">{formatCurrency(event.price)}</Badge>
//                           </div>
//                           <div className="flex space-x-2">
//                             <Button onClick={() => handleApproveEvent(event.id)} className="flex-1 bg-green-600 hover:bg-green-700">
//                               <CheckCircle className="w-4 h-4 mr-2" />Approve
//                             </Button>
//                             <Button onClick={() => handleRejectEvent(event.id)} variant="destructive" className="flex-1">
//                               <XCircle className="w-4 h-4 mr-2" />Reject
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold">Approved Events ({approvedEvents.length})</h2>
//                 </div>
//                 <div className="flex gap-4 mb-4">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg"
//                     />
//                   </div>
//                   <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg">
//                     {cities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}
//                   </select>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
//                 </p>
//                 {paginatedEvents.length === 0 ? (
//                   <Card><CardContent className="py-8 text-center text-gray-500">No events</CardContent></Card>
//                 ) : (
//                   <div className="space-y-3">
//                     {paginatedEvents.map(event => (
//                       <Card key={event.id}>
//                         <CardContent className="pt-4 pb-4">
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h3 className="font-bold text-base">{event.title}</h3>
//                               <div className="text-sm text-gray-600 space-y-1 mt-1">
//                                 <p>📅 {event.day_of_week}, {formatDate(event.date)} • {event.time}</p>
//                                 <p>📍 {event.location}, <strong>{event.city}</strong></p>
//                                 <p>👥 {event.participants?.length || 0}/{event.total_spots} participants • {event.spots_left} spots left</p>
//                               </div>
//                             </div>
//                             <Button onClick={() => handleDeleteEvent(event.id, event.title)} variant="destructive" size="sm">
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//                 {totalPages > 1 && (
//                   <div className="flex justify-center items-center gap-4 mt-6">
//                     <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="outline" size="sm">
//                       <ChevronLeft className="w-4 h-4" />Previous
//                     </Button>
//                     <span className="text-sm">Page {currentPage} of {totalPages}</span>
//                     <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="outline" size="sm">
//                       Next<ChevronRight className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="payments">
//             <div className="space-y-6 mt-6">
//               <h2 className="text-xl font-bold">Pending Verification ({pendingPayments.length})</h2>
//               {pendingPayments.length === 0 ? (
//                 <Card><CardContent className="py-8 text-center text-gray-500">✅ No pending payments!</CardContent></Card>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingPayments.map(payment => (
//                     <Card key={payment.id} className="border-yellow-200">
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between mb-4">
//                           <div>
//                             <h3 className="font-bold text-lg">{payment.user_name}</h3>
//                             <p className="text-sm text-gray-600">{payment.event_title}</p>
//                             <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-1 rounded mt-1">{payment.payment_note}</p>
//                           </div>
//                           <p className="text-2xl font-bold text-green-600">{formatCurrency(payment.amount)}</p>
//                         </div>
//                         <div className="flex space-x-2">
//                           <Button onClick={() => handleVerifyPayment(payment.id)} className="flex-1 bg-green-600">
//                             <CheckCircle className="w-4 h-4 mr-2" />Verify
//                           </Button>
//                           <Button onClick={() => handleRejectPayment(payment.id, payment.event_id, payment.user_id)} variant="destructive" className="flex-1">
//                             <XCircle className="w-4 h-4 mr-2" />Reject
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="users">
//             <div className="space-y-4 mt-6">
//               <h2 className="text-xl font-bold">All Users ({allUsers.length})</h2>
//               {allUsers.slice(0, 50).map(user => (
//                 <Card key={user.id}>
//                   <CardContent className="pt-6">
//                     <div className="flex justify-between">
//                       <div>
//                         <h3 className="font-semibold">{user.name}</h3>
//                         <p className="text-sm text-gray-600">{user.email}</p>
//                         <p className="text-xs text-gray-500">{user.city}</p>
//                       </div>
//                       <Badge>{user.joined_events?.length || 0} events</Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="analytics">
//             <div className="space-y-6 mt-6">
//               <Card>
//                 <CardHeader><CardTitle>Platform Metrics</CardTitle></CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between py-2 border-b">
//                       <span>Total Users</span>
//                       <span className="font-bold">{analytics.totalSignups}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b">
//                       <span>Total Payments</span>
//                       <span className="font-bold">{analytics.totalPayments}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b">
//                       <span>Total Revenue</span>
//                       <span className="font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, TrendingUp, DollarSign, Calendar, 
  CheckCircle, XCircle, Trash2, Search,
  Activity, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState({ totalVisits: 0, totalSignups: 0, totalPayments: 0, totalRevenue: 0 });
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [verifiedPayments, setVerifiedPayments] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 20;

  useEffect(() => {
    console.log('🔄 AdminDashboard mounted, loading data...');
    loadAllData();
  }, []);

  const loadAllData = async () => {
    console.log('📊 Loading all admin data...');
    setIsLoading(true);
    try {
      await Promise.all([
        loadAnalytics(),
        loadEvents(),
        loadPayments(),
        loadUsers()
      ]);
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const { count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: participantsCount } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true });
      
      const { data: participants } = await supabase
        .from('event_participants')
        .select('amount_paid');
      
      const totalRevenue = participants?.reduce((sum, p) => sum + (p.amount_paid || 150), 0) || 0;
      
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('*');
      
      const totalVisits = analyticsData?.filter(a => a.event_type === 'page_view').length || 0;
      
      setAnalytics({
        totalVisits,
        totalSignups: profilesCount || 0,
        totalPayments: participantsCount || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const eventsWithDay = events?.map(e => ({
        ...e,
        day_of_week: e.date ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'N/A'
      })) || [];
      
      setPendingEvents(eventsWithDay.filter(e => e.status === 'pending_approval' || e.status === 'pending'));
      setApprovedEvents(eventsWithDay.filter(e => e.status === 'approved'));
      
      console.log('✅ Events loaded:', eventsWithDay.length);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const { data: participants, error } = await supabase
        .from('event_participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!participants || participants.length === 0) {
        setPendingPayments([]);
        setVerifiedPayments([]);
        return;
      }

      const userIds = [...new Set(participants.map(p => p.user_id))];
      const eventIds = [...new Set(participants.map(p => p.event_id))];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);
      
      const { data: events } = await supabase
        .from('events')
        .select('id, title')
        .in('id', eventIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.name || p.email || 'Unknown']) || []);
      const eventMap = new Map(events?.map(e => [e.id, e.title || 'Unknown Event']) || []);

      const paymentsWithInfo = participants.map(p => ({
        id: p.id,
        user_id: p.user_id,
        event_id: p.event_id,
        amount: p.amount_paid || 150,
        payment_note: p.payment_note || 'Not provided',
        created_at: p.created_at,
        user_name: profileMap.get(p.user_id) || 'User ' + p.user_id.slice(0, 8),
        event_title: eventMap.get(p.event_id) || 'Event ' + p.event_id.slice(0, 8),
        verified: p.payment_verified || false,
      }));

      setPendingPayments(paymentsWithInfo.filter(p => !p.verified));
      setVerifiedPayments(paymentsWithInfo.filter(p => p.verified));
      
      console.log('✅ Payments loaded');
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllUsers(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    if (!confirm('Approve this event?')) return;
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'approved', 
          approved_at: new Date().toISOString() 
        })
        .eq('id', eventId);

      if (error) throw error;

      alert('✅ Event approved!');
      await loadEvents();
      await loadAnalytics();
    } catch (error: any) {
      alert('Failed to approve event: ' + error.message);
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'rejected', 
          rejection_reason: reason 
        })
        .eq('id', eventId);

      if (error) throw error;

      alert('❌ Event rejected');
      await loadEvents();
      await loadAnalytics();
    } catch (error: any) {
      alert('Failed to reject event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`⚠️ DELETE "${eventTitle}"? Cannot be undone!`)) return;
    if (!confirm('ABSOLUTELY sure? All participants lose access!')) return;
    try {
      await supabase.from('event_participants').delete().eq('event_id', eventId);
      await supabase.from('events').delete().eq('id', eventId);
      
      alert('🗑️ Event deleted!');
      await loadEvents();
      await loadPayments();
      await loadAnalytics();
    } catch (error: any) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleVerifyPayment = async (paymentId: string, eventId: string, userId: string) => {
    if (!confirm('✅ Verify payment as received?')) return;
    try {
      console.log('✅ Verifying payment:', paymentId);

      // 1. Update payment status to verified
      const { error: paymentError } = await supabase
        .from('event_participants')
        .update({ 
          payment_verified: true, 
          verified_at: new Date().toISOString() 
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // 2. Get event and update participants & spots
      const { data: eventData, error: eventFetchError } = await supabase
        .from('events')
        .select('participants, spots_left, min_participants')
        .eq('id', eventId)
        .single();

      if (eventFetchError) throw eventFetchError;

      const updatedParticipants = [...(eventData.participants || []), userId];
      const newSpotsLeft = Math.max(0, eventData.spots_left - 1);
      const isNowFilled = updatedParticipants.length >= (eventData.min_participants || 2);

      const { error: updateError } = await supabase
        .from('events')
        .update({
          participants: updatedParticipants,
          spots_left: newSpotsLeft,
          event_filled: isNowFilled
        })
        .eq('id', eventId);

      if (updateError) throw updateError;

      // 3. Create user_events record
      const { error: userEventError } = await supabase
        .from('user_events')
        .insert({
          user_id: userId,
          event_id: eventId,
          payment_status: 'paid',
          joined_at: new Date().toISOString()
        });

      if (userEventError && userEventError.code !== '23505') {
        throw userEventError;
      }

      alert('✅ Payment verified! User added to event.');
      await loadPayments();
      await loadEvents();
      await loadAnalytics();

    } catch (error: any) {
      console.error('Verification error:', error);
      alert('Failed to verify payment: ' + error.message);
    }
  };

  const handleRejectPayment = async (paymentId: string, eventId: string, userId: string) => {
    if (!confirm('⚠️ REJECT payment? User loses access!')) return;
    try {
      await supabase.from('event_participants').delete().eq('id', paymentId);
      
      const { data: event } = await supabase
        .from('events')
        .select('spots_left, participants')
        .eq('id', eventId)
        .single();
      
      if (event) {
        const updatedParticipants = (event.participants || []).filter((id: string) => id !== userId);
        await supabase
          .from('events')
          .update({
            spots_left: event.spots_left + 1,
            participants: updatedParticipants
          })
          .eq('id', eventId);
      }
      
      alert('❌ Payment rejected. User removed.');
      await loadPayments();
      await loadEvents();
      await loadAnalytics();
    } catch (error: any) {
      alert('Failed to reject: ' + error.message);
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const cities = ['all', ...new Set(approvedEvents.map(e => e.city).filter(Boolean))];
  const filteredEvents = approvedEvents.filter(event => {
    const matchesCity = selectedCity === 'all' || event.city === selectedCity;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-3">
            <Button onClick={loadAllData} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              🔄 Refresh
            </Button>
            <Button onClick={onLogout} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full flex justify-start gap-2 h-auto p-2 bg-gray-100 rounded-lg overflow-x-auto">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="events">📅 Events</TabsTrigger>
            <TabsTrigger value="payments">💰 Payments ({pendingPayments.length})</TabsTrigger>
            <TabsTrigger value="users">👥 Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                    <Activity className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.totalVisits}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.totalSignups}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                    <TrendingUp className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.totalPayments}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-6 mt-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Pending Approval ({pendingEvents.length})</h2>
                {pendingEvents.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-gray-500">No pending events</CardContent></Card>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map(event => (
                      <Card key={event.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold">{event.title}</h3>
                              <div className="text-sm text-gray-600 space-y-1 mt-2">
                                <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{event.day_of_week}, {formatDate(event.date)} at {event.time}</p>
                                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{event.location}, {event.city}</p>
                              </div>
                            </div>
                            <Badge className="bg-orange-500">{formatCurrency(event.price)}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleApproveEvent(event.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />Approve
                            </Button>
                            <Button onClick={() => handleRejectEvent(event.id)} variant="destructive" className="flex-1">
                              <XCircle className="w-4 h-4 mr-2" />Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Approved Events ({approvedEvents.length})</h2>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                  <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg">
                    {cities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}
                  </select>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                </p>
                {paginatedEvents.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-gray-500">No events</CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {paginatedEvents.map(event => (
                      <Card key={event.id}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-base">{event.title}</h3>
                              <div className="text-sm text-gray-600 space-y-1 mt-1">
                                <p>📅 {event.day_of_week}, {formatDate(event.date)} • {event.time}</p>
                                <p>📍 {event.location}, <strong>{event.city}</strong></p>
                                <p>👥 {event.participants?.length || 0}/{event.total_spots} participants • {event.spots_left} spots left</p>
                              </div>
                            </div>
                            <Button onClick={() => handleDeleteEvent(event.id, event.title)} variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />Previous
                    </Button>
                    <span className="text-sm">Page {currentPage} of {totalPages}</span>
                    <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="outline" size="sm">
                      Next<ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6 mt-6">
              <h2 className="text-xl font-bold">Pending Verification ({pendingPayments.length})</h2>
              {pendingPayments.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-gray-500">✅ No pending payments!</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map(payment => (
                    <Card key={payment.id} className="border-yellow-200">
                      <CardContent className="pt-6">
                        <div className="flex justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{payment.user_name}</h3>
                            <p className="text-sm text-gray-600">{payment.event_title}</p>
                            <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-1 rounded mt-1">{payment.payment_note}</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => handleVerifyPayment(payment.id, payment.event_id, payment.user_id)} className="flex-1 bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />Verify
                          </Button>
                          <Button onClick={() => handleRejectPayment(payment.id, payment.event_id, payment.user_id)} variant="destructive" className="flex-1">
                            <XCircle className="w-4 h-4 mr-2" />Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">All Users ({allUsers.length})</h2>
              {allUsers.slice(0, 50).map(user => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.city}</p>
                      </div>
                      <Badge>{user.joined_events?.length || 0} events</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}