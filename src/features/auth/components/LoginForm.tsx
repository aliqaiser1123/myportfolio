'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogIn } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check for hash errors from Supabase implicit flow (like otp_expired)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      const hashError = hashParams.get('error_description');
      if (hashError) {
        setError(hashError.replace(/\+/g, ' '));
        // Clear the hash so we don't keep showing it
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      {searchParams.get('error') === 'auth_failed' && !error && (
        <p className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-md w-full text-center mb-4">
          Authentication failed. Please try again.
        </p>
      )}

      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-zinc-400">Admin Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-zinc-400">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-50"
        >
          <LogIn size={18} />
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-md w-full text-center">
          {error}
        </p>
      )}
    </div>
  );
}
