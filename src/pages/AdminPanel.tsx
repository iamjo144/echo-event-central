
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboard from '@/components/AdminDashboard';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for dashboard
  const stats = {
    totalEvents: 135,
    upcomingEvents: 12,
    registeredUsers: 2508
  };
  
  const events = [
    {
      id: '1',
      title: 'Science Fair',
      date: 'May 5, 2024',
      location: 'Building A',
      attendees: 150,
      status: 'Published'
    },
    {
      id: '2',
      title: 'Music Festival',
      date: 'April 20, 2024',
      location: 'Outdoor Stage',
      attendees: 500,
      status: 'Published'
    },
    {
      id: '3',
      title: 'Tech Conference',
      date: 'April 15, 2024',
      location: 'Convention Center',
      attendees: 300,
      status: 'Published'
    },
    {
      id: '4',
      title: 'Art Exhibition',
      date: 'March 30, 2024',
      location: 'Art Gallery',
      attendees: 200,
      status: 'Canceled'
    },
    {
      id: '5',
      title: 'Career Fair',
      date: 'March 10, 2024',
      location: 'Student Union',
      attendees: 180,
      status: 'Published'
    }
  ];

  useEffect(() => {
    // Check if the user is an admin
    if (!user) {
      navigate('/login');
      toast.error('You must be logged in to access the admin panel');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      toast.error('You do not have permission to access the admin panel');
      return;
    }

    setIsLoading(false);
  }, [user, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <AdminDashboard stats={stats} events={events} />
      </main>
    </div>
  );
};

export default AdminPanel;
