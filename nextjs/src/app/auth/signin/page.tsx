'use client';

import AuthLayout from '@/features/auth/components/AuthLayout';
import InputField from '@/features/auth/components/InputField';
import SubmitButton from '@/features/auth/components/SubmitButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState } from 'react';

function SignInForm() {
  const { isLoading, isRedirecting, errors, authError, handleSignIn, handleGoogleSignIn } =
    useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  return (
    <AuthLayout title="Sign in">
      {/* 리다이렉트 중일 때 인라인 로딩 메시지 */}
      {isRedirecting && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-blue-700 text-sm font-medium">Signing you in...</span>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <InputField
          type="email"
          ariaLabel="Email Address"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fieldError={errors.email}
          authError={authError}
        />
        <InputField
          type="password"
          ariaLabel="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fieldError={errors.password}
          authError={authError}
          isLast
        />
        <SubmitButton title="Sign In" isLoading={isLoading} />
      </form>
      <div className="flex items-center justify-between text-sm mt-6">
        <Link href="#" className="text-indigo-500 hover:underline transition">
          Forgot password?
        </Link>
        <Link href="/auth/signup" className="text-indigo-500 hover:underline transition">
          Don't have an account?
        </Link>
      </div>
      <div className="mt-6">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 shadow-sm rounded-lg px-4 py-2 font-medium hover:bg-gray-50 transition disabled:opacity-50"
          disabled={isLoading || isRedirecting}
        >
          <Image src="/google-logo.png" alt="Google" width={24} height={24} className="w-6 h-6" />
          Continue with Google
        </button>
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
