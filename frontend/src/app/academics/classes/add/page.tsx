'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddClassPage() {
  const [form, setForm] = useState({ name: '', code: '', group_type: '', default_promotion_threshold: 50, level: '' });
  const [levels, setLevels] = useState<{ id: number, name: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/api/v1/levels', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setLevels(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/v1/classes', { ...form, level: Number(form.level), default_promotion_threshold: Number(form.default_promotion_threshold) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Class added!');
    } catch {
      setError('Failed to add class');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2" />
      <input name="code" placeholder="Code" value={form.code} onChange={handleChange} className="w-full border p-2" />
      <select name="group_type" value={form.group_type} onChange={handleChange} className="w-full border p-2">
        <option value="">Select Group</option>
        <option value="Primary">Primary</option>
        <option value="Secondary">Secondary</option>
      </select>
      <input name="default_promotion_threshold" type="number" value={form.default_promotion_threshold} onChange={handleChange} className="w-full border p-2" min={0} max={100} />
      <select name="level" value={form.level} onChange={handleChange} className="w-full border p-2">
        <option value="">Select Level</option>
        {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Add Class</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}