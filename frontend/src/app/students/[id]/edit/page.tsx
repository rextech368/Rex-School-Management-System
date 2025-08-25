'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '', last_name: '', dob: '', gender: '', admission_date: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`/api/v1/students/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          dob: res.data.dob,
          gender: res.data.gender,
          admission_date: res.data.admission_date,
        });
        setLoading(false);
      })
      .catch(() => { setError('Failed to load student'); setLoading(false); });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.put(`/api/v1/students/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Student updated!');
      setTimeout(() => router.push('/students'), 1000);
    } catch {
      setError('Failed to update student');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} className="w-full border p-2" />
      <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} className="w-full border p-2" />
      <input name="dob" type="date" placeholder="DOB" value={form.dob} onChange={handleChange} className="w-full border p-2" />
      <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} className="w-full border p-2" />
      <input name="admission_date" type="date" placeholder="Admission Date" value={form.admission_date} onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Update Student</button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
}