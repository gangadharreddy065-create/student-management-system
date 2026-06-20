'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="btn btn-danger" 
      disabled={isDeleting}
      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
    >
      {isDeleting ? '...' : 'Delete'}
    </button>
  );
}
