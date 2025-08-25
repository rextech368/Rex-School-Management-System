'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  current_class?: { name: string };
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/students', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setStudents(res.data))
      .catch(err => setError('Failed to load students'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Students</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.dob}</td>
              <td>{s.gender}</td>
              <td>{s.current_class?.name ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}