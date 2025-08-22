import React, { useState } from 'react';
import { Account } from 'appwrite';

interface LoginPageProps {
  account: Account;
  onAuth: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ account, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signup') {
        await account.create('unique()', email, password);
      }
      await account.createEmailPasswordSession(email, password);
      onAuth();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-xs p-6 bg-white rounded shadow-md space-y-4">
        <h2 className="text-xl font-bold text-center">{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-sm text-blue-600 underline"
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
