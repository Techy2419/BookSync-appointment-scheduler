
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { Booking, addBooking, updateBooking } from '@/services/bookingService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  mode: 'add' | 'edit';
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  meetingType: z.string().min(1, { message: "Meeting type is required" }),
  notes: z.string().optional(),
  time: z.string().min(1, { message: "Time is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onOpenChange,
  booking,
  mode,
  onSuccess
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(booking?.date || new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: booking?.name || '',
      email: booking?.email || '',
      meetingType: booking?.meetingType || '',
      time: booking?.time || '',
      notes: booking?.notes || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'add') {
        await addBooking({
          ...data,
          date,
        });
        toast({
          title: "Booking added",
          description: "New booking has been successfully created",
        });
      } else {
        if (!booking?.id) throw new Error("Booking ID is missing");
        
        await updateBooking(booking.id, {
          ...data,
          date,
        });
        toast({
          title: "Booking updated",
          description: "The booking has been successfully updated",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving booking:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode === 'add' ? 'create' : 'update'} the booking`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Booking' : 'Edit Booking'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Create a new booking by filling out the details below.'
              : 'Update the booking details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="meetingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="p-3 pointer-events-auto"
                      />
                    </div>
                    {!date && (
                      <p className="text-sm font-medium text-destructive">Please select a date</p>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10:00 AM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? 'Saving...' 
                  : mode === 'add' ? 'Add Booking' : 'Update Booking'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
