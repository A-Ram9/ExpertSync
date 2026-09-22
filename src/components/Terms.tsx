import React from 'react';
import { ArrowLeft, ScrollText } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using ExpertSync ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, you must not use the Platform. We may update these terms from time to time; continued use after changes constitutes acceptance of the revised terms.`
  },
  {
    title: '2. The Service',
    body: `ExpertSync provides a directory of independent experts and a booking system for scheduling paid or unpaid consultation sessions. ExpertSync is a facilitator only — we are not a party to, and bear no responsibility for, the substance, advice, or outcome of any consultation between a client and an expert. This deployment currently runs in demo mode: the expert directory and bookings shown are illustrative sample content, not live commercial listings.`
  },
  {
    title: '3. Accounts & Eligibility',
    body: `The Platform is currently open for browsing and booking without requiring an account. You must provide accurate, current information (name, email, phone number) when booking a session. Sign-in may be reintroduced in a future release to enable persistent, private booking history.`
  },
  {
    title: '4. Bookings & Cancellations',
    body: `A booking is confirmed once a slot is successfully reserved through the Platform. Slots are allocated on a first-come, first-served basis and cannot be double-booked. Rescheduling or cancellation policies are set by the individual expert; contact ExpertSync support if you need assistance.`
  },
  {
    title: '5. Location-Based Features',
    body: `If you enable location access, ExpertSync uses your device's coordinates only to sort experts by approximate distance and surface nearby availability across Oman. Location data is used client-side for this session only and is never stored or transmitted to a server.`
  },
  {
    title: '6. Acceptable Use',
    body: `You agree not to: misuse the booking system (e.g. reserving slots without intent to attend), probe or bypass the Platform's security controls, or use the Platform for any unlawful purpose.`
  },
  {
    title: '7. Intellectual Property',
    body: `All content, branding, design, and code on the Platform — excluding expert-submitted profile content — is the exclusive property of ExpertSync and is protected under applicable intellectual property law. You may not copy, reproduce, or redistribute the Platform's software or design without prior written consent.`
  },
  {
    title: '8. Limitation of Liability',
    body: `The Platform is provided "as is" without warranties of any kind. ExpertSync is not liable for any indirect, incidental, or consequential damages arising from your use of the Platform or from any consultation booked through it, to the fullest extent permitted by law.`
  },
  {
    title: '9. Termination',
    body: `We reserve the right to suspend or restrict access to the Platform for any user found to be in violation of these terms, without prior notice.`
  },
  {
    title: '10. Contact',
    body: `Questions about these Terms & Conditions can be directed to the platform administrator via the contact details provided in the project repository.`
  }
];

export function Terms({ onBack }: { onBack: () => void }) {
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
          <ScrollText className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-4xl font-serif text-accent leading-tight">Terms &amp; Conditions</h1>
          <p className="text-text-muted text-xs uppercase tracking-widest font-bold mt-1">Last updated 2026</p>
        </div>
      </div>

      <p className="text-text-secondary italic font-serif text-lg leading-relaxed mt-8 mb-12 border-l-2 border-accent/30 pl-6">
        Please read these Terms & Conditions carefully before using ExpertSync. They govern your access to and use of the Platform.
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
