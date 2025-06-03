'use client';

import React, { useState } from 'react';
import DonationForm from './components/DonationForm';
import Dashboard from './components/Dashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard'>('form');

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  AGV Ratha Yatra Donation
                </h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('form')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'form'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Donation Form
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        {activeTab === 'form' ? <DonationForm /> : <Dashboard />}
      </div>
    </main>
  );
} 