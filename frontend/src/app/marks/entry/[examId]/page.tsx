'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function MarkEntryPage() {
  const { examId } = useParams();
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/v1/students', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setStudents(res.data));
    axios.get('/api/v1/subjects', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setSubjects(res.data));
  }, []);

  const handleChange = (studentId: number, subjectId: number, value: string) => {
    setMarks({ ...marks, [`${studentId}_${subjectId}`]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      for (const [key, score] of Object.entries(marks)) {
        const [student, subject] = key.split('_');
        if (score) {
          await axios.post('/api/v1/marks', {
            exam: Number(examId),
            student: Number(student),
            subject: Number(subject),
            score: Number(score)
          }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        }
      }
      setMessage('Marks saved!');
    } catch {
      setMessage('Failed to save marks!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <table className="w-full border">
        <thead>
          <tr>
            <th>Student</th>
            {subjects.map(s => <th key={s.id}>{s.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {students.map(stu => (
            <tr key={stu.id}>
              <td>{stu.first_name} {stu.last_name}</td>
              {subjects.map(sub => (
                <td key={sub.id}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={marks[`${stu.id}_${sub.id}`] || ''}
                    onChange={e => handleChange(stu.id, sub.id, e.target.value)}
                    className="w-16 border"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white">Save Marks</button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}