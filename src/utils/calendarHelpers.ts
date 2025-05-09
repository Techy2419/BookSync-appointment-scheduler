
import { format, addMinutes, parseISO } from 'date-fns';

/**
 * Combines a date and time string into a Date object
 */
export function combineDateAndTime(date: Date, timeString: string): Date {
  const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  
  if (!timeParts) {
    throw new Error('Invalid time format');
  }
  
  let hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);
  const period = timeParts[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Create a new date object with the combined date and time
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  
  return result;
}

/**
 * Generates an .ics file content for calendar downloads
 */
export function generateIcsFile(
  summary: string,
  description: string,
  startDateTime: Date,
  durationMinutes: number,
  location: string = ''
): string {
  const endDateTime = addMinutes(startDateTime, durationMinutes);
  
  // Format dates according to iCalendar spec
  const formatIcsDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  };
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BookSync//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${summary}`,
    `DTSTART:${formatIcsDate(startDateTime)}`,
    `DTEND:${formatIcsDate(endDateTime)}`,
    `DESCRIPTION:${description?.replace(/\n/g, '\\n') || ''}`,
    `LOCATION:${location || ''}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `UID:${Math.random().toString(36).substring(2)}@booksync.com`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  
  return icsContent;
}

/**
 * Downloads an ICS file
 */
export function downloadIcsFile(icsContent: string, filename: string = 'meeting.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates a Google Calendar event URL
 */
export function createGoogleCalendarUrl(
  title: string,
  description: string,
  startDateTime: Date,
  endDateTime: Date,
  location: string = ''
): string {
  const formatGoogleDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`,
    details: description || '',
    location: location || '',
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Creates an Apple Calendar event URL (actually generates and downloads an ICS file)
 */
export function addToAppleCalendar(
  title: string,
  description: string,
  startDateTime: Date,
  durationMinutes: number,
  location: string = ''
): void {
  const icsContent = generateIcsFile(
    title, 
    description, 
    startDateTime, 
    durationMinutes, 
    location
  );
  
  downloadIcsFile(icsContent, 'apple-calendar-event.ics');
}
