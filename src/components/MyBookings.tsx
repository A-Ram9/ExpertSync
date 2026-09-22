import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Booking } from '../types';
import { Calendar, Clock, CheckCircle2, CircleDashed, CheckCircle, Loader2, User, LogIn, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function MyBookings({ user, onSignIn }: { user: any; onSignIn: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setBookings([]);
      return;
    }

    setLoading(true);
    // Firestore security rules only permit a signed-in user to read their
    // own bookings (matched by their verified auth email), so this can
    // never surface another person's data.
    const q = query(
      collection(db, 'bookings'),
      where('userEmail', '==', user.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        toast.error('Unable to load your bookings right now.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getStatusDisplay = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return { icon: <CircleDashed className="w-3 h-3" />, color: "bg-amber-400/10 text-amber-400 border-amber-400/20" };
      case 'Confirmed':
        return { icon: <CheckCircle2 className="w-3 h-3" />, color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" };
      case 'Completed':
        return { icon: <CheckCircle className="w-3 h-3" />, color: "bg-blue-400/10 text-blue-400 border-blue-400/20" };
      default:
        return { icon: <CircleDashed className="w-3 h-3" />, color: "bg-white/5 text-text-muted border-border-dim" };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border-dim">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-accent leading-tight">My Ledger</h1>
          <p className="text-text-secondary text-sm italic font-serif">A comprehensive record of your professional consultations.</p>
        </div>

        {user && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent/70 px-4 py-2 border border-accent/20 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified for {user.email}
          </div>
        )}
      </div>

      {!user ? (
        <div className="py-32 text-center bg-bg-card rounded-[3rem] border border-dashed border-border-dim">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 rounded-full mb-6">
            <ShieldCheck className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-2xl font-serif text-text-primary mb-2">Access Your Records</h3>
          <p className="text-text-secondary text-sm italic mb-8">Sign in to securely retrieve your consultation ledger. For your privacy, bookings are only ever visible to their owner.</p>
          <button
            onClick={onSignIn}
            className="inline-flex items-center gap-2 bg-accent text-bg-main px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl shadow-accent/10"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </div>
      ) : loading ? (
        <div className="py-32 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
        </div>
      ) : (
        bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking, i) => {
              const status = getStatusDisplay(booking.status);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={booking.id}
                  className="bg-bg-card border border-border-dim rounded-[2rem] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-bg-side rounded-2xl flex items-center justify-center text-accent/40 border border-border-dim group-hover:border-accent/20 transition-colors">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-text-primary mb-2 group-hover:text-accent transition-colors">{booking.expertName}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-text-muted">
                          <Calendar className="w-3.5 h-3.5 text-accent/60" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-text-muted">
                          <Clock className="w-3.5 h-3.5 text-accent/60" />
                          <span>{booking.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-auto w-full pt-6 sm:pt-0 border-t sm:border-0 border-border-dim">
                    <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm", status.color)}>
                      {status.icon}
                      {booking.status}
                    </div>
                    
                    {booking.status === 'Confirmed' && (
                       <button className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:underline underline-offset-[6px] decoration-accent decoration-2 transition-all">
                         Secure Access
                       </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center bg-bg-card rounded-[3rem] border border-dashed border-border-dim">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 rounded-full mb-6">
              <Calendar className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-2xl font-serif text-text-primary mb-2">No archive found</h3>
            <p className="text-text-secondary text-sm italic">You currently have no recorded sessions associated with this identity.</p>
          </div>
        )
      )}
    </div>
  );
}
