'use client';
import { useState } from 'react';
import axios from 'axios';

export default function AddLevelPage() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/v1/levels', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Level added!');
    } catch {
      setError('Failed to add level');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2" />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Add Level</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}