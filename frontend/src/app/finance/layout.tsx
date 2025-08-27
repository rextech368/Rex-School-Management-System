'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DocumentTextIcon, 
  CreditCardIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/finance', icon: <ChartBarIcon className="h-5 w-5" /> },
  { name: 'Invoices', href: '/finance/invoices', icon: <DocumentTextIcon className="h-5 w-5" /> },
  { name: 'Payments', href: '/finance/payments', icon: <CreditCardIcon className="h-5 w-5" /> },
  { name: 'Fees', href: '/finance/fees', icon: <CurrencyDollarIcon className="h-5 w-5" /> },
  { name: 'Settings', href: '/finance/settings', icon: <Cog6ToothIcon className="h-5 w-5" /> },
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/finance' && pathname === '/finance') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/finance';
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="bg-white shadow-md md:w-64 md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Finance Module</h2>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${isActive(item.href) ? 'text-blue-500' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <span className="text-sm font-medium leading-none text-blue-700">FM</span>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Finance Manager</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  );
}

