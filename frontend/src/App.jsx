import React from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import toast,{ Toaster } from 'react-hot-toast';

const App = () => {
  return (
<div className=" h-screen" data-theme="dark">
    <button onClick={() => toast.success("This is a success message!")}>Create Toast</button>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/notifications" element={<NotificationsPage   />} />
      <Route path="/call" element={<CallPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
    <Toaster />
</div>
  )
}

export default App;