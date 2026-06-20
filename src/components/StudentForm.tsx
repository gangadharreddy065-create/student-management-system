'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Student = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  enrollmentDate: string;
  status: string;
};

type Props = {
  initialData?: Student;
  isEditing?: boolean;
};

export default function StudentForm({ initialData, isEditing = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Student>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    course: initialData?.course || '',
    enrollmentDate: initialData?.enrollmentDate 
      ? new Date(initialData.enrollmentDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    status: initialData?.status || 'Active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.course) {
      setError('Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = isEditing && initialData?.id 
        ? `/api/students/${initialData.id}` 
        : '/api/students';
        
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
      {error && <div className="form-error" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--warning-bg)', borderRadius: '8px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="firstName">First Name *</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              className="form-input" 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="lastName">Last Name *</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              className="form-input" 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="form-input" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="course">Course/Major *</label>
          <input 
            type="text" 
            id="course" 
            name="course" 
            className="form-input" 
            value={formData.course} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="enrollmentDate">Enrollment Date</label>
            <input 
              type="date" 
              id="enrollmentDate" 
              name="enrollmentDate" 
              className="form-input" 
              value={formData.enrollmentDate} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status" 
              className="form-input" 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Saving...' : (isEditing ? 'Update Student' : 'Save Student')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/')} style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
