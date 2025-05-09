
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const BookingHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">BookSync</h1>
        <Clock className="h-6 w-6 text-primary" />
      </div>
      <p className="text-muted-foreground max-w-md mx-auto">
        Schedule meetings without the back-and-forth. Sync with Google Calendar or Apple Calendar for seamless scheduling.
      </p>
    </div>
  );
};

export default BookingHeader;
