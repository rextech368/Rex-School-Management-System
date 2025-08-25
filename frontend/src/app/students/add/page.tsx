'use client';
import { useState } from 'react';
import axios from 'axios';

export default function AddStudentPage() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', dob: '', gender: '', admission_date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/v1/students', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Student added!');
    } catch {
      setError('Failed to add student');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} className="w-full border p-2" />
      <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} className="w-full border p-2" />
      <input name="dob" type="date" placeholder="DOB" value={form.dob} onChange={handleChange} className="w-full border p-2" />
      <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} className="w-full border p-2" />
      <input name="admission_date" type="date" placeholder="Admission Date" value={form.admission_date} onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Add Student</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}