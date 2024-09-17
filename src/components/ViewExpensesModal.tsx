import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { X } from 'lucide-react';
import ExpenseDetails from './ExpenseDetails';

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

interface ViewExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewExpensesModal: React.FC<ViewExpensesModalProps> = ({ isOpen, onClose }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (isOpen) {
      const q = query(collection(db, 'expenses'), orderBy('date', 'desc'), orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expensesData: Expense[] = [];
        querySnapshot.forEach((doc) => {
          expensesData.push({ id: doc.id, ...doc.data() } as Expense);
        });
        setExpenses(expensesData);
      });

      return () => unsubscribe();
    }
  }, [isOpen]);

  const handleEdit = async (editedExpense: Expense) => {
    try {
      const { id, ...expenseData } = editedExpense;
      await updateDoc(doc(db, 'expenses', id), expenseData);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error updating expense: ', error);
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteDoc(doc(db, 'expenses', expenseId));
        setSelectedExpense(null);
      } catch (error) {
        console.error('Error deleting expense: ', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">View Expenses</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Store</th>
                <th className="border p-2"># of Items</th>
                <th className="border p-2">Receipt Number</th>
                <th className="border p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedExpense(expense)}
                >
                  <td className="border p-2">{expense.date}</td>
                  <td className="border p-2">{expense.time}</td>
                  <td className="border p-2">{expense.businessName}</td>
                  <td className="border p-2">{expense.items.length}</td>
                  <td className="border p-2">{expense.receiptNumber}</td>
                  <td className="border p-2">${expense.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ViewExpensesModal;