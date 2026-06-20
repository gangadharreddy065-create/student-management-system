import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, course, enrollmentDate, status } = body;

    // Simple server-side validation
    if (!firstName || !lastName || !email || !course) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        course,
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : undefined,
        status: status || 'Active',
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create student:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
