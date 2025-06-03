'use client';

import React, { useState, useEffect } from 'react';
import StatusGrid from './StatusGrid';
import GrandTotal from './GrandTotal';
import ResetModal from './ResetModal';

interface Donation {
  block: string;
  floor: string;
  qtr: string;
  amount: number;
  paymentMode: string;
}

interface BlockTotal {
  block: string;
  total: number;
}

interface TotalsResponse {
  grandTotal: number;
  blockTotals: BlockTotal[];
}

const Dashboard: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [totals, setTotals] = useState<TotalsResponse>({ grandTotal: 0, blockTotals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showBlockResetModal, setShowBlockResetModal] = useState(false);

  const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];

  const fetchTotals = async () => {
    try {
      const response = await fetch('/api/totals');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch totals' }));
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setTotals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load totals');
      console.error('Error fetching totals:', err);
    }
  };

  const fetchDonations = async () => {
    if (!selectedBlock) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/status?block=${selectedBlock}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch donations' }));
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setDonations(data.donations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load donations');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [selectedBlock]);

  const handleResetAll = async (password: string) => {
    const response = await fetch('/api/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await fetchTotals();
    if (selectedBlock) {
      await fetchDonations();
    }
  };

  const handleResetBlock = async () => {
    const response = await fetch('/api/reset-block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ block: selectedBlock }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await fetchTotals();
    await fetchDonations();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donation Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowBlockResetModal(true)}
            disabled={!selectedBlock}
            className={`px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md ${
              !selectedBlock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Reset Block
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Reset All
          </button>
        </div>
      </div>
      
      <GrandTotal totals={totals} />
      
      <div className="mt-8">
        <div className="mb-4">
          <label htmlFor="block" className="block text-sm font-medium text-gray-700">
            Select Block
          </label>
          <select
            id="block"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a block</option>
            {blocks.map((block) => (
              <option key={block} value={block}>
                Block {block}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : selectedBlock ? (
          <StatusGrid
            selectedBlock={selectedBlock}
            donations={donations}
            onDonationReset={() => {
              fetchDonations();
              fetchTotals();
            }}
          />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Please select a block to view donation status
          </div>
        )}
      </div>

      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleResetAll}
        title="Reset All Donations"
        showPassword={true}
      />

      <ResetModal
        isOpen={showBlockResetModal}
        onClose={() => setShowBlockResetModal(false)}
        onReset={handleResetBlock}
        title={`Reset Block ${selectedBlock} Donations`}
        showPassword={false}
      />
    </div>
  );
};

export default Dashboard; 