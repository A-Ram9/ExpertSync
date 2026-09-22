import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `When you sign in, we receive your name, email address, and profile photo from Google Authentication. When you book a session, we additionally collect the phone number and consultation notes you provide.`
  },
  {
    title: '2. How We Use Your Information',
    body: `Your information is used solely to operate the booking system: creating and displaying your bookings, preventing double-booking of slots, and letting the expert you booked with prepare for your session. We do not sell your data or use it for advertising.`
  },
  {
    title: '3. Who Can See Your Data',
    body: `Your booking records are private by default. Our security rules restrict read access to your own account — no other user, including other clients, can view your bookings, phone number, or notes. Only you and the platform administrator can access this data.`
  },
  {
    title: '4. Data Storage & Security',
    body: `Data is stored in Google Firebase (Firestore) with server-side security rules enforcing per-user access control. All connections are encrypted in transit. Booking creation and slot updates are validated server-side to prevent tampering or impersonation.`
  },
  {
    title: '5. Data Retention',
    body: `We retain booking records for as long as your account is active or as needed to provide the service. You may request deletion of your data by contacting the platform administrator.`
  },
  {
    title: '6. Third-Party Services',
    body: `We use Google Authentication for sign-in and Google Firebase for data storage. These providers process data under their own privacy policies, in addition to this one.`
  },
  {
    title: '7. Your Rights',
    body: `You have the right to access, correct, or request deletion of your personal data at any time. Because bookings are tied to your authenticated email, you can always view your full booking history from the "My Bookings" page.`
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy periodically. Material changes will be reflected here with an updated revision note.`
  }
];

export function Privacy({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-accent transition-colors mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return
      </button>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent ring-1 ring-accent/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-4xl font-serif text-accent leading-tight">Privacy Policy</h1>
          <p className="text-text-muted text-xs uppercase tracking-widest font-bold mt-1">Last updated 2026</p>
        </div>
      </div>

      <p className="text-text-secondary italic font-serif text-lg leading-relaxed mt-8 mb-12 border-l-2 border-accent/30 pl-6">
        Your privacy matters to us. This policy explains what we collect, how it's used, and — most importantly — who can see it.
      </p>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-bg-card border border-border-dim rounded-3xl p-8">
            <h2 className="text-xl font-serif text-text-primary mb-3">{section.title}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
