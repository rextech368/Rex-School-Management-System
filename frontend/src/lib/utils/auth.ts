import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  organizationId?: string;
  exp: number;
  iat: number;
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

export const getUserId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch (error) {
    return null;
  }
};

export const getOrganizationId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.organizationId || null;
  } catch (error) {
    return null;
  }
};

export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('token');
  window.location.href = '/auth/login';
};

export const hasPermission = (requiredPermission: string): boolean => {
  const role = getUserRole();
  
  // Define role-based permissions
  const permissions: Record<string, string[]> = {
    'admin': ['all'],
    'teacher': ['view_students', 'edit_students', 'view_classes', 'edit_classes', 'view_exams', 'edit_exams'],
    'student': ['view_profile', 'view_classes', 'view_exams', 'view_results'],
    'parent': ['view_children', 'view_results', 'view_payments'],
    'staff': ['view_students', 'view_classes', 'view_exams']
  };
  
  if (!role || !permissions[role]) {
    return false;
  }
  
  // Admin has all permissions
  if (role === 'admin' || permissions[role].includes('all')) {
    return true;
  }
  
  return permissions[role].includes(requiredPermission);
};

