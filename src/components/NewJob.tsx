import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Job } from '../types/Job';
import { generateNextJobId } from '../utils/jobIdGenerator';

interface NewJobProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewJob: React.FC<NewJobProps> = ({ isOpen, onClose }) => {
  const [job, setJob] = useState<Omit<Job, 'id'>>({
    date: '',
    jobId: '',
    netProfit: 0,
    expenses: 0,
    mileage: 0,
    receipts: [],
    paymentMethod: 'cash',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      generateNextJobId()
        .then(nextJobId => {
          console.log('Generated job ID:', nextJobId);
          setJob(prevJob => ({ ...prevJob, jobId: nextJobId }));
        })
        .catch(err => {
          console.error('Error generating job ID:', err);
          setError('Failed to generate job ID. Please try again.');
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await addDoc(collection(db, 'jobs'), job);
      onClose();
    } catch (error) {
      console.error('Error adding job: ', error);
      setError('Failed to add job. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-zinc-800 bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl text-white font-bold mb-4">New Job</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 text-gray-200">Date</label>
            <input
              type="date"
              id="date"
              value={job.date}
              onChange={(e) => setJob({ ...job, date: e.target.value })}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobId" className="block mb-2 text-gray-200">Job ID</label>
            <input
              type="text"
              id="jobId"
              value={job.jobId}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="netProfit" className="block mb-2 text-gray-200">Net Profit</label>
            <input
              type="number"
              id="netProfit"
              value={job.netProfit}
              onChange={(e) => setJob({ ...job, netProfit: parseFloat(e.target.value) })}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expenses" className="block mb-2 text-gray-200">Expenses</label>
            <input
              type="number"
              id="expenses"
              value={job.expenses}
              onChange={(e) => setJob({ ...job, expenses: parseFloat(e.target.value) })}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mileage" className="block mb-2 text-gray-200">Mileage</label>
            <input
              type="number"
              id="mileage"
              value={job.mileage}
              onChange={(e) => setJob({ ...job, mileage: parseFloat(e.target.value) })}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block mb-2 text-gray-200">Payment Method</label>
            <select
              id="paymentMethod"
              value={job.paymentMethod}
              onChange={(e) => setJob({ ...job, paymentMethod: e.target.value as Job['paymentMethod'] })}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Add Job
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewJob;