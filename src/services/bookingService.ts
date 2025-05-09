
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
  
  // Create a new object for the Firestore update
  const firestoreBookingData: Partial<FirestoreBooking> = {};
  
  // Copy all fields except date (which needs special handling)
  if (updatedBooking.time !== undefined) firestoreBookingData.time = updatedBooking.time;
  if (updatedBooking.name !== undefined) firestoreBookingData.name = updatedBooking.name;
  if (updatedBooking.email !== undefined) firestoreBookingData.email = updatedBooking.email;
  if (updatedBooking.meetingType !== undefined) firestoreBookingData.meetingType = updatedBooking.meetingType;
  if (updatedBooking.notes !== undefined) firestoreBookingData.notes = updatedBooking.notes;
  
  // Handle date conversion separately
  if (updatedBooking.date instanceof Date) {
    firestoreBookingData.date = Timestamp.fromDate(updatedBooking.date);
  }
  
  await updateDoc(bookingRef, firestoreBookingData);
};

export const deleteBooking = async (id: string) => {
  const bookingRef = doc(db, 'bookings', id);
  await deleteDoc(bookingRef);
};
