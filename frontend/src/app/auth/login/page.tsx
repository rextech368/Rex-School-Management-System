import React from 'react';
import LoginForm from '@/components/forms/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Rex School</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}

