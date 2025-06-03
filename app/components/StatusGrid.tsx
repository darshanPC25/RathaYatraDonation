'use client';

import React, { useState } from 'react';
import ResetModal from './ResetModal';

interface Donation {
  block: string;
  floor: string;
  qtr: string;
  amount: number;
  paymentMode: string;
}

interface StatusGridProps {
  selectedBlock: string;
  donations: Donation[];
  onDonationReset: () => void;
}

const StatusGrid: React.FC<StatusGridProps> = ({ selectedBlock, donations, onDonationReset }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ floor: string; qtr: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFloorCount = (block: string) => {
    return (block === 'B' || block === 'C') ? 9 : 11;
  };

  const quarters = ['Qtr 1', 'Qtr 2', 'Qtr 3', 'Qtr 4', 'Qtr 5', 'Qtr 6'];
  const floors = Array.from(
    { length: getFloorCount(selectedBlock) },
    (_, i) => (i + 1).toString()
  );

  const hasDonation = (floor: string, qtr: string) => {
    return donations.some(
      (donation) => donation.floor === floor && donation.qtr === qtr
    );
  };

  const getBlockTotal = () => {
    return donations.reduce((total, donation) => total + donation.amount, 0);
  };

  const handleCellClick = (floor: string, qtr: string) => {
    if (hasDonation(floor, qtr)) {
      setSelectedCell({ floor, qtr });
      setShowResetModal(true);
    }
  };

  const handleResetCell = async () => {
    if (!selectedCell) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reset-cell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          block: selectedBlock,
          floor: selectedCell.floor,
          qtr: selectedCell.qtr,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      onDonationReset();
      setShowResetModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Block {selectedBlock} Status
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Total Donations: ₹{getBlockTotal().toLocaleString()}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                {quarters.map((qtr) => (
                  <th
                    key={qtr}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {qtr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {floors.map((floor) => (
                <tr key={floor}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Floor {floor}
                  </td>
                  {quarters.map((qtr) => (
                    <td
                      key={qtr}
                      onClick={() => handleCellClick(floor, qtr)}
                      className={`px-6 py-4 whitespace-nowrap text-sm cursor-pointer ${
                        hasDonation(floor, qtr)
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {hasDonation(floor, qtr) ? 'Donated' : 'No Donation'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ResetModal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          setSelectedCell(null);
        }}
        onReset={handleResetCell}
        title={`Reset Donation for Block ${selectedBlock}, Floor ${selectedCell?.floor}, Quarter ${selectedCell?.qtr}`}
        showPassword={false}
      />
    </div>
  );
};

export default StatusGrid; 