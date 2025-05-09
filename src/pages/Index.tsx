
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import BookingHeader from '@/components/BookingHeader';
import MeetingTypeSelector, { MeetingType } from '@/components/MeetingTypeSelector';
import DateTimeSelector from '@/components/DateTimeSelector';
import BookingForm from '@/components/BookingForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import CalendarSync from '@/components/CalendarSync';
import calendarService, { CalendarProvider } from '@/services/calendarService';
import { combineDateAndTime, downloadIcsFile, generateIcsFile, createGoogleCalendarUrl } from '@/utils/calendarHelpers';

const MEETING_TYPES: MeetingType[] = [
  {
    id: '1',
    name: 'Quick Chat',
    duration: 15,
    description: 'A short 15-minute meeting to discuss quick topics or answer questions.'
  },
  {
    id: '2',
    name: 'Standard Meeting',
    duration: 30,
    description: 'A standard 30-minute meeting for regular discussions or check-ins.'
  },
  {
    id: '3',
    name: 'In-depth Discussion',
    duration: 60,
    description: 'A comprehensive 60-minute meeting for detailed discussions or planning.'
  },
  {
    id: '4',
    name: 'Project Review',
    duration: 45,
    description: 'A 45-minute meeting to review project progress and next steps.'
  }
];

interface BookingDetails {
  name: string;
  email: string;
  notes?: string;
  date: Date;
  time: string;
  meetingType: MeetingType;
}

const Index = () => {
  const { toast } = useToast();
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  
  // Load available times when date is selected
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDate) return;
      
      try {
        const times = await calendarService.getAvailableTimes(selectedDate);
        setAvailableTimes(times);
        
        // Reset selected time if previously selected
        setSelectedTime(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load available times. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchAvailableTimes();
  }, [selectedDate, toast]);
  
  // Handle meeting type selection
  const handleSelectMeetingType = (id: string) => {
    setSelectedMeetingType(id);
  };
  
  // Handle form submission
  const handleBookingFormSubmit = async (values: { name: string; email: string; notes?: string }) => {
    if (!selectedMeetingType || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a meeting type, date, and time.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const meetingType = MEETING_TYPES.find(type => type.id === selectedMeetingType);
      
      if (!meetingType) {
        throw new Error("Selected meeting type not found");
      }
      
      // Create booking details
      const details: BookingDetails = {
        ...values,
        date: selectedDate,
        time: selectedTime,
        meetingType,
      };
      
      // If calendar is connected, add to calendar
      if (isCalendarConnected) {
        const startDateTime = combineDateAndTime(selectedDate, selectedTime);
        
        await calendarService.createEvent({
          summary: `Meeting: ${meetingType.name}`,
          description: values.notes || `Meeting with ${values.name} (${values.email})`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: new Date(startDateTime.getTime() + meetingType.duration * 60000).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          attendees: [{ email: values.email }],
        });
      }
      
      // Set booking details for confirmation
      setBookingDetails(details);
      setBookingConfirmed(true);
      
      // Success notification
      toast({
        title: "Booking Confirmed",
        description: "Your meeting has been scheduled successfully!",
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error scheduling your meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Google Calendar sync
  const handleSyncWithGoogle = async (authCode?: string) => {
    try {
      const success = await calendarService.connect('google', authCode);
      setIsCalendarConnected(success);
      return Promise.resolve();
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      return Promise.reject(error);
    }
  };
  
  // Handle Apple Calendar sync
  const handleSyncWithApple = async (calendarUrl: string) => {
    try {
      const success = await calendarService.connect('apple', calendarUrl);
      setIsCalendarConnected(success);
      return Promise.resolve();
    } catch (error) {
      console.error('Apple Calendar sync error:', error);
      return Promise.reject(error);
    }
  };
  
  // Handle "Add to Calendar" button on confirmation
  const handleAddToCalendar = () => {
    if (!bookingDetails) return;
    
    const startDateTime = combineDateAndTime(bookingDetails.date, bookingDetails.time);
    const endDateTime = new Date(startDateTime.getTime() + bookingDetails.meetingType.duration * 60000);
    
    if (calendarService.provider === 'google') {
      // Open Google Calendar in a new tab
      const googleUrl = createGoogleCalendarUrl(
        `Meeting: ${bookingDetails.meetingType.name}`,
        bookingDetails.notes || `Meeting with ${bookingDetails.name}`,
        startDateTime,
        endDateTime
      );
      window.open(googleUrl, '_blank');
    } else {
      // Generate and download ICS file for Apple Calendar or if no calendar is connected
      const icsContent = generateIcsFile(
        `Meeting: ${bookingDetails.meetingType.name}`,
        bookingDetails.notes || `Meeting with ${bookingDetails.name}`,
        startDateTime,
        bookingDetails.meetingType.duration
      );
      downloadIcsFile(icsContent);
    }
  };
  
  // Reset form after confirmation is closed
  const handleCloseConfirmation = () => {
    setBookingConfirmed(false);
    setSelectedMeetingType(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setBookingDetails(null);
  };

  return (
    <div className="container max-w-4xl py-8 px-4 sm:px-6">
      <BookingHeader />
      
      <Separator className="my-6" />
      
      {bookingConfirmed && bookingDetails ? (
        <BookingConfirmation 
          booking={bookingDetails} 
          onClose={handleCloseConfirmation}
          onAddToCalendar={handleAddToCalendar}
        />
      ) : (
        <>
          <CalendarSync 
            onSyncWithGoogle={handleSyncWithGoogle}
            onSyncWithApple={handleSyncWithApple}
          />
          
          <MeetingTypeSelector 
            meetingTypes={MEETING_TYPES} 
            selectedMeetingType={selectedMeetingType}
            onSelectMeetingType={handleSelectMeetingType}
          />
          
          {selectedMeetingType && (
            <>
              <DateTimeSelector 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                availableTimes={availableTimes}
              />
              
              {selectedDate && selectedTime && (
                <BookingForm 
                  onSubmit={handleBookingFormSubmit}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
