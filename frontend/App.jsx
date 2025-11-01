import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import CountySelector from './components/CountySelector';
import ClanSelector from './components/ClanSelector';
import ClanPaymentScreen from './components/ClanPaymentScreen'; // ✅ NEW
import DonateScreen from './components/DonateScreen';
import CommentScreen from './components/CommentScreen';
import PaymentSuccess from './components/PaymentSuccess';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedClan, setSelectedClan] = useState(null);

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onSelectOption={(opt) => {
              if (opt === 'clan') setScreen('county');
              else if (opt === 'donate') setScreen('donate');
              else if (opt === 'comment') setScreen('comment');
            }}
          />
        );

      case 'county':
        return (
          <CountySelector
            onSelectCounty={(county) => {
              setSelectedCounty(county);
              setScreen('clan');
            }}
            onBack={() => setScreen('welcome')}
          />
        );

      case 'clan':
        return (
          <ClanSelector
            county={selectedCounty}
            onSelectClan={(clan) => {
              setSelectedClan(clan);
              setScreen('payment'); // ✅ Go to payment screen instead of success
            }}
            onBack={() => setScreen('county')}
          />
        );

      case 'payment':
        return (
          <ClanPaymentScreen
            clan={selectedClan}
            county={selectedCounty}
            onBack={() => setScreen('clan')}
            onPaymentSuccess={() => setScreen('success')}
          />
        );

      case 'donate':
        return <DonateScreen onBack={() => setScreen('welcome')} />;

      case 'comment':
        return <CommentScreen onBack={() => setScreen('welcome')} />;

      case 'success':
        return <PaymentSuccess onBack={() => setScreen('welcome')} />;

      default:
        return <WelcomeScreen onSelectOption={() => {}} />;
    }
  };

  return <div>{renderScreen()}</div>;
}
