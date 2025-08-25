// ...existing imports...
import { useRef } from 'react';

export default function RegistrationPage() {
  // ...existing state...

  const reportCardRef = useRef<HTMLInputElement>(null);
  const appLetterRef = useRef<HTMLInputElement>(null);

  // ...existing useEffects...

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/v1/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      let report_card_url = '';
      let application_letter_url = '';
      if (reportCardRef.current?.files?.[0]) {
        report_card_url = await uploadFile(reportCardRef.current.files[0]);
      }
      if (appLetterRef.current?.files?.[0]) {
        application_letter_url = await uploadFile(appLetterRef.current.files[0]);
      }
      await axios.post('/api/v1/registrations', {
        ...form,
        report_card_url,
        application_letter_url,
      });
      setSuccess('Registration submitted! You will be contacted soon.');
      setForm({ applicant_name: '', dob: '', phone: '', email: '', desired_class: '', desired_section: '' });
    } catch {
      setError('Failed to submit registration.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
      {/* ...existing fields... */}
      <label>Report Card (PDF/Image):</label>
      <input type="file" ref={reportCardRef} accept="application/pdf,image/*" className="w-full border p-2" />
      <label>Application Letter (PDF/Image):</label>
      <input type="file" ref={appLetterRef} accept="application/pdf,image/*" className="w-full border p-2" />
      {/* ...existing submit button, messages... */}
    </form>
  );
}