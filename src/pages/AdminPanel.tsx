
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI } from '@/lib/api';
import { toast } from 'sonner';
import AdminEventCard from '@/components/AdminEventCard';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  createdBy: {
    id: string;
    username: string;
    role: string;
  };
}

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // This would normally use a different admin endpoint, but for now we'll use the search endpoint
      const response = await eventsAPI.searchEvents({ status: activeTab });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin()) {
      toast.error('You do not have permission to access the admin panel');
      navigate('/');
    } else if (!user) {
      navigate('/login');
    } else {
      fetchEvents();
    }
  }, [user, isAdmin, navigate, activeTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage event approvals and view system status
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="pending" onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-[250px] w-full rounded-xl" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">No pending events</h3>
                <p className="text-muted-foreground mt-2">All events have been processed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <AdminEventCard 
                    key={event.id} 
                    event={event} 
                    onStatusChange={fetchEvents} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-[250px] w-full rounded-xl" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">No approved events</h3>
                <p className="text-muted-foreground mt-2">No events have been approved yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <AdminEventCard 
                    key={event.id} 
                    event={event} 
                    onStatusChange={fetchEvents} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-[250px] w-full rounded-xl" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">No rejected events</h3>
                <p className="text-muted-foreground mt-2">No events have been rejected</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <AdminEventCard 
                    key={event.id} 
                    event={event} 
                    onStatusChange={fetchEvents} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
