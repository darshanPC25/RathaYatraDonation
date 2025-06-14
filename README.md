# Ratha Yatra Donations - AGV Colony

A Next.js web application for managing Ratha Yatra donations from residents of AGV Colony. The application allows residents to submit donation entries and visually track donation status for each flat in the colony.

## Features

- Responsive donation form with dynamic floor options based on block selection
- Visual grid display of donation status for each flat
- Real-time total donation amount display
- MongoDB integration for data persistence
- Modern UI with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- SWR for data fetching

## Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd donation3
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── DonationForm.tsx
│   └── DonationGrid.tsx
├── lib/               # Utility functions
│   └── mongodb.ts     # MongoDB connection
└── types/            # TypeScript types
    └── donation.ts   # Donation-related types
```

## Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add your MongoDB connection string to the environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 