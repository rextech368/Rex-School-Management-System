'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function EditStudentEmailMessagePage() {
  const { studentId, examId } = useParams();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`/api/v1/report-cards/email-message/${studentId}/${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      if (res.data) {
        setSubject(res.data.subject);
        setBody(res.data.body);
      }
    });
  }, [studentId, examId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`/api/v1/report-cards/email-message`, {
      student: Number(studentId),
      exam_id: Number(examId),
      class_id: 0, // populate with actual classId if needed
      subject,
      body,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Student Email Message</h1>
      <label>Subject</label>
      <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border mb-2 p-2" />
      <label>Body (HTML)</label>
      <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border mb-2 p-2" rows={8}></textarea>
      <button className="bg-blue-700 px-4 py-2 text-white rounded" type="submit">Save</button>
      {saved && <div className="mt-2 text-green-600">Saved!</div>}
    </form>
  );
}