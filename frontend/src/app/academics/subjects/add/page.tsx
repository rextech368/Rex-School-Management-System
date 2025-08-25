'use client';
import { useState } from 'react';
import axios from 'axios';

export default function AddSubjectPage() {
  const [form, setForm] = useState({ code: '', name: '', coefficient: 1, hours_per_week: 1, description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/v1/subjects', { ...form, coefficient: Number(form.coefficient), hours_per_week: Number(form.hours_per_week) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Subject added!');
    } catch {
      setError('Failed to add subject');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="code" placeholder="Code" value={form.code} onChange={handleChange} className="w-full border p-2" />
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2" />
      <input name="coefficient" type="number" value={form.coefficient} onChange={handleChange} className="w-full border p-2" min={0} />
      <input name="hours_per_week" type="number" value={form.hours_per_week} onChange={handleChange} className="w-full border p-2" min={1} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Add Subject</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}