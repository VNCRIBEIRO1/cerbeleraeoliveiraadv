'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function ConditionalAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      setConsentGiven(consent === 'accepted');
    };

    checkConsent();

    // Listen for consent changes (when user clicks accept/decline)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        setConsentGiven(e.newValue === 'accepted');
      }
    };

    // Also poll for same-tab changes (localStorage events only fire cross-tab)
    const interval = setInterval(checkConsent, 1000);

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (!consentGiven) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
