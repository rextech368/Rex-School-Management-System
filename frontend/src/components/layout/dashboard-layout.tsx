import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: string[];
}

interface DashboardLayoutProps {
  children: ReactNode;
}

// Import icons from a UI library like heroicons or lucide-react
// For this example, we'll use placeholder components
const HomeIcon = () => <div>🏠</div>;
const UsersIcon = () => <div>👥</div>;
const StudentsIcon = () => <div>🧑‍🎓</div>;
const ClassesIcon = () => <div>📚</div>;
const FinanceIcon = () => <div>💰</div>;
const ReportsIcon = () => <div>📊</div>;
const SettingsIcon = () => <div>⚙️</div>;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon, requiredRole: ['admin'] },
    { name: 'Students', href: '/students', icon: StudentsIcon, requiredRole: ['admin', 'teacher', 'staff'] },
    { name: 'Classes', href: '/classes', icon: ClassesIcon, requiredRole: ['admin', 'teacher', 'staff'] },
    { name: 'Finance', href: '/finance', icon: FinanceIcon, requiredRole: ['admin', 'staff'] },
    { name: 'Reports', href: '/reports', icon: ReportsIcon, requiredRole: ['admin', 'teacher', 'staff'] },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => {
    if (!item.requiredRole) return true;
    return user && item.requiredRole.includes(user.role);
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-md transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>
            Rex School
          </h1>
          <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-200">
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {filteredSidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-4 ${
                    pathname?.startsWith(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">
                    <item.icon />
                  </span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={logout}
            className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <span className="mr-3">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {pathname?.split('/')[1]?.charAt(0).toUpperCase() + pathname?.split('/')[1]?.slice(1) || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name || 'User'}
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;

