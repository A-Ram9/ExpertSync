import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'bookings' | 'terms' | 'privacy') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-dim bg-bg-side/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="space-y-4">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-bg-main shadow-lg shadow-accent/10 transition-transform group-hover:scale-110">
                <span className="font-serif font-black text-lg">E</span>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-accent">ExpertSync</span>
            </button>
            <p className="text-text-secondary text-sm italic font-serif leading-relaxed max-w-xs">
              A premium, real-time consultation booking platform connecting clients with world-class experts.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <Sparkles className="w-3.5 h-3.5 text-accent/60" />
              Live demo &mdash; sample data, no sign-in required
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/60">Navigate</h4>
            <div className="flex flex-col gap-3 text-sm">
              <button onClick={() => onNavigate('home')} className="text-left text-text-secondary hover:text-accent transition-colors w-fit">Experts</button>
              <button onClick={() => onNavigate('bookings')} className="text-left text-text-secondary hover:text-accent transition-colors w-fit">My Bookings</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/60">Legal</h4>
            <div className="flex flex-col gap-3 text-sm">
              <button onClick={() => onNavigate('terms')} className="text-left text-text-secondary hover:text-accent transition-colors w-fit">Terms &amp; Conditions</button>
              <button onClick={() => onNavigate('privacy')} className="text-left text-text-secondary hover:text-accent transition-colors w-fit">Privacy Policy</button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-dim flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            &copy; {year} ExpertSync. All rights reserved.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Made for professionals, by professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
