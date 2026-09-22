import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `ExpertSync currently runs in demo mode and does not require sign-in. When you submit a booking, we collect the name, email, phone number, and consultation notes you type into the form. If you enable location access, your device's coordinates are also read (see Section 5).`
  },
  {
    title: '2. How We Use Your Information',
    body: `Booking details you submit are used only to populate the sample "My Bookings" ledger for this demo session and are not persisted to a server or shared with the listed experts. We do not sell your data or use it for advertising.`
  },
  {
    title: '3. Who Can See Your Data',
    body: `Because this deployment is a public showcase, the sample booking ledger (including the illustrative bookings pre-loaded for demonstration) is visible to anyone browsing the site. Do not submit real personal or sensitive information through the demo booking form.`
  },
  {
    title: '4. Data Storage & Security',
    body: `Demo bookings exist only in your browser's memory for the current session and are cleared on refresh — nothing is written to a database. The codebase includes a Firebase/Firestore integration with owner-only security rules for a future production deployment, but it is not active in this demo.`
  },
  {
    title: '5. Location Data',
    body: `The "Find experts near me" feature requests your browser's geolocation permission. If granted, your coordinates are used entirely on your device to sort experts by approximate distance to their listed city in Oman. Location data is never transmitted to, or stored on, a server, and you can revoke permission at any time through your browser settings.`
  },
  {
    title: '6. Third-Party Services',
    body: `Expert photographs are served from Unsplash. No analytics, advertising, or tracking scripts are embedded in this demo.`
  },
  {
    title: '7. Your Rights',
    body: `Since no account or persistent profile is created in demo mode, there is no stored personal data to access or delete beyond your current browser session — simply refresh the page to clear it.`
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy periodically, including when authentication and persistent storage are reintroduced. Material changes will be reflected here with an updated revision note.`
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
