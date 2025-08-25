'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddSectionPage() {
  const [form, setForm] = useState({ name: '', class: '' });
  const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/api/v1/classes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setClasses(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/v1/sections', { ...form, class: Number(form.class) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Section added!');
    } catch {
      setError('Failed to add section');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2" />
      <select name="class" value={form.class} onChange={handleChange} className="w-full border p-2">
        <option value="">Select Class</option>
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Add Section</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}