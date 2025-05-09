
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Mail, MessageSquare } from 'lucide-react';
import { MeetingType } from './MeetingTypeSelector';

interface BookingConfirmationProps {
  booking: {
    name: string;
    email: string;
    notes?: string;
    date: Date;
    time: string;
    meetingType: MeetingType;
  };
  onClose: () => void;
  onAddToCalendar: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onClose,
  onAddToCalendar
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="bg-primary/10 border-b">
        <CardTitle className="text-center text-2xl">Booking Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{booking.meetingType.name}</h3>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{booking.meetingType.duration} minutes</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 border-t border-b py-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{format(booking.date, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <p className="font-medium">{booking.time}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <p>{booking.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p>{booking.email}</p>
          </div>
          {booking.notes && (
            <div className="flex space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              <p className="text-sm">{booking.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={onAddToCalendar} variant="outline" className="w-full">
          Add to Calendar
        </Button>
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
