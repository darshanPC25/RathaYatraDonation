'use client';

import DonationForm from '@/components/DonationForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Submit Donation
          </h2>
          <DonationForm />
        </div>
      </div>
    </main>
  );
} 