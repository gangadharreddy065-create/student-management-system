import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { Student } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Student Dashboard</h1>
          <p>Manage your students, courses, and enrollments efficiently.</p>
        </div>
      </div>

      <div className="table-container">
        {students.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No students found. Add your first student to get started.</p>
            <Link href="/students/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              + Add Student
            </Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: Student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{student.firstName} {student.lastName}</div>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.enrollmentDate.toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link 
                      href={`/students/${student.id}/edit`} 
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Edit
                    </Link>
                    <DeleteButton id={student.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
