import React, { useState, useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Plus, X, Upload } from 'lucide-react';

interface ExpenseItem {
  name: string;
  price: number;
}

interface Expense {
  date: string;
  time: string;
  receiptNumber: string;
  businessName: string;
  totalPrice: number;
  items: ExpenseItem[];
  receipts: string[];
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const initialState: Expense = {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    receiptNumber: '',
    businessName: '',
    totalPrice: 0,
    items: [],
    receipts: [],
  };

  const [expense, setExpense] = useState<Expense>(initialState);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setExpense(initialState);
    setNewItemName('');
    setNewItemPrice('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: name === 'totalPrice' ? parseFloat(value) : value
    }));
  };

  const handleAddItem = () => {
    if (newItemName && newItemPrice) {
      const newItem: ExpenseItem = {
        name: newItemName,
        price: parseFloat(newItemPrice),
      };
      setExpense(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        totalPrice: prev.totalPrice + newItem.price,
      }));
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setExpense(prev => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      const updatedTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0);
      return { ...prev, items: updatedItems, totalPrice: updatedTotalPrice };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
  
    setUploading(true);
  
    const newReceipts = [...expense.receipts];
  
    for (let i = 0; i < files.length && newReceipts.length < 4; i++) {
      const file = files[i];
      const storageRef = ref(storage, `receipts/expense_${Date.now()}_${file.name}`);
  
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newReceipts.push(downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  
    setExpense(prev => ({ ...prev, receipts: newReceipts }));
    setUploading(false);
  };

  const handleDeleteReceipt = (url: string) => {
    setExpense(prev => ({
      ...prev,
      receipts: prev.receipts.filter(receipt => receipt !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'expenses'), expense);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding expense: ', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-zinc-200 text-gray-800 bg-opacity-60  backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md w-full m-4">
        <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 text-sm font-bold">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={expense.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block mb-2 text-sm font-bold">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={expense.time}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="receiptNumber" className="block mb-2 text-sm font-bold">Receipt Number</label>
            <input
              type="text"
              id="receiptNumber"
              name="receiptNumber"
              value={expense.receiptNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="businessName" className="block mb-2 text-sm font-bold">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={expense.businessName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold">Items</label>
            <div className="flex mb-6">
              <input
                type="text"
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-grow p-2 border rounded-l"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-24 p-2 border-t border-b border-r"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-500 text-white p-2 mx-4 rounded-full"
              >
                <Plus size={20} />
              </button>
            </div>
            <ul>
              {expense.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{item.name} - ${item.price.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="bg-transparent text-red-500"
                  >
                    <X size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <label htmlFor="totalPrice" className="block mb-2 text-sm font-bold">Total Price</label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={expense.totalPrice}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold">Receipts</label>
            <div className="flex flex-wrap gap-2">
              {expense.receipts.map((receipt, index) => (
                <div key={index} className="relative">
                  <img src={receipt} alt={`Receipt ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleDeleteReceipt(receipt)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    title="Delete Receipt"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {expense.receipts.length < 4 && (
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
                    ref={fileInputRef}
                  />
                </label>
              )}
            </div>
            {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;