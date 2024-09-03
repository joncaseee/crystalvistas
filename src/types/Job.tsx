// src/types/Job.ts

export interface Job {
  id: string;
  date: string;
  jobId: string;
  netProfit: number;
  expenses: number;
  mileage: number;
  receipts: string[];
  paymentMethod: 'cash' | 'check' | 'card' | 'other';
}