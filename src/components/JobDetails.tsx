import React, { useState, useMemo } from 'react';
import { Job } from '../types/Job';
import { Settings, Trash2, Save, X, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onClose, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grossProfit = useMemo(() => {
    return editedJob.netProfit - editedJob.expenses;
  }, [editedJob.netProfit, editedJob.expenses]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setError(null);

    const newReceipts = [...editedJob.receipts];

    for (let i = 0; i < files.length && newReceipts.length < 4; i++) {
      const file = files[i];
      const storageRef = ref(storage, `receipts/${editedJob.jobId}_${Date.now()}_${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newReceipts.push(downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload one or more files. Please try again.');
      }
    }

    setEditedJob({ ...editedJob, receipts: newReceipts });
    setUploading(false);
  };

  const handleDeleteReceipt = async (url: string) => {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      const newReceipts = editedJob.receipts.filter(receipt => receipt !== url);
      setEditedJob({ ...editedJob, receipts: newReceipts });
    } catch (error) {
      console.error('Error deleting receipt:', error);
      setError('Failed to delete receipt. Please try again.');
    }
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
              <p>{new Date(job.date).toLocaleDateString()}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Job ID</label>
            <p>{job.jobId}</p>
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
            <label className="block text-gray-700 font-bold mb-2">Expenses</label>
            {isEditing ? (
              <input
                type="number"
                name="expenses"
                value={editedJob.expenses}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>${job.expenses.toFixed(2)}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Gross Profit</label>
            <p className="font-semibold text-green-600">${grossProfit.toFixed(2)}</p>
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
          <label className="block text-gray-700 font-bold mb-2">Receipts</label>
          <div className="flex flex-wrap gap-2">
            {editedJob.receipts.map((receipt, index) => (
              <div key={index} className="relative">
                <img src={receipt} alt={`Receipt ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                {isEditing && (
                  <button
                    onClick={() => handleDeleteReceipt(receipt)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    title="Delete Receipt"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && editedJob.receipts.length < 4 && (
              <label htmlFor="receipts" className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded cursor-pointer">
                <Upload size={24} />
                <input
                  type="file"
                  id="receipts"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
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