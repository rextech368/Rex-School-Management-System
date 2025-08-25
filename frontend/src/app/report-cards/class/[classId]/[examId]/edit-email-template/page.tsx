'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function EditEmailTemplatePage() {
  const { classId, examId } = useParams();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    axios.get(`/api/v1/report-cards/email-template?class_id=${classId}&exam_id=${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      if (res.data) {
        setSubject(res.data.subject);
        setBody(res.data.body);
      }
    });
  }, [classId, examId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`/api/v1/report-cards/email-template`, {
        class_id: Number(classId),
        exam_id: Number(examId),
        subject,
        body,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Saved!');
    } catch {
      setMessage('Failed to save');
    }
  };

  return (
    <form onSubmit={handleSave} className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Email Template</h1>
      <label>Subject</label>
      <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border mb-2 p-2" />
      <label>Body (HTML, supports variables like {'{studentName}'}, {'{average}'}, etc.)</label>
      <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border mb-2 p-2" rows={8}></textarea>
      <button className="bg-blue-700 px-4 py-2 text-white rounded" type="submit">Save</button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}