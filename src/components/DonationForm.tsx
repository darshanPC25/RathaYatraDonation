'use client';

import React, { useState } from 'react';
import { DonationFormData, BLOCKS, QUARTERS, getFloorsForBlock } from '@/types/donation';

export default function DonationForm() {
  const [formData, setFormData] = useState<DonationFormData>({
    block: '',
    floor: 1,
    qtr: 1,
    amount: 0,
    paymentMode: 'offline',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      setMessage('Donation submitted successfully!');
      setFormData({
        block: '',
        floor: 1,
        qtr: 1,
        amount: 0,
        paymentMode: 'offline',
      });
    } catch (error) {
      setMessage('Error submitting donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const getFloorsForBlock = (block: string): number[] => {
    if (block === 'B' || block === 'C') {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    }
    return Array.from({ length: 11 }, (_, i) => i + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Block Selection */}
          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-1">
              Block
            </label>
            <select
              id="block"
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Block</option>
              {BLOCKS.map((block) => (
                <option key={block} value={block}>
                  Block {block}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Selection */}
          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
              Floor
            </label>
            <select
              id="floor"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Floor</option>
              {formData.block && getFloorsForBlock(formData.block).map((floor) => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>

          {/* Quarter Selection */}
          <div>
            <label htmlFor="qtr" className="block text-sm font-medium text-gray-700 mb-1">
              Quarter
            </label>
            <select
              id="qtr"
              value={formData.qtr}
              onChange={(e) => setFormData({ ...formData, qtr: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Quarter</option>
              {QUARTERS.map((qtr) => (
                <option key={qtr} value={qtr}>
                  Quarter {qtr}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter amount"
              required
              min="1"
            />
          </div>

          {/* Payment Mode Selection */}
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode
            </label>
            <select
              id="paymentMode"
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as 'online' | 'offline' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Payment Mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              px-6 py-2.5 rounded-lg text-white font-medium
              ${isSubmitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
              }
              transition-colors duration-200
            `}
          >
            {isSubmitting ? 'Adding...' : 'Add Donation'}
          </button>
        </div>
      </form>
    </div>
  );
} 