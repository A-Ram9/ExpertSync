import React, { useMemo, useState } from 'react';
import { Slot } from '../types';
import { ArrowLeft, Clock, Calendar as CalendarIcon, Star, Briefcase, MapPin, CheckCircle2, AlertCircle, Loader2, SearchX } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, parseISO, isAfter, startOfToday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { MOCK_EXPERTS } from '../lib/mockData';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface ExpertDetailProps {
  expertId: string;
  slots: Slot[];
  onBook: (slot: Slot, data: BookingFormData) => void;
  onBack: () => void;
  onBookingSuccess: () => void;
}

export function ExpertDetail({ expertId, slots, onBook, onBack, onBookingSuccess }: ExpertDetailProps) {
  const expert = useMemo(() => MOCK_EXPERTS.find(e => e.id === expertId) ?? null, [expertId]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const upcomingSlots = useMemo(() => {
    const today = startOfToday();
    return slots
      .filter(s => s.expertId === expertId)
      .filter(s => {
        const slotDate = parseISO(s.date);
        return isAfter(slotDate, today) || s.date === format(today, 'yyyy-MM-dd');
      });
  }, [slots, expertId]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!agreedToTerms) {
      toast.error("Please accept the Terms & Conditions to continue");
      return;
    }

    setIsBooking(true);
    // Simulated latency so the confirmation flow still feels real in demo mode.
    setTimeout(() => {
      onBook(selectedSlot, bookingFormData);
      setIsBooking(false);
      toast.success('Session booked successfully!');
      onBookingSuccess();
    }, 500);
  };

  if (!expert) {
    return (
      <div className="py-32 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-bg-card border border-border-dim rounded-full mb-6">
          <SearchX className="w-10 h-10 text-text-muted" />
        </div>
        <h3 className="text-2xl font-serif text-text-primary mb-2">Expert not found</h3>
        <p className="text-text-secondary text-sm italic mb-8">This profile may have been removed or the link is incorrect.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-accent text-bg-main px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg shadow-accent/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to directory
        </button>
      </div>
    );
  }

  // Group slots by date
  const groupedSlots: { [key: string]: Slot[] } = {};
  upcomingSlots.forEach(slot => {
    if (!groupedSlots[slot.date]) {
      groupedSlots[slot.date] = [];
    }
    groupedSlots[slot.date].push(slot);
  });

  const dates = Object.keys(groupedSlots).sort();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-20">
      {/* Left Column: Expert Info */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-accent transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to directory
        </button>

        <div className="bg-bg-side rounded-[2.5rem] border border-border-dim overflow-hidden shadow-2xl">
          <div className="aspect-[4/5] relative">
            <img src={expert.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={expert.name} />
            <div className="absolute top-6 left-6 flex gap-2">
               <span className="bg-accent text-bg-main px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                 {expert.category}
               </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-side to-transparent" />
          </div>
          <div className="p-10 -mt-10 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-serif text-text-primary leading-none">{expert.name}</h2>
              <div className="flex items-center gap-1.5 text-accent">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-xl font-bold">{expert.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border-dim rounded-full text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                <Briefcase className="w-3.5 h-3.5 text-accent" />
                {expert.experience}
              </div>
              {expert.location && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border-dim rounded-full text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {expert.location.city}, Oman
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-accent/30" />
              <p className="text-text-secondary leading-relaxed italic font-serif text-lg pl-2">
                "{expert.bio}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Slots & Booking */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-10">
        <div className="bg-bg-card rounded-[2.5rem] border border-border-dim p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent ring-1 ring-accent/20">
                <CalendarIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-text-primary">Available Slots</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted mt-1 underline decoration-accent/30 underline-offset-4">Live updates enabled</p>
              </div>
            </div>
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-accent text-right">
              Verified<br/>Direct Access
            </span>
          </div>

          <div className="space-y-12">
            {dates.map(date => (
              <div key={date}>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/60 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-accent/20" />
                  {format(parseISO(date), 'EEEE, MMMM do')}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupedSlots[date].map(slot => (
                    <button
                      key={slot.id}
                      disabled={slot.isBooked}
                      onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                      className={cn(
                        "relative flex items-center justify-center p-5 rounded-2xl border transition-all duration-300 group overflow-hidden",
                        slot.isBooked
                          ? "bg-bg-main/30 border-border-dim opacity-30 cursor-not-allowed line-through"
                          : selectedSlot?.id === slot.id
                            ? "bg-accent border-accent text-bg-main shadow-2xl shadow-accent/20 scale-[1.05]"
                            : "bg-bg-side border-border-dim text-text-primary hover:border-accent/40 hover:bg-accent/5"
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Clock className={cn("w-4 h-4 mb-1 transition-colors", selectedSlot?.id === slot.id ? "text-bg-main" : "text-text-muted group-hover:text-accent")} />
                        <span className="text-sm font-black tracking-widest">{slot.startTime}</span>
                      </div>
                      {slot.isBooked && (
                        <div className="absolute top-2 right-2">
                          <AlertCircle className="w-3 h-3 text-text-muted" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-side text-text-primary rounded-[2.5rem] p-10 border border-accent/30 shadow-[0_35px_60px_-15px_rgba(197,160,89,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-border-dim">
                  <div>
                    <h3 className="text-3xl font-serif text-accent">Confirm Session</h3>
                    <p className="text-text-secondary text-sm mt-1 uppercase tracking-widest font-bold">
                      {format(parseISO(selectedSlot.date), 'MMM do')} &bull; {selectedSlot.startTime}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-border-dim text-text-muted hover:text-accent hover:border-accent transition-all"
                    aria-label="Cancel selection"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                      className="w-full bg-bg-main border border-border-dim rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-all placeholder:text-text-muted text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted ml-1">Email</label>
                    <input
                      required
                      type="email"
                      value={bookingFormData.email}
                      onChange={(e) => setBookingFormData({...bookingFormData, email: e.target.value})}
                      className="w-full bg-bg-main border border-border-dim rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-all placeholder:text-text-muted text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted ml-1">Contact No.</label>
                    <input
                      required
                      type="tel"
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                      className="w-full bg-bg-main border border-border-dim rounded-xl px-5 py-4 focus:outline-none focus:border-accent transition-all placeholder:text-text-muted text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted ml-1">Brief Consultation Notes</label>
                    <textarea
                      rows={3}
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({...bookingFormData, notes: e.target.value})}
                      placeholder="Agenda, goals, or specific questions for the expert..."
                      className="w-full bg-bg-main border border-border-dim rounded-2xl px-5 py-4 focus:outline-none focus:border-accent transition-all resize-none placeholder:text-text-muted text-sm font-medium"
                    />
                  </div>

                  <label className="md:col-span-2 flex items-start gap-3 bg-bg-main/50 border border-border-dim rounded-xl px-5 py-4 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-accent shrink-0"
                    />
                    <span className="text-xs text-text-secondary leading-relaxed">
                      I agree to the ExpertSync{' '}
                      <span className="text-accent font-bold">Terms &amp; Conditions</span> and{' '}
                      <span className="text-accent font-bold">Privacy Policy</span>, and confirm the details above are accurate.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isBooking || !agreedToTerms}
                    className="md:col-span-2 bg-accent text-bg-main font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-accent/20 uppercase tracking-[0.3em] text-xs"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Finalizing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
