// import React, { useState } from 'react';
// import { Button } from './ui/button';
// import { RadioGroup, RadioGroupItem } from './ui/radio-group';
// import { Label } from './ui/label';
// import { Input } from './ui/input';
// import { Textarea } from './ui/textarea';
// import { Checkbox } from './ui/checkbox';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { UserProfile } from '../App';
// import starIcon from 'figma:asset/7b020bf7102ddbbffe9451ec48111cb6db1aa563.png';

// interface PersonalityQuestionsProps {
//   profile: UserProfile;
//   onUpdateProfile: (updates: Partial<UserProfile>) => void;
//   onNavigate: (screen: string) => void;
// }

// const questions = [
//   {
//     id: 'planning',
//     question: 'When making plans with friends, you typically…',
//     type: 'radio',
//     options: [
//       { value: 'organize', label: 'Take charge and organize everything' },
//       { value: 'suggest', label: 'Offer suggestions but let others decide' },
//       { value: 'follow', label: 'Go with whatever others choose' },
//       { value: 'delegate', label: 'Prefer when someone else handles the details' }
//     ]
//   },
//   {
//     id: 'socialSetting',
//     question: 'Your ideal social setting feels…',
//     type: 'radio',
//     options: [
//       { value: 'intimate', label: 'Intimate and cozy with close friends' },
//       { value: 'lively', label: 'Lively with a good mix of people' },
//       { value: 'sophisticated', label: 'Sophisticated and upscale' },
//       { value: 'casual', label: 'Casual and laid-back' }
//     ]
//   },
//   {
//     id: 'connecting',
//     question: 'When it comes to connecting with people, what feels most natural to you?',
//     type: 'radio',
//     options: [
//       { value: 'diverse', label: 'I love meeting people from all walks of life and perspectives' },
//       { value: 'curious', label: 'I\'m open and curious, especially about different backgrounds and experiences' },
//       { value: 'relatable', label: 'I usually stick with people I relate to most, but I\'m respectful of everyone' },
//       { value: 'familiar', label: 'I prefer familiar circles where I feel at ease' }
//     ]
//   },
//   {
//     id: 'newThings',
//     question: 'When trying something new, you…',
//     type: 'radio',
//     options: [
//       { value: 'research', label: 'Research thoroughly first' },
//       { value: 'jump', label: 'Jump in with enthusiasm' },
//       { value: 'friend', label: 'Need a trusted friend to join' },
//       { value: 'familiar', label: 'Prefer familiar variations of things you like' }
//     ]
//   },
//   {
//     id: 'evening',
//     question: 'Your ideal evening out involves…',
//     type: 'radio',
//     options: [
//       { value: 'luxury', label: 'A luxury experience worth savoring' },
//       { value: 'authentic', label: 'Something authentic and local' },
//       { value: 'trendy', label: 'The latest trendy spot' },
//       { value: 'comfortable', label: 'A comfortable, familiar place' }
//     ]
//   },
//   {
//     id: 'music',
//     question: 'What music do you love? (Select all that apply)',
//     type: 'checkbox',
//     options: [
//       { value: 'pop', label: 'Pop' },
//       { value: 'rock', label: 'Rock' },
//       { value: 'hip-hop', label: 'Hip-hop' },
//       { value: 'electronic', label: 'Electronic' },
//       { value: 'indie', label: 'Indie' },
//       { value: 'bollywood', label: 'Bollywood' },
//       { value: 'classical', label: 'Classical' }
//     ]
//   },
//   {
//     id: 'favoriteArtists',
//     question: 'Favorite artists:',
//     type: 'text',
//     placeholder: 'List your favorite artists...'
//   },
//   {
//     id: 'personality',
//     question: 'What is your personality type?',
//     type: 'radio',
//     options: [
//       { value: 'introvert', label: 'Introvert' },
//       { value: 'extrovert', label: 'Extrovert' },
//       { value: 'ambivert', label: 'Ambivert' },
//       { value: 'introverted-extrovert', label: 'Introverted Extrovert' },
//       { value: 'extroverted-introvert', label: 'Extroverted Introvert' }
//     ]
//   },
//   {
//     id: 'conflict',
//     question: 'Are you the type of friend who needs to talk things out immediately, or do you need space to process first?',
//     type: 'radio',
//     options: [
//       { value: 'talk-immediately', label: 'I need to talk it out right away' },
//       { value: 'need-space', label: 'I need space before I can discuss things' },
//       { value: 'depends', label: 'It depends on the situation' },
//       { value: 'avoid', label: 'I usually avoid confrontation' }
//     ]
//   },
//   {
//     id: 'humor',
//     question: 'What\'s your favorite type of humor?',
//     type: 'radio',
//     options: [
//       { value: 'dark', label: 'Dark comedy' },
//       { value: 'witty', label: 'Witty wordplay' },
//       { value: 'silly', label: 'Silly or dumb puns' },
//       { value: 'observational', label: 'Situational/observational humor' }
//     ]
//   },
//   {
//     id: 'habits',
//     question: 'Do you have any weird, random habits or collections?',
//     type: 'textarea',
//     placeholder: 'Tell us about your quirky habits or collections...'
//   },
//   {
//     id: 'rewatch',
//     question: 'What\'s a movie or TV show you can rewatch a million times?',
//     type: 'radio',
//     options: [
//       { value: 'movie', label: 'A favorite movie' },
//       { value: 'tv-show', label: 'A favorite TV show' },
//       { value: 'no-rewatch', label: 'None – I don\'t really rewatch movies or shows' },
//       { value: 'no-tv', label: 'None – I don\'t watch much TV or movies at all' }
//     ]
//   },
//   {
//     id: 'rewatchTitle',
//     question: 'What\'s the title?',
//     type: 'text',
//     placeholder: 'Enter the title...',
//     conditional: (answers: any) => answers.rewatch === 'movie' || answers.rewatch === 'tv-show'
//   },
//   {
//     id: 'drink',
//     question: 'What\'s your favorite drink?',
//     type: 'radio',
//     options: [
//       { value: 'chai', label: 'Chai' },
//       { value: 'coffee', label: 'Coffee' },
//       { value: 'matcha', label: 'Matcha' },
//       { value: 'none', label: 'None of these' },
//       { value: 'other', label: 'Other' }
//     ]
//   },
//   {
//     id: 'otherDrink',
//     question: 'What\'s your other favorite drink?',
//     type: 'text',
//     placeholder: 'Enter your favorite drink...',
//     conditional: (answers: any) => answers.drink === 'other'
//   },
//   {
//     id: 'foodie',
//     question: 'Would you describe yourself as a foodie?',
//     type: 'radio',
//     options: [
//       { value: 'absolutely', label: 'Absolutely – I love exploring new cuisines' },
//       { value: 'somewhat', label: 'Somewhat – I enjoy good food but I\'m not obsessed' },
//       { value: 'not-really', label: 'Not really – I stick to familiar meals' },
//       { value: 'definitely-not', label: 'Definitely not – food isn\'t a big deal to me' }
//     ]
//   },
//   {
//     id: 'money',
//     question: 'How would you describe yourself when it comes to money?',
//     type: 'radio',
//     options: [
//       { value: 'generous', label: 'Very generous – I don\'t mind spending on others' },
//       { value: 'balanced', label: 'Balanced – I know when to save and when to spend' },
//       { value: 'careful', label: 'Careful – I prefer to budget and avoid unnecessary spending' },
//       { value: 'stingy', label: 'Stingy – I really dislike spending money if I don\'t have to' }
//     ]
//   }
// ];

// export function PersonalityQuestions({ profile, onUpdateProfile, onNavigate }: PersonalityQuestionsProps) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState(profile.personalityAnswers);

//   const handleAnswer = (questionId: string, value: any) => {
//     setAnswers(prev => ({ ...prev, [questionId]: value }));
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     } else {
//       onUpdateProfile({ personalityAnswers: answers });
//       onNavigate('confirmation');
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const currentQ = questions[currentQuestion];
//   const shouldShowQuestion = !currentQ.conditional || currentQ.conditional(answers);

//   // Skip conditional questions that shouldn't be shown
//   React.useEffect(() => {
//     if (!shouldShowQuestion && currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   }, [shouldShowQuestion, currentQuestion]);

//   const canProceed = () => {
//     if (!shouldShowQuestion) return true;
//     const answer = answers[currentQ.id];
//     if (currentQ.type === 'checkbox') {
//       return answer && Array.isArray(answer) && answer.length > 0;
//     }
//     return answer !== undefined && answer !== '';
//   };

//   if (!shouldShowQuestion && currentQuestion < questions.length - 1) {
//     return null; // Will trigger useEffect to skip
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       {/* Floating Ball Decorations */}
//       <div className="fixed top-16 left-8 w-10 h-10 opacity-20">
//         <img src={starIcon} alt="" className="w-full h-full transform rotate-45" />
//       </div>
//       <div className="fixed top-1/3 right-4 w-6 h-6 opacity-15">
//         <img src={starIcon} alt="" className="w-full h-full transform -rotate-12" />
//       </div>
//       <div className="fixed bottom-32 left-12 w-8 h-8 opacity-10">
//         <img src={starIcon} alt="" className="w-full h-full transform rotate-90" />
//       </div>

//       <div className="max-w-md mx-auto">
//         {/* Progress */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
//             <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-black h-2 rounded-full transition-all duration-300"
//               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         <Card className="border-gray-200">
//           <CardHeader>
//             <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {currentQ.type === 'radio' && (
//               <RadioGroup
//                 value={answers[currentQ.id] || ''}
//                 onValueChange={(value) => handleAnswer(currentQ.id, value)}
//               >
//                 {currentQ.options?.map((option) => (
//                   <div key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
//                     <RadioGroupItem 
//                       value={option.value} 
//                       id={option.value} 
//                       className="mt-1 w-5 h-5 border-2 border-gray-400" 
//                     />
//                     <Label htmlFor={option.value} className="flex-1 leading-relaxed cursor-pointer text-sm">
//                       {option.label}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             )}

//             {currentQ.type === 'checkbox' && (
//               <div className="space-y-3">
//                 {currentQ.options?.map((option) => (
//                   <div key={option.value} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={option.value}
//                       checked={(answers[currentQ.id] || []).includes(option.value)}
//                       onCheckedChange={(checked) => {
//                         const current = answers[currentQ.id] || [];
//                         if (checked) {
//                           handleAnswer(currentQ.id, [...current, option.value]);
//                         } else {
//                           handleAnswer(currentQ.id, current.filter((v: string) => v !== option.value));
//                         }
//                       }}
//                     />
//                     <Label htmlFor={option.value} className="cursor-pointer">
//                       {option.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {currentQ.type === 'text' && (
//               <Input
//                 value={answers[currentQ.id] || ''}
//                 onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
//                 placeholder={currentQ.placeholder}
//                 className="border-gray-300"
//               />
//             )}

//             {currentQ.type === 'textarea' && (
//               <Textarea
//                 value={answers[currentQ.id] || ''}
//                 onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
//                 placeholder={currentQ.placeholder}
//                 className="border-gray-300 min-h-[100px]"
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Navigation */}
//         <div className="flex justify-between mt-8">
//           <Button
//             onClick={handlePrevious}
//             disabled={currentQuestion === 0}
//             variant="outline"
//             className="px-6"
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={handleNext}
//             disabled={!canProceed()}
//             className="bg-black text-white hover:bg-gray-800 px-6"
//           >
//             {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }





















































// import React, { useState } from 'react';
// import { Button } from './ui/button';
// import { RadioGroup, RadioGroupItem } from './ui/radio-group';
// import { Label } from './ui/label';
// import { Input } from './ui/input';
// import { Textarea } from './ui/textarea';
// import { Checkbox } from './ui/checkbox';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { UserProfile } from '../App';
// import starIcon from 'figma:asset/7b020bf7102ddbbffe9451ec48111cb6db1aa563.png';

// interface PersonalityQuestionsProps {
//   profile: UserProfile;
//   onUpdateProfile: (updates: Partial<UserProfile>) => void;
//   onNavigate: (screen: string) => void;
//   onSaveProfile: () => Promise<void>;
// }

// const questions = [
//   {
//     id: 'planning',
//     question: 'When making plans with friends, you typically…',
//     type: 'radio',
//     options: [
//       { value: 'organize', label: 'Take charge and organize everything' },
//       { value: 'suggest', label: 'Offer suggestions but let others decide' },
//       { value: 'follow', label: 'Go with whatever others choose' },
//       { value: 'delegate', label: 'Prefer when someone else handles the details' }
//     ]
//   },
//   {
//     id: 'socialSetting',
//     question: 'Your ideal social setting feels…',
//     type: 'radio',
//     options: [
//       { value: 'intimate', label: 'Intimate and cozy with close friends' },
//       { value: 'lively', label: 'Lively with a good mix of people' },
//       { value: 'sophisticated', label: 'Sophisticated and upscale' },
//       { value: 'casual', label: 'Casual and laid-back' }
//     ]
//   },
//   {
//     id: 'connecting',
//     question: 'When it comes to connecting with people, what feels most natural to you?',
//     type: 'radio',
//     options: [
//       { value: 'diverse', label: 'I love meeting people from all walks of life and perspectives' },
//       { value: 'curious', label: 'I\'m open and curious, especially about different backgrounds and experiences' },
//       { value: 'relatable', label: 'I usually stick with people I relate to most, but I\'m respectful of everyone' },
//       { value: 'familiar', label: 'I prefer familiar circles where I feel at ease' }
//     ]
//   },
//   {
//     id: 'newThings',
//     question: 'When trying something new, you…',
//     type: 'radio',
//     options: [
//       { value: 'research', label: 'Research thoroughly first' },
//       { value: 'jump', label: 'Jump in with enthusiasm' },
//       { value: 'friend', label: 'Need a trusted friend to join' },
//       { value: 'familiar', label: 'Prefer familiar variations of things you like' }
//     ]
//   },
//   {
//     id: 'evening',
//     question: 'Your ideal evening out involves…',
//     type: 'radio',
//     options: [
//       { value: 'luxury', label: 'A luxury experience worth savoring' },
//       { value: 'authentic', label: 'Something authentic and local' },
//       { value: 'trendy', label: 'The latest trendy spot' },
//       { value: 'comfortable', label: 'A comfortable, familiar place' }
//     ]
//   },
//   {
//     id: 'music',
//     question: 'What music do you love? (Select all that apply)',
//     type: 'checkbox',
//     options: [
//       { value: 'pop', label: 'Pop' },
//       { value: 'rock', label: 'Rock' },
//       { value: 'hip-hop', label: 'Hip-hop' },
//       { value: 'electronic', label: 'Electronic' },
//       { value: 'indie', label: 'Indie' },
//       { value: 'bollywood', label: 'Bollywood' },
//       { value: 'classical', label: 'Classical' }
//     ]
//   },
//   {
//     id: 'favoriteArtists',
//     question: 'Favorite artists:',
//     type: 'text',
//     placeholder: 'List your favorite artists...'
//   },
//   {
//     id: 'personality',
//     question: 'What is your personality type?',
//     type: 'radio',
//     options: [
//       { value: 'introvert', label: 'Introvert' },
//       { value: 'extrovert', label: 'Extrovert' },
//       { value: 'ambivert', label: 'Ambivert' },
//       { value: 'introverted-extrovert', label: 'Introverted Extrovert' },
//       { value: 'extroverted-introvert', label: 'Extroverted Introvert' }
//     ]
//   },
//   {
//     id: 'conflict',
//     question: 'Are you the type of friend who needs to talk things out immediately, or do you need space to process first?',
//     type: 'radio',
//     options: [
//       { value: 'talk-immediately', label: 'I need to talk it out right away' },
//       { value: 'need-space', label: 'I need space before I can discuss things' },
//       { value: 'depends', label: 'It depends on the situation' },
//       { value: 'avoid', label: 'I usually avoid confrontation' }
//     ]
//   },
//   {
//     id: 'humor',
//     question: 'What\'s your favorite type of humor?',
//     type: 'radio',
//     options: [
//       { value: 'dark', label: 'Dark comedy' },
//       { value: 'witty', label: 'Witty wordplay' },
//       { value: 'silly', label: 'Silly or dumb puns' },
//       { value: 'observational', label: 'Situational/observational humor' }
//     ]
//   },
//   {
//     id: 'habits',
//     question: 'Do you have any weird, random habits or collections?',
//     type: 'textarea',
//     placeholder: 'Tell us about your quirky habits or collections...'
//   },
//   {
//     id: 'rewatch',
//     question: 'What\'s a movie or TV show you can rewatch a million times?',
//     type: 'radio',
//     options: [
//       { value: 'movie', label: 'A favorite movie' },
//       { value: 'tv-show', label: 'A favorite TV show' },
//       { value: 'no-rewatch', label: 'None – I don\'t really rewatch movies or shows' },
//       { value: 'no-tv', label: 'None – I don\'t watch much TV or movies at all' }
//     ]
//   },
//   {
//     id: 'rewatchTitle',
//     question: 'What\'s the title?',
//     type: 'text',
//     placeholder: 'Enter the title...',
//     conditional: (answers: any) => answers.rewatch === 'movie' || answers.rewatch === 'tv-show'
//   },
//   {
//     id: 'drink',
//     question: 'What\'s your favorite drink?',
//     type: 'radio',
//     options: [
//       { value: 'chai', label: 'Chai' },
//       { value: 'coffee', label: 'Coffee' },
//       { value: 'matcha', label: 'Matcha' },
//       { value: 'none', label: 'None of these' },
//       { value: 'other', label: 'Other' }
//     ]
//   },
//   {
//     id: 'otherDrink',
//     question: 'What\'s your other favorite drink?',
//     type: 'text',
//     placeholder: 'Enter your favorite drink...',
//     conditional: (answers: any) => answers.drink === 'other'
//   },
//   {
//     id: 'foodie',
//     question: 'Would you describe yourself as a foodie?',
//     type: 'radio',
//     options: [
//       { value: 'absolutely', label: 'Absolutely – I love exploring new cuisines' },
//       { value: 'somewhat', label: 'Somewhat – I enjoy good food but I\'m not obsessed' },
//       { value: 'not-really', label: 'Not really – I stick to familiar meals' },
//       { value: 'definitely-not', label: 'Definitely not – food isn\'t a big deal to me' }
//     ]
//   },
//   {
//     id: 'money',
//     question: 'How would you describe yourself when it comes to money?',
//     type: 'radio',
//     options: [
//       { value: 'generous', label: 'Very generous – I don\'t mind spending on others' },
//       { value: 'balanced', label: 'Balanced – I know when to save and when to spend' },
//       { value: 'careful', label: 'Careful – I prefer to budget and avoid unnecessary spending' },
//       { value: 'stingy', label: 'Stingy – I really dislike spending money if I don\'t have to' }
//     ]
//   }
// ];

// export function PersonalityQuestions({ profile, onUpdateProfile, onNavigate, onSaveProfile }: PersonalityQuestionsProps) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState(profile.personalityAnswers);
//   const [isSaving, setIsSaving] = useState(false);

//   const handleAnswer = (questionId: string, value: any) => {
//     setAnswers(prev => ({ ...prev, [questionId]: value }));
//   };

//   const handleNext = async () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     } else {
//       // Last question - save to database and go to dashboard
//       console.log('🎉 All questions answered! Saving profile...');
//       setIsSaving(true);
      
//       // Update profile with personality answers
//       onUpdateProfile({ personalityAnswers: answers });
      
//       // Wait a tiny bit for state to update
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Save to database
//       await onSaveProfile();
      
//       // Navigation to dashboard happens automatically in saveProfileToBackend
//       setIsSaving(false);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const currentQ = questions[currentQuestion];
//   const shouldShowQuestion = !currentQ.conditional || currentQ.conditional(answers);

//   // Skip conditional questions that shouldn't be shown
//   React.useEffect(() => {
//     if (!shouldShowQuestion && currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   }, [shouldShowQuestion, currentQuestion]);

//   const canProceed = () => {
//     if (!shouldShowQuestion) return true;
//     const answer = answers[currentQ.id];
//     if (currentQ.type === 'checkbox') {
//       return answer && Array.isArray(answer) && answer.length > 0;
//     }
//     return answer !== undefined && answer !== '';
//   };

//   if (!shouldShowQuestion && currentQuestion < questions.length - 1) {
//     return null; // Will trigger useEffect to skip
//   }

//   if (isSaving) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-lg font-semibold">Saving your profile...</p>
//           <p className="text-sm text-gray-600 mt-2">Almost there! 🎉</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       {/* Floating Ball Decorations */}
//       <div className="fixed top-16 left-8 w-10 h-10 opacity-20">
//         <img src={starIcon} alt="" className="w-full h-full transform rotate-45" />
//       </div>
//       <div className="fixed top-1/3 right-4 w-6 h-6 opacity-15">
//         <img src={starIcon} alt="" className="w-full h-full transform -rotate-12" />
//       </div>
//       <div className="fixed bottom-32 left-12 w-8 h-8 opacity-10">
//         <img src={starIcon} alt="" className="w-full h-full transform rotate-90" />
//       </div>

//       <div className="max-w-md mx-auto">
//         {/* Progress */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
//             <span className="text-sm text-gray-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-black h-2 rounded-full transition-all duration-300"
//               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         <Card className="border-gray-200">
//           <CardHeader>
//             <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {currentQ.type === 'radio' && (
//               <RadioGroup
//                 value={answers[currentQ.id] || ''}
//                 onValueChange={(value) => handleAnswer(currentQ.id, value)}
//               >
//                 {currentQ.options?.map((option) => (
//                   <div key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
//                     <RadioGroupItem 
//                       value={option.value} 
//                       id={option.value} 
//                       className="mt-1 w-5 h-5 border-2 border-gray-400" 
//                     />
//                     <Label htmlFor={option.value} className="flex-1 leading-relaxed cursor-pointer text-sm">
//                       {option.label}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             )}

//             {currentQ.type === 'checkbox' && (
//               <div className="space-y-3">
//                 {currentQ.options?.map((option) => (
//                   <div key={option.value} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={option.value}
//                       checked={(answers[currentQ.id] || []).includes(option.value)}
//                       onCheckedChange={(checked) => {
//                         const current = answers[currentQ.id] || [];
//                         if (checked) {
//                           handleAnswer(currentQ.id, [...current, option.value]);
//                         } else {
//                           handleAnswer(currentQ.id, current.filter((v: string) => v !== option.value));
//                         }
//                       }}
//                     />
//                     <Label htmlFor={option.value} className="cursor-pointer">
//                       {option.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {currentQ.type === 'text' && (
//               <Input
//                 value={answers[currentQ.id] || ''}
//                 onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
//                 placeholder={currentQ.placeholder}
//                 className="border-gray-300"
//               />
//             )}

//             {currentQ.type === 'textarea' && (
//               <Textarea
//                 value={answers[currentQ.id] || ''}
//                 onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
//                 placeholder={currentQ.placeholder}
//                 className="border-gray-300 min-h-[100px]"
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Navigation */}
//         <div className="flex justify-between mt-8">
//           <Button
//             onClick={handlePrevious}
//             disabled={currentQuestion === 0 || isSaving}
//             variant="outline"
//             className="px-6"
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={handleNext}
//             disabled={!canProceed() || isSaving}
//             className="bg-black text-white hover:bg-gray-800 px-6"
//           >
//             {currentQuestion === questions.length - 1 ? 'Complete & Save' : 'Next'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
























import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { UserProfile } from '../App';
import { BrandHeader } from './BrandHeader';
import { auth, supabase } from '../utils/supabase';

type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea';

type Option = {
  value: string;
  label: string;
};

type PersonalityQuestion = {
  id: string;
  question: string;
  type: QuestionType;
  options?: Option[];
  placeholder?: string;
  conditional?: (answers: Record<string, any>) => boolean;
};

const QUESTIONS: PersonalityQuestion[] = [
  {
    id: 'planning',
    question: 'When making plans with friends, you typically…',
    type: 'radio',
    options: [
      { value: 'organize', label: 'Take charge and organize everything' },
      { value: 'suggest', label: 'Offer suggestions but let others decide' },
      { value: 'follow', label: 'Go with whatever others choose' },
      { value: 'delegate', label: 'Prefer when someone else handles the details' },
    ],
  },
  {
    id: 'socialSetting',
    question: 'Your ideal social setting feels…',
    type: 'radio',
    options: [
      { value: 'intimate', label: 'Intimate and cozy with close friends' },
      { value: 'lively', label: 'Lively with a good mix of people' },
      { value: 'sophisticated', label: 'Sophisticated and upscale' },
      { value: 'casual', label: 'Casual and laid-back' },
    ],
  },
  {
    id: 'connecting',
    question: 'When it comes to connecting with people, what feels most natural to you?',
    type: 'radio',
    options: [
      { value: 'diverse', label: 'I love meeting people from all walks of life and perspectives' },
      { value: 'curious', label: "I'm open and curious about different backgrounds and experiences" },
      { value: 'relatable', label: 'I usually stick with people I relate to most' },
      { value: 'familiar', label: 'I prefer familiar circles where I feel at ease' },
    ],
  },
  {
    id: 'newThings',
    question: 'When trying something new, you…',
    type: 'radio',
    options: [
      { value: 'research', label: 'Research thoroughly first' },
      { value: 'jump', label: 'Jump in with enthusiasm' },
      { value: 'friend', label: 'Need a trusted friend to join' },
      { value: 'familiar', label: 'Prefer familiar variations of things you like' },
    ],
  },
  {
    id: 'evening',
    question: 'Your ideal evening out involves…',
    type: 'radio',
    options: [
      { value: 'luxury', label: 'A luxury experience worth savoring' },
      { value: 'authentic', label: 'Something authentic and local' },
      { value: 'trendy', label: 'The latest trendy spot' },
      { value: 'comfortable', label: 'A comfortable, familiar place' },
    ],
  },
  {
    id: 'music',
    question: 'What music do you love? (Select all that apply)',
    type: 'checkbox',
    options: [
      { value: 'pop', label: 'Pop' },
      { value: 'rock', label: 'Rock' },
      { value: 'hip-hop', label: 'Hip-hop' },
      { value: 'electronic', label: 'Electronic' },
      { value: 'indie', label: 'Indie' },
      { value: 'bollywood', label: 'Bollywood' },
      { value: 'classical', label: 'Classical' },
    ],
  },
  {
    id: 'favoriteArtists',
    question: 'Favorite artists',
    type: 'text',
    placeholder: 'List your favorite artists...',
  },
  {
    id: 'personality',
    question: 'What is your personality type?',
    type: 'radio',
    options: [
      { value: 'introvert', label: 'Introvert' },
      { value: 'extrovert', label: 'Extrovert' },
      { value: 'ambivert', label: 'Ambivert' },
      { value: 'introverted-extrovert', label: 'Introverted Extrovert' },
      { value: 'extroverted-introvert', label: 'Extroverted Introvert' },
    ],
  },
  {
    id: 'conflict',
    question: 'When there’s tension with a friend, what feels right?',
    type: 'radio',
    options: [
      { value: 'talk-immediately', label: 'Talk it out right away' },
      { value: 'need-space', label: 'Take space before talking' },
      { value: 'depends', label: 'Depends on the situation' },
      { value: 'avoid', label: 'I usually avoid conflict' },
    ],
  },
  {
    id: 'humor',
    question: "What's your favorite type of humor?",
    type: 'radio',
    options: [
      { value: 'dark', label: 'Dark comedy' },
      { value: 'witty', label: 'Witty wordplay' },
      { value: 'silly', label: 'Silly or dumb puns' },
      { value: 'observational', label: 'Observational humor' },
    ],
  },
  {
    id: 'habits',
    question: 'Do you have any weird, random habits or collections?',
    type: 'textarea',
    placeholder: 'Tell us about your quirky habits or collections...',
  },
  {
    id: 'rewatch',
    question: "What's something you can rewatch a million times?",
    type: 'radio',
    options: [
      { value: 'movie', label: 'A favorite movie' },
      { value: 'tv-show', label: 'A favorite TV show' },
      { value: 'no-rewatch', label: "I don't really rewatch things" },
      { value: 'no-tv', label: "I'm not into TV/movies" },
    ],
  },
  {
    id: 'rewatchTitle',
    question: 'What’s the title?',
    type: 'text',
    placeholder: 'Enter the title…',
    conditional: (answers) => answers.rewatch === 'movie' || answers.rewatch === 'tv-show',
  },
  {
    id: 'drink',
    question: "What's your favorite drink?",
    type: 'radio',
    options: [
      { value: 'chai', label: 'Chai' },
      { value: 'coffee', label: 'Coffee' },
      { value: 'matcha', label: 'Matcha' },
      { value: 'none', label: 'Water all the way' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'otherDrink',
    question: "What's your other favorite drink?",
    type: 'text',
    placeholder: 'Enter your favorite drink…',
    conditional: (answers) => answers.drink === 'other',
  },
  {
    id: 'foodie',
    question: 'Would you describe yourself as a foodie?',
    type: 'radio',
    options: [
      { value: 'absolutely', label: 'Absolutely – I hunt for new flavours' },
      { value: 'somewhat', label: 'Somewhat – I enjoy good food' },
      { value: 'not-really', label: 'Not really – I stay in my comfort zone' },
      { value: 'nope', label: "Food isn't a big deal for me" },
    ],
  },
  {
    id: 'money',
    question: 'How would you describe yourself when it comes to money?',
    type: 'radio',
    options: [
      { value: 'generous', label: "I'm generous – experiences over pennies" },
      { value: 'balanced', label: 'Balanced – I know when to spend or save' },
      { value: 'careful', label: 'Careful – budgeting is my love language' },
      { value: 'stingy', label: "Stingy – it's hard to part with cash" },
    ],
  },
];

interface PersonalityQuestionsProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (screen: string) => void;
  onSaveProfile: () => Promise<void>;
}

export default function PersonalityQuestions({
  profile,
  onUpdateProfile,
  onNavigate,
  onSaveProfile,
}: PersonalityQuestionsProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(profile.personalityAnswers || {});
  const [isSaving, setIsSaving] = useState(false);
  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[index];
  const shouldRender = !currentQuestion.conditional || currentQuestion.conditional(answers);
  const progress = useMemo(
    () => Math.round(((index + 1) / totalQuestions) * 100),
    [index, totalQuestions],
  );

  useEffect(() => {
    if (!shouldRender && index < totalQuestions - 1) {
      setIndex((prev) => prev + 1);
    }
  }, [shouldRender, index, totalQuestions]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (!canProceed() || isSaving) return;

    if (index < totalQuestions - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    try {
      setIsSaving(true);
      
      // CRITICAL: Update profile state with answers FIRST
      console.log('💾 Preparing to save personality answers:', {
        answerCount: Object.keys(answers).length,
        answerKeys: Object.keys(answers),
        sampleAnswers: Object.entries(answers).slice(0, 3)
      });
      
      // Update local state
      onUpdateProfile({ personalityAnswers: answers });
      
      // CRITICAL: Save answers DIRECTLY to database using updateProfile
      // Don't rely on state updates - pass answers directly
      const { user } = await auth.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      // Get current profile to find the profile ID
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id, personality_answers')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      
      if (!currentProfile) {
        throw new Error('Profile not found');
      }
      
      // Merge existing answers with new ones
      const existingAnswers = currentProfile.personality_answers || {};
      const mergedAnswers = {
        ...existingAnswers,
        ...answers
      };
      
      console.log('💾 Saving personality answers directly to database:', {
        profileId: currentProfile.id,
        existingCount: Object.keys(existingAnswers).length,
        newCount: Object.keys(answers).length,
        mergedCount: Object.keys(mergedAnswers).length,
        answerKeys: Object.keys(mergedAnswers)
      });
      
      // Update profile directly with personality answers
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          personality_answers: mergedAnswers
        })
        .eq('id', currentProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Error updating personality answers:', updateError);
        throw updateError;
      }
      
      console.log('✅ Personality answers saved directly to database:', {
        savedCount: Object.keys(mergedAnswers).length,
        verified: updatedProfile.personality_answers ? Object.keys(updatedProfile.personality_answers).length : 0
      });
      
      // Now call the regular save function to update state and navigate
      await onSaveProfile();
      
      console.log('✅ Personality answers save completed');
    } catch (error: any) {
      console.error('❌ Error saving personality answers:', error);
      alert(`Failed to save personality answers: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (index === 0 || isSaving) return;
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const canProceed = () => {
    if (!shouldRender) return true;
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const renderOptions = () => {
    if (currentQuestion.type === 'radio' && currentQuestion.options) {
      return (
        <RadioGroup
          value={answers[currentQuestion.id] || ''}
          onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
          className="kismat-question__options"
        >
          {currentQuestion.options.map((option) => {
            const isActive = answers[currentQuestion.id] === option.value;
            return (
              <label
                key={option.value}
                htmlFor={`${currentQuestion.id}-${option.value}`}
                className={`kismat-option ${isActive ? 'kismat-option--active' : ''}`}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${currentQuestion.id}-${option.value}`}
                  className="kismat-option__control"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </RadioGroup>
      );
    }

    if (currentQuestion.type === 'checkbox' && currentQuestion.options) {
      const selectedValues: string[] = answers[currentQuestion.id] || [];
      return (
        <div className="kismat-question__options">
          {currentQuestion.options.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                htmlFor={`${currentQuestion.id}-${option.value}`}
                className={`kismat-option ${isChecked ? 'kismat-option--active' : ''}`}
              >
                <Checkbox
                  id={`${currentQuestion.id}-${option.value}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAnswer(currentQuestion.id, [...selectedValues, option.value]);
                    } else {
                      handleAnswer(
                        currentQuestion.id,
                        selectedValues.filter((value) => value !== option.value),
                      );
                    }
                  }}
                  className="kismat-option__control"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (currentQuestion.type === 'text') {
      return (
        <Input
          data-slot="input"
          value={answers[currentQuestion.id] || ''}
          onChange={(event) => handleAnswer(currentQuestion.id, event.target.value)}
          placeholder={currentQuestion.placeholder}
        />
      );
    }

    if (currentQuestion.type === 'textarea') {
      return (
        <Textarea
          data-slot="textarea"
          value={answers[currentQuestion.id] || ''}
          onChange={(event) => handleAnswer(currentQuestion.id, event.target.value)}
          placeholder={currentQuestion.placeholder}
          className="min-h-[120px]"
        />
      );
    }

    return null;
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <section className="kismat-screen kismat-screen--scroll" data-page="personality">
      <div className="kismat-panel">
        <div className="kismat-panel__content">
          <BrandHeader
            align="left"
            title={`Question ${index + 1} of ${totalQuestions}`}
            subtitle={`${progress}% complete`}
            badge={<span className="kismat-chip">{progress}%</span>}
          />

          <div className="kismat-progress-bar">
            <div 
              className="kismat-progress-bar__fill" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="kismat-question">
            <h2 className="kismat-question__title">
              {currentQuestion.question}
            </h2>
            
            <div className="kismat-question__content">
              {renderOptions()}
            </div>
          </div>

          <div className="kismat-actions">
            {index > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevious}
                disabled={isSaving}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              className="flex-1"
            >
              {isSaving 
                ? 'Saving...' 
                : index === totalQuestions - 1 
                  ? 'Complete profile' 
                  : 'Next'
              }
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}