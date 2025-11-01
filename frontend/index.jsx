import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import WelcomeScreen from '../components/WelcomeScreen';
import CountySelector from '../components/CountySelector';
import ClanSelector from '../components/ClanSelector';
import DonateScreen from '../components/DonateScreen';
import CommentScreen from '../components/CommentScreen';
import PaymentSuccess from '../components/PaymentSuccess';

function AppWrapper() {
  const navigate = useNavigate();
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedClan, setSelectedClan] = useState('');

  // Handlers for County -> Clan flow
  const handleSelectCounty = (county) => {
    setSelectedCounty(county);
    navigate('/clans');
  };

  const handleSelectClan = (clan) => {
    setSelectedClan(clan);
    navigate('/payment-success');
  };

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen
                                  onSelectOption={(option) => {
                                    if (option === 'clan') navigate('/counties');
                                    else if (option === 'donate') navigate('/donate');
                                    else if (option === 'comment') navigate('/comment');
                                  }}
                                />} 
      />

      <Route path="/counties" element={<CountySelector
                                          onSelectCounty={handleSelectCounty}
                                          onBack={() => navigate('/')}
                                        />}
      />

      <Route path="/clans" element={<ClanSelector
                                        county={selectedCounty}
                                        onSelectClan={handleSelectClan}
                                        onBack={() => navigate('/counties')}
                                      />}
      />

      <Route path="/donate" element={<DonateScreen onBack={() => navigate('/')} />} />

      <Route path="/comment" element={<CommentScreen onBack={() => navigate('/')} />} />

      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
  );
}

export default function IndexPage() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
