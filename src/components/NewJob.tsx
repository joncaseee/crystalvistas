import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Job } from '../types/Job';
import { generateNextJobId } from '../utils/jobIdGenerator';
import { Upload } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJob(prev => ({
      ...prev,
      [name]: name === 'netProfit' || name === 'expenses' || name === 'mileage' ? parseFloat(value) : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setError(null);

    const newReceipts = [...job.receipts];

    for (let i = 0; i < files.length && newReceipts.length < 4; i++) {
      const file = files[i];
      const storageRef = ref(storage, `receipts/${job.jobId}_${Date.now()}_${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newReceipts.push(downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload one or more files. Please try again.');
      }
    }

    setJob({ ...job, receipts: newReceipts });
    setUploading(false);
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
              name="date"
              value={job.date}
              onChange={handleInputChange}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobId" className="block mb-2">Job ID</label>
            <input
              type="text"
              id="jobId"
              value={job.jobId}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="netProfit" className="block mb-2 text-gray-200">Net Profit</label>
            <input
              type="number"
              id="netProfit"
              name="netProfit"
              value={job.netProfit}
              onChange={handleInputChange}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expenses" className="block mb-2 text-gray-200">Expenses</label>
            <input
              type="number"
              id="expenses"
              name="expenses"
              value={job.expenses}
              onChange={handleInputChange}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mileage" className="block mb-2 text-gray-200">Mileage</label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={job.mileage}
              onChange={handleInputChange}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block mb-2 text-gray-200">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={job.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2 bg-zinc-600 text-gray-200 border rounded"
              required
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="receipts" className="block mb-2 text-gray-200">Upload Receipts (Max 4)</label>
            <div className="flex items-center">
              <label htmlFor="receipts" className="cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300">
                <Upload size={24} />
              </label>
              <input
                type="file"
                id="receipts"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading || job.receipts.length >= 4}
              />
              <span className="ml-2 text-gray-200">
                {job.receipts.length} / 4 receipts uploaded
              </span>
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Job'}
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