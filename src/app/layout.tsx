import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Management System",
  description: "A premium student management system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <Link href="/" className="app-brand">
            🎓 <span>Student</span>Manager
          </Link>
          <nav>
            <Link href="/students/new" className="btn btn-primary">
              + Add Student
            </Link>
          </nav>
        </header>
        <main className="animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
