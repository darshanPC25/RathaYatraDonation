'use client';

import React from 'react';

interface BlockTotal {
  block: string;
  total: number;
}

interface TotalsResponse {
  grandTotal: number;
  blockTotals: BlockTotal[];
}

interface GrandTotalProps {
  totals: TotalsResponse;
}

const GrandTotal: React.FC<GrandTotalProps> = ({ totals }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Donation Summary
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Total donations across all blocks
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Grand Total</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              ₹{totals.grandTotal.toLocaleString()}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Block-wise Totals</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {totals.blockTotals.map((block) => (
                  <div
                    key={block.block}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="text-sm font-medium text-gray-500">
                      Block {block.block}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      ₹{block.total.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default GrandTotal; 