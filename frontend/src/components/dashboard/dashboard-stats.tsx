import React from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-auto">
          <span className={`text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
            {change.positive ? '↑' : '↓'} {change.value}
          </span>
          <span className="text-gray-500 text-sm ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value="1,248"
        icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
        change={{ value: '12%', positive: true }}
        bgColor="bg-blue-100"
      />
      
      <StatCard
        title="Attendance Rate"
        value="94.2%"
        icon={<CalendarIcon className="h-6 w-6 text-green-600" />}
        change={{ value: '3.1%', positive: true }}
        bgColor="bg-green-100"
      />
      
      <StatCard
        title="Graduation Rate"
        value="89.7%"
        icon={<AcademicCapIcon className="h-6 w-6 text-purple-600" />}
        change={{ value: '1.2%', positive: true }}
        bgColor="bg-purple-100"
      />
      
      <StatCard
        title="Revenue"
        value="$328,500"
        icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
        change={{ value: '8.3%', positive: true }}
        bgColor="bg-yellow-100"
      />
    </div>
  );
}

