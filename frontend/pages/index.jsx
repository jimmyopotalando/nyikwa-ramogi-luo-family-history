import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import CountySelector from '../components/CountySelector';

export default function HomePage() {
  const [view, setView] = useState('welcome');

  const handleSelectClan = () => {
    setView('county');
  };

  const handleDonate = () => {
    window.location.href = '/donate'; // navigate to /donate page
  };

  const handleComment = () => {
    window.location.href = '/comment'; // navigate to /comment page
  };

  const handleBackToWelcome = () => {
    setView('welcome');
  };

  const handleCountySelected = (county) => {
    // Store selected county and navigate to clan screen (you can later add routing logic)
    alert(`You selected county: ${county}`);
    // In a full app, you'd navigate or render ClanSelector here
  };

  return (
    <>
      {view === 'welcome' && (
        <WelcomeScreen
          onSelectClan={handleSelectClan}
          onDonate={handleDonate}
          onComment={handleComment}
        />
      )}

      {view === 'county' && (
        <CountySelector
          onSelectCounty={handleCountySelected}
          onBack={handleBackToWelcome}
        />
      )}
    </>
  );
}
