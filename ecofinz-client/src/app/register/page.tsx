"use client";
import { useState } from 'react';
import * as authService from '@/services/authService';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.registerUser({ name, email, password });
      router.push(`/verify?email=${email}`);
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        const errorMessage = 'Network Error: Could not connect to the server. Please ensure the backend is running and that CORS is configured correctly.';
        console.error(errorMessage, err);
        setError(errorMessage);
      } else {
        const errorMessage = 'Failed to register. Please check the console for more details.';
        console.error(errorMessage, err);
        setError(errorMessage);
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
