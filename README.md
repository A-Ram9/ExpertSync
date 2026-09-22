# ExpertSync

ExpertSync is a premium consultation booking platform designed to bridge the gap between industry experts and clients. **This deployment currently runs in Live Demo mode** — open to browse and book without an account, pre-loaded with sample data so it looks and feels like a real platform out of the box.

## Features

- **Open Access**: No sign-in required — anyone can browse the directory and place a sample booking immediately.
- **Pre-Loaded Sample Ledger**: The "My Bookings" page ships with realistic sample bookings across every industry on the platform, filterable by category, so it never looks empty.
- **Expanded Industry Directory**: Eight practice areas — Software Engineering, Product Design, Data Science, Career Coaching, Marketing & Growth, Financial Consulting, Healthcare Consulting, and Legal Advisory.
- **Location-Aware Discovery**: An opt-in "Find experts near me" feature uses your browser's geolocation to sort experts by approximate distance to their city in Oman, previewing what location-based matching for future bookings could look like.
- **Live Availability**: Booking a slot instantly marks it unavailable and appends to the ledger for the session.
- **Responsive Design**: A fully responsive UI — including a dedicated mobile navigation menu — that looks great from mobile to ultra-wide desktops.
- **Resilient UI**: A top-level error boundary and themed empty/error/loading states keep the experience graceful when something goes wrong.
- **Legal & Compliance**: Built-in Terms & Conditions and Privacy Policy pages, linked from every page footer and required reading before a booking is confirmed.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Data (demo mode)**: In-memory mock catalogue (`src/lib/mockData.ts`) — no backend required to run
- **Data (dormant, for future use)**: Firebase (Firestore, Auth) — see [Re-enabling Firebase](#re-enabling-firebase) below
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/A-Ram9/ExpertSync.git
   cd ExpertSync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (no environment variables or Firebase project needed for demo mode):
   ```bash
   npm run dev
   ```

## Development

The project uses a custom server-side setup for optimized performance and API routing.

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production (output is code-split into `vendor`/app chunks for faster loads).
- `npm run preview`: Serves the production build locally.
- `npm run lint`: Runs TypeScript type checks across the whole project.
- `npm run clean`: Removes the `dist/` build output.

## Demo Mode

The directory, availability, and bookings you see are sourced from `src/lib/mockData.ts`, not a live database:

- Booking a slot updates in-memory state only — it resets on page refresh and is never sent to a server.
- Sample booking contact details use `@example.com` addresses; no real personal data is stored anywhere in the repo.
- Geolocation (used by "Find experts near me") is read client-side only, to compute distance to each expert's listed Omani city, and is never transmitted anywhere — see the [Privacy Policy](src/components/Privacy.tsx).

### Re-enabling Firebase

A complete Firebase Auth + Firestore integration is included but dormant, ready for a real deployment:

- `src/lib/firebase.ts` — Firebase app/auth/Firestore initialization.
- `firestore.rules` — owner-only, anti-impersonation security rules for the `experts`, `slots`, and `bookings` collections (see comments in the file for what each rule enforces).
- `src/lib/seed.ts` — seeds a fresh Firestore project with the same starter experts and slots as the mock catalogue.

To go live: fill in `.env` from `.env.example`, deploy `firestore.rules` (`firebase deploy --only firestore:rules`), and swap the mock-data reads in `ExpertList`/`ExpertDetail`/`MyBookings`/`App` for the Firestore-backed calls those files used before demo mode (see git history for the previous implementation).

## Security

Even in demo mode:

- No secrets, real user data, or write access to any backend exist in this build — there is nothing to leak.
- Run `npm audit` periodically and apply `npm audit fix` to keep dependencies patched.
- If Firebase is reconnected, the rules in `firestore.rules` restrict all booking reads/writes to the authenticated owner and block booking-slot impersonation — see the comments in that file.

If you discover a security issue, please open a private report rather than a public issue.

## Legal

- [Terms & Conditions](src/components/Terms.tsx) and [Privacy Policy](src/components/Privacy.tsx) are available in-app via the footer on every page, and must be accepted before a booking can be confirmed.
- Licensed under the MIT License — see [`LICENSE`](LICENSE).

## License

MIT License. See [`LICENSE`](LICENSE) for details.
