import React from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'exam' | 'meeting' | 'activity' | 'holiday';
}

const events: Event[] = [
  {
    id: '1',
    title: 'End of Term Exams',
    date: 'Dec 10-15, 2023',
    time: '9:00 AM - 12:00 PM',
    location: 'All Classrooms',
    type: 'exam',
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    date: 'Dec 18, 2023',
    time: '2:00 PM - 5:00 PM',
    location: 'School Auditorium',
    type: 'meeting',
  },
  {
    id: '3',
    title: 'Annual Sports Day',
    date: 'Dec 20, 2023',
    time: '8:00 AM - 4:00 PM',
    location: 'School Grounds',
    type: 'activity',
  },
  {
    id: '4',
    title: 'Winter Break',
    date: 'Dec 22, 2023 - Jan 5, 2024',
    time: 'All Day',
    location: 'School Closed',
    type: 'holiday',
  },
  {
    id: '5',
    title: 'New Term Begins',
    date: 'Jan 8, 2024',
    time: '8:00 AM',
    location: 'All Classrooms',
    type: 'activity',
  },
];

const getEventColor = (type: Event['type']) => {
  switch (type) {
    case 'exam':
      return 'border-red-500';
    case 'meeting':
      return 'border-blue-500';
    case 'activity':
      return 'border-green-500';
    case 'holiday':
      return 'border-purple-500';
    default:
      return 'border-gray-500';
  }
};

export default function UpcomingEvents() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <Link href="/calendar" className="text-blue-600 text-sm hover:text-blue-800">
          View Calendar
        </Link>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className={`border-l-4 ${getEventColor(event.type)} pl-4 py-2 hover:bg-gray-50 rounded-r-md transition-colors`}
          >
            <h3 className="font-medium text-gray-900">{event.title}</h3>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-4">
              <div className="text-sm text-gray-500">
                📅 {event.date}
              </div>
              <div className="text-sm text-gray-500">
                🕒 {event.time}
              </div>
              <div className="text-sm text-gray-500">
                📍 {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 text-sm hover:text-blue-800">
          Add Event
        </button>
      </div>
    </div>
  );
}

