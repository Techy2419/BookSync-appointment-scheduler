
// This is a service mock for calendar integration
// In a real application, this would connect to Google/Apple Calendar APIs

export type CalendarProvider = 'google' | 'apple';

interface CalendarEvent {
  summary: string;
  description: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: { email: string }[];
}

export interface CalendarService {
  isConnected: boolean;
  provider: CalendarProvider | null;
  connect: (provider: CalendarProvider, authData?: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  createEvent: (event: CalendarEvent) => Promise<string>;
  getAvailableTimes: (date: Date) => Promise<string[]>;
}

class MockCalendarService implements CalendarService {
  isConnected: boolean = false;
  provider: CalendarProvider | null = null;

  async connect(provider: CalendarProvider, authData?: string): Promise<boolean> {
    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.isConnected = true;
    this.provider = provider;
    console.log(`Connected to ${provider} calendar with auth data:`, authData);
    
    return true;
  }

  async disconnect(): Promise<void> {
    // Simulate API disconnection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.isConnected = false;
    this.provider = null;
    
    console.log('Disconnected from calendar');
  }

  async createEvent(event: CalendarEvent): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const eventId = `event_${Date.now()}`;
    console.log('Created calendar event:', { id: eventId, ...event });
    
    return eventId;
  }

  async getAvailableTimes(date: Date): Promise<string[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random available time slots between 9 AM and 5 PM
    const times: string[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Add some time slots, simulating a busy calendar with some availability
      if (Math.random() > 0.6) {
        times.push(`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`);
      }
      if (Math.random() > 0.6) {
        times.push(`${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`);
      }
    }
    
    // Ensure we always have some available times (at least 3)
    if (times.length < 3) {
      times.push('10:00 AM', '1:30 PM', '3:00 PM');
    }
    
    return times.sort();
  }
}

// Create and export a singleton instance
export const calendarService = new MockCalendarService();

export default calendarService;
