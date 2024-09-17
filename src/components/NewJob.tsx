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
  const initialState: Omit<Job, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    jobId: '',
    customerName: '',
    customerNumber: '',
    customerEmail: '',
    customerAddress: '',
    netProfit: 0,
    mileage: 0,
    paymentMethod: 'cash',
    notes: '',
  };

  const [job, setJob] = useState<Omit<Job, 'id'>>(initialState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      generateNextJobId()
        .then(nextJobId => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob(prev => ({
      ...prev,
      [name]: name === 'netProfit' || name === 'mileage' ? parseFloat(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="bg-zinc-200 bg-opacity-60 p-8 rounded-lg backdrop-blur-sm mx-2 shadow-lg max-w-4xl w-full">
    <h2 className="text-2xl text-black font-bold mb-4">New Job</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block mb-2 text-gray-800 font-bold">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={job.date}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="jobId" className="block mb-2 text-gray-800 font-bold">Job ID</label>
          <input
            type="text"
            id="jobId"
            value={job.jobId}
            readOnly
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
          />
        </div>
        <div>
          <label htmlFor="customerName" className="block mb-2 text-gray-800 font-bold">Customer Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={job.customerName}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="customerNumber" className="block mb-2 text-gray-800 font-bold">Customer Number</label>
          <input
            type="tel"
            id="customerNumber"
            name="customerNumber"
            value={job.customerNumber}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="customerEmail" className="block mb-2 text-gray-800 font-bold">Customer Email</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={job.customerEmail}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="customerAddress" className="block mb-2 text-gray-800 font-bold">Customer Address</label>
          <input
            type="text"
            id="customerAddress"
            name="customerAddress"
            value={job.customerAddress}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="netProfit" className="block mb-2 text-gray-800 font-bold">Net Profit</label>
          <input
            type="number"
            id="netProfit"
            name="netProfit"
            value={job.netProfit}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="mileage" className="block mb-2 text-gray-800 font-bold">Mileage</label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={job.mileage}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block mb-2 text-gray-800 font-bold">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={job.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            required
          >
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-span-2">
          <label htmlFor="notes" className="block mb-2 text-gray-800 font-bold">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={job.notes}
            onChange={handleInputChange}
            className="w-full p-2 bg-zinc-100 text-gray-800 border rounded"
            rows={4}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Job
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default NewJob;