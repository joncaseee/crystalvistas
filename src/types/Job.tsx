// src/types/Job.ts

export interface Job {
  id: string;
  jobId: string;
  date: string;
  customerName: string;
  customerNumber: string;
  customerEmail: string;
  customerAddress: string;
  netProfit: number;
  mileage: number;
  paymentMethod: 'cash' | 'check' | 'card' | 'other';
  notes: string;
}