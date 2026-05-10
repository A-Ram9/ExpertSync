export type Expert = {
  id: string;
  name: string;
  category: string;
  experience: string;
  rating: number;
  bio: string;
  imageUrl: string;
};

export type Slot = {
  id: string;
  expertId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
  bookedBy?: string | null;
  bookingId?: string | null;
};

export type Booking = {
  id: string;
  expertId: string;
  expertName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: any; // Firestore Timestamp
};
