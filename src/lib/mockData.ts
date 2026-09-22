import { addDays, addMinutes, format, parse, subDays } from 'date-fns';
import { Booking, Expert, Slot } from '../types';

// ---------------------------------------------------------------------------
// Demo-mode data. ExpertSync is currently running without sign-in, so the
// directory, availability, and "My Bookings" ledger are all sourced from
// this in-memory catalogue instead of live Firestore reads. The Firebase
// wiring (src/lib/firebase.ts, firestore.rules) is left in place and can be
// re-connected later without touching the UI components.
// ---------------------------------------------------------------------------

// Approximate coordinates for well-known Omani cities, used to power the
// "experts near me" distance feature.
export const OMAN_CITIES = {
  muscat: { city: 'Muscat', lat: 23.588, lng: 58.3829 },
  salalah: { city: 'Salalah', lat: 17.0151, lng: 54.0924 },
  sohar: { city: 'Sohar', lat: 24.3459, lng: 56.7073 },
  nizwa: { city: 'Nizwa', lat: 22.9333, lng: 57.5333 },
  sur: { city: 'Sur', lat: 22.5667, lng: 59.5289 },
  ibri: { city: 'Ibri', lat: 23.2265, lng: 56.5147 },
  duqm: { city: 'Duqm', lat: 19.6664, lng: 57.705 },
} as const;

export const MOCK_EXPERTS: Expert[] = [
  {
    id: 'exp-software',
    name: 'Dr. Sarah Chen',
    category: 'Software Engineering',
    experience: '12+ Years',
    rating: 4.9,
    bio: 'Senior Architect specializing in distributed systems and Cloud Native technologies.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: OMAN_CITIES.muscat,
  },
  {
    id: 'exp-design',
    name: 'Marcus Thorne',
    category: 'Product Design',
    experience: '8+ Years',
    rating: 4.8,
    bio: 'UX Lead with a focus on accessible design and design systems for scale.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    location: OMAN_CITIES.sohar,
  },
  {
    id: 'exp-data',
    name: 'Aisha Patel',
    category: 'Data Science',
    experience: '6+ Years',
    rating: 4.7,
    bio: 'Expert in Machine Learning and Natural Language Processing. Former AI researcher.',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    location: OMAN_CITIES.nizwa,
  },
  {
    id: 'exp-career',
    name: 'James Wilson',
    category: 'Career Coaching',
    experience: '15+ Years',
    rating: 5.0,
    bio: 'Helping tech professionals navigate leadership transitions and salary negotiations.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    location: OMAN_CITIES.salalah,
  },
  {
    id: 'exp-marketing',
    name: 'Elena Vasquez',
    category: 'Marketing & Growth',
    experience: '9+ Years',
    rating: 4.6,
    bio: 'Growth strategist who has scaled acquisition funnels for a dozen venture-backed startups.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    location: OMAN_CITIES.sur,
  },
  {
    id: 'exp-finance',
    name: 'Omar Al-Balushi',
    category: 'Financial Consulting',
    experience: '14+ Years',
    rating: 4.9,
    bio: 'Chartered financial advisor specializing in SME investment strategy across the GCC.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    location: OMAN_CITIES.muscat,
  },
  {
    id: 'exp-healthcare',
    name: 'Dr. Fatima Al-Zadjali',
    category: 'Healthcare Consulting',
    experience: '11+ Years',
    rating: 4.8,
    bio: 'Clinical operations consultant advising hospitals on patient-flow and digital health adoption.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    location: OMAN_CITIES.ibri,
  },
  {
    id: 'exp-legal',
    name: 'Richard Hale',
    category: 'Legal Advisory',
    experience: '17+ Years',
    rating: 4.7,
    bio: 'Corporate counsel focused on cross-border contracts, IP protection, and regulatory compliance.',
    imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop',
    location: OMAN_CITIES.duqm,
  },
];

export const CATEGORIES = ['All', ...Array.from(new Set(MOCK_EXPERTS.map(e => e.category)))];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

function addHour(time: string) {
  const parsed = parse(time, 'HH:mm', new Date());
  return format(addMinutes(parsed, 60), 'HH:mm');
}

/** Builds a fresh week of availability for every expert, starting today. */
export function generateMockSlots(): Slot[] {
  const slots: Slot[] = [];
  const today = new Date();

  for (const expert of MOCK_EXPERTS) {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const dateStr = format(addDays(today, dayOffset), 'yyyy-MM-dd');
      for (const startTime of TIME_SLOTS) {
        slots.push({
          id: `${expert.id}-${dateStr}-${startTime}`,
          expertId: expert.id,
          date: dateStr,
          startTime,
          endTime: addHour(startTime),
          isBooked: false,
          bookedBy: null,
          bookingId: null,
        });
      }
    }
  }

  return slots;
}

function dateAt(offsetDays: number) {
  return format(offsetDays >= 0 ? addDays(new Date(), offsetDays) : subDays(new Date(), -offsetDays), 'yyyy-MM-dd');
}

/**
 * Pre-recorded sample bookings shown on first load so the ledger and
 * directory look populated. Contact details are placeholder @example.com
 * addresses only — no real user data.
 */
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-software-1',
    expertId: 'exp-software',
    expertName: 'Dr. Sarah Chen',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@example.com',
    userPhone: '+968 9111 2233',
    date: dateAt(2),
    timeSlot: '10:00',
    notes: 'Architecture review for a microservices migration.',
    status: 'Confirmed',
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'bk-design-1',
    expertId: 'exp-design',
    expertName: 'Marcus Thorne',
    userName: 'Priya Nair',
    userEmail: 'priya.nair@example.com',
    userPhone: '+968 9222 3344',
    date: dateAt(6),
    timeSlot: '14:00',
    notes: 'Design system audit ahead of a product relaunch.',
    status: 'Pending',
    createdAt: subDays(new Date(), 2),
  },
  {
    id: 'bk-data-1',
    expertId: 'exp-data',
    expertName: 'Aisha Patel',
    userName: 'Daniel Cooper',
    userEmail: 'daniel.cooper@example.com',
    userPhone: '+968 9333 4455',
    date: dateAt(-4),
    timeSlot: '11:00',
    notes: 'Model evaluation strategy for a recommendation engine.',
    status: 'Completed',
    createdAt: subDays(new Date(), 6),
  },
  {
    id: 'bk-career-1',
    expertId: 'exp-career',
    expertName: 'James Wilson',
    userName: 'Sofia Ramirez',
    userEmail: 'sofia.ramirez@example.com',
    userPhone: '+968 9444 5566',
    date: dateAt(1),
    timeSlot: '09:00',
    notes: 'Preparing for a staff engineer promotion case.',
    status: 'Confirmed',
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'bk-marketing-1',
    expertId: 'exp-marketing',
    expertName: 'Elena Vasquez',
    userName: 'Yousef Al-Harthy',
    userEmail: 'yousef.alharthy@example.com',
    userPhone: '+968 9555 6677',
    date: dateAt(-14),
    timeSlot: '15:00',
    notes: 'Go-to-market plan for a regional product launch.',
    status: 'Completed',
    createdAt: subDays(new Date(), 16),
  },
  {
    id: 'bk-finance-1',
    expertId: 'exp-finance',
    expertName: 'Omar Al-Balushi',
    userName: 'Mariam Al-Siyabi',
    userEmail: 'mariam.alsiyabi@example.com',
    userPhone: '+968 9666 7788',
    date: dateAt(3),
    timeSlot: '11:00',
    notes: 'Investment structuring for a family-owned SME.',
    status: 'Pending',
    createdAt: subDays(new Date(), 1),
  },
  {
    id: 'bk-healthcare-1',
    expertId: 'exp-healthcare',
    expertName: 'Dr. Fatima Al-Zadjali',
    userName: 'Noah Bennett',
    userEmail: 'noah.bennett@example.com',
    userPhone: '+968 9777 8899',
    date: dateAt(5),
    timeSlot: '16:00',
    notes: 'Digital patient-intake rollout planning.',
    status: 'Confirmed',
    createdAt: subDays(new Date(), 3),
  },
  {
    id: 'bk-legal-1',
    expertId: 'exp-legal',
    expertName: 'Richard Hale',
    userName: 'Layla Haddad',
    userEmail: 'layla.haddad@example.com',
    userPhone: '+968 9888 9900',
    date: dateAt(-10),
    timeSlot: '10:00',
    notes: 'Cross-border licensing agreement review.',
    status: 'Completed',
    createdAt: subDays(new Date(), 12),
  },
];

/** Marks the slots that correspond to the pre-recorded bookings above as taken. */
export function applyMockBookings(slots: Slot[], bookings: Booking[]): Slot[] {
  const bookedKey = (expertId: string, date: string, time: string) => `${expertId}__${date}__${time}`;
  const bookedLookup = new Map(
    bookings.map(b => [bookedKey(b.expertId, b.date, b.timeSlot), b] as const)
  );

  return slots.map(slot => {
    const match = bookedLookup.get(bookedKey(slot.expertId, slot.date, slot.startTime));
    if (!match) return slot;
    return { ...slot, isBooked: true, bookedBy: match.userEmail, bookingId: match.id };
  });
}
