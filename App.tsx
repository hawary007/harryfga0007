import React, { useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';
import LoginPage from './LoginPage';
import MainAppPage from './MainAppPage';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT as string)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT as string);

const account = new Account(client);

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const checkSession = async () => {
    try {
      await account.getSession('current');
      setLoggedIn(true);
    } catch {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleAuth = async () => {
    await checkSession();
  };

  const handleLogout = async () => {
    await account.deleteSession('current');
    setLoggedIn(false);
  };

  if (loggedIn === null) {
    return <div className="p-4">Loading...</div>;
  }

  return loggedIn ? (
    <MainAppPage onLogout={handleLogout} />
  ) : (
    <LoginPage account={account} onAuth={handleAuth} />
  );
};

export default App;
