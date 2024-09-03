import React, { useState } from 'react';
import { Job } from '../types/Job';
import { Settings, Trash2, Save, X } from 'lucide-react';

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onClose, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({
      ...prev,
      [name]: name === 'netProfit' || name === 'expenses' || name === 'mileage' ? parseFloat(value) : value
    }));
  };

  const handleSave = () => {
    onEdit(editedJob);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedJob(job);
    setIsEditing(false);
  };

  const calculateGrossIncome = (netProfit: number, expenses: number) => {
    return netProfit - expenses;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Job Details</h2>
          <div>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
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
            <p className="font-semibold">Date:</p>
            {isEditing ? (
              <input
                type="date"
                name="date"
                value={formatDate(editedJob.date)}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            ) : (
              <p>{new Date(job.date).toLocaleDateString()}</p>
            )}
          </div>
          <div>
            <p className="font-semibold">Job ID:</p>
            <p>{job.jobId}</p>
          </div>
          <div>
            <p className="font-semibold">Net Profit:</p>
            {isEditing ? (
              <input
                type="number"
                name="netProfit"
                value={editedJob.netProfit}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            ) : (
              <p>${job.netProfit.toFixed(2)}</p>
            )}
          </div>
          <div>
            <p className="font-semibold">Expenses:</p>
            {isEditing ? (
              <input
                type="number"
                name="expenses"
                value={editedJob.expenses}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            ) : (
              <p>${job.expenses.toFixed(2)}</p>
            )}
          </div>
          <div>
            <p className="font-semibold">Gross Income:</p>
            <p>${calculateGrossIncome(editedJob.netProfit, editedJob.expenses).toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Mileage:</p>
            {isEditing ? (
              <input
                type="number"
                name="mileage"
                value={editedJob.mileage}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            ) : (
              <p>{job.mileage}</p>
            )}
          </div>
          <div>
            <p className="font-semibold">Payment Method:</p>
            {isEditing ? (
              <select
                name="paymentMethod"
                value={editedJob.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
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
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default JobDetails;