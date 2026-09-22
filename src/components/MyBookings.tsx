import React, { useMemo, useState } from 'react';
import { Booking } from '../types';
import { Calendar, Clock, CheckCircle2, CircleDashed, CheckCircle, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { CATEGORIES, MOCK_EXPERTS } from '../lib/mockData';

export function MyBookings({ bookings }: { bookings: Booking[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categoryByExpertId = useMemo(
    () => new Map(MOCK_EXPERTS.map(e => [e.id, e.category] as const)),
    []
  );

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [bookings]
  );

  const filteredBookings = sortedBookings.filter(
    b => selectedCategory === 'All' || categoryByExpertId.get(b.expertId) === selectedCategory
  );

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
          <p className="text-text-secondary text-sm italic font-serif">Sample consultations across every practice area on ExpertSync.</p>
        </div>

        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-accent text-bg-main border-accent shadow-lg shadow-accent/20"
                  : "bg-bg-card text-text-muted border-border-dim hover:border-accent/40 hover:text-text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking, i) => {
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
                    <h3 className="text-2xl font-serif text-text-primary mb-1 group-hover:text-accent transition-colors">{booking.expertName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-accent/60 mb-2">
                      {categoryByExpertId.get(booking.expertId) ?? 'Consultation'}
                    </p>
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
          <p className="text-text-secondary text-sm italic">No sessions recorded in this category yet.</p>
        </div>
      )}
    </div>
  );
}
