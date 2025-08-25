'use client';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/v1/auth/login', form);
      // Store token, redirect, etc.
      localStorage.setItem('token', res.data.access_token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        className="w-full border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">
        Login
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}