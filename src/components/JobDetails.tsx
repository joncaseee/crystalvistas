import React, { useState } from 'react';
import { Job } from '../types/Job';
import { Settings, Trash2, Save, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onClose, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({
      ...prev,
      [name]: name === 'netProfit' || name === 'mileage' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      const jobRef = doc(db, 'jobs', job.id);
      
      // Create a new object with the structure Firestore expects
      const updatedJobData = {
        jobId: editedJob.jobId,
        date: editedJob.date,
        customerName: editedJob.customerName,
        customerNumber: editedJob.customerNumber,
        customerEmail: editedJob.customerEmail,
        netProfit: editedJob.netProfit,
        mileage: editedJob.mileage,
        paymentMethod: editedJob.paymentMethod,
        notes: editedJob.notes,
      };

      await updateDoc(jobRef, updatedJobData);
      onEdit(editedJob);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating job: ', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
      <div className="bg-white bg-opacity-80 text-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full m-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
          <div>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="mr-2 p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  title="Save"
                >
                  <Save size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mr-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Edit Job"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Delete Job"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Date</label>
            {isEditing ? (
              <input
                type="date"
                name="date"
                value={editedJob.date}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{formatDate(job.date)}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Job ID</label>
            <p>{job.jobId}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Customer Name</label>
            {isEditing ? (
              <input
                type="text"
                name="customerName"
                value={editedJob.customerName}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{job.customerName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Customer Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="customerNumber"
                value={editedJob.customerNumber}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{job.customerNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Customer Email</label>
            {isEditing ? (
              <input
                type="email"
                name="customerEmail"
                value={editedJob.customerEmail}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{job.customerEmail}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Net Profit</label>
            {isEditing ? (
              <input
                type="number"
                name="netProfit"
                value={editedJob.netProfit}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>${job.netProfit.toFixed(2)}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Mileage</label>
            {isEditing ? (
              <input
                type="number"
                name="mileage"
                value={editedJob.mileage}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{job.mileage}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Payment Method</label>
            {isEditing ? (
              <select
                name="paymentMethod"
                value={editedJob.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p>{job.paymentMethod}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Notes</label>
          {isEditing ? (
            <textarea
              name="notes"
              value={editedJob.notes}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              rows={4}
            />
          ) : (
            <p>{job.notes}</p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors mr-2"
          >
            Close
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;