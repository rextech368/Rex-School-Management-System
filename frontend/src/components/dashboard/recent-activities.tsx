import React from 'react';
import Link from 'next/link';
import { 
  UserIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'enrollment' | 'payment' | 'attendance' | 'grade' | 'message';
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'enrollment',
    title: 'New Student Enrolled',
    description: 'John Smith has been enrolled in Grade 10',
    time: '10 minutes ago',
    user: {
      name: 'Admin User',
      avatar: '/avatars/admin.jpg',
    },
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    description: 'Sarah Johnson paid $1,200 for Term 2 fees',
    time: '1 hour ago',
    user: {
      name: 'Finance Officer',
      avatar: '/avatars/finance.jpg',
    },
  },
  {
    id: '3',
    type: 'attendance',
    title: 'Attendance Updated',
    description: 'Grade 8 attendance has been updated for today',
    time: '2 hours ago',
    user: {
      name: 'Ms. Williams',
      avatar: '/avatars/teacher1.jpg',
    },
  },
  {
    id: '4',
    type: 'grade',
    title: 'Grades Published',
    description: 'Mid-term exam results for Grade 11 have been published',
    time: '3 hours ago',
    user: {
      name: 'Mr. Johnson',
      avatar: '/avatars/teacher2.jpg',
    },
  },
  {
    id: '5',
    type: 'message',
    title: 'New Announcement',
    description: 'School closure notice for upcoming holiday',
    time: '5 hours ago',
    user: {
      name: 'Principal',
      avatar: '/avatars/principal.jpg',
    },
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'enrollment':
      return <UserIcon className="h-5 w-5 text-blue-500" />;
    case 'payment':
      return <CurrencyDollarIcon className="h-5 w-5 text-green-500" />;
    case 'attendance':
      return <CalendarIcon className="h-5 w-5 text-purple-500" />;
    case 'grade':
      return <DocumentTextIcon className="h-5 w-5 text-yellow-500" />;
    case 'message':
      return <EnvelopeIcon className="h-5 w-5 text-red-500" />;
    default:
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  }
};

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Activities</h2>
        <Link href="/activities" className="text-blue-600 text-sm hover:text-blue-800">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
            
            {activity.user && (
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-gray-500">by {activity.user.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 text-sm hover:text-blue-800">
          Load More
        </button>
      </div>
    </div>
  );
}

