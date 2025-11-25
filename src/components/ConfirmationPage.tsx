import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UserProfile } from '../App';
import starIcon from 'figma:asset/7b020bf7102ddbbffe9451ec48111cb6db1aa563.png';

interface ConfirmationPageProps {
  profile: UserProfile;
  onNavigate: (screen: string) => void;
  onSaveProfile: () => Promise<void>;
  isLoading: boolean;
}

export function ConfirmationPage({ profile, onNavigate, onSaveProfile, isLoading }: ConfirmationPageProps) {
  const isMumbai = profile.location.city.toLowerCase().includes('mumbai')|| 
                 profile.location.city.toLowerCase().includes('bombay');;

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex items-center justify-center">
      {/* Floating Ball Decorations */}
      <div className="fixed top-20 right-10 w-12 h-12 opacity-20">
        <img src={starIcon} alt="" className="w-full h-full transform rotate-30" />
      </div>
      <div className="fixed bottom-40 left-8 w-10 h-10 opacity-15">
        <img src={starIcon} alt="" className="w-full h-full transform -rotate-60" />
      </div>
      <div className="fixed top-1/2 left-4 w-6 h-6 opacity-10">
        <img src={starIcon} alt="" className="w-full h-full transform rotate-180" />
      </div>

      <div className="max-w-md mx-auto text-center">
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <CardTitle className="text-xl text-green-600">Profile Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            {isMumbai ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Welcome to Kismat, {profile.name}! Your personality profile has been saved.
                </p>
                <p className="text-black">
                  Great news! We have exciting events happening in Mumbai this week. 
                  Let's find your people!
                </p>
                <Button
                  onClick={async () => {
                    await onSaveProfile();
                    onNavigate('events');
                  }}
                  disabled={isLoading}
                  className="w-full bg-black text-white hover:bg-gray-800 py-3 mt-6"
                >
                  {isLoading ? 'Saving Profile...' : 'Explore Events in Mumbai'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Thank you for joining Kismat {profile.name}!
                </p>
                <p className="text-black">
                  We have saved your personality profile. We are coming to your city soon!
                </p>
                <p className="text-sm text-gray-500">
                  You'll be the first to know when we launch events in {profile.location.city}.
                </p>
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm mb-2">What happens next?</h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• We'll notify you when events start in your city</li>
                    <li>• Your personality profile is ready to match you with like-minded people</li>
                    <li>• Be among the first to experience Kismat in {profile.location.city}</li>
                  </ul>
                </div>
                <Button
                  onClick={async () => {
                    await onSaveProfile();
                    onNavigate('dashboard');
                  }}
                  disabled={isLoading}
                  className="w-full bg-black text-white hover:bg-gray-800 py-3 mt-6"
                >
                  {isLoading ? 'Saving Profile...' : 'Go to Dashboard'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-xs text-gray-400">
          You can always update your profile later in your dashboard.
        </div>
      </div>
    </div>
  );
}