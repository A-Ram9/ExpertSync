# ExpertSync

ExpertSync is a premium, real-time consultation booking platform designed to bridge the gap between industry experts and clients. Built with a focus on speed, reliability, and security, it provides a seamless interface for managing professional sessions.

## Features

- **Live Availability**: Real-time synchronization of booking slots ensures you never encounter double-bookings.
- **Secure Authentication**: Google Sign-In via Firebase Auth, with all sensitive reads/writes enforced server-side by Firestore Security Rules.
- **Private Client Ledger**: Every user's bookings are visible only to that user — enforced by security rules, not just the UI.
- **Professional Directory**: Browse a curated list of experts across various categories, with live search and filtering.
- **Responsive Design**: A fully responsive UI — including a dedicated mobile navigation menu — that looks great from mobile to ultra-wide desktops.
- **Resilient UI**: A top-level error boundary and themed empty/error/loading states keep the experience graceful when something goes wrong.
- **Legal & Compliance**: Built-in Terms & Conditions and Privacy Policy pages, linked from every page footer and required reading before a booking is confirmed.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend/Database**: Firebase (Firestore, Auth)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Trappod/ExpertSync.git
   cd ExpertSync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration details. Use `.env.example` as a template.

4. Deploy the Firestore security rules in `firestore.rules` to your Firebase project (`firebase deploy --only firestore:rules`) before going live — they are what actually enforce the access control described below.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development

The project uses a custom server-side setup for optimized performance and API routing.

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production (output is code-split into `vendor`/`firebase`/app chunks for faster loads).
- `npm run preview`: Serves the production build locally.
- `npm run lint`: Runs TypeScript type checks across the whole project.
- `npm run clean`: Removes the `dist/` build output.

## Security

Security is enforced at the data layer, not just in the UI:

- **Owner-only bookings**: `firestore.rules` restricts `read`/`list`/`create` on the `bookings` collection to the signed-in user whose verified auth email matches the booking — no user can view or enumerate another user's bookings, phone number, or notes.
- **No impersonation**: Booking a slot requires the request to be signed in and to mark `bookedBy` as the caller's own auth email; the client cannot book on behalf of someone else.
- **Admin-gated writes**: The expert directory and slot inventory can only be written by the designated admin account; everyone else gets read-only access.
- **Least-privilege client code**: The client only ever queries its own data — there is no arbitrary "look up any booking by email" feature, closing off what would otherwise be a data-enumeration risk.
- Run `npm audit` periodically and apply `npm audit fix` to keep dependencies patched.

If you discover a security issue, please open a private report rather than a public issue.

## Legal

- [Terms & Conditions](src/components/Terms.tsx) and [Privacy Policy](src/components/Privacy.tsx) are available in-app via the footer on every page, and must be accepted before a booking can be confirmed.
- Licensed under the MIT License — see [`LICENSE`](LICENSE).

## License

MIT License. See [`LICENSE`](LICENSE) for details.
