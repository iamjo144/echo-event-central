
import React, { useState, useEffect } from 'react';
import { eventsAPI } from '@/lib/api';
import EventCard from './EventCard';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  rsvpCount: number;
  userRsvp: boolean;
}

interface EventListProps {
  searchParams?: {
    keyword?: string;
    location?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}

const EventList: React.FC<EventListProps> = ({ searchParams }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchParams && Object.keys(searchParams).some(key => !!searchParams[key as keyof typeof searchParams])) {
        response = await eventsAPI.searchEvents(searchParams);
      } else {
        response = await eventsAPI.getEvents();
      }
      
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-muted-foreground">No events found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onRsvpChange={fetchEvents} 
        />
      ))}
    </div>
  );
};

export default EventList;
