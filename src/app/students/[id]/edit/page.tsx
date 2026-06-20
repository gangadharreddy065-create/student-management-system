import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StudentForm from '@/components/StudentForm';

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student) {
    notFound();
  }

  // Convert dates to string for client component
  const formattedStudent = {
    ...student,
    enrollmentDate: student.enrollmentDate.toISOString(),
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };

  return (
    <div>
      <StudentForm initialData={formattedStudent} isEditing={true} />
    </div>
  );
}
