'use client';

import { Donation } from '@/types/donation';

interface PDFDownloadProps {
  donations?: Donation[];
  block?: string;
}

export default function PDFDownload({ donations = [], block }: PDFDownloadProps) {
  return (
    <button
      className="w-full px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
    >
      {block ? `${block} Block` : 'All Donations'}
    </button>
  );
} 