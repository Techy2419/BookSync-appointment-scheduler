
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toaster';
import { CalendarPlus } from 'lucide-react';

interface CalendarSyncProps {
  onSyncWithGoogle: (authCode?: string) => Promise<void>;
  onSyncWithApple: (calendarUrl: string) => Promise<void>;
}

const CalendarSync: React.FC<CalendarSyncProps> = ({ onSyncWithGoogle, onSyncWithApple }) => {
  const { toast } = useToast();
  const [appleCalendarUrl, setAppleCalendarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await onSyncWithGoogle();
      toast({
        title: "Connected to Google Calendar",
        description: "Your bookings will now sync with Google Calendar.",
      });
    } catch (error) {
      toast({
        title: "Failed to connect",
        description: "Could not connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleCalendarSync = async () => {
    setIsLoading(true);
    try {
      await onSyncWithApple(appleCalendarUrl);
      toast({
        title: "Connected to Apple Calendar",
        description: "Your bookings will now sync with Apple Calendar.",
      });
      setAppleCalendarUrl('');
    } catch (error) {
      toast({
        title: "Failed to connect",
        description: "Could not connect to Apple Calendar. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CalendarPlus className="h-5 w-5 text-primary" />
          <CardTitle>Calendar Integration</CardTitle>
        </div>
        <CardDescription>
          Connect your calendar to keep your schedule in sync
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google Calendar</TabsTrigger>
            <TabsTrigger value="apple">Apple Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="google" className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Connect with Google Calendar to automatically sync your bookings and check for availability.
            </p>
            <Button onClick={handleGoogleAuth} disabled={isLoading} className="w-full">
              {isLoading ? 'Connecting...' : 'Connect with Google Calendar'}
            </Button>
          </TabsContent>
          <TabsContent value="apple" className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Apple Calendar URL to sync your bookings with Apple Calendar.
            </p>
            <div className="space-y-4">
              <Input 
                placeholder="https://calendar.apple.com/..."
                value={appleCalendarUrl}
                onChange={(e) => setAppleCalendarUrl(e.target.value)}
              />
              <Button 
                onClick={handleAppleCalendarSync} 
                disabled={isLoading || !appleCalendarUrl} 
                className="w-full"
              >
                {isLoading ? 'Connecting...' : 'Connect with Apple Calendar'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground text-center">
          Your calendar will only be accessed for checking availability and adding bookings.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CalendarSync;
