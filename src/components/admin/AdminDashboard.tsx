
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Booking, getBookings, deleteBooking } from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import BookingDialog from './BookingDialog';
import { CalendarPlus, Edit, Trash2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const fetchedBookings = await getBookings();
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setDialogMode('add');
    setIsDialogOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteBooking = async (id?: string) => {
    if (!id) return;

    try {
      await deleteBooking(id);
      setBookings(bookings.filter(booking => booking.id !== id));
      toast({
        title: "Booking deleted",
        description: "The booking has been successfully removed",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete the booking",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleBookingUpdated = () => {
    fetchBookings();
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Bookings</CardTitle>
              <CardDescription>Add, edit or delete booking dates</CardDescription>
            </div>
            <Button onClick={handleAddBooking}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Booking
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found. Create your first booking by clicking "Add Booking".
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Meeting Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{format(booking.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.meetingType}</TableCell>
                    <TableCell>{format(booking.createdAt, 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEditBooking(booking)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BookingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        booking={selectedBooking}
        mode={dialogMode}
        onSuccess={handleBookingUpdated}
      />
    </div>
  );
};

export default AdminDashboard;
