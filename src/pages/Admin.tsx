import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLogin from '@/components/admin/AdminLogin';

const Admin = () => {
  const { currentUser, isAdmin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // If there's an authenticated admin user, show the dashboard
  if (currentUser && isAdmin) {
    return <AdminDashboard />;
  }
  
  // Otherwise show login screen
  return <AdminLogin error={error} setError={setError} />;
};

export default Admin;
