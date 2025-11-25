import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface WelcomePageProps {
  onNavigate: (screen: string) => void;
}

export function WelcomePage({ onNavigate }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Kismat
          </h1>
          <p className="text-gray-600 mb-8">
            Connect with people through shared experiences
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => onNavigate('signup')}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Get Started
            </Button>
            
            <Button 
              onClick={() => onNavigate('login')}
              variant="outline"
              className="w-full"
            >
              Already have an account? Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}