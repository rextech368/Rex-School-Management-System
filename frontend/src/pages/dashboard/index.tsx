import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  DollarSign, 
  Clock 
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const stats = [
    { name: 'Total Students', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { name: 'Total Teachers', value: '56', icon: GraduationCap, color: 'bg-green-500' },
    { name: 'Classes Today', value: '24', icon: Calendar, color: 'bg-yellow-500' },
    { name: 'Upcoming Exams', value: '3', icon: FileText, color: 'bg-purple-500' },
    { name: 'Fee Collection', value: '$12,345', icon: DollarSign, color: 'bg-red-500' },
    { name: 'Attendance Rate', value: '94%', icon: Clock, color: 'bg-indigo-500' },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | Rex School Management System</title>
      </Head>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.fullName}!</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-card shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-card shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Recent Activities</h3>
              <div className="mt-6 flow-root">
                <ul className="-my-5 divide-y divide-border">
                  <li className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                          <Users className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">New student registered</p>
                        <p className="truncate text-sm text-muted-foreground">John Doe - Grade 10</p>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                        2 hours ago
                      </div>
                    </div>
                  </li>
                  <li className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-500">
                          <FileText className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">Exam results published</p>
                        <p className="truncate text-sm text-muted-foreground">
                          Mid-term Mathematics - Grade 9
                        </p>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                        5 hours ago
                      </div>
                    </div>
                  </li>
                  <li className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                          <Calendar className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">New event scheduled</p>
                        <p className="truncate text-sm text-muted-foreground">
                          Annual Sports Day - December 15
                        </p>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                        1 day ago
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-card shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium">Upcoming Events</h3>
              <div className="mt-6 flow-root">
                <ul className="-my-5 divide-y divide-border">
                  <li className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-red-100 text-red-500">
                          <span className="text-sm font-medium">15</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">Annual Sports Day</p>
                        <p className="truncate text-sm text-muted-foreground">
                          December 15, 9:00 AM - 4:00 PM
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-500">
                          <span className="text-sm font-medium">20</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">Final Exams Begin</p>
                        <p className="truncate text-sm text-muted-foreground">
                          December 20, All Grades
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-green-500">
                          <span className="text-sm font-medium">22</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">Parent-Teacher Meeting</p>
                        <p className="truncate text-sm text-muted-foreground">
                          December 22, 2:00 PM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  View calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

