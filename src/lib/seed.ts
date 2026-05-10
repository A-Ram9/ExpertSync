import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { addDays, format, startOfToday } from 'date-fns';

const EXPERTS = [
  {
    name: "Dr. Sarah Chen",
    category: "Software Engineering",
    experience: "12+ Years",
    rating: 4.9,
    bio: "Senior Architect specializing in distributed systems and Cloud Native technologies.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    name: "Marcus Thorne",
    category: "Product Design",
    experience: "8+ Years",
    rating: 4.8,
    bio: "UX Lead with a focus on accessible design and design systems for scale.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  },
  {
    name: "Aisha Patel",
    category: "Data Science",
    experience: "6+ Years",
    rating: 4.7,
    bio: "Expert in Machine Learning and Natural Language Processing. Former AI researcher.",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop"
  },
  {
    name: "James Wilson",
    category: "Career Coaching",
    experience: "15+ Years",
    rating: 5.0,
    bio: "Helping tech professionals navigate leadership transitions and salary negotiations.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  }
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export async function seedDatabase() {
  try {
    const expertsCol = collection(db, 'experts');
    const existing = await getDocs(expertsCol);
    
    if (!existing.empty) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding experts...');
    for (const expertData of EXPERTS) {
      const expertRef = await addDoc(expertsCol, expertData);
      
      // Seed slots for the next 7 days
      const batch = writeBatch(db);
      const today = startOfToday();
      
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(today, i);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        for (const startTime of TIME_SLOTS) {
          const slotRef = doc(collection(db, 'slots'));
          batch.set(slotRef, {
            expertId: expertRef.id,
            date: dateStr,
            startTime: startTime,
            endTime: startTime, // Simple end time for demo
            isBooked: false,
            bookedBy: null,
            bookingId: null
          });
        }
      }
      await batch.commit();
      console.log(`Seeded expert ${expertData.name} and their slots.`);
    }
    
    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
