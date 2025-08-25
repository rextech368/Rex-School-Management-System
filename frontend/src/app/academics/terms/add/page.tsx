'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddTermPage() {
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '', sequence_count: 1, academic_year: '' });
  const [years, setYears] = useState<{ id: number, name: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/api/v1/academic-years', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setYears(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/v1/terms', { ...form, academic_year: Number(form.academic_year), sequence_count: Number(form.sequence_count) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Term added!');
    } catch {
      setError('Failed to add term');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2" />
      <select name="academic_year" value={form.academic_year} onChange={handleChange} className="w-full border p-2">
        <option value="">Select Academic Year</option>
        {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
      </select>
      <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className="w-full border p-2" />
      <input name="end_date" type="date" value={form.end_date} onChange={handleChange} className="w-full border p-2" />
      <input name="sequence_count" type="number" value={form.sequence_count} onChange={handleChange} className="w-full border p-2" min={1} />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Add Term</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}