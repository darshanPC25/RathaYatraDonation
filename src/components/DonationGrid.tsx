'use client';

import React, { useMemo, useState } from 'react';
import { Donation, BLOCKS, QUARTERS, getFloorsForBlock } from '@/types/donation';
import { useRouter } from 'next/navigation';

interface DonationGridProps {
  donations: Donation[];
  onDonationDeleted: () => void;
}

export default function DonationGrid({ donations = [], onDonationDeleted }: DonationGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ block: string; floor: number; qtr: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const donationsByLocation = useMemo(() => {
    const map = new Map<string, Donation>();
    donations.forEach(donation => {
      if (donation.block && donation.floor && donation.qtr) {
        const key = `${donation.block}-${donation.floor}-${donation.qtr}`;
        map.set(key, donation);
      }
    });
    return map;
  }, [donations]);

  const handleCellClick = (block: string, floor: number, qtr: number) => {
    const key = `${block}-${floor}-${qtr}`;
    const donation = donationsByLocation.get(key);
    if (donation) {
      setSelectedCell({ block, floor, qtr });
      setError(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedCell) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch('/api/donations/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCell),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete donation');
      }

      // Close the dialog and refresh the page
      setSelectedCell(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete donation');
    } finally {
      setIsDeleting(false);
    }
  };

  const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
  const quarters = Array.from({ length: 6 }, (_, i) => i + 1);

  const getFloorsForBlock = (block: string): number[] => {
    if (block === 'B' || block === 'C') {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    }
    return Array.from({ length: 11 }, (_, i) => i + 1);
  };

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        const blockFloors = getFloorsForBlock(block);
        return (
          <div key={block} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center mr-3">
                  {block}
                </span>
                Block {block}
              </h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50">Floor</th>
                    {quarters.map((qtr) => (
                      <th key={qtr} className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 bg-gray-50">
                        Qtr {qtr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {blockFloors.map((floor) => (
                    <tr key={floor} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {floor}
                      </td>
                      {quarters.map((qtr) => {
                        const key = `${block}-${floor}-${qtr}`;
                        const donation = donationsByLocation.get(key);
                        return (
                          <td
                            key={qtr}
                            onClick={() => handleCellClick(block, floor, qtr)}
                            className={`
                              whitespace-nowrap px-3 py-4 text-sm cursor-pointer transition-all duration-200
                              ${donation 
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md' 
                                : 'bg-gray-50 hover:bg-gray-100'
                              }
                            `}
                          >
                            {donation ? (
                              <div className="text-center">
                                <div className="font-semibold text-green-700">
                                  ₹{donation.amount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {donation.paymentMode}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-400">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Dialog */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Donation
              </h3>
              <button
                onClick={() => {
                  setSelectedCell(null);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the donation for Block {selectedCell.block}, Floor {selectedCell.floor}, Quarter {selectedCell.qtr}?
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedCell(null);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
                  ${isDeleting 
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                `}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 