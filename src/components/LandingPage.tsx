import React from 'react';
import { Button } from './ui/button';
import { BrandHeader } from './BrandHeader';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <section className="kismat-screen" data-page="landing">
      <div className="kismat-panel kismat-panel--narrow kismat-panel__content">
        <BrandHeader
          subtitle="meet people based on personality"
        />

        <div className="text-center space-y-4">
          <h1 className="kismat-title">
          Meet your new favorite people through shared experiences in your city.
        </h1>
          <p className="kismat-subtitle">Find My People</p>
      </div>

        <div className="kismat-actions flex-col">
        <Button
          onClick={() => onNavigate('auth')}
            className="w-full py-4 text-base"
        >
          Get Started
        </Button>
          <Button
            variant="outline"
            className="w-full kismat-btn--ghost py-4 text-base"
            onClick={() => onNavigate('auth')}
          >
            Already have an account? Log in
          </Button>
      </div>

        <p className="kismat-panel__footer">
        Connect. Experience. Belong.
        </p>
      </div>
    </section>
  );
}