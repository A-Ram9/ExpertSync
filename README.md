# ExpertSync

ExpertSync is a premium, real-time consultation booking platform designed to bridge the gap between industry experts and clients. Built with a focus on speed, reliability, and security, it provides a seamless interface for managing professional sessions.

## Features

- **Live Availability**: Real-time synchronization of booking slots ensures you never encounter double-bookings.
- **Secure Authentication**: Integrated with industry-standard authentication for user data protection.
- **Professional Directory**: Browse a curated list of experts across various categories.
- **Client Ledger**: Keep track of all your past and upcoming sessions in one organized place.
- **Responsive Design**: A carefully crafted UI that looks great on any device, from mobile to ultra-wide desktops.

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
   git clone https://github.com/your-username/expertsync.git
   cd expertsync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase configuration details. Use `.env.example` as a template.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

The project uses a custom server-side setup for optimized performance and API routing.

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs TypeScript type checks.

## License

MIT License. See `LICENSE` for more details.
