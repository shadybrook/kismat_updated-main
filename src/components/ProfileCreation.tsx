// import React, { useState } from 'react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { UserProfile } from '../App';
// import starIcon from 'figma:asset/7b020bf7102ddbbffe9451ec48111cb6db1aa563.png';

// interface ProfileCreationProps {
//   profile: UserProfile;
//   onUpdateProfile: (updates: Partial<UserProfile>) => void;
//   onNavigate: (screen: string) => void;
// }

// export function ProfileCreation({ profile, onUpdateProfile, onNavigate }: ProfileCreationProps) {
//   const [formData, setFormData] = useState({
//     name: profile.name,
//     age: profile.age,
//     gender: profile.gender,
//     pronouns: profile.pronouns,
//     studentOrProfessional: '',
//     workStudy: profile.workStudy,
//     apartment: profile.location.apartment,
//     locality: profile.location.locality,
//     suburb: profile.location.suburb,
//     city: profile.location.city
//   });

//   const [showVerification, setShowVerification] = useState(false);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handlePhotoVerification = () => {
//     setShowVerification(true);
//     setTimeout(() => {
//       setShowVerification(false);
//     }, 2000);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onUpdateProfile({
//       name: formData.name,
//       age: formData.age,
//       gender: formData.gender,
//       pronouns: formData.pronouns,
//       workStudy: formData.workStudy,
//       location: {
//         apartment: formData.apartment,
//         locality: formData.locality,
//         suburb: formData.suburb,
//         city: formData.city
//       }
//     });
//     onNavigate('personality');
//   };

//   return (
//     <div className="min-h-screen bg-white px-6 py-8">
//       <div className="fixed top-8 right-8 w-12 h-12 opacity-20">
//         <img src={starIcon} alt="" className="w-full h-full transform rotate-12" />
//       </div>
//       <div className="fixed bottom-20 left-6 w-8 h-8 opacity-15">
//         <img src={starIcon} alt="" className="w-full h-full transform -rotate-45" />
//       </div>
//       <div className="max-w-md mx-auto">
//         <h1 className="text-2xl mb-8 text-center text-black">Create Your Profile</h1>
//         <Card className="mb-6 border-gray-200">
//           <CardHeader>
//             <CardTitle className="text-lg">Photo & Verification</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center space-y-4">
//               <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
//                 <span className="text-gray-400">📷</span>
//               </div>
//               {!showVerification ? (
//                 <Button onClick={handlePhotoVerification} variant="outline" className="w-full">Upload Photo & Verify</Button>
//               ) : (
//                 <div className="text-green-600 space-y-2">
//                   <div className="text-sm">✓ Face verification complete!</div>
//                   <div className="text-xs text-gray-500">You can proceed to the next step</div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required className="border-gray-300" />
//             </div>
//             <div>
//               <Label htmlFor="age">Age</Label>
//               <Input id="age" type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} required className="border-gray-300" />
//             </div>
//             <div>
//               <Label htmlFor="gender">Gender</Label>
//               <Select onValueChange={(value) => handleInputChange('gender', value)}>
//                 <SelectTrigger className="border-gray-300"><SelectValue placeholder="Select gender" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="male">Male</SelectItem>
//                   <SelectItem value="female">Female</SelectItem>
//                   <SelectItem value="non-binary">Non-binary</SelectItem>
//                   <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="pronouns">Pronouns</Label>
//               <Input id="pronouns" value={formData.pronouns} onChange={(e) => handleInputChange('pronouns', e.target.value)} placeholder="e.g., they/them, she/her, he/him" className="border-gray-300" />
//             </div>
//             <div>
//               <Label htmlFor="studentOrProfessional">Are you a student or professional?</Label>
//               <Select onValueChange={(value) => handleInputChange('studentOrProfessional', value)}>
//                 <SelectTrigger className="border-gray-300"><SelectValue placeholder="Select one" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="student">Student</SelectItem>
//                   <SelectItem value="professional">Professional</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             {formData.studentOrProfessional && (
//               <div>
//                 <Label htmlFor="workStudy">{formData.studentOrProfessional === 'student' ? 'Where do you study?' : 'Where do you work and what do you do?'}</Label>
//                 <Input id="workStudy" value={formData.workStudy} onChange={(e) => handleInputChange('workStudy', e.target.value)} placeholder={formData.studentOrProfessional === 'student' ? 'University/College name' : 'Company name and your role'} required className="border-gray-300" />
//               </div>
//             )}
//           </div>
//           <div className="space-y-4">
//             <h3 className="text-lg">Location</h3>
//             <div>
//               <Label htmlFor="apartment">Apartment/Building Number</Label>
//               <Input id="apartment" value={formData.apartment} onChange={(e) => handleInputChange('apartment', e.target.value)} className="border-gray-300" />
//             </div>
//             <div>
//               <Label htmlFor="locality">Locality</Label>
//               <Input id="locality" value={formData.locality} onChange={(e) => handleInputChange('locality', e.target.value)} required className="border-gray-300" />
//             </div>
//             <div>
//               <Label htmlFor="suburb">Suburb</Label>
//               <Input id="suburb" value={formData.suburb} onChange={(e) => handleInputChange('suburb', e.target.value)} required className="border-gray-300" />
//             </div>
//             <div>
//               <Label htmlFor="city">City</Label>
//               <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required className="border-gray-300" />
//             </div>
//           </div>
//           <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 py-3">Continue to Personality Questions</Button>
//         </form>
//       </div>
//     </div>
//   );
// }



























import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserProfile } from '../App';
import { BrandHeader } from './BrandHeader';
import { db, auth } from '../utils/supabase';
import { Upload, Camera, CheckCircle, X } from 'lucide-react';

interface ProfileCreationProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (screen: string) => void;
}

export function ProfileCreation({ profile, onUpdateProfile, onNavigate }: ProfileCreationProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    pronouns: profile.pronouns,
    studentOrProfessional: '',
    workStudy: profile.workStudy,
    apartment: profile.location.apartment,
    locality: profile.location.locality,
    suburb: profile.location.suburb,
    city: profile.location.city
  });

  const [showVerification, setShowVerification] = useState(false);
  const [showOtherCity, setShowOtherCity] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(profile.photoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const { user } = await auth.getCurrentUser();
      if (!user) {
        setUploadError('Please sign in to upload photos');
        setIsUploading(false);
        return;
      }

      // Upload to Supabase Storage
      const result = await db.uploadProfilePhoto(selectedFile, user.id);

      if (result.success && result.url) {
        setImageUrl(result.url);
    setShowVerification(true);
        // Update profile with image URL
        onUpdateProfile({ photoUrl: result.url });
      } else {
        setUploadError(result.error || 'Failed to upload photo');
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setUploadError(error.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUrl(null);
      setShowVerification(false);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const triggerFileInput = (useCamera: boolean = false) => {
    if (useCamera) {
      cameraInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update local state first
    onUpdateProfile({
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      pronouns: formData.pronouns,
      workStudy: formData.workStudy,
      photoUrl: imageUrl || undefined,
      location: {
        apartment: formData.apartment,
        locality: formData.locality,
        suburb: formData.suburb,
        city: formData.city
      }
    });
    
    // CRITICAL: Save profile to database immediately after profile creation
    // This ensures the profile exists before personality questions
    try {
      const { user } = await auth.getCurrentUser();
      if (!user) {
        console.error('❌ No user found - cannot save profile');
        onNavigate('personality'); // Still navigate, but profile won't be saved
        return;
      }
      
      console.log('💾 Saving initial profile to database...', {
        email: user.email,
        name: formData.name,
        city: formData.city
      });
      
      // Save profile using db.createProfile
      const profileToSave = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        pronouns: formData.pronouns,
        workStudy: formData.workStudy,
        photoUrl: imageUrl || undefined,
        location: {
          apartment: formData.apartment,
          locality: formData.locality,
          suburb: formData.suburb,
          city: formData.city
        },
        personalityAnswers: {}, // Empty for now, will be filled in personality questions
        joinedEvents: []
      };
      
      const result = await db.createProfile(profileToSave);
      
      if (result.profile) {
        console.log('✅ Initial profile saved successfully!', {
          profileId: result.profile.id,
          email: result.profile.email
        });
      } else if (result.error) {
        console.error('❌ Error saving initial profile:', result.error);
        // Still navigate - profile might exist already
      }
    } catch (error: any) {
      console.error('❌ Exception saving initial profile:', error);
      // Still navigate - don't block user flow
    }
    
    onNavigate('personality');
  };

  const cityOptions = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Other'];

  return (
    <section className="kismat-screen kismat-screen--scroll" data-page="profile">
      <div className="kismat-panel">
        <div className="kismat-panel__content">
          <BrandHeader
            align="left"
            title="Create your profile"
            subtitle="Tell us a little bit about yourself so we can make better matches."
          />

          <div className="kismat-card-row flex-col items-center text-center gap-4">
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Photo preview or placeholder */}
            {imagePreview || imageUrl ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/30">
                <img
                  src={imagePreview || imageUrl || ''}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                {showVerification && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                )}
                {!showVerification && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 rounded-full p-1 transition-colors"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
      </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-4xl border-2 border-white/20">
                📷
      </div>
            )}

            {showVerification ? (
              <div className="kismat-alert kismat-alert--success w-full text-center">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Photo verified! You can proceed to the next step.
              </div>
            ) : (
              <>
                <p className="text-sm text-white/80">
                  Add a clear photo so other members know who you are.
                </p>
                
                {imagePreview && !imageUrl ? (
                  <div className="w-full space-y-3">
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload & Verify
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRemovePhoto}
                      className="w-full kismat-btn--ghost"
                    >
                      Cancel
                    </Button>
                  </div>
              ) : (
                  <div className="w-full grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => triggerFileInput(false)}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => triggerFileInput(true)}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                )}

                {uploadError && (
                  <div className="kismat-alert kismat-alert--error w-full text-center text-sm">
                    {uploadError}
                </div>
                )}
              </>
              )}
            </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
              <h3 className="kismat-section-title">About you</h3>
              <div className="kismat-grid kismat-grid--two">
            <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    required
                  />
                </div>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="kismat-field">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pronouns">Pronouns</Label>
                <Input
                  id="pronouns"
                  value={formData.pronouns}
                  onChange={(e) => handleInputChange('pronouns', e.target.value)}
                  placeholder="e.g., they/them, she/her, he/him"
                />
            </div>

            <div>
              <Label htmlFor="studentOrProfessional">Are you a student or professional?</Label>
                <Select
                  value={formData.studentOrProfessional}
                  onValueChange={(value) => handleInputChange('studentOrProfessional', value)}
                >
                  <SelectTrigger className="kismat-field">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.studentOrProfessional && (
              <div>
                  <Label htmlFor="workStudy">
                    {formData.studentOrProfessional === 'student'
                      ? 'Where do you study?'
                      : 'Where do you work and what do you do?'}
                  </Label>
                  <Input
                    id="workStudy"
                    value={formData.workStudy}
                    onChange={(e) => handleInputChange('workStudy', e.target.value)}
                    placeholder={
                      formData.studentOrProfessional === 'student'
                        ? 'University or college name'
                        : 'Company name and your role'
                    }
                    required
                  />
              </div>
            )}
          </div>

          <div className="space-y-4">
              <h3 className="kismat-section-title">Location</h3>
              <div className="kismat-grid kismat-grid--two">
            <div>
                  <Label htmlFor="apartment">Apartment / Building</Label>
                  <Input
                    id="apartment"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                  />
            </div>
            <div>
              <Label htmlFor="locality">Locality</Label>
                  <Input
                    id="locality"
                    value={formData.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    required
                  />
                </div>
            </div>
              <div className="kismat-grid kismat-grid--two">
            <div>
              <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    id="suburb"
                    value={formData.suburb}
                    onChange={(e) => handleInputChange('suburb', e.target.value)}
                    required
                  />
            </div>
            <div>
                  <Label htmlFor="city">City</Label>
              <Select 
                value={formData.city}
                onValueChange={(value) => {
                  handleInputChange('city', value);
                      setShowOtherCity(value === 'Other');
                }}
              >
                    <SelectTrigger className="kismat-field">
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                      {cityOptions.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              {showOtherCity && (
                <Input
                      className="mt-2"
                  placeholder="Enter your city name"
                  value={formData.city === 'Other' ? '' : formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              )}
            </div>
          </div>
            </div>

            <Button type="submit" className="w-full py-4 text-base">
              Continue to personality questions
            </Button>
        </form>
      </div>
    </div>
    </section>
  );
}