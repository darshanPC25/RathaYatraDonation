export type PaymentMode = 'online' | 'offline';

export interface Donation {
  block: string;
  floor: number;
  qtr: number;
  amount: number;
  paymentMode: PaymentMode;
  timestamp?: Date;
}

export interface DonationFormData extends Omit<Donation, 'timestamp'> {}

export interface BlockFloors {
  [key: string]: number[];
}

export const BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'] as const;
export const QUARTERS = [1, 2, 3, 4, 5, 6] as const;

export const getFloorsForBlock = (block: string): number[] => {
  if (block === 'B' || block === 'C') {
    return Array.from({ length: 9 }, (_, i) => i + 1);
  }
  return Array.from({ length: 11 }, (_, i) => i + 1);
}; 