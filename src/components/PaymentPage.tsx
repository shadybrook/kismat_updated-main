

// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, Shield, ArrowLeft, Copy } from 'lucide-react';
// import { db, analytics, auth } from '../utils/supabase';
// import { QRCodeSVG } from 'qrcode.react';
// import { sendConfirmationEmail } from '../utils/email';

// interface PaymentPageProps {
//   eventId: string | null;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
// }

// const UPI_ID = '8369463469@fam';
// const UPI_NAME = 'Kismat';

// export function PaymentPage({ eventId, userId, onNavigate }: PaymentPageProps) {
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [event, setEvent] = useState<any>(null);
//   const [userProfile, setUserProfile] = useState<any>(null);
  
//   const paymentAmount = parseInt(localStorage.getItem('pendingPaymentAmount') || '100');
//   const eventIdForPayment = localStorage.getItem('pendingPaymentEventId');

//   useEffect(() => {
//     if (eventIdForPayment) {
//       loadEventDetails();
//     }
//     if (userId) {
//       loadUserProfile();
//     }
//   }, [eventIdForPayment, userId]);

//   const loadEventDetails = async () => {
//     if (!eventIdForPayment) return;
//     const result = await db.getEventById(eventIdForPayment);
//     if (result.event) {
//       setEvent(result.event);
//     }
//   };

//   const loadUserProfile = async () => {
//     if (!userId) return;
//     const result = await db.getProfile(userId);
//     if (result.profile) {
//       setUserProfile(result.profile);
//     }
//   };

//   const generateUpiUrl = () => {
//     const transactionNote = `Kismat-${event?.title || 'Event'}-${eventIdForPayment}`;
//     return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
//   };

//   const handlePayNow = () => {
//     setPaymentProcessing(true);
//     const upiUrl = generateUpiUrl();
    
//     // For mobile: Direct UPI app open
//     if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
//       window.location.href = upiUrl;
      
//       setTimeout(() => {
//         if (confirm('Have you completed the payment?')) {
//           handlePaymentComplete();
//         } else {
//           setPaymentProcessing(false);
//         }
//       }, 3000);
//     }
//   };

//   const handlePaymentComplete = async () => {
//     if (!userId || !eventIdForPayment) {
//       alert('Missing user or event information');
//       setPaymentProcessing(false);
//       return;
//     }

//     try {
//       setPaymentProcessing(true);
//       console.log('💰 Processing payment completion...');

//       // CRITICAL FIX: Actually add user to the event
//       const pendingJoinUserId = localStorage.getItem('pendingJoinUserId');
//       const pendingJoinUserName = localStorage.getItem('pendingJoinUserName');
//       const pendingJoinEventId = localStorage.getItem('pendingJoinEventId');

//       if (pendingJoinEventId && pendingJoinUserId && pendingJoinUserName) {
//         // Join the event by adding to event_participants table
//         console.log('💰 Adding user to event after payment...', {
//           eventId: pendingJoinEventId,
//           userId: pendingJoinUserId,
//           userName: pendingJoinUserName
//         });
        
//         const joinResult = await db.joinEvent(
//           pendingJoinEventId,
//           pendingJoinUserId,
//           pendingJoinUserName
//         );

//         if (!joinResult.success) {
//           throw new Error(joinResult.error || 'Failed to join event');
//         }

//         console.log('✅ Successfully joined event!');
        
//         // Clear pending join data
//         localStorage.removeItem('pendingJoinEventId');
//         localStorage.removeItem('pendingJoinUserId');
//         localStorage.removeItem('pendingJoinUserName');
//       }

//       // If this is a creator payment (not a regular join)
//       if (eventIdForPayment) {
//         await db.markEventAsPaid(eventIdForPayment);
//       }
      
//       // Track payment
//       await analytics.trackPayment(paymentAmount);
      
//       // Send confirmation email
//       const { user } = await auth.getCurrentUser();
//       if (user?.email && event && userProfile) {
//         await sendConfirmationEmail({
//           to: user.email,
//           userName: userProfile.name || 'there',
//           eventTitle: event.title,
//           eventDate: event.date,
//           eventTime: event.time,
//           eventLocation: event.location,
//           amount: paymentAmount,
//         });
//       }
      
//       setPaymentProcessing(false);
//       setPaymentComplete(true);
      
//       localStorage.removeItem('pendingPaymentAmount');
//       localStorage.removeItem('pendingPaymentEventId');

//       console.log('🎉 Payment complete! User added to event.');
//     } catch (error) {
//       console.error('❌ Error confirming payment:', error);
//       setPaymentProcessing(false);
//       alert('Failed to confirm payment. Please contact support with event ID: ' + eventIdForPayment);
//     }
//   };

//   const copyUpiId = () => {
//     navigator.clipboard.writeText(UPI_ID);
//     alert('UPI ID copied!');
//   };

//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-white px-6 py-8 flex items-center justify-center">
//         <div className="max-w-md mx-auto text-center">
//           <Card className="border-gray-200">
//             <CardHeader>
//               <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//                 <CheckCircle className="w-8 h-8 text-green-600" />
//               </div>
//               <CardTitle className="text-xl text-green-600">Payment Successful!</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <p className="text-sm text-green-800">
//                   <strong>₹{paymentAmount} paid successfully</strong>
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">
//                   Confirmation email sent!
//                 </p>
//               </div>
//               <Button
//                 onClick={() => onNavigate('dashboard')}
//                 className="w-full bg-black text-white hover:bg-gray-800 py-3"
//               >
//                 Go to Dashboard
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   const upiUrl = generateUpiUrl();

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="bg-black text-white px-6 py-4 flex items-center">
//         <Button
//           onClick={() => onNavigate('events')}
//           variant="ghost"
//           size="sm"
//           className="text-white hover:bg-gray-800 mr-4"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </Button>
//         <h1 className="text-lg">Complete Payment</h1>
//       </div>

//       <div className="px-6 py-8">
//         <div className="max-w-md mx-auto space-y-6">
//           {/* Mobile: Direct UPI Button */}
//           <div className="md:hidden">
//             <Button
//               onClick={handlePayNow}
//               disabled={paymentProcessing}
//               className="w-full bg-indigo-600 text-white py-6 text-lg hover:bg-indigo-700"
//             >
//               {paymentProcessing ? 'Waiting for payment...' : `Pay ₹${paymentAmount} with UPI`}
//             </Button>
//             <p className="text-sm text-gray-500 mt-2 text-center">
//               Opens your UPI app (GPay, PhonePe, FamPay)
//             </p>
//           </div>

//           {/* Desktop: QR Code */}
//           <div className="hidden md:block">
//             <Card className="border-gray-200">
//               <CardHeader>
//                 <CardTitle>Scan QR Code</CardTitle>
//               </CardHeader>
//               <CardContent className="text-center">
//                 <div className="flex justify-center mb-4">
//                   <QRCodeSVG value={upiUrl} size={200} />
//                 </div>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Scan with any UPI app to pay ₹{paymentAmount}
//                 </p>
                
//                 {/* NEW: Payment verification warning */}
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
//                   <p className="text-xs text-yellow-800 font-semibold mb-1">⚠️ Important</p>
//                   <p className="text-xs text-yellow-700">
//                     Only click "I've Completed the Payment" AFTER you've actually paid. 
//                     Our team verifies all payments. Unpaid entries will be removed.
//                   </p>
//                 </div>
                
//                 <Button
//                   onClick={handlePaymentComplete}
//                   disabled={paymentProcessing}
//                   className="w-full bg-green-600 text-white hover:bg-green-700"
//                 >
//                   {paymentProcessing ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Processing...</span>
//                     </div>
//                   ) : (
//                     'I\'ve Completed the Payment'
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* UPI ID Display */}
//           <Card className="border-gray-200">
//             <CardContent className="p-4">
//               <p className="text-sm text-gray-600 mb-2">Or pay directly to:</p>
//               <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
//                 <span className="font-mono font-semibold">{UPI_ID}</span>
//                 <Button
//                   onClick={copyUpiId}
//                   variant="ghost"
//                   size="sm"
//                   className="text-indigo-600"
//                 >
//                   <Copy className="w-4 h-4 mr-1" />
//                   Copy
//                 </Button>
//               </div>
//               <p className="text-xs text-gray-500 mt-2">
//                 Amount: ₹{paymentAmount} | Note: Kismat-{event?.title}
//               </p>
//             </CardContent>
//           </Card>

//           {event && (
//             <Card className="border-indigo-200 bg-indigo-50">
//               <CardContent className="p-4">
//                 <h3 className="font-semibold text-indigo-900 mb-2">{event.title}</h3>
//                 <p className="text-sm text-indigo-700">📍 {event.location}</p>
//                 <p className="text-sm text-indigo-700">📅 {event.date} at {event.time}</p>
//               </CardContent>
//             </Card>
//           )}

//           <Card className="border-blue-200 bg-blue-50">
//             <CardContent className="p-4 flex items-start space-x-3">
//               <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//               <div className="text-sm">
//                 <p className="text-blue-800 mb-1">
//                   <strong>Platform Fee - Refundable for Creators!</strong>
//                 </p>
//                 <p className="text-blue-700">
//                   Full refund if NO ONE joins your event by the scheduled time.
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, AlertCircle } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface PaymentPageProps {
//   eventId: string | null;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
//   onBack: () => void;
// }

// export function PaymentPage({ eventId, userId, onNavigate, onBack }: PaymentPageProps) {
//   const [event, setEvent] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     loadEventDetails();
//     loadUserName();
//   }, [eventId]);

//   const loadEventDetails = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    
//     if (!eventIdToUse) {
//       alert('Missing event information');
//       onNavigate('dashboard');
//       return;
//     }

//     const result = await db.getEventById(eventIdToUse);
//     if (result.event) {
//       setEvent(result.event);
//     } else {
//       alert('Failed to load event details');
//       onNavigate('dashboard');
//     }
//     setIsLoading(false);
//   };

//   const loadUserName = async () => {
//     const storedName = localStorage.getItem('pendingJoinUserName');
//     if (storedName) {
//       setUserName(storedName);
//     }
//   };

//   const handlePaymentComplete = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
//     const userIdToUse = userId || localStorage.getItem('pendingJoinUserId');
//     const userNameToUse = userName || localStorage.getItem('pendingJoinUserName');

//     if (!eventIdToUse || !userIdToUse || !userNameToUse) {
//       alert('Missing user or event information');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const result = await db.joinEvent(eventIdToUse, userIdToUse, userNameToUse);
      
//       if (result.success) {
//         await analytics.trackPayment(event.price);
        
//         setPaymentCompleted(true);
        
//         localStorage.removeItem('pendingJoinEventId');
//         localStorage.removeItem('pendingJoinUserId');
//         localStorage.removeItem('pendingJoinUserName');

//         setTimeout(() => {
//           onNavigate('dashboard');
//         }, 2000);
//       } else {
//         alert(result.error || 'Failed to join event');
//         setIsLoading(false);
//       }
//     } catch (error) {
//       console.error('Error completing payment:', error);
//       alert('An error occurred. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   if (isLoading && !event) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-gray-500">Loading payment details...</p>
//       </div>
//     );
//   }

//   if (paymentCompleted) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//             <h2 className="text-xl font-bold mb-2">Payment Confirmed!</h2>
//             <p className="text-gray-600">You've successfully joined the event.</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       <div className="max-w-md mx-auto">
//         <Button onClick={onBack} variant="ghost" className="mb-4">
//           ← Back
//         </Button>

//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Event Details</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <h3 className="font-semibold text-lg mb-2">{event?.title}</h3>
//             <p className="text-sm text-gray-600">{event?.date} at {event?.time}</p>
//             <p className="text-sm text-gray-600">{event?.location}</p>
//             <div className="mt-4 pt-4 border-t">
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-semibold">Amount to Pay:</span>
//                 <span className="text-2xl font-bold text-blue-600">₹{event?.price}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Payment Instructions</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <p className="text-sm font-semibold text-blue-800 mb-2">⚠️ CRITICAL - READ CAREFULLY</p>
//               <p className="text-sm text-blue-700 mb-3">
//                 When making payment via UPI, you MUST write this in the payment note/remark:
//               </p>
//               <div className="bg-white border-2 border-blue-400 rounded p-3 text-center">
//                 <p className="font-bold text-lg text-blue-900">{userName}-Kismat</p>
//               </div>
//               <p className="text-xs text-blue-600 mt-2">
//                 Example: If your name is "Raj Kumar", write: <strong>Raj Kumar-Kismat</strong>
//               </p>
//             </div>

//             <div className="space-y-2">
//               <p className="font-semibold">1. Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</p>
//               <p className="font-semibold">2. Scan this QR code:</p>
              
//               <div className="bg-gray-100 p-6 rounded-lg text-center">
//                 <div className="w-64 h-64 bg-white mx-auto flex items-center justify-center border-2 border-gray-300">
//                   <p className="text-gray-400">QR Code Placeholder</p>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-2">FamPay UPI ID: kismat@fam</p>
//               </div>

//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
//                 <p className="text-xs font-semibold text-yellow-800 mb-1">⚠️ Why this matters:</p>
//                 <p className="text-xs text-yellow-700">
//                   If your bank account name is different from your profile name, we need this note to verify your payment. Without it, your entry may be removed.
//                 </p>
//               </div>

//               <p className="font-semibold mt-4">3. Enter amount: ₹{event?.price}</p>
//               <p className="font-semibold">4. Add note: <span className="text-blue-600">{userName}-Kismat</span></p>
//               <p className="font-semibold">5. Complete payment</p>
//               <p className="font-semibold">6. Click "I've Completed the Payment" below</p>
//             </div>

//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <div className="flex items-start gap-2">
//                 <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-semibold text-red-800">Important Notice</p>
//                   <p className="text-xs text-red-700 mt-1">
//                     Only click "I've Completed the Payment" AFTER you've actually paid. 
//                     Our team verifies all payments. Unpaid entries will be removed within 24 hours.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Button
//           onClick={handlePaymentComplete}
//           disabled={isLoading}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
//         >
//           {isLoading ? 'Processing...' : "✓ I've Completed the Payment"}
//         </Button>

//         <p className="text-xs text-gray-500 text-center mt-4">
//           By confirming, you agree that you have made the payment of ₹{event?.price}
//         </p>
//       </div>
//     </div>
//   );
// }



















































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, Copy, ArrowLeft, Shield, Smartphone } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface PaymentPageProps {
//   onNavigate: (screen: string) => void;
//   userId: string | null;
//   username: string;
// }

// const PaymentPage: React.FC<PaymentPageProps> = ({ onNavigate, userId, username }) => {
//   const [paymentAmount, setPaymentAmount] = useState(100);
//   const [paymentType, setPaymentType] = useState<'event_join' | 'event_creation'>('event_join');
//   const [eventDetails, setEventDetails] = useState<any>(null);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//   const FAMPAY_UPI_ID = '8369463469@fam';
//   const paymentNote = `kismat-${username}`;

//   useEffect(() => {
//     loadPaymentDetails();
//   }, []);

//   const loadPaymentDetails = () => {
//     // Check if this is an event creation payment
//     const creatorPayment = localStorage.getItem('pendingCreatorPayment');
//     if (creatorPayment) {
//       const payment = JSON.parse(creatorPayment);
//       setPaymentAmount(payment.amount);
//       setPaymentType('event_creation');
//       setEventDetails(payment);
//       return;
//     }

//     // Check if this is an event join payment
//     const joinPayment = localStorage.getItem('pendingEventJoin');
//     if (joinPayment) {
//       const payment = JSON.parse(joinPayment);
//       setPaymentAmount(payment.price);
//       setPaymentType('event_join');
//       setEventDetails(payment);
//       return;
//     }

//     // No pending payment found
//     console.error('No pending payment found');
//   };

//   const handlePayNow = () => {
//     // Open UPI app with pre-filled details
//     const upiUrl = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=Kismat&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(paymentNote)}`;
    
//     // Try to open UPI app
//     window.location.href = upiUrl;
    
//     // Show confirmation button after attempting to open UPI
//     setTimeout(() => {
//       setPaymentProcessing(true);
//     }, 1000);
//   };

//   const handlePaymentConfirmation = async () => {
//     try {
//       setPaymentProcessing(true);

//       if (paymentType === 'event_creation') {
//         // 🔥 HANDLE EVENT CREATION
//         await completeEventCreation();
//       } else {
//         // 🔥 HANDLE EVENT JOIN
//         await completeEventJoin();
//       }

//       // Track successful payment
//       if (analytics) {
//         await analytics.trackPayment(
//           paymentAmount,
//           paymentType,
//           eventDetails?.eventId || 'new_event'
//         );
//       }

//       // Show success message
//       setShowSuccessMessage(true);
//       setPaymentComplete(true);

//       // Clear all payment-related localStorage
//       setTimeout(() => {
//         localStorage.removeItem('pendingCreatorPayment');
//         localStorage.removeItem('pendingEventCreation');
//         localStorage.removeItem('pendingEventJoin');
        
//         // Redirect based on payment type
//         if (paymentType === 'event_creation') {
//           onNavigate('events'); // Go back to events page
//         } else {
//           onNavigate('chat'); // Go to event chat
//         }
//       }, 2000);

//     } catch (error) {
//       console.error('Payment confirmation error:', error);
//       alert('Payment confirmation failed. Please contact support.');
//       setPaymentProcessing(false);
//     }
//   };

//   // 🔥 NEW: Complete event creation from saved form data
//   const completeEventCreation = async () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (!savedFormData) {
//       throw new Error('No saved event data found');
//     }

//     const formData = JSON.parse(savedFormData);

//     // Calculate total spots
//     const additionalPeople = formData.additionalPeopleRange === 'custom'
//       ? parseInt(formData.customPeopleCount)
//       : parseInt(formData.additionalPeopleRange);
    
//     const totalSpots = formData.creatorGroupSize + additionalPeople;

//     // Upload image if available
//     let imageUrl = '';
//     if (formData.imagePreview) {
//       // In a real implementation, you'd upload to storage here
//       // For now, we'll use the base64 preview
//       imageUrl = formData.imagePreview;
//     }

//     // Create event in database
//     const { data: newEvent, error: eventError } = await db
//       .from('events')
//       .insert({
//         title: formData.title,
//         description: formData.description,
//         event_type: formData.eventType,
//         location: formData.location,
//         date: formData.date,
//         time: formData.time,
//         city: formData.city,
//         price: 100, // Platform fee
//         total_spots: totalSpots,
//         spots_left: additionalPeople, // Available spots for others
//         participants: [userId], // Creator is first participant
//         category: formData.eventType,
//         image_url: imageUrl,
//         created_by: userId,
//         creator_paid: true,
//         status: 'pending_approval',
//         is_girls_only: formData.isGirlsOnly,
//         creator_group_size: formData.creatorGroupSize,
//         min_participants: formData.creatorGroupSize + 1, // At least 1 more person needed
//       })
//       .select()
//       .single();

//     if (eventError) {
//       throw eventError;
//     }

//     console.log('Event created successfully:', newEvent);
//   };

//   // 🔥 EXISTING: Complete event join
//   const completeEventJoin = async () => {
//     const joinData = localStorage.getItem('pendingEventJoin');
//     if (!joinData) {
//       throw new Error('No pending join found');
//     }

//     const { eventId } = JSON.parse(joinData);

//     // Get event details
//     const { data: event, error: fetchError } = await db
//       .from('events')
//       .select('*')
//       .eq('id', eventId)
//       .single();

//     if (fetchError || !event) {
//       throw new Error('Event not found');
//     }

//     // Add user to participants
//     const updatedParticipants = [...event.participants, userId];
//     const updatedSpotsLeft = event.spots_left - 1;

//     const { error: updateError } = await db
//       .from('events')
//       .update({
//         participants: updatedParticipants,
//         spots_left: updatedSpotsLeft,
//       })
//       .eq('id', eventId);

//     if (updateError) {
//       throw updateError;
//     }

//     console.log('Successfully joined event:', eventId);
//   };

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text);
//     alert(`${label} copied to clipboard!`);
//   };

//   // Success screen
//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <div className="text-center max-w-md">
//           <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle className="w-16 h-16 text-green-600" />
//           </div>
          
//           <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
//             {paymentType === 'event_creation' ? 'Event Created!' : 'Payment Successful!'}
//           </h1>
          
//           {paymentType === 'event_creation' ? (
//             <div className="space-y-3">
//               <p className="text-gray-600 text-lg">
//                 Your event has been submitted for review
//               </p>
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//                 <p className="text-sm text-blue-900 font-semibold mb-2">
//                   ⏳ What happens next?
//                 </p>
//                 <ul className="text-xs text-blue-700 space-y-2">
//                   <li>• Admin will review your event (usually within 24 hours)</li>
//                   <li>• You'll receive an email once approved</li>
//                   <li>• Your event will then be visible to everyone</li>
//                   <li>• Others can start joining your event</li>
//                 </ul>
//               </div>
//               <p className="text-sm text-gray-500 mt-4">
//                 Redirecting to events page...
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <p className="text-gray-600 text-lg">
//                 You've joined the event successfully!
//               </p>
//               <p className="text-sm text-gray-500">
//                 Opening event chat...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-black text-white px-6 py-6 sticky top-0 z-10">
//         <div className="flex items-center space-x-3">
//           <Button
//             onClick={() => onNavigate('events')}
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-800"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <h1 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
//             Complete Payment
//           </h1>
//         </div>
//       </div>

//       <div className="px-6 py-6 space-y-6">
//         {/* Payment Amount Card */}
//         <Card className="border-2 border-purple-500 shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               ₹{paymentAmount}
//             </CardTitle>
//             <p className="text-gray-600 text-sm mt-2">
//               {paymentType === 'event_creation' 
//                 ? `Creating Event: ${eventDetails?.eventTitle || 'Your Event'}`
//                 : `Joining: ${eventDetails?.eventTitle || 'Event'}`
//               }
//             </p>
//           </CardHeader>
//         </Card>

//         {/* Payment Type Info */}
//         {paymentType === 'event_creation' && (
//           <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
//             <CardContent className="pt-6">
//               <div className="space-y-2 text-sm">
//                 <p className="font-semibold text-purple-900">
//                   💳 Payment Breakdown:
//                 </p>
//                 <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
//                   <p className="text-gray-700">
//                     • Your group: {eventDetails?.groupSize || 1} {eventDetails?.groupSize === 1 ? 'person' : 'people'} × ₹100
//                   </p>
//                   <p className="font-semibold text-purple-600">
//                     • Total: ₹{paymentAmount}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* IMPORTANT: Payment Note */}
//         <Card className="border-2 border-orange-500 bg-orange-50 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex items-start space-x-3">
//               <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-orange-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   ⚠️ CRITICAL: Add Payment Note
//                 </h3>
//                 <p className="text-xs text-orange-800 mb-3">
//                   When paying, write this in the note/remark field:
//                 </p>
//                 <div className="bg-white p-4 rounded-lg border-2 border-orange-300 flex items-center justify-between">
//                   <code className="font-bold text-base text-gray-900">{paymentNote}</code>
//                   <Button
//                     onClick={() => copyToClipboard(paymentNote, 'Payment note')}
//                     size="sm"
//                     variant="outline"
//                     className="ml-2"
//                   >
//                     <Copy className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-orange-700 mt-2">
//                   This helps us verify your payment quickly!
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* QR Code Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Scan QR Code to Pay
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
//                 <img 
//                   src="/qr-code-fampay.jpg" 
//                   alt="FamPay QR Code" 
//                   className="w-64 h-64 object-contain"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                     console.error('QR code image not found');
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 text-center">
//                 Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* UPI ID Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-center text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Or Enter UPI ID Manually
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600 mb-1">FamPay UPI ID:</p>
//                 <code className="font-bold text-lg">{FAMPAY_UPI_ID}</code>
//               </div>
//               <Button
//                 onClick={() => copyToClipboard(FAMPAY_UPI_ID, 'UPI ID')}
//                 size="sm"
//                 variant="outline"
//               >
//                 <Copy className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Instructions */}
//         <Card className="bg-blue-50 border-blue-200">
//           <CardContent className="pt-6">
//             <div className="space-y-3 text-sm">
//               <p className="font-semibold text-blue-900 flex items-center">
//                 <Smartphone className="w-4 h-4 mr-2" />
//                 How to Pay:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 text-blue-800 text-xs">
//                 <li>Click "Pay ₹{paymentAmount} Now" button below</li>
//                 <li>Your UPI app will open automatically</li>
//                 <li>Add payment note: <strong>{paymentNote}</strong></li>
//                 <li>Complete payment in your UPI app</li>
//                 <li>Return here and click "I've Completed Payment"</li>
//               </ol>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Buttons */}
//         <div className="space-y-3">
//           {!paymentProcessing ? (
//             <Button
//               onClick={handlePayNow}
//               className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               💳 Pay ₹{paymentAmount} Now
//             </Button>
//           ) : (
//             <Button
//               onClick={handlePaymentConfirmation}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               ✓ I've Completed Payment
//             </Button>
//           )}
          
//           <Button
//             onClick={() => {
//               // Don't clear localStorage here - user might come back
//               onNavigate('events');
//             }}
//             variant="outline"
//             className="w-full"
//           >
//             Cancel Payment
//           </Button>
//         </div>

//         {/* Important Notes */}
//         <div className="bg-gray-100 rounded-lg p-4 space-y-2 text-xs text-gray-600">
//           <p className="font-semibold text-gray-800">📝 Important Notes:</p>
//           <ul className="space-y-1 ml-4 list-disc">
//             <li>Payments are processed instantly</li>
//             <li>You'll receive confirmation via email</li>
//             <li>For issues, contact: <strong>findyourkismat@gmail.com</strong></li>
//             {paymentType === 'event_creation' && (
//               <li className="text-orange-600 font-semibold">
//                 Your event data is saved - safe to switch apps!
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { PaymentPage };





















// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, Copy, ArrowLeft, Shield, Smartphone } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface PaymentPageProps {
//   eventId: string | null;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
//   onBack?: () => void;
// }

// export function PaymentPage({ eventId, userId, onNavigate, onBack }: PaymentPageProps) {
//   const [paymentAmount, setPaymentAmount] = useState(150);
//   const [paymentType, setPaymentType] = useState<'event_join' | 'event_creation'>('event_join');
//   const [eventDetails, setEventDetails] = useState<any>(null);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [userName, setUserName] = useState('');

//   const FAMPAY_UPI_ID = '8369463469@fam';
//   const paymentNote = `kismat-${userName}`;

//   useEffect(() => {
//     loadPaymentDetails();
//   }, []);

//   const loadPaymentDetails = () => {
//     // Check if this is an event creation payment
//     const creatorPayment = localStorage.getItem('pendingCreatorPayment');
//     if (creatorPayment) {
//       const payment = JSON.parse(creatorPayment);
//       setPaymentAmount(payment.amount);
//       setPaymentType('event_creation');
//       setEventDetails(payment);
//       setUserName(payment.username || 'user');
//       return;
//     }

//     // Check if this is an event join payment
//     const joinPayment = localStorage.getItem('pendingJoinEventId');
//     if (joinPayment) {
//       const username = localStorage.getItem('pendingJoinUserName') || 'user';
//       setUserName(username);
//       loadEventDetails();
//       return;
//     }

//     // No pending payment found
//     console.error('No pending payment found');
//   };

//   const loadEventDetails = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    
//     if (!eventIdToUse) {
//       alert('Missing event information');
//       onNavigate('events');
//       return;
//     }

//     const result = await db.getEventById(eventIdToUse);
//     if (result.event) {
//       setEventDetails(result.event);
//       setPaymentAmount(result.event.price || 150);
//     } else {
//       alert('Failed to load event details');
//       onNavigate('events');
//     }
//   };

//   const handlePayNow = () => {
//     // Open UPI app with pre-filled details
//     const upiUrl = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=Kismat&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(paymentNote)}`;
    
//     // Try to open UPI app
//     window.location.href = upiUrl;
    
//     // Show confirmation button after attempting to open UPI
//     setTimeout(() => {
//       setPaymentProcessing(true);
//     }, 1000);
//   };

//   const handlePaymentConfirmation = async () => {
//     try {
//       setPaymentProcessing(true);

//       if (paymentType === 'event_creation') {
//         // 🔥 HANDLE EVENT CREATION
//         await completeEventCreation();
//       } else {
//         // 🔥 HANDLE EVENT JOIN
//         await completeEventJoin();
//       }

//       // Track successful payment
//       if (analytics) {
//         await analytics.trackPayment(paymentAmount);
//       }

//       // Show success message
//       setPaymentComplete(true);

//       // Clear all payment-related localStorage
//       setTimeout(() => {
//         localStorage.removeItem('pendingCreatorPayment');
//         localStorage.removeItem('pendingEventCreation');
//         localStorage.removeItem('pendingJoinEventId');
//         localStorage.removeItem('pendingJoinUserId');
//         localStorage.removeItem('pendingJoinUserName');
        
//         // Redirect
//         onNavigate('events');
//       }, 2000);

//     } catch (error) {
//       console.error('Payment confirmation error:', error);
//       alert('Payment confirmation failed. Please contact support.');
//       setPaymentProcessing(false);
//     }
//   };

//   // 🔥 NEW: Complete event creation from saved form data
//   const completeEventCreation = async () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (!savedFormData) {
//       throw new Error('No saved event data found');
//     }

//     const formData = JSON.parse(savedFormData);

//     const eventData = {
//       title: formData.title || `${formData.eventType} Event`,
//       date: formData.date || 'TBD',
//       time: formData.time || 'TBD',
//       location: formData.location,
//       distance: 'Custom location',
//       spotsLeft: formData.additionalPeople,
//       totalSpots: formData.totalSpots,
//       participants: [],
//       price: 150,
//       category: getCategoryFromEventType(formData.eventType),
//       description: formData.description || `Join us for ${formData.eventType.toLowerCase()}!`,
//       createdBy: userId,
//       girlsOnly: formData.isGirlsOnly,
//       creatorGroupSize: formData.creatorGroupSize,
//       creatorPaymentAmount: paymentAmount,
//       minParticipants: formData.creatorGroupSize + 1,
//       maxParticipants: formData.totalSpots,
//       creatorPaid: true,
//       eventFilled: false,
//       imageUrl: formData.imagePreview,
//       city: formData.city
//     };

//     const result = await db.createEvent(eventData);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to create event');
//     }

//     console.log('✅ Event created successfully:', result.event);
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   // 🔥 EXISTING: Complete event join
//   const completeEventJoin = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
//     const userIdToUse = userId || localStorage.getItem('pendingJoinUserId');
//     const userNameToUse = userName || localStorage.getItem('pendingJoinUserName');

//     if (!eventIdToUse || !userIdToUse || !userNameToUse) {
//       throw new Error('Missing user or event information');
//     }

//     const result = await db.joinEvent(eventIdToUse, userIdToUse, userNameToUse);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to join event');
//     }

//     console.log('✅ Successfully joined event:', eventIdToUse);
//   };

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text);
//     alert(`${label} copied to clipboard!`);
//   };

//   // Success screen
//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-16 h-16 text-green-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               {paymentType === 'event_creation' ? 'Event Created!' : 'Payment Confirmed!'}
//             </h2>
            
//             {paymentType === 'event_creation' ? (
//               <div className="space-y-3">
//                 <p className="text-gray-600">
//                   Your event has been submitted for review
//                 </p>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//                   <p className="text-sm text-blue-900 font-semibold mb-2">
//                     ⏳ What happens next?
//                   </p>
//                   <ul className="text-xs text-blue-700 space-y-2">
//                     <li>• Admin will review your event (usually within 24 hours)</li>
//                     <li>• You'll receive an email once approved</li>
//                     <li>• Your event will then be visible to everyone</li>
//                   </ul>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-4">
//                   Redirecting to events page...
//                 </p>
//               </div>
//             ) : (
//               <p className="text-gray-600">You've successfully joined the event.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       <div className="max-w-md mx-auto">
//         <Button 
//           onClick={() => onBack ? onBack() : onNavigate('events')} 
//           variant="ghost" 
//           className="mb-4"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </Button>

//         {/* Amount Card */}
//         <Card className="mb-6 border-2 border-purple-500 shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               ₹{paymentAmount}
//             </CardTitle>
//             <p className="text-gray-600 text-sm mt-2">
//               {paymentType === 'event_creation' 
//                 ? `Creating Event: ${eventDetails?.eventTitle || 'Your Event'}`
//                 : `Joining: ${eventDetails?.title || 'Event'}`
//               }
//             </p>
//           </CardHeader>
//         </Card>

//         {/* Event Details Card (for joining events) */}
//         {paymentType === 'event_join' && eventDetails && (
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Event Details</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <h3 className="font-semibold text-lg mb-2">{eventDetails.title}</h3>
//               <p className="text-sm text-gray-600">{eventDetails.date} at {eventDetails.time}</p>
//               <p className="text-sm text-gray-600">{eventDetails.location}</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Payment Type Info */}
//         {paymentType === 'event_creation' && (
//           <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
//             <CardContent className="pt-6">
//               <div className="space-y-2 text-sm">
//                 <p className="font-semibold text-purple-900">
//                   💳 Payment Breakdown:
//                 </p>
//                 <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
//                   <p className="text-gray-700">
//                     • Your group: {eventDetails?.groupSize || 1} {eventDetails?.groupSize === 1 ? 'person' : 'people'} × ₹150
//                   </p>
//                   <p className="font-semibold text-purple-600">
//                     • Total: ₹{paymentAmount}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* CRITICAL: Payment Note */}
//         <Card className="mb-6 border-2 border-orange-500 bg-orange-50 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex items-start space-x-3">
//               <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-orange-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   ⚠️ CRITICAL: Add Payment Note
//                 </h3>
//                 <p className="text-sm text-orange-800 mb-3">
//                   When making payment via UPI, you MUST write this in the payment note/remark:
//                 </p>
//                 <div className="bg-white p-4 rounded-lg border-2 border-orange-300 flex items-center justify-between">
//                   <code className="font-bold text-base text-gray-900">{paymentNote}</code>
//                   <Button
//                     onClick={() => copyToClipboard(paymentNote, 'Payment note')}
//                     size="sm"
//                     variant="outline"
//                     className="ml-2"
//                   >
//                     <Copy className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-orange-700 mt-2">
//                   This helps us verify your payment quickly!
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* QR Code Section */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Scan QR Code to Pay
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
//                 <img 
//                   src="/qr-code-fampay.jpg" 
//                   alt="FamPay QR Code" 
//                   className="w-64 h-64 object-contain"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                     console.error('QR code image not found');
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 text-center">
//                 Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* UPI ID Section */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Or Enter UPI ID Manually
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600 mb-1">FamPay UPI ID:</p>
//                 <code className="font-bold text-lg">{FAMPAY_UPI_ID}</code>
//               </div>
//               <Button
//                 onClick={() => copyToClipboard(FAMPAY_UPI_ID, 'UPI ID')}
//                 size="sm"
//                 variant="outline"
//               >
//                 <Copy className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Instructions */}
//         <Card className="mb-6 bg-blue-50 border-blue-200">
//           <CardContent className="pt-6">
//             <div className="space-y-3 text-sm">
//               <p className="font-semibold text-blue-900 flex items-center">
//                 <Smartphone className="w-4 h-4 mr-2" />
//                 How to Pay:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 text-blue-800 text-xs">
//                 <li>Click "Pay ₹{paymentAmount} Now" button below</li>
//                 <li>Your UPI app will open automatically</li>
//                 <li>Add payment note: <strong>{paymentNote}</strong></li>
//                 <li>Complete payment in your UPI app</li>
//                 <li>Return here and click "I've Completed Payment"</li>
//               </ol>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Buttons */}
//         <div className="space-y-3">
//           {!paymentProcessing ? (
//             <Button
//               onClick={handlePayNow}
//               className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               💳 Pay ₹{paymentAmount} Now
//             </Button>
//           ) : (
//             <Button
//               onClick={handlePaymentConfirmation}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               ✓ I've Completed the Payment
//             </Button>
//           )}
          
//           <Button
//             onClick={() => onBack ? onBack() : onNavigate('events')}
//             variant="outline"
//             className="w-full"
//           >
//             Cancel Payment
//           </Button>
//         </div>

//         {/* Important Notes */}
//         <div className="bg-gray-100 rounded-lg p-4 mt-6 space-y-2 text-xs text-gray-600">
//           <p className="font-semibold text-gray-800">📝 Important Notes:</p>
//           <ul className="space-y-1 ml-4 list-disc">
//             <li>Payments are processed instantly</li>
//             <li>You'll receive confirmation via email</li>
//             <li>For issues, contact: <strong>findyourkismat@gmail.com</strong></li>
//             {paymentType === 'event_creation' && (
//               <li className="text-orange-600 font-semibold">
//                 Your event data is saved - safe to switch apps!
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }






















// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, Copy, ArrowLeft, Shield, Smartphone } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface PaymentPageProps {
//   eventId: string | null;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
//   onBack?: () => void;
// }

// export function PaymentPage({ eventId, userId, onNavigate, onBack }: PaymentPageProps) {
//   const [paymentAmount, setPaymentAmount] = useState(150);
//   const [paymentType, setPaymentType] = useState<'event_join' | 'event_creation'>('event_join');
//   const [eventDetails, setEventDetails] = useState<any>(null);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [userName, setUserName] = useState('');

//   const FAMPAY_UPI_ID = '8369463469@fam';
//   const paymentNote = `kismat-${userName}`;

//   useEffect(() => {
//     loadPaymentDetails();
//   }, []);

//   const loadPaymentDetails = () => {
//     // Check if this is an event creation payment
//     const creatorPayment = localStorage.getItem('pendingCreatorPayment');
//     if (creatorPayment) {
//       const payment = JSON.parse(creatorPayment);
//       setPaymentAmount(payment.amount);
//       setPaymentType('event_creation');
//       setEventDetails(payment);
//       setUserName(payment.username || 'user');
//       return;
//     }

//     // Check if this is an event join payment
//     const joinPayment = localStorage.getItem('pendingJoinEventId');
//     if (joinPayment) {
//       const username = localStorage.getItem('pendingJoinUserName') || 'user';
//       setUserName(username);
//       loadEventDetails();
//       return;
//     }

//     // No pending payment found
//     console.error('No pending payment found');
//   };

//   const loadEventDetails = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    
//     if (!eventIdToUse) {
//       alert('Missing event information');
//       onNavigate('events');
//       return;
//     }

//     const result = await db.getEventById(eventIdToUse);
//     if (result.event) {
//       setEventDetails(result.event);
//       setPaymentAmount(result.event.price || 150);
//     } else {
//       alert('Failed to load event details');
//       onNavigate('events');
//     }
//   };

//   const handlePayNow = () => {
//     // Open UPI app with pre-filled details
//     const upiUrl = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=Kismat&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(paymentNote)}`;
    
//     // Try to open UPI app
//     window.location.href = upiUrl;
    
//     // Show confirmation button after attempting to open UPI
//     setTimeout(() => {
//       setPaymentProcessing(true);
//     }, 1000);
//   };

//   const handlePaymentConfirmation = async () => {
//     try {
//       setPaymentProcessing(true);

//       if (paymentType === 'event_creation') {
//         // 🔥 HANDLE EVENT CREATION
//         await completeEventCreation();
//       } else {
//         // 🔥 HANDLE EVENT JOIN
//         await completeEventJoin();
//       }

//       // Track successful payment
//       if (analytics) {
//         await analytics.trackPayment(paymentAmount);
//       }

//       // Show success message
//       setPaymentComplete(true);

//       // Clear all payment-related localStorage
//       setTimeout(() => {
//         localStorage.removeItem('pendingCreatorPayment');
//         localStorage.removeItem('pendingEventCreation');
//         localStorage.removeItem('pendingJoinEventId');
//         localStorage.removeItem('pendingJoinUserId');
//         localStorage.removeItem('pendingJoinUserName');
        
//         // Redirect
//         onNavigate('events');
//       }, 2000);

//     } catch (error) {
//       console.error('Payment confirmation error:', error);
//       alert('Payment confirmation failed. Please contact support.');
//       setPaymentProcessing(false);
//     }
//   };

//   // 🔥 NEW: Complete event creation from saved form data
//   const completeEventCreation = async () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (!savedFormData) {
//       throw new Error('No saved event data found');
//     }

//     const formData = JSON.parse(savedFormData);

//     const eventData = {
//       title: formData.title || `${formData.eventType} Event`,
//       date: formData.date || 'TBD',
//       time: formData.time || 'TBD',
//       location: formData.location,
//       distance: 'Custom location',
//       spotsLeft: formData.additionalPeople,
//       totalSpots: formData.totalSpots,
//       participants: [],
//       price: 150,
//       category: getCategoryFromEventType(formData.eventType),
//       description: formData.description || `Join us for ${formData.eventType.toLowerCase()}!`,
//       createdBy: userId,
//       girlsOnly: formData.isGirlsOnly,
//       creatorGroupSize: formData.creatorGroupSize,
//       creatorPaymentAmount: paymentAmount,
//       minParticipants: formData.creatorGroupSize + 1,
//       maxParticipants: formData.totalSpots,
//       creatorPaid: true,
//       eventFilled: false,
//       imageUrl: formData.imagePreview,
//       city: formData.city
//     };

//     const result = await db.createEvent(eventData);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to create event');
//     }

//     console.log('✅ Event created successfully:', result.event);
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   // 🔥 EXISTING: Complete event join
//   const completeEventJoin = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
//     const userIdToUse = userId || localStorage.getItem('pendingJoinUserId');
//     const userNameToUse = userName || localStorage.getItem('pendingJoinUserName');

//     if (!eventIdToUse || !userIdToUse || !userNameToUse) {
//       throw new Error('Missing user or event information');
//     }

//     const result = await db.joinEvent(eventIdToUse, userIdToUse, userNameToUse);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to join event');
//     }

//     console.log('✅ Successfully joined event:', eventIdToUse);
//   };

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text);
//     alert(`${label} copied to clipboard!`);
//   };

//   // Success screen
//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-16 h-16 text-green-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               {paymentType === 'event_creation' ? 'Event Created!' : 'Payment Confirmed!'}
//             </h2>
            
//             {paymentType === 'event_creation' ? (
//               <div className="space-y-3">
//                 <p className="text-gray-600">
//                   Your event has been submitted for review
//                 </p>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//                   <p className="text-sm text-blue-900 font-semibold mb-2">
//                     ⏳ What happens next?
//                   </p>
//                   <ul className="text-xs text-blue-700 space-y-2">
//                     <li>• Admin will review your event (usually within 24 hours)</li>
//                     <li>• You'll receive an email once approved</li>
//                     <li>• Your event will then be visible to everyone</li>
//                   </ul>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-4">
//                   Redirecting to events page...
//                 </p>
//               </div>
//             ) : (
//               <p className="text-gray-600">You've successfully joined the event.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       <div className="max-w-md mx-auto">
//         <Button 
//           onClick={() => onBack ? onBack() : onNavigate('events')} 
//           variant="ghost" 
//           className="mb-4"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </Button>

//         {/* Amount Card */}
//         <Card className="mb-6 border-2 border-purple-500 shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               ₹{paymentAmount}
//             </CardTitle>
//             <p className="text-gray-600 text-sm mt-2">
//               {paymentType === 'event_creation' 
//                 ? `Creating Event: ${eventDetails?.eventTitle || 'Your Event'}`
//                 : `Joining: ${eventDetails?.title || 'Event'}`
//               }
//             </p>
//           </CardHeader>
//         </Card>

//         {/* Event Details Card (for joining events) */}
//         {paymentType === 'event_join' && eventDetails && (
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Event Details</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <h3 className="font-semibold text-lg mb-2">{eventDetails.title}</h3>
//               <p className="text-sm text-gray-600">{eventDetails.date} at {eventDetails.time}</p>
//               <p className="text-sm text-gray-600">{eventDetails.location}</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Payment Type Info */}
//         {paymentType === 'event_creation' && (
//           <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
//             <CardContent className="pt-6">
//               <div className="space-y-2 text-sm">
//                 <p className="font-semibold text-purple-900">
//                   💳 Payment Breakdown:
//                 </p>
//                 <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
//                   <p className="text-gray-700">
//                     • Your group: {eventDetails?.groupSize || 1} {eventDetails?.groupSize === 1 ? 'person' : 'people'} × ₹150
//                   </p>
//                   <p className="font-semibold text-purple-600">
//                     • Total: ₹{paymentAmount}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* CRITICAL: Payment Note */}
//         <Card className="mb-6 border-2 border-orange-500 bg-orange-50 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex items-start space-x-3">
//               <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-orange-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   ⚠️ CRITICAL: Add Payment Note
//                 </h3>
//                 <p className="text-sm text-orange-800 mb-3">
//                   When making payment via UPI, you MUST write this in the payment note/remark:
//                 </p>
//                 <div className="bg-white p-4 rounded-lg border-2 border-orange-300 flex items-center justify-between">
//                   <code className="font-bold text-base text-gray-900">{paymentNote}</code>
//                   <Button
//                     onClick={() => copyToClipboard(paymentNote, 'Payment note')}
//                     size="sm"
//                     variant="outline"
//                     className="ml-2"
//                   >
//                     <Copy className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-orange-700 mt-2">
//                   This helps us verify your payment quickly!
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* QR Code Section */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Scan QR Code to Pay
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
//                 <img 
//                   src="/qr-code-fampay.jpg" 
//                   alt="FamPay QR Code" 
//                   className="w-64 h-64 object-contain"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                     console.error('QR code image not found');
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 text-center">
//                 Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* UPI ID Section */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Or Enter UPI ID Manually
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600 mb-1">FamPay UPI ID:</p>
//                 <code className="font-bold text-lg">{FAMPAY_UPI_ID}</code>
//               </div>
//               <Button
//                 onClick={() => copyToClipboard(FAMPAY_UPI_ID, 'UPI ID')}
//                 size="sm"
//                 variant="outline"
//               >
//                 <Copy className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Instructions */}
//         <Card className="mb-6 bg-blue-50 border-blue-200">
//           <CardContent className="pt-6">
//             <div className="space-y-3 text-sm">
//               <p className="font-semibold text-blue-900 flex items-center">
//                 <Smartphone className="w-4 h-4 mr-2" />
//                 How to Pay:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 text-blue-800 text-xs">
//                 <li>Click "Pay ₹{paymentAmount} Now" button below</li>
//                 <li>Your UPI app will open automatically</li>
//                 <li>Add payment note: <strong>{paymentNote}</strong></li>
//                 <li>Complete payment in your UPI app</li>
//                 <li>Return here and click "I've Completed Payment"</li>
//               </ol>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Buttons */}
//         <div className="space-y-3">
//           {!paymentProcessing ? (
//             <Button
//               onClick={handlePayNow}
//               className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               💳 Pay ₹{paymentAmount} Now
//             </Button>
//           ) : (
//             <Button
//               onClick={handlePaymentConfirmation}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               ✓ I've Completed the Payment
//             </Button>
//           )}
          
//           <Button
//             onClick={() => onBack ? onBack() : onNavigate('events')}
//             variant="outline"
//             className="w-full"
//           >
//             Cancel Payment
//           </Button>
//         </div>

//         {/* Important Notes */}
//         <div className="bg-gray-100 rounded-lg p-4 mt-6 space-y-2 text-xs text-gray-600">
//           <p className="font-semibold text-gray-800">📝 Important Notes:</p>
//           <ul className="space-y-1 ml-4 list-disc">
//             <li>Payments are processed instantly</li>
//             <li>You'll receive confirmation via email</li>
//             <li>For issues, contact: <strong>findyourkismat@gmail.com</strong></li>
//             {paymentType === 'event_creation' && (
//               <li className="text-orange-600 font-semibold">
//                 Your event data is saved - safe to switch apps!
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }







































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, Copy, ArrowLeft, Shield, Smartphone } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface PaymentPageProps {
//   eventId: string | null;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
//   onBack?: () => void;
// }

// export function PaymentPage({ eventId, userId, onNavigate, onBack }: PaymentPageProps) {
//   const [paymentAmount, setPaymentAmount] = useState(150);
//   const [paymentType, setPaymentType] = useState<'event_join' | 'event_creation'>('event_join');
//   const [eventDetails, setEventDetails] = useState<any>(null);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [userName, setUserName] = useState('');

//   const FAMPAY_UPI_ID = '8369463469@fam';
//   const paymentNote = `kismat-${userName}`;

//   useEffect(() => {
//     loadPaymentDetails();
//   }, []);

//   const loadPaymentDetails = () => {
//     const creatorPayment = localStorage.getItem('pendingCreatorPayment');
//     if (creatorPayment) {
//       const payment = JSON.parse(creatorPayment);
//       setPaymentAmount(payment.amount);
//       setPaymentType('event_creation');
//       setEventDetails(payment);
//       setUserName(payment.username || 'user');
//       return;
//     }

//     const joinPayment = localStorage.getItem('pendingJoinEventId');
//     if (joinPayment) {
//       const username = localStorage.getItem('pendingJoinUserName') || 'user';
//       setUserName(username);
//       loadEventDetails();
//       return;
//     }

//     console.error('No pending payment found');
//   };

//   const loadEventDetails = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    
//     if (!eventIdToUse) {
//       alert('Missing event information');
//       onNavigate('events');
//       return;
//     }

//     const result = await db.getEventById(eventIdToUse);
//     if (result.event) {
//       setEventDetails(result.event);
//       setPaymentAmount(result.event.price || 150);
//     } else {
//       alert('Failed to load event details');
//       onNavigate('events');
//     }
//   };

//   const handlePayNow = () => {
//     const upiUrl = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=Kismat&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(paymentNote)}`;
//     window.location.href = upiUrl;
    
//     setTimeout(() => {
//       setPaymentProcessing(true);
//     }, 1000);
//   };

//   const handlePaymentConfirmation = async () => {
//     try {
//       setPaymentProcessing(true);

//       if (paymentType === 'event_creation') {
//         await completeEventCreation();
//       } else {
//         await completeEventJoin();
//       }

//       if (analytics) {
//         await analytics.trackPayment(paymentAmount);
//       }

//       setPaymentComplete(true);

//       setTimeout(() => {
//         localStorage.removeItem('pendingCreatorPayment');
//         localStorage.removeItem('pendingEventCreation');
//         localStorage.removeItem('pendingJoinEventId');
//         localStorage.removeItem('pendingJoinUserId');
//         localStorage.removeItem('pendingJoinUserName');
        
//         onNavigate('events');
//       }, 2000);

//     } catch (error) {
//       console.error('Payment confirmation error:', error);
//       alert('Payment confirmation failed. Please contact support.');
//       setPaymentProcessing(false);
//     }
//   };

//   const completeEventCreation = async () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (!savedFormData) {
//       throw new Error('No saved event data found');
//     }

//     const formData = JSON.parse(savedFormData);

//     const eventData = {
//       title: formData.title || `${formData.eventType} Event`,
//       date: formData.date || 'TBD',
//       time: formData.time || 'TBD',
//       location: formData.location,
//       distance: 'Custom location',
//       spotsLeft: formData.additionalPeople,
//       totalSpots: formData.totalSpots,
//       participants: [],
//       price: 150,
//       category: getCategoryFromEventType(formData.eventType),
//       description: formData.description || `Join us for ${formData.eventType.toLowerCase()}!`,
//       createdBy: userId,
//       girlsOnly: formData.isGirlsOnly,
//       creatorGroupSize: formData.creatorGroupSize,
//       creatorPaymentAmount: paymentAmount,
//       minParticipants: formData.creatorGroupSize + 1,
//       maxParticipants: formData.totalSpots,
//       creatorPaid: true,
//       eventFilled: false,
//       imageUrl: formData.imagePreview,
//       city: formData.city
//     };

//     const result = await db.createEvent(eventData);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to create event');
//     }

//     console.log('✅ Event created successfully:', result.event);
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   const completeEventJoin = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
//     const userIdToUse = userId || localStorage.getItem('pendingJoinUserId');
//     const userNameToUse = userName || localStorage.getItem('pendingJoinUserName');

//     if (!eventIdToUse || !userIdToUse || !userNameToUse) {
//       throw new Error('Missing user or event information');
//     }

//     const result = await db.joinEvent(eventIdToUse, userIdToUse, userNameToUse);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to join event');
//     }

//     console.log('✅ Successfully joined event:', eventIdToUse);
//   };

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text);
//     alert(`${label} copied to clipboard!`);
//   };

//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-16 h-16 text-green-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               {paymentType === 'event_creation' ? 'Event Created!' : 'Payment Confirmed!'}
//             </h2>
            
//             {paymentType === 'event_creation' ? (
//               <div className="space-y-3">
//                 <p className="text-gray-600">Your event has been submitted for review</p>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//                   <p className="text-sm text-blue-900 font-semibold mb-2">⏳ What happens next?</p>
//                   <ul className="text-xs text-blue-700 space-y-2">
//                     <li>• Admin will review your event (usually within 24 hours)</li>
//                     <li>• You'll receive an email once approved</li>
//                     <li>• Your event will then be visible to everyone</li>
//                   </ul>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-4">Redirecting to events page...</p>
//               </div>
//             ) : (
//               <p className="text-gray-600">You've successfully joined the event.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       <div className="max-w-md mx-auto">
//         <Button onClick={() => onBack ? onBack() : onNavigate('events')} variant="ghost" className="mb-4">
//           <ArrowLeft className="w-5 h-5 mr-2" />Back
//         </Button>

//         <Card className="mb-6 border-2 border-purple-500 shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               ₹{paymentAmount}
//             </CardTitle>
//             <p className="text-gray-600 text-sm mt-2">
//               {paymentType === 'event_creation' 
//                 ? `Creating Event: ${eventDetails?.eventTitle || 'Your Event'}`
//                 : `Joining: ${eventDetails?.title || 'Event'}`}
//             </p>
//           </CardHeader>
//         </Card>

//         {paymentType === 'event_join' && eventDetails && (
//           <Card className="mb-6">
//             <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
//             <CardContent>
//               <h3 className="font-semibold text-lg mb-2">{eventDetails.title}</h3>
//               <p className="text-sm text-gray-600">{eventDetails.date} at {eventDetails.time}</p>
//               <p className="text-sm text-gray-600">{eventDetails.location}</p>
//             </CardContent>
//           </Card>
//         )}

//         {paymentType === 'event_creation' && (
//           <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
//             <CardContent className="pt-6">
//               <div className="space-y-2 text-sm">
//                 <p className="font-semibold text-purple-900">💳 Payment Breakdown:</p>
//                 <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
//                   <p className="text-gray-700">• Your group: {eventDetails?.groupSize || 1} {eventDetails?.groupSize === 1 ? 'person' : 'people'} × ₹150</p>
//                   <p className="font-semibold text-purple-600">• Total: ₹{paymentAmount}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <Card className="mb-6 border-2 border-orange-500 bg-orange-50 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex items-start space-x-3">
//               <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-orange-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   ⚠️ CRITICAL: Add Payment Note
//                 </h3>
//                 <p className="text-sm text-orange-800 mb-3">When making payment via UPI, you MUST write this in the payment note/remark:</p>
//                 <div className="bg-white p-4 rounded-lg border-2 border-orange-300 flex items-center justify-between">
//                   <code className="font-bold text-base text-gray-900">{paymentNote}</code>
//                   <Button onClick={() => copyToClipboard(paymentNote, 'Payment note')} size="sm" variant="outline" className="ml-2">
//                     <Copy className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-orange-700 mt-2">This helps us verify your payment quickly!</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Scan QR Code to Pay</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
//                 <img src="/qr-code-fampay.jpg" alt="FamPay QR Code" className="w-64 h-64 object-contain"
//                   onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//               </div>
//               <p className="text-xs text-gray-500 text-center">Scan with any UPI app (GPay, PhonePe, Paytm, etc.)</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Or Enter UPI ID Manually</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600 mb-1">FamPay UPI ID:</p>
//                 <code className="font-bold text-lg">{FAMPAY_UPI_ID}</code>
//               </div>
//               <Button onClick={() => copyToClipboard(FAMPAY_UPI_ID, 'UPI ID')} size="sm" variant="outline">
//                 <Copy className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="mb-6 bg-blue-50 border-blue-200">
//           <CardContent className="pt-6">
//             <div className="space-y-3 text-sm">
//               <p className="font-semibold text-blue-900 flex items-center">
//                 <Smartphone className="w-4 h-4 mr-2" />How to Pay:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 text-blue-800 text-xs">
//                 <li>Click "Pay ₹{paymentAmount} Now" button below</li>
//                 <li>Your UPI app will open automatically</li>
//                 <li>Add payment note: <strong>{paymentNote}</strong></li>
//                 <li>Complete payment in your UPI app</li>
//                 <li>Return here and click "I've Completed Payment"</li>
//               </ol>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="space-y-3">
//           {!paymentProcessing ? (
//             <Button onClick={handlePayNow} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               💳 Pay ₹{paymentAmount} Now
//             </Button>
//           ) : (
//             <Button onClick={handlePaymentConfirmation} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               ✓ I've Completed the Payment
//             </Button>
//           )}
          
//           <Button onClick={() => onBack ? onBack() : onNavigate('events')} variant="outline" className="w-full">
//             Cancel Payment
//           </Button>
//         </div>

//         <div className="bg-gray-100 rounded-lg p-4 mt-6 space-y-2 text-xs text-gray-600">
//           <p className="font-semibold text-gray-800">📝 Important Notes:</p>
//           <ul className="space-y-1 ml-4 list-disc">
//             <li>Payments are processed instantly</li>
//             <li>You'll receive confirmation via email</li>
//             <li>For issues, contact: <strong>findyourkismat@gmail.com</strong></li>
//             {paymentType === 'event_creation' && (
//               <li className="text-orange-600 font-semibold">Your event data is saved - safe to switch apps!</li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }














































// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { CheckCircle, Copy, ArrowLeft, Shield, Smartphone } from 'lucide-react';
// import { db, analytics } from '../utils/supabase';

// interface PaymentPageProps {
//   eventId: string | null;
//   userId: string | null;
//   onNavigate: (screen: string) => void;
//   onBack?: () => void;
// }

// export function PaymentPage({ eventId, userId, onNavigate, onBack }: PaymentPageProps) {
//   const [paymentAmount, setPaymentAmount] = useState(150);
//   const [paymentType, setPaymentType] = useState<'event_join' | 'event_creation'>('event_join');
//   const [eventDetails, setEventDetails] = useState<any>(null);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [userName, setUserName] = useState('');

//   const FAMPAY_UPI_ID = '8369463469@fam';
//   const paymentNote = `kismat-${userName}`;

//   useEffect(() => {
//     loadPaymentDetails();
//   }, []);

//   const loadPaymentDetails = () => {
//     // Check if this is an event creation payment
//     const creatorPayment = localStorage.getItem('pendingCreatorPayment');
//     if (creatorPayment) {
//       const payment = JSON.parse(creatorPayment);
//       setPaymentAmount(payment.amount);
//       setPaymentType('event_creation');
//       setEventDetails(payment);
//       setUserName(payment.username || 'user');
//       return;
//     }

//     // Check if this is an event join payment
//     const joinPayment = localStorage.getItem('pendingJoinEventId');
//     if (joinPayment) {
//       const username = localStorage.getItem('pendingJoinUserName') || 'user';
//       setUserName(username);
//       loadEventDetails();
//       return;
//     }

//     // No pending payment found
//     console.error('No pending payment found');
//   };

//   const loadEventDetails = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    
//     if (!eventIdToUse) {
//       alert('Missing event information');
//       onNavigate('events');
//       return;
//     }

//     const result = await db.getEventById(eventIdToUse);
//     if (result.event) {
//       setEventDetails(result.event);
//       setPaymentAmount(result.event.price || 150);
//     } else {
//       alert('Failed to load event details');
//       onNavigate('events');
//     }
//   };

//   const handlePayNow = () => {
//     // Open UPI app with pre-filled details
//     const upiUrl = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=Kismat&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(paymentNote)}`;
    
//     // Try to open UPI app
//     window.location.href = upiUrl;
    
//     // Show confirmation button after attempting to open UPI
//     setTimeout(() => {
//       setPaymentProcessing(true);
//     }, 1000);
//   };

//   const handlePaymentConfirmation = async () => {
//     try {
//       setPaymentProcessing(true);

//       if (paymentType === 'event_creation') {
//         // HANDLE EVENT CREATION
//         await completeEventCreation();
//       } else {
//         // HANDLE EVENT JOIN
//         await completeEventJoin();
//       }

//       // Track successful payment
//       if (analytics) {
//         await analytics.trackPayment(paymentAmount);
//       }

//       // Show success message
//       setPaymentComplete(true);

//       // Clear all payment-related localStorage
//       setTimeout(() => {
//         localStorage.removeItem('pendingCreatorPayment');
//         localStorage.removeItem('pendingEventCreation');
//         localStorage.removeItem('pendingJoinEventId');
//         localStorage.removeItem('pendingJoinUserId');
//         localStorage.removeItem('pendingJoinUserName');
        
//         // Redirect
//         onNavigate('events');
//       }, 2000);

//     } catch (error) {
//       console.error('Payment confirmation error:', error);
//       alert('Payment confirmation failed. Please contact support.');
//       setPaymentProcessing(false);
//     }
//   };

//   // 🔥 FIX: Convert date from YYYY-MM-DD to "DD Mon YYYY"
//   const convertDateFormat = (dateString: string): string => {
//     const date = new Date(dateString);
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const day = date.getDate();
//     const month = months[date.getMonth()];
//     const year = date.getFullYear();
//     return `${day} ${month} ${year}`;
//   };

//   // 🔥 FIX: Convert time from 24h to 12h format
//   const convertTimeFormat = (timeString: string): string => {
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   // Complete event creation from saved form data
//   const completeEventCreation = async () => {
//     const savedFormData = localStorage.getItem('pendingEventCreation');
//     if (!savedFormData) {
//       throw new Error('No saved event data found');
//     }

//     const formData = JSON.parse(savedFormData);

//     const eventData = {
//       title: formData.title || `${formData.eventType} Event`,
//       date: convertDateFormat(formData.date), // 🔥 CONVERTED!
//       time: convertTimeFormat(formData.time), // 🔥 CONVERTED!
//       location: formData.location,
//       distance: 'Custom location',
//       spotsLeft: formData.additionalPeople,
//       totalSpots: formData.totalSpots,
//       participants: [],
//       price: 150,
//       category: getCategoryFromEventType(formData.eventType),
//       description: formData.description || `Join us for ${formData.eventType.toLowerCase()}!`,
//       createdBy: userId,
//       girlsOnly: formData.isGirlsOnly,
//       creatorGroupSize: formData.creatorGroupSize,
//       creatorPaymentAmount: paymentAmount,
//       minParticipants: formData.creatorGroupSize + 1,
//       maxParticipants: formData.totalSpots,
//       creatorPaid: true,
//       eventFilled: false,
//       imageUrl: formData.imagePreview,
//       city: formData.city
//     };

//     console.log('🔥 Creating event with CONVERTED date:', eventData.date, 'time:', eventData.time);

//     const result = await db.createEvent(eventData);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to create event');
//     }

//     console.log('✅ Event created successfully:', result.event);
//   };

//   const getCategoryFromEventType = (eventType: string): string => {
//     const categoryMap: Record<string, string> = {
//       'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
//       'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
//       'sports': 'sports', 'other': 'activities'
//     };
//     return categoryMap[eventType] || 'activities';
//   };

//   // Complete event join
//   const completeEventJoin = async () => {
//     const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
//     const userIdToUse = userId || localStorage.getItem('pendingJoinUserId');
//     const userNameToUse = userName || localStorage.getItem('pendingJoinUserName');

//     if (!eventIdToUse || !userIdToUse || !userNameToUse) {
//       throw new Error('Missing user or event information');
//     }

//     const result = await db.joinEvent(eventIdToUse, userIdToUse, userNameToUse);
    
//     if (!result.success) {
//       throw new Error(result.error || 'Failed to join event');
//     }

//     console.log('✅ Successfully joined event:', eventIdToUse);
//   };

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text);
//     alert(`${label} copied to clipboard!`);
//   };

//   // Success screen
//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center px-6">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-16 h-16 text-green-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               {paymentType === 'event_creation' ? 'Event Created!' : 'Payment Confirmed!'}
//             </h2>
            
//             {paymentType === 'event_creation' ? (
//               <div className="space-y-3">
//                 <p className="text-gray-600">
//                   Your event has been submitted for review
//                 </p>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//                   <p className="text-sm text-blue-900 font-semibold mb-2">
//                     ⏳ What happens next?
//                   </p>
//                   <ul className="text-xs text-blue-700 space-y-2">
//                     <li>• Admin will review your event (usually within 24 hours)</li>
//                     <li>• You'll receive an email once approved</li>
//                     <li>• Your event will then be visible to everyone</li>
//                   </ul>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-4">
//                   Redirecting to events page...
//                 </p>
//               </div>
//             ) : (
//               <p className="text-gray-600">You've successfully joined the event.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       <div className="max-w-md mx-auto">
//         <Button 
//           onClick={() => onBack ? onBack() : onNavigate('events')} 
//           variant="ghost" 
//           className="mb-4"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </Button>

//         {/* Amount Card */}
//         <Card className="mb-6 border-2 border-purple-500 shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               ₹{paymentAmount}
//             </CardTitle>
//             <p className="text-gray-600 text-sm mt-2">
//               {paymentType === 'event_creation' 
//                 ? `Creating Event: ${eventDetails?.eventTitle || 'Your Event'}`
//                 : `Joining: ${eventDetails?.title || 'Event'}`
//               }
//             </p>
//           </CardHeader>
//         </Card>

//         {/* Event Details Card (for joining events) */}
//         {paymentType === 'event_join' && eventDetails && (
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Event Details</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <h3 className="font-semibold text-lg mb-2">{eventDetails.title}</h3>
//               <p className="text-sm text-gray-600">{eventDetails.date} at {eventDetails.time}</p>
//               <p className="text-sm text-gray-600">{eventDetails.location}</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Payment Type Info */}
//         {paymentType === 'event_creation' && (
//           <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
//             <CardContent className="pt-6">
//               <div className="space-y-2 text-sm">
//                 <p className="font-semibold text-purple-900">
//                   💳 Payment Breakdown:
//                 </p>
//                 <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
//                   <p className="text-gray-700">
//                     • Your group: {eventDetails?.groupSize || 1} {eventDetails?.groupSize === 1 ? 'person' : 'people'} × ₹150
//                   </p>
//                   <p className="font-semibold text-purple-600">
//                     • Total: ₹{paymentAmount}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* CRITICAL: Payment Note */}
//         <Card className="mb-6 border-2 border-orange-500 bg-orange-50 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex items-start space-x-3">
//               <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-orange-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                   ⚠️ CRITICAL: Add Payment Note
//                 </h3>
//                 <p className="text-sm text-orange-800 mb-3">
//                   When making payment via UPI, you MUST write this in the payment note/remark:
//                 </p>
//                 <div className="bg-white p-4 rounded-lg border-2 border-orange-300 flex items-center justify-between">
//                   <code className="font-bold text-base text-gray-900">{paymentNote}</code>
//                   <Button
//                     onClick={() => copyToClipboard(paymentNote, 'Payment note')}
//                     size="sm"
//                     variant="outline"
//                     className="ml-2"
//                   >
//                     <Copy className="w-4 h-4" />
//                   </Button>
//                 </div>
//                 <p className="text-xs text-orange-700 mt-2">
//                   This helps us verify your payment quickly!
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* QR Code Section */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Scan QR Code to Pay
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col items-center space-y-4">
//               <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
//                 <img 
//                   src="/qr-code-fampay.jpg" 
//                   alt="FamPay QR Code" 
//                   className="w-64 h-64 object-contain"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                     console.error('QR code image not found');
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 text-center">
//                 Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* UPI ID Section */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="text-center text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
//               Or Enter UPI ID Manually
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600 mb-1">FamPay UPI ID:</p>
//                 <code className="font-bold text-lg">{FAMPAY_UPI_ID}</code>
//               </div>
//               <Button
//                 onClick={() => copyToClipboard(FAMPAY_UPI_ID, 'UPI ID')}
//                 size="sm"
//                 variant="outline"
//               >
//                 <Copy className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Instructions */}
//         <Card className="mb-6 bg-blue-50 border-blue-200">
//           <CardContent className="pt-6">
//             <div className="space-y-3 text-sm">
//               <p className="font-semibold text-blue-900 flex items-center">
//                 <Smartphone className="w-4 h-4 mr-2" />
//                 How to Pay:
//               </p>
//               <ol className="list-decimal list-inside space-y-2 text-blue-800 text-xs">
//                 <li>Click "Pay ₹{paymentAmount} Now" button below</li>
//                 <li>Your UPI app will open automatically</li>
//                 <li>Add payment note: <strong>{paymentNote}</strong></li>
//                 <li>Complete payment in your UPI app</li>
//                 <li>Return here and click "I've Completed Payment"</li>
//               </ol>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Payment Buttons */}
//         <div className="space-y-3">
//           {!paymentProcessing ? (
//             <Button
//               onClick={handlePayNow}
//               className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               💳 Pay ₹{paymentAmount} Now
//             </Button>
//           ) : (
//             <Button
//               onClick={handlePaymentConfirmation}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
//               style={{ fontFamily: 'Poppins, sans-serif' }}
//             >
//               ✓ I've Completed the Payment
//             </Button>
//           )}
          
//           <Button
//             onClick={() => onBack ? onBack() : onNavigate('events')}
//             variant="outline"
//             className="w-full"
//           >
//             Cancel Payment
//           </Button>
//         </div>

//         {/* Important Notes */}
//         <div className="bg-gray-100 rounded-lg p-4 mt-6 space-y-2 text-xs text-gray-600">
//           <p className="font-semibold text-gray-800">📝 Important Notes:</p>
//           <ul className="space-y-1 ml-4 list-disc">
//             <li>Payments are processed instantly</li>
//             <li>You'll receive confirmation via email</li>
//             <li>For issues, contact: <strong>findyourkismat@gmail.com</strong></li>
//             {paymentType === 'event_creation' && (
//               <li className="text-orange-600 font-semibold">
//                 Your event data is saved - safe to switch apps!
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }



















import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Copy, ArrowLeft, Shield, Smartphone } from 'lucide-react';
import { db, analytics } from '../utils/supabase';

interface PaymentPageProps {
  eventId: string | null;
  userId: string | null;
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function PaymentPage({ eventId, userId, onNavigate, onBack }: PaymentPageProps) {
  const [paymentAmount, setPaymentAmount] = useState(150);
  const [paymentType, setPaymentType] = useState<'event_join' | 'event_creation'>('event_join');
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [userName, setUserName] = useState('');

  const FAMPAY_UPI_ID = '8369463469@fam';
  const paymentNote = `kismat-${userName}`;

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = () => {
    // Check if this is an event creation payment
    const creatorPayment = localStorage.getItem('pendingCreatorPayment');
    if (creatorPayment) {
      const payment = JSON.parse(creatorPayment);
      setPaymentAmount(payment.amount);
      setPaymentType('event_creation');
      setEventDetails(payment);
      setUserName(payment.username || 'user');
      return;
    }

    // Check if this is an event join payment
    const joinPayment = localStorage.getItem('pendingJoinEventId');
    if (joinPayment) {
      const username = localStorage.getItem('pendingJoinUserName') || 'user';
      setUserName(username);
      loadEventDetails();
      return;
    }

    // No pending payment found
    console.error('No pending payment found');
  };

  const loadEventDetails = async () => {
    const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    
    if (!eventIdToUse) {
      alert('Missing event information');
      onNavigate('events');
      return;
    }

    const result = await db.getEventById(eventIdToUse);
    if (result.event) {
      setEventDetails(result.event);
      setPaymentAmount(result.event.price || 150);
    } else {
      alert('Failed to load event details');
      onNavigate('events');
    }
  };

  const handlePayNow = () => {
    // Open UPI app with pre-filled details
    const upiUrl = `upi://pay?pa=${FAMPAY_UPI_ID}&pn=Kismat&am=${paymentAmount}&cu=INR&tn=${encodeURIComponent(paymentNote)}`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // Show confirmation button after attempting to open UPI
    setTimeout(() => {
      setPaymentProcessing(true);
    }, 1000);
  };

  const handlePaymentConfirmation = async () => {
    try {
      setPaymentProcessing(true);

      if (paymentType === 'event_creation') {
        // HANDLE EVENT CREATION
        await completeEventCreation();
      } else {
        // HANDLE EVENT JOIN
        await completeEventJoin();
      }

      // Track successful payment
      if (analytics) {
        await analytics.trackPayment(paymentAmount);
      }

      // Show success message
      setPaymentComplete(true);

      // Clear all payment-related localStorage
      setTimeout(() => {
        localStorage.removeItem('pendingCreatorPayment');
        localStorage.removeItem('pendingEventCreation');
        localStorage.removeItem('pendingJoinEventId');
        localStorage.removeItem('pendingJoinUserId');
        localStorage.removeItem('pendingJoinUserName');
        
        // Redirect
        onNavigate('events');
      }, 2000);

    } catch (error) {
      console.error('Payment confirmation error:', error);
      alert('Payment confirmation failed. Please contact support.');
      setPaymentProcessing(false);
    }
  };

  // 🔥 FIX: Convert date from YYYY-MM-DD to "DD Mon YYYY"
  const convertDateFormat = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // 🔥 FIX: Convert time from 24h to 12h format
  const convertTimeFormat = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Complete event creation from saved form data
  const completeEventCreation = async () => {
    const savedFormData = localStorage.getItem('pendingEventCreation');
    if (!savedFormData) {
      throw new Error('No saved event data found');
    }

    const formData = JSON.parse(savedFormData);

    const eventData = {
      title: formData.title || `${formData.eventType} Event`,
      date: convertDateFormat(formData.date), // 🔥 CONVERTED!
      time: convertTimeFormat(formData.time), // 🔥 CONVERTED!
      location: formData.location,
      distance: 'Custom location',
      spotsLeft: formData.additionalPeople,
      totalSpots: formData.totalSpots,
      participants: [],
      price: 150,
      category: getCategoryFromEventType(formData.eventType),
      description: formData.description || `Join us for ${formData.eventType.toLowerCase()}!`,
      createdBy: userId,
      creatorName: formData.username, // 🔥 ADD THIS
      girlsOnly: formData.isGirlsOnly,
      creatorGroupSize: formData.creatorGroupSize,
      creatorPaymentAmount: paymentAmount,
      minParticipants: formData.creatorGroupSize + 1,
      maxParticipants: formData.totalSpots,
      creatorPaid: true,
      eventFilled: false,
      imageUrl: formData.imagePreview,
      city: formData.city
    };

    console.log('🔥 Creating event with CONVERTED date:', eventData.date, 'time:', eventData.time);

    const result = await db.createEvent(eventData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create event');
    }

    console.log('✅ Event created successfully:', result.event);
  };

  const getCategoryFromEventType = (eventType: string): string => {
    const categoryMap: Record<string, string> = {
      'dinner': 'food', 'drinks': 'food', 'coffee': 'food',
      'bowling': 'activities', 'movie': 'activities', 'cultural': 'activities',
      'sports': 'sports', 'other': 'activities'
    };
    return categoryMap[eventType] || 'activities';
  };

  // Complete event join
  const completeEventJoin = async () => {
    const eventIdToUse = eventId || localStorage.getItem('pendingJoinEventId');
    const userIdToUse = userId || localStorage.getItem('pendingJoinUserId');
    const userNameToUse = userName || localStorage.getItem('pendingJoinUserName');

    if (!eventIdToUse || !userIdToUse || !userNameToUse) {
      throw new Error('Missing user or event information');
    }

    const result = await db.joinEvent(eventIdToUse, userIdToUse, userNameToUse);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to join event');
    }

    console.log('✅ Successfully joined event:', eventIdToUse);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  // Success screen
  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {paymentType === 'event_creation' ? 'Event Created!' : 'Payment Confirmed!'}
            </h2>
            
            {paymentType === 'event_creation' ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  Your event has been submitted for review
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-900 font-semibold mb-2">
                    ⏳ What happens next?
                  </p>
                  <ul className="text-xs text-blue-700 space-y-2">
                    <li>• Admin will review your event (usually within 24 hours)</li>
                    <li>• You'll receive an email once approved</li>
                    <li>• Your event will then be visible to everyone</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Redirecting to events page...
                </p>
              </div>
            ) : (
              <p className="text-gray-600">You've successfully joined the event.</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-md mx-auto">
        <Button 
          onClick={() => onBack ? onBack() : onNavigate('events')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {/* Amount Card */}
        <Card className="mb-6 border-2 border-purple-500 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              ₹{paymentAmount}
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              {paymentType === 'event_creation' 
                ? `Creating Event: ${eventDetails?.eventTitle || 'Your Event'}`
                : `Joining: ${eventDetails?.title || 'Event'}`
              }
            </p>
          </CardHeader>
        </Card>

        {/* Event Details Card (for joining events) */}
        {paymentType === 'event_join' && eventDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">{eventDetails.title}</h3>
              <p className="text-sm text-gray-600">{eventDetails.date} at {eventDetails.time}</p>
              <p className="text-sm text-gray-600">{eventDetails.location}</p>
            </CardContent>
          </Card>
        )}

        {/* Payment Type Info */}
        {paymentType === 'event_creation' && (
          <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-purple-900">
                  💳 Payment Breakdown:
                </p>
                <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
                  <p className="text-gray-700">
                    • Your group: {eventDetails?.groupSize || 1} {eventDetails?.groupSize === 1 ? 'person' : 'people'} × ₹150
                  </p>
                  <p className="font-semibold text-purple-600">
                    • Total: ₹{paymentAmount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CRITICAL: Payment Note */}
        <Card className="mb-6 border-2 border-orange-500 bg-orange-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ⚠️ CRITICAL: Add Payment Note
                </h3>
                <p className="text-sm text-orange-800 mb-3">
                  When making payment via UPI, you MUST write this in the payment note/remark:
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-orange-300 flex items-center justify-between">
                  <code className="font-bold text-base text-gray-900">{paymentNote}</code>
                  <Button
                    onClick={() => copyToClipboard(paymentNote, 'Payment note')}
                    size="sm"
                    variant="outline"
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  This helps us verify your payment quickly!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Scan QR Code to Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
                <img 
                  src="/qr-code-fampay.jpg" 
                  alt="FamPay QR Code" 
                  className="w-64 h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    console.error('QR code image not found');
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* UPI ID Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Or Enter UPI ID Manually
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">FamPay UPI ID:</p>
                <code className="font-bold text-lg">{FAMPAY_UPI_ID}</code>
              </div>
              <Button
                onClick={() => copyToClipboard(FAMPAY_UPI_ID, 'UPI ID')}
                size="sm"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-blue-900 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                How to Pay:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 text-xs">
                <li>Click "Pay ₹{paymentAmount} Now" button below</li>
                <li>Your UPI app will open automatically</li>
                <li>Add payment note: <strong>{paymentNote}</strong></li>
                <li>Complete payment in your UPI app</li>
                <li>Return here and click "I've Completed Payment"</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Payment Buttons */}
        <div className="space-y-3">
          {!paymentProcessing ? (
            <Button
              onClick={handlePayNow}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              💳 Pay ₹{paymentAmount} Now
            </Button>
          ) : (
            <Button
              onClick={handlePaymentConfirmation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              ✓ I've Completed the Payment
            </Button>
          )}
          
          <Button
            onClick={() => onBack ? onBack() : onNavigate('events')}
            variant="outline"
            className="w-full"
          >
            Cancel Payment
          </Button>
        </div>

        {/* Important Notes */}
        <div className="bg-gray-100 rounded-lg p-4 mt-6 space-y-2 text-xs text-gray-600">
          <p className="font-semibold text-gray-800">📝 Important Notes:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Payments are processed instantly</li>
            <li>You'll receive confirmation via email</li>
            <li>For issues, contact: <strong>findyourkismat@gmail.com</strong></li>
            {paymentType === 'event_creation' && (
              <li className="text-orange-600 font-semibold">
                Your event data is saved - safe to switch apps!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}