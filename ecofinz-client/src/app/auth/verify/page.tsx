"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as authService from '@/features/auth/services/authService';
import axios from 'axios';

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [verifyPin, setVerifyPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await authService.verifyUser({ email, verifyPin });
      setMessage('Verification successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Verification failed. Please check the PIN and try again.';
        console.error(errorMessage, err);
        setError(errorMessage);
      } else {
        const errorMessage = 'An unexpected error occurred.';
        console.error(errorMessage, err);
        setError(errorMessage);
      }
    }
  };

  return (
    <div>
      <h1>Verify Your Account</h1>
      <p>Please enter the verification PIN sent to your email.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        // The email field can be read-only if it's always pre-filled
        // readOnly={!!searchParams.get('email')} 
        />
        <input
          type="text"
          value={verifyPin}
          onChange={(e) => setVerifyPin(e.target.value)}
          placeholder="Verification PIN"
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
