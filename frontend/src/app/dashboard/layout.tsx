import DashboardLayout from '@/components/layout/dashboard-layout';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Server-side authentication check
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    redirect('/auth/login');
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

