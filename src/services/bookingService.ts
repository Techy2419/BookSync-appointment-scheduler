
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Booking {
  id?: string;
  date: Date;
  time: string;
  name: string;
  email: string;
  meetingType: string;
  notes?: string;
  createdAt: Date;
}

export const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
  const bookingWithTimestamp = {
    ...booking,
    date: Timestamp.fromDate(booking.date),
    createdAt: Timestamp.fromDate(new Date())
  };
  
  const docRef = await addDoc(collection(db, 'bookings'), bookingWithTimestamp);
  return docRef.id;
};

export const getBookings = async () => {
  const bookingsCollection = collection(db, 'bookings');
  const bookingsSnapshot = await getDocs(bookingsCollection);
  
  return bookingsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      date: data.date.toDate(),
      time: data.time,
      name: data.name,
      email: data.email,
      meetingType: data.meetingType,
      notes: data.notes,
      createdAt: data.createdAt.toDate()
    } as Booking;
  });
};

export const updateBooking = async (id: string, updatedBooking: Partial<Booking>) => {
  const bookingRef = doc(db, 'bookings', id);
  
  // Convert Date to Timestamp for Firebase
  const bookingData = { ...updatedBooking };
  
  // Check if date exists before converting to Timestamp
  if (bookingData.date instanceof Date) {
    bookingData.date = Timestamp.fromDate(bookingData.date);
  }
  
  await updateDoc(bookingRef, bookingData);
};

export const deleteBooking = async (id: string) => {
  const bookingRef = doc(db, 'bookings', id);
  await deleteDoc(bookingRef);
};
