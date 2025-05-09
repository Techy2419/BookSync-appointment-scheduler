
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

// Interface for Firebase document structure (using Timestamp instead of Date)
interface FirestoreBooking {
  date: Timestamp;
  time: string;
  name: string;
  email: string;
  meetingType: string;
  notes?: string;
  createdAt: Timestamp;
}

export const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
  // Convert Date to Timestamp for Firebase
  const bookingWithTimestamp: Omit<FirestoreBooking, 'id'> = {
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
  
  // Convert Date to Timestamp for Firebase if it exists
  const bookingData: Partial<FirestoreBooking> = { ...updatedBooking };
  
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
