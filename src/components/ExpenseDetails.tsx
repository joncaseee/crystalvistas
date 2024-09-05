import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { X, Settings, Save, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

interface ExpenseItem {
  name: string;
  price: number;
}

interface Expense {
  id: string;
  date: string;
  time: string;
  receiptNumber: string;
  businessName: string;
  totalPrice: number;
  items: ExpenseItem[];
  receipts: string[];
}

interface ExpenseDetailsProps {
  expense: Expense;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ expense, onClose, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState<Expense>(expense);
  const [uploading, setUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedExpense(prev => ({
      ...prev,
      [name]: name === 'totalPrice' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      const expenseRef = doc(db, 'expenses', expense.id);
      const { id, ...expenseData } = editedExpense;
      await updateDoc(expenseRef, expenseData);
      onEdit(editedExpense);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const newReceipts = [...editedExpense.receipts];

    for (let i = 0; i < files.length && newReceipts.length < 4; i++) {
      const file = files[i];
      const storageRef = ref(storage, `receipts/${editedExpense.id}_${Date.now()}_${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newReceipts.push(downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setEditedExpense({ ...editedExpense, receipts: newReceipts });
    setUploading(false);
  };

  const handleDeleteReceipt = async (url: string) => {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      const newReceipts = editedExpense.receipts.filter(receipt => receipt !== url);
      setEditedExpense({ ...editedExpense, receipts: newReceipts });
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
      <div className="bg-white bg-opacity-80 text-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full m-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Expense Details</h2>
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
                  title="Edit Expense"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Delete Expense"
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
                value={editedExpense.date}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{new Date(expense.date).toLocaleDateString()}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Time</label>
            {isEditing ? (
              <input
                type="time"
                name="time"
                value={editedExpense.time}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{expense.time}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Receipt Number</label>
            {isEditing ? (
              <input
                type="text"
                name="receiptNumber"
                value={editedExpense.receiptNumber}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{expense.receiptNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Business Name</label>
            {isEditing ? (
              <input
                type="text"
                name="businessName"
                value={editedExpense.businessName}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>{expense.businessName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Total Price</label>
            {isEditing ? (
              <input
                type="number"
                name="totalPrice"
                value={editedExpense.totalPrice}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 text-gray-800 border rounded"
              />
            ) : (
              <p>${expense.totalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Items</label>
          <ul>
            {expense.items.map((item, index) => (
              <li key={index} className="mb-1">
                {item.name}: ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Receipts</label>
          <div className="flex flex-wrap gap-2">
            {editedExpense.receipts.map((receipt, index) => (
              <div key={index} className="relative">
                {imageErrors[index] ? (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                ) : (
                  <img 
                    src={receipt} 
                    alt={`Receipt ${index + 1}`} 
                    className="w-20 h-20 object-cover rounded" 
                    onError={() => handleImageError(index)}
                  />
                )}
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
            {isEditing && editedExpense.receipts.length < 4 && (
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

export default ExpenseDetails;