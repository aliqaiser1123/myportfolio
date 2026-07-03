import { Suspense } from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Admin Login | AI Engineer Portfolio',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900/50 p-8 shadow-xl border border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Secure authentication for authorized personnel only.
          </p>
        </div>
        
        <div className="mt-8">
          <Suspense fallback={<div className="text-center text-zinc-500">Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
